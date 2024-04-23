import { useState } from 'react';
import { AllowedFileType, allFileTypes } from './models';
import { ERROR_MSG_INVALID_FILE, SUCCESS_MSG, CONSOLE_ERROR_MSG } from './strings';
import { ENDPOINTS, HTTP_METHODS, getAPI } from '../api/requestUrl';
import { FileUploadRequestBody } from '../api/requestBody';
import { FileUploadResponse } from '../api/responses';
import { uploadFormData } from '../api/apiCalls';

export const useFileUploadLogic = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;
    const fileType = getFileType(file.name);
    if (fileType && allFileTypes.includes(fileType)) {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage(ERROR_MSG_INVALID_FILE);
    }
  };

  const getFileType = (fileName: string): AllowedFileType | undefined => {
    const extension = fileName.split('.').pop();
    return extension ? `.${extension}` as AllowedFileType : undefined;
  };

const handleUpload = async () => {
  if (!selectedFile) return;
  try {
    const headers = {
      'Authorization': 'Bearer ',
    }
    const requestBody:FileUploadRequestBody = prepareRequestBody(selectedFile);
    const response = await uploadFormData(requestBody);
    console.log(response);
    if (response && response.result) {
      handleUploadSuccess(response);
    } else {
      handleUploadError();
    }
  } catch (error) {
    handleUploadError(error);
  }
};

  const prepareRequestBody = (selectedFile: File) => {
    const requestBody: FileUploadRequestBody = {
      username: 'jane12',
      email: 'jane@gmail.com',
      audioFile: selectedFile
    };
    return requestBody;
  };

  const handleUploadSuccess = (response:FileUploadResponse) => {
    console.log(SUCCESS_MSG);
    setUploadSuccess(true);
    setResult(JSON.stringify(response.result));
  };

  const handleUploadError = (error?: any) => {
    console.error(CONSOLE_ERROR_MSG, error);
  };

  const selectFileButtonClick = () => {
    setUploadProgress(0);
    setUploadSuccess(false);
    setSelectedFile(null);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const fileType = getFileType(file.name);
    if (fileType && allFileTypes.includes(fileType)) {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage(ERROR_MSG_INVALID_FILE);
    }
  };

  return {
    selectedFile,
    errorMessage,
    uploadProgress,
    uploadSuccess,
    result,
    handleFileChange,
    handleUpload,
    handleUploadButtonClick: selectFileButtonClick,
    handleFileDrop
  };
};
