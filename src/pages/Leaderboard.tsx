
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Star, FileText } from 'lucide-react';

const Leaderboard = () => {
  const topFillers = [
    { rank: 1, name: 'Sarah Chen', formsFilled: 156, points: 780, badges: 8 },
    { rank: 2, name: 'Mike Rodriguez', formsFilled: 142, points: 710, badges: 6 },
    { rank: 3, name: 'Emily Johnson', formsFilled: 138, points: 690, badges: 7 },
    { rank: 4, name: 'David Kim', formsFilled: 125, points: 625, badges: 5 },
    { rank: 5, name: 'Lisa Wang', formsFilled: 118, points: 590, badges: 4 },
    { rank: 6, name: 'Alex Thompson', formsFilled: 112, points: 560, badges: 6 },
    { rank: 7, name: 'Maria Garcia', formsFilled: 108, points: 540, badges: 5 },
    { rank: 8, name: 'James Wilson', formsFilled: 95, points: 475, badges: 3 },
  ];

  const topPosters = [
    { rank: 1, name: 'Dr. Jennifer Liu', formsPosted: 45, totalResponses: 2340, avgRating: 4.8 },
    { rank: 2, name: 'Research Team Alpha', formsPosted: 38, totalResponses: 1950, avgRating: 4.6 },
    { rank: 3, name: 'Community Manager', formsPosted: 32, totalResponses: 1680, avgRating: 4.7 },
    { rank: 4, name: 'Product Team Beta', formsPosted: 28, totalResponses: 1420, avgRating: 4.5 },
    { rank: 5, name: 'UX Research Lab', formsPosted: 24, totalResponses: 1200, avgRating: 4.9 },
    { rank: 6, name: 'Marketing Insights', formsPosted: 22, totalResponses: 1100, avgRating: 4.4 },
    { rank: 7, name: 'Customer Success', formsPosted: 19, totalResponses: 950, avgRating: 4.6 },
    { rank: 8, name: 'Event Organizers', formsPosted: 16, totalResponses: 800, avgRating: 4.3 },
  ];

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
                          <span>{user.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Showcase */}
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
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-gray-600">Earned "Century Club" badge</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Dr. Jennifer Liu</p>
                  <p className="text-sm text-gray-600">Reached 5-star average rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
