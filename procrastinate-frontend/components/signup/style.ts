import styled from 'styled-components';

export const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
`;

export const FormInput = styled.input`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Add width property */
`;

export const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  width: 100%; /* Add width property */

  &:hover {
    background-color: #0056b3;
  }
`;

export const ContentHeader = styled.header`
  padding: 20px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${props => props.theme.colors.secondary};
`;