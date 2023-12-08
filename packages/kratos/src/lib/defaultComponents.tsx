import { DefaultButtonComponent } from "./defaultComponents/DefaultButtonComponent";
import { DefaultCheckboxComponent } from "./defaultComponents/DefaultCheckboxComponent";
import { DefaultImageComponent } from "./defaultComponents/DefaultImageComponent";
import { DefaultInputComponent } from "./defaultComponents/DefaultInputComponent";
import { DefaultLinkComponent } from "./defaultComponents/DefaultLinkComponent";
import { DefaultMessageComponent } from "./defaultComponents/DefaultMessageComponent";
import { DefaultMessageFormatComponent } from "./defaultComponents/DefaultMessageFormatComponent";
import { DefaultTextComponent } from "./defaultComponents/DefaultTextComponent";
import { DefaultUiMessagesComponent } from "./defaultComponents/DefaultUiMessagesComponent";
import type { KratosComponents } from "./types/components";

export const defaultComponents: KratosComponents = {
    Image: DefaultImageComponent,
    Text: DefaultTextComponent,
    Link: DefaultLinkComponent,
    Input: DefaultInputComponent,
    Message: DefaultMessageComponent,
    Button: DefaultButtonComponent,
    Checkbox: DefaultCheckboxComponent,
    UiMessages: DefaultUiMessagesComponent,

    MessageFormat: DefaultMessageFormatComponent,

    OidcSectionWrapper: "div",
    PasswordlessSectionWrapper: "div",
    AuthCodeSectionWrapper: "div",
    LoginSectionWrapper: "div",
    RegistrationSectionWrapper: "div",
    LinkSectionWrapper: "div",
    ProfileSettingsSectionWrapper: "div",
    PasswordSettingsSectionWrapper: "div",
    WebAuthnSettingsSectionWrapper: "div",
    LookupSecretSettingsSectionWrapper: "div",
    OidcSettingsSectionWrapper: "div",
    TotpSettingsSectionWrapper: "div",
};
