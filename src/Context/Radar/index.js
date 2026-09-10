import { GET_RADAR_DATA,GET_RADAR_DATA_LIST } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";


export const getRadarData = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_RADAR_DATA}?`;

        if (props?.client_name) {
            BASE_URL += 'client_name=' + props?.client_name + '&'
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
export const getRadarSinglelist = (props) => onResponse => {
    try {
        let BASE_URL = props?.id
            ? `${GET_RADAR_DATA_LIST}/${props?.id}`
            : `${GET_RADAR_DATA_LIST}`;

        if (props?.client_name) {
            BASE_URL += `?client_name=${encodeURIComponent(props?.client_name)}`;
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

