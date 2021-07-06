import * as $protobuf from "protobufjs";
/** Namespace leancode. */
export namespace leancode {

    /** Namespace contracts. */
    namespace contracts {

        /** KnownType enum. */
        enum KnownType {
            Object = 0,
            String = 1,
            Guid = 3,
            Uri = 4,
            Boolean = 5,
            UInt8 = 100,
            Int8 = 101,
            Int16 = 102,
            UInt16 = 103,
            Int32 = 104,
            UInt32 = 105,
            Int64 = 106,
            UInt64 = 107,
            Float = 150,
            Double = 151,
            Decimal = 152,
            Date = 200,
            Time = 201,
            DateTime = 202,
            DateTimeOffset = 203,
            Array = 300,
            Map = 301,
            Query = 1000,
            Command = 1001,
            AuthorizeWhenAttribute = 1002,
            AuthorizeWhenHasAnyOfAttribute = 1003,
            QueryCacheAttribute = 1004,
            Attribute = 1005
        }

        /** Properties of a ValueRef. */
        interface IValueRef {

            /** ValueRef null */
            "null"?: (leancode.contracts.ValueRef.INull|null);

            /** ValueRef number */
            number?: (leancode.contracts.ValueRef.INumber|null);

            /** ValueRef floatingPoint */
            floatingPoint?: (leancode.contracts.ValueRef.IFloatingPointNumber|null);

            /** ValueRef string */
            string?: (leancode.contracts.ValueRef.IString|null);

            /** ValueRef bool */
            bool?: (leancode.contracts.ValueRef.IBoolean|null);
        }

        /** Represents a ValueRef. */
        class ValueRef implements IValueRef {

            /**
             * Constructs a new ValueRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IValueRef);

            /** ValueRef null. */
            public null?: (leancode.contracts.ValueRef.INull|null);

            /** ValueRef number. */
            public number?: (leancode.contracts.ValueRef.INumber|null);

            /** ValueRef floatingPoint. */
            public floatingPoint?: (leancode.contracts.ValueRef.IFloatingPointNumber|null);

            /** ValueRef string. */
            public string?: (leancode.contracts.ValueRef.IString|null);

            /** ValueRef bool. */
            public bool?: (leancode.contracts.ValueRef.IBoolean|null);

            /** ValueRef value. */
            public value?: ("null"|"number"|"floatingPoint"|"string"|"bool");

            /**
             * Decodes a ValueRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ValueRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef;

            /**
             * Decodes a ValueRef message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ValueRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef;

            /**
             * Verifies a ValueRef message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ValueRef message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ValueRef
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef;

            /**
             * Creates a plain object from a ValueRef message. Also converts values to other types if specified.
             * @param message ValueRef
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.ValueRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ValueRef to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ValueRef {

            /** Properties of a Null. */
            interface INull {
            }

            /** Represents a Null. */
            class Null implements INull {

                /**
                 * Constructs a new Null.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ValueRef.INull);

                /**
                 * Decodes a Null message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Null
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef.Null;

                /**
                 * Decodes a Null message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Null
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef.Null;

                /**
                 * Verifies a Null message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Null message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Null
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef.Null;

                /**
                 * Creates a plain object from a Null message. Also converts values to other types if specified.
                 * @param message Null
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ValueRef.Null, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Null to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Number. */
            interface INumber {

                /** Number value */
                value?: (number|Long|null);
            }

            /** Represents a Number. */
            class Number implements INumber {

                /**
                 * Constructs a new Number.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ValueRef.INumber);

                /** Number value. */
                public value: (number|Long);

                /**
                 * Decodes a Number message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Number
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef.Number;

                /**
                 * Decodes a Number message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Number
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef.Number;

                /**
                 * Verifies a Number message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Number message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Number
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef.Number;

                /**
                 * Creates a plain object from a Number message. Also converts values to other types if specified.
                 * @param message Number
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ValueRef.Number, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Number to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a FloatingPointNumber. */
            interface IFloatingPointNumber {

