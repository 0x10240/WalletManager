import {
    Button,
    Input,
    Space,
    Table,
    Modal,
    Form,
    notification,
    Spin,
    Tag,
    Popconfirm,
    Row, Col, InputNumber, Badge, message, Switch, Pagination
} from 'antd';
import {
    getEthBalance,
    getTxCount,
    getZksEra,
    getZksLite,
    getZkSyncBridge,
    exportToExcel,
    getZksTasks
} from "@utils"
import {useEffect, useState} from "react";
import './index.css';
import {Layout, Card} from 'antd';

const {Content} = Layout;
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined, SettingOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";

const {TextArea} = Input;

function ZksyncTasks() {
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchLength, setBatchLength] = useState(0);
    const [batchloading, setBatchLoading] = useState(false);
    const [zkSyncConfigStore, setZkSyncConfigStore] = useState({});
    const [data, setData] = useState([]);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [walletForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [taskContracts, setTaskContracts] = useState(new Map());

    const syncSwapContract = "0x2da10a1e27bf85cedd8ffb1abbe97e53391c0295";
    const muteContract = "0x8B791913eB07C32779a16750e3868aA8495F5964";
    const okxSwapContract = "0xb9061E38FeE7d30134F56aEf7117E2F6d1580666";
    const spacefiContract = "0xbE7D1FD1f6748bbDefC4fbaCafBb11C6Fc506d1d";
    const _1inchContract = "0x6e2B76966cbD9cF4cC2Fa0D76d24d5241E0ABC2F";

    const handleRefresh = async () => {
        if (!selectedKeys.length) {
          notification.error({
            message: "错误",
            description: "请先选择要刷新的地址",
          }, 2);
          return;
        }
        setIsLoading(true);
        try {
          const newData = [...data];
          const promisesQueue = [];
          
          for (let key of selectedKeys) {
            const index = newData.findIndex(item => item.key === key);
            if (index !== -1) {
              const item = newData[index];
              const taskContractsMap = new Map();
              const contractAddresses = await getZksTasks(item.address);
              taskContractsMap.set(item.address, contractAddresses);
              setTaskContracts(taskContractsMap);
              await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 200);
              });
              promisesQueue.push(() => {
                return new Promise((resolve) => {
                  const isSync = checkTaskStatus(item.address, syncSwapContract);
                  item.sync = isSync;
                  resolve();
                });
              });

              promisesQueue.push(() => {
                return new Promise((resolve) => {
                  const isMute = checkTaskStatus(item.address, muteContract);
                  item.mute = isMute;
                  resolve();
                });
              });

              promisesQueue.push(() => {
                return new Promise((resolve) => {
                  const isOkx = checkTaskStatus(item.address, okxSwapContract);
                  item.okx = isOkx;
                  resolve();
                });
              });

              promisesQueue.push(() => {
                return new Promise((resolve) => {
                  const isSpacefi = checkTaskStatus(item.address, spacefiContract);
                  item.spacefi = isSpacefi;
                  resolve();
                });
              });

              promisesQueue.push(() => {
                return new Promise((resolve) => {
                  const is1inch = checkTaskStatus(item.address, _1inchContract);
                  item._1inch = is1inch;
                  resolve();
                });
              });

            }
            }
          
          await Promise.all(promisesQueue.map(promise => promise()));
          
          setData([...newData]);
          localStorage.setItem('addresses', JSON.stringify(newData));
          message.success("刷新成功");
        } catch (error) {
          notification.error({
            message: "错误",
            description: error.message,
          }, 2);
        } finally {
          setIsLoading(false);
          setSelectedKeys([]);
        }
      };
      

    const checkTaskStatus = (address, taskContract) => {
        taskContract = taskContract.toLowerCase();
        const contractAddresses = taskContracts.get(address);
        if (contractAddresses == undefined) {
            message.info("等待数据加载完成再刷新");
            return "error";
        }
        const count = contractAddresses.reduce((accumulator, contractAddress) => {
            if (contractAddress === taskContract) {
              return accumulator + 1;
            }
            return accumulator;
          }, 0);
          
          return count;
    };
    
    useEffect(() => {
        setTableLoading(true);
        const storedAddresses = localStorage.getItem('addresses');
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
        const fetchData = async () => {
            if (storedAddresses.length === 0) {
                // storedAddresses为空的情况
                return;
            }
            const parsedAddresses = JSON.parse(storedAddresses);
            // 存储每个地址对应的合约数组到map中
            const taskContractsMap = new Map();
            for (const entry of parsedAddresses) {
                const address = entry.address;
                const contractAddresses = await getZksTasks(address);
                taskContractsMap.set(address, contractAddresses);
              }
            setTableLoading(false);
            setTaskContracts(taskContractsMap);
            };

        fetchData();
    }, []);

    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };

    const [editingKey, setEditingKey] = useState(null);
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
            // width: 34.5,
        },
        {
            title: "备注",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (text, record) => {
                const isEditing = record.key === editingKey;
                return isEditing ? (
                    <Input
                        placeholder="请输入备注"
                        defaultValue={text}
                        onPressEnter={(e) => {
                            record.name = e.target.value;
                            setData([...data]);
                            localStorage.setItem('addresses', JSON.stringify(data));
                            setEditingKey(null);
                        }}
                    />
                ) : (
                    <>
                        <Tag color="blue">{text}</Tag>
                        <Button
                            shape="circle"
                            icon={<EditOutlined/>}
                            size={"small"}
                            onClick={() => setEditingKey(record.key)}
                        />
                    </>
                );
            },
            // width: 70
        },
        {
            title: "钱包地址",
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text, record) => (
                <span>
                    {text === null ? <Spin /> : text}
                </span>
            ),
            // width: 375
        },
        {
            title: "zkSyncEra Task List",
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: "SyncSwap",
                    dataIndex: "sync",
                    key: "sync",
                    align: "center",
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    // width: 60
                },
                {
                    title: "Mute.io",
                    dataIndex: "mute",
                    key: "mute",
                    align: "center",
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    // width: 63
                },
                {
                    title: "OKXSwap",
                    dataIndex: "okx",
                    key: "okx",
                    align: "center",
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    // width: 34.2
                },
                {
                    title: "Spacefi",
                    dataIndex: "spacefi",
                    key: "spacefi",
                    align: "center",
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    // width: 34.2
                },
                {
                    title: "1inch",
                    dataIndex: "_1inch",
                    key: "_1inch",
                    align: "center",
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    // width: 34.2
                },
                {
                    title: "最后交易",
                    dataIndex: "zks2_last_tx",
                    key: "zks2_last_tx",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> :
                        <a href={"https://explorer.zksync.io/address/" + record.address}
                           target={"_blank"}>{text}</a>),
                    // width: 77
                }
            ],
        }
    ];
    // const isRowSatisfyCondition = (record) => {
    //     const conditionKeyMapping = {
    //         "ETHTx": "eth_tx_amount",
    //         "zkSyncLiteMinTx": "zks1_tx_amount",
    //         "zkSyncEraMinTx": "zks2_tx_amount",
    //         "L1ToL2Tx": "l1Tol2Times",
    //         "L2ToL1Tx": "l2Tol1Times",
    //         "L1ToL2ETH": "l1Tol2Amount",
    //         "L2ToL1ETH": "l2Tol1Amount",
    //         "contractMin": "contractActivity",
    //         "dayMin": "dayActivity",
    //         "weekMin": "weekActivity",
    //         "monthMin": "monthActivity",
    //         "gasFee": "totalFee",
    //         "totalAmount": "totalExchangeAmount",
    //     };
    //     return Object.keys(conditionKeyMapping).every((conditionKey) => {
    //         if (!(conditionKey in zkSyncConfigStore) || zkSyncConfigStore[conditionKey] === null || zkSyncConfigStore[conditionKey] === undefined) {
    //             return true;
    //         }
    //         const recordKey = conditionKeyMapping[conditionKey];
    //         return Number(record[recordKey]) >= Number(zkSyncConfigStore[conditionKey])
    //     });
    // };

    return (
        <div>
            <Content>
                <Spin spinning={tableLoading}>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        pagination={false}
                        bordered={true}
                        style={{marginBottom: "20px", zIndex: 2}}
                        size={"small"}
                        columns={columns}
                        // sticky
                        summary={pageData => {
                            let ethBalance = 0;
                            let zks1Balance = 0;
                            let zks2Balance = 0;
                            let zks2UsdcBalance = 0;
                            let totalFees = 0;
                            pageData.forEach(({
                                                  eth_balance,
                                                  zks1_balance,
                                                  zks2_balance,
                                                  zks2_usdcBalance,
                                                  totalFee
                                              }) => {
                                ethBalance += Number(eth_balance);
                                zks1Balance += Number(zks1_balance);
                                zks2Balance += Number(zks2_balance);
                                zks2UsdcBalance += Number(zks2_usdcBalance);
                                totalFees += Number(totalFee);
                            })

                            const emptyCells = Array(10).fill().map((_, index) => <Table.Summary.Cell
                                index={index + 6}/>);

                        }}
                        footer={() => (
                            <Card>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '10px'
                                }}>
                                    <Button type="primary" onClick={handleRefresh} loading={isLoading}
                                            size={"large"}
                                            style={{width: "20%"}} icon={<SyncOutlined/>}>
                                        {isLoading ? "正在刷新" : "刷新选中地址"}
                                    </Button>
                                </div>
                            </Card>
                        )
                        }
                    />
                </Spin>
            </Content>
        </div>
    );
}

export default ZksyncTasks;
