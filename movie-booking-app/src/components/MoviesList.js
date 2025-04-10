import React, { useState, useEffect } from "react";
import axios from "axios";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reservationTime, setReservationTime] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("popularity.desc");
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("movies");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${apiUrl}/movies`, {
        params: { page, search, sort },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setErrorMessage("Erreur lors du chargement des films.");
      console.error(error);
    }
  };

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(`${apiUrl}/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
    } catch (error) {
      setErrorMessage("Erreur lors du chargement des réservations, connectez-vous.");
      console.error(error);
    }
  };

  const createReservation = async () => {
    if (!reservationTime) {
      setErrorMessage("La date et l'heure de la réservation sont requises.");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${apiUrl}/reservations`,
        { movieId: selectedMovie.id.toString(), startTime: reservationTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations((prev) => [...prev, response.data]);
      setShowModal(false);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Conflit avec une autre réservation. Respectez un délai de 2h.");
      } else {
        setErrorMessage("Erreur lors de la création de la réservation. Connectez-vous.");
      }
      console.error(error);
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`${apiUrl}/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== reservationId)
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Erreur lors de l'annulation de la réservation.");
      console.error(error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, search, sort]);

  useEffect(() => {
    if (isAuthenticated) fetchReservations();
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 bg-gray-900 p-4 rounded-md shadow-md">
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab("movies")}
            className={`p-2 rounded-md ${
              activeTab === "movies" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
            } transition-colors`}
          >
            Films
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`p-2 rounded-md ${
              activeTab === "reservations" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
            } transition-colors`}
          >
            Réservations
          </button>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                setIsAuthenticated(false);
                window.location.reload();
              }}
              className="p-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <a href="/login" className="p-2 bg-blue-500 text-white rounded-md">
                Login
              </a>
              <a href="/register" className="p-2 bg-green-500 text-white rounded-md">
                Register
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Error message */}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4 font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "movies" && (
        <>
          {/* Search */}
          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Rechercher un film..."
              className="p-2 border border-gray-300 rounded-md w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="ml-4 p-2 border border-gray-300 rounded-md"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popularity.desc">Popularité (Desc)</option>
              <option value="popularity.asc">Popularité (Asc)</option>
              <option value="release_date.desc">Date de sortie (Desc)</option>
              <option value="release_date.asc">Date de sortie (Asc)</option>
            </select>
          </div>

          {/* Movie list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-white shadow-lg rounded-md overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <p className="text-gray-600">{movie.release_date}</p>
                  <p className="text-gray-800 mt-2">{movie.overview}</p>
                  <button
                    onClick={() => {
                      setSelectedMovie(movie);
                      setShowModal(true);
                    }}
                    className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reservation modal */}
          {showModal && selectedMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md w-1/3 shadow-lg">
                <h4 className="text-xl font-bold mb-2">{selectedMovie.title}</h4>
                <p className="text-gray-600 mb-4">{selectedMovie.overview}</p>
                <input
                  type="datetime-local"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full mb-4"
                />
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={createReservation}
                    className="p-2 bg-green-500 text-white rounded-md w-48"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 bg-red-500 text-white rounded-md w-48"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "reservations" && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Mes réservations</h3>
          {reservations.length === 0 ? (
            <p className="text-gray-600">Vous n'avez aucune réservation.</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation._id} className="bg-white shadow-md p-4 rounded-md mt-4">
                <p><strong>Film:</strong> {reservation.movieId}</p>
                <p><strong>Date:</strong> {reservation.startTime}</p>
                <button
                  onClick={() => cancelReservation(reservation._id)}
                  className="mt-2 p-2 bg-red-500 text-white rounded-md"
                >
                  Annuler la réservation
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Précédent
        </button>
        <span>
          Page {page} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default MoviesList;
