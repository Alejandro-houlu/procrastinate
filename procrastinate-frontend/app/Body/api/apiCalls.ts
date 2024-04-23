import { FILE_UPLOADING_ERROR, FILE_UPLOAD_ERROR, SIGN_UP_ERROR } from "../strings";
import { SignUpFormData } from "./interfaces";
import { getAPI, ENDPOINTS, HTTP_METHODS } from "./requestUrl";
import { FileUploadResponse, SignUpResponse } from "./responses";

const AUTH_HEADERS = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lMTIiLCJpYXQiOjE3MTM3OTkxNDEsImV4cCI6MTcxMzg4NTU0MSwicm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfVVNFUiJ9XX0.i-FNrSTI_IXiJurt2PrpceOMZOVKEzxd6kCrdpde7EA',
}

export const signUp = async (formData: SignUpFormData): Promise<SignUpResponse> => {
    try {
      const response = await fetch(getAPI(ENDPOINTS.SIGN_UP), {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(formData),
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

export const uploadFormData = async (formData: FormData): Promise<FileUploadResponse> => {
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
        throw new Error(FILE_UPLOAD_ERROR + response.statusText);
      }
    } catch (error) {
      throw new Error(FILE_UPLOADING_ERROR + error);
    }
  };