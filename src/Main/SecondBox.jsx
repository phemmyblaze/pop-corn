import React, { useState } from "react";
const SecondBox = ({ children }) => {
	const [isOpen2, setIsOpen2] = useState(true);

	return (
		<div>
			<div className="box">
				<button className="btn-toggle" onClick={() => setIsOpen2((open) => !open)}>
					{isOpen2 ? "–" : "+"}
				</button>
				{isOpen2 && children}
			</div>
		</div>
	);
};

export default SecondBox;
