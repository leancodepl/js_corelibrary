import type { ForbiddenWordsInfo } from "quicktype-core/dist/ConvenienceRenderer"
import type { Name, Namer } from "quicktype-core/dist/Naming"
import type { ClassProperty, ObjectType } from "quicktype-core/dist/Type"
import type { TypeGraph } from "quicktype-core/dist/Type/TypeGraph"
import {
  ClassType,
  ConvenienceRenderer,
  matchType,
  nullableFromUnion,
  type RenderContext,
  TargetLanguage,
  type Type,
} from "quicktype-core"
import { keywords } from "quicktype-core/dist/language/Dart/constants.js"
import {
  dartNameStyle,
  enumCaseNamingFunction,
  propertyNamingFunction,
  typeNamingFunction,
} from "quicktype-core/dist/language/Dart/utils.js"
import { pascalCase, sectionPrefix } from "./utils"

type NameResolver = (classType: ClassType, jsonName: string) => string

type MethodInfo = {
  methodName: string
  paramsTypeName: string
  resultTypeName: string
  resultDartType: string
  jsResultType: string
  resultIsVoid: boolean
  resultIsNullable: boolean
  resultNeedsToJS: boolean
  hasParams: boolean
}

type ContractShape = {
  remoteParamKeys: string[]
  remoteMethods: MethodInfo[]
  hostMethods: MethodInfo[]
  typeDisplayNames: Map<Type, string>
  sectionClasses: Set<ClassType>
  methodContainerTypes: Set<ClassType>
}

const RemoteMethodsBaseName = "RemoteMethodsBase"
const HostMethodsName = "HostMethods"
const JSRemoteMethodsName = "JSRemoteMethods"
const JSHostMethodsName = "JSHostMethods"
const RemoteUrlParamsName = "RemoteUrlParams"

function dartTypeForExtension(t: Type, typeDisplayNames?: Map<Type, string>): { dart: string; js: string } {
  return matchType(
    t,
    _any => ({ dart: "dynamic", js: "JSAny" }),
    _null => ({ dart: "dynamic", js: "JSAny" }),
    _bool => ({ dart: "bool", js: "JSBoolean" }),
    _int => ({ dart: "int", js: "JSNumber" }),
    _double => ({ dart: "double", js: "JSNumber" }),
    _string => ({ dart: "String", js: "JSString" }),
    _array => ({ dart: "List", js: "JSArray" }),
    classType => {
      const c = classType as ClassType
      const name = typeDisplayNames?.get(c) ?? c.getCombinedName()
      return { dart: name, js: "JSObject" }
    },
    _map => ({ dart: "Map", js: "JSObject" }),
    _enum => ({ dart: "String", js: "JSString" }),
    union => {
      const nonNull = nullableFromUnion(union)
      if (nonNull) {
        const inner = dartTypeForExtension(nonNull, typeDisplayNames)
        return { dart: `${inner.dart}?`, js: `${inner.js}?` }
      }
      return { dart: "dynamic", js: "JSAny" }
    },
    _transformed => ({ dart: "String", js: "JSString" }),
  )
}

function dartTypeNullableForProperty(t: Type, typeDisplayNames?: Map<Type, string>): string {
  return dartTypeForExtension(t, typeDisplayNames).dart
}

function returnTypeNeedsToJS(t: Type): boolean {
  return matchType(
    t,
    _any => false,
    _null => false,
    _bool => true,
    _int => true,
    _double => true,
    _string => true,
    _array => false,
    _classType => false,
    _map => false,
    _enum => true,
    union => {
      const n = nullableFromUnion(union)
      return n ? returnTypeNeedsToJS(n) : false
    },
    _transformed => true,
  )
}

const contractRootPropNames = ["hostMethods", "remoteMethods", "remoteParams"]

function isValidContractRoot(rootType: ClassType): boolean {
  const props = rootType.getProperties()

  if (props.size !== contractRootPropNames.length) return false

  for (const name of contractRootPropNames) {
    if (!props.has(name)) return false
  }

  return true
}

function getRootType(typeGraph: TypeGraph): ClassType | null {
  const topLevels = typeGraph.topLevels

  if (!topLevels?.size) {
    return null
  }

  for (const [, t] of topLevels) {
    if (t instanceof ClassType) {
      return t
    }
  }

  return null
}

