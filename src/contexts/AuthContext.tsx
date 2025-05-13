
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, addUser, findUserByEmail, users } from '@/lib/mockDb';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User | null>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify this user exists in our "database"
        const userExists = users.some(u => u.id === parsedUser.id);
        if (userExists) {
          setCurrentUser(parsedUser);
        } else {
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return null;
    }

    // Remove password from stored user
    const { password: _, ...safeUser } = user;
    const userToStore = { ...safeUser, id: user.id } as User;
    
    setCurrentUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.name}!`
    });
    
    return userToStore;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<User | null> => {
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      toast({
        title: "Registration Failed",
        description: "Email already in use",
        variant: "destructive"
      });
      return null;
    }

    // Only include phone if it has a value
    const userData: Omit<User, 'id' | 'createdAt'> = { name, email, password };
    if (phone) {
      (userData as any).phone = phone;
    }
    
    const newUser = addUser(userData);
    
    // Remove password from stored user
    const { password: _, ...safeUser } = newUser;
    const userToStore = { ...safeUser, id: newUser.id } as User;
    
    setCurrentUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    
    toast({
      title: "Registration Successful",
      description: `Welcome, ${name}!`
    });
    
    return userToStore;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    
    // Find the user in the "database" and update
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...userData };
      const updatedUser = users[userIndex];
      
      // Remove password from stored user
      const { password: _, ...safeUser } = updatedUser;
      const userToStore = { ...safeUser, id: updatedUser.id } as User;
      
      setCurrentUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
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
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
