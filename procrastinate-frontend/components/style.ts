import styled from 'styled-components';

export const StyledBodyContent = styled.div`
  max-width: ${props => props.theme.bodyContent.maxWidth};
  margin: ${props => props.theme.bodyContent.margin};
  padding: ${props => props.theme.bodyContent.padding};
  height: calc(100vh - 10vh);
`;

export const StyledBodyContainer = styled.div`
max-width: auto;
  margin: 0 auto;
  padding: 2rem;
  height: calc(100vh - 10vh);
`;

export const ContentHeader = styled.header`
  padding: 20px;
  text-align: center
`;

export const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${props => props.theme.colors.secondary};
`;

export const SignInFormWrapper = styled.div`
  max-width: 300px;
  margin: 0 auto;
`;

export const FormInput = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  color: black;
`;

export const SignInSubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${props => props.theme.colors.secondary};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

