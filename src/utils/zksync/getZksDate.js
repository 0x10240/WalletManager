import axios from 'axios';

async function getZksDate(address) {
    try {
        let url = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" + address;
        const response = await axios.get(url);
        const receivedAtes = response.data.list.map(item => item.data.receivedAt);
        return receivedAtes;

    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getZksDate;