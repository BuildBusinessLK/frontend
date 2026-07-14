import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  readStoredSession,
  writeStoredSession,
  apiRegister,
  apiLogin,
  apiFetchMe,
} from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  // A stored token can be expired, revoked, or signed by an older backend configuration.
  const [sessionValidated, setSessionValidated] = useState(() => !readStoredSession()?.token);

  useEffect(() => {
    try {
      localStorage.removeItem('bb_auth_user');
    } catch {
      /* ignore legacy demo key */
    }
  }, []);

  const user = session?.user ?? null;
  const token = session?.token ?? null;
  const isAuthenticated = Boolean(sessionValidated && token && user);

  const signIn = useCallback(async (email, password) => {
    const next = await apiLogin({ email: email.trim(), password });
    writeStoredSession(next);
    setSession(next);
    setSessionValidated(true);
  }, []);

  const signUp = useCallback(async (fullName, email, password) => {
    const next = await apiRegister({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });
    writeStoredSession(next);
    setSession(next);
    setSessionValidated(true);
  }, []);

  const signOut = useCallback(() => {
    writeStoredSession(null);
    setSession(null);
    setSessionValidated(true);
  }, []);

  const setUser = useCallback((nextUser) => {
    setSession((prev) => {
      if (!prev?.token) return prev;
      const merged = { ...prev, user: nextUser };
      writeStoredSession(merged);
      return merged;
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setSessionValidated(true);
      return undefined;
    }

    let cancelled = false;
    setSessionValidated(false);
    apiFetchMe(token)
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {
        if (!cancelled) {
          writeStoredSession(null);
          setSession(null);
        }
      })
      .finally(() => {
        if (!cancelled) setSessionValidated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [token, setUser]);
  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const profile = await apiFetchMe(token);
      setUser(profile);
      return profile;
    } catch {
      signOut();
      return null;
    }
  }, [token, setUser, signOut]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      sessionValidated,
      signIn,
      signUp,
      signOut,
      setUser,
      refreshProfile,
    }),
    [user, token, isAuthenticated, sessionValidated, signIn, signUp, signOut, setUser, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
