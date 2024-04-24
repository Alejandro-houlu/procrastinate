import React, { useState } from 'react';
import { SignUpForm, FormInput, SubmitButton, ContentHeader, Title } from './style';
import { SIGN_UP_SUCCESS_MSG, SIGN_UP_TITLE } from '../strings';
import { signUp } from '../api/apiCalls';
import { SignUpFormData } from '../api/interfaces';

const SignUpContainer: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await signUp(formData);
    setLoading(false);
    if(success){
    setSuccess(true);}
  };

  return (
    <div>
      <ContentHeader><Title>{SIGN_UP_TITLE}</Title></ContentHeader>
      <SignUpForm onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <FormInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </SubmitButton>
        {success && <p>{SIGN_UP_SUCCESS_MSG}</p>}
      </SignUpForm>
    </div>
  );
};

export default SignUpContainer;
