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

	// useEffect(() => {
	// 	console.log("A");
	// }, []);
	// useEffect(() => {
	// 	console.log("B");
	// });

	// console.log("C");

	useEffect(() => {
		async function fetchMovie() {
			try {
				setLoading(true);
				setError("");
				const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);

				if (!res.ok) throw new Error("Something went wrong with fetching movies");

				const data = await res.json();

				if (data.Response === "False") throw new Error("Movie not found");

				console.log(data);
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
					{loading ? <Loader /> : !error ? <MovieList movies={movies} /> : <ErrorMessage message={error} />}
				</Box>
				<Box>
					<WatchedSum watched={watched} />
					<WatchedList watched={watched} />
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
