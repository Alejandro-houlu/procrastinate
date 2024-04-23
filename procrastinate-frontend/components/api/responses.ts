export type FileUploadResponse = {
    result: String,
  };

export type SignUpResponse = {
    status: String,
};

export type SignInResponse = {
  token: string,
  type : string,
  id: number,
  username: string,
  roles: string[],
}
