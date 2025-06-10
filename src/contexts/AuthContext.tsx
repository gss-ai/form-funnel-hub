
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  formsPosted: number;
  formsFilled: number;
  totalRatings: number;
  badges: string[];
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async (userId: string) => {
    try {
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

      // Get total ratings given
      const { count: totalRatings } = await supabase
        .from('form_fills')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('rating', 'is', null);

      // Get badges
      const { data: badgeData } = await supabase
        .from('user_badges')
        .select('badge_name')
        .eq('user_id', userId);

      return {
        formsPosted: formsPosted || 0,
        formsFilled: formsFilled || 0,
        totalRatings: totalRatings || 0,
        badges: badgeData?.map(b => b.badge_name) || []
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        formsPosted: 0,
        formsFilled: 0,
        totalRatings: 0,
        badges: []
      };
    }
  };

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched:', profile);
      
      // Fetch user stats
      const stats = await fetchUserStats(userId);
      
      return {
        id: profile.id,
        email: session?.user?.email || '',
        name: profile.name,
        ...stats
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      setUser(userProfile);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    supabase.auth.signOut();
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/email-confirmed`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session:', initialSession);
      setSession(initialSession);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id).then((userProfile) => {
          console.log('Initial user profile loaded:', userProfile);
          setUser(userProfile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setLoading(true);
          const userProfile = await fetchUserProfile(currentSession.user.id);
          console.log('User profile loaded after auth change:', userProfile);
          setUser(userProfile);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    loading,
    refreshUser,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
