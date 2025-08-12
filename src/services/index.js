import React from "react";
import {fetchInstance} from "./fetch-instance";

let CLIENT_API_URL = "https://clientapi.septrader.com/api/";
export let API_PREFIX = '';


class AssociateServices extends React.Component {

    setPrefix = (prefix) => {
        CLIENT_API_URL = "https://clientapi.osugczihbllcmgbzjpjvqhplpbwzfxsipkmtrvaiblvykvuqgnvvnzfxdmyi.com/api/" + prefix // demo/binary
    }


    checkDirectAuth = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/auth/check", "POST", instance);

    getConfs = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/futures/confs/index", "POST", instance);
    getLimits = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/futures/future-limits/index", "POST", instance);
    getMyBets = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/up-down/my-bets", "POST", instance);
    getLastResults = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/up-down/last-results", "POST", instance);
    getHighWinners = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/up-down/high-winners", "POST", instance);
    getHistory = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/up-down/history", "POST", instance);

    switchAccount = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/user/switch", "POST", instance);

    depositDemo = (instance) => fetchInstance(CLIENT_API_URL + API_PREFIX + "binary/user/deposit-demo", "POST", instance);

}

const associateServices = new AssociateServices();
export default associateServices;
