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
  const [showModal, setShowModal] = useState(false); // Nouvelle variable d'état pour la modale
  const [errorMessage, setErrorMessage] = useState(""); // Gestion des erreurs
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/movies`, {
          params: { page, search, sort },
        });
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setErrorMessage("Erreur lors du chargement des films.");
      }
    };
    fetchMovies();
  }, [page, search, sort]);

  // Fetch reservations
  useEffect(() => {
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
        console.error("Error fetching reservations:", error);
        setErrorMessage("Erreur lors du chargement des réservations.");
      }
    };
    fetchReservations();
  }, []);

  const createReservation = async () => {
    if (!reservationTime) {
      alert("La date et l'heure de la réservation sont requises.");
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${apiUrl}/reservations`,
        {
          movieId: selectedMovie.id, // Utilisation de l'objet movie au lieu de juste l'id
          startTime: reservationTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations((prevReservations) => [
        ...prevReservations,
        response.data,
      ]);
      setShowModal(false); // Fermer la modale après la réservation
      setErrorMessage(""); // Réinitialiser l'erreur
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (error.response && error.response.status === 409) {
        setErrorMessage(
          "Conflit avec une autre réservation. Respectez un délai de 2h entre deux films."
        );
      } else {
        setErrorMessage("Erreur lors de la création de la réservation.");
      }
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`${apiUrl}/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
      setErrorMessage(""); // Réinitialiser l'erreur
    } catch (error) {
      console.error("Error canceling reservation:", error);
      if (error.response && error.response.status === 404) {
        setErrorMessage("Réservation introuvable.");
      } else {
        setErrorMessage("Erreur lors de l'annulation de la réservation.");
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab("movies")}
            className={`p-2 rounded-md ${
              activeTab === "movies" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Films
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`p-2 rounded-md ${
              activeTab === "reservations"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
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
                window.location.reload(); // Pour recharger l'état
              }}
              className="p-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Login
              </a>
              <a
                href="/register"
                className="p-2 bg-green-500 text-white rounded-md"
              >
                Register
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Display error message */}
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}

      {/* Display content based on active tab */}
      {activeTab === "movies" && (
        <>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search movies"
              className="p-2 border border-gray-300 rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
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

          {/* Movie list */}
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
                <button
                  onClick={() => {
                    setSelectedMovie(movie);
                    setShowModal(true); // Afficher la modale quand un film est sélectionné
                  }}
                  className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  Réserver
                </button>
              </div>
            ))}
          </div>

          {/* Create reservation */}
          {showModal && selectedMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md w-1/3">
                <h4 className="text-xl font-bold">{selectedMovie.title}</h4>
                <p className="text-gray-600">{selectedMovie.overview}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">Date de sortie :</p>
                  <p className="text-sm">{selectedMovie.release_date}</p>
                </div>
                <div className="mt-4">
                  <input
                    type="datetime-local"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <button
                  onClick={createReservation}
                  className="mt-4 p-2 bg-green-500 text-white rounded-md w-full"
                >
                  Confirmer la réservation
                </button>
                <button
                  onClick={() => setShowModal(false)} // Fermer la modale sans réserver
                  className="mt-2 p-2 bg-red-500 text-white rounded-md w-full"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "reservations" && (
        <>
          {/* Reservations list */}
          <div className="mt-4">
            <h3 className="text-2xl font-bold">Mes réservations</h3>
            {reservations.map((reservation) => (
              <div key={reservation._id} className="border p-4 rounded-md mt-2">
                <p>
                  <strong>Film:</strong> {reservation.movieId}
                </p>
                <p>
                  <strong>Date:</strong> {reservation.startTime}
                </p>
                <button
                  onClick={() => cancelReservation(reservation._id)}
                  className="mt-2 p-2 bg-red-500 text-white rounded-md"
                >
                  Annuler la réservation
                </button>
              </div>
            ))}
          </div>
        </>
      )}

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
