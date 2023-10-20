import React from "react";
import WatchedMovies from "./WatchedMovies";

const WatchedList = ({ watched }) => {
	return (
		<div>
			<ul className="list">
				{watched.map((movie) => (
					<WatchedMovies movie={movie} key={movie.imdbID} />
				))}
			</ul>
		</div>
	);
};

export default WatchedList;
