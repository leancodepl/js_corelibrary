type TypeofToType = {
    undefined: undefined
    string: string
    number: number
    boolean: boolean
    object: object
}

export const hasProperetyOfType = <Prop extends string, PropType extends keyof TypeofToType>(
    obj: object | undefined,
    propertyName: Prop,
    propertyType: PropType,
): obj is object & { [Key in Prop]: TypeofToType[PropType] } =>
    obj !== undefined && propertyName in obj && typeof (obj as Record<string, unknown>)[propertyName] === propertyType
