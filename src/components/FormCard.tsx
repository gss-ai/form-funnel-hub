
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, User, ExternalLink, Info, Copy } from 'lucide-react';
import RatingDialog from './RatingDialog';
import FormDetailsModal from './FormDetailsModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FormCardProps {
  form: {
    id: string;
    title: string;
    description: string;
    creator: string;
    tags: string[];
    createdAt: string;
    expiresAt: string | null;
    ratings: number;
    totalRatings: number;
    formUrl: string;
    qrCode: string;
  };
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const [showRating, setShowRating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { session } = useAuth();

  const isExpired = form.expiresAt ? new Date(form.expiresAt) < new Date() : false;

  const handleFillForm = async () => {
    if (!session?.user) {
      toast.error('Please log in to fill forms');
      return;
    }

    setShowDetails(false);
    
    // Record the form fill in the database
    try {
      const { error } = await supabase
        .from('form_fills')
        .insert({
          form_id: form.id,
          user_id: session.user.id,
          rating: null,
          comment: null
        });

      if (error) {
        console.error('Error recording form fill:', error);
        toast.error('Failed to record form activity');
      } else {
        console.log('Form fill recorded successfully');
        toast.success('Form activity recorded!');
      }
    } catch (error) {
      console.error('Error recording form fill:', error);
    }

    // Open the form in a new tab
    window.open(form.formUrl, '_blank');
    
    // Show rating dialog after a delay
    setTimeout(() => {
      setShowRating(true);
    }, 1000);
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(form.formUrl);
    toast.success('Form URL copied to clipboard!');
  };

  return (
    <>
      <Card className="h-full border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg leading-tight">{form.title}</CardTitle>
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm line-clamp-2">
            {form.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{form.creator}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(form.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {form.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                  {tag}
                </Badge>
              ))}
              {form.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{form.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {form.ratings > 0 ? form.ratings.toFixed(1) : 'No ratings'}
              </span>
              {form.totalRatings > 0 && (
                <span className="text-xs text-slate-500">
                  ({form.totalRatings})
                </span>
              )}
            </div>
            {form.expiresAt && !isExpired && (
              <span className="text-xs text-slate-500">
                Expires {new Date(form.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowDetails}
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-2" />
              Details
            </Button>
            <Button
              onClick={handleFillForm}
              disabled={isExpired}
              size="sm"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Fill Form
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyUrl}
            className="w-full text-slate-600 hover:text-slate-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Form URL
          </Button>
        </CardContent>
      </Card>

      <RatingDialog
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        formId={form.id}
        formTitle={form.title}
      />

      <FormDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onFillForm={handleFillForm}
        form={form}
      />
    </>
  );
};

export default FormCard;
