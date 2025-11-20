export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birth?: Date | string;
}

export interface UpdateUserProfilePayload {
  avatar?: string;
  banner?: string;
  bio?: string;
  birth?: Date;
  gender?: string;
}
