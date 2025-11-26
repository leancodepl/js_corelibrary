export interface Token {
  token: string
  refreshToken: string
  expirationDate: Date
  abc?: string
}

export type TokenStorage = AsyncTokenStorage | SyncTokenStorage

export interface SyncTokenStorage {
  getToken(): null | Token
  storeToken(token: Token): void
  resetToken(): void
}

export interface AsyncTokenStorage {
  getToken(): Promise<null | Token>
  storeToken(token: Token): Promise<void>
  resetToken(): Promise<void>
}
