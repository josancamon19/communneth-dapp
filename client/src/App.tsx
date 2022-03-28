import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewChannel from "./pages/NewChannel";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Web3Provider } from "./contexts/Web3Context";
import { WakuContextProvider } from "./contexts/WakuContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <WakuContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/new-channel" element={<NewChannel />} />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </BrowserRouter>
        </WakuContextProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;
