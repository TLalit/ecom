export interface PostSignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface PostSignUpResponse {
  name: string | null;
  email: string;
}
