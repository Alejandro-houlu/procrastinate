import styled from 'styled-components';

export const FileInput = styled.input`
  display: none;
`;

export const FileName = styled.span`
  margin-left: 1rem;
`;

export const AllowedFileTypes = [
  'application/pdf',
  'application/msword',
  'video/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-m4a',
];

// Container for drag and drop area and buttons
export const DragDropContainer = styled.div`
  position: relative;
`;

// Drag and drop area
export const DragDropArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 40px; 
  text-align: center;
  transition: border-color 0.3s ease; 
  margin-bottom: 20px; 
  height: 200px;

  &:hover {
    border-color: #666;
  }

  &:active {
    border-style: solid; /* Change border style to solid when dragging over */
  }

  /* Style the content text */
  p {
    margin: 0;
    font-size: 16px;
    color: #666;
  }

  /* Style the icon */
  svg {
    margin-bottom: 10px;
    fill: #666;
    width: 48px;
    height: 48px;
    transition: fill 0.3s ease; /* Add smooth transition effect for icon color */
  }

  /* Change icon color on hover */
  &:hover svg {
    fill: #333;
  }
`;

// Upload button
export const SelectFileButton = styled.label`
  background-color: transparent;
  border: 2px solid #fff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 80px; 
  left: 50%; 
  transform: translateX(-50%); 
`;

// Start upload button
export const StartUploadButton = styled.label`
  background-color: ${props =>props.theme.colors.secondary};
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
  left: 50%; 
  transform: translateX(-50%);
`;

// Success message
export const SuccessMessage = styled.div`
  color: green;
  margin-top: 0.5rem;
`;

// Results
export const Results = styled.div`
  margin-top: 20px;
  text-align: center;
`;