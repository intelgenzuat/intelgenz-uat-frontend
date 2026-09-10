import { GET_MALWARE_INTEL_CARDS_LIST, GET_MALWARE_INTEL_CARDS_DETAILS, GET_THEATRE_INTEL_CARDS_LIST, GET_THEATRE_INTEL_CARDS_DETAILS } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";




export const getMalwareIntelCardsList = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_MALWARE_INTEL_CARDS_LIST}?`;
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


export const getMalwareIntelCardDetailedView = (props) => onResponse => {
    try {
        let BASE_URL = props?.id
            ? `${GET_MALWARE_INTEL_CARDS_DETAILS}/${props?.id}`
            : `${GET_MALWARE_INTEL_CARDS_DETAILS}`;

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch(error => {
                onResponse(error?.data);
            });

    } catch (error) {

    }
}



export const getTheatreIntelCardsList = (props) => onResponse => {
    try {
        let BASE_URL = `${GET_THEATRE_INTEL_CARDS_LIST}?`;

        if (props?.query) {
            BASE_URL += 'query=' + props?.query + '&'
        }
        if (props?.limit) {
            BASE_URL += 'limit=' + props?.limit;
        }
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


export const getTheatreIntelCardDetailedView = (props) => onResponse => {
    try {
        let BASE_URL = props?.id || props?.actor_id
            ? `${GET_THEATRE_INTEL_CARDS_DETAILS}/${props?.id || props?.actor_id}`
            : `${GET_THEATRE_INTEL_CARDS_DETAILS}`;

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch(error => {
                onResponse(error?.data);
            });

    } catch (error) {

    }
}



