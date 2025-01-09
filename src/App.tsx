import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import HomePage from "./homepage/HomePage";
import { Suspense } from "react";
import "./App.css";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
