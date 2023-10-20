import React from "react";
import FirstBox from "./FirstBox";
import SecondBox from "./SecondBox";

const Main = ({ children }) => {
	return <main className="main">{children}</main>;
};

export default Main;
