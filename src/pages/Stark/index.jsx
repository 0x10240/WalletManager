import {useEffect, useState} from "react";
import {Button, Input, Space, Table, Modal, Form, notification, Spin, Tag, Popconfirm} from 'antd';
import {Layout, Card} from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import {
    getStarkTx,
    getStarkBridge,
    getStarkInfo,
    exportToExcel,
    getStarkBalances,
    getStarkActivity,
    getStarkAmount,
    getStarkERC20
} from "@utils"
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import './index.css'

const {TextArea} = Input;

const {Content} = Layout;
const Stark = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [batchForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    const [tableHeight, setTableHeight] = useState(0);
    const [hideColumn, setHideColumn] = useState(false);

    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
      };
    
    const getEyeIcon = () => {
    if (hideColumn) {
        return <EyeInvisibleOutlined />;
    }
    return <EyeOutlined />;
    };

    useEffect(() => {
        const handleResize = () => {
            setTableHeight(window.innerHeight - 260); // 减去其他组件的高度，如页眉、页脚等
        };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []);

    useEffect(() => {
        setTableLoading(true)
        const storedAddresses = localStorage.getItem('stark_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
    }, []);
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.address.length !== 66 && values.address.length !== 64) {
                notification.error({
                    message: "错误",
                    description: "请输入正确的stark地址(64位)",
                }, 2);
                return;
            }
            if (!values.address.startsWith('0x')) {
                values.address = '0x' + values.address;
            }
            setIsModalVisible(false);
            const index = data.findIndex(item => item.address === values.address);
            if (index !== -1) {
                setData(data.map((item, i) => {
                    if (i === index) {
                        return {
                            ...item,
                            name: values.name,
                        }
                    }
                    return item;
                }));
                const updatedData = [...data];
                getStarkInfo(values.address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        wallet_type: wallet_type,
                        create_time: deployed_at_timestamp,
                        stark_id: stark_id,
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkBalances(values.address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        stark_eth_balance: eth_balance,
                        stark_usdc_balance: usdc_balance,
                        stark_usdt_balance: usdt_balance,
                        stark_dai_balance: dai_balance,
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkActivity(values.address).then(({dayActivity, weekActivity, monthActivity}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        dayActivity: dayActivity, 
                        weekActivity: weekActivity, 
                        monthActivity: monthActivity
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkAmount(values.address).then(({stark_exchange_amount}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        stark_exchange_amount: stark_exchange_amount,
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkBridge(values.address).then(({
                                                         d_eth_amount, d_eth_count,
                                                         d_usdc_amount, d_usdc_count,
                                                         d_usdt_amount, d_usdt_count,
                                                         d_dai_amount, d_dai_count,
                                                         d_wbtc_amount,
                                                         d_wbtc_count,
                                                         w_eth_amount, w_eth_count,
                                                         w_usdc_amount, w_usdc_count,
                                                         w_usdt_amount, w_usdt_count,
                                                         w_dai_amount, w_dai_count,
                                                         w_wbtc_amount, w_wbtc_count,
                                                         total_deposit_count, total_widthdraw_count

                                                     }) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        d_eth_amount, d_eth_count,
                        d_usdc_amount, d_usdc_count,
                        d_usdt_amount, d_usdt_count,
                        d_dai_amount, d_dai_count,
                        d_wbtc_amount,
                        d_wbtc_count,
                        w_eth_amount, w_eth_count,
                        w_usdc_amount, w_usdc_count,
                        w_usdt_amount, w_usdt_count,
                        w_dai_amount, w_dai_count,
                        w_wbtc_amount, w_wbtc_count,
                        total_deposit_count, total_widthdraw_count
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkTx(values.address).then(({tx, stark_latest_tx_time}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        stark_tx_amount: tx,
                        stark_latest_tx_time: stark_latest_tx_time
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                    stark_eth_balance: null,
                    stark_usdc_balance: null,
                    stark_usdt_balance: null,
                    stark_dai_balance: null,
                    dayActivity: null,
                    weekActivity: null,
                    monthActivity: null,
                    stark_exchange_amount: null,
                    stark_id: null,
                    create_time: null,
                    d_eth_amount: null,
                    d_eth_count: null,
                    d_usdc_amount: null,
                    d_usdc_count: null,
                    d_usdt_amount: null,
                    d_usdt_count: null,
                    d_dai_amount: null,
                    d_dai_count: null,
                    d_wbtc_amount: null,
                    d_wbtc_count: null,
                    w_eth_amount: null,
                    w_eth_count: null,
                    w_usdc_amount: null,
                    w_usdc_count: null,
                    w_usdt_amount: null,
                    w_usdt_count: null,
                    w_dai_amount: null,
                    w_dai_count: null,
                    w_wbtc_amount: null,
                    w_wbtc_count: null,
                    stark_tx_amount: null,
                    stark_latest_tx: null,
                    stark_latest_tx_time: null,
                    total_deposit_count: null,
                    total_widthdraw_count: null
                };
                const newData = [...data, newEntry];
                setData(newData);
                getStarkTx(values.address).then(({tx, stark_latest_tx_time}) => {
                    newEntry.stark_tx_amount = tx;
                    newEntry.stark_latest_tx_time = stark_latest_tx_time;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkInfo(values.address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                    newEntry.wallet_type = wallet_type;
                    newEntry.create_time = deployed_at_timestamp;
                    newEntry.stark_id = stark_id;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkBalances(values.address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                    newEntry.stark_eth_balance = eth_balance;
                    newEntry.stark_usdc_balance = usdc_balance;
                    newEntry.stark_usdt_balance = usdt_balance;
                    newEntry.stark_dai_balance = dai_balance;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkActivity(values.address).then(({dayActivity, weekActivity, monthActivity}) => {
                    newEntry.dayActivity = dayActivity;
                    newEntry.weekActivity = weekActivity;
                    newEntry.monthActivity = monthActivity;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkAmount(values.address).then(({stark_exchange_amount}) => {
                    newEntry.stark_exchange_amount = stark_exchange_amount;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkBridge(values.address).then(({
                                                         d_eth_amount, d_eth_count,
                                                         d_usdc_amount, d_usdc_count,
                                                         d_usdt_amount, d_usdt_count,
                                                         d_dai_amount, d_dai_count,
                                                         d_wbtc_amount,
                                                         d_wbtc_count,
                                                         w_eth_amount, w_eth_count,
                                                         w_usdc_amount, w_usdc_count,
                                                         w_usdt_amount, w_usdt_count,
                                                         w_dai_amount, w_dai_count,
                                                         w_wbtc_amount, w_wbtc_count,
                                                         total_widthdraw_count, total_deposit_count
                                                     }) => {
                    newEntry.d_eth_amount = d_eth_amount;
                    newEntry.d_eth_count = d_eth_count;
                    newEntry.d_usdc_amount = d_usdc_amount;
                    newEntry.d_usdc_count = d_usdc_count;
                    newEntry.d_usdt_amount = d_usdt_amount;
                    newEntry.d_usdt_count = d_usdt_count;
                    newEntry.d_dai_amount = d_dai_amount;
                    newEntry.d_dai_count = d_dai_count;
                    newEntry.d_wbtc_amount = d_wbtc_amount;
                    newEntry.d_wbtc_count = d_wbtc_count;
                    newEntry.w_eth_amount = w_eth_amount;
                    newEntry.w_eth_count = w_eth_count;
                    newEntry.w_usdc_amount = w_usdc_amount;
                    newEntry.w_usdc_count = w_usdc_count;
                    newEntry.w_usdt_amount = w_usdt_amount;
                    newEntry.w_usdt_count = w_usdt_count;
                    newEntry.w_dai_amount = w_dai_amount;
                    newEntry.w_dai_count = w_dai_count;
                    newEntry.w_wbtc_amount = w_wbtc_amount;
                    newEntry.w_wbtc_count = w_wbtc_count;
                    newEntry.total_deposit_count = total_deposit_count;
                    newEntry.total_widthdraw_count = total_widthdraw_count;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
            }
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            form.resetFields();
        }
    }
    const handleBatchOk = async () => {
        try {
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");
            const newData = [...data];
            for (let address of addresses) {
                address = address.trim();
                if (address.length !== 66 && address.length !== 64) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的stark地址(64位)",
                    });
                    continue;
                }
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }
                const index = newData.findIndex(item => item.address === address);
                if (index !== -1) {
                    const updatedData = [...newData];
                    getStarkTx(address).then(({tx, stark_latest_tx_time}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            stark_tx_amount: tx,
                            stark_latest_tx_time: stark_latest_tx_time,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkInfo(address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            wallet_type: wallet_type,
                            create_time: deployed_at_timestamp,
                            stark_id: stark_id,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkBalances(address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            stark_eth_balance: eth_balance,
                            stark_usdc_balance: usdc_balance,
                            stark_usdt_balance: usdt_balance,
                            stark_dai_balance: dai_balance,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkActivity(address).then(({dayActivity, weekActivity, monthActivity}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            dayActivity: dayActivity,
                            weekActivity: weekActivity,
                            monthActivity: monthActivity,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkAmount(address).then(({stark_exchange_amount}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            stark_exchange_amount: stark_exchange_amount,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkBridge(address).then(({
                                                      d_eth_amount, d_eth_count,
                                                      d_usdc_amount, d_usdc_count,
                                                      d_usdt_amount, d_usdt_count,
                                                      d_dai_amount, d_dai_count,
                                                      d_wbtc_amount,
                                                      d_wbtc_count,
                                                      w_eth_amount, w_eth_count,
                                                      w_usdc_amount, w_usdc_count,
                                                      w_usdt_amount, w_usdt_count,
                                                      w_dai_amount, w_dai_count,
                                                      w_wbtc_amount, w_wbtc_count,
                                                      total_widthdraw_count, total_deposit_count
                                                  }) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            d_eth_amount: d_eth_amount,
                            d_eth_count: d_eth_count,
                            d_usdc_amount: d_usdc_amount,
                            d_usdc_count: d_usdc_count,
                            d_usdt_amount: d_usdt_amount,
                            d_usdt_count: d_usdt_count,
                            d_dai_amount: d_dai_amount,
                            d_dai_count: d_dai_count,
                            d_wbtc_amount: d_wbtc_amount,
                            d_wbtc_count: d_wbtc_count,
                            w_eth_amount: w_eth_amount,
                            w_eth_count: w_eth_count,
                            w_usdc_amount: w_usdc_amount,
                            w_usdc_count: w_usdc_count,
                            w_usdt_amount: w_usdt_amount,
                            w_usdt_count: w_usdt_count,
                            w_dai_amount: w_dai_amount,
                            w_dai_count: w_dai_count,
                            w_wbtc_amount: w_wbtc_amount,
                            w_wbtc_count: w_wbtc_count,
                            total_widthdraw_count: total_widthdraw_count,
                            total_deposit_count: total_deposit_count,
                        };
                    })
                await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    const newEntry = {
                        key: newData.length.toString(),
                        address: address,
                        stark_eth_balance: null,
                        stark_usdc_balance: null,
                        stark_usdt_balance: null,
                        stark_dai_balance: null,
                        dayActivity: null,
                        weekActivity: null,
                        monthActivity: null,
                        stark_exchange_amount: null,
                        stark_id: null,
                        create_time: null,
                        d_eth_amount: null,
                        d_eth_count: null,
                        d_usdc_amount: null,
                        d_usdc_count: null,
                        d_usdt_amount: null,
                        d_usdt_count: null,
                        d_dai_amount: null,
                        d_dai_count: null,
                        d_wbtc_amount: null,
                        d_wbtc_count: null,
                        w_eth_amount: null,
                        w_eth_count: null,
                        w_usdc_amount: null,
                        w_usdc_count: null,
                        w_usdt_amount: null,
                        w_usdt_count: null,
                        w_dai_amount: null,
                        w_dai_count: null,
                        w_wbtc_amount: null,
                        w_wbtc_count: null,
                        stark_tx_amount: null,
                        stark_latest_tx: null,
                        stark_latest_tx_time: null,
                        total_deposit_count: null,
                        total_widthdraw_count: null

                    };
                    newData.push(newEntry);
                    setData(newData);
                    getStarkTx(address).then(({tx, stark_latest_tx_time}) => {
                        newEntry.stark_tx_amount = tx;
                        newEntry.stark_latest_tx_time = stark_latest_tx_time;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkInfo(address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                        newEntry.wallet_type = wallet_type;
                        newEntry.create_time = deployed_at_timestamp;
                        newEntry.stark_id = stark_id;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkBalances(address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                        newEntry.stark_eth_balance = eth_balance;
                        newEntry.stark_usdc_balance = usdc_balance;
                        newEntry.stark_usdt_balance = usdt_balance;
                        newEntry.stark_dai_balance = dai_balance;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkActivity(address).then(({dayActivity, weekActivity, monthActivity}) => {
                        newEntry.dayActivity = dayActivity;
                        newEntry.weekActivity = weekActivity;
                        newEntry.monthActivity = monthActivity;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkAmount(address).then(({stark_exchange_amount}) => {
                        newEntry.stark_exchange_amount = stark_exchange_amount;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkBridge(address).then(({
                                                      d_eth_amount, d_eth_count,
                                                      d_usdc_amount, d_usdc_count,
                                                      d_usdt_amount, d_usdt_count,
                                                      d_dai_amount, d_dai_count,
                                                      d_wbtc_amount,
                                                      d_wbtc_count,
                                                      w_eth_amount, w_eth_count,
                                                      w_usdc_amount, w_usdc_count,
                                                      w_usdt_amount, w_usdt_count,
                                                      w_dai_amount, w_dai_count,
                                                      w_wbtc_amount, w_wbtc_count,
                                                      total_widthdraw_count, total_deposit_count
                                                  }) => {
                        newEntry.d_eth_amount = d_eth_amount;
                        newEntry.d_eth_count = d_eth_count;
                        newEntry.d_usdc_amount = d_usdc_amount;
                        newEntry.d_usdc_count = d_usdc_count;
                        newEntry.d_usdt_amount = d_usdt_amount;
                        newEntry.d_usdt_count = d_usdt_count;
                        newEntry.d_dai_amount = d_dai_amount;
                        newEntry.d_dai_count = d_dai_count;
                        newEntry.d_wbtc_amount = d_wbtc_amount;
                        newEntry.d_wbtc_count = d_wbtc_count;
                        newEntry.w_eth_amount = w_eth_amount;
                        newEntry.w_eth_count = w_eth_count;
                        newEntry.w_usdc_amount = w_usdc_amount;
                        newEntry.w_usdc_count = w_usdc_count;
                        newEntry.w_usdt_amount = w_usdt_amount;
                        newEntry.w_usdt_count = w_usdt_count;
                        newEntry.w_dai_amount = w_dai_amount;
                        newEntry.w_dai_count = w_dai_count;
                        newEntry.w_wbtc_amount = w_wbtc_amount;
                        newEntry.w_wbtc_count = w_wbtc_count;
                        newEntry.total_widthdraw_count = total_widthdraw_count;
                        newEntry.total_deposit_count = total_deposit_count;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    }) 
                await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            setIsBatchModalVisible(false);
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            });
        } finally {
            batchForm.resetFields();
            setSelectedKeys([]);
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
            const limit = 20;
            let activePromises = 0;
            let promisesQueue = [];
            const newData = [...data];
            let timestampsArray = [];
            const processQueue = () => {
                while (activePromises < limit && promisesQueue.length > 0) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    item.stark_tx_amount = null;
                    item.stark_latest_tx = null;
                    item.stark_latest_tx_time = null;
                    item.stark_eth_balance = null;
                    item.stark_usdc_balance = null;
                    item.stark_usdt_balance = null;
                    item.stark_dai_balance = null;
                    item.d_eth_amount = null;
                    item.d_eth_count = null;
                    item.d_usdc_amount = null;
                    item.d_usdc_count = null;
                    item.d_usdt_amount = null;
                    item.d_usdt_count = null;
                    item.d_dai_amount = null;
                    item.d_dai_count = null;
                    item.d_wbtc_amount = null;
                    item.d_wbtc_count = null;
                    item.w_eth_amount = null;
                    item.w_eth_count = null;
                    item.w_usdc_amount = null;
                    item.w_usdc_count = null;
                    item.w_usdt_amount = null;
                    item.w_usdt_count = null;
                    item.w_dai_amount = null;
                    item.w_dai_count = null;
                    item.w_wbtc_amount = null;
                    item.w_wbtc_count = null;
                    item.total_widthdraw_count = null;
                    item.total_deposit_count = null;
                    setData([...newData]);
                    promisesQueue.push(() => {
                        return getStarkTx(item.address).then(({tx, stark_latest_tx_time, stark_timestamps}) => {
                        item.stark_tx_amount = tx;
                        item.stark_latest_tx_time = stark_latest_tx_time;
                        timestampsArray.push(stark_timestamps);
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })})
                    // promisesQueue.push(() => {
                    //     return getStarkInfo(item.address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                    //         item.wallet_type = wallet_type;
                    //         item.create_time = deployed_at_timestamp;
                    //         item.stark_id = stark_id;
                    //         setData([...newData]);
                    //         localStorage.setItem('stark_addresses', JSON.stringify(data));
                    //     })
                    // })
                    // promisesQueue.push(() => {
                    //     return getStarkBalances(item.address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                    //     item.stark_eth_balance = eth_balance;
                    //     item.stark_usdc_balance = usdc_balance;
                    //     item.stark_usdt_balance = usdt_balance;
                    //     item.stark_dai_balance = dai_balance;
                    //     setData([...newData]);
                    //     localStorage.setItem('stark_addresses', JSON.stringify(data));
                    // })})
                    promisesQueue.push(() => {
                        return getStarkBalances(item.address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                        item.stark_eth_balance = eth_balance;
                        item.stark_usdc_balance = usdc_balance;
                        item.stark_usdt_balance = usdt_balance;
                        item.stark_dai_balance = dai_balance;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })})
                    // promisesQueue.push(() => {
                    //     return getStarkActivity(item.address).then(({dayActivity, weekActivity, monthActivity}) => {
                    //     item.dayActivity = dayActivity;
                    //     item.weekActivity = weekActivity;
                    //     item.monthActivity = monthActivity;
                    //     setData([...newData]);
                    //     localStorage.setItem('stark_addresses', JSON.stringify(data));
                    // })})
                    // promisesQueue.push(() => {
                    //     return getStarkAmount(item.address).then(({stark_exchange_amount}) => {
                    //     item.stark_exchange_amount = stark_exchange_amount;
                    //     setData([...newData]);
                    //     localStorage.setItem('stark_addresses', JSON.stringify(data));
                    // })})
                    promisesQueue.push(() => {
                        return getStarkBridge(item.address).then(({
                            d_eth_amount, d_eth_count,
                            d_usdc_amount, d_usdc_count,
                            d_usdt_amount, d_usdt_count,
                            d_dai_amount, d_dai_count,
                            d_wbtc_amount,
                            d_wbtc_count,
                            w_eth_amount, w_eth_count,
                            w_usdc_amount, w_usdc_count,
                            w_usdt_amount, w_usdt_count,
                            w_dai_amount, w_dai_count,
                            w_wbtc_amount, w_wbtc_count,
                            total_widthdraw_count, total_deposit_count
                        }) => {
                            item.d_eth_amount = d_eth_amount;
                            item.d_eth_count = d_eth_count;
                            item.d_usdc_amount = d_usdc_amount;
                            item.d_usdc_count = d_usdc_count;
                            item.d_usdt_amount = d_usdt_amount;
                            item.d_usdt_count = d_usdt_count;
                            item.d_dai_amount = d_dai_amount;
                            item.d_dai_count = d_dai_count;
                            item.d_wbtc_amount = d_wbtc_amount;
                            item.d_wbtc_count = d_wbtc_count;
                            item.w_eth_amount = w_eth_amount;
                            item.w_eth_count = w_eth_count;
                            item.w_usdc_amount = w_usdc_amount;
                            item.w_usdc_count = w_usdc_count;
                            item.w_usdt_amount = w_usdt_amount;
                            item.w_usdt_count = w_usdt_count;
                            item.w_dai_amount = w_dai_amount;
                            item.w_dai_count = w_dai_count;
                            item.w_wbtc_amount = w_wbtc_amount;
                            item.w_wbtc_count = w_wbtc_count;
                            item.total_widthdraw_count = total_widthdraw_count;
                            item.total_deposit_count = total_deposit_count;
                            setData([...newData]);
                            localStorage.setItem('stark_addresses', JSON.stringify(data));
                        })
                    })
                }
            processQueue();
            }
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            const stark_timestamps = timestampsArray.flat()
            localStorage.setItem('stark_timestamps', JSON.stringify(stark_timestamps));
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    item.dayActivity = null;
                    item.weekActivity = null;
                    item.monthActivity = null;
                    item.stark_exchange_amount = null;
                    if (item.wallet_type === "Error" || item.wallet_type === undefined) {
                        getStarkInfo(item.address).then(({wallet_type, deployed_at_timestamp, stark_id}) => {
                            item.wallet_type = wallet_type;
                            item.create_time = deployed_at_timestamp;
                            item.stark_id = stark_id;
                            setData([...newData]);
                            localStorage.setItem('stark_addresses', JSON.stringify(newData));
                        })
                    }
                    getStarkActivity(item.address).then(({dayActivity, weekActivity, monthActivity}) => {
                        item.dayActivity = dayActivity;
                        item.weekActivity = weekActivity;
                        item.monthActivity = monthActivity;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkAmount(item.address).then(({stark_exchange_amount}) => {
                        item.stark_exchange_amount = stark_exchange_amount;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
        }
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
    const handleQuickRefresh = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要刷新的地址",
            }, 2);
            return;
        }
        setIsLoading(true);
        try {
            const limit = 20;
            let activePromises = 0;
            let promisesQueue = [];
            const newData = [...data];
            let timestampsArray = [];
            const processQueue = () => {
                while (activePromises < limit && promisesQueue.length > 0) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    item.stark_tx_amount = null;
                    item.stark_latest_tx_time = null;
                    item.stark_eth_balance = null;
                    item.stark_usdc_balance = null;
                    item.stark_usdt_balance = null;
                    item.stark_dai_balance = null;
                    setData([...newData]);
                    promisesQueue.push(() => {
                        return getStarkTx(item.address).then(({tx, stark_latest_tx_time, stark_timestamps}) => {
                        item.stark_tx_amount = tx;
                        item.stark_latest_tx_time = stark_latest_tx_time;
                        timestampsArray.push(stark_timestamps);
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })})
                    promisesQueue.push(() => {
                        return getStarkBalances(item.address).then(({eth_balance, usdc_balance, usdt_balance, dai_balance}) => {
                        item.stark_eth_balance = eth_balance;
                        item.stark_usdc_balance = usdc_balance;
                        item.stark_usdt_balance = usdt_balance;
                        item.stark_dai_balance = dai_balance;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })})
                }
            processQueue();
            }
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            const stark_timestamps = timestampsArray.flat()
            localStorage.setItem('stark_timestamps', JSON.stringify(stark_timestamps));
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
    const handleDeleteSelected = () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
            }, 2);
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const exportToExcelFile = () => {
        exportToExcel(data, 'starkInfo');
    }
    const [editingKey, setEditingKey] = useState(null);
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
            width: 60,
        },
        {
            title: "备注",
            dataIndex: "name",
            key: "name",
            align: "center",
            className: "name",
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
            width: 100,
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
                return  (text === null ? <Spin/> : text.slice(0, 6) + "..." + text.slice(-6))
            },
            width: 140, 
        },
        {
            title: (
                <span>
                starkId
                    <span onClick={toggleHideColumn} style={{ marginLeft: 8, cursor: 'pointer' }}>
                        {getEyeIcon()}
                    </span>
                </span>
            ),
            dataIndex: "stark_id",
            key: "stark_id",
            align: "center",
            className: "stark_id",
            render: (text, record) =>{
                if (hideColumn) {
                    return '***';
                  }
                return  (text === null ? <Spin/> : text)
            },
            width: 100, 
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            key: "create_time",
            align: "center",
            className: "create_time",
            render: (text, record) => {
                if (text === null) {
                    return <Spin/>;
                } else {
                    let date = new Date(text * 1000);
                    let year = date.getFullYear();
                    let month = (date.getMonth() + 1).toString().padStart(2, '0');
                    let day = date.getDate().toString().padStart(2, '0');
                    return `${year}/${month}/${day}`;
                }
            },
            width: 100,
        },
        {
            title: "钱包类型",
            dataIndex: "wallet_type",
            key: "wallet_type",
            align: "center",
            className: "wallet_type",
            render: (text, record) => {
                if (text === null) {
                    return <Spin/>;
                } else if (text === undefined || text === "Error") {
                    return "/"
                } else {
                    return text?.slice(0, -5);
                }
            },
            width: 80,
        },
        {
            title: "StarkNet   🔴建议减少刷新次数",
            className: "starkNet",
            children: [
                {
                    title: "ETH",
                    dataIndex: "stark_eth_balance",
                    key: "stark_eth_balance",
                    align: "center",
                    render: (text, record) => text === null ? <Spin/> : text,
                    width: 70,
                },
                {
                    title: "USDC",
                    dataIndex: "stark_usdc_balance",
                    key: "stark_usdc_balance",
                    align: "center",
                    render: (text, record) => text === null ? <Spin/> : text,
                    width: 70,
                },
                {
                    title: "USDT",
                    dataIndex: "stark_usdt_balance",
                    key: "stark_usdt_balance",
                    align: "center",
                    render: (text, record) => text === null ? <Spin/> : text,
                    width: 70,
                },
                {
                    title: "DAI",
                    dataIndex: "stark_dai_balance",
                    key: "stark_dai_balance",
                    align: "center",
                    render: (text, record) => text === null ? <Spin/> : text,
                    width: 70,
                },
                {
                    title: "Tx",
                    dataIndex: "stark_tx_amount",
                    key: "stark_tx_amount",
                    align: "center",
                    sorter: (a, b) => a.stark_tx_amount - b.stark_tx_amount,
                    render: (text, record) => {
                        if (text === null) {
                          return <Spin />;
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
                    width: 70,
                },
                // {
                //     title: "最后交易时间",
                //     dataIndex: "stark_latest_tx",
                //     key: "stark_latest_tx",
                //     align: "center",
                //     render: (text, record) => text === null ? <Spin/> : text,
                //     width: 100,
                // },
                {
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
                    width: 70,
                },
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
                            width: 60
                        },
                        {
                            title: "周",
                            dataIndex: "weekActivity",
                            key: "weekActivity",
                            align: "center",
                            sorter: (a, b) => a.weekActivity - b.weekActivity,
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 60
                        },
                        {
                            title: "月",
                            dataIndex: "monthActivity",
                            key: "monthActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            width: 60
                        },
                        {
                            title: "交易金额",
                            dataIndex: "stark_exchange_amount",
                            key: "stark_exchange_amount",
                            align: "center",
                            sorter: (a, b) => a.stark_exchange_amount - b.stark_exchange_amount,
                            render: (text, record) => {
                                if (text === null) {
                                  return <Spin />;
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
                          
                                const backgroundColor = `rgba(211, 211, 211, ${opacity})`; 
                          
                                return {
                                  children: text,
                                  props: {
                                    style: {
                                      background: backgroundColor,
                                    },
                                  },
                                };
                              },
                              width: 100
                        },
                    ]
                },
                {
                    title: "官方桥Tx数量",
                    className: "stark_cross_tx",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: "total_deposit_count",
                            key: "12cross_total_tx",
                            align: "center",
                            render: (text, record) => (
                                <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
                                    {text === null ? <Spin /> : text}
                                </span>
                            ),
                            width: 60,
                                
                        },
                        {
                            title: "L2->L1",
                            dataIndex: "total_widthdraw_count",
                            key: "21cross_total_tx",
                            align: "center",
                            render: (text, record) => text === null ? <Spin/> : text,
                            width: 60,
                        },
                    ]
                },
                {
                    title: "官方桥跨链额",
                    className: "stark_cross_amount",
                    children: [
                        {
                            title: "L1->L2",
                            children: [
                                {
                                    title: "ETH",
                                    dataIndex: "d_eth_amount",
                                    key: "12cross_eth_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                },
                                {
                                    title: "USDT",
                                    dataIndex: "d_usdt_amount",
                                    key: "12cross_usdt_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                },
                                {
                                    title: "USDC",
                                    dataIndex: "d_usdc_amount",
                                    key: "12cross_usdc_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                },
                            ]
                        },
                        {
                            title: "L2->L1",
                            className: "cross21",
                            children: [
                                {
                                    title: "ETH",
                                    dataIndex: "w_eth_amount",
                                    key: "21cross_eth_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                },
                                {
                                    title: "USDT",
                                    dataIndex: "w_usdt_amount",
                                    key: "21cross_usdt_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                },
                                {
                                    title: "USDC",
                                    dataIndex: "w_usdc_amount",
                                    key: "21cross_usdc_amount",
                                    align: "center",
                                    render: (text, record) => text === null ? <Spin/> : text,
                                    width: 60,
                                }
                            ]
                        }

                    ]

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
                    width: 60,
                }
            ]
        },
    ];
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={() => {
                           setIsBatchModalVisible(false)
                           batchForm.resetFields()
                       }}
                       okText={"添加地址"}
                       cancelText={"取消"}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个"
                                      style={{width: "500px", height: "200px"}}
                            />
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
                        style={{marginBottom: "0px"}}
                        size={"small"}
                        columns={columns}
                        scroll={{
                            y: tableHeight
                          }}
                        summary={pageData => {
                            let starkEthBalance = 0;
                            let starkUsdcBalance = 0;
                            let starkUsdtBalance = 0;
                            let starkDaiBalance = 0;
                            pageData.forEach(({
                                                  stark_eth_balance,
                                                  stark_usdc_balance,
                                                  stark_usdt_balance,
                                                  stark_dai_balance,
                                              }) => {
                                starkEthBalance += Number(stark_eth_balance);
                                starkUsdcBalance += Number(stark_usdc_balance);
                                starkUsdtBalance += Number(stark_usdt_balance);
                                starkDaiBalance += Number(stark_dai_balance);
                            })

                            const emptyCells = Array(15).fill().map((_, index) => <Table.Summary.Cell key={index} index={index + 10}/>);

                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={7}>总计</Table.Summary.Cell>
                                        <Table.Summary.Cell index={6}>{starkEthBalance.toFixed(4)}</Table.Summary.Cell>
                                        <Table.Summary.Cell index={7}>{starkUsdcBalance.toFixed(2)}</Table.Summary.Cell>
                                        <Table.Summary.Cell index={8}>{starkUsdtBalance.toFixed(2)}</Table.Summary.Cell>
                                        <Table.Summary.Cell index={9}>{starkDaiBalance.toFixed(2)}</Table.Summary.Cell>
                                        {emptyCells}
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                    
                    footer={() => (
                        <Card>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={handleQuickRefresh} loading={isLoading} size={"large"}
                                        style={{width: "16%"}}
                                        icon={<SyncOutlined/>}>
                                    快速刷新选中地址
                            </Button>
                            <Button type="primary" onClick={handleRefresh} loading={isLoading} size={"large"}
                                        style={{width: "16%"}}
                                        icon={<SyncOutlined/>}>
                                    刷新选中地址（慢）
                            </Button>
                            <Button type="primary" onClick={() => {
                                setIsModalVisible(true)
                            }} size={"large"} style={{width: "16%"}} icon={<PlusOutlined/>}>
                                添加地址
                            </Button>
                            <Button type="primary" onClick={() => {
                                setIsBatchModalVisible(true)
                            }} size={"large"} style={{width: "16%"}} icon={<UploadOutlined/>}>
                                批量添加地址
                            </Button>
                            <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                        onConfirm={handleDeleteSelected}>
                                <Button type="primary" danger size={"large"}
                                        style={{width: "16%"}}
                                        icon={<DeleteOutlined/>}>
                                    删除选中地址
                                </Button>
                            </Popconfirm>
                            <Button type="primary" icon={<DownloadOutlined/>} size={"large"} style={{width: "8%"}}
                                    onClick={exportToExcelFile}
                            />
                        </div>
                    </Card>
                    )}
                    />
                </Spin>
            </Content>
        </div>
    )
}
export default Stark;
