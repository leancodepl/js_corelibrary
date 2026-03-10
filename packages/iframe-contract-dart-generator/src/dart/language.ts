import { RenderContext, TargetLanguage } from "quicktype-core"
import { DartExtensionTypesRenderer } from "./DartRenderer"

export const dartOptions = {}

export class DartExtensionTypesTargetLanguage extends TargetLanguage {
  constructor() {
    super({
      displayName: "Dart Extension Types (JS Interop)",
      names: ["dart-extension-types"],
      extension: "dart",
    })
  }

  public getOptions(): typeof dartOptions {
    return dartOptions
  }

  public override get supportsUnionsWithBothNumberTypes(): boolean {
    return true
  }

  protected makeRenderer(renderContext: RenderContext): DartExtensionTypesRenderer {
    return new DartExtensionTypesRenderer(this, renderContext)
  }
}
