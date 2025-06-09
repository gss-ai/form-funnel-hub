
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Calendar, User, ExternalLink, QrCode, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeDisplay from './QRCodeDisplay';
import RatingDialog from './RatingDialog';

interface Form {
  id: string;
  title: string;
  description: string;
  creator: string;
  tags: string[];
  createdAt: string;
  expiresAt: string;
  ratings: number;
  totalRatings: number;
  formUrl: string;
  qrCode: string;
}

interface FormCardProps {
  form: Form;
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const handleFillForm = () => {
    window.open(form.formUrl, '_blank');
  };

  const handleMarkAsFilled = () => {
    setIsFilled(true);
    setShowRating(true);
    toast.success('Form marked as completed!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiry = new Date(form.expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry();

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{form.title}</CardTitle>
              <CardDescription className="mt-2 line-clamp-3">{form.description}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Code</DialogTitle>
                  <DialogDescription>Scan to access the form</DialogDescription>
                </DialogHeader>
                <QRCodeDisplay formUrl={form.formUrl} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {form.creator}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Posted {formatDate(form.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{form.ratings} ({form.totalRatings} ratings)</span>
              </div>
            </div>

            {/* Expiry Warning */}
            {daysLeft <= 7 && daysLeft > 0 && (
              <div className="p-2 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-700">
                  ⚠️ Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!isFilled ? (
                <>
                  <Button 
                    onClick={handleFillForm}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Fill Form
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleMarkAsFilled}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Filled
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showRating && (
        <RatingDialog 
          isOpen={showRating}
          onClose={() => setShowRating(false)}
          formTitle={form.title}
          formId={form.id}
        />
      )}
    </>
  );
};

export default FormCard;
