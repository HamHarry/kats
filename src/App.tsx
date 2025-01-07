import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./HomePage/HomePage";
import { Suspense } from "react";
import "./App.css";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="home" element={<Layout />}>
          <Route path="" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
