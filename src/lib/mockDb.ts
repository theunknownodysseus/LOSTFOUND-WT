
import { v4 as uuidv4 } from 'uuid';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Item types
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'lost' | 'found';
  date: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
  userId: string;
}

// Claim types
export interface Claim {
  id: string;
  status: 'approved' | 'rejected' | 'pending';
  createdAt: string;
  userId: string;
  itemId: string;
  message: string;
}

// Mock users data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

// Mock items data
const items: Item[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    description: 'Lost my iPhone 13 Pro in blue color. It has a clear case and screen protector.',
    category: 'Electronics',
    status: 'lost',
    date: new Date().toISOString(),
    location: 'Central Park, New York',
    imageUrl: '/placeholder.svg',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '2',
    title: 'Car Keys',
    description: 'Found a set of car keys with a black Toyota fob and several house keys.',
    category: 'Keys',
    status: 'found',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    location: 'Coffee Shop on Main Street',
    imageUrl: '/placeholder.svg',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: '2',
  },
  {
    id: '3',
    title: 'Black Wallet',
    description: 'Lost my black leather wallet with ID, credit cards and some cash.',
    category: 'Personal Items',
    status: 'lost',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    location: 'Bus #42, Downtown Route',
    imageUrl: '/placeholder.svg',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: '1',
  },
];

// Mock claims data
const claims: Claim[] = [
  {
    id: '1',
    status: 'pending',
    createdAt: new Date().toISOString(),
    userId: '2',
    itemId: '3',
    message: 'I found a black wallet matching this description on the bus yesterday.',
  },
];

// User functions
export const getUsers = () => [...users];
export const getUserById = (id: string) => users.find(user => user.id === id);
export const getUserByEmail = (email: string) => users.find(user => user.email === email);

export const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
  const newUser = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

// Item functions
export const getItems = (filters?: { userId?: string; status?: 'lost' | 'found' }) => {
  if (!filters) return [...items];
  
  return items.filter(item => {
    if (filters.userId && item.userId !== filters.userId) return false;
    if (filters.status && item.status !== filters.status) return false;
    return true;
  });
};

export const getItemById = (id: string) => items.find(item => item.id === id);

export const addItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
  const newItem = {
    ...itemData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  return newItem;
};

// Claim functions
export const getClaims = () => [...claims];
export const getClaimById = (id: string) => claims.find(claim => claim.id === id);
export const getClaimsByUserId = (userId: string) => claims.filter(claim => claim.userId === userId);
export const getClaimsByItemId = (itemId: string) => claims.filter(claim => claim.itemId === itemId);

export const addClaim = ({ userId, itemId, message }: { userId: string; itemId: string; message: string }) => {
  const newClaim = {
    id: uuidv4(),
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    userId,
    itemId,
    message,
  };
  claims.push(newClaim);
  return newClaim;
};

export const updateClaimStatus = (claimId: string, status: 'approved' | 'rejected' | 'pending') => {
  const claimIndex = claims.findIndex(claim => claim.id === claimId);
  if (claimIndex !== -1) {
    claims[claimIndex].status = status;
    return claims[claimIndex];
  }
  return null;
};
