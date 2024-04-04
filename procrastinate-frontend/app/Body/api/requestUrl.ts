 export const BASE_URL = 'http://localhost:8080';

 export const ENDPOINTS = {
    SIGN_UP: 'SIGN_UP',
    FILE_UPLOAD: 'FILE_UPLOAD',
    SIGN_IN:'SIGN_IN',
  } as const;

 const ENDPOINT_PATHS = {
    [ENDPOINTS.SIGN_UP]: 'auth/signup',
    [ENDPOINTS.FILE_UPLOAD]: '/speechToText',
    [ENDPOINTS.SIGN_IN]:'auth/signin'
  };
  
  export const HTTP_METHODS = {
    POST: 'POST',
  };
  
  export const getAPI = (feature: keyof typeof ENDPOINT_PATHS): string => {
    return `${BASE_URL}/api/${ENDPOINT_PATHS[feature]}`;
  };
  