import React from "react";

export type A11yTestProps = {};

const A11yTest: React.FunctionComponent<A11yTestProps> = () => {
    return (
        <div>
            {/* This div is clickable */}
            <div onClick={() => alert("button div")}>Click me!</div>
            {/* This image has no alt */}
            <img src="https://picsum.photos/200" />
            {/* This anchor is empty */}
            <a href="https://leancode.pl"></a>
        </div>
    );
};
export default A11yTest;
