import styled from 'styled-components';

export const StyledNavbar = styled.nav`
  && {
    color: #06154D;
    padding: 1rem;
    display: flex;
    justify-content: space-between; /* Add space between logo and menu items */
    align-items: center; /* Center items vertically */
  }
`;

export const StyledMenu = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
`;

export const StyledMenuItem = styled.li`
  margin-right: 1rem;
  color: white;
`;

export const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
`;