import React from "react";

const Result = ({ movies }) => {
	return (
		<div>
			<p className="num-results">
				Found <strong>{movies.length}</strong> results
			</p>
		</div>
	);
};

export default Result;
