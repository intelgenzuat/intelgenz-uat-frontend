import { GET_THEAT_TTP, POST_DEFENDTHEAT } from "../../Api/api";
import axiosInstance from "../../Api/Axiosinstance/Axiosinstance";




export const getThreatTTP = (props) => onResponse => {
      try {
        let BASE_URL = `${GET_THEAT_TTP}search?`;

        if (props?.query) {
            BASE_URL += 'query=' + props?.query + '&'
        }
        if (props?.limit) {
            BASE_URL += 'limit=' + props?.limit;
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



export const sendThreatDefend = (props) => (onResponse) => {
    try {
        let BASE_URL = `${POST_DEFENDTHEAT}?` ;
      
        
        axiosInstance.post(BASE_URL, props)
            .then((response) => {
                onResponse(response);
            })
            .catch((err) => {
                onResponse(err.response);
            });
    } catch (error) { }
};