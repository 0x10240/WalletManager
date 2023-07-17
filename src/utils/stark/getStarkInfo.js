import axios from "axios";

async function getStarkInfo(address) {
    try {
        let url = `https://voyager.online/api/contract/${address}`;
        const response = await axios.get(url);
        const deployed_at_timestamp = response.data.creationTimestamp;
        const wallet_type = response.data?.classAlias;
        let stark_id = response.data.contractAlias;
        if (stark_id === null) {
            stark_id = "/"
        }
        return {wallet_type: wallet_type, deployed_at_timestamp: deployed_at_timestamp, stark_id: stark_id}
    } catch (error) {
        console.error(error);
        return {wallet_type: "Error", deployed_at_timestamp: "Error", stark_id: "Error"}
    }
}

export default getStarkInfo;
