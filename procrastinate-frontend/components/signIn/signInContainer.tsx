import React from 'react';
import { useRouter } from 'next/router';
import SignInForm from './signInForm';
import { SIGN_IN_TITLE } from '../strings';
import { ContentHeader, Title } from '../style';
import { signIn } from '../api/apiCalls';
import { SignInRequestBody } from '../api/requestBody';

const SignInContainer: React.FC = () => {
  const router = useRouter();

  const handleSignIn = async (username: string, password: string) => {
    const requestBody: SignInRequestBody = {
      username: username,
      password: password,
    }
    try {
      const response = await signIn(requestBody);
      console.log("sign in response",response);
      localStorage.setItem('token', response.token);
      router.replace('/summarize');
    } catch (error) {
      console.error('Sign-in failed:', error);
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
