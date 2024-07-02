import { useEffect, useState } from "react";
import Main from "./Main/Main";
import NavBar from "./Nav/NavBar";
import Logo from "./Nav/Logo";
import Search from "./Nav/Search";
import Result from "./Nav/Result";
import Box from "./Main/Box";
// import SecondBox from "./Main/SecondBox";
import MovieList from "./Main/MovieList";
import WatchedSum from "./Main/WatchedSum";
import WatchedList from "./Main/WatchedList";
import StarRating from "./Main/StarRating";
const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const KEY = "b3b0c3a4";
const tempQuery = "hello";

export default function App() {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	function handleSelectedMoviesId(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	const handleAddWatched = (movie) => {
		setWatched((watched) => [...watched, movie]);
	};

	const handleDeleteWatch = (id) => {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	};

	useEffect(() => {
		async function fetchMovie() {
			try {
				setLoading(true);
				setError("");
				const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);

				if (!res.ok) throw new Error("Something went wrong with fetching movies");

				const data = await res.json();

				if (data.Response === "False") throw new Error("Movie not found");

				setMovies(data.Search);
			} catch (err) {
				console.error(err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if (query.length < 3) {
			setMovies(tempMovieData);
			setError("");
			return;
		}

		fetchMovie();
	}, [query]);
	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<Result movies={movies} />
			</NavBar>

			<Main>
				<Box>
					{/* {loading ? <Loader /> : <MovieList movies={movies} />} */}
					{loading ? <Loader /> : !error ? <MovieList movies={movies} onSelectMovie={handleSelectedMoviesId} /> : <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<SelectedMovies selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} />
					) : (
						<>
							<WatchedSum watched={watched} />
							<WatchedList watched={watched} onDeleteWatched={handleDeleteWatch} />
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function Loader() {
	return <p className="loader"> Loading.....</p>;
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span> {message}
		</p>
	);
}

function SelectedMovies({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovies] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

	const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie;

	const handleAdd = () => {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();
	};

	useEffect(() => {
		async function getMoviesDetails() {
			setIsLoading(true);
			const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
			const data = await res.json();
			setMovies(data);
			setIsLoading(false);
		}

		getMoviesDetails();
	}, [selectedId]);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie}`} />

						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>

							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDB rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating maxRating={10} size={24} onSetRating={setUserRating} />

									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated this movie {watchedUserRating} <span>⭐</span>{" "}
								</p>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
