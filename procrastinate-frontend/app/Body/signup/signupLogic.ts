import {ENDPOINTS, getAPI, HTTP_METHODS} from '../api/requestUrl';
import { FileUploadResponse, SignInResponse, SignUpResponse } from '../api/responses';
import { SIGN_UP_ERROR } from '../strings';

export interface SignUpFormData {
    username: string;
    email: string;
    password: string;
  }
  
  const mockResponse: SignUpResponse = {
    "status": "User registration was successful",
  };

  export const signUp = async (formData: SignUpFormData): Promise<SignUpResponse> => {
    return mockResponse;
  };
  
  //TODO: replace signUp method after API connection is working
  // export const signUp = async (formData: SignUpFormData): Promise<SignUpResponse> => {
  //   try {
  //     const response = await fetch(getAPI(ENDPOINTS.SIGN_UP), {
  //       method: HTTP_METHODS.POST,
  //       body: JSON.stringify(formData),
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     if (response.ok) {
  //       const responseData: SignUpResponse = await response.json();
  //       return responseData;
  //     } else {
  //       throw new Error(SIGN_UP_ERROR + response.statusText);
  //     }
  //   } catch (error) {
  //     throw new Error(SIGN_UP_ERROR + error);
  //   }
  // };
  