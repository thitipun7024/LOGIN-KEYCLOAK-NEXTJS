import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: string
  }

  interface Token {
    groups: string[];
    displayName: string;
    username: string;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}