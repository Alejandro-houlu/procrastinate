export type FileUploadRequestBody = {
  username: String,
  email: String,
  audioFile: File, 
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};

  export type SignUpRequestBody = {
  username: String,
  email: String,
  password: String, 
};