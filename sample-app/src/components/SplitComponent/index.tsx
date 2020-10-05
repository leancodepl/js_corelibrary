import React from "react";
import createMarkerComponent, { MarkerComponent } from "utils/composableChildren/createMarkerComponent";
import splitChildrenByTypes from "utils/composableChildren/splitChildrenByTypes";

export type SplitComponentProps = {};

const SplitComponent: React.FunctionComponent<SplitComponentProps> & {
    A: MarkerComponent<{ sampleProp?: string }>;
    B: MarkerComponent;
    C: MarkerComponent;
} = ({ children }) => {
    const [a, b, c] = splitChildrenByTypes(SplitComponent.A, SplitComponent.B, SplitComponent.C)(children);

    const { sampleProp } = a[0]?.props ?? {};

    return (
        <div>
            <div>
                <div>a ({sampleProp})</div>
                {a}
            </div>

            <div>
                <div>b</div>
                {b}
            </div>

            <div>
                <div>c</div>
                {c}
            </div>
        </div>
    );
};
export default SplitComponent;

SplitComponent.A = createMarkerComponent("A");
SplitComponent.B = createMarkerComponent("B");
SplitComponent.C = createMarkerComponent("C");
