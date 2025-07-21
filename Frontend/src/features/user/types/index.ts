export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdateUserProfilePayload {
  avatar?: string;
  banner?: string;
  bio?: string;
  birth?: Date;
  gender?: string;
}
