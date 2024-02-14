import axios from "axios";

async function getStarkId(address) {
    try {
        const decimalValue = BigInt(address);
        const stark_id_url =`https://api.starknet.id/addr_to_full_ids?addr=${decimalValue}`;
        const response = await axios.get(stark_id_url);
        console.log(response);
        let stark_id = response.data?.full_ids[0]?.domain;
        if (stark_id === null) {
            stark_id = "/"
        }
        return {stark_id: stark_id}
    } catch (error) {
        console.error(error);
        return {stark_id: "Error"}
    }
}

export default getStarkId;
