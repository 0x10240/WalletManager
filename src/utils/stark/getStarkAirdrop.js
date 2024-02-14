import axios from "axios";

async function getStarkAirdrop(address) {
    try {
        // created by chainbird_eth
        let url =`https://birdonline.xyz/starknet?address=${address}`;
        const response = await axios.get(url);
        let result = response.data?.amount;
        if (result == undefined || result == null || result == "") {
            result = 0;
        } 
        return {airdrop: result}
    } catch (error) {
        console.error(error);
        return {airdrop: "Error"}
    }
}

export default getStarkAirdrop;
