import { WS_BASE_URL, HTTP_BASE_URL } from '../../Api/websocket/sockect';
import { CHAT_WS_ENDPOINT, CHAT_HTTP_ENDPOINT } from '../../Api/api';

export const chatWsUrl = `${WS_BASE_URL}${CHAT_WS_ENDPOINT}`;
export const chatHttpUrl = `${HTTP_BASE_URL}${CHAT_HTTP_ENDPOINT}`;