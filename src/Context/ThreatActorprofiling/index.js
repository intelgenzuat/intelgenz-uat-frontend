import {  GET_THREAT_ACTOR_BY_TECHNIQUES, POST_THREAT_MAPPING } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";





export const getThreatActorProfiling = (props) => (onResponse) => {
    try {
        let BASE_URL = `${GET_THREAT_ACTOR_BY_TECHNIQUES}?`;

        if (props?.technique_ids) {
            BASE_URL += 'technique_ids=' + props?.technique_ids + '&';
        }

        if (props?.client_name) {
            BASE_URL += 'client_name=' + props?.client_name + '&';
        }

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch((error) => {
                onResponse(error?.response?.data || error?.data || null);
            });

    } catch (error) {

    }
};