                /** FloatingPointNumber value */
                value?: (number|null);
            }

            /** Represents a FloatingPointNumber. */
            class FloatingPointNumber implements IFloatingPointNumber {

                /**
                 * Constructs a new FloatingPointNumber.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ValueRef.IFloatingPointNumber);

                /** FloatingPointNumber value. */
                public value: number;

                /**
                 * Decodes a FloatingPointNumber message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FloatingPointNumber
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef.FloatingPointNumber;

                /**
                 * Decodes a FloatingPointNumber message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FloatingPointNumber
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef.FloatingPointNumber;

                /**
                 * Verifies a FloatingPointNumber message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FloatingPointNumber message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FloatingPointNumber
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef.FloatingPointNumber;

                /**
                 * Creates a plain object from a FloatingPointNumber message. Also converts values to other types if specified.
                 * @param message FloatingPointNumber
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ValueRef.FloatingPointNumber, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FloatingPointNumber to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a String. */
            interface IString {

                /** String value */
                value?: (string|null);
            }

            /** Represents a String. */
            class String implements IString {

                /**
                 * Constructs a new String.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ValueRef.IString);

                /** String value. */
                public value: string;

                /**
                 * Decodes a String message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns String
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef.String;

                /**
                 * Decodes a String message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns String
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef.String;

                /**
                 * Verifies a String message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a String message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns String
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef.String;

                /**
                 * Creates a plain object from a String message. Also converts values to other types if specified.
                 * @param message String
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ValueRef.String, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this String to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Boolean. */
            interface IBoolean {

                /** Boolean value */
                value?: (boolean|null);
            }

            /** Represents a Boolean. */
            class Boolean implements IBoolean {

                /**
                 * Constructs a new Boolean.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ValueRef.IBoolean);

                /** Boolean value. */
                public value: boolean;

                /**
                 * Decodes a Boolean message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Boolean
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ValueRef.Boolean;

                /**
                 * Decodes a Boolean message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Boolean
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ValueRef.Boolean;

                /**
                 * Verifies a Boolean message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Boolean message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Boolean
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ValueRef.Boolean;

                /**
                 * Creates a plain object from a Boolean message. Also converts values to other types if specified.
                 * @param message Boolean
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ValueRef.Boolean, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Boolean to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a TypeRef. */
        interface ITypeRef {

            /** TypeRef nullable */
            nullable?: (boolean|null);

            /** TypeRef generic */
            generic?: (leancode.contracts.TypeRef.IGeneric|null);

            /** TypeRef internal */
            internal?: (leancode.contracts.TypeRef.IInternal|null);

            /** TypeRef known */
            known?: (leancode.contracts.TypeRef.IKnown|null);
        }

        /** Represents a TypeRef. */
        class TypeRef implements ITypeRef {

            /**
             * Constructs a new TypeRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.ITypeRef);

            /** TypeRef nullable. */
            public nullable: boolean;

            /** TypeRef generic. */
            public generic?: (leancode.contracts.TypeRef.IGeneric|null);

            /** TypeRef internal. */
            public internal?: (leancode.contracts.TypeRef.IInternal|null);

            /** TypeRef known. */
            public known?: (leancode.contracts.TypeRef.IKnown|null);

            /** TypeRef type. */
            public type?: ("generic"|"internal"|"known");

            /**
             * Decodes a TypeRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TypeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.TypeRef;

            /**
             * Decodes a TypeRef message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TypeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.TypeRef;

            /**
             * Verifies a TypeRef message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TypeRef message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TypeRef
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.TypeRef;

            /**
             * Creates a plain object from a TypeRef message. Also converts values to other types if specified.
             * @param message TypeRef
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.TypeRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TypeRef to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace TypeRef {

            /** Properties of a Generic. */
            interface IGeneric {

                /** Generic name */
                name?: (string|null);
            }

            /** Represents a Generic. */
            class Generic implements IGeneric {

