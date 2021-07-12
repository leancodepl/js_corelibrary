import { rxCqrs as CQRS } from "../services/cqrsClient";
import { wtf as dupa } from "../src/tst";
import { wtf2 as dupa2 } from "../src/tst";
import { Users, PaginatedResult } from "./siemka";
export default function (cqrsClient: CQRS) {
    return {
        Users: {
            AllUsers: cqrsClient.createQuery<Users.AllUsers, PaginatedResult<Users.UserInfoDTO>>("LeanCode.ContractsGeneratorV2.ExampleContracts.Users.AllUsers")
        }
    };
}
