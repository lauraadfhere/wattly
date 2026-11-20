"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentProfile,
  getCurrentUser,
  logoutAccount,
  type WattlyProfile,
} from "@/lib/auth";

type AuthUser = {
  $id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  profile: WattlyProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setProfile: (profile: WattlyProfile | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<WattlyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const current = await getCurrentUser();
      if (!current) {
        setUser(null);
        setProfile(null);
        return;
      }
      setUser({
        $id: current.$id,
        name: current.name,
        email: current.email,
      });
      const currentProfile = await getCurrentProfile();
      setProfile(currentProfile);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await logoutAccount();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refresh, logout, setProfile }),
    [user, profile, loading, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
