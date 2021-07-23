/* eslint-disable @typescript-eslint/no-namespace, unused-imports/no-unused-vars-ts */
export type Query<TResult> = {};

export type Command = {};

export interface Auth {}
/**
 * This is a class-level comment.
 *
 */
export interface PaginatedQuery<TResult> extends Query<PaginatedResult<TResult>> {
    PageNumber: number;
    PageSize: number;
}
/**
 * This one is in XML.
 *
 */
export interface PaginatedResult<TResult> {
    /**
     * And this is a property comment.
     *
     */
    Items: TResult[];
    TotalCount: number;
}
export namespace Auth {
    export interface KnownClaims {}
    export const KnownClaims = {
        UserId: "sub",
        Role: "role",
    } as const;
    export interface Roles {}
    export const Roles = {
        User: "user",
        Admin: "admin",
        System: "system",
    } as const;
}
export namespace Security {
    export interface ISomethingRelated {
        SomethingId: string;
    }
    export interface WhenHasSomethingAccess {}
}
export namespace Users {
    export interface AllUsers extends PaginatedQuery<UserInfoDTO> {
        PageNumber: number;
        PageSize: number;
    }
    export interface EditUser extends Command, Security.ISomethingRelated {
        Email: string;
    }
    export namespace EditUser {
        export const ErrorCodes = {
            UserDoesNotExist: 1,
            EmailIsTaken: 1010,
        } as const;
        export type ErrorCodes = typeof ErrorCodes;
    }
    export interface UseCode extends Command {
        Code: string;
    }
    export interface UserById extends Query<UserInfoDTO> {}
    export interface UserInfoDTO {
        Firstname: string;
        Surname: string;
        Username: string;
        EmailAddress: string;
    }
    export interface UserSomething extends Query<number> {}
}
