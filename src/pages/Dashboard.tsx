
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, Star, Award, PlusCircle, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import RecentActivity from '@/components/RecentActivity';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Please log in to view your dashboard</h2>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[400px] text-foreground">Loading...</div>;
  }

  const stats = [
    {
      title: 'Forms Posted',
      value: user.formsPosted,
      icon: <PlusCircle className="w-5 h-5" />,
      color: 'blue' as const
    },
    {
      title: 'Forms Filled',
      value: user.formsFilled,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'green' as const
    },
    {
      title: 'Ratings Given',
      value: user.totalRatings,
      icon: <Star className="w-5 h-5" />,
      color: 'yellow' as const
    },
    {
      title: 'Badges Earned',
      value: user.badges.length,
      icon: <Award className="w-5 h-5" />,
      color: 'purple' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Here's your SurvEase activity overview</p>
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
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Award className="w-5 h-5 text-primary" />
              Your Badges
            </CardTitle>
            <CardDescription>Achievements you've unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.badges.length > 0 ? (
                user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {badge}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No badges earned yet. Start filling forms to unlock achievements!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          <CardDescription>What would you like to do today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div 
              onClick={() => navigate('/post-form')}
              className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg border border-primary/20 cursor-pointer hover:shadow-md transition-all hover:border-primary/40"
            >
              <PlusCircle className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-card-foreground">Post New Form</h3>
              <p className="text-sm text-muted-foreground">Share a Google Form with the community</p>
            </div>
            <div 
              onClick={() => navigate('/feed')}
              className="p-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg border border-accent/20 cursor-pointer hover:shadow-md transition-all hover:border-accent/40"
            >
              <BarChart3 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-card-foreground">Browse Forms</h3>
              <p className="text-sm text-muted-foreground">Discover and fill interesting forms</p>
            </div>
            <div 
              onClick={() => navigate('/leaderboard')}
              className="p-6 bg-gradient-to-br from-secondary to-muted rounded-lg border border-border cursor-pointer hover:shadow-md transition-all hover:border-primary/20"
            >
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-card-foreground">View Leaderboard</h3>
              <p className="text-sm text-muted-foreground">See how you rank among other users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
