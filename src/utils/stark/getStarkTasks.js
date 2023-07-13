import axios from 'axios';

async function getStarkTasks(address) {
    try {
        let url = `https://voyager.online/api/contract/${address}/transfers?ps=50&p=1`;
        const response = await axios.get(url);
        let contractAddresses = response.data.items.map(item => item["transfer_to"]);
        const lastPage = response.data.lastPage;
        if (lastPage > 1) {
            for (let i = 2; i <= lastPage; i++) {
                const url = `https://voyager.online/api/contract/${address}/transfers?ps=50&p=${i}`;
                const response = await axios.get(url);
                let newcontractAddresses = response.data.items.map(item => item["transfer_to"]);
                contractAddresses = contractAddresses.concat(newcontractAddresses);
            }
        }
        contractAddresses = contractAddresses.map(item => item.toLowerCase());
        contractAddresses = [...new Set(contractAddresses)];
        return contractAddresses;

    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getStarkTasks;