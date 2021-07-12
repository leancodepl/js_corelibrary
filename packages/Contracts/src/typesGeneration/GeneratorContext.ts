import ts from "typescript";
import { leancode } from "../protocol";
import type GeneratorCommand from "./GeneratorCommand";
import type GeneratorQuery from "./GeneratorQuery";
import GeneratorInternalType from "./types/GeneratorInternalType";

export default interface GeneratorContext {
    currentNamespace?: string;
    customTypes?: CustomTypesMap;
    printNode: (node: ts.Node) => string;
    include?: ClientMethodFilter;
    exclude?: ClientMethodFilter;
    referencedInternalTypes: Set<GeneratorInternalType>;
}

export type ClientMethodFilter = (fullName: string, commandOrQuery: GeneratorQuery | GeneratorCommand) => boolean;

export type CustomTypesMap = Partial<Record<OverridableCustomType, () => ts.TypeNode>>;

export const overridableCustomTypes = [
    leancode.contracts.KnownType.String,
    leancode.contracts.KnownType.Guid,
    leancode.contracts.KnownType.Uri,
    leancode.contracts.KnownType.Boolean,
    leancode.contracts.KnownType.UInt8,
    leancode.contracts.KnownType.Int8,
    leancode.contracts.KnownType.Int16,
    leancode.contracts.KnownType.UInt16,
    leancode.contracts.KnownType.Int32,
    leancode.contracts.KnownType.UInt32,
    leancode.contracts.KnownType.Int64,
    leancode.contracts.KnownType.UInt64,
    leancode.contracts.KnownType.Float,
    leancode.contracts.KnownType.Double,
    leancode.contracts.KnownType.Decimal,
    leancode.contracts.KnownType.Date,
    leancode.contracts.KnownType.Time,
    leancode.contracts.KnownType.DateTime,
    leancode.contracts.KnownType.DateTimeOffset,
] as const;

export type OverridableCustomType = typeof overridableCustomTypes[number];