function emitExtensionTypeForClass(
  classType: ClassType,
  typeDisplayNames: Map<Type, string>,
  lines: string[],
  resolve: NameResolver,
): void {
  const name = typeDisplayNames.get(classType) ?? classType.getCombinedName()
  const props = classType.getSortedProperties?.() ?? classType.getProperties()
  const entries = [...props.entries()]

  lines.push(`extension type ${name}._(JSObject _) implements JSObject {`, `  external ${name}({`)

  for (const [jsonName, prop] of entries) {
    const dartType = dartTypeNullableForProperty(prop.type, typeDisplayNames)
    const dartName = resolve(classType, jsonName)
    lines.push(`    ${dartType} ${dartName},`)
  }

  lines.push("  });", "")

  for (const [jsonName, prop] of entries) {
    const dartType = dartTypeNullableForProperty(prop.type, typeDisplayNames)
    const dartName = resolve(classType, jsonName)
    lines.push(`  external ${dartType} ${dartName};`)
  }

  lines.push("}", "")
}

function getContractShape(typeGraph: TypeGraph, resolve: NameResolver): ContractShape {
  const rootType = getRootType(typeGraph)

  if (!rootType || !isValidContractRoot(rootType)) {
    throw new Error("Root type not found or is not a valid contract root")
  }

  const rootProps = rootType.getProperties()
  const typeDisplayNames = new Map<Type, string>()
  const sectionClasses = new Set<ClassType>()
  const methodContainerTypes = new Set<ClassType>()

  const paramsClasses = new Set<ClassType>()
  const returnsClasses = new Set<ClassType>()

  const remoteParamKeys: string[] = []
  const remoteMethods: MethodInfo[] = []
  const hostMethods: MethodInfo[] = []

  for (const [sectionKey, sectionProp] of rootProps) {
    const sectionType = sectionProp.type

    if (!(sectionType instanceof ClassType)) continue

    sectionClasses.add(sectionType)

    if (sectionKey === "remoteParams") {
      const sectionProps = sectionType.getProperties()

      for (const [k] of sectionProps) {
        remoteParamKeys.push(resolve(sectionType, k))
      }

      typeDisplayNames.set(sectionType, "RemoteParams")

      continue
    }

    const prefix = sectionPrefix(sectionKey)
    const sectionProps = sectionType.getProperties()

    for (const [methodName, methodProp] of sectionProps) {
      const methodType = methodProp.type

      if (!(methodType instanceof ClassType)) continue

      methodContainerTypes.add(methodType)

      const paramsType = methodType.getProperties().get("params")?.type
      const returnType = methodType.getProperties().get("returns")?.type

      const paramsTypeName = `${prefix}${pascalCase(methodName)}Params`
      const returnsTypeName = `${prefix}${pascalCase(methodName)}Returns`
      const resultTypeName = `${prefix}${pascalCase(methodName)}Result`

      if (paramsType instanceof ClassType) {
        paramsClasses.add(paramsType)
        typeDisplayNames.set(paramsType, paramsTypeName)
      }

      if (returnType instanceof ClassType) {
        returnsClasses.add(returnType)
        typeDisplayNames.set(returnType, returnsTypeName)
      }

      let resultDart = "void"
      let resultJS = "JSAny"
      let resultIsVoid = true
      let resultIsNullable = false

      if (returnType) {
        const pair = dartTypeForExtension(returnType, typeDisplayNames)

        resultDart = pair.dart
        resultJS = pair.js
        resultIsVoid = resultDart === "void"
        resultIsNullable = resultDart.endsWith("?")
      }

      const hasParams = paramsType instanceof ClassType && paramsType.getProperties().size > 0
      const resultNeedsToJS = returnType ? returnTypeNeedsToJS(returnType) : false

      const info: MethodInfo = {
        methodName: resolve(sectionType, methodName),
        paramsTypeName,
        resultTypeName,
        resultDartType: resultDart,
        jsResultType: resultJS,
        resultIsVoid,
        resultIsNullable,
        resultNeedsToJS,
        hasParams,
      }

      if (sectionKey === "remoteMethods") {
        remoteMethods.push(info)
      } else if (sectionKey === "hostMethods") {
        hostMethods.push(info)
      }
    }
  }

  return { remoteParamKeys, remoteMethods, hostMethods, typeDisplayNames, sectionClasses, methodContainerTypes }
}

