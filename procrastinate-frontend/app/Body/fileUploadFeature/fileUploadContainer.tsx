import React from 'react';
import { FileInput, SelectFileButton, FileName, SuccessMessage, StartUploadButton, DragDropArea, DragDropContainer, Results } from './style';
import { SELECTED_FILE, BTN_START_UPLOAD, SUCCESS_MSG, BTN_DRAG_AND_DROP, BTN_SELECT_FILE } from './strings';
import { useFileUploadLogic } from './fileUploadLogic';

const FileUploadContainer: React.FC = () => {
  const {
    selectedFile,
    errorMessage,
    uploadSuccess,
    result,
    handleFileChange,
    handleUpload,
    handleUploadButtonClick,
    handleFileDrop,
  } = useFileUploadLogic();

  return (
    <div>
      <DragDropContainer>
        <DragDropArea
          onDragOver={(e: { preventDefault: () => any; }) => e.preventDefault()}
          onDrop={handleFileDrop}>{BTN_DRAG_AND_DROP}
        </DragDropArea>
        <FileInput
          type="file"
          id="fileInput"
          accept=".pdf,.doc,.docx,.mp4,.mp3,.wav,.m4a"
          onChange={handleFileChange}
        />
         <SelectFileButton htmlFor="fileInput" onClick={handleUploadButtonClick}>{BTN_SELECT_FILE}</SelectFileButton>
         {selectedFile && <StartUploadButton onClick={handleUpload}>{BTN_START_UPLOAD}</StartUploadButton>}
      </DragDropContainer>
      {selectedFile && <FileName>{SELECTED_FILE}{selectedFile.name}</FileName>}
      {errorMessage && <div>{errorMessage}</div>}
      {uploadSuccess && <div>
      <SuccessMessage>{SUCCESS_MSG}</SuccessMessage>
      <Results>{result}</Results>
      </div>
      }
    </div>
  );
};

export default FileUploadContainer;