                /**
                 * Constructs a new Generic.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.TypeRef.IGeneric);

                /** Generic name. */
                public name: string;

                /**
                 * Decodes a Generic message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Generic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.TypeRef.Generic;

                /**
                 * Decodes a Generic message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Generic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.TypeRef.Generic;

                /**
                 * Verifies a Generic message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Generic message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Generic
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.TypeRef.Generic;

                /**
                 * Creates a plain object from a Generic message. Also converts values to other types if specified.
                 * @param message Generic
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.TypeRef.Generic, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Generic to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Internal. */
            interface IInternal {

                /** Internal name */
                name?: (string|null);

                /** Internal arguments */
                "arguments"?: (leancode.contracts.ITypeRef[]|null);
            }

            /** Represents an Internal. */
            class Internal implements IInternal {

                /**
                 * Constructs a new Internal.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.TypeRef.IInternal);

                /** Internal name. */
                public name: string;

                /** Internal arguments. */
                public arguments: leancode.contracts.ITypeRef[];

                /**
                 * Decodes an Internal message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Internal
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.TypeRef.Internal;

                /**
                 * Decodes an Internal message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Internal
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.TypeRef.Internal;

                /**
                 * Verifies an Internal message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Internal message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Internal
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.TypeRef.Internal;

                /**
                 * Creates a plain object from an Internal message. Also converts values to other types if specified.
                 * @param message Internal
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.TypeRef.Internal, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Internal to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Known. */
            interface IKnown {

                /** Known type */
                type?: (leancode.contracts.KnownType|null);

                /** Known arguments */
                "arguments"?: (leancode.contracts.ITypeRef[]|null);
            }

            /** Represents a Known. */
            class Known implements IKnown {

                /**
                 * Constructs a new Known.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.TypeRef.IKnown);

                /** Known type. */
                public type: leancode.contracts.KnownType;

                /** Known arguments. */
                public arguments: leancode.contracts.ITypeRef[];

                /**
                 * Decodes a Known message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Known
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.TypeRef.Known;

                /**
                 * Decodes a Known message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Known
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.TypeRef.Known;

                /**
                 * Verifies a Known message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Known message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Known
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.TypeRef.Known;

                /**
                 * Creates a plain object from a Known message. Also converts values to other types if specified.
                 * @param message Known
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.TypeRef.Known, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Known to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a GenericParameter. */
        interface IGenericParameter {

            /** GenericParameter name */
            name?: (string|null);
        }

        /** Represents a GenericParameter. */
        class GenericParameter implements IGenericParameter {

            /**
             * Constructs a new GenericParameter.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IGenericParameter);

            /** GenericParameter name. */
            public name: string;

            /**
             * Decodes a GenericParameter message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GenericParameter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.GenericParameter;

            /**
             * Decodes a GenericParameter message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GenericParameter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.GenericParameter;

            /**
             * Verifies a GenericParameter message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GenericParameter message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GenericParameter
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.GenericParameter;

            /**
             * Creates a plain object from a GenericParameter message. Also converts values to other types if specified.
             * @param message GenericParameter
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.GenericParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GenericParameter to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an AttributeArgument. */
        interface IAttributeArgument {

            /** AttributeArgument positional */
            positional?: (leancode.contracts.AttributeArgument.IPositional|null);

            /** AttributeArgument named */
            named?: (leancode.contracts.AttributeArgument.INamed|null);
        }

        /** Represents an AttributeArgument. */
        class AttributeArgument implements IAttributeArgument {

            /**
             * Constructs a new AttributeArgument.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IAttributeArgument);

            /** AttributeArgument positional. */
            public positional?: (leancode.contracts.AttributeArgument.IPositional|null);

            /** AttributeArgument named. */
            public named?: (leancode.contracts.AttributeArgument.INamed|null);

            /** AttributeArgument attribute. */
            public attribute?: ("positional"|"named");

