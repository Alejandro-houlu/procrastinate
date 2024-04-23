export type FileUploadRequestBody = {
  username: String,
  password: String,
  email: String,
  audioFile: File, 
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};