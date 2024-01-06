import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./Main/StarRating";
// import Task from "./Main/Task";

function Test() {
	const [movieRating, setMovieRating] = useState(0);

	return (
		<div>
			<StarRating maxRating={10} color="blue" onSetRating={setMovieRating} />
			<p>This movie was rated {movieRating} star</p>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
		{/* <StarRating maxRating={5} message={["Terrible", "Bad", "Okay", "Good", "Amazing"]} />
		<StarRating size={24} color="green" className="test" defaultRating={3} />
		<Test message={["Terrible", "Bad", "Okay", "Good", "Amazing"]} /> */}
		{/* <Task /> */}
	</React.StrictMode>
);