            /**
             * Decodes an AttributeArgument message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AttributeArgument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.AttributeArgument;

            /**
             * Decodes an AttributeArgument message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AttributeArgument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.AttributeArgument;

            /**
             * Verifies an AttributeArgument message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AttributeArgument message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AttributeArgument
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.AttributeArgument;

            /**
             * Creates a plain object from an AttributeArgument message. Also converts values to other types if specified.
             * @param message AttributeArgument
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.AttributeArgument, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AttributeArgument to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace AttributeArgument {

            /** Properties of a Positional. */
            interface IPositional {

                /** Positional position */
                position?: (number|null);

                /** Positional value */
                value?: (leancode.contracts.IValueRef|null);
            }

            /** Represents a Positional. */
            class Positional implements IPositional {

                /**
                 * Constructs a new Positional.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.AttributeArgument.IPositional);

                /** Positional position. */
                public position: number;

                /** Positional value. */
                public value?: (leancode.contracts.IValueRef|null);

                /**
                 * Decodes a Positional message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Positional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.AttributeArgument.Positional;

                /**
                 * Decodes a Positional message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Positional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.AttributeArgument.Positional;

                /**
                 * Verifies a Positional message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Positional message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Positional
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.AttributeArgument.Positional;

                /**
                 * Creates a plain object from a Positional message. Also converts values to other types if specified.
                 * @param message Positional
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.AttributeArgument.Positional, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Positional to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Named. */
            interface INamed {

                /** Named name */
                name?: (string|null);

                /** Named value */
                value?: (leancode.contracts.IValueRef|null);
            }

            /** Represents a Named. */
            class Named implements INamed {

                /**
                 * Constructs a new Named.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.AttributeArgument.INamed);

                /** Named name. */
                public name: string;

                /** Named value. */
                public value?: (leancode.contracts.IValueRef|null);

                /**
                 * Decodes a Named message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Named
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.AttributeArgument.Named;

                /**
                 * Decodes a Named message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Named
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.AttributeArgument.Named;

                /**
                 * Verifies a Named message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Named message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Named
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.AttributeArgument.Named;

                /**
                 * Creates a plain object from a Named message. Also converts values to other types if specified.
                 * @param message Named
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.AttributeArgument.Named, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Named to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an AttributeRef. */
        interface IAttributeRef {

            /** AttributeRef attributeName */
            attributeName?: (string|null);

            /** AttributeRef argument */
            argument?: (leancode.contracts.IAttributeArgument[]|null);
        }

        /** Represents an AttributeRef. */
        class AttributeRef implements IAttributeRef {

            /**
             * Constructs a new AttributeRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IAttributeRef);

            /** AttributeRef attributeName. */
            public attributeName: string;

            /** AttributeRef argument. */
            public argument: leancode.contracts.IAttributeArgument[];

            /**
             * Decodes an AttributeRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AttributeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.AttributeRef;

            /**
             * Decodes an AttributeRef message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AttributeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.AttributeRef;

            /**
             * Verifies an AttributeRef message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AttributeRef message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AttributeRef
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.AttributeRef;

            /**
             * Creates a plain object from an AttributeRef message. Also converts values to other types if specified.
             * @param message AttributeRef
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.AttributeRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AttributeRef to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a PropertyRef. */
        interface IPropertyRef {

            /** PropertyRef type */
            type?: (leancode.contracts.ITypeRef|null);

            /** PropertyRef name */
            name?: (string|null);

            /** PropertyRef attributes */
            attributes?: (leancode.contracts.IAttributeRef[]|null);

            /** PropertyRef comment */
            comment?: (string|null);
        }

        /** Represents a PropertyRef. */
        class PropertyRef implements IPropertyRef {

            /**
             * Constructs a new PropertyRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IPropertyRef);

            /** PropertyRef type. */
            public type?: (leancode.contracts.ITypeRef|null);

            /** PropertyRef name. */
            public name: string;

            /** PropertyRef attributes. */
            public attributes: leancode.contracts.IAttributeRef[];

