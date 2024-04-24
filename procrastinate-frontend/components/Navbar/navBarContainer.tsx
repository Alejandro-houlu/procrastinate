import React from 'react';
import HomeLogoSvg from './homeLogoSvg';
import { StyledNavbar, StyledMenu, StyledMenuItem, StyledLink } from './style';

interface NavItem {
  item: string;
  path: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
  return (
    <StyledNavbar>
      <div>
        <HomeLogoSvg />
      </div>
      <StyledMenu>
        {navItems.map(({ item, path }, index) => (
          <StyledMenuItem key={index}>
            <StyledLink href={path}>
              {item}
            </StyledLink>
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </StyledNavbar>
  );
};

export default Navbar;
