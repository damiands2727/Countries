const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 5000;
const cors = require("cors");

app.use(cors());

app.get("/api/countries", async (req, res) => {
    try {
        const response = await axios.get("https://date.nager.at/api/v3/AvailableCountries");
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching countries", error);
        res.status(500).json({ error: "Failed to fetch countries" });
    }
});

app.get("/country-info/:countryCode/:countryName", async (req, res) => {
    const countryCode = req.params.countryCode.toUpperCase();
    const countryName = req.params.countryName.toUpperCase();

    try {
        const borderCountriesResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        const borderCountries = borderCountriesResponse.data.borders;

        const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
            country: countryName
        });
        const populationData = populationResponse.data.data.populationCounts;

        const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
            country: countryName
        });
        const flagUrl = flagResponse.data.data.flag;

        const countryDetails = {
            countryCode,
            countryName,
            borderCountries,
            populationData,
            flagUrl
        };

        res.json(countryDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching country details.');
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
