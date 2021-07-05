import GeneratorInterface from "./GeneratorInterface";

export default interface GeneratorTypesDictionary {
    interfaces: { [name: string]: GeneratorInterface };
}
