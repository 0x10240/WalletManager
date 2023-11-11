import axios from 'axios';

async function getStarkBalances(address) {
    try {
        let url = `https://voyager.online/api/contract/${address}/balances`;
        const response = await axios.get(url);
        const eth_balance = response.data.find(item => item.symbol === "ETH")?.formattedBalance || 0;
        const usdc_balance = response.data.find(item => item.symbol === "USDC")?.formattedBalance || 0;
        const usdt_balance = response.data.find(item => item.symbol === "USDT")?.formattedBalance || 0;
        const dai_balance = response.data.find(item => item.symbol === "DAI")?.formattedBalance || 0;
        return { 
            eth_balance: parseFloat(eth_balance).toFixed(4),
            usdc_balance: parseFloat(usdc_balance).toFixed(2), 
            usdt_balance: parseFloat(usdt_balance).toFixed(2), 
            dai_balance: parseFloat(dai_balance).toFixed(2)
        }
    } catch (error) {
        console.error(error);
        return {eth_balance: "Error", usdc_balance: "Error", usdt_balance: "Error", dai_balance: "Error"}
    }
}

export default getStarkBalances;