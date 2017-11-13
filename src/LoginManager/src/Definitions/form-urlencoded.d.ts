declare function encode(data: any): string;
declare namespace encode {

}
declare module "form-urlencoded" {
    export = encode;
}