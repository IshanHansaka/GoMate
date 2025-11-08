export interface LoginFormData {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresInMins?: number;
}
