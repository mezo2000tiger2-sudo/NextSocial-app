import NextAuth, { DefaultSession, User } from "next-auth"
import { UserInterface } from "./authInterface"
import { JWT } from "next-auth/jwt"
declare module "next-auth" {
    interface User{
        user:UserInterface,
        token:string
    }
  interface Session {
    user:UserInterface
  }
}



declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User{
    /** OpenID ID Token */
    idToken?: string
  }
}