
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Mail } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Fill dummy data for testing
  const fillDummyData = () => {
    setName('Test User');
    setEmail('testuser@example.com');
    setPassword('testpassword123');
    setConfirmPassword('testpassword123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    console.log('Registration attempt with:', { name, email });
    
    try {
      const result = await register(name, email, password);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        setRegistrationSuccess(true);
        toast.success('Registration successful! Please check your email to confirm your account.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && password.length >= 6 && password === confirmPassword;

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Mail className="w-16 h-16 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-600">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-lg">
              We've sent a confirmation link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-emerald-700 font-medium">
                📧 Confirmation email sent to {email}
              </p>
              <p className="text-emerald-600 text-sm mt-2">
                Please click the link in your email to activate your account.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
              
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try registering again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Join SurvEase
          </CardTitle>
          <CardDescription>
            Create your account to start sharing and filling forms
          </CardDescription>
          <Button 
            type="button" 
            onClick={fillDummyData}
            variant="outline"
            size="sm"
            className="self-center"
          >
            Fill Test Data
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-slate-200"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-slate-600">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
