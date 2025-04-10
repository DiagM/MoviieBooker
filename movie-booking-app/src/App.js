import React from "react";
import MoviesList from "./components/MoviesList";

const App = () => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl">Movie Reservations</h1>
      </header>
      <main>
        <MoviesList />
      </main>
    </div>
  );
};

export default App;
