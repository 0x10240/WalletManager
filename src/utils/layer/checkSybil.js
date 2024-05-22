import axios from "axios";

async function checkSybil(address) {
    try {
        // created by chainbird_eth
        let url =`https://l0.002022.xyz/sybil?address=${address}`;
        const response = await axios.get(url);
        let result = response.data;
        if (result === undefined || result === null || result === "") {
            result = false;
        }
        return {sybil: result}
    } catch (error) {
        console.error(error);
        return {sybil: "Error"}
    }
}

export default checkSybil;