            /** PropertyRef comment. */
            public comment: string;

            /**
             * Decodes a PropertyRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PropertyRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.PropertyRef;

            /**
             * Decodes a PropertyRef message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PropertyRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.PropertyRef;

            /**
             * Verifies a PropertyRef message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PropertyRef message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PropertyRef
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.PropertyRef;

            /**
             * Creates a plain object from a PropertyRef message. Also converts values to other types if specified.
             * @param message PropertyRef
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.PropertyRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PropertyRef to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ConstantRef. */
        interface IConstantRef {

            /** ConstantRef name */
            name?: (string|null);

            /** ConstantRef value */
            value?: (leancode.contracts.IValueRef|null);

            /** ConstantRef comment */
            comment?: (string|null);
        }

        /** Represents a ConstantRef. */
        class ConstantRef implements IConstantRef {

            /**
             * Constructs a new ConstantRef.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IConstantRef);

            /** ConstantRef name. */
            public name: string;

            /** ConstantRef value. */
            public value?: (leancode.contracts.IValueRef|null);

            /** ConstantRef comment. */
            public comment: string;

            /**
             * Decodes a ConstantRef message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConstantRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ConstantRef;

            /**
             * Decodes a ConstantRef message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConstantRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ConstantRef;

            /**
             * Verifies a ConstantRef message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConstantRef message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConstantRef
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.ConstantRef;

            /**
             * Creates a plain object from a ConstantRef message. Also converts values to other types if specified.
             * @param message ConstantRef
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.ConstantRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConstantRef to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumValue. */
        interface IEnumValue {

            /** EnumValue name */
            name?: (string|null);

            /** EnumValue value */
            value?: (number|Long|null);

            /** EnumValue comment */
            comment?: (string|null);
        }

        /** Represents an EnumValue. */
        class EnumValue implements IEnumValue {

            /**
             * Constructs a new EnumValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IEnumValue);

            /** EnumValue name. */
            public name: string;

            /** EnumValue value. */
            public value: (number|Long);

            /** EnumValue comment. */
            public comment: string;

            /**
             * Decodes an EnumValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.EnumValue;

            /**
             * Decodes an EnumValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.EnumValue;

            /**
             * Verifies an EnumValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValue
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.EnumValue;

            /**
             * Creates a plain object from an EnumValue message. Also converts values to other types if specified.
             * @param message EnumValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.EnumValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an ErrorCode. */
        interface IErrorCode {

            /** ErrorCode single */
            single?: (leancode.contracts.ErrorCode.ISingle|null);

            /** ErrorCode group */
            group?: (leancode.contracts.ErrorCode.IGroup|null);
        }

        /** Represents an ErrorCode. */
        class ErrorCode implements IErrorCode {

            /**
             * Constructs a new ErrorCode.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IErrorCode);

            /** ErrorCode single. */
            public single?: (leancode.contracts.ErrorCode.ISingle|null);

            /** ErrorCode group. */
            public group?: (leancode.contracts.ErrorCode.IGroup|null);

            /** ErrorCode code. */
            public code?: ("single"|"group");

            /**
             * Decodes an ErrorCode message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ErrorCode
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ErrorCode;

            /**
             * Decodes an ErrorCode message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ErrorCode
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ErrorCode;

            /**
             * Verifies an ErrorCode message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ErrorCode message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ErrorCode
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.ErrorCode;

            /**
             * Creates a plain object from an ErrorCode message. Also converts values to other types if specified.
             * @param message ErrorCode
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.ErrorCode, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ErrorCode to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ErrorCode {

            /** Properties of a Single. */
            interface ISingle {

                /** Single name */
                name?: (string|null);

                /** Single code */
                code?: (number|null);
            }

            /** Represents a Single. */
            class Single implements ISingle {

                /**
                 * Constructs a new Single.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ErrorCode.ISingle);

                /** Single name. */
                public name: string;

                /** Single code. */
                public code: number;

