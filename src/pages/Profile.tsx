
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Calendar, Award, BarChart3, FileText, Star, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const achievements = [
    { name: 'Early Adopter', description: 'One of the first 100 users', color: 'blue' },
    { name: 'Form Enthusiast', description: 'Filled 20+ forms', color: 'green' },
    { name: 'Community Helper', description: 'Highly rated forms', color: 'purple' },
    { name: 'Consistent Contributor', description: 'Active for 30 days', color: 'orange' }
  ];

  const recentForms = [
    { title: 'Customer Satisfaction Survey', status: 'filled', date: '2 days ago', rating: 5 },
    { title: 'Product Feedback Form', status: 'posted', date: '1 week ago', responses: 23 },
    { title: 'Event Planning Survey', status: 'filled', date: '1 week ago', rating: 4 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.formsPosted}</div>
                  <div className="text-sm text-gray-600">Forms Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.formsFilled}</div>
                  <div className="text-sm text-gray-600">Forms Filled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{user.totalRatings}</div>
                  <div className="text-sm text-gray-600">Ratings Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.badges.length}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your earned badges and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${achievement.color}-400 to-${achievement.color}-600 rounded-full flex items-center justify-center`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
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
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest form interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForms.map((form, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      form.status === 'filled' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {form.status === 'filled' ? 
                        <FileText className="w-4 h-4 text-green-600" /> : 
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      }
                    </div>
                    <div>
                      <div className="font-semibold">{form.title}</div>
                      <div className="text-sm text-gray-600">{form.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={form.status === 'filled' ? 'default' : 'secondary'}>
                      {form.status}
                    </Badge>
                    {form.status === 'filled' && form.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{form.rating}</span>
                      </div>
                    )}
                    {form.status === 'posted' && form.responses && (
                      <span className="text-sm text-gray-600">{form.responses} responses</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Statistics</CardTitle>
          <CardDescription>Your activity trends over the past few months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Forms Filled This Month</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700">Forms Posted This Month</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-purple-700">Average Rating Given</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
