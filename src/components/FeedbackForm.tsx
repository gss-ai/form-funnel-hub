
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, MessageSquare } from 'lucide-react';

const FeedbackForm = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !feedback) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting feedback:', { email, feedback });

    try {
      // Using FormSubmit service with proper configuration
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formsubmit.co/gss391256@gmail.com';
      
      // Add form fields
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'email';
      emailField.value = email;
      form.appendChild(emailField);
      
      const messageField = document.createElement('input');
      messageField.type = 'hidden';
      messageField.name = 'message';
      messageField.value = `Feedback from ${email}: ${feedback}`;
      form.appendChild(messageField);
      
      // Add FormSubmit configuration fields
      const subjectField = document.createElement('input');
      subjectField.type = 'hidden';
      subjectField.name = '_subject';
      subjectField.value = 'SurvEase Website Feedback';
      form.appendChild(subjectField);
      
      const captchaField = document.createElement('input');
      captchaField.type = 'hidden';
      captchaField.name = '_captcha';
      captchaField.value = 'false';
      form.appendChild(captchaField);
      
      const nextField = document.createElement('input');
      nextField.type = 'hidden';
      nextField.name = '_next';
      nextField.value = window.location.href;
      form.appendChild(nextField);
      
      // Submit form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      toast.success('Feedback sent successfully! Thank you for helping us improve.');
      setEmail('');
      setFeedback('');
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium text-card-foreground">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Send us feedback for the welfare of the website"
              rows={5}
              className="w-full bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-md transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
