"use client";

import { useSignIn, useUser } from "@clerk/nextjs";

export const useAuth = () => {
  const { signIn, isLoaded } = useSignIn();

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    return await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  const user = useUser();

  return {
    signInWithGoogle,
    user: user?.user,
  };
};
