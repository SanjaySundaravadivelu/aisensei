import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
  return <SignIn path="/aisensei/signin" fallbackRedirectUrl="/aisensei/" />;
};