                /**
                 * Decodes a Single message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Single
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ErrorCode.Single;

                /**
                 * Decodes a Single message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Single
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ErrorCode.Single;

                /**
                 * Verifies a Single message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Single message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Single
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ErrorCode.Single;

                /**
                 * Creates a plain object from a Single message. Also converts values to other types if specified.
                 * @param message Single
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ErrorCode.Single, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Single to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Group. */
            interface IGroup {

                /** Group name */
                name?: (string|null);

                /** Group groupId */
                groupId?: (string|null);

                /** Group innerCodes */
                innerCodes?: (leancode.contracts.IErrorCode[]|null);
            }

            /** Represents a Group. */
            class Group implements IGroup {

                /**
                 * Constructs a new Group.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.ErrorCode.IGroup);

                /** Group name. */
                public name: string;

                /** Group groupId. */
                public groupId: string;

                /** Group innerCodes. */
                public innerCodes: leancode.contracts.IErrorCode[];

                /**
                 * Decodes a Group message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.ErrorCode.Group;

                /**
                 * Decodes a Group message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.ErrorCode.Group;

                /**
                 * Verifies a Group message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Group message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Group
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.ErrorCode.Group;

                /**
                 * Creates a plain object from a Group message. Also converts values to other types if specified.
                 * @param message Group
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.ErrorCode.Group, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Group to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a Statement. */
        interface IStatement {

            /** Statement name */
            name?: (string|null);

            /** Statement comment */
            comment?: (string|null);

            /** Statement extends */
            "extends"?: (leancode.contracts.ITypeRef[]|null);

            /** Statement genericParameters */
            genericParameters?: (leancode.contracts.IGenericParameter[]|null);

            /** Statement attributes */
            attributes?: (leancode.contracts.IAttributeRef[]|null);

            /** Statement properties */
            properties?: (leancode.contracts.IPropertyRef[]|null);

            /** Statement constants */
            constants?: (leancode.contracts.IConstantRef[]|null);

            /** Statement dto */
            dto?: (leancode.contracts.Statement.IDTO|null);

            /** Statement enum */
            "enum"?: (leancode.contracts.Statement.IEnum|null);

            /** Statement query */
            query?: (leancode.contracts.Statement.IQuery|null);

            /** Statement command */
            command?: (leancode.contracts.Statement.ICommand|null);
        }

        /** Represents a Statement. */
        class Statement implements IStatement {

            /**
             * Constructs a new Statement.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IStatement);

            /** Statement name. */
            public name: string;

            /** Statement comment. */
            public comment: string;

            /** Statement extends. */
            public extends: leancode.contracts.ITypeRef[];

            /** Statement genericParameters. */
            public genericParameters: leancode.contracts.IGenericParameter[];

            /** Statement attributes. */
            public attributes: leancode.contracts.IAttributeRef[];

            /** Statement properties. */
            public properties: leancode.contracts.IPropertyRef[];

            /** Statement constants. */
            public constants: leancode.contracts.IConstantRef[];

            /** Statement dto. */
            public dto?: (leancode.contracts.Statement.IDTO|null);

            /** Statement enum. */
            public enum?: (leancode.contracts.Statement.IEnum|null);

            /** Statement query. */
            public query?: (leancode.contracts.Statement.IQuery|null);

            /** Statement command. */
            public command?: (leancode.contracts.Statement.ICommand|null);

            /** Statement content. */
            public content?: ("dto"|"enum"|"query"|"command");

            /**
             * Decodes a Statement message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Statement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Statement;

            /**
             * Decodes a Statement message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Statement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Statement;

            /**
             * Verifies a Statement message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Statement message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Statement
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.Statement;

            /**
             * Creates a plain object from a Statement message. Also converts values to other types if specified.
             * @param message Statement
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.Statement, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Statement to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Statement {

            /** Properties of a DTO. */
            interface IDTO {
            }

            /** Represents a DTO. */
            class DTO implements IDTO {

