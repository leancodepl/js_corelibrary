import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const render = () => void ReactDOM.render(<App />, document.getElementById("root"));

render();

declare var module: { hot: any };
if (module.hot) {
    module.hot.accept("./App", () => {
        render();
    });
}
