
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Edit, FileText, BarChart3, Star } from 'lucide-react';
import PostedForms from '@/components/PostedForms';
import RecentActivity from '@/components/RecentActivity';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
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
                  <div className="text-2xl font-bold text-emerald-600">{user.formsPosted}</div>
                  <div className="text-sm text-gray-600">Forms Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{user.formsFilled}</div>
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

      {/* Tabs for different sections */}
      <Tabs defaultValue="posted" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posted" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Posted Forms
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Posted Forms
              </CardTitle>
              <CardDescription>
                Forms you have posted and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostedForms />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest form interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Statistics</CardTitle>
              <CardDescription>Your activity trends over the past few months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{user.formsFilled}</div>
                  <div className="text-sm text-blue-700">Total Forms Filled</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-600">{user.formsPosted}</div>
                  <div className="text-sm text-emerald-700">Total Forms Posted</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{user.totalRatings}</div>
                  <div className="text-sm text-purple-700">Total Ratings Given</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
