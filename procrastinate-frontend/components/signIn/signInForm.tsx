import React, { useState } from 'react';
import { SignInFormWrapper, FormInput, SignInSubmitButton } from '../style'; 
import { SIGN_IN_LABEL_PWD, SIGN_IN_LABEL_USERNAME, SIGN_IN_TITLE } from '../strings';

type SignInFormProps = {
  onSignIn: (username: string, password: string) => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignIn(username, password);
  };

  return (
    <SignInFormWrapper>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">{SIGN_IN_LABEL_USERNAME}</label>
          <FormInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">{SIGN_IN_LABEL_PWD}</label>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <SignInSubmitButton type="submit">{SIGN_IN_TITLE}</SignInSubmitButton>
        </div>
      </form>
    </SignInFormWrapper>
  );
};

export default SignInForm;
