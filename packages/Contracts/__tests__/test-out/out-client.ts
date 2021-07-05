/*eslint-disable prettier/prettier*/
export default function (cqrsClient: CQRS) {
    return {
        Admin: {
            Challenges: {
                ChallengeById: cqrsClient.createQuery<Admin.Challenges.ChallengeById, Admin.Challenges.ChallengeDTO>("Mindy.Core.Contracts.Admin.Challenges.ChallengeById"),
                ChallengesList: cqrsClient.createQuery<Admin.Challenges.ChallengesList, PaginatedResult<Admin.Challenges.ChallengeSummaryDTO>>("Mindy.Core.Contracts.Admin.Challenges.ChallengesList"),
                DefineChallenge: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Challenges.DefineChallenge"),
                EditChallenge: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Challenges.EditChallenge"),
                EditChallengeLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Challenges.EditChallengeLocalizedData")
            },
            Companies: {
                AddCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.AddCompany"),
                AddCompanyCode: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.AddCompanyCode"),
                AddNewCompanyCodes: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.AddNewCompanyCodes"),
                CompaniesInfoList: cqrsClient.createQuery<Admin.Companies.CompaniesInfoList, Admin.Companies.CompanyInfoDTO[]>("Mindy.Core.Contracts.Admin.Companies.CompaniesInfoList"),
                CompaniesList: cqrsClient.createQuery<Admin.Companies.CompaniesList, PaginatedResult<Admin.Companies.CompanySummaryDTO>>("Mindy.Core.Contracts.Admin.Companies.CompaniesList"),
                CompanyById: cqrsClient.createQuery<Admin.Companies.CompanyById, Admin.Companies.CompanyDTO>("Mindy.Core.Contracts.Admin.Companies.CompanyById"),
                CompanyCodeByCode: cqrsClient.createQuery<Admin.Companies.CompanyCodeByCode, Admin.Companies.EntryCodeDTO>("Mindy.Core.Contracts.Admin.Companies.CompanyCodeByCode"),
                CompanyCodes: cqrsClient.createQuery<Admin.Companies.CompanyCodes, PaginatedResult<Admin.Companies.EntryCodeSummaryDTO>>("Mindy.Core.Contracts.Admin.Companies.CompanyCodes"),
                EditCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.EditCompany"),
                EditCompanyCode: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.EditCompanyCode"),
                EditCompanyLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.EditCompanyLocalizedData"),
                MembersList: cqrsClient.createQuery<Admin.Companies.MembersList, PaginatedResult<Admin.Companies.MemberDTO>>("Mindy.Core.Contracts.Admin.Companies.MembersList"),
                RemoveCompanyCode: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.RemoveCompanyCode"),
                SetIsHiddenCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Companies.SetIsHiddenCompany")
            },
            ContentPhotoUploadLink: cqrsClient.createQuery<Admin.ContentPhotoUploadLink, Admin.UploadLinkDTO>("Mindy.Core.Contracts.Admin.ContentPhotoUploadLink"),
            Library: {
                Collections: {
                    AddCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Collections.AddCollection"),
                    CollectionById: cqrsClient.createQuery<Admin.Library.Collections.CollectionById, Admin.Library.Collections.CollectionDTO>("Mindy.Core.Contracts.Admin.Library.Collections.CollectionById"),
                    CollectionsInfoList: cqrsClient.createQuery<Admin.Library.Collections.CollectionsInfoList, Admin.Library.Collections.CollectionInfoDTO[]>("Mindy.Core.Contracts.Admin.Library.Collections.CollectionsInfoList"),
                    CollectionsList: cqrsClient.createQuery<Admin.Library.Collections.CollectionsList, PaginatedResult<Admin.Library.Collections.CollectionSummaryDTO>>("Mindy.Core.Contracts.Admin.Library.Collections.CollectionsList"),
                    EditCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Collections.EditCollection"),
                    EditCollectionLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Collections.EditCollectionLocalizedData"),
                    RemoveCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Collections.RemoveCollection"),
                    SetIsHiddenCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Collections.SetIsHiddenCollection")
                },
                Courses: {
                    AddCourse: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Courses.AddCourse"),
                    CourseById: cqrsClient.createQuery<Admin.Library.Courses.CourseById, Admin.Library.Courses.CourseDTO>("Mindy.Core.Contracts.Admin.Library.Courses.CourseById"),
                    CoursesInfoList: cqrsClient.createQuery<Admin.Library.Courses.CoursesInfoList, Admin.Library.Courses.CourseInfoDTO[]>("Mindy.Core.Contracts.Admin.Library.Courses.CoursesInfoList"),
                    CoursesList: cqrsClient.createQuery<Admin.Library.Courses.CoursesList, PaginatedResult<Admin.Library.Courses.CourseSummaryDTO>>("Mindy.Core.Contracts.Admin.Library.Courses.CoursesList"),
                    EditCourse: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Courses.EditCourse"),
                    EditCourseLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Courses.EditCourseLocalizedData"),
                    RemoveCourse: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Courses.RemoveCourse"),
                    SetIsHiddenCourse: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Courses.SetIsHiddenCourse")
                },
                Persons: {
                    AddPerson: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Persons.AddPerson")
                },
                Sessions: {
                    AddSession: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.AddSession"),
                    AddSessionToCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.AddSessionToCollection"),
                    ArchiveSession: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.ArchiveSession"),
                    EditSession: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.EditSession"),
                    EditSessionLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.EditSessionLocalizedData"),
                    RemoveSessionFromCollection: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.RemoveSessionFromCollection"),
                    SessionById: cqrsClient.createQuery<Admin.Library.Sessions.SessionById, Admin.Library.Sessions.SessionDTO>("Mindy.Core.Contracts.Admin.Library.Sessions.SessionById"),
                    SessionRecordingUploadLink: cqrsClient.createQuery<Admin.Library.Sessions.SessionRecordingUploadLink, Admin.UploadLinkDTO>("Mindy.Core.Contracts.Admin.Library.Sessions.SessionRecordingUploadLink"),
                    SessionsInfoList: cqrsClient.createQuery<Admin.Library.Sessions.SessionsInfoList, Admin.Library.Sessions.SessionInfoDTO[]>("Mindy.Core.Contracts.Admin.Library.Sessions.SessionsInfoList"),
                    SessionsList: cqrsClient.createQuery<Admin.Library.Sessions.SessionsList, PaginatedResult<Admin.Library.Sessions.SessionSummaryDTO>>("Mindy.Core.Contracts.Admin.Library.Sessions.SessionsList"),
                    SetIsHiddenSession: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Sessions.SetIsHiddenSession")
                },
                Tags: {
                    AddTag: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Tags.AddTag"),
                    EditTag: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Tags.EditTag"),
                    EditTagLocalizedData: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Tags.EditTagLocalizedData"),
                    RemoveTag: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Tags.RemoveTag"),
                    SetIsHiddenTag: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.Tags.SetIsHiddenTag"),
                    TagById: cqrsClient.createQuery<Admin.Library.Tags.TagById, Admin.Library.Tags.TagDTO>("Mindy.Core.Contracts.Admin.Library.Tags.TagById"),
                    TagsInfoList: cqrsClient.createQuery<Admin.Library.Tags.TagsInfoList, Admin.Library.Tags.TagInfoDTO[]>("Mindy.Core.Contracts.Admin.Library.Tags.TagsInfoList"),
                    TagsList: cqrsClient.createQuery<Admin.Library.Tags.TagsList, PaginatedResult<Admin.Library.Tags.TagSummaryDTO>>("Mindy.Core.Contracts.Admin.Library.Tags.TagsList")
                },
                TodaysMeditations: {
                    SetTodaysMeditation: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Library.TodaysMeditations.SetTodaysMeditation"),
                    TodaysMeditationsList: cqrsClient.createQuery<Admin.Library.TodaysMeditations.TodaysMeditationsList, PaginatedResult<Admin.Library.TodaysMeditations.TodaysMeditationDTO>>("Mindy.Core.Contracts.Admin.Library.TodaysMeditations.TodaysMeditationsList")
                }
            },
            Pages: {
                AddApplicationPage: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Pages.AddApplicationPage"),
                AddCompanyPage: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Pages.AddCompanyPage"),
                ApplicationPage: cqrsClient.createQuery<Admin.Pages.ApplicationPage, Admin.Pages.PageDTO>("Mindy.Core.Contracts.Admin.Pages.ApplicationPage"),
                EditPageLocalizedContent: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Pages.EditPageLocalizedContent"),
                RemovePage: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Pages.RemovePage")
            },
            Subscriptions: {
                ActivateInternalSubscription: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.ActivateInternalSubscription"),
                AddPromoCode: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.AddPromoCode"),
                DeactivateInternalSubscription: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.DeactivateInternalSubscription"),
                EditPromoCodeMaxUses: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.EditPromoCodeMaxUses"),
                GeneratePromoCodes: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.GeneratePromoCodes"),
                PromoCodeById: cqrsClient.createQuery<Admin.Subscriptions.PromoCodeById, Admin.Subscriptions.PromoCodeDTO>("Mindy.Core.Contracts.Admin.Subscriptions.PromoCodeById"),
                PromoCodesList: cqrsClient.createQuery<Admin.Subscriptions.PromoCodesList, PaginatedResult<Admin.Subscriptions.PromoCodeSummaryDTO>>("Mindy.Core.Contracts.Admin.Subscriptions.PromoCodesList"),
                RemovePromoCode: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Subscriptions.RemovePromoCode")
            },
            Users: {
                AddFriendToUser: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.AddFriendToUser"),
                ChangeUserCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.ChangeUserCompany"),
                DeleteUser: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.DeleteUser"),
                EditUser: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.EditUser"),
                RemoveFriendFromUser: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.RemoveFriendFromUser"),
                ThrowUserOutOfCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.ThrowUserOutOfCompany"),
                UpdateUserPassword: cqrsClient.createCommand("Mindy.Core.Contracts.Admin.Users.UpdateUserPassword"),
                UserById: cqrsClient.createQuery<Admin.Users.UserById, Admin.Users.UserDTO>("Mindy.Core.Contracts.Admin.Users.UserById"),
                UserFriends: cqrsClient.createQuery<Admin.Users.UserFriends, PaginatedResult<Admin.Users.UserFriendDTO>>("Mindy.Core.Contracts.Admin.Users.UserFriends"),
                UsersList: cqrsClient.createQuery<Admin.Users.UsersList, PaginatedResult<Admin.Users.UserSummaryDTO>>("Mindy.Core.Contracts.Admin.Users.UsersList")
            }
        },
        Mobile: {
            Game: {
                B2B: {
                    MeditatingBuddies: cqrsClient.createQuery<Mobile.Game.B2B.MeditatingBuddies, Mobile.Game.B2B.MeditatingBuddiesDTO>("Mindy.Core.Contracts.Mobile.Game.B2B.MeditatingBuddies"),
                    MyCompany: cqrsClient.createQuery<Mobile.Game.B2B.MyCompany, Mobile.Game.B2B.MyCompanyDTO>("Mindy.Core.Contracts.Mobile.Game.B2B.MyCompany"),
                    MyCompanyStatistics: cqrsClient.createQuery<Mobile.Game.B2B.MyCompanyStatistics, Mobile.Game.B2B.TimedCompanyStatisticsDTO>("Mindy.Core.Contracts.Mobile.Game.B2B.MyCompanyStatistics")
                },
                B2C: {
                    PersonalChallengeById: cqrsClient.createQuery<Mobile.Game.B2C.PersonalChallengeById, Mobile.Game.B2C.PersonalChallengeDTO>("Mindy.Core.Contracts.Mobile.Game.B2C.PersonalChallengeById"),
                    PersonalChallengesList: cqrsClient.createQuery<Mobile.Game.B2C.PersonalChallengesList, Mobile.Game.B2C.PersonalChallengeDTO[]>("Mindy.Core.Contracts.Mobile.Game.B2C.PersonalChallengesList")
                },
                ChallengeContenders: cqrsClient.createQuery<Mobile.Game.ChallengeContenders, Mobile.Game.ChallengeContenderDTO[]>("Mindy.Core.Contracts.Mobile.Game.ChallengeContenders")
            },
            Library: {
                Collections: {
                    CollectionsList: cqrsClient.createQuery<Mobile.Library.Collections.CollectionsList, Mobile.Library.Collections.CollectionDTO[]>("Mindy.Core.Contracts.Mobile.Library.Collections.CollectionsList")
                },
                Courses: {
                    CourseById: cqrsClient.createQuery<Mobile.Library.Courses.CourseById, Mobile.Library.Courses.CourseDTO>("Mindy.Core.Contracts.Mobile.Library.Courses.CourseById"),
                    CoursesList: cqrsClient.createQuery<Mobile.Library.Courses.CoursesList, Mobile.Library.Courses.CourseSummaryDTO[]>("Mindy.Core.Contracts.Mobile.Library.Courses.CoursesList"),
                    MyCourses: cqrsClient.createQuery<Mobile.Library.Courses.MyCourses, Mobile.Library.Courses.CourseSummaryDTO[]>("Mindy.Core.Contracts.Mobile.Library.Courses.MyCourses")
                },
                Sessions: {
                    MyFavoriteSessions: cqrsClient.createQuery<Mobile.Library.Sessions.MyFavoriteSessions, Mobile.Library.Sessions.SessionInCollectionDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.MyFavoriteSessions"),
                    MyListenedSessions: cqrsClient.createQuery<Mobile.Library.Sessions.MyListenedSessions, Mobile.Library.Sessions.SessionListenedDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.MyListenedSessions"),
                    MyRecentSessions: cqrsClient.createQuery<Mobile.Library.Sessions.MyRecentSessions, Mobile.Library.Sessions.SessionSummaryDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.MyRecentSessions"),
                    RandomSessionsFromCollection: cqrsClient.createQuery<Mobile.Library.Sessions.RandomSessionsFromCollection, Mobile.Library.Sessions.SessionSummaryDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.RandomSessionsFromCollection"),
                    SessionById: cqrsClient.createQuery<Mobile.Library.Sessions.SessionById, Mobile.Library.Sessions.SessionDTO>("Mindy.Core.Contracts.Mobile.Library.Sessions.SessionById"),
                    SessionsByCollectionId: cqrsClient.createQuery<Mobile.Library.Sessions.SessionsByCollectionId, Mobile.Library.Sessions.SessionInCollectionDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.SessionsByCollectionId"),
                    SessionsByCourseId: cqrsClient.createQuery<Mobile.Library.Sessions.SessionsByCourseId, Mobile.Library.Courses.SessionInCourseDTO[]>("Mindy.Core.Contracts.Mobile.Library.Sessions.SessionsByCourseId"),
                    TodaysSession: cqrsClient.createQuery<Mobile.Library.Sessions.TodaysSession, Mobile.Library.Sessions.SessionSummaryDTO>("Mindy.Core.Contracts.Mobile.Library.Sessions.TodaysSession")
                }
            },
            Pages: {
                ApplicationPage: cqrsClient.createQuery<Mobile.Pages.ApplicationPage, Mobile.Pages.PageDTO>("Mindy.Core.Contracts.Mobile.Pages.ApplicationPage"),
                CompanyPage: cqrsClient.createQuery<Mobile.Pages.CompanyPage, Mobile.Pages.PageDTO>("Mindy.Core.Contracts.Mobile.Pages.CompanyPage")
            },
            Progress: {
                FinishSessionInCourse: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Progress.FinishSessionInCourse"),
                ListenToSession: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Progress.ListenToSession")
            },
            Statistics: {
                MyCalendar: cqrsClient.createQuery<Mobile.Statistics.MyCalendar, Mobile.Statistics.CalendarDTO>("Mindy.Core.Contracts.Mobile.Statistics.MyCalendar"),
                MyStatistics: cqrsClient.createQuery<Mobile.Statistics.MyStatistics, Mobile.Statistics.StatisticsDTO>("Mindy.Core.Contracts.Mobile.Statistics.MyStatistics")
            },
            Subscriptions: {
                ApplePurchaseStatus: cqrsClient.createQuery<Mobile.Subscriptions.ApplePurchaseStatus, Mobile.Subscriptions.PurchaseStatusResultDTO>("Mindy.Core.Contracts.Mobile.Subscriptions.ApplePurchaseStatus"),
                ClaimApplePurchase: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Subscriptions.ClaimApplePurchase"),
                ClaimGooglePurchase: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Subscriptions.ClaimGooglePurchase"),
                GooglePurchaseStatus: cqrsClient.createQuery<Mobile.Subscriptions.GooglePurchaseStatus, Mobile.Subscriptions.PurchaseStatusResultDTO>("Mindy.Core.Contracts.Mobile.Subscriptions.GooglePurchaseStatus"),
                PromoCodeById: cqrsClient.createQuery<Mobile.Subscriptions.PromoCodeById, Mobile.Subscriptions.PromoCodeDTO>("Mindy.Core.Contracts.Mobile.Subscriptions.PromoCodeById"),
                UsePromoCode: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Subscriptions.UsePromoCode")
            },
            Users: {
                AddFavoriteSession: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.AddFavoriteSession"),
                AddFriend: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.AddFriend"),
                ChangePassword: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.ChangePassword"),
                CheckEmailAddress: cqrsClient.createQuery<Mobile.Users.CheckEmailAddress, Mobile.Users.EmailAddressCheckDTO>("Mindy.Core.Contracts.Mobile.Users.CheckEmailAddress"),
                CheckUsername: cqrsClient.createQuery<Mobile.Users.CheckUsername, Mobile.Users.UsernameCheckDTO>("Mindy.Core.Contracts.Mobile.Users.CheckUsername"),
                DeleteAccount: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.DeleteAccount"),
                FriendLink: cqrsClient.createQuery<Mobile.Users.FriendLink, string>("Mindy.Core.Contracts.Mobile.Users.FriendLink"),
                JoinCompany: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.JoinCompany"),
                Me: cqrsClient.createQuery<Mobile.Users.Me, Mobile.Users.MeDTO>("Mindy.Core.Contracts.Mobile.Users.Me"),
                MyFriends: cqrsClient.createQuery<Mobile.Users.MyFriends, Mobile.Users.FriendDTO[]>("Mindy.Core.Contracts.Mobile.Users.MyFriends"),
                RegisterAppleUser: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RegisterAppleUser"),
                RegisterFacebookUser: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RegisterFacebookUser"),
                RegisterGoogleUser: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RegisterGoogleUser"),
                RegisterUser: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RegisterUser"),
                RemoveFavoriteSession: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RemoveFavoriteSession"),
                RequestPasswordReset: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.RequestPasswordReset"),
                ResetPassword: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.ResetPassword"),
                SetAppsflyerId: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.SetAppsflyerId"),
                UpdateProfile: cqrsClient.createCommand("Mindy.Core.Contracts.Mobile.Users.UpdateProfile")
            }
        },
        System: {
            Subscriptions: {
                RefreshApplePurchase: cqrsClient.createCommand("Mindy.Core.Contracts.System.Subscriptions.RefreshApplePurchase"),
                RefreshGooglePurchase: cqrsClient.createCommand("Mindy.Core.Contracts.System.Subscriptions.RefreshGooglePurchase")
            }
        }
    };
}