function emitTypesDart(shape: ContractShape): string[] {
  const lines: string[] = [
    "// Generated from JSON Schema. Do not edit by hand.",
    "",
    "import 'dart:js_interop';",
    "import 'package:leancode_flutter_cyberware_contract_base/leancode_flutter_cyberware_contract_base.dart' as base;",
    "import 'contract.dart';",
    "",
    "export 'package:leancode_flutter_cyberware_contract_base/src/connect_to_host_cubit.dart' hide ConnectToHostState, ConnectToHostCubitOptions, ConnectToHostCubit;",
    "",
    `typedef ConnectToHostState = base.ConnectToHostState<${HostMethodsName}>;`,
    "",
    `class ${RemoteUrlParamsName} extends base.UrlParamsBase {`,
    `  ${RemoteUrlParamsName}();`,
    "",
  ]

  for (const key of shape.remoteParamKeys) {
    lines.push(`  String get ${key} => base.UrlParamsBase.params['${key}']!;`)
  }

  lines.push("}", "", `abstract class ${RemoteMethodsBaseName} {`)

  for (const method of shape.remoteMethods) {
    const paramsPart = method.hasParams ? `${method.paramsTypeName} params` : ""
    lines.push(`  Future<${method.resultTypeName}> ${method.methodName}(${paramsPart});`)
  }

  lines.push(
    "}",
    "",
    `extension type ${JSRemoteMethodsName}._(JSObject _) implements JSObject {`,
    `  external ${JSRemoteMethodsName}({`,
  )

  for (const method of shape.remoteMethods) {
    lines.push(`    required JSFunction ${method.methodName},`)
  }

  lines.push(
    "  });",
    "",
    `  factory ${JSRemoteMethodsName}.fromDart(${RemoteMethodsBaseName} methods) {`,
    "    JSPromise promiseVoid(Future<void> f) => f.then((_) => null).toJS;",
    "    JSPromise promiseValue<T extends JSAny?>(Future<T> f) => f.toJS;",
    "",
    `    return ${JSRemoteMethodsName}(`,
  )

  for (const method of shape.remoteMethods) {
    const paramPart = method.hasParams ? `(${method.paramsTypeName} params)` : `()`
    const callArg = method.hasParams ? "(params)" : "()"

    if (method.resultIsVoid) {
      lines.push(
        `      ${method.methodName}: (${paramPart} => promiseVoid(methods.${method.methodName}${callArg})).toJS,`,
      )
    } else if (method.resultNeedsToJS) {
      lines.push(
        `      ${method.methodName}: (${paramPart} => promiseValue(methods.${method.methodName}${callArg}.then((s) => s.toJS))).toJS,`,
      )
    } else {
      lines.push(
        `      ${method.methodName}: (${paramPart} => promiseValue(methods.${method.methodName}${callArg})).toJS,`,
      )
    }
  }

  lines.push("    );", "  }", "")

  for (const method of shape.remoteMethods) {
    lines.push(`  external JSFunction ${method.methodName};`)
  }

  lines.push("}", "", `extension type ${JSHostMethodsName}._(JSObject _) implements JSObject {`)

  for (const method of shape.hostMethods) {
    const paramsPart = method.hasParams ? `(${method.paramsTypeName} params)` : "()"
    const returnType = method.resultIsVoid ? "JSPromise" : `JSPromise<${method.jsResultType}>`
    lines.push(`  external ${returnType} ${method.methodName}${paramsPart};`)
  }

  lines.push(
    "}",
    "",
    `class ${HostMethodsName} {`,
    `  const ${HostMethodsName}(this._jsMethods);`,
    "",
    `  final ${JSHostMethodsName} _jsMethods;`,
    "",
  )

  for (const method of shape.hostMethods) {
    const callArg = method.hasParams ? "(params)" : "()"
    const callParams = method.hasParams ? `(${method.paramsTypeName} params)` : "()"

    if (method.resultIsVoid) {
      lines.push(
        `  Future<${method.resultTypeName}> ${method.methodName}${callParams} => _jsMethods.${method.methodName}${callArg}.toDart;`,
      )
    } else if (method.resultIsNullable) {
      lines.push(
        `  Future<${method.resultTypeName}> ${method.methodName}${callParams} => _jsMethods.${method.methodName}${callArg}.toDart.then((v) => v?.toDart);`,
      )
    } else {
      lines.push(
        `  Future<${method.resultTypeName}> ${method.methodName}${callParams} => _jsMethods.${method.methodName}${callArg}.toDart.then((v) => v.toDart);`,
      )
    }
  }

  lines.push("}")

  return lines
}

