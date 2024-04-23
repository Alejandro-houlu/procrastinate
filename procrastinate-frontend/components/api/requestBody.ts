export type FileUploadRequestBody = {
  username: String,
  email: String,
  audioFile: File, 
};

export type SignInRequestBody = {
  username: String,
  password: String,
};

export type SignUpRequestBody = {
  username: String,
  email: String,
  password: String, 
};

