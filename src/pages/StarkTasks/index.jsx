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
    exportToExcel,
    getStarkTasks
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

function StarkTasks() {
    const [data, setData] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [taskContracts, setTaskContracts] = useState(new Map());
    const [taskData, setTaskData] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const [hideColumn, setHideColumn] = useState(false);

    const jediETHUSDCpool = "0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a";
    const jediETHUSDTpool = "0x045e7131d776dddc137e30bdd490b431c7144677e97bf9369f629ed8d3fb7dd6";
    const jediETHDAIpool = "0x07e2a13b40fc1119ec55e0bcf9428eedaa581ab3c924561ad4e955f95da63138";
    const mySwapContract = "0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28";
    const avnuContract = "0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f";
    const zkLendContract = "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05";
    const _10KSwapETHUSDTpool = "0x05900cfa2b50d53b097cb305d54e249e31f24f881885aae5639b0cd6af4ed298";
    const _10KSwapETHUSDCpool = "0x000023c72abdf49dffc85ae3ede714f2168ad384cc67d08524732acea90df325";
    const _10KSwapETHDAIpool = "0x017e9e62c04b50800d7c59454754fe31a2193c9c3c6c92c093f2ab0faadf8c87";
    const sithSwapETHUSDCpool = "0x030615bec9c1506bfac97d9dbd3c546307987d467a7f95d5533c2e861eb81f3f";
    const sithSwapETHUSDTpool = "0x00691fa7f66d63dc8c89ff4e77732fff5133f282e7dbd41813273692cc595516";
    const sithSwapETHDAIpool = "0x0032ebb8e68553620b97b308684babf606d9556d5c0a652450c32e85f40d000d";
    
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
                        const result = (checkTaskStatus(item.address, jediETHUSDTpool) || checkTaskStatus(item.address, jediETHUSDCpool
                            || checkTaskStatus(item.address, jediETHDAIpool))) > 0 ? "✅" : "❌";
                        item.jedi = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, mySwapContract) > 0 ? "✅" : "❌";
                        item.myswap = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, avnuContract) > 0 ? "✅" : "❌";
                        item.avnu = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = checkTaskStatus(item.address, zkLendContract) > 0 ? "✅" : "❌";
                        item.zklend = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = (checkTaskStatus(item.address, _10KSwapETHUSDCpool) || checkTaskStatus(item.address, _10KSwapETHUSDTpool)
                            || checkTaskStatus(item.address, _10KSwapETHDAIpool)) > 0 ? "✅" : "❌";
                        item._10k = result;
                        resolve();
                    });
                });
                promisesQueue.push(() => {
                    return new Promise((resolve) => {
                        const result = (checkTaskStatus(item.address, sithSwapETHDAIpool) || checkTaskStatus(item.address, sithSwapETHUSDCpool)
                            || checkTaskStatus(item.address, sithSwapETHUSDTpool)) > 0 ? "✅" : "❌";
                        item.sith = result;
                        resolve();
                    });
                });
            }
            await Promise.all(promisesQueue.map((promise) => promise()));
            setTaskData([...newData]);
            localStorage.setItem('stark_addresses', JSON.stringify(newData));
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
                    const contractAddresses = await getStarkTasks(item.address);
                    taskContractsMap.set(item.address, contractAddresses);
                    setTaskContracts(taskContractsMap);
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 200);
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = (checkTaskStatusByArray(contractAddresses, jediETHUSDCpool) || checkTaskStatusByArray(contractAddresses, jediETHUSDTpool)
                                || (checkTaskStatusByArray(contractAddresses, jediETHDAIpool))) > 0 ? "✅" : "❌";
                            item.jedi = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, mySwapContract) > 0 ? "✅" : "❌";
                            item.myswap = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, avnuContract) > 0 ? "✅" : "❌";
                            item.avnu = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = checkTaskStatusByArray(contractAddresses, zkLendContract) > 0 ? "✅" : "❌";
                            item.zklend = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = (checkTaskStatusByArray(contractAddresses, _10KSwapETHUSDCpool) || checkTaskStatusByArray(contractAddresses, _10KSwapETHUSDTpool)
                                || checkTaskStatusByArray(contractAddresses, _10KSwapETHDAIpool)) > 0 ? "✅" : "❌";
                            item._10k = result;
                            resolve();
                        });
                    });
                    promisesQueue.push(() => {
                        return new Promise((resolve) => {
                            const result = (checkTaskStatusByArray(contractAddresses, sithSwapETHDAIpool) || checkTaskStatusByArray(contractAddresses, sithSwapETHUSDCpool)
                                || checkTaskStatusByArray(contractAddresses, sithSwapETHUSDTpool)) > 0 ? "✅" : "❌";
                            item.sith = result;
                            resolve();
                        });
                    });
                }
            }

          await Promise.all(promisesQueue.map(promise => promise()));
          
          setTaskData([...newData]);
          localStorage.setItem('stark_addresses', JSON.stringify(newData));
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
        const storedAddresses = localStorage.getItem('stark_addresses');
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
              const promise = getStarkTasks(address)
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
                            localStorage.setItem('stark_addresses', JSON.stringify(data));
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
            className: "address",
            render: (text, record) =>{
                if (hideColumn) {
                    return '***';
                  }
                return  (text === null ? <Spin/> : text)
            },
            width: 200, 
        },{
            title: "最后交易",
            dataIndex: "stark_latest_tx_time",
            key: "stark_latest_tx_time",
            align: "center",
            render: (text, record) => {
                let textColor = "inherit";
              
                if (text === null) {
                  return <Spin />;
                } else if (text?.includes("天") && parseInt(text) > 7) {
                  textColor = "red";
                } else {
                  textColor = "#1677ff";
                }
              
                return (
                  <a
                    href={"https://starkscan.co/contract/" + record.address}
                    target={"_blank"}
                    style={{ color: textColor }}
                  >
                    {text}
                  </a>
                );
              },
            width: 60,
        },
        {
            title: <a href="https://defillama.com/chain/Starknet" style={{ color: 'white' }} 
                target="_blank" rel="noopener noreferrer">StarkNet Task List  [参考defillama TVL数据] 🟡部分Dex只统计eth/usdc eth/usdt eth/dai交易记录<br/>🔴请注意，通过点击任务列表的超链接，您将离开本网页。我们建议您在访问这些外部链接之前，仔细阅读其网站的隐私政策和使用条款。我们不能控制这些网站的内容和安全性，并且不对其造成的任何损失或损害负责。

                在访问外部链接时，您需要自行评估潜在的风险。这些链接不构成对所链接网站内容的认可或支持。我们不对这些外部链接的准确性、内容、服务质量或安全性做任何承诺。
                
                我们建议您保持您的计算机和设备的安全性，使用防病毒软件和防火墙，并时刻注意潜在的网络钓鱼或恶意软件攻击。
                
                通过继续使用本网页并访问其中的超链接，您同意承担访问外部链接可能带来的一切风险。我们不对由此导致的任何损失或损害负责！</a>,
            key: "starkNet_group",
            className: "starkNet",
            children: [
                {
                    title: <a href="https://app.jediswap.xyz/#/swap" target="_blank" rel="noopener noreferrer">JediSwap</a>,
                    dataIndex: "jedi",
                    key: "jedi",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record.jedi === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: <a href="https://www.myswap.xyz/" target="_blank" rel="noopener noreferrer">mySwap</a>,
                    dataIndex: "myswap",
                    key: "myswap",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record.myswap === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: <a href="https://10kswap.com/swap" target="_blank" rel="noopener noreferrer">10KSwap</a>,
                    dataIndex: "_10k",
                    key: "_10k",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record._10k === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: <a href="https://app.avnu.fi/en" target="_blank" rel="noopener noreferrer">AVNU</a>,
                    dataIndex: "avnu",
                    key: "avnu",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record.avnu === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: <a href="https://app.zklend.com/markets" target="_blank" rel="noopener noreferrer">zkLend</a>,
                    dataIndex: "zklend",
                    key: "zklend",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record.zklend === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: <a href="https://app.sithswap.com/swap/" target="_blank" rel="noopener noreferrer">SithSwap</a>,
                    dataIndex: "sith",
                    key: "sith",
                    align: "center",
                    filters: [
                        {
                          text: '未完成',
                          value: "❌",
                        },
                        {
                          text: '已完成',
                          value: "✅",
                        }
                    ],
                    onFilter: (value, record) => record.sith === value,
                    render: (text, record) => (
                        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                            {text === null ? <Spin /> : text}
                        </span>
                    ),
                    width: 60
                },
                {
                    title: "NFT",
                    children: [
                        {
                            title: <a href="https://mail.dmail.ai/presale/394965" target="_blank" rel="noopener noreferrer">Dmail</a>,
                            align: "center",
                            render: () => '/',
                            width: 60
                        },
                        {
                            title: <a href="https://app.starknet.id/identities" target="_blank" rel="noopener noreferrer">StarknetId</a>,
                            align: "center",
                            render: () => '/',
                            width: 60
                        },
                        {
                            title: <a href="https://starkverse.art/" target="_blank" rel="noopener noreferrer">starkverse</a>,
                            align: "center",
                            render: () => '/',
                            width: 60
                        }
                    ],
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress',
                    align: 'center',
                    sorter: (a, b) => a.progress - b.progress,
                    render: (text, record) => {
                      const items = ['jedi', 'myswap', 'avnu', 'zklend', '_10k', 'sith'];
                      const count = items.reduce((total, item) => {
                        if (record[item] === '✅') {
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

    return (
        <div>
            <Content>
                <Spin spinning={tableLoading}>
                <div style={{ width: '100%', margin: "0 auto" }}>
                    <span className="highlight-text">StarkNet官方已确认完成快照 <a href="https://x.com/StarknetFndn/status/1730532927405003219?s=20">点击查看原文</a></span>
                </div>
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

export default StarkTasks;
