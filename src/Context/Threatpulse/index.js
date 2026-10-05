import { GET_THREAT_PULSE_LIST, GET_THREAT_PULSE_DETAILED_REPORT } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";




export const getThreatPulseList = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_THREAT_PULSE_LIST}?`;
        if (props?.page) {
            BASE_URL += 'page=' + props?.page;
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




export const getThreatPulseDetailedReport = (props) => onResponse => {
    try {
        let BASE_URL = props?.id || props?.actor_id
            ? `${GET_THREAT_PULSE_DETAILED_REPORT}/${props?.id || props?.actor_id}`
            : `${GET_THREAT_PULSE_DETAILED_REPORT}`;

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch(error => {
                onResponse(error?.data);
            });

    } catch (error) {

    }
}



