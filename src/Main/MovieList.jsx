import Movie from "./Movie";

const MovieList = ({ movies, onSelectMovie }) => {
	return (
		<div>
			<ul className="list list-movies">
				{movies?.map((movie) => (
					<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
				))}
			</ul>
		</div>
	);
};

export default MovieList;
