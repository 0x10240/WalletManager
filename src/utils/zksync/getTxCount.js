import axios from 'axios';

const RPC_MAP = {
    "ethereum": [
        // "https://cloudflare-eth.com",
        "https://eth.llamarpc.com",
        "https://rpc.ankr.com/eth",
        "https://1rpc.io/eth",
        "https://eth.rpc.blxrbdn.com",
        "https://eth-mainnet.public.blastapi.io"
    ],
    "optimism": "https://optimism-mainnet.public.blastapi.io",
    "arbitrum": "https://rpc.ankr.com/arbitrum",
    "polygon": "https://polygon-bor.publicnode.com",
    "bsc": "https://bscrpc.com"
};

async function getTxCount(address, network) {
    try {
        const rpcLinks = RPC_MAP[network];

        if (!rpcLinks) {
            return "Error: Invalid Network Name";
        }

        const randomIndex = Math.floor(Math.random() * rpcLinks.length);
        const rpcLink = rpcLinks[randomIndex];

        const response = await axios.post(rpcLink, {
            jsonrpc: "2.0",
            method: "eth_getTransactionCount",
            params: [address, "latest"],
            id: 1
        });

        const transactionCountHex = response.data.result;
        return parseInt(transactionCountHex, 16);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getTxCount;
