import axios from 'axios';

async function getZksTasks(address) {
    try {
        let url = `https://block-explorer-api.mainnet.zksync.io/transactions?address=${address}&limit=100&page=1`;
        const response = await axios.get(url);
        const pageValue = parseInt(response.data.meta.totalPages);
        const transactions = response.data.items;
        transactions.filter(item => item.from === address);
        let contractAddresses = transactions.map(item => item["to"]);
        let timestamps = transactions.map(item => Date.parse(item["receivedAt"]));
        if (pageValue > 1) {
            contractAddresses = [];
            timestamps = [];
            for (let i = 1; i <= pageValue; i++) {
                const url = `https://block-explorer-api.mainnet.zksync.io/transactions?address=${address}&limit=100&page=${i}`;
                const response = await axios.get(url);
                let newTransactions = response.data.items;
                newTransactions = newTransactions.filter(item => item.from === address);
                let newcontractAddresses = newTransactions.map(item => item["to"]);
                contractAddresses = contractAddresses.concat(newcontractAddresses);
                let newtimestamp = newTransactions.map(item => Date.parse(item["receivedAt"]));
                timestamps = timestamps.concat(newtimestamp);
            }
        }
        contractAddresses = contractAddresses.map(item => item.toLowerCase());
        return [contractAddresses, timestamps];

    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getZksTasks;
