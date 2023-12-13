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
    Row, Col, InputNumber, Badge, message, Switch, Pagination, Progress 
} from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import {
    getEthBalance,
    getTxCount,
    getZksEra,
    getZksLite,
    getZkSyncBridge,
    exportToExcel,
    getZksTasks,
    getEthPrice
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

function ZkRank() {
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
    const [taskData, setTaskData] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const [hideColumn, setHideColumn] = useState(false);
    const [ethPrice, setEthPrice] = useState(2173);
    const txRanges = [
        [[0, 4], 0.267738847],
        [[5, 9], 0.085431122],
        [[10, 19], 0.137614677],
        [[20, 49], 0.252152066],
        [[50, 99], 0.169440789],
        [[100, 1000], 0.087622498],
      ];
    const totalExchangeAmountRanges = [
        [[0, 100], 0.264382317],
        [[100, 500], 0.198355034],
        [[500, 1000], 0.089965011],
        [[1000, 10000], 0.223737202],
        [[10000, 50000], 0.144539897],
        [[50000, 250000], 0.058423068],
        [[250000, 1000000], 0.018293404],
        [[1000000, 1000000000], 0.002304067],
      ];    
    const balanceRanges =  [
        [[0, 5], 0.724191934],
        [[5, 10], 0.051347728],
        [[10, 25], 0.099912552],
        [[25, 50], 0.059388062],
        [[50, 100], 0.033739015],
        [[100, 500], 0.027607108],
        [[500, 1000], 0.001934668],
        [[1000, 10000], 0.001750579],
        [[10000, 100000], 0.000112284],
        [[100000, 10000000], 0.0000160],
    ]; 
    const DaysRanges = [
        [[0, 1], 0.208500294],
        [[1, 2], 0.087207738],
        [[2, 3], 0.064068409],
        [[3, 4], 0.04836792],
        [[4, 5], 0.042563306],
        [[5, 6], 0.042467498],
        [[6, 7], 0.041177041],
        [[7, 8], 0.03965632],
        [[8, 9], 0.035354934],
        [[9, 10], 0.033824855],
        [[10, 11], 0.030466902],
        [[11, 12], 0.026359165],
        [[12, 13], 0.023853311],
        [[13, 14], 0.021902573],
        [[14, 15], 0.020592182],
        [[15, 16], 0.019657699],
        [[16, 17], 0.018349953],
        [[17, 18], 0.016863405],
        [[18, 19], 0.014817063],
        [[19, 20], 0.01340171],
        [[20, 21], 0.009055342],
        [[21, 22], 0.008017806],
        [[22, 23], 0.006998933],
        [[23, 24], 0.00600218],
        [[24, 25], 0.005506568],
        [[25, 26], 0.005137912],
        [[26, 27], 0.005074549],
        [[27, 28], 0.004757966],
        [[28, 29], 0.004313044],
        [[29, 30], 0.003828031],
        [[30, 31], 0.003619049],
        [[31, 32], 0.003085881],
        [[32, 33], 0.002672756],
        [[33, 34], 0.001320897],
        [[34, 35], 0.001301794],
        [[35, 36], 0.001125434],
        [[36, 37], 0.000986728],
        [[37, 38], 0.000935785],
        [[38, 39], 0.000879583],
        [[38, 39], 0.000804],
        [[39, 40], 0.000745583],
        [[40, 41], 0.000802616],
        [[41, 42], 0.000614628],
        [[42, 43], 0.000546244],
        [[43, 44], 0.000478137],
        [[44, 170], 0.0065],
    ]; 
    const ContractRanges = [
        [[0, 2], 0.194161863],
        [[2, 5], 0.1772771],
        [[5, 10], 0.181418603],
        [[10, 50], 0.431299962],
        [[50, 100], 0.014373214],
        [[100, 500], 0.001469257],
    ];
    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
      };
    
    const getEyeIcon = () => {
    if (hideColumn) {
        return <EyeInvisibleOutlined />;
    }
    return <EyeOutlined />;
    };

    const initData = async () => {
        try {
            const newData = [...data];
            const promisesQueue = [];
            for (let item of newData) {
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = calculateRank(txRanges, item.zks2_tx_amount);
                        item.txRank = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = calculateRank(totalExchangeAmountRanges, item.totalExchangeAmount);
                        item.totalExchangeAmountRank = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const balance = parseFloat(item.zks2_balance) * ethPrice + parseFloat(item.zks2_usdcBalance);
                        const result = calculateRank(balanceRanges, balance);
                        item.balanceRank = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = calculateRank(DaysRanges, item.dayActivity);
                        item.dayActivityRank = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = calculateRank(ContractRanges, item.contractActivity);
                        item.contractRank = result;
                        resolve();
                    });
                });
                
            }
            await Promise.all(promisesQueue.map((promise) => promise()));
            setTaskData([...newData]);
            localStorage.setItem('addresses', JSON.stringify(newData));
        } catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    }
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
                            const result = calculateRank(txRanges, item.zks2_tx_amount);
                            item.txRank = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = calculateRank(totalExchangeAmountRanges, item.totalExchangeAmount);
                            item.totalExchangeAmountRank = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const balance = parseFloat(item.zks2_balance) * ethPrice + parseFloat(item.zks2_usdcBalance);
                            const result = calculateRank(balanceRanges, balance);
                            item.balanceRank = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = calculateRank(DaysRanges, item.dayActivity);
                            item.dayActivityRank = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = calculateRank(ContractRanges, item.contractActivity);
                            item.contractRank = result;
                            resolve();
                        });
                    });
                }
            }

          await Promise.all(promisesQueue.map(promise => promise()));
          setTaskData([...newData]);
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
      
    const calculateRank = (ranges, value) => {
        let cumulativePercentage = 0;
      
        for (const range of ranges) {
          const [start, end] = range[0];
          const percentage = range[1];
      
          if (value >= start && value <= end) {
            const valuePercentage = (value - start) / (end - start) * percentage;
            cumulativePercentage += valuePercentage;
            break;
          } else {
            cumulativePercentage += percentage;
          }
        }
        const rankPercentage = ((1 - cumulativePercentage) * 100).toFixed(2);
        return rankPercentage;
    }
    
    useEffect(() => {
    const handleResize = () => {
        setTableHeight(window.innerHeight - 180); // 减去其他组件的高度，如页眉、页脚等
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);

    useEffect(() => {
        setTableLoading(true);
        const storedAddresses = localStorage.getItem('addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
            setTaskData(JSON.parse(storedAddresses));
        }
    }, []);
    
    useEffect(() => {
        const fetchPrice = async () => {
            const price = await getEthPrice();
            setEthPrice(price);
        };
        fetchPrice();
    }, []);
    useEffect(() => {
        if (!initialized && data.length > 0) {
            initData()
            setInitialized(true); // 标记为已初始化
        }
      }, [data]);
   
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
            width: 34.5,
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
                        <Tag color="blue" onClick={() => setEditingKey(record.key)}>
                            {text}
                            </Tag>
                            {!text && (
                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => setEditingKey(record.key)}
                            />
                        )}
                    </>
                );
            },
            width: 70
        },
        {
            title: (
                <span>
                钱包地址
                    <span onClick={toggleHideColumn} style={{ marginLeft: 8, cursor: 'pointer' }}>
                        {getEyeIcon()}
                    </span>
                </span>
            ),
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text) => {
                if (hideColumn) {
                  return '***';
                }
                return text;
              },
            width: 175
        },
        // {
        //     title: "最后交易",
        //     dataIndex: "zks2_last_tx",
        //     key: "zks2_last_tx",
        //     align: "center",
        //     render: (text, record) => {
        //         let textColor = "inherit";
              
        //         if (text === null) {
        //           return <Spin />;
        //         } else if (text.includes("周")) {
        //           textColor = "red";
        //         } else {
        //           textColor = "#1677ff";
        //         }
              
        //         return (
        //           <a
        //             href={"https://explorer.zksync.io/address/" + record.address}
        //             target={"_blank"}
        //             style={{ color: textColor }}
        //           >
        //             {text}
        //           </a>
        //         );
        //       },
        //     width: 60
        // },
        {
            title: "zkSyncEra 排名 [数据截止 12-13 总地址数 4916089]",
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: "Tx排名",
                    dataIndex: "txRank",
                    key: "txRank",
                    align: "center",
                    sorter: (a, b) => a.txRank - b.txRank,
                    render: (text, record) => (
                        <span>
                           {text === null ? <Spin /> : <Progress steps={20} percent={text} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} />}
                        </span>
                        
                    ),
                    width: 60
                },
                {
                    title: "交易额排名",
                    dataIndex: "totalExchangeAmountRank",
                    key: "totalExchangeAmountRank",
                    align: "center",
                    sorter: (a, b) => a.totalExchangeAmountRank - b.totalExchangeAmountRank,
                    render: (text, record) => (
                        <span>
                           {text === null ? <Spin /> : <Progress steps={20} percent={text} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} />}
                        </span>
                        
                    ),
                    width: 60
                },
                {
                    title: "余额排名",
                    dataIndex: "balanceRank",
                    key: "balanceRank",
                    align: "center",
                    sorter: (a, b) => a.balanceRank - b.balanceRank,
                    render: (text, record) => (
                        <span>
                        {text === null ? <Spin /> : <Progress steps={20} percent={text} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} />}
                        </span>
                        
                    ),
                    width: 60
                },
                {
                    title: "日活跃排名",
                    dataIndex: "dayActivityRank",
                    key: "dayActivityRank",
                    align: "center",
                    sorter: (a, b) => a.dayActivityRank - b.dayActivityRank,
                    render: (text, record) => (
                        <span>
                           {text === null ? <Spin /> : <Progress steps={20} percent={text} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} />}
                        </span>
                        
                    ),
                    width: 60
                },
                {
                    title: "交互合约数排名",
                    dataIndex: "contractRank",
                    key: "contractRank",
                    align: "center",
                    sorter: (a, b) => a.contractRank - b.contractRank,
                    render: (text, record) => (
                        <span>
                           {text === null ? <Spin /> : <Progress steps={20} percent={text} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} />}
                        </span>
                        
                    ),
                    width: 60
                },
                {
                    title: '综合排名',
                    dataIndex: 'rank',
                    key: 'rank',
                    align: 'center',
                    sorter: (a, b) => a.rank - b.rank,
                    render: (text, record) => {
                      const txRank = parseFloat(record.txRank);
                      const totalExchangeAmountRank = parseFloat(record.totalExchangeAmountRank);
                      const balanceRank = parseFloat(record.balanceRank);
                      const dayActivityRank = parseFloat(record.dayActivityRank);
                      const contractRank = parseFloat(record.contractRank);
                      
                      const rank = parseFloat(txRank + totalExchangeAmountRank + balanceRank + dayActivityRank + contractRank) / 5;
                      record.rank = rank.toFixed(2);
                
                      return {
                        children: <span><Progress steps={20} percent={rank.toFixed(2)} size="small" status="active" strokeColor={text > 50 ? '#f5222d' : '#00a854'} /></span>,
                      };
                    },
                    width: 60,
                  },
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
                        dataSource={taskData}
                        pagination={false}
                        bordered={true}
                        style={{marginBottom: "0px", zIndex: 2}}
                        size={"small"}
                        columns={columns}
                        scroll={{
                            y: tableHeight
                          }}
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

export default ZkRank;
