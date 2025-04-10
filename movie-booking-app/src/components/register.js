import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // reset avant envoi
    try {
      await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message === "User already exists") {
          setErrorMessage("Un utilisateur avec cet email existe déjà.");
        } else {
          setErrorMessage(data.message || "Erreur lors de l'inscription.");
        }
      } else {
        setErrorMessage("Erreur de connexion au serveur.");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Inscription</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
