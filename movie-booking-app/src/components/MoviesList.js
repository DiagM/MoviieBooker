import React, { useState, useEffect } from "react";
import axios from "axios";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popularity.desc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fonction pour récupérer les films depuis l'API
    const fetchMovies = async () => {
      try {
       
        const apiUrl = process.env.REACT_APP_API_URL;

        const response = await axios.get(apiUrl, {
          params: {
            page,
            search,
            sort,
          },
        });
        console.log(response);

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [page, search, sort]);

  // Gestion du changement de page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search movies"
          className="p-2 border border-gray-300 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tri */}
      <div className="mb-4">
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="popularity.desc">Popularity (Desc)</option>
          <option value="popularity.asc">Popularity (Asc)</option>
          <option value="release_date.desc">Release Date (Desc)</option>
          <option value="release_date.asc">Release Date (Asc)</option>
        </select>
      </div>

      {/* Liste des films */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border p-4 rounded-md">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-md"
            />
            <h3 className="text-xl mt-2">{movie.title}</h3>
            <p>{movie.release_date}</p>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
