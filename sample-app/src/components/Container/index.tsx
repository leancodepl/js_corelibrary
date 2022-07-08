import React, { FunctionComponent, ReactNode } from "react";
import mkCx from "@leancode/cx";
import styles from "./styles.scss";

const cx = mkCx(styles);

const Container: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
    <div className={cx("container-element")}>{children}</div>
);

export default Container;
