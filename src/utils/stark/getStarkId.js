import axios from "axios";

async function getStarkId(address) {
    try {
        const decimalValue = BigInt(address);
        let stark_id_url =`https://api.starknet.id/addr_to_full_ids?addr=${decimalValue}`;
        const response = await axios.get(stark_id_url);
        let stark_id = response.data?.full_ids[0]?.domain;
        if (stark_id === null || stark_id === undefined) {
            stark_id_url = `https://api.starknet.id/addr_to_external_domains?addr=${decimalValue}`
            const response = await axios.get(stark_id_url);
            // console.log(response.data?.domains);
            stark_id = response.data?.domains[0];
            if (stark_id === null || stark_id === undefined) { stark_id = "/" }
        }
        return {stark_id: stark_id}
    } catch (error) {
        console.error(error);
        return {stark_id: "Error"}
    }
}

export default getStarkId;
