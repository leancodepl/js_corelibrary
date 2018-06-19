interface Token {
    token: string;
    refreshToken: string;
    expirationDate: Date;
}

interface TokenStorage {
    getToken(): Promise<Token | null>;
    storeToken(token: Token): Promise<void>;
    resetToken(): Promise<void>;
}
