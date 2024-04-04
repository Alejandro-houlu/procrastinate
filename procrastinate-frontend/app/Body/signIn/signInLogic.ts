import {ENDPOINTS, getAPI, HTTP_METHODS} from '../api/requestUrl';
import { SignInResponse } from '../api/responses';
import { SIGN_IN_ERROR } from '../strings';

const mockResponse: SignInResponse = {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqYW5lMTIiLCJpYXQiOjE3MTIwMzQ4MDMsImV4cCI6MTcxMjEyMTIwM30.MlCpmsuXci0A81SYZiJ9GDN9k7tMeAK67cdLcZb6bhbUCbeaPrI9Nsn4k8T6dehE4pzJD6ULiztCYJhZQo4Bgw",
    "type": "Bearer",
    "id": 1,
    "username": "...",
    "roles": [
      "ROLE_USER"
    ]
  };

  export const signIn = async (username: string, password: string): Promise<SignInResponse> => {
    return mockResponse;
  };
  
//TODO: Replace sigin method once API connection is working
// export const signIn = async (username: string, password: string): Promise<SignInResponse> => {
//   try {
//     const response = await fetch(getAPI(ENDPOINTS.SIGN_IN), {
//       method: HTTP_METHODS.POST,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     if (response.ok) {
//         //const responseData: FileUploadResponse = await response.json();
//         //TODO: Change after API connection is working
//             const responseData: SignInResponse = {
//               "token": "...",
//               "type": "Bearer",
//               "id": 1,
//               "username": "...",
//               "roles": [
//                   "ROLE_USER"
//               ]
//           };
//         return responseData;
//       } else {
//         throw new Error(SIGN_IN_ERROR + response.statusText);
//       }
//   } catch (error) {
//     throw new Error('Sign-in failed: ' + error);
//   }
// };
