import axios from "axios";

async function getStarkBridge(address) {
    try {
        let d_eth_amount = 0;
        let d_eth_count = 0;
        let w_eth_amount = 0;
        let w_eth_count = 0;
        let d_usdc_amount = 0;
        let d_usdc_count = 0;
        let w_usdc_amount = 0;
        let w_usdc_count = 0;
        let d_usdt_amount = 0;
        let d_usdt_count = 0;
        let w_usdt_amount = 0;
        let w_usdt_count = 0;
        
        let url = `https://voyager.online/api/contract/${address}/bridgeTransactions?ps=50&p=1`;
        const response = await axios.get(url);
        const list = response.data.items;
        for (let i = 0; i < list.length; i++) {
            if (list[i].type == "1") {
                if (list[i].token_id == "0") {
                    d_eth_count += 1;
                    d_eth_amount += parseInt(list[i].amount, 16) / 10 ** 18;
                }
                else if (list[i].token_id == "2") {
                    d_usdc_count += 1;
                    d_usdc_amount += parseInt(list[i].amount, 16) / 10 ** 6;
                }
                else if (list[i].token_id == "3") {
                    d_usdt_count += 1;
                    d_usdt_amount += parseInt(list[i].amount, 16) / 10 ** 6;
                }
            }
            if (list[i].type == "2") {
                if (list[i].token_id == "0") {
                    w_eth_count += 1;
                    w_eth_amount += parseInt(list[i].amount, 16) / 10 ** 18;
                } 
                else if (list[i].token_id == "2") {
                    w_usdc_count += 1;
                    w_usdc_amount += parseInt(list[i].amount, 16) / 10 ** 6;
                }
                else if (list[i].token_id == "3") {
                    w_usdt_count += 1;
                    w_usdt_amount += parseInt(list[i].amount, 16) / 10 ** 6;
                }
            }
        }
        return {
            d_eth_amount: d_eth_amount.toFixed(3), d_eth_count: d_eth_count,
            d_usdc_amount: d_usdc_amount, d_usdc_count: d_usdc_count,
            d_usdt_amount: d_usdt_amount, d_usdt_count: d_usdt_count,
            d_dai_amount: "/", d_dai_count: "/",
            d_wbtc_amount: "/",d_wbtc_count: "/",
            w_eth_amount: w_eth_amount, w_eth_count: w_eth_count,
            w_usdc_amount: w_usdc_amount, w_usdc_count: w_usdc_count,
            w_usdt_amount: w_usdt_amount, w_usdt_count: w_usdt_count,
            w_dai_amount: "/", w_dai_count: "/",
            w_wbtc_amount: "/", w_wbtc_count: "/",
            total_deposit_count: d_eth_count + d_usdc_amount, total_widthdraw_count: w_eth_count + w_usdc_count
        }
    } catch (error) {
        console.error(error);
        return {
            "d_eth_amount": "Error",
            "d_eth_count": "Error",
            "d_usdc_amount": "Error",
            "d_usdc_count": "Error",
            "d_usdt_amount": "Error",
            "d_usdt_count": "Error",
            "d_dai_amount": "Error",
            "d_dai_count": "Error",
            "d_wbtc_amount": "Error",
            "d_wbtc_count": "Error",
            "w_eth_amount": "Error",
            "w_eth_count": "Error",
            "w_usdc_amount": "Error",
            "w_usdc_count": "Error",
            "w_usdt_amount": "Error",
            "w_usdt_count": "Error",
            "w_dai_amount": "Error",
            "w_dai_count": "Error",
            "w_wbtc_amount": "Error",
            "w_wbtc_count": "Error",
            "total_deposit_count": "Error",
            "total_widthdraw_count": "Error"
        }
    }
}

export default getStarkBridge;
