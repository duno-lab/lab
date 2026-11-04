export interface AuthUser {
  id: string
  username?: string
  email: string
  avatarUrl?: string | null
}

export interface OAuthLoginResponse {
  accessToken: string
  user: AuthUser
}

export interface AuthMeResponse {
  user: AuthUser
}
