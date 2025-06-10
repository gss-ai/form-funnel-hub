
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  id: string;
  type: 'filled' | 'posted';
  title: string;
  time: string;
  icon: React.ReactNode;
  color: string;
  rating?: number;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchRecentActivity = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);

      // Get recent form fills by user
      const { data: formFills, error: fillsError } = await supabase
        .from('form_fills')
        .select(`
          id,
          rating,
          created_at,
          forms (title)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (fillsError) {
        console.error('Error fetching form fills:', fillsError);
      }

      // Get recent forms posted by user
      const { data: postedForms, error: formsError } = await supabase
        .from('forms')
        .select('id, title, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (formsError) {
        console.error('Error fetching posted forms:', formsError);
      }

      // Combine and format activities
      const allActivities: Activity[] = [];

      // Add form fills
      if (formFills) {
        formFills.forEach((fill) => {
          allActivities.push({
            id: `fill-${fill.id}`,
            type: 'filled',
            title: `Completed "${(fill.forms as any)?.title || 'Unknown Form'}"`,
            time: formatTimeAgo(fill.created_at),
            icon: <FileText className="w-4 h-4" />,
            color: 'green',
            rating: fill.rating || undefined
          });
        });
      }

      // Add posted forms
      if (postedForms) {
        postedForms.forEach((form) => {
          allActivities.push({
            id: `post-${form.id}`,
            type: 'posted',
            title: `Posted "${form.title}"`,
            time: formatTimeAgo(form.created_at),
            icon: <Users className="w-4 h-4" />,
            color: 'blue'
          });
        });
      }

      // Sort by time (most recent first)
      allActivities.sort((a, b) => {
        const timeA = new Date(a.time.includes('ago') ? Date.now() : a.time).getTime();
        const timeB = new Date(b.time.includes('ago') ? Date.now() : b.time).getTime();
        return timeB - timeA;
      });

      setActivities(allActivities.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'green': return 'default';
      case 'yellow': return 'secondary';
      case 'blue': return 'outline';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recent activity found.</p>
        <p className="text-sm text-gray-400 mt-2">
          Start by posting or filling forms to see your activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className={`p-2 rounded-full bg-${activity.color}-100`}>
            <div className={`text-${activity.color}-600`}>
              {activity.icon}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(activity.color)} className="capitalize">
              {activity.type}
            </Badge>
            {activity.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-yellow-600">{activity.rating}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
