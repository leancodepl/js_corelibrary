import { leancode } from "../../protocol";
import GeneratorBooleanValue from "./GeneratorBooleanValue";
import GeneratorStringValue from "./GeneratorStringValue";
import GeneratorNumberValue from "./GeneratorNumberValue";
import GeneratorNullValue from "./GeneratorNullValue";

export default class GeneratorValueFactory {
    static createValue(value: leancode.contracts.IValueRef) {
        if (value.null) {
            return new GeneratorNullValue();
        }

        if (value.bool) {
            return new GeneratorBooleanValue({ boolValue: value.bool });
        }

        if (value.number) {
            return new GeneratorNumberValue({ numberOrFloat: value.number });
        }

        if (value.floatingPoint) {
            return new GeneratorNumberValue({ numberOrFloat: value.floatingPoint });
        }

        if (value.string) {
            return new GeneratorStringValue({ stringValue: value.string });
        }

        throw new Error("Unknown value type");
    }
}
