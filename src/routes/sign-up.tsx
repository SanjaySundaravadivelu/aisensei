import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return <SignUp path="/aisensei/signup" fallbackRedirectUrl="/aisensei/" />;
};
