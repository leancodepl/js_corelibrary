/* eslint-disable import/prefer-default-export */
export class CannotRefreshToken extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, CannotRefreshToken.prototype);
    }
}
