
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Users, BarChart3, Award, QrCode } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
      title: "Share Google Forms",
      description: "Post your Google Forms with metadata and reach a wider audience"
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-accent" />,
      title: "Community Driven",
      description: "Fill forms from other users and help build a collaborative community"
    },
    {
      icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
      title: "Gamification",
      description: "Earn badges, climb leaderboards, and get recognized for your contributions"
    },
    {
      icon: <QrCode className="w-6 h-6 md:w-8 md:h-8 text-accent" />,
      title: "QR Code Sharing",
      description: "Generate QR codes for easy form sharing across platforms"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl md:text-5xl">📋</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Welcome to SurvEase
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            The ultimate platform for sharing and discovering Google Forms. 
            Connect with a community of survey creators and participants.
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg text-sm md:text-base px-6 md:px-8">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 text-sm md:text-base px-6 md:px-8">
                  Browse Forms
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg text-sm md:text-base px-6 md:px-8">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 text-sm md:text-base px-6 md:px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose SurvEase?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-4 md:p-6 hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-4 md:pt-6">
                  <div className="flex justify-center mb-3 md:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-12 md:py-20 px-4 bg-secondary/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Help Us Improve
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Your feedback is valuable to us. Share your thoughts and help us make SurvEase better for everyone.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
