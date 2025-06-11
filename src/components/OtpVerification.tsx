
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log('Verifying OTP for email:', email, 'OTP:', otp);
      const result = await verifyOtp(email, otp);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Email verified successfully! Redirecting to dashboard...');
        // Small delay to show the success message
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Mail className="w-16 h-16 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-lg">
            We've sent a 6-digit OTP to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-emerald-700 font-medium text-center">
              📧 OTP sent to {email}
            </p>
            <p className="text-emerald-600 text-sm mt-2 text-center">
              Please check your email and enter the 6-digit code below.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">
                Enter 6-digit OTP
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
                disabled={isVerifying}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Didn't receive the OTP? Check your spam folder or try registering again.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerification;
