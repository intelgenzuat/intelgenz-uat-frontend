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
        let params = [];
        if (props?.page) {
            params.push('page=' + props?.page);
        }
        if (props?.client_name) {
            params.push('client_name=' + encodeURIComponent(props?.client_name));
        }
        if (props?.curation) {
            params.push('curation=' + encodeURIComponent(props?.curation));
        }
        if (props?.query) {
            params.push('query=' + encodeURIComponent(props?.query));
        }
        if (props?.limit) {
            params.push('limit=' + props?.limit);
        }

        let BASE_URL = `${GET_THEATRE_INTEL_CARDS_LIST}?${params.join('&')}`;

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



