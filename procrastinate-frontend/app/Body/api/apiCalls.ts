import { FILE_UPLOAD_ERROR, FILE_UPLOAD_FAILED, SIGN_IN_ERROR, SIGN_IN_FAILED, SIGN_UP_ERROR } from "../strings";
import { SignUpFormData } from "./interfaces";
import { FileUploadRequestBody, SignInRequestBody } from "./requestBody";
import { getAPI, ENDPOINTS, HTTP_METHODS } from "./requestUrl";
import { FileUploadResponse, SignInResponse, SignUpResponse } from "./responses";

const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};

const AUTH_HEADERS = {
  'Authorization': "Bearer " + getTokenFromLocalStorage()||""
}

const objectToFormData = (requestBody: Record<string, any>): FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(requestBody)) {
    value instanceof File? formData.append(key, value) : formData.append(key, value.toString());
  }
  return formData;
};

export const signUp = async (requestBody: SignUpFormData): Promise<SignUpResponse> => {
  const formData = objectToFormData(requestBody);
  try {
      const response = await fetch(getAPI(ENDPOINTS.SIGN_UP), {
        method: HTTP_METHODS.POST,
        body: formData,
      });
      if (response.ok) {
        const responseData: SignUpResponse = await response.json();
        return responseData;
      } else {
        throw new Error(SIGN_UP_ERROR + response.statusText);
      }
    } catch (error) {
      throw new Error(SIGN_UP_ERROR + error);
    }
  };

  export const signIn = async (requestBody: SignInRequestBody): Promise<SignInResponse> => {
    const formData:FormData = objectToFormData(requestBody);
    try {
      const response = await fetch(getAPI(ENDPOINTS.SIGN_IN), {
        method: HTTP_METHODS.POST,
        body: formData,
      });
  
      if (response.ok) {
          const responseData: SignInResponse = await response.json();
          return responseData;
        } else {
          throw new Error(SIGN_IN_ERROR + response.statusText);
        }
    } catch (error) {
      throw new Error(SIGN_IN_FAILED + error);
    }
  };

export const uploadFormData = async (requestBody: FileUploadRequestBody): Promise<FileUploadResponse> => {
  const formData = objectToFormData(requestBody);
  try {
      const response = await fetch(getAPI(ENDPOINTS.FILE_UPLOAD), {  
        method: HTTP_METHODS.POST,
        body: formData,
        headers: AUTH_HEADERS
      });
  
      if (response.ok) {
        const responseData: FileUploadResponse = await response.json();
        return responseData;
      } else {
        throw new Error(FILE_UPLOAD_FAILED + response.statusText);
      }
    } catch (error) {
      throw new Error(FILE_UPLOAD_ERROR + error);
    }
  };