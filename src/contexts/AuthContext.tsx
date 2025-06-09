
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
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

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

      setUser({
        id: userId,
        name: profile?.name || email,
        email,
        formsPosted: formsPosted || 0,
        formsFilled: formsFilled || 0,
        totalRatings: formsFilled || 0,
        badges: badges?.map(b => b.badge_name) || []
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email!);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email!);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
