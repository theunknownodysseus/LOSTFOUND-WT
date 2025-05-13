
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (userData: { name?: string; email?: string; phone?: string }) => Promise<void>;
  session: Session | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setCurrentUser(currentSession?.user || null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setCurrentUser(currentSession?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Login Successful",
        description: `Welcome back!`
      });
      
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<User | null> => {
    try {
      // Check if user exists first by trying to sign in
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      // Create profile record
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id, 
              name, 
              email, 
              phone 
            }
          ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        toast({
          title: "Registration Successful",
          description: `Welcome, ${name}!`
        });
      }
      
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setCurrentUser(null);
      setSession(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateUser = async (userData: { name?: string; email?: string; phone?: string }) => {
    if (!currentUser) return;
    
    try {
      // Update profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', currentUser.id);

      if (updateError) {
        toast({
          title: "Update Failed",
          description: updateError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
