
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Star, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TopFiller {
  rank: number;
  name: string;
  formsFilled: number;
  points: number;
  badges: number;
}

interface TopPoster {
  rank: number;
  name: string;
  formsPosted: number;
  totalResponses: number;
  avgRating: number;
}

const Leaderboard = () => {
  const [topFillers, setTopFillers] = useState<TopFiller[]>([]);
  const [topPosters, setTopPosters] = useState<TopPoster[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);

      // Get top form fillers
      const { data: fillersData, error: fillersError } = await supabase
        .from('form_fills')
        .select(`
          user_id,
          profiles!inner(name)
        `);

      if (fillersError) throw fillersError;

      // Process fillers data
      const fillerStats = fillersData?.reduce((acc: any, fill) => {
        const userId = fill.user_id;
        const name = fill.profiles?.name || 'Anonymous';
        
        if (!acc[userId]) {
          acc[userId] = { name, formsFilled: 0, points: 0, badges: 0 };
        }
        acc[userId].formsFilled += 1;
        acc[userId].points += 5; // 5 points per form filled
        return acc;
      }, {}) || {};

      // Get badges for top fillers
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('user_id');

      const badgeCounts = badgesData?.reduce((acc: any, badge) => {
        acc[badge.user_id] = (acc[badge.user_id] || 0) + 1;
        return acc;
      }, {}) || {};

      // Convert to array and sort
      const fillersArray = Object.entries(fillerStats)
        .map(([userId, stats]: [string, any], index) => ({
          rank: index + 1,
          name: stats.name,
          formsFilled: stats.formsFilled,
          points: stats.points,
          badges: badgeCounts[userId] || 0
        }))
        .sort((a, b) => b.formsFilled - a.formsFilled)
        .slice(0, 8)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      setTopFillers(fillersArray);

      // Get top form posters
      const { data: postersData, error: postersError } = await supabase
        .from('forms')
        .select(`
          user_id,
          profiles!inner(name)
        `);

      if (postersError) throw postersError;

      // Process posters data
      const posterStats = postersData?.reduce((acc: any, form) => {
        const userId = form.user_id;
        const name = form.profiles?.name || 'Anonymous';
        
        if (!acc[userId]) {
          acc[userId] = { name, formsPosted: 0, totalResponses: 0, avgRating: 0 };
        }
        acc[userId].formsPosted += 1;
        return acc;
      }, {}) || {};

      // Get response counts and ratings for each poster
      for (const userId of Object.keys(posterStats)) {
        const { data: userForms } = await supabase
          .from('forms')
          .select('id')
          .eq('user_id', userId);

        if (userForms && userForms.length > 0) {
          const formIds = userForms.map(f => f.id);
          
          const { data: responses } = await supabase
            .from('form_fills')
            .select('rating')
            .in('form_id', formIds);

          const totalResponses = responses?.length || 0;
          const ratingsWithValues = responses?.filter(r => r.rating !== null) || [];
          const avgRating = ratingsWithValues.length > 0 
            ? ratingsWithValues.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsWithValues.length 
            : 0;

          posterStats[userId].totalResponses = totalResponses;
          posterStats[userId].avgRating = Number(avgRating.toFixed(1));
        }
      }

      // Convert to array and sort
      const postersArray = Object.entries(posterStats)
        .map(([userId, stats]: [string, any], index) => ({
          rank: index + 1,
          name: stats.name,
          formsPosted: stats.formsPosted,
          totalResponses: stats.totalResponses,
          avgRating: stats.avgRating
        }))
        .sort((a, b) => b.formsPosted - a.formsPosted)
        .slice(0, 8)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      setTopPosters(postersArray);

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you rank among the SurvEase community</p>
      </div>

      <Tabs defaultValue="fillers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fillers" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Top Form Fillers
          </TabsTrigger>
          <TabsTrigger value="posters" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Top Form Posters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fillers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Most Active Form Fillers
              </CardTitle>
              <CardDescription>
                Users ranked by number of forms completed and engagement points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topFillers.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No form fillers yet. Be the first to fill a form!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topFillers.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(user.rank)} text-white font-bold`}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{user.formsFilled} forms filled</span>
                          <span>{user.points} points</span>
                          <Badge variant="secondary">{user.badges} badges</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Most Active Form Posters
              </CardTitle>
              <CardDescription>
                Users ranked by forms posted, responses received, and average ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topPosters.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No form posters yet. Be the first to post a form!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topPosters.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(user.rank)} text-white font-bold`}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{user.formsPosted} forms posted</span>
                          <span>{user.totalResponses} responses</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{user.avgRating > 0 ? user.avgRating : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Showcase - Only show if there are actual users */}
      {(topFillers.length > 0 || topPosters.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Latest badges and milestones reached by community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {topFillers.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{topFillers[0]?.name}</p>
                      <p className="text-sm text-gray-600">Top Form Filler</p>
                    </div>
                  </div>
                </div>
              )}
              {topPosters.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{topPosters[0]?.name}</p>
                      <p className="text-sm text-gray-600">Top Form Poster</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
