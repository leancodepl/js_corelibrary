interface TokenStorage {
    token: string | null;
    refreshToken: string | null;
    expirationDate: Date | null;
}