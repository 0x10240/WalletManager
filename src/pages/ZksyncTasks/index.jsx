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
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
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
    const [taskData, setTaskData] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const [hideColumn, setHideColumn] = useState(false);

    const syncSwapContract = "0x2da10a1e27bf85cedd8ffb1abbe97e53391c0295";
    const muteContract = "0x8B791913eB07C32779a16750e3868aA8495F5964";
    const okxSwapContract = "0xb9061E38FeE7d30134F56aEf7117E2F6d1580666";
    const spacefiContract = "0xbE7D1FD1f6748bbDefC4fbaCafBb11C6Fc506d1d";
    const _1inchContract = "0x6e2B76966cbD9cF4cC2Fa0D76d24d5241E0ABC2F";
    const izumiContract = "0x9606eC131EeC0F84c95D82c9a63959F2331cF2aC";
    const rollupContract = "0x5B91962F5ECa75E6558E4d32Df69B30f75cc6FE5";
    const znsContract = "0xCBE2093030F485adAaf5b61deb4D9cA8ADEAE509";
    const veloContract = "0xd999E16e68476bC749A28FC14a0c3b6d7073F50c";
    const ReactorFusionContract = "0xC5db68F30D21cBe0C9Eac7BE5eA83468d69297e6";
    const ReactorFusionContract2 = "0x04e9Db37d8EA0760072e1aCE3F2A219988Fdac29";
    const eraLendContract = "0x1BbD33384869b30A323e15868Ce46013C82B86FB";
    const eraLendContract2 = "0x1181D7BE04D80A8aE096641Ee1A87f7D557c6aeb";
    const mavContract = "0x39e098a153ad69834a9dac32f0fca92066ad03f4";
    const veSyncContract = "0x6C31035D62541ceba2Ac587ea09891d1645D6D07";
    const overNightContract = "0x84d05333f1F5Bf1358c3f63A113B1953C427925D";
    const overNightContract2 = "0xA269031037B4D5fa3F771c401D19E57def6Cb491";
    const openoceanContract = "0x36A1aCbbCAfca2468b85011DDD16E7Cb4d673230";
    const ezkContract = "0x498f7bB59c61307De7dEA005877220e4406470e9";
    const odosContract = "0xA269031037B4D5fa3F771c401D19E57def6Cb491";
    const dmailContract = "0x981F198286E40F9979274E0876636E9144B8FB8E";

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
                        const result = checkTaskStatus(item.address, syncSwapContract);
                        item.sync = result;
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
                        const result = checkTaskStatus(item.address, okxSwapContract);
                        item.okx = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, spacefiContract);
                        item.spacefi = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, _1inchContract);
                        item._1inch = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, izumiContract);
                        item.izumi = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, rollupContract);
                        item.rollup = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, znsContract);
                        item.zns = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, veloContract);
                        item.velo = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, ReactorFusionContract);
                        const result2 = checkTaskStatus(item.address, ReactorFusionContract2);
                        item.rf = result + result2;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, eraLendContract);
                        const result2 = checkTaskStatus(item.address, eraLendContract2);
                        item.eralend = result + result2;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, mavContract);
                        item.mav = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, veSyncContract);
                        item.veSync = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, overNightContract) + checkTaskStatus(item.address, overNightContract2);
                        item.usdp = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, openoceanContract);
                        item.ooe = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, ezkContract);
                        item.ezk = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, odosContract);
                        item.odos = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, dmailContract);
                        item.dmail = result;
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
                            const result = checkTaskStatusByArray(contractAddresses, syncSwapContract);
                            item.sync = result;
                            resolve();
                        });
                    });

                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, muteContract);
                            item.mute = result;
                            resolve();
                        });
                    });

                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, okxSwapContract);
                            item.okx = result;
                            resolve();
                        });
                    });

                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, spacefiContract);
                            item.spacefi = result;
                            resolve();
                        });
                    });

                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, _1inchContract);
                            item._1inch = result;
                            resolve();
                        });
                    });

                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, izumiContract);
                            item.izumi = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, rollupContract);
                            item.rollup = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, znsContract);
                            item.zns = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, veloContract);
                            item.velo = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, ReactorFusionContract);
                            const result2 = checkTaskStatusByArray(contractAddresses, ReactorFusionContract2);
                            item.rf = result + result2;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, eraLendContract);
                            const result2 = checkTaskStatusByArray(contractAddresses, eraLendContract2);
                            item.eralend = result + result2;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, mavContract);
                            item.mav = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, veSyncContract);
                            item.veSync = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, overNightContract) + checkTaskStatusByArray(contractAddresses, overNightContract2);
                            item.usdp = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, openoceanContract);
                            item.ooe = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, ezkContract);
                            item.ezk = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, odosContract);
                            item.odos = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, dmailContract);
                            item.dmail = result;
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

    const checkTaskStatusByArray = (contractAddresses, taskContract) => {
        taskContract = taskContract.toLowerCase();
        const count = contractAddresses.reduce((accumulator, contractAddress) => {
            if (contractAddress === taskContract) {
                return accumulator + 1;
              }
              return accumulator;
            }, 0);
            
            return count;
      };

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
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
            setTaskData(JSON.parse(storedAddresses));
        }
        const fetchData = async () => {
            const parsedAddresses = JSON.parse(storedAddresses);
            if (!parsedAddresses) {
              return;
            }
            // 存储每个地址对应的合约数组到map中
            const taskContractsMap = new Map();
            const promises = []; // 存储所有的异步任务
          
            for (const entry of parsedAddresses) {
              const address = entry.address;
              const promise = getZksTasks(address)
                .then(contractAddresses => {
                  taskContractsMap.set(address, contractAddresses);
                })
                .catch(error => {
                  // 处理错误
                  console.error(`Error fetching tasks for address ${address}:`, error);
                });
          
              promises.push(promise);
            }
          
            try {
              await Promise.all(promises); // 等待所有的异步任务完成
              setTableLoading(false);
              setTaskContracts(taskContractsMap);
            } catch (error) {
              // 处理错误
              console.error('Error fetching task contracts:', error);
            }
          };
          
          fetchData();
          
    }, []);

    useEffect(() => {
        if (!initialized && data.length > 0 && taskContracts.size > 0) {
            initData()
            setInitialized(true); // 标记为已初始化
        }
      }, [data, taskContracts]);
   
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
            width: 150
        },{
            title: "最后交易",
            dataIndex: "zks2_last_tx",
            key: "zks2_last_tx",
            align: "center",
            render: (text, record) => {
                let textColor = "inherit";
              
                if (text === null) {
                  return <Spin />;
                } else if (text.includes("周")) {
                  textColor = "red";
                } else {
                  textColor = "#1677ff";
                }
              
                return (
                  <a
                    href={"https://explorer.zksync.io/address/" + record.address}
                    target={"_blank"}
                    style={{ color: textColor }}
                  >
                    {text}
                  </a>
                );
              },
            width: 55
        },
        {
            title: <a href="https://defillama.com/chain/zkSync Era" style={{ color: 'white' }} 
                target="_blank" rel="noopener noreferrer">zkSyncEra Task List  [参考defillama TVL数据] 🔴eraLend疑似被攻击 谨慎交互</a>,
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: <a href="https://syncswap.xyz" target="_blank" rel="noopener noreferrer">Sync</a>,
                    dataIndex: "sync",
                    key: "sync",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.sync === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.mute.io/swap" target="_blank" rel="noopener noreferrer">Mute</a>,
                    dataIndex: "mute",
                    key: "mute",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.mute === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://www.okx.com/cn/web3/dex" target="_blank" rel="noopener noreferrer">OKX</a>,
                    dataIndex: "okx",
                    key: "okx",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.okx === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://swap-zksync.spacefi.io/#/swap" target="_blank" rel="noopener noreferrer">Spacefi</a>,
                    dataIndex: "spacefi",
                    key: "spacefi",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.spacefi === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.1inch.io" target="_blank" rel="noopener noreferrer">1inch</a>,
                    dataIndex: "_1inch",
                    key: "_1inch",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record._1inch === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://izumi.finance/trade/swap" target="_blank" rel="noopener noreferrer">izumi</a>,
                    dataIndex: "izumi",
                    key: "izumi",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.izumi === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.vesync.finance/swap" target="_blank" rel="noopener noreferrer">veSync</a>,
                    dataIndex: "veSync",
                    key: "veSync",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.veSync === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                // {
                //     title: <a href="https://app.rollup.finance/#/stake" target="_blank" rel="noopener noreferrer">rollup</a>,
                //     dataIndex: "rollup",
                //     key: "rollup",
                //     align: "center",
                //     render: (text, record) => (
                //         <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                //             {text === null ? <Spin /> : text}
                //         </span>
                //     ),
                //     width: 55
                // },
                {
                    title: <a href="https://app.mav.xyz/?chain=324" target="_blank" rel="noopener noreferrer">Mav</a>,
                    dataIndex: "mav",
                    key: "mav",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.mav === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://zks.network/" target="_blank" rel="noopener noreferrer">zns</a>,
                    dataIndex: "zns",
                    key: "zns",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.zns === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.velocore.xyz/swap" target="_blank" rel="noopener noreferrer">velo</a>,
                    dataIndex: "velo",
                    key: "velo",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.velo === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.reactorfusion.xyz/" target="_blank" rel="noopener noreferrer">Reactor</a>,
                    dataIndex: "rf",
                    key: "rf",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.rf === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.eralend.com/" target="_blank" rel="noopener noreferrer">eraLend🚨</a>,
                    dataIndex: "eralend",
                    key: "eralend",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.eralend === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 70
                },
                {
                    title: <a href="https://app.overnight.fi/stats?tabName=zksync" target="_blank" rel="noopener noreferrer">USD+</a>,
                    dataIndex: "usdp",
                    key: "usdp",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.usdp === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.openocean.finance/CLASSIC#/ZKSYNC/ETH/USDC" target="_blank" rel="noopener noreferrer">OOE</a>,
                    dataIndex: "ooe",
                    key: "ooe",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.ooe === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://dapp.ezkalibur.com/" target="_blank" rel="noopener noreferrer">eZK</a>,
                    dataIndex: "ezk",
                    key: "ezk",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.ezk === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://app.odos.xyz/" target="_blank" rel="noopener noreferrer">odos</a>,
                    dataIndex: "odos",
                    key: "odos",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.odos === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: <a href="https://mail.dmail.ai/presale/395788" target="_blank" rel="noopener noreferrer">dmail</a>,
                    dataIndex: "dmail",
                    key: "dmail",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: 0,
                        }
                    ],
                    onFilter: (value, record) => record.dmail === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 55
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress',
                    align: 'center',
                    sorter: (a, b) => a.progress - b.progress,
                    render: (text, record) => {
                      const items = ['sync', 'mute', 'okx', 'spacefi', '_1inch', 'izumi', 'zns',
                       'velo', 'rf', 'eralend', 'mav', 'veSync', 'usdp', 'ooe', 'ezk', 'odos', 'dmail'];
                      const count = items.reduce((total, item) => {
                        if (record[item] > 0) {
                          return total + 1;
                        }
                        return total;
                      }, 0);
                      const percentage = (count / items.length) * 100;
                      record.progress = percentage;
                
                      const backgroundColor = `rgba(240, 121, 78, ${percentage / 100})`;
                
                      return {
                        children: <span>{text === null ? <Spin /> : `${percentage.toFixed(2)}%`}</span>,
                        props: {
                          style: {
                            background: backgroundColor,
                          },
                        },
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

export default ZksyncTasks;
