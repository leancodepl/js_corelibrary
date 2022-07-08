import React, { FunctionComponent, ReactNode } from "react";

export type MarkerComponent<TProps = any> = FunctionComponent<TProps & { children?: ReactNode }>;

export default function createMarkerComponent<TProps = any>(displayName?: string) {
    const MarkerComponent: MarkerComponent<TProps> = ({ children }) => <>{children}</>;
    MarkerComponent.displayName = displayName;
    return MarkerComponent;
}
