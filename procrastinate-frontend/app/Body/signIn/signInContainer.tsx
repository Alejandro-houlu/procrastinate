import React from 'react';
import SignInForm from './signInForm';
import { SIGN_IN_TITLE } from '../strings';
import { ContentHeader, Title } from '../style';
import { signIn } from '../api/apiCalls';
import { SignInRequestBody } from '../api/requestBody';

const SignInContainer: React.FC = () => {
  const handleSignIn = async (username: string, password: string) => {
    const requestBody: SignInRequestBody = {
      username: username,
      password: password,
    }
    try {
      //const formdata = objectToFormData(requestBody)
      const response = await signIn(requestBody);
      console.log("sign in response",response);
      localStorage.setItem('token', response.token);
      // Redirect the user to the dashboard or another page upon successful sign-in
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

