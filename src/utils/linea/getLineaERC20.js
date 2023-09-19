import axios from 'axios';
import { ethers } from 'ethers';

async function getLineaERC20(address, apiKey) {
    try {
        let busdUrl = `https://api.lineascan.build/api?module=account&action=tokenbalance&contractaddress=0x7d43AABC515C356145049227CeE54B608342c0ad&address=${address}&tag=latest&apikey=${apiKey}`;
        const response = await axios.get(busdUrl);
        const balance = parseFloat(ethers.formatEther(response.data?.result)).toFixed(2);
        let usdcUrl = `https://api.lineascan.build/api?module=account&action=tokenbalance&contractaddress=0x176211869cA2b568f2A7D4EE941E073a821EE1ff&address=${address}&tag=latest&apikey=${apiKey}`;
        const response1 = await axios.get(usdcUrl);
        const balance1 = parseFloat(response1.data?.result / 1000000).toFixed(2);
        return {BUSD: balance, USDC: balance1};
    } catch (error) {
        console.error(error);
        return {BUSD: "Error", USDC: "Error"};
    }
}

export default getLineaERC20;
