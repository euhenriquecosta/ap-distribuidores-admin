"use client";

import { createContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { useRouter } from 'next/navigation';

import { api } from '../services/api';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  signIn: ({ email, password }: SignInRequest) => void;
  signOut: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()

  async function signIn({ email, password }: SignInRequest) {
    try {
      const response = await api.post("/api/signin", {
        EMAIL: email,
        PASSWORD: password,
      });

      const { token } = response.data as SignInResponse;
      console.log(token)

      setCookie(undefined, "ap.token", token, {
        maxAge: 60 * 60 * 1, // 1 hora
        path: "/",
      });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.error(error);
      throw new Error("Error signing in");
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      destroyCookie(undefined, "ap.token");
      delete api.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error(error);
      throw new Error("Error signing out");
    }
  }

  useEffect(() => {
    async function verifyToken() {
      setIsLoading(true);
      try {
        const { "ap.token": token } = parseCookies();

        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setIsAuthenticated(true);

          // Não redireciona se já estiver na página inicial
          if (window.location.pathname === "/login") {
            router.push("/");
          }
        } else {
          setIsAuthenticated(false);
          if (window.location.pathname !== "/login") {
            router.push("/login");
          }
        }
      } catch (error) {
        console.log(error);

        // Se o token for inválido, limpa a autenticação
        destroyCookie(undefined, "ap.token");
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);

        if (window.location.pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, setIsAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}