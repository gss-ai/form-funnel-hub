
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Star, MessageCircle, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PostedForm {
  id: string;
  title: string;
  description: string;
  google_form_url: string;
  tags: string[];
  created_at: string;
  expire_at: string | null;
  fillCount: number;
  averageRating: number;
  comments: Array<{
    id: string;
    comment: string;
    rating: number;
    created_at: string;
    profiles: { name: string } | null;
  }>;
}

const PostedForms = () => {
  const [postedForms, setPostedForms] = useState<PostedForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchPostedForms = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      
      // Get forms posted by the current user
      const { data: forms, error: formsError } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (formsError) throw formsError;

      if (!forms || forms.length === 0) {
        setPostedForms([]);
        return;
      }

      // Get form fills with profiles for each form
      const formsWithStats = await Promise.all(
        forms.map(async (form) => {
          const { data: fills, error: fillsError } = await supabase
            .from('form_fills')
            .select(`
              id,
              comment,
              rating,
              created_at,
              user_id
            `)
            .eq('form_id', form.id);

          if (fillsError) {
            console.warn('Error fetching fills for form', form.id, ':', fillsError);
          }

          // Get profiles for the users who filled the form
          const fillsWithProfiles = await Promise.all(
            (fills || []).map(async (fill) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', fill.user_id)
                .maybeSingle();

              return {
                ...fill,
                profiles: profile || { name: 'Anonymous User' }
              };
            })
          );

          const fillCount = fills?.length || 0;
          const ratingsWithValues = fills?.filter(f => f.rating !== null) || [];
          const averageRating = ratingsWithValues.length > 0 
            ? ratingsWithValues.reduce((sum, f) => sum + (f.rating || 0), 0) / ratingsWithValues.length 
            : 0;

          return {
            ...form,
            fillCount,
            averageRating,
            comments: fillsWithProfiles.filter(f => f.comment)
          };
        })
      );

      setPostedForms(formsWithStats);
    } catch (error) {
      console.error('Error fetching posted forms:', error);
      toast.error('Failed to load posted forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedForms();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (postedForms.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">You haven't posted any forms yet.</p>
          <Button 
            onClick={() => window.location.href = '/post-form'}
            className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Post Your First Form
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {postedForms.map((form) => (
        <Card key={form.id} className="border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription className="mt-2">{form.description}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(form.google_form_url, '_blank')}
                className="ml-4"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Form
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tags */}
              {form.tags && form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-emerald-600">{form.fillCount}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-yellow-600">
                      {form.averageRating > 0 ? form.averageRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{form.comments.length}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              {/* Comments Section */}
              {form.comments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Comments ({form.comments.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {form.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{comment.profiles?.name || 'Anonymous'}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-yellow-600">{comment.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted {new Date(form.created_at).toLocaleDateString()}
                </div>
                {form.expire_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Expires {new Date(form.expire_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostedForms;
