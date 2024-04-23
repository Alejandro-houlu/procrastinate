import React, { ReactNode } from 'react';
import Navbar from './Navbar/navBarContainer';
import Footer from './Footer/footer';
import { StyledBodyContainer } from './style';
import { NavItemList } from './Navbar/strings';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar navItems={NavItemList}/>
        <StyledBodyContainer><main>{children}</main></StyledBodyContainer>
      <Footer/>
    </>
  );
};

export default Layout;
