import axios from "axios";

const countryService = {
    getCountries: () => {
        return axios.get("/api/countries");
    },

    getCountryInfo: (countryCode, countryName) => {
        console.log("countryCode, countryName", countryCode, countryName);

        return axios.get(`country-info/${countryCode}/${countryName}`);
    }
};

export default countryService;
