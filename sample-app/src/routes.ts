import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router";
import { createRouting, PathParamsFor, segment, arg } from "ts-routes";

const routes = createRouting({
    home: segment`/`,
    splitComponent: segment`/split-component`,
    test: segment`test/${arg("test", { optionality: "optional" })}`,
} as const);

export default routes;

export type PageProps<TPathParams extends (...args: any[]) => string> = RouteComponentProps<PathParamsFor<TPathParams>>;

export type PageComponent<TPathParams extends (...args: any[]) => string> = FunctionComponent<PageProps<TPathParams>>;