                /**
                 * Constructs a new DTO.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.Statement.IDTO);

                /**
                 * Decodes a DTO message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DTO
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Statement.DTO;

                /**
                 * Decodes a DTO message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DTO
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Statement.DTO;

                /**
                 * Verifies a DTO message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DTO message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DTO
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.Statement.DTO;

                /**
                 * Creates a plain object from a DTO message. Also converts values to other types if specified.
                 * @param message DTO
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.Statement.DTO, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DTO to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an Enum. */
            interface IEnum {

                /** Enum members */
                members?: (leancode.contracts.IEnumValue[]|null);
            }

            /** Represents an Enum. */
            class Enum implements IEnum {

                /**
                 * Constructs a new Enum.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.Statement.IEnum);

                /** Enum members. */
                public members: leancode.contracts.IEnumValue[];

                /**
                 * Decodes an Enum message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Enum
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Statement.Enum;

                /**
                 * Decodes an Enum message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Enum
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Statement.Enum;

                /**
                 * Verifies an Enum message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Enum message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Enum
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.Statement.Enum;

                /**
                 * Creates a plain object from an Enum message. Also converts values to other types if specified.
                 * @param message Enum
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.Statement.Enum, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Enum to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Query. */
            interface IQuery {

                /** Query returnType */
                returnType?: (leancode.contracts.ITypeRef|null);
            }

            /** Represents a Query. */
            class Query implements IQuery {

                /**
                 * Constructs a new Query.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.Statement.IQuery);

                /** Query returnType. */
                public returnType?: (leancode.contracts.ITypeRef|null);

                /**
                 * Decodes a Query message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Query
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Statement.Query;

                /**
                 * Decodes a Query message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Query
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Statement.Query;

                /**
                 * Verifies a Query message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Query message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Query
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.Statement.Query;

                /**
                 * Creates a plain object from a Query message. Also converts values to other types if specified.
                 * @param message Query
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.Statement.Query, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Query to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Command. */
            interface ICommand {

                /** Command errorCodes */
                errorCodes?: (leancode.contracts.IErrorCode[]|null);
            }

            /** Represents a Command. */
            class Command implements ICommand {

                /**
                 * Constructs a new Command.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: leancode.contracts.Statement.ICommand);

                /** Command errorCodes. */
                public errorCodes: leancode.contracts.IErrorCode[];

                /**
                 * Decodes a Command message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Command
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Statement.Command;

                /**
                 * Decodes a Command message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Command
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Statement.Command;

                /**
                 * Verifies a Command message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Command message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Command
                 */
                public static fromObject(object: { [k: string]: any }): leancode.contracts.Statement.Command;

                /**
                 * Creates a plain object from a Command message. Also converts values to other types if specified.
                 * @param message Command
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: leancode.contracts.Statement.Command, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Command to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an Export. */
        interface IExport {

            /** Export projectName */
            projectName?: (string|null);

            /** Export statements */
            statements?: (leancode.contracts.IStatement[]|null);

            /** Export knownErrorGroups */
            knownErrorGroups?: (leancode.contracts.ErrorCode.IGroup[]|null);
        }

        /** Represents an Export. */
        class Export implements IExport {

            /**
             * Constructs a new Export.
             * @param [properties] Properties to set
             */
            constructor(properties?: leancode.contracts.IExport);

            /** Export projectName. */
            public projectName: string;

            /** Export statements. */
            public statements: leancode.contracts.IStatement[];

            /** Export knownErrorGroups. */
            public knownErrorGroups: leancode.contracts.ErrorCode.IGroup[];

            /**
             * Decodes an Export message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Export
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): leancode.contracts.Export;

            /**
             * Decodes an Export message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Export
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): leancode.contracts.Export;

            /**
             * Verifies an Export message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Export message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Export
             */
            public static fromObject(object: { [k: string]: any }): leancode.contracts.Export;

            /**
             * Creates a plain object from an Export message. Also converts values to other types if specified.
             * @param message Export
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: leancode.contracts.Export, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Export to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
