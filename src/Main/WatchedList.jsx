import React from "react";
import WatchedMovies from "./WatchedMovies";

const WatchedList = ({ watched, onDeleteWatched }) => {
	return (
		<div>
			<ul className="list">
				{watched.map((movie) => (
					<WatchedMovies movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
				))}
			</ul>
		</div>
	);
};

export default WatchedList;
