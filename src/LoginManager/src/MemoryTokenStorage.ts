/// <reference path="../TokenStorage.d.ts" />

export class MemoryTokenStorage implements TokenStorage {
    public token: string | null;
    public refreshToken: string | null;
    public expirationDate: Date | null;
}
