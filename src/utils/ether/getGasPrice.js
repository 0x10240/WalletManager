import axios from "axios";

const ETHERSCAN_API_KEY = "F5DBSDZI2N6QF7XNCWRCX3TTM9A4SV79TM";

const getEthGasPrice = async () => {
    try {
        const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`;
        let response = await axios.get(url);
        const gasData = response.data.result;

        return parseFloat(gasData.ProposeGasPrice);
    } catch (e) {
        console.log(e);
        return "/";
    }
}

export default getEthGasPrice;