function emitConnectToHostDart(): string[] {
  return [
    "// Generated from JSON Schema. Do not edit by hand.",
    "",
    "import 'package:leancode_flutter_cyberware_contract_base/leancode_flutter_cyberware_contract_base.dart';",
    "import 'types.dart';",
    "",
    `Future<ConnectToHostResult<${HostMethodsName}>> connectToHost(${RemoteMethodsBaseName} methods) async {`,
    `  final raw = await connectToHostRaw<${JSHostMethodsName}>(${JSRemoteMethodsName}.fromDart(methods));`,
    `  return raw.toTyped(${HostMethodsName}.new);`,
    "}",
  ]
}

function emitDartExtensionTypes(typeGraph: TypeGraph, resolve: NameResolver, shape: ContractShape): string[] {
  const rootType = getRootType(typeGraph)

  if (!rootType) {
    throw new Error("Root type not found")
  }

  const lines: string[] = ["// Generated from JSON Schema. Do not edit by hand.", "", "import 'dart:js_interop';", ""]

  const allNamed = typeGraph.allNamedTypes?.() ?? new Set<Type>()
  const allClasses = [...allNamed].filter((t): t is ClassType => t.kind === "class") as ClassType[]
  const { typeDisplayNames, sectionClasses, methodContainerTypes, hostMethods, remoteMethods } = shape

  for (const c of allClasses) {
    if (c !== rootType && !sectionClasses.has(c) && !methodContainerTypes.has(c) && !typeDisplayNames.has(c)) {
      typeDisplayNames.set(c, pascalCase(c.getCombinedName()))
    }
  }

  const remoteParamsProp = rootType.getProperties().get("remoteParams")
  const remoteParamsClass = remoteParamsProp?.type instanceof ClassType ? remoteParamsProp.type : undefined
  const toEmit = allClasses.filter(
    c => c !== rootType && !methodContainerTypes.has(c) && (!sectionClasses.has(c) || c === remoteParamsClass),
  )

  for (const classType of toEmit) {
    emitExtensionTypeForClass(classType, typeDisplayNames, lines, resolve)
  }

  for (const m of [...hostMethods, ...remoteMethods]) {
    lines.push(`typedef ${m.resultTypeName} = ${m.resultDartType};`)
  }

  return lines
}

export class DartExtensionTypesRenderer extends ConvenienceRenderer {
  private readonly _resolvedPropertyNames = new Map<ObjectType, Map<string, string>>()

  constructor(targetLanguage: TargetLanguage, renderContext: RenderContext) {
    super(targetLanguage, renderContext)
  }

  protected override forbiddenNamesForGlobalNamespace(): readonly string[] {
    return keywords
  }

  protected override forbiddenForObjectProperties(_o: ObjectType, _className: Name): ForbiddenWordsInfo {
    return { names: [], includeGlobalForbidden: true }
  }

  protected makeNamedTypeNamer(): Namer {
    return typeNamingFunction
  }

  protected namerForObjectProperty(_o: ObjectType, _p: ClassProperty): Namer | null {
    return propertyNamingFunction
  }

  protected makeUnionMemberNamer(): Namer | null {
    return propertyNamingFunction
  }

  protected makeEnumCaseNamer(): Namer | null {
    return enumCaseNamingFunction
  }

  private resolvePropertyName(classType: ClassType, jsonName: string): string {
    return this._resolvedPropertyNames.get(classType)?.get(jsonName) ?? dartNameStyle(false, false, jsonName)
  }

  protected emitSourceStructure(): void {
    this.forEachObject("none", obj => {
      const propMap = new Map<string, string>()
      this.forEachClassProperty(obj, "none", (name, jsonName) => {
        propMap.set(jsonName, this.sourcelikeToString(name))
      })
      this._resolvedPropertyNames.set(obj, propMap)
    })

    const resolve: NameResolver = (classType, jsonName) => this.resolvePropertyName(classType, jsonName)
    const shape = getContractShape(this.typeGraph, resolve)

    for (const line of emitDartExtensionTypes(this.typeGraph, resolve, shape)) {
      this.emitLine(line)
    }
    this.finishFile("contract.dart")

    for (const line of emitTypesDart(shape)) {
      this.emitLine(line)
    }
    this.finishFile("types.dart")

    for (const line of emitConnectToHostDart()) {
      this.emitLine(line)
    }
    this.finishFile("connect_to_host.dart")
  }
}
