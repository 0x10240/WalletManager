import axios from 'axios';

async function getStarkBalances(address) {
    try {
        let url = `https://voyager.online/api/contract/${address}/balances`;
        const response = await axios.get(url);
        const eth_balance = parseFloat(response.data.ethereum.amount).toFixed(4);
        const usdc_balance = parseFloat(response.data['usd-coin'].amount).toFixed(2);
        const usdt_balance = parseFloat(response.data.tether.amount).toFixed(2);        
        const dai_balance = parseFloat(response.data.dai.amount).toFixed(2);
        return {eth_balance: eth_balance, usdc_balance: usdc_balance, usdt_balance: usdt_balance, dai_balance: dai_balance}
    } catch (error) {
        console.error(error);
        return {eth_balance: "Error", usdc_balance: "Error", usdt_balance: "Error", dai_balance: "Error"}
    }
}

export default getStarkBalances;