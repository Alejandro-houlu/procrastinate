import React from 'react';
import {COPYRIGHTS} from './strings';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 1rem;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; {COPYRIGHTS}</p>
    </FooterContainer>
  );
};

export default Footer;
