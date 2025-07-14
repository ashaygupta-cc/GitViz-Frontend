import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import RepositoryDetail from "./pages/RepositoryDetail";
import Sidebar from "./components/Layout/Sidebar";
import useUserStore from "./stores/userStore";

function App() {
  const { repositories } = useUserStore();

  // First repo's owner's username, or empty string if missing
  const username = repositories?.[0]?.owner?.login || "";

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="user/:username" element={<UserProfile />} />
        <Route
          path="user/:username/repo/:repoName"
          element={
            <div className="flex">
              <Sidebar repositories={repositories} username={username} />
              <div className="flex-1">
                <RepositoryDetail />
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
