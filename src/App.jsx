import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import CountryInfo from "./CountryInfo";
import CountryList from "./CountryList";

function App() {
  const [countryData, setCountryData] = useState(null);

  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark"
        aria-label="Fourth navbar example"
      >
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link to="/" className="nav-link px-2 text-white link-button">
                  List of countries
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/country/:countryCode/:countryName"
          element={<CountryInfo countryData={countryData} />}
        />
        <Route
          path="/"
          element={<CountryList setCountryData={setCountryData} />}
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
