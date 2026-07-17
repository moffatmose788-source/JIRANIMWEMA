/**
 * BOMAENGWE WELFARE — Authentication Context
 * Provides Firebase Auth state, user profile, and role-based access control
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { membersService, type UserProfile, type UserRole } from '@/lib/firestore';
import { serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isCommittee: boolean;
  isMember: boolean;
  canAccess: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Role hierarchy: admin > committee > member
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  committee: 2,
  member: 1,
};

let memberCounter = 1000;

function generateMemberNumber(): string {
  memberCounter++;
  return `BWS-${String(memberCounter).padStart(5, '0')}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const role = userProfile?.role ?? null;
  const isAdmin = role === 'admin';
  const isCommittee = role === 'committee' || role === 'admin';
  const isMember = !!role;

  const canAccess = useCallback((requiredRole: UserRole): boolean => {
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
  }, [role]);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const profile = await membersService.getByUid(user.uid);
      setUserProfile(profile);
    } catch {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await loadProfile(cred.user);
  }, [loadProfile]);

  const register = useCallback(async (
    email: string,
    password: string,
    profile: Partial<UserProfile>
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    await updateProfile(user, { displayName: profile.fullName });
    await sendEmailVerification(user);

    const memberNumber = generateMemberNumber();
    const newProfile: Omit<UserProfile, 'id'> = {
      uid: user.uid,
      email: user.email!,
      fullName: profile.fullName || '',
      nationalId: profile.nationalId || '',
      phoneNumber: profile.phoneNumber || '',
      occupation: profile.occupation || '',
      village: profile.village || '',
      nextOfKinName: profile.nextOfKinName || '',
      nextOfKinPhone: profile.nextOfKinPhone || '',
      memberStatus: 'active',
      role: 'member',
      memberNumber,
      emailVerified: false,
      registrationDate: serverTimestamp() as unknown as Date,
    };

    await membersService.create(newProfile);
    await loadProfile(user);
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUserProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  }, [currentUser]);

  const refreshProfile = useCallback(async () => {
    if (currentUser) {
      await loadProfile(currentUser);
    }
  }, [currentUser, loadProfile]);

  const value: AuthContextType = useMemo(() => ({
    currentUser,
    userProfile,
    role,
    loading,
    login,
    register,
    logout,
    resetPassword,
    sendVerificationEmail,
    refreshProfile,
    isAdmin,
    isCommittee,
    isMember,
    canAccess,
  }), [currentUser, userProfile, role, loading, login, register, logout, resetPassword, sendVerificationEmail, refreshProfile, isAdmin, isCommittee, isMember, canAccess]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
