import axios from 'axios';
import { ethers } from 'ethers';

async function getScrollInfo(address) {
    try {
        let url = `https://api.scrollscan.com/api?module=account&action=balance&address=${address}`;
        const response = await axios.get(url);
        const balance = parseFloat(ethers.formatEther(response.data.result)).toFixed(4);
        return {balance: balance};
    } catch (error) {
        console.error(error);
        return {balance: "Error"};
    }
}

export default getScrollInfo;
