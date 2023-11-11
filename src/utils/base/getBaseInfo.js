import axios from 'axios';
import { ethers } from 'ethers';

async function getBaseInfo(address, apiKey) {
    try {
        let url = `https://api.basescan.org/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
        const response = await axios.get(url);
        const balance = parseFloat(ethers.formatEther(response.data.result)).toFixed(4);
        return {balance: balance};
    } catch (error) {
        console.error(error);
        return {balance: "Error"};
    }
}

export default getBaseInfo;
