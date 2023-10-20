import React, { useState } from "react";

const FirstBox = ({ children }) => {
	const [isOpen1, setIsOpen1] = useState(true);

	return (
		<div>
			<div className="box">
				<button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
					{isOpen1 ? "–" : "+"}
				</button>
				{isOpen1 && children}
			</div>
		</div>
	);
};

export default FirstBox;
