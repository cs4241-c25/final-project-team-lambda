import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            username: string;
            profName: string;
            email: string;
            id: string;
        }
    }
}
/*
    export interface UserObject {
        username: string;
        profName: string;
        email: string;
        id: string;
    }

    export interface BackendAccessJWT {
        access: string;
    }

    export interface BackendJWT extends BackendAccessJWT {
        refresh: string;
    }

    export interface DecodedJWT extends UserObject {
        token_type: "refresh" | "access";
        iat: number;
        jti: string;
    }

    export interface AuthValidity {
        valid_until: number;
        refresh_until: number;
    }

    export interface User {
        tokens: BackendJWT;
        user: UserObject;
        validity: AuthValidity;
    }
}
/*
declare module "next-auth/jwt" {
    export interface JWT {
        data: User;
        error: "RefreshTokenExpired" | "RefreshAccessTokenError";
    }
}
*/
//Code based on: github.com/nextauthjs/next-auth/issues/11295