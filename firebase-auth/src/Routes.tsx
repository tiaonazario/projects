import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthRoute } from "./components/AuthRoute"
import { Home } from "./pages/Home"
import { SignIn } from "./pages/SignIn"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};
