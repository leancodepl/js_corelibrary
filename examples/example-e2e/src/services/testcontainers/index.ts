import * as path from "node:path"
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers"
import { Environment } from "testcontainers/build/types"

let mailpitContainer: StartedTestContainer | undefined
let kratosContainer: StartedTestContainer | undefined

type KratosConfigRules = {
  totpMethodEnabled?: boolean
  oidcMethodsEnabled?: boolean
  passkeyMethodEnabled?: boolean
  verificationFlowEnabled?: boolean
  requireVerificationOnLogin?: boolean
  settingsPrivilegedSession?: "long" | "short"
}

const mapConfigRulesToEnvs = (rules: KratosConfigRules): Environment => {
  const envs: Environment = {}

  if (rules.totpMethodEnabled !== undefined) {
    envs.SELFSERVICE_METHODS_TOTP_ENABLED = rules.totpMethodEnabled.toString()
  }

  if (rules.oidcMethodsEnabled !== undefined) {
    envs.SELFSERVICE_METHODS_OIDC_ENABLED = rules.oidcMethodsEnabled.toString()
  }

  if (rules.passkeyMethodEnabled !== undefined) {
    envs.SELFSERVICE_METHODS_PASSKEY_ENABLED = rules.passkeyMethodEnabled.toString()
  }

  if (rules.verificationFlowEnabled !== undefined) {
    envs.SELFSERVICE_FLOWS_VERIFICATION_ENABLED = rules.verificationFlowEnabled.toString()
  }

  if (rules.requireVerificationOnLogin) {
    envs.SELFSERVICE_FLOWS_LOGIN_AFTER_PASSWORD_HOOKS_0_HOOK = "verification"
    envs.SELFSERVICE_FLOWS_LOGIN_AFTER_PASSWORD_HOOKS_1_HOOK = "show_verification_ui"
  }

  if (rules.settingsPrivilegedSession !== undefined) {
    envs.SELFSERVICE_FLOWS_SETTINGS_PRIVILEGED_SESSION_MAX_AGE =
      rules.settingsPrivilegedSession === "long" ? "15m" : "1s"
  }

  return envs
}

export const runKratosContainer = async (rules: KratosConfigRules = {}) => {
  await stopKratosContainer()

  kratosContainer = await new GenericContainer("oryd/kratos:v1.3.1")
    .withBindMounts([
      {
        source: path.resolve(__dirname, "../../config"),
        target: "/home/ory",
        mode: "ro",
      },
    ])
    .withEnvironment(mapConfigRulesToEnvs(rules))
    .withExposedPorts({ container: 4433, host: 34433 })
    .withExposedPorts({ container: 4434, host: 34434 })
    .withWaitStrategy(Wait.forListeningPorts())
    .withCommand(["serve", "--watch-courier", "--config", "/home/ory/kratos.yml"])
    .start()
}

export const stopKratosContainer = async () => {
  await kratosContainer?.stop()
}

export const runMailpitContainer = async (envs: Environment = {}) => {
  await stopMailpitContainer()

  mailpitContainer = await new GenericContainer("axllent/mailpit")
    .withEnvironment(envs)
    .withExposedPorts({ container: 8025, host: 8025 })
    .withExposedPorts({ container: 1025, host: 1025 })
    .withWaitStrategy(Wait.forListeningPorts())
    .start()
}

export const stopMailpitContainer = async () => {
  await mailpitContainer?.stop()
}
