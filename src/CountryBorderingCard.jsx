import React from "react";
import { useNavigate } from "react-router-dom";

function CountryBorderingCard(props) {
  const navigate = useNavigate();
  const onBorderingCountryClicked = () => {
    navigate(
      `/country/${props.oneCountry.countryCode}/${props.oneCountry.commonName}`
    );
  };
  return (
    <React.Fragment>
      <div class="card col-3">
        <button onClick={onBorderingCountryClicked}>
          <div class="card-body">
            <h5 class="card-title">{props.oneCountry.commonName}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
              {props.oneCountry.officialName}
            </h6>
            <p class="card-text">{props.oneCountry.region}</p>
            <p class="card-text">{props.oneCountry.countryCode}</p>
          </div>
        </button>
      </div>
    </React.Fragment>
  );
}
export default CountryBorderingCard;
