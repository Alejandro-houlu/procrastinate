import { styled } from "styled-components";

export const StyledMainHeader = styled.div`
    position: absolute;
    left: 13.12%;
    right: 60.97%;
    top: 15.14%;
    bottom: 71.19%;
    font-style: normal;
    font-weight: 700;
    font-size: 70px;
    line-height: 100%;
    text-transform: capitalize;
`;

export const StyledParagraph = styled.div`
    position: absolute;
    left: 13.06%;
    right: 53.47%;
    top: 35.76%;
    bottom: 58.5%;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
`;

// Button Container
export const ButtonContainer = styled.div`
  position: absolute;
  width: 423px;
  height: 70px;
  left: 188px;
  top: 465px;
`;

// Button Rectangle
export const ButtonRectangle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #8080D7;
  border-radius: 83px;
  z-index: 1; /* Ensure it's above other elements */
`;

// Button Text
export const ButtonText = styled.div`
  position: absolute;
  width: 100%; /* Adjust the width to fill the button */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the text horizontally and vertically */
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  mix-blend-mode: normal;
  z-index: 2; /* Ensure it's above the rectangle */
`;

export const StyledHomeIcon = styled.div`
    position: absolute;
    width: 444px;
    height: 444px;
    left: 657px;
    top: 114px;
`








