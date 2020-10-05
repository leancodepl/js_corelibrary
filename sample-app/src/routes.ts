import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router";
import { createRouting, RouteParamsFor, segment } from "ts-routes";

const routes = createRouting({
    home: segment`/`,
    splitComponent: segment`/split-component`,
} as const);

export default routes;

export type PageProps<TPathParams extends (...args: any[]) => string> = RouteComponentProps<
    RouteParamsFor<TPathParams>
>;

export type PageComponent<TPathParams extends (...args: any[]) => string> = FunctionComponent<PageProps<TPathParams>>;
