interface Token {
    token: string;
    refreshToken: string;
    expirationDate: Date;
}

type TokenStorage = SyncTokenStorage | AsyncTokenStorage;

interface SyncTokenStorage {
    getToken(): Token | null;
    storeToken(token: Token): void;
    resetToken(): void;
}

interface AsyncTokenStorage {
    getToken(): Promise<Token | null>;
    storeToken(token: Token): Promise<void>;
    resetToken(): Promise<void>;
}
