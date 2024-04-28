import axios from 'axios';
import { ethers } from 'ethers';

async function getScrollERC20(address) {
    try {
        let decimals = 6; // 代币的小数位数
        let usdtUrl = `https://api.scrollscan.com/api?module=account&action=tokenbalance&contractaddress=0xf55bec9cafdbe8730f096aa55dad6d22d44099df&address=${address}`;
        const response = await axios.get(usdtUrl);
        const balance = parseFloat(response.data?.result / Math.pow(10, decimals)).toFixed(2);
        let usdcUrl = `https://api.scrollscan.com/api?module=account&action=tokenbalance&contractaddress=0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4&address=${address}`;
        const response1 = await axios.get(usdcUrl);
        const balance1 = parseFloat(response1.data?.result / Math.pow(10, decimals)).toFixed(2);
        return {USDT: balance, USDC: balance1};
    } catch (error) {
        console.error(error);
        return {USDT: "Error", USDC: "Error"};
    }
}


export default getScrollERC20;
