import { createRouting, segment, arg } from "ts-routes";

const routes = createRouting({
    home: segment`/`,
    splitComponent: segment`/split-component`,
    test: segment`test/${arg("test", { optionality: "optional" })}`,
} as const);

export default routes;
