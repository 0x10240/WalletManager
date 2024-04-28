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
import {EyeOutlined, EyeInvisibleOutlined, SlidersOutlined} from "@ant-design/icons"
import {
    getEthBalance,
    getTxCount,
    exportToExcel,
    calculateScore,
    getBaseInfo,
    getBaseTx,
    getBaseERC20,
    getBaseBridge,
    getLayerData,
    getBeraData
} from "@utils"
import {useEffect, useState} from "react";
import './index.css';
import {Layout, Card} from 'antd';
import {ethers} from 'ethers';

const {Content} = Layout;
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined, SettingOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {getLastTxTime} from "@utils/utils.js";

const {TextArea} = Input;

function Base() {
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchLength, setBatchLength] = useState(0);
    const [batchloading, setBatchLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [hideColumn, setHideColumn] = useState(false);
    const [scoreData, setScoreData] = useState([]);
    const [tableHeight, setTableHeight] = useState(0);
    const [changeApiForm] = Form.useForm();
    const [apiKey, setApiKey] = useState(localStorage.getItem('base_api_key'));
    const [isChangeApiModalVisible, setIsChangeApiModalVisible] = useState(false);

    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
    };

    const handleChangeApiOk = () => {
        localStorage.setItem('base_api_key', changeApiForm.getFieldsValue().base);
        setIsChangeApiModalVisible(false);
        setApiKey(localStorage.getItem('base_api_key'));
    }
    useEffect(() => {
        const storedApiKey = localStorage.getItem('base_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            changeApiForm.setFieldsValue(storedApiKey);
        }
    }, []);

    const getNftBalance = async (address) => {
        try {
            const provider = new ethers.JsonRpcProvider('https://mainnet.era.zksync.io');
            const ABI = [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                    ],
                    name: "balanceOf",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
            ];
            const contractAddress = "0xd07180c423f9b8cf84012aa28cc174f3c433ee29";
            const contract = new ethers.Contract(contractAddress, ABI, provider);
            const result = await contract.balanceOf(address);
            return {zks_nft: result.toString()};
        } catch (error) {
            console.log(error);
            return {zks_nft: "Error"};
        }
    }

    const getEyeIcon = () => {
        if (hideColumn) {
            return <EyeInvisibleOutlined/>;
        }
        return <EyeOutlined/>;
    };

    useEffect(() => {
        const handleResize = () => {
            setTableHeight(window.innerHeight - 210); // 减去其他组件的高度，如页眉、页脚等
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            const limit = 2;
            let activePromises = 0;
            let promisesQueue = [];
            const newData = [...data];
            const processQueue = () => {
                while (activePromises < limit && promisesQueue.length > 0) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
                if (promisesQueue.length > 0) {
                    setTimeout(processQueue, 2500);
                }
            };

            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);

                if (index !== -1) {
                    const item = newData[index];

                    promisesQueue.push(() => {
                        item.eth_balance = null;

                        return getEthBalance(item.address, "ethereum").then((eth_balance) => {
                            item.eth_balance = eth_balance;
                            setData([...newData]);
                            localStorage.setItem('bera_addresses', JSON.stringify(newData));
                        })
                    });

                    promisesQueue.push(() => {
                        item.bera = null;
                        item.usdc = null;
                        item.honey = null;
                        return getBeraData(item.address).then((beraData) => {
                            Object.assign(item, beraData);
                            setData([...newData]);
                            localStorage.setItem('bera_addresses', JSON.stringify(newData));
                        })
                    });

                    // promisesQueue.push(async () => {
                    //     item.base_usdbc_balance = null;
                    //     item.base_usdc_balance = null;
                    //     return getBaseERC20(item.address, apiKey).then(({USDbC, USDC}) => {
                    //         item.base_usdbc_balance = USDbC;
                    //         item.base_usdc_balance = USDC;
                    //         setData([...newData]);
                    //         localStorage.setItem('bera_addresses', JSON.stringify(newData));
                    //     })
                    // })

                    // promisesQueue.push(() => {
                    //     item.base_tx_amount = null;
                    //     item.base_last_tx = null;
                    //     item.dayActivity = null;
                    //     item.weekActivity = null;
                    //     item.monthActivity = null;
                    //     item.contractActivity = null;
                    //     item.totalFee = null;
                    //     return getBaseTx(item.address, apiKey).then(({base_tx_amount, base_last_tx, dayActivity, weekActivity, monthActivity, contractActivity, totalFee, totalExchangeAmount}) => {
                    //         item.base_tx_amount = base_tx_amount;
                    //         item.base_last_tx = base_last_tx;
                    //         item.dayActivity = dayActivity;
                    //         item.weekActivity = weekActivity;
                    //         item.monthActivity = monthActivity;
                    //         item.contractActivity = contractActivity;
                    //         item.totalFee = totalFee;
                    //         item.totalExchangeAmount = totalExchangeAmount;
                    //         setData([...newData]);
                    //         localStorage.setItem('bera_addresses', JSON.stringify(newData));
                    //     })
                    // });


                    promisesQueue.push(() => {
                        item.eth_tx_amount = null;
                        return getTxCount(item.address, "ethereum").then((eth_tx_amount) => {
                            item.eth_tx_amount = eth_tx_amount;
                            setData([...newData]);
                            localStorage.setItem('bera_addresses', JSON.stringify(newData));
                        })
                    });

                    // promisesQueue.push(() => {
                    //     item.l1Tol2Times = null;
                    //     item.l1Tol2Amount = null;
                    //     return getBaseBridge(item.address, apiKey).then(({l1Tol2Times, l1Tol2Amount}) => {
                    //         item.l1Tol2Times = l1Tol2Times;
                    //         item.l1Tol2Amount = l1Tol2Amount;
                    //         setData([...newData]);
                    //         localStorage.setItem('bera_addresses', JSON.stringify(newData));
                    //     })
                    // });
                }
            }
            processQueue();
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            setIsLoading(false);
            setSelectedKeys([]);
            message.success("刷新成功");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (!values.address.startsWith('0x')) {
                values.address = '0x' + values.address;
            }
            if (values.address.length !== 42) {
                notification.error({
                    message: "错误", description: "请输入正确的EVM地址",
                }, 2);
                return;
            }
            setIsModalVisible(false);

            const index = data.findIndex(item => item.address === values.address);
            if (index !== -1) {
                setData(data.map((item, i) => {
                    if (i === index) {
                        return {
                            ...item, name: values.name,
                        }
                    }
                    return item;
                }));
                const updatedData = [...data];
                getBeraData(values.address).then((layerData) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        ...layerData
                    }
                    setData(updatedData);
                    localStorage.setItem('bera_addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                };
                const newData = [...data, newEntry];
                setData(newData);

                getBeraData(values.address).then((layerData) => {
                    // 直接使用API返回的数据更新newEntry
                    Object.assign(newEntry, layerData);

                    setData([...newData]);

                    localStorage.setItem('bera_addresses', JSON.stringify(newData));
                })
            }
        } catch (error) {
            notification.error({
                message: "错误", description: error.message,
            }, 2);
        } finally {
            form.resetFields();
        }
    }

    const handleBatchOk = async () => {
        try {
            setBatchLoading(true);
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addressLines = values.addresses.split("\n");
            const wallets = addressLines.map(line => {
                const [address, name] = line.split(",");
                return {address: address.trim(), name: name ? name.trim() : ''};
            });
            const addresses = wallets.map(obj => obj.address);
            const names = wallets.map(obj => obj.name);
            setBatchLength(addresses.length);
            const newData = [...data];
            const limit = 3;
            let activePromises = 0;
            let promisesQueue = [];
            setBatchProgress(0);
            const processQueue = () => {
                while (promisesQueue.length > 0 && activePromises < limit) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };

            for (let address of addresses) {
                address = address.trim();
                let note = names[addresses.indexOf(address)];
                if (address.length !== 42) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的地址",
                    });
                    continue;
                }
                let promiseWithProgress = () => {
                    return new Promise((resolve, reject) => {
                        setBatchProgress(prevProgress => prevProgress + 1);
                        resolve();
                    });
                };
                const index = newData.findIndex(item => item.address === address);
                const item = index !== -1 ? newData[index] : {
                    key: newData.length.toString(),
                    address: address,
                    name: note,
                    eth_balance: null,
                    eth_tx_amount: null,
                    base_eth_balance: null,
                    base_last_tx: null,
                    base_tx_amount: null,
                    base_usdbc_balance: null,
                    base_usdc_balance: null,
                    base_usdtBalance: null,
                    dayActivity: null,
                    weekActivity: null,
                    monthActivity: null,
                    l1Tol2Times: null,
                    l1Tol2Amount: null,
                    l2Tol1Times: null,
                    l2Tol1Amount: null,
                    contractActivity: null,
                    totalFee: null,
                    totalExchangeAmount: null,
                };
                if (index === -1) {
                    newData.push(item);
                }
                promisesQueue.push(() => getBaseInfo(address, apiKey).then(({balance}) => {
                    item.base_eth_balance = balance;
                }));

                promisesQueue.push(() => getBaseERC20(address, apiKey).then(({USDbC, USDC}) => {
                    item.base_usdbc_balance = USDbC;
                    item.base_usdc_balance = USDC;
                }));

                promisesQueue.push(() => getEthBalance(address, "ethereum").then((eth_balance) => {
                    item.eth_balance = eth_balance;
                }));

                promisesQueue.push(() => getTxCount(address, "ethereum").then((eth_tx_amount) => {
                    item.eth_tx_amount = eth_tx_amount;
                }));

                promisesQueue.push(() => getBaseTx(address, apiKey).then(({
                                                                              base_tx_amount,
                                                                              base_last_tx,
                                                                              dayActivity,
                                                                              weekActivity,
                                                                              monthActivity,
                                                                              contractActivity,
                                                                              totalFee,
                                                                              totalExchangeAmount
                                                                          }) => {
                    item.base_tx_amount = base_tx_amount;
                    item.base_last_tx = base_last_tx;
                    item.dayActivity = dayActivity;
                    item.weekActivity = weekActivity;
                    item.monthActivity = monthActivity;
                    item.contractActivity = contractActivity;
                    item.totalFee = totalFee;
                    item.totalExchangeAmount = totalExchangeAmount;
                }));

                promisesQueue.push(() => getBaseBridge(address, apiKey).then(({l1Tol2Times, l1Tol2Amount}) => {
                    item.l1Tol2Times = l1Tol2Times;
                    item.l1Tol2Amount = l1Tol2Amount;
                }));

                promisesQueue.push(promiseWithProgress);
                processQueue();

            }
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setData(newData);
            localStorage.setItem('bera_addresses', JSON.stringify(newData));
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            });
        } finally {
            setBatchLoading(false);
            setBatchProgress(0);
            batchForm.resetFields();
            setSelectedKeys([]);
            message.success("地址添加成功");
        }
    };


    const showModal = () => {
        setIsModalVisible(true);
    };
    const showBatchModal = () => {
        setIsBatchModalVisible(true);
    };
    const exportToExcelFile = () => {
        exportToExcel(data, 'walletInfo');
    }
    useEffect(() => {
        setTableLoading(true);
        const storedAddresses = localStorage.getItem('bera_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
            setScoreData(JSON.parse(storedAddresses));
        }
    }, []);
    useEffect(() => {
        const newData = [...data];

        for (const item of newData) {
            setTimeout(async () => {
                const score = await calculateScore(item);
                item.base_score = score;

                // 检查是否所有数据的评分都已计算完成
                const allScoresCalculated = newData.every(item => item.zk_score !== undefined);

                if (allScoresCalculated) {
                    setData(newData);
                }
            }, 0);
        }
    }, [scoreData]);
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('bera_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleDeleteSelected = () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
            }, 2);
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('bera_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    const handleBatchCancel = () => {
        setIsBatchModalVisible(false);
    };
    const [editingKey, setEditingKey] = useState(null);
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
            width: 70,
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
                            localStorage.setItem('bera_addresses', JSON.stringify(data));
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
                                icon={<EditOutlined/>}
                                size="small"
                                onClick={() => setEditingKey(record.key)}
                            />
                        )}
                    </>
                );
            },
            width: 90
        },
        {
            title: (
                <span>
                钱包地址
                    <span onClick={toggleHideColumn} style={{marginLeft: 8, cursor: 'pointer'}}>
                        {getEyeIcon()}
                    </span>
                </span>
            ),
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text, record) => {
                if (hideColumn) {
                    return '***';
                }
                return (
                    <a
                        href={`https://artio.beratrail.io/address/${record.address}`}
                        target={"_blank"}
                    >
                        {text}
                    </a>
                );
            },
            width: 360
        },
        {
            title: "ETH",
            key: "eth_group",
            className: "eth",
            children: [
                {
                    title: "ETH",
                    dataIndex: "eth_balance",
                    key: "eth_balance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    width: 80
                },
                {
                    title: "Tx",
                    dataIndex: "eth_tx_amount",
                    key: "eth_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    width: 80
                },
            ],
        },
        {
            title: "BeraChain",
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: "BERA",
                    dataIndex: "bera",
                    key: "bera",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    width: 70
                },
                {
                    title: "Honey",
                    dataIndex: "honey",
                    key: "honey",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    width: 70
                },
                {
                    title: "USDC",
                    dataIndex: "usdc",
                    key: "usdc",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    width: 70
                },
                {
                    title: 'Tx',
                    dataIndex: 'tx_num',
                    key: 'tx_num',
                    align: 'center',
                    sorter: (a, b) => a.tx_num - b.tx_num,
                    render: (text, record) => {
                        if (text === null) {
                            return <Spin/>;
                        }

                        // 计算对数值
                        const logarithmValue = Math.log(text); // 使用自然对数（以e为底）
                        // const logarithmValue = Math.log10(text); // 使用常用对数（以10为底）

                        // 归一化处理
                        const minValue = Math.log(1); // 最小值的对数
                        const maxValue = Math.log(100); // 最大值的对数
                        const normalizedValue = (logarithmValue - minValue) / (maxValue - minValue);

                        // 计算透明度
                        const minOpacity = 0.1; // 最小透明度
                        const maxOpacity = 1; // 最大透明度
                        const opacity = normalizedValue * (maxOpacity - minOpacity) + minOpacity;

                        const backgroundColor = `rgba(173, 216, 230, ${opacity})`;

                        return {
                            children: text,
                            props: {
                                style: {
                                    background: backgroundColor,
                                },
                            },
                        };
                    },
                    width: 60
                },
                {
                    title: "最后交易",
                    dataIndex: "last_tx",
                    key: "last_tx",
                    align: "center",
                    render: (text, record) => {
                        let textColor = "inherit";

                        let last_text = getLastTxTime(text);

                        if (last_text === null) {
                            return <Spin/>;
                        } else if (last_text?.includes("天") && parseInt(last_text) > 7) {
                            textColor = "red";
                        } else {
                            textColor = "#1677ff";
                        }


                        return (
                            <a
                                href={`https://artio.beratrail.io/address/${record.address}`}
                                target={"_blank"}
                                style={{color: textColor}}
                            >
                                {last_text}
                            </a>
                        );
                    },
                    width: 90
                },
                // {
                //     title: "最后领水",
                //     dataIndex: "last_faucet",
                //     key: "last_faucet",
                //     align: "center",
                //     render: (text, record) => {
                //         let textColor = "inherit";
                //
                //         if (text === null) {
                //             return <Spin/>;
                //         } else if (text?.includes("天") && parseInt(text) > 7) {
                //             textColor = "red";
                //         } else {
                //             textColor = "#1677ff";
                //         }
                //
                //         return (
                //             <a
                //                 href={`https://artio.beratrail.io/address/${record.address}/internalTx`}
                //                 target={"_blank"}
                //                 style={{color: textColor}}
                //             >
                //                 {text}
                //             </a>
                //         );
                //     },
                //     width: 90
                // },
                {
                    title: "活跃统计",
                    key: "activity_stats_group",
                    children: [
                        {
                            title: "日",
                            dataIndex: "dayActivity",
                            key: "dayActivity",
                            align: "center",
                            sorter: (a, b) => a.dayActivity - b.dayActivity,
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 55
                        },
                        {
                            title: "周",
                            dataIndex: "weekActivity",
                            key: "weekActivity",
                            align: "center",
                            sorter: (a, b) => a.weekActivity - b.weekActivity,
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 50
                        },
                        {
                            title: "月",
                            dataIndex: "monthActivity",
                            key: "monthActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 50
                        },
                        {
                            title: "不同合约",
                            dataIndex: "contractActivity",
                            key: "contractActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 85
                        }
                    ],
                },
            ],
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="small">
                    <Popconfirm title={"确认删除？"} onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            ),
            width: 70
        },
    ];

    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={handleBatchCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
                    // style={{zIndex: 3}}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个  要添加备注时放在地址后以逗号(,)间隔"
                                      style={{width: "500px", height: "200px"}}/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title="添加地址" open={isModalVisible} onOk={handleOk}
                       onCancel={() => setIsModalVisible(false)}
                       okText={"添加地址"}
                       cancelText={"取消"}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item label="地址" name="address" rules={[{required: true}]}>
                            <Input placeholder="请输入地址"/>
                        </Form.Item>
                        <Form.Item label="备注" name="name">
                            <Input placeholder="请输入备注"/>
                        </Form.Item>
                    </Form>
                </Modal>

                <Spin spinning={tableLoading}>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
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
                                    gap: '20px'
                                }}>
                                    <Button type="primary" onClick={handleRefresh} loading={isLoading}
                                            size={"large"}
                                            style={{width: "20%"}} icon={<SyncOutlined/>}>
                                        {isLoading ? "正在刷新" : "刷新选中地址"}
                                    </Button>

                                    <Button type="primary" onClick={showBatchModal} size={"large"}
                                            style={{width: "20%"}}
                                            icon={<UploadOutlined/>}
                                            loading={batchloading}
                                    >
                                        {batchloading ? `添加中 进度:(${batchProgress}/${batchLength})` : "批量添加地址"}
                                    </Button>

                                    <Button type="primary" onClick={() => {
                                        setIsModalVisible(true)
                                    }} size={"large"} style={{width: "15%"}} icon={<PlusOutlined/>}>
                                        添加地址
                                    </Button>

                                    <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                                onConfirm={handleDeleteSelected}>
                                        <Button type="primary" danger size={"large"}
                                                style={{width: "20%"}} icon={<DeleteOutlined/>}>
                                            删除选中地址
                                        </Button>
                                    </Popconfirm>
                                    <Button type="primary" icon={<DownloadOutlined/>} size={"large"}
                                            style={{width: "8%"}}
                                            onClick={exportToExcelFile}/>
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

export default Base;
