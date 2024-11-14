import React from "react";
import "./countryCard.css";

function CountryCard(props) {
  const onClickCountry = () => {
    props.setSelectedCountry(props.aCountry);
  };

  return (
    <div className="country-card" onClick={onClickCountry}>
      <h1>{props.aCountry?.name}</h1>
    </div>
  );
}

export default CountryCard;
