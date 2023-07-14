import axios from "axios";

async function getStarkTx(address) {
    try {
        let url = `https://voyager.online/api/txns?to=${address}&ps=50&p=1&type=null`;
        const response = await axios.get(url);
        const lastPage = response.data.lastPage;
        const timestamp = response.data.items[0].timestamp;
        const date = new Date(timestamp * 1000);
        const offset = 8;
        const utc8Date = new Date(date.getTime() + offset * 3600 * 1000);
        const now = new Date();
        const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
        const diff = utc8Now - utc8Date;
        const diffInHours = Math.floor(diff / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        let diffTime = ""
        if (diffInDays > 0) {
            diffTime = `${diffInDays} 天前`
        } else if (diffInHours > 0) {
          diffTime = `${diffInHours} 小时前`
        } else {
          diffTime = "刚刚"
        }
        let txns = 0;
        for (let i = 1; i <= lastPage; i++) {
          const url = `https://voyager.online/api/txns?to=${address}&ps=50&p=${i}&type=null`;
          const response = await axios.get(url);
          const list = response.data.items;
          txns += list.length;
        }
        return {tx: txns, stark_latest_tx_time: diffTime}
    } catch (error) {
        console.error(error);
        return {tx: "Error", stark_latest_tx_time: "Error"}
    }
}

export default getStarkTx;
