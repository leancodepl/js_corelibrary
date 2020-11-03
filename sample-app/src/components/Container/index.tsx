import React from "react";
import mkCx from "@leancode/cx";
import styles from "./styles.scss";

const cx = mkCx(styles);

const Container: React.FunctionComponent = ({ children }) => <div className={cx("container-element")}>{children}</div>;

export default Container;
