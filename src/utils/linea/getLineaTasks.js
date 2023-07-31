import axios from 'axios';

async function getLineaTasks(address, apiKey) {
    try {
        address = address.toLowerCase();
        let url = `https://api.lineascan.build/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${apiKey}`;
        const response = await axios.get(url);
        let transactions = response.data.result;
        // console.log(transactions);
        if (transactions.length === 0) {
            return "No transactions";
        }
        transactions = transactions?.filter(item => item.from === address);
        let contractAddresses = transactions?.map(item => item.to);
        contractAddresses = contractAddresses?.map(item => item.toLowerCase());
        let timestamps = transactions?.map(item => item.timeStamp * 1000);
        return [contractAddresses, timestamps];
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getLineaTasks;
