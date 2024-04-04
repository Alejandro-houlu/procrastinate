export type FileUploadResponse = {
    result: String,
  };

export type SignUpResponse = {
    status: String,
};

export type SignInResponse = {
  token: string,
  type : "Bearer",
  id: number,
  username: string,
  roles: string[],
}
