import React, { FunctionComponent } from "react";

export type MarkerComponent<TProps = any> = FunctionComponent<TProps>;

export default function createMarkerComponent<TProps = any>(displayName?: string) {
    const MarkerComponent: FunctionComponent<TProps> = ({ children }) => <>{children}</>;
    MarkerComponent.displayName = displayName;
    return MarkerComponent;
}
