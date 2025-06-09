
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, Star, Award, PlusCircle, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const stats = [
    {
      title: 'Forms Posted',
      value: user.formsPosted,
      icon: <PlusCircle className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Forms Filled',
      value: user.formsFilled,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'green'
    },
    {
      title: 'Ratings Given',
      value: user.totalRatings,
      icon: <Star className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      title: 'Badges Earned',
      value: user.badges.length,
      icon: <Award className="w-5 h-5" />,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your SurvEase activity overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Badges Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Your Badges
            </CardTitle>
            <CardDescription>Achievements you've unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions on SurvEase</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>What would you like to do today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow">
              <PlusCircle className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-900">Post New Form</h3>
              <p className="text-sm text-blue-700">Share a Google Form with the community</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-shadow">
              <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-green-900">Browse Forms</h3>
              <p className="text-sm text-green-700">Discover and fill interesting forms</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 cursor-pointer hover:shadow-md transition-shadow">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-900">View Leaderboard</h3>
              <p className="text-sm text-purple-700">See how you rank among other users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
