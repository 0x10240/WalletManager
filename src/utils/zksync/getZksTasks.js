import axios from 'axios';

async function getZksTasks(address) {
    try {
        let url = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" + address;
        let offset = 0;
        const response = await axios.get(url);
        const initDataLength = response.data.total;
        let contractAddresses = response.data.list.map(item => item.data.contractAddress);
        if (initDataLength > 100) {
            contractAddresses = [];
            const fromBlockNumber = response.data.list[0].blockNumber;
            const fromTxIndex = response.data.list[0].indexInBlock;
            while (true) {
                let url = `https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=${address}`;
                if (fromBlockNumber !== undefined && fromTxIndex !== undefined && offset !== 0) {
                    url += `&fromBlockNumber=${fromBlockNumber}&fromTxIndex=${fromTxIndex}&offset=${offset}`;
                }
                const response = await axios.get(url);
                let newcontractAddresses = response.data.list.map(item => item.data.contractAddress);
                contractAddresses = contractAddresses.concat(newcontractAddresses);
                const ListLength = response.data.list.length;
                if (ListLength === 100) {
                    offset += ListLength;
                } else {
                    break;
                }
            }
        }
        return contractAddresses;

    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getZksTasks;
