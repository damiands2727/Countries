import React, { useEffect, useState } from "react";
import CountryBorderingCard from "./CountryBorderingCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./countryInfo.css";
import { useNavigate, useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CountryInfo(props) {
  const { countryCode, countryName } = useParams();
  const [borderingCountries, setBorderingCountries] = useState({
    countriesCards: [],
  });
  const [populationData, setPopulationData] = useState(null);
  const [countryDetails] = useState({ countryCode, countryName });
  const navigate = useNavigate();

  useEffect(() => {
    if (props.countryData.borderCountries) {
      const mappedBordering =
        props.countryData.borderCountries.map(mappingBordering);
      setBorderingCountries((prevState) => ({
        ...prevState,
        countriesCards: mappedBordering,
      }));
    }

    if (props.countryData.populationData) {
      setPopulationData(
        processPopulationData(props.countryData.populationData)
      );
    }
  }, [props.countryData]);

  const mappingBordering = (oneCountry) => (
    <CountryBorderingCard
      key={oneCountry.countryCode}
      onClick={() => onBorderingCountryClicked(oneCountry)}
      oneCountry={oneCountry}
    />
  );

  const onBorderingCountryClicked = (country) => {
    navigate(`/country/${country.countryCode}/${country.countryName}`);
  };

  const handleBackClick = () => {
    navigate(`/`);
  };

  const processPopulationData = (populationData) => {
    const labels = populationData.map((data) => data.year);
    const dataValues = populationData.map((data) => data.value);

    return {
      labels,
      datasets: [
        {
          label: "Population Over Time",
          data: dataValues,
          fill: false,
          borderColor: "#3b82f6",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="country-info-card">
      <img
        className="country-info-card__image"
        src={props.countryData.flagUrl}
        alt="country flag"
      />
      <h1 className="country-info-card__title">
        Country Name: {countryDetails.countryName}{" "}
      </h1>
      <div className="country-info-card__bordering-countries">
        {borderingCountries.countriesCards}
      </div>

      {populationData && (
        <div className="country-info-card__graph">
          <h2>Population Growth Over Time</h2>
          <Line data={populationData} />
        </div>
      )}

      <button
        className="country-info-card__back-button"
        onClick={handleBackClick}
      >
        Back to country list
      </button>
    </div>
  );
}

export default CountryInfo;
