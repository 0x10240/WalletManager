import axios from 'axios';

// async function getStarkBalances(address) {
//     try {
//         let url = `https://voyager.online/api/contract/${address}/balances`;
//         const response = await axios.get(url);
//         const eth_balance = response.data.find(item => item.symbol === "ETH")?.formattedBalance || 0;
//         const usdc_balance = response.data.find(item => item.symbol === "USDC")?.formattedBalance || 0;
//         const usdt_balance = response.data.find(item => item.symbol === "USDT")?.formattedBalance || 0;
//         const dai_balance = response.data.find(item => item.symbol === "DAI")?.formattedBalance || 0;
//         return { 
//             eth_balance: parseFloat(eth_balance).toFixed(4),
//             usdc_balance: parseFloat(usdc_balance).toFixed(2), 
//             usdt_balance: parseFloat(usdt_balance).toFixed(2), 
//             dai_balance: parseFloat(dai_balance).toFixed(2)
//         }
//     } catch (error) {
//         console.error(error);
//         return {eth_balance: "Error", usdc_balance: "Error", usdt_balance: "Error", dai_balance: "Error"}
//     }
// }

async function getStarkBalances(address) {
    const apiKey = "8b08b28c-09fa-4ad9-889a-7c6d60262a44";

    const config = {
        headers: {
            'Ok-Access-Key': apiKey
        }
    };
    
    const url = `https://www.oklink.com/api/v5/explorer/address/token-balance-starknet?address=${address}&chainShortName=starknet&protocolType=token_20`;

    try {
        const response = await axios.get(url, config);
        const tokens = response.data.data.tokenList;
        console.log(response.data.data);
        let eth_balance = 0, usdc_balance = 0, usdt_balance = 0, dai_balance = 0;

        eth_balance = tokens.find(token => token.symbol === 'ETH')?.holdingAmount || 0;
        usdc_balance = tokens.find(token => token.symbol === 'USDC')?.holdingAmount || 0;
        usdt_balance = tokens.find(token => token.symbol === 'USDT')?.holdingAmount || 0;
        dai_balance = tokens.find(token => token.symbol === 'DAI')?.holdingAmount || 0;

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