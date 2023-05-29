import axios from 'axios';

async function getZksTasks(address) {
    try {
        let url = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" + address;
        const response = await axios.get(url);
        const contractAddresses = response.data.list.map(item => item.data.contractAddress);
        return contractAddresses;

    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getZksTasks;
