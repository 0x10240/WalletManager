import axios from 'axios';
import { ethers } from 'ethers';

async function getBaseERC20(address, apiKey) {
    try {
        let decimals = 6; // 代币的小数位数
        let usdbcUrl = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca&address=${address}&tag=latest&apikey=${apiKey}`;
        const response = await axios.get(usdbcUrl);
        const balance = parseFloat(response.data?.result / Math.pow(10, decimals)).toFixed(2);
        let usdcUrl = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&address=${address}&tag=latest&apikey=${apiKey}`;
        const response1 = await axios.get(usdcUrl);
        const balance1 = parseFloat(response1.data?.result / Math.pow(10, decimals)).toFixed(2);
        return {USDbC: balance, USDC: balance1};
    } catch (error) {
        console.error(error);
        return {USDbC: "Error", USDC: "Error"};
    }
}


export default getBaseERC20;
