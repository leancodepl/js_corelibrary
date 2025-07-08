import { GenericContainer, StartedTestContainer, Wait } from "testcontainers"
import { Environment } from "testcontainers/build/types"
import path = require("path")

let mailpitContainer: StartedTestContainer
let kratosContainer: StartedTestContainer

export const runKratosContainer = async (envs: Environment = {}) => {
    await stopKratosContainer()

    //   docker run -it -p 34433:4433 -p 34434:4434 \
    //   --mount type=bind,source="$(pwd)",target=/home/ory \
    //   oryd/kratos:v1.3.1 serve --watch-courier --config /home/ory/kratos.yml
    kratosContainer = await new GenericContainer("oryd/kratos:v1.3.1")
        .withBindMounts([
            {
                source: path.resolve(__dirname, "../../config"),
                target: "/home/ory",
                mode: "ro",
            },
        ])
        .withEnvironment(envs)
        .withExposedPorts({ container: 4433, host: 34433 })
        .withExposedPorts({ container: 4434, host: 34434 })
        .withWaitStrategy(Wait.forListeningPorts())
        .withCommand(["serve", "--watch-courier", "--config", "/home/ory/kratos.yml"])
        .start()
}

export const stopKratosContainer = async () => {
    if (kratosContainer) {
        await kratosContainer.stop()
    }
}

export const runMailpitContainer = async (envs: Environment = {}) => {
    await stopMailpitContainer()

    // docker run -it -p 8025:8025 -p 1025:1025 axllent/mailpit
    mailpitContainer = await new GenericContainer("axllent/mailpit")
        .withEnvironment(envs)
        .withExposedPorts({ container: 8025, host: 8025 })
        .withExposedPorts({ container: 1025, host: 1025 })
        .withWaitStrategy(Wait.forListeningPorts())
        .start()
}

export const stopMailpitContainer = async () => {
    if (mailpitContainer) {
        await mailpitContainer.stop()
    }
}
