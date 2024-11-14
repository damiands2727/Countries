import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import countryService from "./services/countryService";
import CountryCard from "./CountryCard";

function CountryList(props) {
  const [countryInfo, setCountryInfo] = useState({
    basicData: [],
    mapData: [],
  });
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCountry) {
      return;
    } else {
      const fetchCountryData = async () => {
        try {
          const response = await countryService.getCountryInfo(
            selectedCountry.countryCode,
            selectedCountry.name
          );
          console.log(response);

          props.setCountryData(response.data);
          navigate(
            `/country/${selectedCountry.countryCode}/${selectedCountry.name}`
          );
        } catch (err) {
          console.error(err);
        }
      };
      fetchCountryData();
    }
  }, [selectedCountry]);

  useEffect(() => {
    countryService
      .getCountries()
      .then(onGetCountriesSuccess)
      .catch(onGetCountriesError);
  }, []);

  const mapCountryCards = (aCountry, index) => {
    return (
      <CountryCard
        className="col-3"
        aCountry={aCountry}
        setSelectedCountry={setSelectedCountry}
        key={index + aCountry.countryCode}
      ></CountryCard>
    );
  };

  const mapData = (data) => {
    setCountryInfo((prevState) => {
      const newState = { ...prevState };
      newState.basicData = data;
      newState.mapData = data.map(mapCountryCards);
      return newState;
    });
  };

  const onGetCountriesSuccess = (response) => {
    mapData(response.data);
  };

  const onGetCountriesError = (response) => {
    console.log("error", response);
  };

  return (
    <React.Fragment>
      <div className="row">{countryInfo.mapData}</div>
    </React.Fragment>
  );
}

export default CountryList;
