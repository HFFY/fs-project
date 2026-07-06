import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login is the main page of the project */}
        <Route path="/" element={<LoginPage />} />
        {/* Register screen: same view as login, creates a new user */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Home holds everything the app had until now */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
