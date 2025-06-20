
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';

const FeedbackForm = () => {
  const handleFeedbackClick = () => {
    const subject = encodeURIComponent('SurvEase Website Feedback');
    const body = encodeURIComponent('Hi,\n\nI would like to provide feedback about SurvEase:\n\n[Please write your feedback here]\n\nBest regards');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=gss391256@gmail.com&su=${subject}&body=${body}`;
    
    window.open(gmailUrl, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-card-foreground flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Send Us Feedback
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Help us improve SurvEase with your valuable feedback
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-6">
          Click the button below to send us feedback directly through Gmail
        </p>
        
        <Button
          onClick={handleFeedbackClick}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-md transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Feedback via Gmail
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          This will open Gmail with our email address (gss391256@gmail.com) pre-filled
        </p>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
