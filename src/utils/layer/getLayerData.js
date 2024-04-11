import axios from "axios";


let L0Data = {}

const chainMap = {
    'ethereum': 101,
    'optimism': 111,
    'arbitrum': 110,
    'avalanche': 106,
    'base': 184,
    'polygon': 109,
    'bsc': 102,
    'metis': 151,
    'fantom': 112,
    'aptos': 108,
    'other': -1
}

function getMonthNumber(d) {
    return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1);
}

async function getLayerData(address) {
    const url = `http://l0.002022.xyz/layerzero_data/?address=${address}`
    let response = await axios.get(url);

    Object.keys(chainMap).forEach(key => {
        L0Data[key] = 0;
    });

    L0Data['address'] = address

    let lastTxTimeStamp = 0
    let months = new Set();

    response.data.messages.forEach(tx => {
        const srcChainKey = tx.srcChainKey;
        if (!chainMap[srcChainKey]) {
            L0Data['other']++
        }

        L0Data[srcChainKey]++;

        const created = tx.created;

        // 更新最大created值
        if (created > lastTxTimeStamp) {
            lastTxTimeStamp = created;
        }

        months.add(getMonthNumber(new Date(created * 1000)));
    });


    L0Data["total"] = response.data.count;
    L0Data["last_tx_time"] = new Date(lastTxTimeStamp * 1000);
    L0Data["active_months"] = months.size;

    return L0Data;
}

export default getLayerData
