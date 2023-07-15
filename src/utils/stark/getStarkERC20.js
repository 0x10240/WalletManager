import axios from "axios";

async function getStarkERC20(address) {
    try {
    const url = "https://starkscan.stellate.sh/";
    const payload = {
      query: "query ERC20BalancesByOwnerAddressTableQuery($input: ERC20BalancesByOwnerAddressInput!) {\n  erc20BalancesByOwnerAddress(input: $input) {\n    id\n    contract_address\n    balance_display\n  }\n}",
      variables: {
        input: {
          owner_address: address
        }
      }
    };
    
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(payload)
    };
    const res = await axios.post(url, options.data, options);
    const data = res.data;
    const balances = data.data.erc20BalancesByOwnerAddress;

    let eth_balance = 0;
    let usdc_balance = 0;
    let usdt_balance = 0;
    let dai_balance = 0;
    for (let i = 0; i < balances.length; i++) {
      const balance = balances[i];
      if (balance.contract_address === '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7') {
        eth_balance = parseFloat(balance.balance_display);
      }
      if (balance.contract_address === '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8') {
        usdc_balance = parseFloat(balance.balance_display);
      }
      if (balance.contract_address === '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8') {
        usdt_balance = parseFloat(balance.balance_display);
      }
      if (balance.contract_address === '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3') {
        dai_balance = parseFloat(balance.balance_display);
      }
    }
    return {
      eth_balance: eth_balance.toFixed(4),
      usdc_balance: usdc_balance.toFixed(2),
      usdt_balance: usdt_balance.toFixed(2),
      dai_balance: dai_balance.toFixed(2),
    };
    }
    catch (error) {
      console.error("Error fetching USDC balance:", error);
      return {
        eth_balance: "Error",
        usdc_balance: "Error",
        usdt_balance: "Error",
        dai_balance: "Error",
      };
    }
    }

export default getStarkERC20;