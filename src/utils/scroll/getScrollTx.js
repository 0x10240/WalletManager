import axios from 'axios';
import { ethers} from 'ethers';

function getDayNumber(d) {
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + "W" + weekNo;
}

function getMonthNumber(d) {
    return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1);
}

function getScrollLastTX(lastTxDatetime) {
    const date = new Date(lastTxDatetime);
    const offset = 8;
    const utc8Date = new Date(date.getTime() + offset * 3600 * 1000);
    const now = new Date();
    const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
    const diff = utc8Now - utc8Date;
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
        return `${diffInDays} 天前`
    } else if (diffInHours > 0) {
        return `${diffInHours} 小时前`
    } else {
        return "刚刚"
    }
}

const getEthPrice = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
        }
        let response = await axios.request(options)
        return response.data['USD']
    } catch (e) {
        console.log(e)
        return "/"
    }

}

async function getScrollTx(address) {
    try {
        let days = new Set();
        let weeks = new Set();
        let months = new Set();
        address = address.toLowerCase();
        let url = `https://blockscout.scroll.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=9999999999&page=1&offset=9999&sort=asc`;
        const response = await axios.get(url);
        let transactions = response.data.result;
        transactions = transactions.filter(item => item.from === address);
        let contractAddresses = transactions.map(item => item.to);
        contractAddresses = [...new Set(contractAddresses)];
        let receivedAtes = transactions.map(item => new Date(item.timeStamp * 1000));
        const lastTxDatetime = receivedAtes[receivedAtes.length - 1];
        receivedAtes.forEach(item => {
            days.add(getDayNumber(item));
            weeks.add(getWeekNumber(item));
            months.add(getMonthNumber(item));
        });
        let fee = 0n;
        transactions.forEach(item => {
            const gasPrice = BigInt(item.gasPrice);
            const gasUsed = BigInt(item.gasUsed);
            const itemFee = gasPrice * gasUsed;
            fee += itemFee;
        });
        const feeEth = ethers.formatEther(fee);
        const exchangeAmount = transactions.reduce((acc, item) => acc + parseFloat(ethers.formatEther(item.value)), 0);
        const ethPrice = await getEthPrice();
        const toytalExchangeAmount = exchangeAmount * ethPrice;
        const tx = transactions.length;
        const scroll_last_tx = getScrollLastTX(lastTxDatetime);
        const dayActivity = days.size;
        const weekActivity = weeks.size;
        const monthActivity = months.size;
        const contractActivity = contractAddresses.length;
        // console.log(tx, scroll_last_tx, dayActivity, weekActivity, monthActivity, contractActivity, feeEth, toytalExchangeAmount);
        return {
            scroll_tx_amount: tx,
            scroll_last_tx: scroll_last_tx, 
            dayActivity: dayActivity, 
            weekActivity: weekActivity, 
            monthActivity: monthActivity, 
            contractActivity: contractActivity, 
            totalFee: parseFloat(feeEth).toFixed(4),
            totalExchangeAmount: parseFloat(toytalExchangeAmount).toFixed(2),
        };
    } catch (error) {
        console.error(error);
        return {
            scroll_tx_amount: "Error", 
            scroll_last_tx: "Error", 
            dayActivity: "Error", 
            weekActivity: "Error", 
            monthActivity: "Error", 
            contractActivity: "Error",
            totalFee: "Error",
            totalExchangeAmount: "Error",
        };
    }
}

export default getScrollTx;
