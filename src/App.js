import { useEffect, useState } from "react";
import Main from "./Main/Main";
import NavBar from "./Nav/NavBar";
import Logo from "./Nav/Logo";
import Search from "./Nav/Search";
import Result from "./Nav/Result";
import Box from "./Main/Box";
import MovieList from "./Main/MovieList";
import WatchedSum from "./Main/WatchedSum";
import WatchedList from "./Main/WatchedList";
import StarRating from "./Main/StarRating";

const KEY = "b3b0c3a4";

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
		const controller = new AbortController();
		async function fetchMovie() {
			try {
				setLoading(true);
				setError("");
				const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`, { signal: controller.signal });

				if (!res.ok) throw new Error("Something went wrong with fetching movies");

				const data = await res.json();

				if (data.Response === "False") throw new Error("Movie not found");

				setMovies(data.Search);
				setError("");
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}

		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}

		handleCloseMovie();

		fetchMovie();
		return function () {
			controller.abort();
		};
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
		const callBack = (e) => {
			if (e.code === "Escape") {
				onCloseMovie();
			}
		};

		document.addEventListener("keydown", callBack);

		return () => {
			document.removeEventListener("keydown", callBack);
		};
	}, [onCloseMovie]);

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

	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;

		return function () {
			document.title = "usePopcorn";
		};
	}, [title]);

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
