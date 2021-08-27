/*eslint-disable prettier/prettier,no-undef,no-prototype-builtins,no-redeclare*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.leancode = (function() {

    /**
     * Namespace leancode.
     * @exports leancode
     * @namespace
     */
    var leancode = {};

    leancode.contracts = (function() {

        /**
         * Namespace contracts.
         * @memberof leancode
         * @namespace
         */
        var contracts = {};

        /**
         * KnownType enum.
         * @name leancode.contracts.KnownType
         * @enum {number}
         * @property {number} Object=0 Object value
         * @property {number} String=1 String value
         * @property {number} Guid=3 Guid value
         * @property {number} Uri=4 Uri value
         * @property {number} Boolean=5 Boolean value
         * @property {number} UInt8=100 UInt8 value
         * @property {number} Int8=101 Int8 value
         * @property {number} Int16=102 Int16 value
         * @property {number} UInt16=103 UInt16 value
         * @property {number} Int32=104 Int32 value
         * @property {number} UInt32=105 UInt32 value
         * @property {number} Int64=106 Int64 value
         * @property {number} UInt64=107 UInt64 value
         * @property {number} Float=150 Float value
         * @property {number} Double=151 Double value
         * @property {number} Decimal=152 Decimal value
         * @property {number} DateOnly=200 DateOnly value
         * @property {number} TimeOnly=201 TimeOnly value
         * @property {number} DateTime=202 DateTime value
         * @property {number} DateTimeOffset=203 DateTimeOffset value
         * @property {number} TimeSpan=204 TimeSpan value
         * @property {number} Date=205 Date value
         * @property {number} Time=206 Time value
         * @property {number} Array=300 Array value
         * @property {number} Map=301 Map value
         * @property {number} Query=1000 Query value
         * @property {number} Command=1001 Command value
         * @property {number} CommandResult=1002 CommandResult value
         * @property {number} Attribute=1100 Attribute value
         * @property {number} AuthorizeWhenAttribute=1101 AuthorizeWhenAttribute value
         * @property {number} AuthorizeWhenHasAnyOfAttribute=1102 AuthorizeWhenHasAnyOfAttribute value
         * @property {number} QueryCacheAttribute=1103 QueryCacheAttribute value
         */
        contracts.KnownType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Object"] = 0;
            values[valuesById[1] = "String"] = 1;
            values[valuesById[3] = "Guid"] = 3;
            values[valuesById[4] = "Uri"] = 4;
            values[valuesById[5] = "Boolean"] = 5;
            values[valuesById[100] = "UInt8"] = 100;
            values[valuesById[101] = "Int8"] = 101;
            values[valuesById[102] = "Int16"] = 102;
            values[valuesById[103] = "UInt16"] = 103;
            values[valuesById[104] = "Int32"] = 104;
            values[valuesById[105] = "UInt32"] = 105;
            values[valuesById[106] = "Int64"] = 106;
            values[valuesById[107] = "UInt64"] = 107;
            values[valuesById[150] = "Float"] = 150;
            values[valuesById[151] = "Double"] = 151;
            values[valuesById[152] = "Decimal"] = 152;
            values[valuesById[200] = "DateOnly"] = 200;
            values[valuesById[201] = "TimeOnly"] = 201;
            values[valuesById[202] = "DateTime"] = 202;
            values[valuesById[203] = "DateTimeOffset"] = 203;
            values[valuesById[204] = "TimeSpan"] = 204;
            values[valuesById[205] = "Date"] = 205;
            values[valuesById[206] = "Time"] = 206;
            values[valuesById[300] = "Array"] = 300;
            values[valuesById[301] = "Map"] = 301;
            values[valuesById[1000] = "Query"] = 1000;
            values[valuesById[1001] = "Command"] = 1001;
            values[valuesById[1002] = "CommandResult"] = 1002;
            values[valuesById[1100] = "Attribute"] = 1100;
            values[valuesById[1101] = "AuthorizeWhenAttribute"] = 1101;
            values[valuesById[1102] = "AuthorizeWhenHasAnyOfAttribute"] = 1102;
            values[valuesById[1103] = "QueryCacheAttribute"] = 1103;
            return values;
        })();

        contracts.ValueRef = (function() {

            /**
             * Properties of a ValueRef.
             * @memberof leancode.contracts
             * @interface IValueRef
             * @property {leancode.contracts.ValueRef.INull|null} ["null"] ValueRef null
             * @property {leancode.contracts.ValueRef.INumber|null} [number] ValueRef number
             * @property {leancode.contracts.ValueRef.IFloatingPointNumber|null} [floatingPoint] ValueRef floatingPoint
             * @property {leancode.contracts.ValueRef.IString|null} [string] ValueRef string
             * @property {leancode.contracts.ValueRef.IBoolean|null} [bool] ValueRef bool
             */

            /**
             * Constructs a new ValueRef.
             * @memberof leancode.contracts
             * @classdesc Represents a ValueRef.
             * @implements IValueRef
             * @constructor
             * @param {leancode.contracts.IValueRef=} [properties] Properties to set
             */
            function ValueRef(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ValueRef null.
             * @member {leancode.contracts.ValueRef.INull|null|undefined} null
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            ValueRef.prototype["null"] = null;

            /**
             * ValueRef number.
             * @member {leancode.contracts.ValueRef.INumber|null|undefined} number
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            ValueRef.prototype.number = null;

            /**
             * ValueRef floatingPoint.
             * @member {leancode.contracts.ValueRef.IFloatingPointNumber|null|undefined} floatingPoint
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            ValueRef.prototype.floatingPoint = null;

            /**
             * ValueRef string.
             * @member {leancode.contracts.ValueRef.IString|null|undefined} string
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            ValueRef.prototype.string = null;

            /**
             * ValueRef bool.
             * @member {leancode.contracts.ValueRef.IBoolean|null|undefined} bool
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            ValueRef.prototype.bool = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ValueRef value.
             * @member {"null"|"number"|"floatingPoint"|"string"|"bool"|undefined} value
             * @memberof leancode.contracts.ValueRef
             * @instance
             */
            Object.defineProperty(ValueRef.prototype, "value", {
                get: $util.oneOfGetter($oneOfFields = ["null", "number", "floatingPoint", "string", "bool"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Decodes a ValueRef message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.ValueRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.ValueRef} ValueRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueRef.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message["null"] = $root.leancode.contracts.ValueRef.Null.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.number = $root.leancode.contracts.ValueRef.Number.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.floatingPoint = $root.leancode.contracts.ValueRef.FloatingPointNumber.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.string = $root.leancode.contracts.ValueRef.String.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.bool = $root.leancode.contracts.ValueRef.Boolean.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ValueRef message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.ValueRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.ValueRef} ValueRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ValueRef.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ValueRef message.
             * @function verify
             * @memberof leancode.contracts.ValueRef
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ValueRef.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message["null"] != null && message.hasOwnProperty("null")) {
                    properties.value = 1;
                    {
                        var error = $root.leancode.contracts.ValueRef.Null.verify(message["null"]);
                        if (error)
                            return "null." + error;
                    }
                }
                if (message.number != null && message.hasOwnProperty("number")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    {
                        var error = $root.leancode.contracts.ValueRef.Number.verify(message.number);
                        if (error)
                            return "number." + error;
                    }
                }
                if (message.floatingPoint != null && message.hasOwnProperty("floatingPoint")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    {
                        var error = $root.leancode.contracts.ValueRef.FloatingPointNumber.verify(message.floatingPoint);
                        if (error)
                            return "floatingPoint." + error;
                    }
                }
                if (message.string != null && message.hasOwnProperty("string")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    {
                        var error = $root.leancode.contracts.ValueRef.String.verify(message.string);
                        if (error)
                            return "string." + error;
                    }
                }
                if (message.bool != null && message.hasOwnProperty("bool")) {
                    if (properties.value === 1)
                        return "value: multiple values";
                    properties.value = 1;
                    {
                        var error = $root.leancode.contracts.ValueRef.Boolean.verify(message.bool);
                        if (error)
                            return "bool." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ValueRef message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.ValueRef
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.ValueRef} ValueRef
             */
            ValueRef.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.ValueRef)
                    return object;
                var message = new $root.leancode.contracts.ValueRef();
                if (object["null"] != null) {
                    if (typeof object["null"] !== "object")
                        throw TypeError(".leancode.contracts.ValueRef.null: object expected");
                    message["null"] = $root.leancode.contracts.ValueRef.Null.fromObject(object["null"]);
                }
                if (object.number != null) {
                    if (typeof object.number !== "object")
                        throw TypeError(".leancode.contracts.ValueRef.number: object expected");
                    message.number = $root.leancode.contracts.ValueRef.Number.fromObject(object.number);
                }
                if (object.floatingPoint != null) {
                    if (typeof object.floatingPoint !== "object")
                        throw TypeError(".leancode.contracts.ValueRef.floatingPoint: object expected");
                    message.floatingPoint = $root.leancode.contracts.ValueRef.FloatingPointNumber.fromObject(object.floatingPoint);
                }
                if (object.string != null) {
                    if (typeof object.string !== "object")
                        throw TypeError(".leancode.contracts.ValueRef.string: object expected");
                    message.string = $root.leancode.contracts.ValueRef.String.fromObject(object.string);
                }
                if (object.bool != null) {
                    if (typeof object.bool !== "object")
                        throw TypeError(".leancode.contracts.ValueRef.bool: object expected");
                    message.bool = $root.leancode.contracts.ValueRef.Boolean.fromObject(object.bool);
                }
                return message;
            };

            /**
             * Creates a plain object from a ValueRef message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.ValueRef
             * @static
             * @param {leancode.contracts.ValueRef} message ValueRef
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ValueRef.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message["null"] != null && message.hasOwnProperty("null")) {
                    object["null"] = $root.leancode.contracts.ValueRef.Null.toObject(message["null"], options);
                    if (options.oneofs)
                        object.value = "null";
                }
                if (message.number != null && message.hasOwnProperty("number")) {
                    object.number = $root.leancode.contracts.ValueRef.Number.toObject(message.number, options);
                    if (options.oneofs)
                        object.value = "number";
                }
                if (message.floatingPoint != null && message.hasOwnProperty("floatingPoint")) {
                    object.floatingPoint = $root.leancode.contracts.ValueRef.FloatingPointNumber.toObject(message.floatingPoint, options);
                    if (options.oneofs)
                        object.value = "floatingPoint";
                }
                if (message.string != null && message.hasOwnProperty("string")) {
                    object.string = $root.leancode.contracts.ValueRef.String.toObject(message.string, options);
                    if (options.oneofs)
                        object.value = "string";
                }
                if (message.bool != null && message.hasOwnProperty("bool")) {
                    object.bool = $root.leancode.contracts.ValueRef.Boolean.toObject(message.bool, options);
                    if (options.oneofs)
                        object.value = "bool";
                }
                return object;
            };

            /**
             * Converts this ValueRef to JSON.
             * @function toJSON
             * @memberof leancode.contracts.ValueRef
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ValueRef.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ValueRef.Null = (function() {

                /**
                 * Properties of a Null.
                 * @memberof leancode.contracts.ValueRef
                 * @interface INull
                 */

                /**
                 * Constructs a new Null.
                 * @memberof leancode.contracts.ValueRef
                 * @classdesc Represents a Null.
                 * @implements INull
                 * @constructor
                 * @param {leancode.contracts.ValueRef.INull=} [properties] Properties to set
                 */
                function Null(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Decodes a Null message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ValueRef.Null
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ValueRef.Null} Null
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Null.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef.Null();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Null message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ValueRef.Null
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ValueRef.Null} Null
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Null.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Null message.
                 * @function verify
                 * @memberof leancode.contracts.ValueRef.Null
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Null.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    return null;
                };

                /**
                 * Creates a Null message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ValueRef.Null
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ValueRef.Null} Null
                 */
                Null.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ValueRef.Null)
                        return object;
                    return new $root.leancode.contracts.ValueRef.Null();
                };

                /**
                 * Creates a plain object from a Null message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ValueRef.Null
                 * @static
                 * @param {leancode.contracts.ValueRef.Null} message Null
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Null.toObject = function toObject() {
                    return {};
                };

                /**
                 * Converts this Null to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ValueRef.Null
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Null.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Null;
            })();

            ValueRef.Number = (function() {

                /**
                 * Properties of a Number.
                 * @memberof leancode.contracts.ValueRef
                 * @interface INumber
                 * @property {number|Long|null} [value] Number value
                 */

                /**
                 * Constructs a new Number.
                 * @memberof leancode.contracts.ValueRef
                 * @classdesc Represents a Number.
                 * @implements INumber
                 * @constructor
                 * @param {leancode.contracts.ValueRef.INumber=} [properties] Properties to set
                 */
                function Number(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Number value.
                 * @member {number|Long} value
                 * @memberof leancode.contracts.ValueRef.Number
                 * @instance
                 */
                Number.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * Decodes a Number message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ValueRef.Number
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ValueRef.Number} Number
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Number.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef.Number();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.int64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Number message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ValueRef.Number
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ValueRef.Number} Number
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Number.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Number message.
                 * @function verify
                 * @memberof leancode.contracts.ValueRef.Number
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Number.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                            return "value: integer|Long expected";
                    return null;
                };

                /**
                 * Creates a Number message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ValueRef.Number
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ValueRef.Number} Number
                 */
                Number.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ValueRef.Number)
                        return object;
                    var message = new $root.leancode.contracts.ValueRef.Number();
                    if (object.value != null)
                        if ($util.Long)
                            (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                        else if (typeof object.value === "string")
                            message.value = parseInt(object.value, 10);
                        else if (typeof object.value === "number")
                            message.value = object.value;
                        else if (typeof object.value === "object")
                            message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                    return message;
                };

                /**
                 * Creates a plain object from a Number message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ValueRef.Number
                 * @static
                 * @param {leancode.contracts.ValueRef.Number} message Number
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Number.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.value = options.longs === String ? "0" : 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value === "number")
                            object.value = options.longs === String ? String(message.value) : message.value;
                        else
                            object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                    return object;
                };

                /**
                 * Converts this Number to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ValueRef.Number
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Number.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Number;
            })();

            ValueRef.FloatingPointNumber = (function() {

                /**
                 * Properties of a FloatingPointNumber.
                 * @memberof leancode.contracts.ValueRef
                 * @interface IFloatingPointNumber
                 * @property {number|null} [value] FloatingPointNumber value
                 */

                /**
                 * Constructs a new FloatingPointNumber.
                 * @memberof leancode.contracts.ValueRef
                 * @classdesc Represents a FloatingPointNumber.
                 * @implements IFloatingPointNumber
                 * @constructor
                 * @param {leancode.contracts.ValueRef.IFloatingPointNumber=} [properties] Properties to set
                 */
                function FloatingPointNumber(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FloatingPointNumber value.
                 * @member {number} value
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @instance
                 */
                FloatingPointNumber.prototype.value = 0;

                /**
                 * Decodes a FloatingPointNumber message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ValueRef.FloatingPointNumber} FloatingPointNumber
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatingPointNumber.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef.FloatingPointNumber();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.double();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a FloatingPointNumber message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ValueRef.FloatingPointNumber} FloatingPointNumber
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FloatingPointNumber.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a FloatingPointNumber message.
                 * @function verify
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FloatingPointNumber.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value !== "number")
                            return "value: number expected";
                    return null;
                };

                /**
                 * Creates a FloatingPointNumber message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ValueRef.FloatingPointNumber} FloatingPointNumber
                 */
                FloatingPointNumber.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ValueRef.FloatingPointNumber)
                        return object;
                    var message = new $root.leancode.contracts.ValueRef.FloatingPointNumber();
                    if (object.value != null)
                        message.value = Number(object.value);
                    return message;
                };

                /**
                 * Creates a plain object from a FloatingPointNumber message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @static
                 * @param {leancode.contracts.ValueRef.FloatingPointNumber} message FloatingPointNumber
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FloatingPointNumber.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = 0;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                    return object;
                };

                /**
                 * Converts this FloatingPointNumber to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ValueRef.FloatingPointNumber
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FloatingPointNumber.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return FloatingPointNumber;
            })();

            ValueRef.String = (function() {

                /**
                 * Properties of a String.
                 * @memberof leancode.contracts.ValueRef
                 * @interface IString
                 * @property {string|null} [value] String value
                 */

                /**
                 * Constructs a new String.
                 * @memberof leancode.contracts.ValueRef
                 * @classdesc Represents a String.
                 * @implements IString
                 * @constructor
                 * @param {leancode.contracts.ValueRef.IString=} [properties] Properties to set
                 */
                function String(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * String value.
                 * @member {string} value
                 * @memberof leancode.contracts.ValueRef.String
                 * @instance
                 */
                String.prototype.value = "";

                /**
                 * Decodes a String message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ValueRef.String
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ValueRef.String} String
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                String.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef.String();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a String message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ValueRef.String
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ValueRef.String} String
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                String.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a String message.
                 * @function verify
                 * @memberof leancode.contracts.ValueRef.String
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                String.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isString(message.value))
                            return "value: string expected";
                    return null;
                };

                /**
                 * Creates a String message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ValueRef.String
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ValueRef.String} String
                 */
                String.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ValueRef.String)
                        return object;
                    var message = new $root.leancode.contracts.ValueRef.String();
                    if (object.value != null)
                        message.value = String(object.value);
                    return message;
                };

                /**
                 * Creates a plain object from a String message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ValueRef.String
                 * @static
                 * @param {leancode.contracts.ValueRef.String} message String
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                String.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = "";
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };

                /**
                 * Converts this String to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ValueRef.String
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                String.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return String;
            })();

            ValueRef.Boolean = (function() {

                /**
                 * Properties of a Boolean.
                 * @memberof leancode.contracts.ValueRef
                 * @interface IBoolean
                 * @property {boolean|null} [value] Boolean value
                 */

                /**
                 * Constructs a new Boolean.
                 * @memberof leancode.contracts.ValueRef
                 * @classdesc Represents a Boolean.
                 * @implements IBoolean
                 * @constructor
                 * @param {leancode.contracts.ValueRef.IBoolean=} [properties] Properties to set
                 */
                function Boolean(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Boolean value.
                 * @member {boolean} value
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @instance
                 */
                Boolean.prototype.value = false;

                /**
                 * Decodes a Boolean message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ValueRef.Boolean} Boolean
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Boolean.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ValueRef.Boolean();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.value = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Boolean message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ValueRef.Boolean} Boolean
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Boolean.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Boolean message.
                 * @function verify
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Boolean.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (typeof message.value !== "boolean")
                            return "value: boolean expected";
                    return null;
                };

                /**
                 * Creates a Boolean message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ValueRef.Boolean} Boolean
                 */
                Boolean.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ValueRef.Boolean)
                        return object;
                    var message = new $root.leancode.contracts.ValueRef.Boolean();
                    if (object.value != null)
                        message.value = Boolean(object.value);
                    return message;
                };

                /**
                 * Creates a plain object from a Boolean message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @static
                 * @param {leancode.contracts.ValueRef.Boolean} message Boolean
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Boolean.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.value = false;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };

                /**
                 * Converts this Boolean to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ValueRef.Boolean
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Boolean.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Boolean;
            })();

            return ValueRef;
        })();

        contracts.TypeRef = (function() {

            /**
             * Properties of a TypeRef.
             * @memberof leancode.contracts
             * @interface ITypeRef
             * @property {boolean|null} [nullable] TypeRef nullable
             * @property {leancode.contracts.TypeRef.IGeneric|null} [generic] TypeRef generic
             * @property {leancode.contracts.TypeRef.IInternal|null} [internal] TypeRef internal
             * @property {leancode.contracts.TypeRef.IKnown|null} [known] TypeRef known
             */

            /**
             * Constructs a new TypeRef.
             * @memberof leancode.contracts
             * @classdesc Represents a TypeRef.
             * @implements ITypeRef
             * @constructor
             * @param {leancode.contracts.ITypeRef=} [properties] Properties to set
             */
            function TypeRef(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TypeRef nullable.
             * @member {boolean} nullable
             * @memberof leancode.contracts.TypeRef
             * @instance
             */
            TypeRef.prototype.nullable = false;

            /**
             * TypeRef generic.
             * @member {leancode.contracts.TypeRef.IGeneric|null|undefined} generic
             * @memberof leancode.contracts.TypeRef
             * @instance
             */
            TypeRef.prototype.generic = null;

            /**
             * TypeRef internal.
             * @member {leancode.contracts.TypeRef.IInternal|null|undefined} internal
             * @memberof leancode.contracts.TypeRef
             * @instance
             */
            TypeRef.prototype.internal = null;

            /**
             * TypeRef known.
             * @member {leancode.contracts.TypeRef.IKnown|null|undefined} known
             * @memberof leancode.contracts.TypeRef
             * @instance
             */
            TypeRef.prototype.known = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * TypeRef type.
             * @member {"generic"|"internal"|"known"|undefined} type
             * @memberof leancode.contracts.TypeRef
             * @instance
             */
            Object.defineProperty(TypeRef.prototype, "type", {
                get: $util.oneOfGetter($oneOfFields = ["generic", "internal", "known"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Decodes a TypeRef message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.TypeRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.TypeRef} TypeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypeRef.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.TypeRef();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.nullable = reader.bool();
                        break;
                    case 2:
                        message.generic = $root.leancode.contracts.TypeRef.Generic.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.internal = $root.leancode.contracts.TypeRef.Internal.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.known = $root.leancode.contracts.TypeRef.Known.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a TypeRef message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.TypeRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.TypeRef} TypeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypeRef.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TypeRef message.
             * @function verify
             * @memberof leancode.contracts.TypeRef
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TypeRef.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.nullable != null && message.hasOwnProperty("nullable"))
                    if (typeof message.nullable !== "boolean")
                        return "nullable: boolean expected";
                if (message.generic != null && message.hasOwnProperty("generic")) {
                    properties.type = 1;
                    {
                        var error = $root.leancode.contracts.TypeRef.Generic.verify(message.generic);
                        if (error)
                            return "generic." + error;
                    }
                }
                if (message.internal != null && message.hasOwnProperty("internal")) {
                    if (properties.type === 1)
                        return "type: multiple values";
                    properties.type = 1;
                    {
                        var error = $root.leancode.contracts.TypeRef.Internal.verify(message.internal);
                        if (error)
                            return "internal." + error;
                    }
                }
                if (message.known != null && message.hasOwnProperty("known")) {
                    if (properties.type === 1)
                        return "type: multiple values";
                    properties.type = 1;
                    {
                        var error = $root.leancode.contracts.TypeRef.Known.verify(message.known);
                        if (error)
                            return "known." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a TypeRef message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.TypeRef
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.TypeRef} TypeRef
             */
            TypeRef.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.TypeRef)
                    return object;
                var message = new $root.leancode.contracts.TypeRef();
                if (object.nullable != null)
                    message.nullable = Boolean(object.nullable);
                if (object.generic != null) {
                    if (typeof object.generic !== "object")
                        throw TypeError(".leancode.contracts.TypeRef.generic: object expected");
                    message.generic = $root.leancode.contracts.TypeRef.Generic.fromObject(object.generic);
                }
                if (object.internal != null) {
                    if (typeof object.internal !== "object")
                        throw TypeError(".leancode.contracts.TypeRef.internal: object expected");
                    message.internal = $root.leancode.contracts.TypeRef.Internal.fromObject(object.internal);
                }
                if (object.known != null) {
                    if (typeof object.known !== "object")
                        throw TypeError(".leancode.contracts.TypeRef.known: object expected");
                    message.known = $root.leancode.contracts.TypeRef.Known.fromObject(object.known);
                }
                return message;
            };

            /**
             * Creates a plain object from a TypeRef message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.TypeRef
             * @static
             * @param {leancode.contracts.TypeRef} message TypeRef
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TypeRef.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.nullable = false;
                if (message.nullable != null && message.hasOwnProperty("nullable"))
                    object.nullable = message.nullable;
                if (message.generic != null && message.hasOwnProperty("generic")) {
                    object.generic = $root.leancode.contracts.TypeRef.Generic.toObject(message.generic, options);
                    if (options.oneofs)
                        object.type = "generic";
                }
                if (message.internal != null && message.hasOwnProperty("internal")) {
                    object.internal = $root.leancode.contracts.TypeRef.Internal.toObject(message.internal, options);
                    if (options.oneofs)
                        object.type = "internal";
                }
                if (message.known != null && message.hasOwnProperty("known")) {
                    object.known = $root.leancode.contracts.TypeRef.Known.toObject(message.known, options);
                    if (options.oneofs)
                        object.type = "known";
                }
                return object;
            };

            /**
             * Converts this TypeRef to JSON.
             * @function toJSON
             * @memberof leancode.contracts.TypeRef
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TypeRef.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            TypeRef.Generic = (function() {

                /**
                 * Properties of a Generic.
                 * @memberof leancode.contracts.TypeRef
                 * @interface IGeneric
                 * @property {string|null} [name] Generic name
                 */

                /**
                 * Constructs a new Generic.
                 * @memberof leancode.contracts.TypeRef
                 * @classdesc Represents a Generic.
                 * @implements IGeneric
                 * @constructor
                 * @param {leancode.contracts.TypeRef.IGeneric=} [properties] Properties to set
                 */
                function Generic(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Generic name.
                 * @member {string} name
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @instance
                 */
                Generic.prototype.name = "";

                /**
                 * Decodes a Generic message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.TypeRef.Generic} Generic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Generic.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.TypeRef.Generic();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Generic message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.TypeRef.Generic} Generic
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Generic.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Generic message.
                 * @function verify
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Generic.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    return null;
                };

                /**
                 * Creates a Generic message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.TypeRef.Generic} Generic
                 */
                Generic.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.TypeRef.Generic)
                        return object;
                    var message = new $root.leancode.contracts.TypeRef.Generic();
                    if (object.name != null)
                        message.name = String(object.name);
                    return message;
                };

                /**
                 * Creates a plain object from a Generic message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @static
                 * @param {leancode.contracts.TypeRef.Generic} message Generic
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Generic.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.name = "";
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    return object;
                };

                /**
                 * Converts this Generic to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.TypeRef.Generic
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Generic.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Generic;
            })();

            TypeRef.Internal = (function() {

                /**
                 * Properties of an Internal.
                 * @memberof leancode.contracts.TypeRef
                 * @interface IInternal
                 * @property {string|null} [name] Internal name
                 * @property {Array.<leancode.contracts.ITypeRef>|null} ["arguments"] Internal arguments
                 */

                /**
                 * Constructs a new Internal.
                 * @memberof leancode.contracts.TypeRef
                 * @classdesc Represents an Internal.
                 * @implements IInternal
                 * @constructor
                 * @param {leancode.contracts.TypeRef.IInternal=} [properties] Properties to set
                 */
                function Internal(properties) {
                    this["arguments"] = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Internal name.
                 * @member {string} name
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @instance
                 */
                Internal.prototype.name = "";

                /**
                 * Internal arguments.
                 * @member {Array.<leancode.contracts.ITypeRef>} arguments
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @instance
                 */
                Internal.prototype["arguments"] = $util.emptyArray;

                /**
                 * Decodes an Internal message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.TypeRef.Internal} Internal
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Internal.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.TypeRef.Internal();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            if (!(message["arguments"] && message["arguments"].length))
                                message["arguments"] = [];
                            message["arguments"].push($root.leancode.contracts.TypeRef.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Internal message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.TypeRef.Internal} Internal
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Internal.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Internal message.
                 * @function verify
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Internal.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                        if (!Array.isArray(message["arguments"]))
                            return "arguments: array expected";
                        for (var i = 0; i < message["arguments"].length; ++i) {
                            var error = $root.leancode.contracts.TypeRef.verify(message["arguments"][i]);
                            if (error)
                                return "arguments." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Internal message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.TypeRef.Internal} Internal
                 */
                Internal.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.TypeRef.Internal)
                        return object;
                    var message = new $root.leancode.contracts.TypeRef.Internal();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object["arguments"]) {
                        if (!Array.isArray(object["arguments"]))
                            throw TypeError(".leancode.contracts.TypeRef.Internal.arguments: array expected");
                        message["arguments"] = [];
                        for (var i = 0; i < object["arguments"].length; ++i) {
                            if (typeof object["arguments"][i] !== "object")
                                throw TypeError(".leancode.contracts.TypeRef.Internal.arguments: object expected");
                            message["arguments"][i] = $root.leancode.contracts.TypeRef.fromObject(object["arguments"][i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Internal message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @static
                 * @param {leancode.contracts.TypeRef.Internal} message Internal
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Internal.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object["arguments"] = [];
                    if (options.defaults)
                        object.name = "";
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message["arguments"] && message["arguments"].length) {
                        object["arguments"] = [];
                        for (var j = 0; j < message["arguments"].length; ++j)
                            object["arguments"][j] = $root.leancode.contracts.TypeRef.toObject(message["arguments"][j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Internal to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.TypeRef.Internal
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Internal.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Internal;
            })();

            TypeRef.Known = (function() {

                /**
                 * Properties of a Known.
                 * @memberof leancode.contracts.TypeRef
                 * @interface IKnown
                 * @property {leancode.contracts.KnownType|null} [type] Known type
                 * @property {Array.<leancode.contracts.ITypeRef>|null} ["arguments"] Known arguments
                 */

                /**
                 * Constructs a new Known.
                 * @memberof leancode.contracts.TypeRef
                 * @classdesc Represents a Known.
                 * @implements IKnown
                 * @constructor
                 * @param {leancode.contracts.TypeRef.IKnown=} [properties] Properties to set
                 */
                function Known(properties) {
                    this["arguments"] = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Known type.
                 * @member {leancode.contracts.KnownType} type
                 * @memberof leancode.contracts.TypeRef.Known
                 * @instance
                 */
                Known.prototype.type = 0;

                /**
                 * Known arguments.
                 * @member {Array.<leancode.contracts.ITypeRef>} arguments
                 * @memberof leancode.contracts.TypeRef.Known
                 * @instance
                 */
                Known.prototype["arguments"] = $util.emptyArray;

                /**
                 * Decodes a Known message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.TypeRef.Known
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.TypeRef.Known} Known
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Known.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.TypeRef.Known();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.type = reader.int32();
                            break;
                        case 2:
                            if (!(message["arguments"] && message["arguments"].length))
                                message["arguments"] = [];
                            message["arguments"].push($root.leancode.contracts.TypeRef.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Known message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.TypeRef.Known
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.TypeRef.Known} Known
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Known.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Known message.
                 * @function verify
                 * @memberof leancode.contracts.TypeRef.Known
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Known.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 3:
                        case 4:
                        case 5:
                        case 100:
                        case 101:
                        case 102:
                        case 103:
                        case 104:
                        case 105:
                        case 106:
                        case 107:
                        case 150:
                        case 151:
                        case 152:
                        case 200:
                        case 201:
                        case 202:
                        case 203:
                        case 204:
                        case 205:
                        case 206:
                        case 300:
                        case 301:
                        case 1000:
                        case 1001:
                        case 1002:
                        case 1100:
                        case 1101:
                        case 1102:
                        case 1103:
                            break;
                        }
                    if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                        if (!Array.isArray(message["arguments"]))
                            return "arguments: array expected";
                        for (var i = 0; i < message["arguments"].length; ++i) {
                            var error = $root.leancode.contracts.TypeRef.verify(message["arguments"][i]);
                            if (error)
                                return "arguments." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Known message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.TypeRef.Known
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.TypeRef.Known} Known
                 */
                Known.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.TypeRef.Known)
                        return object;
                    var message = new $root.leancode.contracts.TypeRef.Known();
                    switch (object.type) {
                    case "Object":
                    case 0:
                        message.type = 0;
                        break;
                    case "String":
                    case 1:
                        message.type = 1;
                        break;
                    case "Guid":
                    case 3:
                        message.type = 3;
                        break;
                    case "Uri":
                    case 4:
                        message.type = 4;
                        break;
                    case "Boolean":
                    case 5:
                        message.type = 5;
                        break;
                    case "UInt8":
                    case 100:
                        message.type = 100;
                        break;
                    case "Int8":
                    case 101:
                        message.type = 101;
                        break;
                    case "Int16":
                    case 102:
                        message.type = 102;
                        break;
                    case "UInt16":
                    case 103:
                        message.type = 103;
                        break;
                    case "Int32":
                    case 104:
                        message.type = 104;
                        break;
                    case "UInt32":
                    case 105:
                        message.type = 105;
                        break;
                    case "Int64":
                    case 106:
                        message.type = 106;
                        break;
                    case "UInt64":
                    case 107:
                        message.type = 107;
                        break;
                    case "Float":
                    case 150:
                        message.type = 150;
                        break;
                    case "Double":
                    case 151:
                        message.type = 151;
                        break;
                    case "Decimal":
                    case 152:
                        message.type = 152;
                        break;
                    case "DateOnly":
                    case 200:
                        message.type = 200;
                        break;
                    case "TimeOnly":
                    case 201:
                        message.type = 201;
                        break;
                    case "DateTime":
                    case 202:
                        message.type = 202;
                        break;
                    case "DateTimeOffset":
                    case 203:
                        message.type = 203;
                        break;
                    case "TimeSpan":
                    case 204:
                        message.type = 204;
                        break;
                    case "Date":
                    case 205:
                        message.type = 205;
                        break;
                    case "Time":
                    case 206:
                        message.type = 206;
                        break;
                    case "Array":
                    case 300:
                        message.type = 300;
                        break;
                    case "Map":
                    case 301:
                        message.type = 301;
                        break;
                    case "Query":
                    case 1000:
                        message.type = 1000;
                        break;
                    case "Command":
                    case 1001:
                        message.type = 1001;
                        break;
                    case "CommandResult":
                    case 1002:
                        message.type = 1002;
                        break;
                    case "Attribute":
                    case 1100:
                        message.type = 1100;
                        break;
                    case "AuthorizeWhenAttribute":
                    case 1101:
                        message.type = 1101;
                        break;
                    case "AuthorizeWhenHasAnyOfAttribute":
                    case 1102:
                        message.type = 1102;
                        break;
                    case "QueryCacheAttribute":
                    case 1103:
                        message.type = 1103;
                        break;
                    }
                    if (object["arguments"]) {
                        if (!Array.isArray(object["arguments"]))
                            throw TypeError(".leancode.contracts.TypeRef.Known.arguments: array expected");
                        message["arguments"] = [];
                        for (var i = 0; i < object["arguments"].length; ++i) {
                            if (typeof object["arguments"][i] !== "object")
                                throw TypeError(".leancode.contracts.TypeRef.Known.arguments: object expected");
                            message["arguments"][i] = $root.leancode.contracts.TypeRef.fromObject(object["arguments"][i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Known message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.TypeRef.Known
                 * @static
                 * @param {leancode.contracts.TypeRef.Known} message Known
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Known.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object["arguments"] = [];
                    if (options.defaults)
                        object.type = options.enums === String ? "Object" : 0;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.leancode.contracts.KnownType[message.type] : message.type;
                    if (message["arguments"] && message["arguments"].length) {
                        object["arguments"] = [];
                        for (var j = 0; j < message["arguments"].length; ++j)
                            object["arguments"][j] = $root.leancode.contracts.TypeRef.toObject(message["arguments"][j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Known to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.TypeRef.Known
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Known.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Known;
            })();

            return TypeRef;
        })();

        contracts.GenericParameter = (function() {

            /**
             * Properties of a GenericParameter.
             * @memberof leancode.contracts
             * @interface IGenericParameter
             * @property {string|null} [name] GenericParameter name
             */

            /**
             * Constructs a new GenericParameter.
             * @memberof leancode.contracts
             * @classdesc Represents a GenericParameter.
             * @implements IGenericParameter
             * @constructor
             * @param {leancode.contracts.IGenericParameter=} [properties] Properties to set
             */
            function GenericParameter(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GenericParameter name.
             * @member {string} name
             * @memberof leancode.contracts.GenericParameter
             * @instance
             */
            GenericParameter.prototype.name = "";

            /**
             * Decodes a GenericParameter message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.GenericParameter
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.GenericParameter} GenericParameter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GenericParameter.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.GenericParameter();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GenericParameter message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.GenericParameter
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.GenericParameter} GenericParameter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GenericParameter.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GenericParameter message.
             * @function verify
             * @memberof leancode.contracts.GenericParameter
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GenericParameter.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a GenericParameter message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.GenericParameter
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.GenericParameter} GenericParameter
             */
            GenericParameter.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.GenericParameter)
                    return object;
                var message = new $root.leancode.contracts.GenericParameter();
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a GenericParameter message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.GenericParameter
             * @static
             * @param {leancode.contracts.GenericParameter} message GenericParameter
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GenericParameter.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.name = "";
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this GenericParameter to JSON.
             * @function toJSON
             * @memberof leancode.contracts.GenericParameter
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GenericParameter.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GenericParameter;
        })();

        contracts.AttributeArgument = (function() {

            /**
             * Properties of an AttributeArgument.
             * @memberof leancode.contracts
             * @interface IAttributeArgument
             * @property {leancode.contracts.AttributeArgument.IPositional|null} [positional] AttributeArgument positional
             * @property {leancode.contracts.AttributeArgument.INamed|null} [named] AttributeArgument named
             */

            /**
             * Constructs a new AttributeArgument.
             * @memberof leancode.contracts
             * @classdesc Represents an AttributeArgument.
             * @implements IAttributeArgument
             * @constructor
             * @param {leancode.contracts.IAttributeArgument=} [properties] Properties to set
             */
            function AttributeArgument(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AttributeArgument positional.
             * @member {leancode.contracts.AttributeArgument.IPositional|null|undefined} positional
             * @memberof leancode.contracts.AttributeArgument
             * @instance
             */
            AttributeArgument.prototype.positional = null;

            /**
             * AttributeArgument named.
             * @member {leancode.contracts.AttributeArgument.INamed|null|undefined} named
             * @memberof leancode.contracts.AttributeArgument
             * @instance
             */
            AttributeArgument.prototype.named = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * AttributeArgument attribute.
             * @member {"positional"|"named"|undefined} attribute
             * @memberof leancode.contracts.AttributeArgument
             * @instance
             */
            Object.defineProperty(AttributeArgument.prototype, "attribute", {
                get: $util.oneOfGetter($oneOfFields = ["positional", "named"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Decodes an AttributeArgument message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.AttributeArgument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.AttributeArgument} AttributeArgument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttributeArgument.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.AttributeArgument();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.positional = $root.leancode.contracts.AttributeArgument.Positional.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.named = $root.leancode.contracts.AttributeArgument.Named.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AttributeArgument message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.AttributeArgument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.AttributeArgument} AttributeArgument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttributeArgument.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AttributeArgument message.
             * @function verify
             * @memberof leancode.contracts.AttributeArgument
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AttributeArgument.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.positional != null && message.hasOwnProperty("positional")) {
                    properties.attribute = 1;
                    {
                        var error = $root.leancode.contracts.AttributeArgument.Positional.verify(message.positional);
                        if (error)
                            return "positional." + error;
                    }
                }
                if (message.named != null && message.hasOwnProperty("named")) {
                    if (properties.attribute === 1)
                        return "attribute: multiple values";
                    properties.attribute = 1;
                    {
                        var error = $root.leancode.contracts.AttributeArgument.Named.verify(message.named);
                        if (error)
                            return "named." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an AttributeArgument message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.AttributeArgument
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.AttributeArgument} AttributeArgument
             */
            AttributeArgument.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.AttributeArgument)
                    return object;
                var message = new $root.leancode.contracts.AttributeArgument();
                if (object.positional != null) {
                    if (typeof object.positional !== "object")
                        throw TypeError(".leancode.contracts.AttributeArgument.positional: object expected");
                    message.positional = $root.leancode.contracts.AttributeArgument.Positional.fromObject(object.positional);
                }
                if (object.named != null) {
                    if (typeof object.named !== "object")
                        throw TypeError(".leancode.contracts.AttributeArgument.named: object expected");
                    message.named = $root.leancode.contracts.AttributeArgument.Named.fromObject(object.named);
                }
                return message;
            };

            /**
             * Creates a plain object from an AttributeArgument message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.AttributeArgument
             * @static
             * @param {leancode.contracts.AttributeArgument} message AttributeArgument
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AttributeArgument.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.positional != null && message.hasOwnProperty("positional")) {
                    object.positional = $root.leancode.contracts.AttributeArgument.Positional.toObject(message.positional, options);
                    if (options.oneofs)
                        object.attribute = "positional";
                }
                if (message.named != null && message.hasOwnProperty("named")) {
                    object.named = $root.leancode.contracts.AttributeArgument.Named.toObject(message.named, options);
                    if (options.oneofs)
                        object.attribute = "named";
                }
                return object;
            };

            /**
             * Converts this AttributeArgument to JSON.
             * @function toJSON
             * @memberof leancode.contracts.AttributeArgument
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AttributeArgument.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            AttributeArgument.Positional = (function() {

                /**
                 * Properties of a Positional.
                 * @memberof leancode.contracts.AttributeArgument
                 * @interface IPositional
                 * @property {number|null} [position] Positional position
                 * @property {leancode.contracts.IValueRef|null} [value] Positional value
                 */

                /**
                 * Constructs a new Positional.
                 * @memberof leancode.contracts.AttributeArgument
                 * @classdesc Represents a Positional.
                 * @implements IPositional
                 * @constructor
                 * @param {leancode.contracts.AttributeArgument.IPositional=} [properties] Properties to set
                 */
                function Positional(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Positional position.
                 * @member {number} position
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @instance
                 */
                Positional.prototype.position = 0;

                /**
                 * Positional value.
                 * @member {leancode.contracts.IValueRef|null|undefined} value
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @instance
                 */
                Positional.prototype.value = null;

                /**
                 * Decodes a Positional message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.AttributeArgument.Positional} Positional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Positional.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.AttributeArgument.Positional();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.position = reader.int32();
                            break;
                        case 2:
                            message.value = $root.leancode.contracts.ValueRef.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Positional message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.AttributeArgument.Positional} Positional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Positional.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Positional message.
                 * @function verify
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Positional.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.position != null && message.hasOwnProperty("position"))
                        if (!$util.isInteger(message.position))
                            return "position: integer expected";
                    if (message.value != null && message.hasOwnProperty("value")) {
                        var error = $root.leancode.contracts.ValueRef.verify(message.value);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Positional message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.AttributeArgument.Positional} Positional
                 */
                Positional.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.AttributeArgument.Positional)
                        return object;
                    var message = new $root.leancode.contracts.AttributeArgument.Positional();
                    if (object.position != null)
                        message.position = object.position | 0;
                    if (object.value != null) {
                        if (typeof object.value !== "object")
                            throw TypeError(".leancode.contracts.AttributeArgument.Positional.value: object expected");
                        message.value = $root.leancode.contracts.ValueRef.fromObject(object.value);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Positional message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @static
                 * @param {leancode.contracts.AttributeArgument.Positional} message Positional
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Positional.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.position = 0;
                        object.value = null;
                    }
                    if (message.position != null && message.hasOwnProperty("position"))
                        object.position = message.position;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = $root.leancode.contracts.ValueRef.toObject(message.value, options);
                    return object;
                };

                /**
                 * Converts this Positional to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.AttributeArgument.Positional
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Positional.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Positional;
            })();

            AttributeArgument.Named = (function() {

                /**
                 * Properties of a Named.
                 * @memberof leancode.contracts.AttributeArgument
                 * @interface INamed
                 * @property {string|null} [name] Named name
                 * @property {leancode.contracts.IValueRef|null} [value] Named value
                 */

                /**
                 * Constructs a new Named.
                 * @memberof leancode.contracts.AttributeArgument
                 * @classdesc Represents a Named.
                 * @implements INamed
                 * @constructor
                 * @param {leancode.contracts.AttributeArgument.INamed=} [properties] Properties to set
                 */
                function Named(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Named name.
                 * @member {string} name
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @instance
                 */
                Named.prototype.name = "";

                /**
                 * Named value.
                 * @member {leancode.contracts.IValueRef|null|undefined} value
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @instance
                 */
                Named.prototype.value = null;

                /**
                 * Decodes a Named message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.AttributeArgument.Named} Named
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Named.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.AttributeArgument.Named();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.value = $root.leancode.contracts.ValueRef.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Named message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.AttributeArgument.Named} Named
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Named.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Named message.
                 * @function verify
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Named.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.value != null && message.hasOwnProperty("value")) {
                        var error = $root.leancode.contracts.ValueRef.verify(message.value);
                        if (error)
                            return "value." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Named message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.AttributeArgument.Named} Named
                 */
                Named.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.AttributeArgument.Named)
                        return object;
                    var message = new $root.leancode.contracts.AttributeArgument.Named();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.value != null) {
                        if (typeof object.value !== "object")
                            throw TypeError(".leancode.contracts.AttributeArgument.Named.value: object expected");
                        message.value = $root.leancode.contracts.ValueRef.fromObject(object.value);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Named message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @static
                 * @param {leancode.contracts.AttributeArgument.Named} message Named
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Named.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.value = null;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = $root.leancode.contracts.ValueRef.toObject(message.value, options);
                    return object;
                };

                /**
                 * Converts this Named to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.AttributeArgument.Named
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Named.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Named;
            })();

            return AttributeArgument;
        })();

        contracts.AttributeRef = (function() {

            /**
             * Properties of an AttributeRef.
             * @memberof leancode.contracts
             * @interface IAttributeRef
             * @property {string|null} [attributeName] AttributeRef attributeName
             * @property {Array.<leancode.contracts.IAttributeArgument>|null} [argument] AttributeRef argument
             */

            /**
             * Constructs a new AttributeRef.
             * @memberof leancode.contracts
             * @classdesc Represents an AttributeRef.
             * @implements IAttributeRef
             * @constructor
             * @param {leancode.contracts.IAttributeRef=} [properties] Properties to set
             */
            function AttributeRef(properties) {
                this.argument = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AttributeRef attributeName.
             * @member {string} attributeName
             * @memberof leancode.contracts.AttributeRef
             * @instance
             */
            AttributeRef.prototype.attributeName = "";

            /**
             * AttributeRef argument.
             * @member {Array.<leancode.contracts.IAttributeArgument>} argument
             * @memberof leancode.contracts.AttributeRef
             * @instance
             */
            AttributeRef.prototype.argument = $util.emptyArray;

            /**
             * Decodes an AttributeRef message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.AttributeRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.AttributeRef} AttributeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttributeRef.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.AttributeRef();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.attributeName = reader.string();
                        break;
                    case 2:
                        if (!(message.argument && message.argument.length))
                            message.argument = [];
                        message.argument.push($root.leancode.contracts.AttributeArgument.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AttributeRef message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.AttributeRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.AttributeRef} AttributeRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttributeRef.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AttributeRef message.
             * @function verify
             * @memberof leancode.contracts.AttributeRef
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AttributeRef.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.attributeName != null && message.hasOwnProperty("attributeName"))
                    if (!$util.isString(message.attributeName))
                        return "attributeName: string expected";
                if (message.argument != null && message.hasOwnProperty("argument")) {
                    if (!Array.isArray(message.argument))
                        return "argument: array expected";
                    for (var i = 0; i < message.argument.length; ++i) {
                        var error = $root.leancode.contracts.AttributeArgument.verify(message.argument[i]);
                        if (error)
                            return "argument." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an AttributeRef message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.AttributeRef
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.AttributeRef} AttributeRef
             */
            AttributeRef.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.AttributeRef)
                    return object;
                var message = new $root.leancode.contracts.AttributeRef();
                if (object.attributeName != null)
                    message.attributeName = String(object.attributeName);
                if (object.argument) {
                    if (!Array.isArray(object.argument))
                        throw TypeError(".leancode.contracts.AttributeRef.argument: array expected");
                    message.argument = [];
                    for (var i = 0; i < object.argument.length; ++i) {
                        if (typeof object.argument[i] !== "object")
                            throw TypeError(".leancode.contracts.AttributeRef.argument: object expected");
                        message.argument[i] = $root.leancode.contracts.AttributeArgument.fromObject(object.argument[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an AttributeRef message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.AttributeRef
             * @static
             * @param {leancode.contracts.AttributeRef} message AttributeRef
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AttributeRef.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.argument = [];
                if (options.defaults)
                    object.attributeName = "";
                if (message.attributeName != null && message.hasOwnProperty("attributeName"))
                    object.attributeName = message.attributeName;
                if (message.argument && message.argument.length) {
                    object.argument = [];
                    for (var j = 0; j < message.argument.length; ++j)
                        object.argument[j] = $root.leancode.contracts.AttributeArgument.toObject(message.argument[j], options);
                }
                return object;
            };

            /**
             * Converts this AttributeRef to JSON.
             * @function toJSON
             * @memberof leancode.contracts.AttributeRef
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AttributeRef.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return AttributeRef;
        })();

        contracts.PropertyRef = (function() {

            /**
             * Properties of a PropertyRef.
             * @memberof leancode.contracts
             * @interface IPropertyRef
             * @property {leancode.contracts.ITypeRef|null} [type] PropertyRef type
             * @property {string|null} [name] PropertyRef name
             * @property {Array.<leancode.contracts.IAttributeRef>|null} [attributes] PropertyRef attributes
             * @property {string|null} [comment] PropertyRef comment
             */

            /**
             * Constructs a new PropertyRef.
             * @memberof leancode.contracts
             * @classdesc Represents a PropertyRef.
             * @implements IPropertyRef
             * @constructor
             * @param {leancode.contracts.IPropertyRef=} [properties] Properties to set
             */
            function PropertyRef(properties) {
                this.attributes = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PropertyRef type.
             * @member {leancode.contracts.ITypeRef|null|undefined} type
             * @memberof leancode.contracts.PropertyRef
             * @instance
             */
            PropertyRef.prototype.type = null;

            /**
             * PropertyRef name.
             * @member {string} name
             * @memberof leancode.contracts.PropertyRef
             * @instance
             */
            PropertyRef.prototype.name = "";

            /**
             * PropertyRef attributes.
             * @member {Array.<leancode.contracts.IAttributeRef>} attributes
             * @memberof leancode.contracts.PropertyRef
             * @instance
             */
            PropertyRef.prototype.attributes = $util.emptyArray;

            /**
             * PropertyRef comment.
             * @member {string} comment
             * @memberof leancode.contracts.PropertyRef
             * @instance
             */
            PropertyRef.prototype.comment = "";

            /**
             * Decodes a PropertyRef message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.PropertyRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.PropertyRef} PropertyRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PropertyRef.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.PropertyRef();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = $root.leancode.contracts.TypeRef.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        if (!(message.attributes && message.attributes.length))
                            message.attributes = [];
                        message.attributes.push($root.leancode.contracts.AttributeRef.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        message.comment = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PropertyRef message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.PropertyRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.PropertyRef} PropertyRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PropertyRef.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PropertyRef message.
             * @function verify
             * @memberof leancode.contracts.PropertyRef
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PropertyRef.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type")) {
                    var error = $root.leancode.contracts.TypeRef.verify(message.type);
                    if (error)
                        return "type." + error;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.attributes != null && message.hasOwnProperty("attributes")) {
                    if (!Array.isArray(message.attributes))
                        return "attributes: array expected";
                    for (var i = 0; i < message.attributes.length; ++i) {
                        var error = $root.leancode.contracts.AttributeRef.verify(message.attributes[i]);
                        if (error)
                            return "attributes." + error;
                    }
                }
                if (message.comment != null && message.hasOwnProperty("comment"))
                    if (!$util.isString(message.comment))
                        return "comment: string expected";
                return null;
            };

            /**
             * Creates a PropertyRef message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.PropertyRef
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.PropertyRef} PropertyRef
             */
            PropertyRef.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.PropertyRef)
                    return object;
                var message = new $root.leancode.contracts.PropertyRef();
                if (object.type != null) {
                    if (typeof object.type !== "object")
                        throw TypeError(".leancode.contracts.PropertyRef.type: object expected");
                    message.type = $root.leancode.contracts.TypeRef.fromObject(object.type);
                }
                if (object.name != null)
                    message.name = String(object.name);
                if (object.attributes) {
                    if (!Array.isArray(object.attributes))
                        throw TypeError(".leancode.contracts.PropertyRef.attributes: array expected");
                    message.attributes = [];
                    for (var i = 0; i < object.attributes.length; ++i) {
                        if (typeof object.attributes[i] !== "object")
                            throw TypeError(".leancode.contracts.PropertyRef.attributes: object expected");
                        message.attributes[i] = $root.leancode.contracts.AttributeRef.fromObject(object.attributes[i]);
                    }
                }
                if (object.comment != null)
                    message.comment = String(object.comment);
                return message;
            };

            /**
             * Creates a plain object from a PropertyRef message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.PropertyRef
             * @static
             * @param {leancode.contracts.PropertyRef} message PropertyRef
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PropertyRef.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.attributes = [];
                if (options.defaults) {
                    object.type = null;
                    object.name = "";
                    object.comment = "";
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = $root.leancode.contracts.TypeRef.toObject(message.type, options);
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.attributes && message.attributes.length) {
                    object.attributes = [];
                    for (var j = 0; j < message.attributes.length; ++j)
                        object.attributes[j] = $root.leancode.contracts.AttributeRef.toObject(message.attributes[j], options);
                }
                if (message.comment != null && message.hasOwnProperty("comment"))
                    object.comment = message.comment;
                return object;
            };

            /**
             * Converts this PropertyRef to JSON.
             * @function toJSON
             * @memberof leancode.contracts.PropertyRef
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PropertyRef.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return PropertyRef;
        })();

        contracts.ConstantRef = (function() {

            /**
             * Properties of a ConstantRef.
             * @memberof leancode.contracts
             * @interface IConstantRef
             * @property {string|null} [name] ConstantRef name
             * @property {leancode.contracts.IValueRef|null} [value] ConstantRef value
             * @property {string|null} [comment] ConstantRef comment
             */

            /**
             * Constructs a new ConstantRef.
             * @memberof leancode.contracts
             * @classdesc Represents a ConstantRef.
             * @implements IConstantRef
             * @constructor
             * @param {leancode.contracts.IConstantRef=} [properties] Properties to set
             */
            function ConstantRef(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ConstantRef name.
             * @member {string} name
             * @memberof leancode.contracts.ConstantRef
             * @instance
             */
            ConstantRef.prototype.name = "";

            /**
             * ConstantRef value.
             * @member {leancode.contracts.IValueRef|null|undefined} value
             * @memberof leancode.contracts.ConstantRef
             * @instance
             */
            ConstantRef.prototype.value = null;

            /**
             * ConstantRef comment.
             * @member {string} comment
             * @memberof leancode.contracts.ConstantRef
             * @instance
             */
            ConstantRef.prototype.comment = "";

            /**
             * Decodes a ConstantRef message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.ConstantRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.ConstantRef} ConstantRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConstantRef.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ConstantRef();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.value = $root.leancode.contracts.ValueRef.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.comment = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ConstantRef message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.ConstantRef
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.ConstantRef} ConstantRef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConstantRef.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ConstantRef message.
             * @function verify
             * @memberof leancode.contracts.ConstantRef
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConstantRef.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.value != null && message.hasOwnProperty("value")) {
                    var error = $root.leancode.contracts.ValueRef.verify(message.value);
                    if (error)
                        return "value." + error;
                }
                if (message.comment != null && message.hasOwnProperty("comment"))
                    if (!$util.isString(message.comment))
                        return "comment: string expected";
                return null;
            };

            /**
             * Creates a ConstantRef message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.ConstantRef
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.ConstantRef} ConstantRef
             */
            ConstantRef.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.ConstantRef)
                    return object;
                var message = new $root.leancode.contracts.ConstantRef();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.value != null) {
                    if (typeof object.value !== "object")
                        throw TypeError(".leancode.contracts.ConstantRef.value: object expected");
                    message.value = $root.leancode.contracts.ValueRef.fromObject(object.value);
                }
                if (object.comment != null)
                    message.comment = String(object.comment);
                return message;
            };

            /**
             * Creates a plain object from a ConstantRef message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.ConstantRef
             * @static
             * @param {leancode.contracts.ConstantRef} message ConstantRef
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConstantRef.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.value = null;
                    object.comment = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = $root.leancode.contracts.ValueRef.toObject(message.value, options);
                if (message.comment != null && message.hasOwnProperty("comment"))
                    object.comment = message.comment;
                return object;
            };

            /**
             * Converts this ConstantRef to JSON.
             * @function toJSON
             * @memberof leancode.contracts.ConstantRef
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConstantRef.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ConstantRef;
        })();

        contracts.EnumValue = (function() {

            /**
             * Properties of an EnumValue.
             * @memberof leancode.contracts
             * @interface IEnumValue
             * @property {string|null} [name] EnumValue name
             * @property {number|Long|null} [value] EnumValue value
             * @property {string|null} [comment] EnumValue comment
             */

            /**
             * Constructs a new EnumValue.
             * @memberof leancode.contracts
             * @classdesc Represents an EnumValue.
             * @implements IEnumValue
             * @constructor
             * @param {leancode.contracts.IEnumValue=} [properties] Properties to set
             */
            function EnumValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * EnumValue name.
             * @member {string} name
             * @memberof leancode.contracts.EnumValue
             * @instance
             */
            EnumValue.prototype.name = "";

            /**
             * EnumValue value.
             * @member {number|Long} value
             * @memberof leancode.contracts.EnumValue
             * @instance
             */
            EnumValue.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * EnumValue comment.
             * @member {string} comment
             * @memberof leancode.contracts.EnumValue
             * @instance
             */
            EnumValue.prototype.comment = "";

            /**
             * Decodes an EnumValue message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.EnumValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.EnumValue} EnumValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnumValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.EnumValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.value = reader.int64();
                        break;
                    case 3:
                        message.comment = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an EnumValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.EnumValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.EnumValue} EnumValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EnumValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an EnumValue message.
             * @function verify
             * @memberof leancode.contracts.EnumValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EnumValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                if (message.comment != null && message.hasOwnProperty("comment"))
                    if (!$util.isString(message.comment))
                        return "comment: string expected";
                return null;
            };

            /**
             * Creates an EnumValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.EnumValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.EnumValue} EnumValue
             */
            EnumValue.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.EnumValue)
                    return object;
                var message = new $root.leancode.contracts.EnumValue();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                if (object.comment != null)
                    message.comment = String(object.comment);
                return message;
            };

            /**
             * Creates a plain object from an EnumValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.EnumValue
             * @static
             * @param {leancode.contracts.EnumValue} message EnumValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EnumValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                    object.comment = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                if (message.comment != null && message.hasOwnProperty("comment"))
                    object.comment = message.comment;
                return object;
            };

            /**
             * Converts this EnumValue to JSON.
             * @function toJSON
             * @memberof leancode.contracts.EnumValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EnumValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return EnumValue;
        })();

        contracts.ErrorCode = (function() {

            /**
             * Properties of an ErrorCode.
             * @memberof leancode.contracts
             * @interface IErrorCode
             * @property {leancode.contracts.ErrorCode.ISingle|null} [single] ErrorCode single
             * @property {leancode.contracts.ErrorCode.IGroup|null} [group] ErrorCode group
             */

            /**
             * Constructs a new ErrorCode.
             * @memberof leancode.contracts
             * @classdesc Represents an ErrorCode.
             * @implements IErrorCode
             * @constructor
             * @param {leancode.contracts.IErrorCode=} [properties] Properties to set
             */
            function ErrorCode(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ErrorCode single.
             * @member {leancode.contracts.ErrorCode.ISingle|null|undefined} single
             * @memberof leancode.contracts.ErrorCode
             * @instance
             */
            ErrorCode.prototype.single = null;

            /**
             * ErrorCode group.
             * @member {leancode.contracts.ErrorCode.IGroup|null|undefined} group
             * @memberof leancode.contracts.ErrorCode
             * @instance
             */
            ErrorCode.prototype.group = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ErrorCode code.
             * @member {"single"|"group"|undefined} code
             * @memberof leancode.contracts.ErrorCode
             * @instance
             */
            Object.defineProperty(ErrorCode.prototype, "code", {
                get: $util.oneOfGetter($oneOfFields = ["single", "group"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Decodes an ErrorCode message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.ErrorCode
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.ErrorCode} ErrorCode
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorCode.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ErrorCode();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.single = $root.leancode.contracts.ErrorCode.Single.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.group = $root.leancode.contracts.ErrorCode.Group.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an ErrorCode message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.ErrorCode
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.ErrorCode} ErrorCode
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorCode.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ErrorCode message.
             * @function verify
             * @memberof leancode.contracts.ErrorCode
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ErrorCode.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.single != null && message.hasOwnProperty("single")) {
                    properties.code = 1;
                    {
                        var error = $root.leancode.contracts.ErrorCode.Single.verify(message.single);
                        if (error)
                            return "single." + error;
                    }
                }
                if (message.group != null && message.hasOwnProperty("group")) {
                    if (properties.code === 1)
                        return "code: multiple values";
                    properties.code = 1;
                    {
                        var error = $root.leancode.contracts.ErrorCode.Group.verify(message.group);
                        if (error)
                            return "group." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an ErrorCode message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.ErrorCode
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.ErrorCode} ErrorCode
             */
            ErrorCode.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.ErrorCode)
                    return object;
                var message = new $root.leancode.contracts.ErrorCode();
                if (object.single != null) {
                    if (typeof object.single !== "object")
                        throw TypeError(".leancode.contracts.ErrorCode.single: object expected");
                    message.single = $root.leancode.contracts.ErrorCode.Single.fromObject(object.single);
                }
                if (object.group != null) {
                    if (typeof object.group !== "object")
                        throw TypeError(".leancode.contracts.ErrorCode.group: object expected");
                    message.group = $root.leancode.contracts.ErrorCode.Group.fromObject(object.group);
                }
                return message;
            };

            /**
             * Creates a plain object from an ErrorCode message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.ErrorCode
             * @static
             * @param {leancode.contracts.ErrorCode} message ErrorCode
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ErrorCode.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.single != null && message.hasOwnProperty("single")) {
                    object.single = $root.leancode.contracts.ErrorCode.Single.toObject(message.single, options);
                    if (options.oneofs)
                        object.code = "single";
                }
                if (message.group != null && message.hasOwnProperty("group")) {
                    object.group = $root.leancode.contracts.ErrorCode.Group.toObject(message.group, options);
                    if (options.oneofs)
                        object.code = "group";
                }
                return object;
            };

            /**
             * Converts this ErrorCode to JSON.
             * @function toJSON
             * @memberof leancode.contracts.ErrorCode
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ErrorCode.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ErrorCode.Single = (function() {

                /**
                 * Properties of a Single.
                 * @memberof leancode.contracts.ErrorCode
                 * @interface ISingle
                 * @property {string|null} [name] Single name
                 * @property {number|null} [code] Single code
                 */

                /**
                 * Constructs a new Single.
                 * @memberof leancode.contracts.ErrorCode
                 * @classdesc Represents a Single.
                 * @implements ISingle
                 * @constructor
                 * @param {leancode.contracts.ErrorCode.ISingle=} [properties] Properties to set
                 */
                function Single(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Single name.
                 * @member {string} name
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @instance
                 */
                Single.prototype.name = "";

                /**
                 * Single code.
                 * @member {number} code
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @instance
                 */
                Single.prototype.code = 0;

                /**
                 * Decodes a Single message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ErrorCode.Single} Single
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Single.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ErrorCode.Single();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.code = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Single message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ErrorCode.Single} Single
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Single.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Single message.
                 * @function verify
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Single.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.code != null && message.hasOwnProperty("code"))
                        if (!$util.isInteger(message.code))
                            return "code: integer expected";
                    return null;
                };

                /**
                 * Creates a Single message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ErrorCode.Single} Single
                 */
                Single.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ErrorCode.Single)
                        return object;
                    var message = new $root.leancode.contracts.ErrorCode.Single();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.code != null)
                        message.code = object.code | 0;
                    return message;
                };

                /**
                 * Creates a plain object from a Single message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @static
                 * @param {leancode.contracts.ErrorCode.Single} message Single
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Single.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.code = 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.code != null && message.hasOwnProperty("code"))
                        object.code = message.code;
                    return object;
                };

                /**
                 * Converts this Single to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ErrorCode.Single
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Single.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Single;
            })();

            ErrorCode.Group = (function() {

                /**
                 * Properties of a Group.
                 * @memberof leancode.contracts.ErrorCode
                 * @interface IGroup
                 * @property {string|null} [name] Group name
                 * @property {string|null} [groupId] Group groupId
                 * @property {Array.<leancode.contracts.IErrorCode>|null} [innerCodes] Group innerCodes
                 */

                /**
                 * Constructs a new Group.
                 * @memberof leancode.contracts.ErrorCode
                 * @classdesc Represents a Group.
                 * @implements IGroup
                 * @constructor
                 * @param {leancode.contracts.ErrorCode.IGroup=} [properties] Properties to set
                 */
                function Group(properties) {
                    this.innerCodes = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Group name.
                 * @member {string} name
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @instance
                 */
                Group.prototype.name = "";

                /**
                 * Group groupId.
                 * @member {string} groupId
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @instance
                 */
                Group.prototype.groupId = "";

                /**
                 * Group innerCodes.
                 * @member {Array.<leancode.contracts.IErrorCode>} innerCodes
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @instance
                 */
                Group.prototype.innerCodes = $util.emptyArray;

                /**
                 * Decodes a Group message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.ErrorCode.Group} Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Group.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.ErrorCode.Group();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.groupId = reader.string();
                            break;
                        case 3:
                            if (!(message.innerCodes && message.innerCodes.length))
                                message.innerCodes = [];
                            message.innerCodes.push($root.leancode.contracts.ErrorCode.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Group message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.ErrorCode.Group} Group
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Group.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Group message.
                 * @function verify
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Group.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.groupId != null && message.hasOwnProperty("groupId"))
                        if (!$util.isString(message.groupId))
                            return "groupId: string expected";
                    if (message.innerCodes != null && message.hasOwnProperty("innerCodes")) {
                        if (!Array.isArray(message.innerCodes))
                            return "innerCodes: array expected";
                        for (var i = 0; i < message.innerCodes.length; ++i) {
                            var error = $root.leancode.contracts.ErrorCode.verify(message.innerCodes[i]);
                            if (error)
                                return "innerCodes." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Group message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.ErrorCode.Group} Group
                 */
                Group.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.ErrorCode.Group)
                        return object;
                    var message = new $root.leancode.contracts.ErrorCode.Group();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.groupId != null)
                        message.groupId = String(object.groupId);
                    if (object.innerCodes) {
                        if (!Array.isArray(object.innerCodes))
                            throw TypeError(".leancode.contracts.ErrorCode.Group.innerCodes: array expected");
                        message.innerCodes = [];
                        for (var i = 0; i < object.innerCodes.length; ++i) {
                            if (typeof object.innerCodes[i] !== "object")
                                throw TypeError(".leancode.contracts.ErrorCode.Group.innerCodes: object expected");
                            message.innerCodes[i] = $root.leancode.contracts.ErrorCode.fromObject(object.innerCodes[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Group message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @static
                 * @param {leancode.contracts.ErrorCode.Group} message Group
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Group.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.innerCodes = [];
                    if (options.defaults) {
                        object.name = "";
                        object.groupId = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.groupId != null && message.hasOwnProperty("groupId"))
                        object.groupId = message.groupId;
                    if (message.innerCodes && message.innerCodes.length) {
                        object.innerCodes = [];
                        for (var j = 0; j < message.innerCodes.length; ++j)
                            object.innerCodes[j] = $root.leancode.contracts.ErrorCode.toObject(message.innerCodes[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Group to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.ErrorCode.Group
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Group.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Group;
            })();

            return ErrorCode;
        })();

        contracts.TypeDescriptor = (function() {

            /**
             * Properties of a TypeDescriptor.
             * @memberof leancode.contracts
             * @interface ITypeDescriptor
             * @property {Array.<leancode.contracts.ITypeRef>|null} ["extends"] TypeDescriptor extends
             * @property {Array.<leancode.contracts.IGenericParameter>|null} [genericParameters] TypeDescriptor genericParameters
             * @property {Array.<leancode.contracts.IPropertyRef>|null} [properties] TypeDescriptor properties
             * @property {Array.<leancode.contracts.IConstantRef>|null} [constants] TypeDescriptor constants
             */

            /**
             * Constructs a new TypeDescriptor.
             * @memberof leancode.contracts
             * @classdesc Represents a TypeDescriptor.
             * @implements ITypeDescriptor
             * @constructor
             * @param {leancode.contracts.ITypeDescriptor=} [properties] Properties to set
             */
            function TypeDescriptor(properties) {
                this["extends"] = [];
                this.genericParameters = [];
                this.properties = [];
                this.constants = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TypeDescriptor extends.
             * @member {Array.<leancode.contracts.ITypeRef>} extends
             * @memberof leancode.contracts.TypeDescriptor
             * @instance
             */
            TypeDescriptor.prototype["extends"] = $util.emptyArray;

            /**
             * TypeDescriptor genericParameters.
             * @member {Array.<leancode.contracts.IGenericParameter>} genericParameters
             * @memberof leancode.contracts.TypeDescriptor
             * @instance
             */
            TypeDescriptor.prototype.genericParameters = $util.emptyArray;

            /**
             * TypeDescriptor properties.
             * @member {Array.<leancode.contracts.IPropertyRef>} properties
             * @memberof leancode.contracts.TypeDescriptor
             * @instance
             */
            TypeDescriptor.prototype.properties = $util.emptyArray;

            /**
             * TypeDescriptor constants.
             * @member {Array.<leancode.contracts.IConstantRef>} constants
             * @memberof leancode.contracts.TypeDescriptor
             * @instance
             */
            TypeDescriptor.prototype.constants = $util.emptyArray;

            /**
             * Decodes a TypeDescriptor message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.TypeDescriptor
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.TypeDescriptor} TypeDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypeDescriptor.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.TypeDescriptor();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message["extends"] && message["extends"].length))
                            message["extends"] = [];
                        message["extends"].push($root.leancode.contracts.TypeRef.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.genericParameters && message.genericParameters.length))
                            message.genericParameters = [];
                        message.genericParameters.push($root.leancode.contracts.GenericParameter.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.properties && message.properties.length))
                            message.properties = [];
                        message.properties.push($root.leancode.contracts.PropertyRef.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        if (!(message.constants && message.constants.length))
                            message.constants = [];
                        message.constants.push($root.leancode.contracts.ConstantRef.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a TypeDescriptor message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.TypeDescriptor
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.TypeDescriptor} TypeDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TypeDescriptor.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TypeDescriptor message.
             * @function verify
             * @memberof leancode.contracts.TypeDescriptor
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TypeDescriptor.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message["extends"] != null && message.hasOwnProperty("extends")) {
                    if (!Array.isArray(message["extends"]))
                        return "extends: array expected";
                    for (var i = 0; i < message["extends"].length; ++i) {
                        var error = $root.leancode.contracts.TypeRef.verify(message["extends"][i]);
                        if (error)
                            return "extends." + error;
                    }
                }
                if (message.genericParameters != null && message.hasOwnProperty("genericParameters")) {
                    if (!Array.isArray(message.genericParameters))
                        return "genericParameters: array expected";
                    for (var i = 0; i < message.genericParameters.length; ++i) {
                        var error = $root.leancode.contracts.GenericParameter.verify(message.genericParameters[i]);
                        if (error)
                            return "genericParameters." + error;
                    }
                }
                if (message.properties != null && message.hasOwnProperty("properties")) {
                    if (!Array.isArray(message.properties))
                        return "properties: array expected";
                    for (var i = 0; i < message.properties.length; ++i) {
                        var error = $root.leancode.contracts.PropertyRef.verify(message.properties[i]);
                        if (error)
                            return "properties." + error;
                    }
                }
                if (message.constants != null && message.hasOwnProperty("constants")) {
                    if (!Array.isArray(message.constants))
                        return "constants: array expected";
                    for (var i = 0; i < message.constants.length; ++i) {
                        var error = $root.leancode.contracts.ConstantRef.verify(message.constants[i]);
                        if (error)
                            return "constants." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a TypeDescriptor message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.TypeDescriptor
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.TypeDescriptor} TypeDescriptor
             */
            TypeDescriptor.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.TypeDescriptor)
                    return object;
                var message = new $root.leancode.contracts.TypeDescriptor();
                if (object["extends"]) {
                    if (!Array.isArray(object["extends"]))
                        throw TypeError(".leancode.contracts.TypeDescriptor.extends: array expected");
                    message["extends"] = [];
                    for (var i = 0; i < object["extends"].length; ++i) {
                        if (typeof object["extends"][i] !== "object")
                            throw TypeError(".leancode.contracts.TypeDescriptor.extends: object expected");
                        message["extends"][i] = $root.leancode.contracts.TypeRef.fromObject(object["extends"][i]);
                    }
                }
                if (object.genericParameters) {
                    if (!Array.isArray(object.genericParameters))
                        throw TypeError(".leancode.contracts.TypeDescriptor.genericParameters: array expected");
                    message.genericParameters = [];
                    for (var i = 0; i < object.genericParameters.length; ++i) {
                        if (typeof object.genericParameters[i] !== "object")
                            throw TypeError(".leancode.contracts.TypeDescriptor.genericParameters: object expected");
                        message.genericParameters[i] = $root.leancode.contracts.GenericParameter.fromObject(object.genericParameters[i]);
                    }
                }
                if (object.properties) {
                    if (!Array.isArray(object.properties))
                        throw TypeError(".leancode.contracts.TypeDescriptor.properties: array expected");
                    message.properties = [];
                    for (var i = 0; i < object.properties.length; ++i) {
                        if (typeof object.properties[i] !== "object")
                            throw TypeError(".leancode.contracts.TypeDescriptor.properties: object expected");
                        message.properties[i] = $root.leancode.contracts.PropertyRef.fromObject(object.properties[i]);
                    }
                }
                if (object.constants) {
                    if (!Array.isArray(object.constants))
                        throw TypeError(".leancode.contracts.TypeDescriptor.constants: array expected");
                    message.constants = [];
                    for (var i = 0; i < object.constants.length; ++i) {
                        if (typeof object.constants[i] !== "object")
                            throw TypeError(".leancode.contracts.TypeDescriptor.constants: object expected");
                        message.constants[i] = $root.leancode.contracts.ConstantRef.fromObject(object.constants[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a TypeDescriptor message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.TypeDescriptor
             * @static
             * @param {leancode.contracts.TypeDescriptor} message TypeDescriptor
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TypeDescriptor.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object["extends"] = [];
                    object.genericParameters = [];
                    object.properties = [];
                    object.constants = [];
                }
                if (message["extends"] && message["extends"].length) {
                    object["extends"] = [];
                    for (var j = 0; j < message["extends"].length; ++j)
                        object["extends"][j] = $root.leancode.contracts.TypeRef.toObject(message["extends"][j], options);
                }
                if (message.genericParameters && message.genericParameters.length) {
                    object.genericParameters = [];
                    for (var j = 0; j < message.genericParameters.length; ++j)
                        object.genericParameters[j] = $root.leancode.contracts.GenericParameter.toObject(message.genericParameters[j], options);
                }
                if (message.properties && message.properties.length) {
                    object.properties = [];
                    for (var j = 0; j < message.properties.length; ++j)
                        object.properties[j] = $root.leancode.contracts.PropertyRef.toObject(message.properties[j], options);
                }
                if (message.constants && message.constants.length) {
                    object.constants = [];
                    for (var j = 0; j < message.constants.length; ++j)
                        object.constants[j] = $root.leancode.contracts.ConstantRef.toObject(message.constants[j], options);
                }
                return object;
            };

            /**
             * Converts this TypeDescriptor to JSON.
             * @function toJSON
             * @memberof leancode.contracts.TypeDescriptor
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TypeDescriptor.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return TypeDescriptor;
        })();

        contracts.Statement = (function() {

            /**
             * Properties of a Statement.
             * @memberof leancode.contracts
             * @interface IStatement
             * @property {string|null} [name] Statement name
             * @property {string|null} [comment] Statement comment
             * @property {Array.<leancode.contracts.IAttributeRef>|null} [attributes] Statement attributes
             * @property {leancode.contracts.Statement.IDTO|null} [dto] Statement dto
             * @property {leancode.contracts.Statement.IEnum|null} ["enum"] Statement enum
             * @property {leancode.contracts.Statement.IQuery|null} [query] Statement query
             * @property {leancode.contracts.Statement.ICommand|null} [command] Statement command
             */

            /**
             * Constructs a new Statement.
             * @memberof leancode.contracts
             * @classdesc Represents a Statement.
             * @implements IStatement
             * @constructor
             * @param {leancode.contracts.IStatement=} [properties] Properties to set
             */
            function Statement(properties) {
                this.attributes = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Statement name.
             * @member {string} name
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.name = "";

            /**
             * Statement comment.
             * @member {string} comment
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.comment = "";

            /**
             * Statement attributes.
             * @member {Array.<leancode.contracts.IAttributeRef>} attributes
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.attributes = $util.emptyArray;

            /**
             * Statement dto.
             * @member {leancode.contracts.Statement.IDTO|null|undefined} dto
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.dto = null;

            /**
             * Statement enum.
             * @member {leancode.contracts.Statement.IEnum|null|undefined} enum
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype["enum"] = null;

            /**
             * Statement query.
             * @member {leancode.contracts.Statement.IQuery|null|undefined} query
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.query = null;

            /**
             * Statement command.
             * @member {leancode.contracts.Statement.ICommand|null|undefined} command
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Statement.prototype.command = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * Statement content.
             * @member {"dto"|"enum"|"query"|"command"|undefined} content
             * @memberof leancode.contracts.Statement
             * @instance
             */
            Object.defineProperty(Statement.prototype, "content", {
                get: $util.oneOfGetter($oneOfFields = ["dto", "enum", "query", "command"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Decodes a Statement message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.Statement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.Statement} Statement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Statement.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Statement();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.comment = reader.string();
                        break;
                    case 3:
                        if (!(message.attributes && message.attributes.length))
                            message.attributes = [];
                        message.attributes.push($root.leancode.contracts.AttributeRef.decode(reader, reader.uint32()));
                        break;
                    case 10:
                        message.dto = $root.leancode.contracts.Statement.DTO.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message["enum"] = $root.leancode.contracts.Statement.Enum.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.query = $root.leancode.contracts.Statement.Query.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.command = $root.leancode.contracts.Statement.Command.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Statement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.Statement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.Statement} Statement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Statement.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Statement message.
             * @function verify
             * @memberof leancode.contracts.Statement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Statement.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.comment != null && message.hasOwnProperty("comment"))
                    if (!$util.isString(message.comment))
                        return "comment: string expected";
                if (message.attributes != null && message.hasOwnProperty("attributes")) {
                    if (!Array.isArray(message.attributes))
                        return "attributes: array expected";
                    for (var i = 0; i < message.attributes.length; ++i) {
                        var error = $root.leancode.contracts.AttributeRef.verify(message.attributes[i]);
                        if (error)
                            return "attributes." + error;
                    }
                }
                if (message.dto != null && message.hasOwnProperty("dto")) {
                    properties.content = 1;
                    {
                        var error = $root.leancode.contracts.Statement.DTO.verify(message.dto);
                        if (error)
                            return "dto." + error;
                    }
                }
                if (message["enum"] != null && message.hasOwnProperty("enum")) {
                    if (properties.content === 1)
                        return "content: multiple values";
                    properties.content = 1;
                    {
                        var error = $root.leancode.contracts.Statement.Enum.verify(message["enum"]);
                        if (error)
                            return "enum." + error;
                    }
                }
                if (message.query != null && message.hasOwnProperty("query")) {
                    if (properties.content === 1)
                        return "content: multiple values";
                    properties.content = 1;
                    {
                        var error = $root.leancode.contracts.Statement.Query.verify(message.query);
                        if (error)
                            return "query." + error;
                    }
                }
                if (message.command != null && message.hasOwnProperty("command")) {
                    if (properties.content === 1)
                        return "content: multiple values";
                    properties.content = 1;
                    {
                        var error = $root.leancode.contracts.Statement.Command.verify(message.command);
                        if (error)
                            return "command." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a Statement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.Statement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.Statement} Statement
             */
            Statement.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.Statement)
                    return object;
                var message = new $root.leancode.contracts.Statement();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.comment != null)
                    message.comment = String(object.comment);
                if (object.attributes) {
                    if (!Array.isArray(object.attributes))
                        throw TypeError(".leancode.contracts.Statement.attributes: array expected");
                    message.attributes = [];
                    for (var i = 0; i < object.attributes.length; ++i) {
                        if (typeof object.attributes[i] !== "object")
                            throw TypeError(".leancode.contracts.Statement.attributes: object expected");
                        message.attributes[i] = $root.leancode.contracts.AttributeRef.fromObject(object.attributes[i]);
                    }
                }
                if (object.dto != null) {
                    if (typeof object.dto !== "object")
                        throw TypeError(".leancode.contracts.Statement.dto: object expected");
                    message.dto = $root.leancode.contracts.Statement.DTO.fromObject(object.dto);
                }
                if (object["enum"] != null) {
                    if (typeof object["enum"] !== "object")
                        throw TypeError(".leancode.contracts.Statement.enum: object expected");
                    message["enum"] = $root.leancode.contracts.Statement.Enum.fromObject(object["enum"]);
                }
                if (object.query != null) {
                    if (typeof object.query !== "object")
                        throw TypeError(".leancode.contracts.Statement.query: object expected");
                    message.query = $root.leancode.contracts.Statement.Query.fromObject(object.query);
                }
                if (object.command != null) {
                    if (typeof object.command !== "object")
                        throw TypeError(".leancode.contracts.Statement.command: object expected");
                    message.command = $root.leancode.contracts.Statement.Command.fromObject(object.command);
                }
                return message;
            };

            /**
             * Creates a plain object from a Statement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.Statement
             * @static
             * @param {leancode.contracts.Statement} message Statement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Statement.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.attributes = [];
                if (options.defaults) {
                    object.name = "";
                    object.comment = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.comment != null && message.hasOwnProperty("comment"))
                    object.comment = message.comment;
                if (message.attributes && message.attributes.length) {
                    object.attributes = [];
                    for (var j = 0; j < message.attributes.length; ++j)
                        object.attributes[j] = $root.leancode.contracts.AttributeRef.toObject(message.attributes[j], options);
                }
                if (message.dto != null && message.hasOwnProperty("dto")) {
                    object.dto = $root.leancode.contracts.Statement.DTO.toObject(message.dto, options);
                    if (options.oneofs)
                        object.content = "dto";
                }
                if (message["enum"] != null && message.hasOwnProperty("enum")) {
                    object["enum"] = $root.leancode.contracts.Statement.Enum.toObject(message["enum"], options);
                    if (options.oneofs)
                        object.content = "enum";
                }
                if (message.query != null && message.hasOwnProperty("query")) {
                    object.query = $root.leancode.contracts.Statement.Query.toObject(message.query, options);
                    if (options.oneofs)
                        object.content = "query";
                }
                if (message.command != null && message.hasOwnProperty("command")) {
                    object.command = $root.leancode.contracts.Statement.Command.toObject(message.command, options);
                    if (options.oneofs)
                        object.content = "command";
                }
                return object;
            };

            /**
             * Converts this Statement to JSON.
             * @function toJSON
             * @memberof leancode.contracts.Statement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Statement.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Statement.DTO = (function() {

                /**
                 * Properties of a DTO.
                 * @memberof leancode.contracts.Statement
                 * @interface IDTO
                 * @property {leancode.contracts.ITypeDescriptor|null} [typeDescriptor] DTO typeDescriptor
                 */

                /**
                 * Constructs a new DTO.
                 * @memberof leancode.contracts.Statement
                 * @classdesc Represents a DTO.
                 * @implements IDTO
                 * @constructor
                 * @param {leancode.contracts.Statement.IDTO=} [properties] Properties to set
                 */
                function DTO(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DTO typeDescriptor.
                 * @member {leancode.contracts.ITypeDescriptor|null|undefined} typeDescriptor
                 * @memberof leancode.contracts.Statement.DTO
                 * @instance
                 */
                DTO.prototype.typeDescriptor = null;

                /**
                 * Decodes a DTO message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.Statement.DTO
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.Statement.DTO} DTO
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DTO.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Statement.DTO();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a DTO message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.Statement.DTO
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.Statement.DTO} DTO
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DTO.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a DTO message.
                 * @function verify
                 * @memberof leancode.contracts.Statement.DTO
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DTO.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor")) {
                        var error = $root.leancode.contracts.TypeDescriptor.verify(message.typeDescriptor);
                        if (error)
                            return "typeDescriptor." + error;
                    }
                    return null;
                };

                /**
                 * Creates a DTO message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.Statement.DTO
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.Statement.DTO} DTO
                 */
                DTO.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.Statement.DTO)
                        return object;
                    var message = new $root.leancode.contracts.Statement.DTO();
                    if (object.typeDescriptor != null) {
                        if (typeof object.typeDescriptor !== "object")
                            throw TypeError(".leancode.contracts.Statement.DTO.typeDescriptor: object expected");
                        message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.fromObject(object.typeDescriptor);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a DTO message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.Statement.DTO
                 * @static
                 * @param {leancode.contracts.Statement.DTO} message DTO
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DTO.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.typeDescriptor = null;
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor"))
                        object.typeDescriptor = $root.leancode.contracts.TypeDescriptor.toObject(message.typeDescriptor, options);
                    return object;
                };

                /**
                 * Converts this DTO to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.Statement.DTO
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DTO.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return DTO;
            })();

            Statement.Enum = (function() {

                /**
                 * Properties of an Enum.
                 * @memberof leancode.contracts.Statement
                 * @interface IEnum
                 * @property {Array.<leancode.contracts.IEnumValue>|null} [members] Enum members
                 */

                /**
                 * Constructs a new Enum.
                 * @memberof leancode.contracts.Statement
                 * @classdesc Represents an Enum.
                 * @implements IEnum
                 * @constructor
                 * @param {leancode.contracts.Statement.IEnum=} [properties] Properties to set
                 */
                function Enum(properties) {
                    this.members = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Enum members.
                 * @member {Array.<leancode.contracts.IEnumValue>} members
                 * @memberof leancode.contracts.Statement.Enum
                 * @instance
                 */
                Enum.prototype.members = $util.emptyArray;

                /**
                 * Decodes an Enum message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.Statement.Enum
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.Statement.Enum} Enum
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Enum.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Statement.Enum();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.members && message.members.length))
                                message.members = [];
                            message.members.push($root.leancode.contracts.EnumValue.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Enum message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.Statement.Enum
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.Statement.Enum} Enum
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Enum.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Enum message.
                 * @function verify
                 * @memberof leancode.contracts.Statement.Enum
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Enum.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.members != null && message.hasOwnProperty("members")) {
                        if (!Array.isArray(message.members))
                            return "members: array expected";
                        for (var i = 0; i < message.members.length; ++i) {
                            var error = $root.leancode.contracts.EnumValue.verify(message.members[i]);
                            if (error)
                                return "members." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Enum message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.Statement.Enum
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.Statement.Enum} Enum
                 */
                Enum.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.Statement.Enum)
                        return object;
                    var message = new $root.leancode.contracts.Statement.Enum();
                    if (object.members) {
                        if (!Array.isArray(object.members))
                            throw TypeError(".leancode.contracts.Statement.Enum.members: array expected");
                        message.members = [];
                        for (var i = 0; i < object.members.length; ++i) {
                            if (typeof object.members[i] !== "object")
                                throw TypeError(".leancode.contracts.Statement.Enum.members: object expected");
                            message.members[i] = $root.leancode.contracts.EnumValue.fromObject(object.members[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Enum message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.Statement.Enum
                 * @static
                 * @param {leancode.contracts.Statement.Enum} message Enum
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Enum.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.members = [];
                    if (message.members && message.members.length) {
                        object.members = [];
                        for (var j = 0; j < message.members.length; ++j)
                            object.members[j] = $root.leancode.contracts.EnumValue.toObject(message.members[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Enum to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.Statement.Enum
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Enum.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Enum;
            })();

            Statement.Query = (function() {

                /**
                 * Properties of a Query.
                 * @memberof leancode.contracts.Statement
                 * @interface IQuery
                 * @property {leancode.contracts.ITypeDescriptor|null} [typeDescriptor] Query typeDescriptor
                 * @property {leancode.contracts.ITypeRef|null} [returnType] Query returnType
                 */

                /**
                 * Constructs a new Query.
                 * @memberof leancode.contracts.Statement
                 * @classdesc Represents a Query.
                 * @implements IQuery
                 * @constructor
                 * @param {leancode.contracts.Statement.IQuery=} [properties] Properties to set
                 */
                function Query(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Query typeDescriptor.
                 * @member {leancode.contracts.ITypeDescriptor|null|undefined} typeDescriptor
                 * @memberof leancode.contracts.Statement.Query
                 * @instance
                 */
                Query.prototype.typeDescriptor = null;

                /**
                 * Query returnType.
                 * @member {leancode.contracts.ITypeRef|null|undefined} returnType
                 * @memberof leancode.contracts.Statement.Query
                 * @instance
                 */
                Query.prototype.returnType = null;

                /**
                 * Decodes a Query message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.Statement.Query
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.Statement.Query} Query
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Query.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Statement.Query();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.returnType = $root.leancode.contracts.TypeRef.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Query message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.Statement.Query
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.Statement.Query} Query
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Query.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Query message.
                 * @function verify
                 * @memberof leancode.contracts.Statement.Query
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Query.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor")) {
                        var error = $root.leancode.contracts.TypeDescriptor.verify(message.typeDescriptor);
                        if (error)
                            return "typeDescriptor." + error;
                    }
                    if (message.returnType != null && message.hasOwnProperty("returnType")) {
                        var error = $root.leancode.contracts.TypeRef.verify(message.returnType);
                        if (error)
                            return "returnType." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Query message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.Statement.Query
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.Statement.Query} Query
                 */
                Query.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.Statement.Query)
                        return object;
                    var message = new $root.leancode.contracts.Statement.Query();
                    if (object.typeDescriptor != null) {
                        if (typeof object.typeDescriptor !== "object")
                            throw TypeError(".leancode.contracts.Statement.Query.typeDescriptor: object expected");
                        message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.fromObject(object.typeDescriptor);
                    }
                    if (object.returnType != null) {
                        if (typeof object.returnType !== "object")
                            throw TypeError(".leancode.contracts.Statement.Query.returnType: object expected");
                        message.returnType = $root.leancode.contracts.TypeRef.fromObject(object.returnType);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Query message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.Statement.Query
                 * @static
                 * @param {leancode.contracts.Statement.Query} message Query
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Query.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.typeDescriptor = null;
                        object.returnType = null;
                    }
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor"))
                        object.typeDescriptor = $root.leancode.contracts.TypeDescriptor.toObject(message.typeDescriptor, options);
                    if (message.returnType != null && message.hasOwnProperty("returnType"))
                        object.returnType = $root.leancode.contracts.TypeRef.toObject(message.returnType, options);
                    return object;
                };

                /**
                 * Converts this Query to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.Statement.Query
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Query.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Query;
            })();

            Statement.Command = (function() {

                /**
                 * Properties of a Command.
                 * @memberof leancode.contracts.Statement
                 * @interface ICommand
                 * @property {leancode.contracts.ITypeDescriptor|null} [typeDescriptor] Command typeDescriptor
                 * @property {Array.<leancode.contracts.IErrorCode>|null} [errorCodes] Command errorCodes
                 */

                /**
                 * Constructs a new Command.
                 * @memberof leancode.contracts.Statement
                 * @classdesc Represents a Command.
                 * @implements ICommand
                 * @constructor
                 * @param {leancode.contracts.Statement.ICommand=} [properties] Properties to set
                 */
                function Command(properties) {
                    this.errorCodes = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Command typeDescriptor.
                 * @member {leancode.contracts.ITypeDescriptor|null|undefined} typeDescriptor
                 * @memberof leancode.contracts.Statement.Command
                 * @instance
                 */
                Command.prototype.typeDescriptor = null;

                /**
                 * Command errorCodes.
                 * @member {Array.<leancode.contracts.IErrorCode>} errorCodes
                 * @memberof leancode.contracts.Statement.Command
                 * @instance
                 */
                Command.prototype.errorCodes = $util.emptyArray;

                /**
                 * Decodes a Command message from the specified reader or buffer.
                 * @function decode
                 * @memberof leancode.contracts.Statement.Command
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {leancode.contracts.Statement.Command} Command
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Command.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Statement.Command();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.decode(reader, reader.uint32());
                            break;
                        case 2:
                            if (!(message.errorCodes && message.errorCodes.length))
                                message.errorCodes = [];
                            message.errorCodes.push($root.leancode.contracts.ErrorCode.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Command message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof leancode.contracts.Statement.Command
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {leancode.contracts.Statement.Command} Command
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Command.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Command message.
                 * @function verify
                 * @memberof leancode.contracts.Statement.Command
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Command.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor")) {
                        var error = $root.leancode.contracts.TypeDescriptor.verify(message.typeDescriptor);
                        if (error)
                            return "typeDescriptor." + error;
                    }
                    if (message.errorCodes != null && message.hasOwnProperty("errorCodes")) {
                        if (!Array.isArray(message.errorCodes))
                            return "errorCodes: array expected";
                        for (var i = 0; i < message.errorCodes.length; ++i) {
                            var error = $root.leancode.contracts.ErrorCode.verify(message.errorCodes[i]);
                            if (error)
                                return "errorCodes." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Command message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof leancode.contracts.Statement.Command
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {leancode.contracts.Statement.Command} Command
                 */
                Command.fromObject = function fromObject(object) {
                    if (object instanceof $root.leancode.contracts.Statement.Command)
                        return object;
                    var message = new $root.leancode.contracts.Statement.Command();
                    if (object.typeDescriptor != null) {
                        if (typeof object.typeDescriptor !== "object")
                            throw TypeError(".leancode.contracts.Statement.Command.typeDescriptor: object expected");
                        message.typeDescriptor = $root.leancode.contracts.TypeDescriptor.fromObject(object.typeDescriptor);
                    }
                    if (object.errorCodes) {
                        if (!Array.isArray(object.errorCodes))
                            throw TypeError(".leancode.contracts.Statement.Command.errorCodes: array expected");
                        message.errorCodes = [];
                        for (var i = 0; i < object.errorCodes.length; ++i) {
                            if (typeof object.errorCodes[i] !== "object")
                                throw TypeError(".leancode.contracts.Statement.Command.errorCodes: object expected");
                            message.errorCodes[i] = $root.leancode.contracts.ErrorCode.fromObject(object.errorCodes[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Command message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof leancode.contracts.Statement.Command
                 * @static
                 * @param {leancode.contracts.Statement.Command} message Command
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Command.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.errorCodes = [];
                    if (options.defaults)
                        object.typeDescriptor = null;
                    if (message.typeDescriptor != null && message.hasOwnProperty("typeDescriptor"))
                        object.typeDescriptor = $root.leancode.contracts.TypeDescriptor.toObject(message.typeDescriptor, options);
                    if (message.errorCodes && message.errorCodes.length) {
                        object.errorCodes = [];
                        for (var j = 0; j < message.errorCodes.length; ++j)
                            object.errorCodes[j] = $root.leancode.contracts.ErrorCode.toObject(message.errorCodes[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Command to JSON.
                 * @function toJSON
                 * @memberof leancode.contracts.Statement.Command
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Command.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Command;
            })();

            return Statement;
        })();

        contracts.Export = (function() {

            /**
             * Properties of an Export.
             * @memberof leancode.contracts
             * @interface IExport
             * @property {string|null} [projectName] Export projectName
             * @property {Array.<leancode.contracts.IStatement>|null} [statements] Export statements
             * @property {Array.<leancode.contracts.ErrorCode.IGroup>|null} [knownErrorGroups] Export knownErrorGroups
             */

            /**
             * Constructs a new Export.
             * @memberof leancode.contracts
             * @classdesc Represents an Export.
             * @implements IExport
             * @constructor
             * @param {leancode.contracts.IExport=} [properties] Properties to set
             */
            function Export(properties) {
                this.statements = [];
                this.knownErrorGroups = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Export projectName.
             * @member {string} projectName
             * @memberof leancode.contracts.Export
             * @instance
             */
            Export.prototype.projectName = "";

            /**
             * Export statements.
             * @member {Array.<leancode.contracts.IStatement>} statements
             * @memberof leancode.contracts.Export
             * @instance
             */
            Export.prototype.statements = $util.emptyArray;

            /**
             * Export knownErrorGroups.
             * @member {Array.<leancode.contracts.ErrorCode.IGroup>} knownErrorGroups
             * @memberof leancode.contracts.Export
             * @instance
             */
            Export.prototype.knownErrorGroups = $util.emptyArray;

            /**
             * Decodes an Export message from the specified reader or buffer.
             * @function decode
             * @memberof leancode.contracts.Export
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {leancode.contracts.Export} Export
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Export.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.leancode.contracts.Export();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.projectName = reader.string();
                        break;
                    case 2:
                        if (!(message.statements && message.statements.length))
                            message.statements = [];
                        message.statements.push($root.leancode.contracts.Statement.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.knownErrorGroups && message.knownErrorGroups.length))
                            message.knownErrorGroups = [];
                        message.knownErrorGroups.push($root.leancode.contracts.ErrorCode.Group.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Export message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof leancode.contracts.Export
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {leancode.contracts.Export} Export
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Export.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Export message.
             * @function verify
             * @memberof leancode.contracts.Export
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Export.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.projectName != null && message.hasOwnProperty("projectName"))
                    if (!$util.isString(message.projectName))
                        return "projectName: string expected";
                if (message.statements != null && message.hasOwnProperty("statements")) {
                    if (!Array.isArray(message.statements))
                        return "statements: array expected";
                    for (var i = 0; i < message.statements.length; ++i) {
                        var error = $root.leancode.contracts.Statement.verify(message.statements[i]);
                        if (error)
                            return "statements." + error;
                    }
                }
                if (message.knownErrorGroups != null && message.hasOwnProperty("knownErrorGroups")) {
                    if (!Array.isArray(message.knownErrorGroups))
                        return "knownErrorGroups: array expected";
                    for (var i = 0; i < message.knownErrorGroups.length; ++i) {
                        var error = $root.leancode.contracts.ErrorCode.Group.verify(message.knownErrorGroups[i]);
                        if (error)
                            return "knownErrorGroups." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Export message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof leancode.contracts.Export
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {leancode.contracts.Export} Export
             */
            Export.fromObject = function fromObject(object) {
                if (object instanceof $root.leancode.contracts.Export)
                    return object;
                var message = new $root.leancode.contracts.Export();
                if (object.projectName != null)
                    message.projectName = String(object.projectName);
                if (object.statements) {
                    if (!Array.isArray(object.statements))
                        throw TypeError(".leancode.contracts.Export.statements: array expected");
                    message.statements = [];
                    for (var i = 0; i < object.statements.length; ++i) {
                        if (typeof object.statements[i] !== "object")
                            throw TypeError(".leancode.contracts.Export.statements: object expected");
                        message.statements[i] = $root.leancode.contracts.Statement.fromObject(object.statements[i]);
                    }
                }
                if (object.knownErrorGroups) {
                    if (!Array.isArray(object.knownErrorGroups))
                        throw TypeError(".leancode.contracts.Export.knownErrorGroups: array expected");
                    message.knownErrorGroups = [];
                    for (var i = 0; i < object.knownErrorGroups.length; ++i) {
                        if (typeof object.knownErrorGroups[i] !== "object")
                            throw TypeError(".leancode.contracts.Export.knownErrorGroups: object expected");
                        message.knownErrorGroups[i] = $root.leancode.contracts.ErrorCode.Group.fromObject(object.knownErrorGroups[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an Export message. Also converts values to other types if specified.
             * @function toObject
             * @memberof leancode.contracts.Export
             * @static
             * @param {leancode.contracts.Export} message Export
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Export.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.statements = [];
                    object.knownErrorGroups = [];
                }
                if (options.defaults)
                    object.projectName = "";
                if (message.projectName != null && message.hasOwnProperty("projectName"))
                    object.projectName = message.projectName;
                if (message.statements && message.statements.length) {
                    object.statements = [];
                    for (var j = 0; j < message.statements.length; ++j)
                        object.statements[j] = $root.leancode.contracts.Statement.toObject(message.statements[j], options);
                }
                if (message.knownErrorGroups && message.knownErrorGroups.length) {
                    object.knownErrorGroups = [];
                    for (var j = 0; j < message.knownErrorGroups.length; ++j)
                        object.knownErrorGroups[j] = $root.leancode.contracts.ErrorCode.Group.toObject(message.knownErrorGroups[j], options);
                }
                return object;
            };

            /**
             * Converts this Export to JSON.
             * @function toJSON
             * @memberof leancode.contracts.Export
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Export.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Export;
        })();

        return contracts;
    })();

    return leancode;
})();

module.exports = $root;
