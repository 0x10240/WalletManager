import axios from 'axios';
import { ethers } from 'ethers';

async function getLineaERC20(address, apiKey) {
    try {
        let busdUrl = `https://api.lineascan.build/api?module=account&action=tokenbalance&contractaddress=0x7d43AABC515C356145049227CeE54B608342c0ad&address=${address}&tag=latest&apikey=${apiKey}`;
        const response = await axios.get(busdUrl);
        const balance = parseFloat(ethers.formatEther(response.data?.result)).toFixed(2);
        return {BUSD: balance};
    } catch (error) {
        console.error(error);
        return {BUSD: "Error"};
    }
}

export default getLineaERC20;
