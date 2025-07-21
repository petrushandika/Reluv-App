export interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profile: UserProfile | null;
}

export interface UserProfile {
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  birth: Date | null;
  gender: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
