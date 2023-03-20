import axios from "axios";
const carService = {
    endpoint: "endpointHere"
}

carService.getCars = () => {
    const config = {
        url: "urlHere"
    };

    return axios(config);
};


export default carService;