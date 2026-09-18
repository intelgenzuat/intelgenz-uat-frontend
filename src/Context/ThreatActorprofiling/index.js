import { GET_THREAT_PROFILING_TABLE, GET_THREAT_ACTOR_BY_SEARCH,GET_THREAT_ACTOR_BY_TECHNIQUES } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";


export const getThreatActorProfilingtable = (props) => (onResponse) => {
    try {
        let BASE_URL = `${GET_THREAT_PROFILING_TABLE}?`;


        if (props?.client_name) {
            BASE_URL += 'client_name=' + encodeURIComponent(props?.client_name) + '&'
        }
        if (props?.capability !== undefined) {
            BASE_URL += 'capability=' + props?.capability + '&';
        }
        if (props?.intent !== undefined) {
            BASE_URL += 'intent=' + props?.intent + '&';
        }
        if (props?.opportunity !== undefined) {
            BASE_URL += 'opportunity=' + props?.opportunity + '&';
        }
        BASE_URL = BASE_URL.replace(/[&?]$/, '');

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch((error) => {
                onResponse(error?.response?.data || error?.data || null);
            });

    } catch (error) {
        console.error("getThreatActorProfilingtable error", error);
    }
};

export const getThreatActorProfiling = (props) => (onResponse) => {
    try {
        let BASE_URL = `${GET_THREAT_ACTOR_BY_SEARCH}/search?`;


        if (props?.query) {
            BASE_URL += 'query=' + props?.query + '&'
        }
        if (props?.limit) {
            BASE_URL += 'limit=' + props?.limit;
        }



        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch((error) => {
                onResponse(error?.response?.data || error?.data || null);
            });

    } catch (error) {
        console.error("getThreatActorProfiling error", error);
    }
};
export const getThreatActorByTechniques = (props) => (onResponse) => {
    try {
        let BASE_URL = `${GET_THREAT_ACTOR_BY_TECHNIQUES}?`;

        if (props?.technique_ids) {
            const list = Array.isArray(props.technique_ids)
                ? props.technique_ids
                : typeof props.technique_ids === 'string'
                ? props.technique_ids.split(',')
                : [props.technique_ids];

            list.forEach((item) => {
                const id = typeof item === 'object' ? item?.technique_id : item;
                if (id && typeof id === 'string') {
                    const cleanId = id.trim();
                    if (cleanId) {
                        BASE_URL += 'technique_ids=' + encodeURIComponent(cleanId) + '&';
                    }
                }
            });
        }

        const clientName = props?.client_name || props?.client;
        if (clientName) {
            BASE_URL += 'client_name=' + encodeURIComponent(clientName) + '&';
        }

        if (props?.capability !== undefined) {
            BASE_URL += 'capability=' + props.capability + '&';
        }
        if (props?.intent !== undefined) {
            BASE_URL += 'intent=' + props.intent + '&';
        }
        if (props?.opportunity !== undefined) {
            BASE_URL += 'opportunity=' + props.opportunity + '&';
        }

        BASE_URL = BASE_URL.replace(/[&?]$/, '');
        console.log("getThreatActorByTechniques URL:", BASE_URL);

        axiosInstance.get(BASE_URL)
            .then((response) => {
                onResponse(response?.data);
            }).catch((error) => {
                onResponse(error?.response?.data || error?.data || null);
            });

    } catch (error) {
        console.error("getThreatActorByTechniques error", error);
    }
};




