
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  formsPosted: number;
  formsFilled: number;
  totalRatings: number;
  badges: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Get or create profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating new profile for user:', userId);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId, 
            name: email.split('@')[0] 
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
        
        profile = newProfile;
        console.log('Created new profile:', profile);
      } else if (profileError) {
        console.error('Profile error:', profileError);
        return;
      }

      // Get forms posted count
      const { count: formsPosted } = await supabase
        .from('forms')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get forms filled count
      const { count: formsFilled } = await supabase
        .from('form_fills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('badge_name')
        .eq('user_id', userId);

      const userProfile: UserProfile = {
        id: userId,
        name: profile?.name || email.split('@')[0],
        email,
        formsPosted: formsPosted || 0,
        formsFilled: formsFilled || 0,
        totalRatings: formsFilled || 0,
        badges: badges?.map(b => b.badge_name) || []
      };

      console.log('Setting user profile:', userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email!);
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email!);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return { error: error.message };
      }
      console.log('Login successful');
      return {};
    } catch (error) {
      console.error('Login exception:', error);
      return { error: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Attempting registration for:', email, 'with name:', name);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/email-confirmed`
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        return { error: error.message };
      }
      console.log('Registration successful');
      return {};
    } catch (error) {
      console.error('Registration exception:', error);
      return { error: 'Registration failed' };
    }
  };

  const logout = async () => {
    console.log('Logging out');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
