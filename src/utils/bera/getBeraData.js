import axios from "axios";

const HoneyAddress = '0x7EeCA4205fF31f947EdBd49195a7A88E6A91161B';
const UsdcAddress = '0x6581e59A1C8dA66eD0D313a0d4029DcE2F746Cc5';
const rpcPool = [
    "https://artio.rpc.berachain.com",
    "https://rpc.ankr.com/berachain_testnet",
];

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

const getBeraInternalTx = (address) => {
    // 设置请求URL
    const url = `https://cdn.testnet.routescan.io/api/evm/all/address/${address}/internal-operations`;
    // 配置请求头和参数
    const config = {
        headers: {
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '""',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.171 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9'
        },
        params: {
            count: true,
            includedChainIds: 80085,
            limit: 100,
            sort: 'desc',
            toAddresses: '0x431820730dB5f004f9f4950DF418d23f0646477A'
        }
    };


    axios.get(url, config)
        .then(response => {
            console.log('Status Code:', response.status);
            console.log('Response Headers:', response.headers);
            console.log('Response Data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getBeraAllTx(address) {
    const url = `https://cdn.testnet.routescan.io/api/evm/all/transactions`;
    const config = {
        params: {
            count: true,
            includedChainIds: 80085,
            limit: 100,
            sort: 'desc',
            fromAddresses: address,
            toAddresses: address,
        }
    };

    try {
        const response = await axios.get(url, config);
        return response.data.items;
    } catch (error) {
        console.error(`get ${address} txs error: ${error}`);
        return [];
    }
}

async function getBeraErc20Tokens(address) {
    const url = `https://cdn.testnet.routescan.io/api/evm/all/address/${address}/erc20-holdings`;
    const config = {
        params: {
            includedChainIds: 80085,
            limit: 100
        }
    };

    try {
        const response = await axios.get(url, config);
        return response.data.items;
    } catch (error) {
        console.error(`get ${address} txs error: ${error}`);
        return [];
    }
}

async function getBeraData(address) {
    let beraBalance = await getBeraBalance(address)
    let usdcBalance = 0;
    let honeyBalance = 0;

    const tokens = await getBeraErc20Tokens(address)
    for (let token of tokens) {
        if (token.tokenAddress === UsdcAddress) {
            usdcBalance = (token.holderBalance / 10 ** 18).toFixed(4);
        }
        if (token.tokenAddress === HoneyAddress) {
            honeyBalance = (token.holderBalance / 10 ** 18).toFixed(4);
        }
    }

    let days = new Set();
    let weeks = new Set();
    let months = new Set();
    let contracts = new Set();

    let txs = await getBeraAllTx(address);

    for (let tx of txs) {
        let t = new Date(tx.timestamp)

        days.add(getDayNumber(t));
        weeks.add(getWeekNumber(t));
        months.add(getMonthNumber(t));

        if (tx.from.id === address) {
            contracts.add(tx.to.id);
        }
    }

    let last_tx = txs.length > 0 ? txs[0].timestamp : null;
    return {
        'bera': beraBalance,
        'usdc': usdcBalance,
        'honey': honeyBalance,
        'last_tx': last_tx,
        'tx_num': txs.length,
        'dayActivity': days.size,
        'weekActivity': weeks.size,
        'monthActivity': months.size,
        'contractActivity': contracts.size
    }
}

async function getERC20TokenBalance(walletAddress, contractAddress) {
    try {
        const randomIndex = Math.floor(Math.random() * rpcPool.length);
        const rpcLink = rpcPool[randomIndex];

        // 构建调用 ERC20 合约的 balanceOf 方法的数据字段
        const methodId = '0x70a08231'; // balanceOf 函数的方法 ID
        const paddedAddress = walletAddress.toLowerCase().replace('0x', '').padStart(64, '0');
        const data = methodId + paddedAddress;

        const response = await axios.post(rpcLink, {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [{
                to: contractAddress, // ERC20 代币合约地址
                data: data
            }, "latest"],
            id: 80085
        });

        let balance = response.data.result;
        return (parseInt(balance, 16) / 10 ** 18).toFixed(4); // 假设代币有 18 个小数位
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

async function getBeraBalance(walletAddress) {
    try {

        const randomIndex = Math.floor(Math.random() * rpcPool.length);
        const rpcLink = rpcPool[randomIndex];

        const response = await axios.post(rpcLink, {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 80085
        });

        let balance = response.data.result;
        return (parseInt(balance, 16) / 10 ** 18).toFixed(4);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}


export default getBeraData;

getERC20TokenBalance('0x431820730dB5f004f9f4950DF418d23f0646477A', HoneyAddress)