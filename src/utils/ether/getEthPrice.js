import axios from "axios";

const ETHERSCAN_API_KEY = "F5DBSDZI2N6QF7XNCWRCX3TTM9A4SV79TM";

const getEthPrice = async () => {
    try {
        const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`;
        let response = await axios.get(url);
        let ethusd = Number(response.data.result.ethusd);
        return parseFloat(ethusd.toFixed(2));
    } catch (e) {
        console.log(e);
        return "/";
    }
}

export default getEthPrice