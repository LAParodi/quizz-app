import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Dashboard/Home";
import LoginForm from "./pages/Auth/LoginForm";
import MyPolls from "./pages/Dashboard/MyPolls";
import SignUpForm from "./pages/Auth/SignUpForm";
import UserProvider from "./context/UserContext";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import VotedPolls from "./pages/Dashboard/VotedPolls";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<LoginForm />} />
          <Route path="/my-polls" exact element={<MyPolls />} />
          <Route path="/signup" exact element={<SignUpForm />} />
          <Route path="/create-poll" exact element={<CreatePoll />} />
          <Route path="/voted-polls" exact element={<VotedPolls />} />
          <Route path="/bookmarked-polls" exact element={<Bookmarks />} />
        </Routes>
      </Router>

      <Toaster toastOptions={{ className: "", style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isUserAuthenticated = !!localStorage.getItem("token");

  return isUserAuthenticated ? (
    <Navigate to={"/dashboard"} />
  ) : (
    <Navigate to={"/login"} />
  );
};
