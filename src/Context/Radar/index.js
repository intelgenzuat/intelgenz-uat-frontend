import { GET_RADAR_DATA } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";


export const getRadarData = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_RADAR_DATA}?`;

        if (props?.client_name) {
            BASE_URL += 'client_name=' + props?.client_name + '&'
        }
        if (props?.severity) {
            BASE_URL += 'severity=' + props?.severity;
        }

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch(error => {
                onResponse(error?.data);
            });

    } catch (error) {

    }
}

