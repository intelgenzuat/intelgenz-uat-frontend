import { GET_THREAT_PULSE_LIST, GET_THREAT_PULSE_DETAILED_REPORT } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";




export const getThreatPulseList = (props) => onResponse => {
    try {
        let params = [];
        if (props?.client_name) {
            params.push('client_name=' + encodeURIComponent(props?.client_name));
        }
        if (props?.page) {
            params.push('page=' + props?.page);
        }
        params.push('view=' + encodeURIComponent(props?.view || 'all'));
        if (props?.curation) {
            params.push('curation=' + encodeURIComponent(props?.curation));
        }
        if (props?.query) {
            params.push('query=' + encodeURIComponent(props?.query));
        }
        if (props?.limit) {
            params.push('limit=' + props?.limit);
        }

        let queryString = params.length > 0 ? `?${params.join('&')}` : '';
        let BASE_URL = `${GET_THREAT_PULSE_LIST}${queryString}`;

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



