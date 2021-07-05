/* eslint-disable @typescript-eslint/no-namespace */

interface Query<TResult> {}

interface Command {}

interface CQRS {}

interface hmmm {}

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
    export interface AuthorizeWhenHasSomethingAccessAttribute extends hmmm {
        TypeId: Partial<Record<string, any>>;
    }
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
        UserId: string;
        SomethingId: string;
        List: number[];
        Array: number[];
        Dictionary: number[];
        UserInfo: UserInfoDTO;
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

const x = Auth.KnownClaims.Role;
