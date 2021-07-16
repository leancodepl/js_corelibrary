import GeneratorEnum from "./GeneratorEnum";
import GeneratorInterface from "./GeneratorInterface";

export default interface GeneratorTypesDictionary {
    statements: { [name: string]: GeneratorInterface | GeneratorEnum | undefined };
}
