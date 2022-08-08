import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Manage from "./components/Manage";
import Redirect from "./components/Redirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Redirect />} />
        <Route path="/manage" element={<Manage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
