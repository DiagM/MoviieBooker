import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoviesList from "./components/MoviesList";
import Login from "./components/login";
import Register from "./components/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
