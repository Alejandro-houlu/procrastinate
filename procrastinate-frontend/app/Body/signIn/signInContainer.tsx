import React from 'react';
import SignInForm from './signInForm';
import { signIn } from './signInLogic';
import { SIGN_IN_TITLE } from '../strings';
import { ContentHeader, Title } from '../style';

const SignInContainer: React.FC = () => {
  const handleSignIn = async (username: string, password: string) => {
    try {
      const response = await signIn(username, password);
      localStorage.setItem('token', response.token);
      // Redirect the user to the dashboard or another page upon successful sign-in
    } catch (error) {
      console.error('Sign-in failed:', error);
      // Handle sign-in failure (e.g., display error message)
    }
  };

  return (
    <div>
      <ContentHeader><Title>{SIGN_IN_TITLE}</Title></ContentHeader>
      <SignInForm onSignIn={handleSignIn} />
    </div>
  );
};

export default SignInContainer;
