import { GET_THREAT_CARD } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";




export const getThreatCard = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_THREAT_CARD}`;

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response);
            }).catch(error => {
                onResponse(error?.data);
            });

    } catch (error) {

    }
}