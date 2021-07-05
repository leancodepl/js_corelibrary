/*eslint-disable @typescript-eslint/no-namespace*/
export namespace Admin {
    export namespace Challenges {
        export interface ChallengeById extends Query<ChallengeDTO> {
            ChallengeId: string;
        }
        export interface ChallengeDTO {
            Id: string;
            InternalName: string;
            PhotoUrl: string;
            Order: number;
            Color: string;
            IsActive: boolean;
            Localized: ChallengeLocalizedDTO[];
            MaintainUserLevel?: MaintainUserLevelMechanicsDTO;
            MaintainStreak?: MaintainStreakMechanicsDTO;
            DaysWithMeditation?: DaysWithMeditationMechanicsDTO;
            HoursMeditating?: HoursMeditatingMechanicsDTO;
            FinishCourse?: FinishCourseMechanicsDTO;
        }
        export interface ChallengeLocalizedDTO {
            LanguageCode: string;
            Name: string;
            Description: string;
        }
        export interface ChallengesList extends PaginatedQuery<ChallengeSummaryDTO> {
            PageNumber: number;
            PageSize: number;
        }
        export interface ChallengeSummaryDTO {
            Id: string;
            InternalName: string;
            IsActive: boolean;
            Type: string;
        }
        export interface ChallengeWriteDTO {
            Id: string;
            InternalName: string;
            PhotoUrl: string;
            Color: string;
            IsActive: boolean;
            Order: number;
            MaintainUserLevel?: MaintainUserLevelMechanicsDTO;
            MaintainStreak?: MaintainStreakMechanicsDTO;
            DaysWithMeditation?: DaysWithMeditationMechanicsDTO;
            HoursMeditating?: HoursMeditatingMechanicsDTO;
            FinishCourse?: FinishCourseMechanicsDTO;
        }
        export interface DaysWithMeditationMechanicsDTO {
            RequiredDays: number;
        }
        export interface DefineChallenge extends Command {
            ChallengeData: ChallengeWriteDTO;
        }
        export namespace DefineChallenge {
            export const ErrorCodes = {
                ChallengeDataIsNull: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditChallenge extends Command {
            ChallengeData: ChallengeWriteDTO;
        }
        export namespace EditChallenge {
            export const ErrorCodes = {
                ChallengeDataIsNull: 1,
                CannotChangeChallengeType: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditChallengeLocalizedData extends Command {
            ChallengeId: string;
            Data: ChallengeLocalizedDTO;
        }
        export namespace EditChallengeLocalizedData {
            export const ErrorCodes = {
                ChallengeDoesNotExist: 1,
                DataIsNull: 2,
                LanguageIsNotSupported: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface FinishCourseMechanicsDTO {
            CourseId: string;
        }
        export interface HoursMeditatingMechanicsDTO {
            RequiredHours: number;
        }
        export interface MaintainStreakMechanicsDTO {
            RequiredLength: number;
        }
        export interface MaintainUserLevelMechanicsDTO {
            RequiredDays: number;
        }
    }
    export namespace Companies {
        export interface AddCompany extends Command {
            CompanyId: string;
            InternalName: string;
            PhotoUrl: string;
            IsHidden: boolean;
        }
        export namespace AddCompany {
            export const ErrorCodes = {
                IdAlreadyUsed: 1,
                InternalNameIsTooShort: 2,
                InternalNameIsTooLong: 3,
                PhotoUrlIsInvalid: 4,
                PhotoUrlDoesNotExist: 5,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface AddCompanyCode extends Command {
            CompanyId: string;
            MaxUses: number;
        }
        export namespace AddCompanyCode {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
                MaxUsesMustBeGreaterThanOrEqual0: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface AddNewCompanyCodes extends Command {
            CompanyId: string;
            Count: number;
        }
        export namespace AddNewCompanyCodes {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
                CountMustBeGreaterThan0: 2,
                CountMustBeSmaller: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface CompaniesInfoList extends Query<CompanyInfoDTO[]> {}
        export interface CompaniesList extends SortablePaginatedQuery<CompanySummaryDTO, CompaniesListSortFieldDTO> {
            PageNumber: number;
            PageSize: number;
            FilterBy?: string;
            SortBy: CompaniesListSortFieldDTO;
            SortByDescending: boolean;
        }
        export enum CompaniesListSortFieldDTO {
            InternalName = 0,
        }
        export interface CompanyById extends Query<CompanyDTO> {
            CompanyId: string;
        }
        export interface CompanyCodeByCode extends Query<EntryCodeDTO> {
            Code: string;
        }
        export interface CompanyCodes extends PaginatedQuery<EntryCodeSummaryDTO> {
            PageNumber: number;
            PageSize: number;
            CompanyId: string;
            FilterByIsUsed?: boolean;
            SortBy: CompanyCodesSortFieldDTO;
            SortByDescending: boolean;
        }
        export enum CompanyCodesSortFieldDTO {
            EntryCode = 0,
            Used = 1,
            MaxUses = 2,
        }
        export interface CompanyDTO {
            Id: string;
            InternalName: string;
            PhotoUrl: string;
            IsHidden: boolean;
            Localized: CompanyLocalizedDTO[];
            CompanyProgramInfoPage?: Pages.PageDTO;
        }
        export interface CompanyInfoDTO {
            Id: string;
            InternalName: string;
        }
        export interface CompanyLocalizedDTO {
            LanguageCode: string;
            Name: string;
        }
        export interface CompanySummaryDTO {
            Id: string;
            InternalName: string;
            PhotoUrl: string;
            IsHidden: boolean;
        }
        export interface CompanyUsedCodeDTO {
            UsedById: string;
            UsedAt: string;
            UsedByUsername: string;
        }
        export interface EditCompany extends Command {
            CompanyId: string;
            InternalName: string;
            PhotoUrl: string;
            IsHidden: boolean;
        }
        export namespace EditCompany {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
                InternalNameIsTooShort: 2,
                InternalNameIsTooLong: 3,
                PhotoUrlIsInvalid: 4,
                PhotoUrlDoesNotExist: 5,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditCompanyCode extends Command {
            CodeId: string;
            MaxUses: number;
        }
        export namespace EditCompanyCode {
            export const ErrorCodes = {
                CodeDoesNotExist: 1,
                MaxUsesMustBeGreaterThanOrEqual0: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditCompanyLocalizedData extends Command {
            CompanyId: string;
            Data: CompanyLocalizedDTO;
        }
        export namespace EditCompanyLocalizedData {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
                DataIsNull: 2,
                LanguageIsNotSupported: 3,
                NameIsEmpty: 4,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EntryCodeDTO {
            Code: string;
            Used: number;
            MaxUses: number;
            UsedBy: CompanyUsedCodeDTO[];
        }
        export interface EntryCodeSummaryDTO {
            Code: string;
            Used: number;
            MaxUses: number;
            IsUsed: boolean;
            UsedById?: string;
            UsedAt?: string;
            UsedByUsername?: string;
        }
        export interface MemberDTO {
            Id: string;
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
        }
        export interface MembersList extends PaginatedQuery<MemberDTO> {
            PageNumber: number;
            PageSize: number;
            CompanyId: string;
        }
        export interface RemoveCompanyCode extends Command {
            CodeId: string;
        }
        export namespace RemoveCompanyCode {
            export const ErrorCodes = {
                CodeDoesNotExist: 1,
                CodeWasAlreadyUsed: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface SetIsHiddenCompany extends Command {
            CompanyId: string;
            IsHidden: boolean;
        }
        export namespace SetIsHiddenCompany {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
    }
    export interface ContentPhotoUploadLink extends Query<UploadLinkDTO> {
        ContentId: string;
        Extension: string;
    }
    export interface UploadLinkDTO {
        Url: string;
        SasToken: string;
        Headers: {
            [key in string]: number;
        };
    }
    export namespace Library {
        export namespace Collections {
            export interface AddCollection extends Command {
                CollectionData: CollectionWriteDTO;
            }
            export namespace AddCollection {
                export const ErrorCodes = {
                    CollectionDataNotProvided: 1,
                    CollectionIdAlreadyUsed: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface CollectionById extends Query<CollectionDTO> {
                CollectionId: string;
            }
            export interface CollectionDTO {
                Id: string;
                InternalTitle: string;
                Order: number;
                IsHidden: boolean;
                SessionsIds: string[];
                TagsIds: string[];
                LocalizedCollections: CollectionLocalizedDTO[];
            }
            export interface CollectionInfoDTO {
                Id: string;
                InternalTitle: string;
            }
            export interface CollectionLocalizedDTO {
                LanguageCode: string;
                Title: string;
            }
            export interface CollectionsInfoList extends Query<CollectionInfoDTO[]> {}
            export interface CollectionsList
                extends SortablePaginatedQuery<CollectionSummaryDTO, CollectionsListSortFieldDTO> {
                PageNumber: number;
                PageSize: number;
                FilterBy?: string;
                SortBy: CollectionsListSortFieldDTO;
                SortByDescending: boolean;
            }
            export enum CollectionsListSortFieldDTO {
                Order = 0,
                InternalTitle = 1,
            }
            export interface CollectionSummaryDTO {
                Id: string;
                InternalTitle: string;
                IsHidden: boolean;
                TotalSessions: number;
                Tags: Tags.TagInfoDTO[];
                LocalizedLanguages: string[];
            }
            export interface CollectionWriteDTO {
                Id: string;
                InternalTitle: string;
                Order: number;
                IsHidden: boolean;
                SessionsIds: string[];
                TagsIds: string[];
            }
            export interface EditCollection extends Command {
                CollectionData: CollectionWriteDTO;
            }
            export namespace EditCollection {
                export const ErrorCodes = {
                    InvalidCollectionId: 1,
                    CollectionDataNotProvided: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditCollectionLocalizedData extends Command {
                CollectionId: string;
                LanguageCode: string;
                Title: string;
            }
            export namespace EditCollectionLocalizedData {
                export const ErrorCodes = {
                    EmptyTitle: 1,
                    TitleTooLong: 2,
                    InvalidCollectionId: 3,
                    LanguageCodeNotProvided: 4,
                    LanguageCodeNotSupported: 5,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface RemoveCollection extends Command {
                CollectionId: string;
            }
            export namespace RemoveCollection {
                export const ErrorCodes = {
                    InvalidCollectionId: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface SetIsHiddenCollection extends Command {
                CollectionId: string;
                IsHidden: boolean;
            }
            export namespace SetIsHiddenCollection {
                export const ErrorCodes = {
                    CollectionDoesNotExist: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
        }
        export namespace Courses {
            export interface AddCourse extends Command {
                CourseData: CourseWriteDTO;
            }
            export namespace AddCourse {
                export const ErrorCodes = {
                    CourseDataNotProvided: 1,
                    CourseIdAlreadyUsed: 2,
                    PhotoUrlInvalid: 3,
                    PhotoDoesNotExist: 4,
                    AuthorPhotoUrlInvalid: 5,
                    AuthorPhotoDoesNotExist: 6,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface CourseById extends Query<CourseDTO> {
                CourseId: string;
            }
            export interface CourseDTO {
                Id: string;
                InternalTitle: string;
                Author: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                Order: number;
                IsHidden: boolean;
                IsBasics: boolean;
                LocalizedCourses: CourseLocalizedDTO[];
                CourseGroups: CourseGroupDTO[];
            }
            export interface CourseGroupDTO {
                Id: string;
                Order: number;
                LocalizedCourseGroups: CourseGroupLocalizedDTO[];
                CourseSubgroups: CourseSubgroupDTO[];
            }
            export interface CourseGroupLocalizedDTO {
                LanguageCode: string;
                Title: string;
            }
            export interface CourseGroupWriteDTO {
                Id: string;
                Order: number;
                CourseSubgroups: CourseSubgroupWriteDTO[];
            }
            export interface CourseInfoDTO {
                Id: string;
                InternalTitle: string;
            }
            export interface CourseLocalizedDTO {
                LanguageCode: string;
                Title: string;
                LongDescription: string;
                ShortDescription: string;
            }
            export interface CoursesInfoList extends Query<CourseInfoDTO[]> {}
            export interface CoursesList extends SortablePaginatedQuery<CourseSummaryDTO, CoursesListSortFieldDTO> {
                PageNumber: number;
                PageSize: number;
                FilterBy?: string;
                SortBy: CoursesListSortFieldDTO;
                SortByDescending: boolean;
            }
            export enum CoursesListSortFieldDTO {
                Order = 0,
                InternalTitle = 1,
                Author = 2,
            }
            export interface CourseSubgroupDTO {
                Id: string;
                Order: number;
                LocalizedCourseSubgroups: CourseSubgroupLocalizedDTO[];
                SessionsIds: string[];
            }
            export interface CourseSubgroupLocalizedDTO {
                LanguageCode: string;
                Title: string;
            }
            export interface CourseSubgroupWriteDTO {
                Id: string;
                Order: number;
                SessionsIds: string[];
            }
            export interface CourseSummaryDTO {
                Id: string;
                InternalTitle: string;
                Author: string;
                PhotoUrl?: string;
                IsHidden: boolean;
                LocalizedLanguages: string[];
            }
            export interface CourseWriteDTO {
                Id: string;
                InternalTitle: string;
                Author: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                Order: number;
                IsHidden: boolean;
                IsBasics: boolean;
                CourseGroups: CourseGroupWriteDTO[];
            }
            export interface EditCourse extends Command {
                CourseData: CourseWriteDTO;
            }
            export namespace EditCourse {
                export const ErrorCodes = {
                    InvalidCourseId: 1,
                    CourseDataNotProvided: 2,
                    PhotoUrlInvalid: 3,
                    PhotoDoesNotExist: 4,
                    AuthorPhotoUrlInvalid: 5,
                    AuthorPhotoDoesNotExist: 6,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditCourseLocalizedData extends Command {
                CourseId: string;
                LanguageCode: string;
                Title: string;
                LongDescription: string;
                ShortDescription: string;
                LocalizedGroups: GroupLocalizedDTO[];
            }
            export namespace EditCourseLocalizedData {
                export const ErrorCodes = {
                    InvalidCourseId: 1,
                    LanguageCodeNotProvided: 2,
                    LanguageCodeNotSupported: 3,
                    EmptyTitle: 4,
                    TitleTooLong: 5,
                    ShortDescriptionNotProvided: 6,
                    ShortDescriptionTooLong: 7,
                    LongDescriptionNotProvided: 8,
                    LongDescriptionTooLong: 9,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface GroupLocalizedDTO {
                GroupId: string;
                Title: string;
                LocalizedSubgroups: SubgroupLocalizedDTO[];
            }
            export interface RemoveCourse extends Command {
                CourseId: string;
            }
            export namespace RemoveCourse {
                export const ErrorCodes = {
                    InvalidCourseId: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface SetIsHiddenCourse extends Command {
                CourseId: string;
                IsHidden: boolean;
            }
            export namespace SetIsHiddenCourse {
                export const ErrorCodes = {
                    CourseDoesNotExist: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface SubgroupLocalizedDTO {
                SubgroupId: string;
                Title: string;
            }
        }
        export namespace Persons {
            export interface AddPerson extends Command {
                PersonData: PersonWriteDTO;
            }
            export namespace AddPerson {
                export const ErrorCodes = {
                    PersonDataNotProvided: 1,
                    PersonIdAlreadyUsed: 2,
                    PhotoUrlInvalid: 3,
                    PhotoDoesNotExist: 4,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface PersonWriteDTO {
                Id: string;
                Name: string;
                PhotoUrl?: string;
                Order: number;
                Role: RoleDTO;
            }
            export enum RoleDTO {
                Author = 0,
                Lector = 1,
            }
        }
        export namespace Sessions {
            export interface AddSession extends Command {
                SessionData: SessionWriteDTO;
            }
            export namespace AddSession {
                export const ErrorCodes = {
                    SessionDataNotProvided: 1,
                    SessionIdAlreadyUsed: 2,
                    PhotoUrlInvalid: 3,
                    PhotoDoesNotExist: 4,
                    RecordingUrlInvalid: 5,
                    RecordingDoesNotExist: 6,
                    AuthorPhotoUrlInvalid: 7,
                    AuthorPhotoDoesNotExist: 8,
                    DefaultAlreadySet: 9,
                    SessionHiddenAndDefault: 10,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface AddSessionToCollection extends Command {
                SessionId: string;
                CollectionId: string;
            }
            export namespace AddSessionToCollection {
                export const ErrorCodes = {
                    SessionDoesNotExist: 1,
                    CollectionDoesNotExist: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface ArchiveSession extends Command {
                SessionId: string;
            }
            export namespace ArchiveSession {
                export const ErrorCodes = {
                    InvalidSessionId: 1,
                    SessionInCollections: 2,
                    SessionInCourses: 3,
                    SessionIsDefault: 4,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditSession extends Command {
                SessionData: SessionWriteDTO;
            }
            export namespace EditSession {
                export const ErrorCodes = {
                    InvalidSessionId: 1,
                    SessionDataNotProvided: 2,
                    PhotoUrlInvalid: 3,
                    PhotoDoesNotExist: 4,
                    RecordingUrlInvalid: 5,
                    RecordingDoesNotExist: 6,
                    AuthorPhotoUrlInvalid: 7,
                    AuthorPhotoDoesNotExist: 8,
                    DefaultAlreadySet: 9,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditSessionLocalizedData extends Command {
                SessionId: string;
                LanguageCode: string;
                Title: string;
                Description: string;
                Quote: string;
            }
            export namespace EditSessionLocalizedData {
                export const ErrorCodes = {
                    EmptyTitle: 1,
                    DescriptionNotProvided: 2,
                    QuoteNotProvided: 3,
                    TitleTooLong: 4,
                    DescriptionTooLong: 5,
                    QuoteTooLong: 6,
                    InvalidSessionId: 7,
                    LanguageCodeNotProvided: 8,
                    LanguageCodeNotSupported: 9,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface RecordingDTO {
                LanguageCode: string;
                Length: number;
                Reader: string;
                RecordingAddress: string;
            }
            export interface RemoveSessionFromCollection extends Command {
                SessionId: string;
                CollectionId: string;
            }
            export namespace RemoveSessionFromCollection {
                export const ErrorCodes = {
                    SessionDoesNotExist: 1,
                    CollectionDoesNotExist: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface SessionById extends Query<SessionDTO> {
                SessionId: string;
            }
            export interface SessionDTO {
                Id: string;
                InternalTitle: string;
                AuthorId?: string;
                Author: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                Type: Shared.Sessions.SessionTypeDTO;
                Order: number;
                IsHidden: boolean;
                IsDefault: boolean;
                IsFree: boolean;
                LocalizedSessions: SessionLocalizedDTO[];
                Recordings: RecordingDTO[];
                CollectionsIds: string[];
                TagsIds: string[];
            }
            export interface SessionInfoDTO {
                Id: string;
                InternalTitle: string;
                IsHidden: boolean;
            }
            export interface SessionLocalizedDTO {
                LanguageCode: string;
                Title: string;
                Description: string;
                Quote: string;
            }
            export interface SessionRecordingUploadLink extends Query<UploadLinkDTO> {
                SessionId: string;
                Extension: string;
            }
            export interface SessionsInfoList extends Query<SessionInfoDTO[]> {}
            export interface SessionsList extends SortablePaginatedQuery<SessionSummaryDTO, SessionsListSortFieldDTO> {
                PageNumber: number;
                PageSize: number;
                FilterBy?: string;
                SortBy: SessionsListSortFieldDTO;
                SortByDescending: boolean;
            }
            export enum SessionsListSortFieldDTO {
                Order = 0,
                InternalTitle = 1,
                Author = 2,
            }
            export interface SessionSummaryDTO {
                Id: string;
                InternalTitle: string;
                Author: string;
                PhotoUrl?: string;
                Type: Shared.Sessions.SessionTypeDTO;
                IsHidden: boolean;
                IsDefault: boolean;
                IsFree: boolean;
                LocalizedLanguages: string[];
                Collections: Collections.CollectionInfoDTO[];
                Tags: Tags.TagInfoDTO[];
            }
            export interface SessionWriteDTO {
                Id: string;
                InternalTitle: string;
                Author: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                Type: Shared.Sessions.SessionTypeDTO;
                Order: number;
                IsHidden: boolean;
                IsDefault: boolean;
                IsFree: boolean;
                Recordings: RecordingDTO[];
                TagsIds: string[];
            }
            export interface SetIsHiddenSession extends Command {
                SessionId: string;
                IsHidden: boolean;
            }
            export namespace SetIsHiddenSession {
                export const ErrorCodes = {
                    SessionDoesNotExist: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
        }
        export namespace Tags {
            export interface AddTag extends Command {
                TagData: TagWriteDTO;
            }
            export namespace AddTag {
                export const ErrorCodes = {
                    TagDataNotProvided: 1,
                    TagIdAlreadyUsed: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditTag extends Command {
                TagData: TagWriteDTO;
            }
            export namespace EditTag {
                export const ErrorCodes = {
                    TagDataNotProvided: 1,
                    TagIdAlreadyUsed: 2,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface EditTagLocalizedData extends Command {
                TagId: string;
                LanguageCode: string;
                Title: string;
            }
            export namespace EditTagLocalizedData {
                export const ErrorCodes = {
                    EmptyTitle: 1,
                    TitleTooLong: 2,
                    InvalidTagId: 3,
                    LanguageCodeNotProvided: 4,
                    LanguageCodeNotSupported: 5,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface RemoveTag extends Command {
                TagId: string;
            }
            export namespace RemoveTag {
                export const ErrorCodes = {
                    InvalidTagId: 1,
                    TagInCollections: 2,
                    TagInSessions: 3,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface SetIsHiddenTag extends Command {
                TagId: string;
                IsHidden: boolean;
            }
            export namespace SetIsHiddenTag {
                export const ErrorCodes = {
                    TagDoesNotExist: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface TagById extends Query<TagDTO> {
                TagId: string;
            }
            export interface TagDTO {
                Id: string;
                InternalTitle: string;
                Order: number;
                IsHidden: boolean;
                LocalizedTags: TagLocalizedDTO[];
            }
            export interface TagInfoDTO {
                Id: string;
                InternalTitle: string;
            }
            export interface TagLocalizedDTO {
                LanguageCode: string;
                Title: string;
            }
            export interface TagsInfoList extends Query<TagInfoDTO[]> {}
            export interface TagsList extends SortablePaginatedQuery<TagSummaryDTO, TagsListSortFieldDTO> {
                PageNumber: number;
                PageSize: number;
                FilterBy?: string;
                SortBy: TagsListSortFieldDTO;
                SortByDescending: boolean;
            }
            export enum TagsListSortFieldDTO {
                Order = 0,
                InternalTitle = 1,
            }
            export interface TagSummaryDTO {
                Id: string;
                InternalTitle: string;
                IsHidden: boolean;
                LocalizedLanguages: string[];
            }
            export interface TagWriteDTO {
                Id: string;
                InternalTitle: string;
                Order: number;
                IsHidden: boolean;
            }
        }
        export namespace TodaysMeditations {
            export interface SetTodaysMeditation extends Command {
                Date: string;
                SessionId: string;
            }
            export namespace SetTodaysMeditation {
                export const ErrorCodes = {
                    SessionDoesntExist: 1,
                } as const;
                export type ErrorCodes = typeof ErrorCodes;
            }
            export interface TodaysMeditationDTO {
                Date: string;
                SessionId: string;
                SessionInternalTitle: string;
            }
            export interface TodaysMeditationsList extends PaginatedQuery<TodaysMeditationDTO> {
                PageNumber: number;
                PageSize: number;
                FilterByFrom?: string;
                FilterByTo?: string;
            }
        }
    }
    export namespace Pages {
        export interface AddApplicationPage extends Command {
            Id: string;
            Category: Shared.Pages.ApplicationPageCategoryDTO;
        }
        export namespace AddApplicationPage {
            export const ErrorCodes = {
                InvalidPageCategory: 1,
                PageIdAlreadyUsed: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface AddCompanyPage extends Command {
            Id: string;
            CompanyId: string;
            Category: Shared.Pages.CompanyPageCategoryDTO;
        }
        export namespace AddCompanyPage {
            export const ErrorCodes = {
                CompanyDoesNotExist: 1,
                CompanyPageAlreadyExists: 2,
                InvalidPageCategory: 3,
                PageIdAlreadyUsed: 4,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface ApplicationPage extends Query<PageDTO> {
            Category: Shared.Pages.ApplicationPageCategoryDTO;
        }
        export interface EditPageLocalizedContent extends Command {
            PageId: string;
            LanguageCode: string;
            Content: string;
        }
        export namespace EditPageLocalizedContent {
            export const ErrorCodes = {
                PageDoesNotExist: 1,
                ContentIsNullOrEmpty: 2,
                LanguageCodeNotProvided: 3,
                LanguageCodeNotSupported: 4,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface PageDTO {
            Id: string;
            PageCategory: Shared.Pages.PageCategoryDTO;
            CompanyId?: string;
            LocalizedPages: PageLocalizedDTO[];
        }
        export interface PageLocalizedDTO {
            LanguageCode: string;
            Content: string;
        }
        export interface RemovePage extends Command {
            PageId: string;
        }
        export namespace RemovePage {
            export const ErrorCodes = {
                PageDoesNotExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
    }
    export namespace Subscriptions {
        export interface ActivateInternalSubscription extends Command {
            UserId: string;
            ExpirationDate: string;
        }
        export namespace ActivateInternalSubscription {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface AddPromoCode extends Command {
            CodeId: string;
            PromoCodeData: PromoCodeWriteDTO;
        }
        export namespace AddPromoCode {
            export const ErrorCodes = {
                CodeIsEmpty: 1,
                CodeIsTooLong: 2,
                CodeHasForbiddenLength: 3,
                CodeAlreadyExists: 4,
                PromoCodeDataIsNull: 5,
                GoogleProductId1IsEmpty: 10001,
                GoogleProductId2IsNull: 10002,
                AppleProductId1IsEmpty: 10003,
                AppleProductId2IsNull: 10004,
                MaxUsesMustBeGreaterThanOrEqual0: 10005,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface DeactivateInternalSubscription extends Command {
            UserId: string;
        }
        export namespace DeactivateInternalSubscription {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditPromoCodeMaxUses extends Command {
            CodeId: string;
            MaxUses: number;
        }
        export namespace EditPromoCodeMaxUses {
            export const ErrorCodes = {
                CodeDoesNotExist: 1,
                MaxUsesMustBeGreaterThanOrEqual0: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface GeneratePromoCodes extends Command {
            Count: number;
            PromoCodeData: PromoCodeWriteDTO;
        }
        export namespace GeneratePromoCodes {
            export const ErrorCodes = {
                CountMustBeGreaterThan0: 1,
                CountMustBeSmaller: 2,
                PromoCodeDataIsNull: 3,
                GoogleProductId1IsEmpty: 10001,
                GoogleProductId2IsNull: 10002,
                AppleProductId1IsEmpty: 10003,
                AppleProductId2IsNull: 10004,
                MaxUsesMustBeGreaterThanOrEqual0: 10005,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface PromoCodeById extends Query<PromoCodeDTO> {
            CodeId: string;
        }
        export interface PromoCodeDTO {
            CodeId: string;
            Used: number;
            MaxUses: number;
            GoogleProductId1: string;
            GoogleProductId2: string;
            AppleProductId1: string;
            AppleProductId2: string;
            UsedBy: PromoCodeUsedByDTO[];
        }
        export interface PromoCodesList
            extends SortablePaginatedQuery<PromoCodeSummaryDTO, PromoCodesListSortFieldDTO> {
            PageNumber: number;
            PageSize: number;
            FilterBy?: string;
            SortBy: PromoCodesListSortFieldDTO;
            SortByDescending: boolean;
            /**
             * This can be used in CSV exports to export all the records, without paging.
             *
             */
            ExportAll: boolean;
        }
        export enum PromoCodesListSortFieldDTO {
            CodeId = 0,
            Used = 1,
            MaxUses = 2,
            GoogleProductId1 = 3,
            GoogleProductId2 = 4,
            AppleProductId1 = 5,
            AppleProductId2 = 6,
        }
        export interface PromoCodeSummaryDTO {
            CodeId: string;
            Used: number;
            MaxUses: number;
            GoogleProductId1: string;
            GoogleProductId2: string;
            AppleProductId1: string;
            AppleProductId2: string;
        }
        export interface PromoCodeUsedByDTO {
            UsedById: string;
            UsedAt: string;
            UsedByUsername: string;
        }
        export interface PromoCodeWriteDTO {
            MaxUses: number;
            GoogleProductId1: string;
            GoogleProductId2: string;
            AppleProductId1: string;
            AppleProductId2: string;
        }
        export interface RemovePromoCode extends Command {
            CodeId: string;
        }
        export namespace RemovePromoCode {
            export const ErrorCodes = {
                CodeDoesNotExist: 1,
                CodeWasAlreadyUsed: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
    }
    export namespace Users {
        export interface AddFriendToUser extends Command {
            UserId: string;
            FriendUserId: string;
        }
        export namespace AddFriendToUser {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                FriendUserDoesNotExist: 2,
                CannotBefriendSelf: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface ChangeUserCompany extends Command {
            UserId: string;
            CompanyId: string;
        }
        export namespace ChangeUserCompany {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                CompanyDoesNotExist: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface DeleteUser extends Command {
            UserId: string;
        }
        export namespace DeleteUser {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                CannotDeleteSelf: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface EditUser extends Command {
            UserId: string;
            UserInfo: Shared.Users.UserInfoDTO;
        }
        export namespace EditUser {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                UserInfoIsNull: 2,
                FirstnameIsNull: 1001,
                SurnameIsNull: 1002,
                UsernameIsNull: 1003,
                FirstnameTooLong: 1004,
                SurnameTooLong: 1005,
                UsernameTooLong: 1006,
                EmailAddressTooLong: 1007,
                InvalidEmailAddress: 1009,
                EmailIsTaken: 1010,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface InternalSubscriptionDTO {
            Active: boolean;
            StartDate?: string;
            ExpirationDate?: string;
        }
        export interface RemoveFriendFromUser extends Command {
            UserId: string;
            FriendUserId: string;
        }
        export namespace RemoveFriendFromUser {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                FriendUserDoesNotExist: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface SubscriptionDTO {
            IsActive: boolean;
            StartDate?: string;
            /**
             * Not `null` when `IsActive` is `true`.
             *     When `IsActive` is `false` it might be or might not be empty.
             *
             */
            ExpirationDate?: string;
            /**
             * Not `null` when `IsActive` is `true`.
             *     When `IsActive` is `false` it might be or might not be empty.
             *
             */
            ProductId?: string;
        }
        export interface ThrowUserOutOfCompany extends Command {
            UserId: string;
        }
        export namespace ThrowUserOutOfCompany {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface UpdateUserPassword extends Command {
            UserId: string;
            NewPassword: string;
        }
        export namespace UpdateUserPassword {
            export const ErrorCodes = {
                UserDoesNotExist: 1,
                NewPasswordIsTooWeak: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface UserById extends Query<UserDTO> {
            UserId: string;
        }
        export interface UserDTO {
            Id: string;
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
            IsPremium: boolean;
            Company?: Companies.CompanyInfoDTO;
            IndividualSubscription: SubscriptionDTO;
            InternalSubscription: InternalSubscriptionDTO;
            RegisteredAt: string;
            FirstActivity?: string;
        }
        export interface UserFriendDTO {
            UserId: string;
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
            AvatarUrl: string;
            AddedAt: string;
        }
        export interface UserFriends extends SortablePaginatedQuery<UserFriendDTO, UserFriendsSortFieldDTO> {
            PageNumber: number;
            PageSize: number;
            FilterBy?: string;
            SortBy: UserFriendsSortFieldDTO;
            SortByDescending: boolean;
            UserId: string;
        }
        export enum UserFriendsSortFieldDTO {
            Username = 0,
            Firstname = 1,
            Surname = 2,
            EmailAddress = 3,
            AddedAt = 4,
        }
        export interface UsersList extends SortablePaginatedQuery<UserSummaryDTO, UsersListSortFieldDTO> {
            PageNumber: number;
            PageSize: number;
            FilterBy?: string;
            SortBy: UsersListSortFieldDTO;
            SortByDescending: boolean;
        }
        export enum UsersListSortFieldDTO {
            Username = 0,
            Firstname = 1,
            Surname = 2,
            EmailAddress = 3,
            IsPremium = 4,
            RegisteredAt = 5,
        }
        export interface UserSummaryDTO {
            Id: string;
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
            IsPremium: boolean;
            Company?: Companies.CompanyInfoDTO;
            RegisteredAt: string;
        }
    }
}
export interface Auth {}
export interface PaginatedQuery<TResult> extends Query<PaginatedResult<TResult>> {
    PageNumber: number;
    PageSize: number;
}
export interface PaginatedResult<TResult> {
    Items: TResult[];
    TotalCount: number;
}
export interface SortablePaginatedQuery<TResult, TBy> extends PaginatedQuery<TResult> {
    PageNumber: number;
    PageSize: number;
    FilterBy?: string;
    SortBy: TBy;
    SortByDescending: boolean;
}
export namespace Auth {
    export interface Clients {}
    export const Clients = {
        AdminApp: "admin_app",
        ClientApp: "client_app",
    } as const;
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
    export interface Scopes {}
    export const Scopes = {
        InternalApi: "internal_api",
    } as const;
}
export namespace Mobile {
    export namespace Game {
        export namespace B2B {
            export interface ChallengeInCompanyDTO extends ChallengeDTO {
                Id: string;
                Name: string;
                Description: string;
                PhotoUrl: string;
                Color: string;
                Type: string;
                Progress: number;
                IsFinished: boolean;
                BuddiesThatFinishedChallenge: number;
            }
            export enum MeditatedStatsDayDTO {
                Today = 0,
                Yesterday = 1,
            }
            export interface MeditatingBuddies extends Query<MeditatingBuddiesDTO> {
                CalculateAt: string;
            }
            export interface MeditatingBuddiesDTO {
                MeditatedDay: MeditatedStatsDayDTO;
                MeditatedCount: number;
                Buddies: MeditatingBuddyDTO[];
            }
            export interface MeditatingBuddyDTO {
                UserId: string;
                Username: string;
                AvatarUrl: string;
                StreakLength: number;
            }
            export interface MyCompany extends Query<MyCompanyDTO> {
                CalculateAt: string;
                LanguageCode: string;
            }
            export interface MyCompanyDTO {
                Id: string;
                Name: string;
                PhotoUrl: string;
                MeditatedDay: MeditatedStatsDayDTO;
                Meditated: number;
                TotalMembers: number;
                Challenges: ChallengeInCompanyDTO[];
                CreatedAt: string;
            }
            export interface MyCompanyStatistics extends Query<TimedCompanyStatisticsDTO> {
                CalculateAt: string;
            }
            export const MyCompanyStatistics = {
                /**
                 * In months.
                 *  */
                MaxTimeDifference: 12,
            } as const;
            export interface TimedCompanyStatisticsDTO {
                MindfulMinutes: number;
                MindfulDays: number;
                ActiveBuddies: number;
            }
        }
        export namespace B2C {
            export interface PersonalChallengeById extends Query<PersonalChallengeDTO> {
                ChallengeId: string;
                LanguageCode: string;
            }
            export interface PersonalChallengeDTO extends ChallengeDTO {
                Id: string;
                Name: string;
                Description: string;
                PhotoUrl: string;
                Color: string;
                Type: string;
                Progress: number;
                IsFinished: boolean;
                FriendsThatFinishedChallenge: number;
            }
            export interface PersonalChallengesList extends Query<PersonalChallengeDTO[]> {
                LanguageCode: string;
            }
        }
        export interface ChallengeContenderDTO {
            UserId: string;
            Username: string;
            AvatarUrl: string;
            Progress: number;
            IsFinished: boolean;
        }
        export interface ChallengeContenders extends Query<ChallengeContenderDTO[]> {
            ChallengeId: string;
            ContendersType: ChallengeContendersTypeDTO;
        }
        export enum ChallengeContendersTypeDTO {
            Friends = 0,
            Buddies = 1,
        }
        export interface ChallengeDTO {
            Id: string;
            Name: string;
            Description: string;
            PhotoUrl: string;
            Color: string;
            Type: string;
            Progress: number;
            IsFinished: boolean;
        }
    }
    export namespace Library {
        export namespace Collections {
            export interface CollectionDTO {
                Id: string;
                Title: string;
                Tags: Tags.TagDTO[];
            }
            export interface CollectionsList extends Query<CollectionDTO[]> {
                LanguageCode: string;
            }
        }
        export namespace Courses {
            export interface CourseById extends Query<CourseDTO> {
                CourseId: string;
                LanguageCode: string;
            }
            export interface CourseDTO {
                Id: string;
                Title: string;
                LongDescription: string;
                ShortDescription: string;
                IsFinished: boolean;
                Progress: number;
                Author: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                IsBasics: boolean;
                CourseGroups: CourseGroupDTO[];
            }
            export interface CourseGroupDTO {
                Id: string;
                Title: string;
                IsFinished: boolean;
                CourseSubgroups: CourseSubgroupDTO[];
            }
            export interface CoursesList extends Query<CourseSummaryDTO[]> {
                LanguageCode: string;
            }
            export interface CourseSubgroupDTO {
                Id: string;
                Title: string;
                IsFinished: boolean;
                Sessions: SessionInCourseDTO[];
                /**
                 * @deprecated
                 */
                SessionsIds: string[];
            }
            export interface CourseSummaryDTO {
                Id: string;
                Title: string;
                LongDescription: string;
                ShortDescription: string;
                IsFinished: boolean;
                Progress: number;
                PhotoUrl?: string;
                IsBasics: boolean;
            }
            export interface MyCourses extends Query<CourseSummaryDTO[]> {
                LanguageCode: string;
            }
            export interface SessionInCourseDTO extends Sessions.SessionSummaryDTO {
                Id: string;
                Title: string;
                PhotoUrl?: string;
                IsFree: boolean;
                ShortestRecording: number;
                LongestRecording: number;
                IsFinished: boolean;
            }
        }
        export namespace Sessions {
            export interface MyFavoriteSessions extends Query<SessionInCollectionDTO[]> {
                LanguageCode: string;
                PageNumber: number;
                PageSize: number;
            }
            export interface MyListenedSessions extends Query<SessionListenedDTO[]> {
                LanguageCode: string;
            }
            export interface MyRecentSessions extends Query<SessionSummaryDTO[]> {
                LanguageCode: string;
            }
            export interface RandomSessionsFromCollection extends Query<SessionSummaryDTO[]> {
                CollectionId: string;
                LanguageCode: string;
            }
            export interface RecordingDTO {
                Length: number;
                Reader: string;
                RecordingAddress: string;
            }
            export interface SessionById extends Query<SessionDTO>, Security.ISessionRelated {
                SessionId: string;
                LanguageCode: string;
            }
            export interface SessionDTO {
                Id: string;
                Author: string;
                Title: string;
                Description: string;
                Quote: string;
                AuthorId?: string;
                AuthorPhotoUrl?: string;
                PhotoUrl?: string;
                Type: Shared.Sessions.SessionTypeDTO;
                IsFree: boolean;
                IsFavorite: boolean;
                Recordings: RecordingDTO[];
            }
            export interface SessionInCollectionDTO extends SessionSummaryDTO {
                Id: string;
                Title: string;
                PhotoUrl?: string;
                IsFree: boolean;
                ShortestRecording: number;
                LongestRecording: number;
                Tags: Tags.TagDTO[];
            }
            export interface SessionListenedDTO extends SessionSummaryDTO {
                Id: string;
                Title: string;
                PhotoUrl?: string;
                IsFree: boolean;
                ShortestRecording: number;
                LongestRecording: number;
                DayListened: string;
            }
            export interface SessionsByCollectionId extends Query<SessionInCollectionDTO[]> {
                CollectionId: string;
                LanguageCode: string;
            }
            export interface SessionsByCourseId extends Query<Courses.SessionInCourseDTO[]> {
                CourseId: string;
                LanguageCode: string;
            }
            export interface SessionSummaryDTO {
                Id: string;
                Title: string;
                PhotoUrl?: string;
                IsFree: boolean;
                ShortestRecording: number;
                LongestRecording: number;
            }
            export interface TodaysSession extends Query<SessionSummaryDTO> {
                LanguageCode: string;
                Date: string;
            }
        }
        export namespace Tags {
            export interface TagDTO {
                Id: string;
                Title: string;
            }
        }
    }
    export namespace Pages {
        export interface ApplicationPage extends Query<PageDTO> {
            PageCategory: Shared.Pages.ApplicationPageCategoryDTO;
            LanguageCode: string;
        }
        export interface CompanyPage extends Query<PageDTO> {
            PageCategory: Shared.Pages.CompanyPageCategoryDTO;
            CompanyId: string;
            LanguageCode: string;
        }
        export interface PageDTO {
            Id: string;
            PageCategory: Shared.Pages.PageCategoryDTO;
            CompanyId?: string;
            Content: string;
        }
    }
    export namespace Progress {
        export interface FinishSessionInCourse extends Command {
            CourseId: string;
            SessionId: string;
            DateListened: string;
        }
        export namespace FinishSessionInCourse {
            export const ErrorCodes = {
                CourseDoesNotExist: 1,
                SessionDoesNotExist: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface ListenToSession extends Command {
            SessionId: string;
            DateListened: string;
            Length: number;
        }
        export namespace ListenToSession {
            export const ErrorCodes = {
                SessionDoesNotExist: 1,
                LengthMustBeGreaterThanZero: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
    }
    export namespace Statistics {
        export interface AllTimeStatisticsDTO {
            MindfulMinutes: number;
            MindfulDays: number;
            LongestStreak: number;
        }
        export interface CalendarDTO {
            DaysWithSessions: string[];
        }
        export interface MyCalendar extends Query<CalendarDTO> {
            /**
             * This date must be in the past and must be no older than `MaxTimeDifference` months.
             *
             */
            CalculateAt: string;
        }
        export const MyCalendar = {
            /**
             * In months.
             *  */
            MaxTimeDifference: 12,
        } as const;
        export interface MyStatistics extends Query<StatisticsDTO> {}
        export interface StatisticsDTO {
            RegisteredAt: string;
            AllTime: AllTimeStatisticsDTO;
            Monthly: {
                [key in string]: number;
            };
            Yearly: {
                [key in string]: number;
            };
        }
        export interface TimedStatisticsDTO {
            MindfulMinutes: number;
            MindfulDays: number;
            ListenedSessions: number;
        }
    }
    export namespace Subscriptions {
        export interface ApplePurchaseStatus extends Query<PurchaseStatusResultDTO> {
            Receipt: string;
        }
        export interface ClaimApplePurchase extends Command {
            Receipt: string;
            Currency?: string;
            /**
             * We might use `decimal` here as Mobile treats it as `double` so we risk nothing.
             *
             */
            Value?: number;
            Os?: string;
        }
        export namespace ClaimApplePurchase {
            export const ErrorCodes = {
                ReceiptIsInvalid: 2,
                PurchaseAlreadyClaimed: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface ClaimGooglePurchase extends Command {
            SubscriptionId: string;
            PurchaseToken: string;
        }
        export namespace ClaimGooglePurchase {
            export const ErrorCodes = {
                TokenIsInvalid: 2,
                PurchaseAlreadyClaimed: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface GooglePurchaseStatus extends Query<PurchaseStatusResultDTO> {
            SubscriptionId: string;
            PurchaseToken: string;
        }
        export interface PromoCodeById extends Query<PromoCodeDTO> {
            CodeId: string;
        }
        export interface PromoCodeDTO {
            GoogleProductId1: string;
            GoogleProductId2: string;
            AppleProductId1: string;
            AppleProductId2: string;
        }
        export enum PurchaseStatusDTO {
            Invalid = 2,
            ClaimedByYou = 3,
            ClaimedByOther = 4,
            Available = 5,
        }
        export interface PurchaseStatusResultDTO {
            Status: PurchaseStatusDTO;
        }
        export interface UsePromoCode extends Command {
            CodeId: string;
        }
    }
    export namespace Users {
        export interface AddFavoriteSession extends Command {
            SessionId: string;
        }
        export namespace AddFavoriteSession {
            export const ErrorCodes = {
                SessionDoesntExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface AddFriend extends Command {
            FriendUserId: string;
        }
        export namespace AddFriend {
            export const ErrorCodes = {
                FriendDoesntExist: 1,
                CannotBefriendSelf: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface ChangePassword extends Command {
            OldPassword: string;
            NewPassword: string;
        }
        export namespace ChangePassword {
            export const ErrorCodes = {
                OldPasswordIsInvalid: 1,
                NewPasswordTooWeak: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface CheckEmailAddress extends Query<EmailAddressCheckDTO> {
            EmailAddress: string;
        }
        export interface CheckUsername extends Query<UsernameCheckDTO> {
            Username: string;
        }
        export interface DeleteAccount extends Command {}
        export interface EmailAddressCheckDTO {
            IsValid: boolean;
            IsNullOrEmpty: boolean;
            IsTooLong: boolean;
            IsNotEmailFormat: boolean;
            IsAlreadyUsed: boolean;
        }
        export interface FriendDTO {
            UserId: string;
            Username: string;
            StreakLength: number;
            AvatarUrl: string;
        }
        export interface FriendLink extends Query<string> {}
        export enum GaugeLevelDTO {
            Low = 0,
            Medium = 1,
            High = 2,
        }
        export interface JoinCompany extends Command {
            Code: string;
        }
        export namespace JoinCompany {
            export const ErrorCodes = {
                AlreadyInCompany: 1,
                CodeIsInvalid: 2,
                CodeAlreadyUsed: 3,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface Me extends Query<MeDTO> {
            CalculateProgressAt: string;
        }
        export interface MeDTO {
            UserId: string;
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
            AvatarUrl: string;
            JoinedCompany?: string;
            IsPremium: boolean;
            Subscription: SubscriptionDTO;
            MindfulDays: number;
            ListenedSessions: number;
            GaugeValue: number;
            GaugeLevel: GaugeLevelDTO;
            StreakLength: number;
            RegisteredAt: string;
            /**
             * @deprecated
             */
            ActiveIndividualPlan: boolean;
        }
        export interface MyFriends extends Query<FriendDTO[]> {
            CalculateProgressAt: string;
        }
        export interface RegisterAppleUser extends Command {
            UserInfo: Shared.Users.UserInfoDTO;
            Token: SocialTokenDTO;
        }
        export namespace RegisterAppleUser {
            export const ErrorCodes = {
                UserInfoIsNull: 1,
                TokenIsNull: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RegisterFacebookUser extends Command {
            UserInfo: Shared.Users.UserInfoDTO;
            Token: SocialTokenDTO;
        }
        export namespace RegisterFacebookUser {
            export const ErrorCodes = {
                UserInfoIsNull: 1,
                TokenIsNull: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RegisterGoogleUser extends Command {
            UserInfo: Shared.Users.UserInfoDTO;
            Token: SocialTokenDTO;
        }
        export namespace RegisterGoogleUser {
            export const ErrorCodes = {
                UserInfoIsNull: 1,
                TokenIsNull: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RegisterUser extends Command {
            UserInfo: Shared.Users.UserInfoDTO;
            Password: string;
        }
        export namespace RegisterUser {
            export const ErrorCodes = {
                UserInfoIsNull: 1,
                PasswordTooWeak: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RemoveFavoriteSession extends Command {
            SessionId: string;
        }
        export namespace RemoveFavoriteSession {
            export const ErrorCodes = {
                SessionDoesntExist: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RequestPasswordReset extends Command {
            EmailAddress: string;
            LanguageCode: string;
        }
        export interface ResetPassword extends Command {
            UserId: string;
            Token: string;
            NewPassword: string;
        }
        export namespace ResetPassword {
            export const ErrorCodes = {
                PasswordTooWeak: 1,
                InvalidToken: 2,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface SetAppsflyerId extends Command {
            AppsflyerId: string;
            IsAndroid: boolean;
        }
        export namespace SetAppsflyerId {
            export const ErrorCodes = {
                AppsflyerIdIsNullOrEmpty: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface SocialTokenDTO {
            Value: string;
        }
        export interface SubscriptionDTO {
            IsActive: boolean;
            StartDate?: string;
            /**
             * Not `null` when `IsActive` is `true`.
             *     When `IsActive` is `false` it might be or might not be empty.
             *
             */
            ExpirationDate?: string;
            /**
             * Not `null` when `IsActive` is `true`.
             *     When `IsActive` is `false` it might be or might not be empty.
             *
             */
            ProductId?: string;
            IsEligibleForTrial: boolean;
        }
        export interface UpdateProfile extends Command {
            UserInfo: Shared.Users.UserInfoDTO;
        }
        export namespace UpdateProfile {
            export const ErrorCodes = {
                UserInfoIsNull: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface UsernameCheckDTO {
            IsValid: boolean;
            IsTooLong: boolean;
            IsTooShort: boolean;
            IsAlreadyUsed: boolean;
        }
    }
}
export namespace Security {
    export interface ISessionRelated {
        SessionId: string;
    }
    export interface WhenHasSessionAccess {}
}
export namespace Shared {
    export namespace Pages {
        export enum ApplicationPageCategoryDTO {
            AuthorsLectors = 0,
        }
        export enum CompanyPageCategoryDTO {
            CompanyProgramInfo = 100,
        }
        export enum PageCategoryDTO {
            AuthorsLectors = 0,
            CompanyProgramInfo = 100,
        }
    }
    export namespace Sessions {
        export enum SessionTypeDTO {
            Meditation = 0,
            Music = 1,
            Sleep = 2,
            SleepMusic = 3,
        }
    }
    export namespace Users {
        export interface UserInfoDTO {
            Firstname: string;
            Surname: string;
            Username: string;
            EmailAddress: string;
        }
    }
}
export namespace System {
    export namespace Subscriptions {
        export interface RefreshApplePurchase extends Command {
            Receipt: string;
            Password: string;
            NotificationType: string;
        }
        export namespace RefreshApplePurchase {
            export const ErrorCodes = {
                PurchaseIsInvalid: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
        export interface RefreshGooglePurchase extends Command {
            SubscriptionId: string;
            PurchaseToken: string;
            /**
             * Not used in processing, just for logging purposes.
             *
             */
            NotificationType: number;
        }
        export namespace RefreshGooglePurchase {
            export const ErrorCodes = {
                PurchaseIsInvalid: 1,
            } as const;
            export type ErrorCodes = typeof ErrorCodes;
        }
    }
}
