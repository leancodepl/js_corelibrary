import { PaginatedResult, Users } from "./contracts"
import { CQRS } from "./cqrs"

// eslint-disable-next-line import/no-anonymous-default-export
export default function (cqrsClient: CQRS) {
    return {
        Users: {
            AllUsers: cqrsClient.createQuery<Users.AllUsers, PaginatedResult<Users.UserInfoDTO>>(
                "LeanCode.ContractsGeneratorV2.ExampleContracts.Users.AllUsers",
            ),
            EditUser: cqrsClient.createCommand<Users.EditUser, Users.EditUser.ErrorCodes>(
                "LeanCode.ContractsGeneratorV2.ExampleContracts.Users.EditUser",
                Users.EditUser.ErrorCodes,
            ),
            UseCode: cqrsClient.createCommand<Users.UseCode, {}>(
                "LeanCode.ContractsGeneratorV2.ExampleContracts.Users.UseCode",
                {},
            ),

            UserById: cqrsClient.createQuery<Users.UserById, Users.UserInfoDTO>(
                "LeanCode.ContractsGeneratorV2.ExampleContracts.Users.UserById",
            ),
            UserSomething: cqrsClient.createQuery<Users.UserSomething, number>(
                "LeanCode.ContractsGeneratorV2.ExampleContracts.Users.UserSomething",
            ),
        },
    }
}
