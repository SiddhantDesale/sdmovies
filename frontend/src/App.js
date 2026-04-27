import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./components/MovieList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<MovieList />} />

        {/* Language routes (clean names) */}
        <Route path="/language/:lang" element={<MovieList />} />

        {/* Genre routes */}
        <Route path="/genre/:genre" element={<MovieList />} />

        {/* Webseries routes */}
        <Route path="/webseries" element={<MovieList />} />
      </Routes>
    </Router>
  );
}

export default App;
