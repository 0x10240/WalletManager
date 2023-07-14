import axios from "axios";

async function getStarkInfo(address) {
    try {
        let url = `https://voyager.online/api/contract/${address}`;
        const response = await axios.get(url);
        const deployed_at_timestamp = response.data.creationTimestamp;
        const wallet_type = response.data.classAlias;
        return {wallet_type: wallet_type, deployed_at_timestamp: deployed_at_timestamp}
    } catch (error) {
        console.error(error);
        return {proxy: "Error", deployed_at_timestamp: "Error"}
    }
}

export default getStarkInfo;
