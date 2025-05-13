
import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'lost' | 'found';
  date: string;
  location: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  itemId: string;
  userId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Mock data
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    phone: '123-456-7890',
  },
];

export const items: Item[] = [
  {
    id: '1',
    title: 'Gold Watch',
    description: 'Vintage gold watch with leather strap',
    category: 'Jewelry',
    status: 'lost',
    date: '2023-04-15',
    location: 'Central Park',
    imageUrl: '/placeholder.svg',
    userId: '1',
    createdAt: '2023-04-16T10:30:00Z',
  },
  {
    id: '2',
    title: 'iPhone 13',
    description: 'Black iPhone 13 with red case',
    category: 'Electronics',
    status: 'found',
    date: '2023-04-18',
    location: 'Coffee Shop on Main St',
    imageUrl: '/placeholder.svg',
    userId: '1',
    createdAt: '2023-04-18T14:20:00Z',
  },
];

export const claims: Claim[] = [];

// Helper functions
export const addUser = (user: Omit<User, 'id'>): User => {
  const newUser = { ...user, id: uuidv4() };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const addItem = (item: Omit<Item, 'id' | 'createdAt'>): Item => {
  const newItem = { ...item, id: uuidv4(), createdAt: new Date().toISOString() };
  items.push(newItem);
  return newItem;
};

export const getItems = (filter?: Partial<Item>): Item[] => {
  if (!filter) return [...items];
  return items.filter(item => 
    Object.entries(filter).every(([key, value]) => 
      item[key as keyof Item] === value
    )
  );
};

export const getItemById = (id: string): Item | undefined => {
  return items.find(item => item.id === id);
};

export const addClaim = (claim: Omit<Claim, 'id' | 'status' | 'createdAt'>): Claim => {
  const newClaim = { 
    ...claim, 
    id: uuidv4(), 
    status: 'pending', 
    createdAt: new Date().toISOString() 
  };
  claims.push(newClaim);
  return newClaim;
};

export const getClaimsByItemId = (itemId: string): Claim[] => {
  return claims.filter(claim => claim.itemId === itemId);
};

export const getClaimsByUserId = (userId: string): Claim[] => {
  return claims.filter(claim => claim.userId === userId);
};

export const updateClaimStatus = (claimId: string, status: 'approved' | 'rejected'): Claim | undefined => {
  const claim = claims.find(c => c.id === claimId);
  if (claim) {
    claim.status = status;
    return claim;
  }
  return undefined;
};
