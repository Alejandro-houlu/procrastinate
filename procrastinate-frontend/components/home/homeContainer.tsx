import React from 'react';
import { useRouter } from 'next/router';
import { HOME_BUTTON, HOME_CONTENT, HOME_TITLE } from './strings';
import { StyledHomeIcon, StyledMainHeader, StyledParagraph, ButtonContainer, ButtonRectangle, ButtonText } from './style';
import HomeIconSvg from './homeIconSvg';
import { isLoggedin } from '../api/apiCalls';

const HomeContainer: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    const path = isLoggedin()? '/summarize':'signup'
    router.replace(path);
  };

  return (
      <div>
        <StyledHomeIcon>
          <HomeIconSvg />
        </StyledHomeIcon>
        <StyledMainHeader>{HOME_TITLE}</StyledMainHeader>
        <StyledParagraph>{HOME_CONTENT}</StyledParagraph>
        <ButtonContainer onClick={handleRedirect}>
      <ButtonRectangle/>
      <ButtonText>{HOME_BUTTON}</ButtonText>
    </ButtonContainer>
      </div>
  );
};

export default HomeContainer;
