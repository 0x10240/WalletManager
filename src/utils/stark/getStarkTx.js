import axios from "axios";

// async function getStarkTx(address) {
//   try {
//       let tx = 0;
//       let hasNextPage;
//       let endCursor;
//       const url = "https://starkscan.stellate.sh/";
//       const headers = {
//           'authority': 'starkscan.stellate.sh',
//           'accept': 'application/json',
//           'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
//           'content-type': 'application/json',
//       }
//       const Json_data = {
//           query: `query TransactionsTableQuery(
//               $first: Int!,
//               $after: String,
//               $input: TransactionsInput!
//             ) {
//               ...TransactionsTablePaginationFragment_transactions_2DAjA4
//             }
            
//             fragment TransactionsTableExpandedItemFragment_transaction on Transaction {
//               entry_point_selector_name
//               calldata_decoded
//               entry_point_selector
//               calldata
//               initiator_address
//               initiator_identifier
//               main_calls {
//                 selector
//                 selector_name
//                 calldata_decoded
//                 selector_identifier
//                 calldata
//                 contract_address
//                 contract_identifier
//                 id
//               }
//             }
            
//             fragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {
//               transactions(
//                 first: $first,
//                 after: $after,
//                 input: $input
//               ) {
//                 edges {
//                   node {
//                     id
//                     ...TransactionsTableRowFragment_transaction
//                     __typename
//                   }
//                   cursor
//                 }
//                 pageInfo {
//                   endCursor
//                   hasNextPage
//                 }
//               }
//             }
            
//             fragment TransactionsTableRowFragment_transaction on Transaction {
//               id
//               transaction_hash
//               block_number
//               transaction_status
//               transaction_type
//               timestamp
//               initiator_address
//               initiator_identifier
//               initiator {
//                 is_social_verified
//                 id
//               }
//               main_calls {
//                 selector_identifier
//                 id
//               }
//               ...TransactionsTableExpandedItemFragment_transaction
//             }`,
//             variables: {
//               first: 30,
//               after: null,
//               input: {
//                 initiator_address: address,
//                 sort_by: 'timestamp',
//                 order_by: 'desc',
//                 min_block_number: null,
//                 max_block_number: null,
//                 min_timestamp: null,
//                 max_timestamp: null
//               }
//             }
//       }
//       const response = await axios.post(url, Json_data, {headers: headers});
//       for (let i = 0; i < response.data.data['transactions']['edges'].length; i++) {
//           if (response.data.data['transactions']['edges'][i]['node']['transaction_type'] === 'INVOKE_FUNCTION') {
//               tx += 1;
//           }
//       }
//       hasNextPage = response.data.data['transactions']['pageInfo']['hasNextPage'];
//       const timestamp = response.data.data['transactions']['edges'][0]['node']['timestamp'];
//       const timestamps =  response.data.data['transactions']['edges'].map(item => item.node.timestamp * 1000);
//       const latestDate = new Date(timestamp * 1000);
//       let year = latestDate.getFullYear();
//       let month = latestDate.getMonth() + 1;
//       let date = latestDate.getDate();
//       if (month < 10) month = '0' + month;
//       if (date < 10) date = '0' + date;
//       let formattedDate = `${year}/${month}/${date}`;
//       if (hasNextPage === true) {
//           endCursor = response.data.data['transactions']['pageInfo']['endCursor'];
//           while (hasNextPage) {
//               Json_data['variables']['after'] = endCursor;
//               const response = await axios.post(url, Json_data, {headers: headers});
//               hasNextPage = response.data.data['transactions']['pageInfo']['hasNextPage'];
//               endCursor = response.data.data['transactions']['pageInfo']['endCursor'];
//               for (let i = 0; i < response.data.data['transactions']['edges'].length; i++) {
//                   if (response.data.data['transactions']['edges'][i]['node']['transaction_type'] === 'INVOKE_FUNCTION') {
//                       tx += 1;
//                   }
//               }
//           }
//       }
//       const date2 = new Date(timestamp * 1000);
//       const offset = 8;
//       const utc8Date = new Date(date2.getTime() + offset * 3600 * 1000);
//       const now = new Date();
//       const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
//       const diff = utc8Now - utc8Date;
//       const diffInHours = Math.floor(diff / (1000 * 60 * 60));
//       const diffInDays = Math.floor(diffInHours / 24);
//       let diffTime = ""
//       if (diffInDays > 0) {
//           diffTime = `${diffInDays} 天前`
//       } else if (diffInHours > 0) {
//         diffTime = `${diffInHours} 小时前`
//       } else {
//         diffTime = "刚刚"
//       }
//       console.log(tx, formattedDate, diffTime)
//       return {tx: tx, stark_latest_tx: formattedDate, stark_latest_tx_time: diffTime, stark_timestamps: timestamps};
//   } catch (error) {
//       console.error(error);
//       return {tx: "Error", stark_latest_tx: "Error"};
//   }
// }

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