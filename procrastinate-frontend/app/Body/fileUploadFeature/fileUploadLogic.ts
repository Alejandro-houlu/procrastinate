import { useState } from 'react';
import { AllowedFileType, allFileTypes } from './models';
import { ERROR_MSG_INVALID_FILE, SUCCESS_MSG, CONSOLE_ERROR_MSG } from './strings';
import { ENDPOINTS, HTTP_METHODS, getAPI } from '../api/requestUrl';
import { FileUploadRequestBody, getTokenFromLocalStorage } from '../api/requestBody';
import { FileUploadResponse } from '../api/responses';

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
    const formData = prepareFormData(selectedFile);
    const response = await uploadFormData(formData);
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

  const prepareFormData = (selectedFile: File) => {
    const requestBody: FileUploadRequestBody = {
      username: 'jane12',
      password: 'woohoo',
      audioFile: selectedFile
    };

    const formData = new FormData();
    for (const [key, value] of Object.entries(requestBody)) {
      formData.append(key, value.toString());
    }
    return formData;
  };

  const mockResponse: FileUploadResponse = {
    result: "This is a sample file for the speech-to-text notebook. This is meant as a test audio to try out whether Whisper works to actually decode the audio into word tokens. Check. Check. One, two, three, four. Zero. Over."
  };

  const uploadFormData = async (formData: FormData): Promise<FileUploadResponse> => {
    console.log(getTokenFromLocalStorage());
    return mockResponse;
  };

  //TODO: Replace mockAPI after API connection is working
  // const uploadFormData = async (formData: FormData): Promise<FileUploadResponse> => {
  //   try {
  //     const token = getTokenFromLocalStorage();
  //     const response = await fetch(getAPI(ENDPOINTS.FILE_UPLOAD), {
  //       method: HTTP_METHODS.POST,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });
  
  //     if (response.ok) {
  //       const responseData: FileUploadResponse = await response.json();
  //       return responseData;
  //     } else {
  //       throw new Error('Failed to upload file: ' + response.statusText);
  //     }
  //   } catch (error) {
  //     throw new Error('Error uploading file: ' + error);
  //   }
  // };

  const handleUploadSuccess = (response:FileUploadResponse) => {
    console.log(SUCCESS_MSG);
    // setResult(resultAsString)
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
