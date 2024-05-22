import {useEffect, useState} from "react";
import {
    Button, Card, Form, Input, Layout, Modal, notification, Popconfirm, Space, Spin, Table, Tag, Typography
} from "antd";
import {checkSybil, exportToExcel, getLayerData} from "@utils";
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    FileSearchOutlined,
    PlusOutlined,
    SlidersOutlined,
    SyncOutlined,
    UploadOutlined,
} from "@ant-design/icons"
import {getLastTxTime} from "@utils/utils.js";

const {Link, Paragraph} = Typography;

const {Content} = Layout;
const {TextArea} = Input;

const Layer = () => {
    const [data, setData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [batchForm] = Form.useForm();
    const [changeApiForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [isChangeApiModalVisible, setIsChangeApiModalVisible] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('l0_api_key'));
    const [tableHeight, setTableHeight] = useState(0);
    const [hideColumn, setHideColumn] = useState(false);

    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
    };

    const getEyeIcon = () => {
        if (hideColumn) {
            return <EyeInvisibleOutlined/>;
        }
        return <EyeOutlined/>;
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

    const exportToExcelFile = () => {
        exportToExcel(data, 'LayerZeroInfo');
    }
    const handleDeleteSelected = () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误", description: "请先选择要删除的地址",
            }, 2);
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('l0_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('l0_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
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
                getLayerData(values.address).then((layerData) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        ...layerData
                    }
                    setData(updatedData);
                    localStorage.setItem('l0_addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                    ethereum: null,
                    optimism: null,
                    arbitrum: null,
                    avalanche: null,
                    base: null,
                    polygon: null,
                    bsc: null,
                    metis: null,
                    fantom: null,
                    aptos: null,
                    other: null,
                    total: null,
                };
                const newData = [...data, newEntry];
                setData(newData);

                getLayerData(values.address).then((layerData) => {
                    // 直接使用API返回的数据更新newEntry
                    Object.assign(newEntry, layerData);

                    setData([...newData]);

                    localStorage.setItem('l0_addresses', JSON.stringify(newData));
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
    const handleCheck = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要查询的地址",
            }, 2);
            return;
        }
        setIsLoading(true);
        try {
            const newData = [...data];
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    item.sybil = false;
                    setData([...newData]);
                    const { sybil } = await checkSybil(item.address);
                    item.sybil = sybil;
                    setData([...newData]);
                    localStorage.setItem('l0_addresses', JSON.stringify(data));
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
    const handleRefresh = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误", description: "请先选择要刷新的地址",
            }, 2);
            return;
        }
        setIsLoading(true);
        try {
            const newData = [...data];
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    setData([...newData]);

                    const layerData = await getLayerData(item.address);
                    Object.assign(item, layerData);

                    setData([...newData]);
                    localStorage.setItem('l0_addresses', JSON.stringify(data));
                }
            }
        } catch (error) {
            notification.error({
                message: "错误", description: error.message,
            }, 2);
        } finally {
            setIsLoading(false);
            setSelectedKeys([]);
        }
    };
    const handleBatchOk = async () => {
        try {
            const values = await batchForm.validateFields();
            const addresses = values['addresses'].split("\n");
            const newData = [...data];
            for (let address of addresses) {
                // 格式化和验证地址
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }
                address = address.trim();
                if (address.length !== 42) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的地址",
                    });
                    continue;
                }

                // 检查地址是否已存在于数据中
                const index = newData.findIndex(item => item.address === address);

                if (index !== -1) {
                    // 地址已存在，更新现有条目
                    const layerData = await getLayerData(address);
                    const updatedData = [...newData];
                    updatedData[index] = {
                        ...updatedData[index],
                        ...layerData
                    };
                    setData(updatedData);
                    localStorage.setItem('l0_addresses', JSON.stringify(updatedData));
                } else {
                    // 地址不存在，创建新条目
                    const newEntry = {
                        key: data.length.toString(),
                        name: values.name,
                        address: values.address,
                        ethereum: null,
                        optimism: null,
                        arbitrum: null,
                        avalanche: null,
                        base: null,
                        polygon: null,
                        bsc: null,
                        metis: null,
                        fantom: null,
                        aptos: null,
                        other: null,
                        total: null,
                    };

                    newData.push(newEntry);
                    setData([...newData]);  // 确保触发状态更新

                    // 获取新条目的数据
                    const layerData = await getLayerData(address);
                    Object.assign(newEntry, layerData);

                    setData([...newData]);  // 再次更新数据
                    localStorage.setItem('l0_addresses', JSON.stringify(newData));
                }
            }
            setIsBatchModalVisible(false);
        } catch (error) {
            notification.error({
                message: "错误", description: error.message,
            });
        } finally {
            batchForm.resetFields();
            setSelectedKeys([]);
        }
    }
    const [editingKey, setEditingKey] = useState(null);

    const columns = [{
        title: '#', key: 'index', render: (text, record, index) => index + 1, align: 'center', width: 40,
    }, {
        title: '备注', dataIndex: 'name', key: 'name', align: 'center', render: (text, record) => {
            const isEditing = record.key === editingKey;
            return isEditing ? (<Input
                placeholder="请输入备注"
                defaultValue={text}
                onPressEnter={(e) => {
                    record.name = e.target.value;
                    setData([...data]);
                    localStorage.setItem('l0_addresses', JSON.stringify(data));
                    setEditingKey(null);
                }}
            />) : (<>
                <Tag color="blue" onClick={() => setEditingKey(record.key)}>
                    {text}
                </Tag>
                {!text && (<Button
                    shape="circle"
                    icon={<EditOutlined/>}
                    size="small"
                    onClick={() => setEditingKey(record.key)}
                />)}
            </>);
        }, width: 80, sorter: (a, b) => a.name - b.name,
    }, {
        title: (<span>
                钱包地址
                    <span onClick={toggleHideColumn} style={{marginLeft: 8, cursor: 'pointer'}}>
                        {getEyeIcon()}
                    </span>
                </span>),
        dataIndex: 'address',
        key: 'address',
        align: 'center',
        render: (text, record) => {
            let displayText = hideColumn ? text.slice(0, 6) + "..." + text.slice(-6) : text;
            displayText = record.sybil ? <span style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: `${text}💥` }}></span> : text;
            return (
                <Paragraph copyable={{text: text}} style={{margin: 0}}>
                    <Link href={`https://layerzeroscan.com/address/${text}`} target="_blank">{displayText}</Link>
                </Paragraph>
            );
            // return displayText;
        },
        width: 350,
    }, {
        title: 'ETH', dataIndex: 'ethereum', key: 'ethereum', render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center', width: 80,
    }, {
        title: 'Polygon', dataIndex: 'polygon', key: 'polygon', render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center', width: 80,
    }, {
        title: 'Base', dataIndex: 'base', key: 'base', render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center', width: 80,
    }, {
        title: 'Bsc', dataIndex: 'bsc', key: 'bsc', render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center', width: 80,
    }, {
        title: 'Arb', dataIndex: 'arbitrum', key: 'arbitrum', width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center',
    }, {
        title: 'Op', dataIndex: 'optimism', key: 'optimism', width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center',
    }, {
        title: 'Avax', dataIndex: 'avalanche', key: 'avalanche', width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center',
    }, {
        title: 'Aptos', dataIndex: 'aptos', key: 'aptos', render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center', width: 80,
    }, {
        title: 'Ftm', dataIndex: 'fantom', key: 'fantom', width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center',
    }, {
        title: 'Metis', dataIndex: 'metis', key: 'metis', width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: 'center',
    }, {
        title: "Other", dataIndex: "other", key: "other", width: 80, render: (text, record) => {
            return (text === null ? <Spin/> : text)
        }, align: "center"
    }, {
        title: "Total",
        dataIndex: "total",
        key: "total",
        width: 80,
        render: (text, record) => {
            return (text === null ? <Spin/> : text)
        },
        align: "center",
        sorter:  (a, b) => a.total - b.total
    },
        {
            title: "月活跃", dataIndex: "active_months", key: "active_months", width: 80, render: (text, record) => {
                return (text === null ? <Spin/> : text)
            }, align: "center"
        },
        {
            title: "最后交易",
            dataIndex: "last_tx_time",
            key: "last_tx_time",
            width: 80,
            align: "center",
            render: (text, record) => {
                let last_text = getLastTxTime(text)
                return (last_text === null ? <Spin/> : last_text)
            },
            sorter: (a, b) => {
                let timeA = new Date(a.last_tx_time).getTime();
                let timeB = new Date(b.last_tx_time).getTime();

                return timeA - timeB;
            },
        },
        {
            title: "操作",
            key: "action",
            width: 80, render: (text, record) => {
                return (<Space size="small">
                    <Popconfirm title={"确定删除吗？"} onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>)
            }, align: 'center',
        }];
    useEffect(() => {
        setTableLoading(true)
        const storedAddresses = localStorage.getItem('l0_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
    }, []);
    const handleChangeApiOk = () => {
        localStorage.setItem('l0_api_key', JSON.stringify(changeApiForm.getFieldsValue()));
        setIsChangeApiModalVisible(false);
        setApiKey(JSON.parse(localStorage.getItem('l0_api_key')));
    }
    useEffect(() => {
        const storedApiKey = localStorage.getItem('l0_api_key');
        if (storedApiKey) {
            setApiKey(JSON.parse(storedApiKey));
            changeApiForm.setFieldsValue(JSON.parse(storedApiKey));
        }
    }, []);
    const rowSelection = {
        selectedRowKeys: selectedKeys, onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    return (<div>
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
            <Modal
                title={<>
                    <div>更换API Key</div>
                    <div style={{fontSize: '12px', color: '#888'}}>
                        <Space>
                            <Button type="link"
                                    onClick={() => window.open('https://etherscan.io/myapikey', '_blank')}>Eth</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://polygonscan.com/myapikey', '_blank')}>Matic</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://bscscan.com/myapikey', '_blank')}>Bsc</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://arbiscan.io/myapikey', '_blank')}>Arb</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://optimistic.etherscan.io/myapikey', '_blank')}>Op</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://snowtrace.io/myapikey', '_blank')}>Avax</Button>
                            <Button type="link"
                                    onClick={() => window.open('https://ftmscan.com/myapikey', '_blank')}>Ftm</Button>
                        </Space>
                    </div>
                </>}
                open={isChangeApiModalVisible} onOk={handleChangeApiOk}
                onCancel={() => setIsChangeApiModalVisible(false)}
                okText={"确定"}
                cancelText={"取消"}
            >
                <Form form={changeApiForm} layout="horizontal">
                    <Form.Item label="Eth" name="eth">
                        <Input placeholder="请输入Etherscan API Key"/>
                    </Form.Item>
                    <Form.Item label="Polygon" name="matic">
                        <Input placeholder="请输入Polygonscan API Key"/>
                    </Form.Item>
                    <Form.Item label="Bsc" name="bsc">
                        <Input placeholder="请输入Bscscan API Key"/>
                    </Form.Item>
                    <Form.Item label="Arb" name="arb">
                        <Input placeholder="请输入Arbitrumscan API Key"/>
                    </Form.Item>
                    <Form.Item label="Op" name="op">
                        <Input placeholder="请输入Optimismscan API Key"/>
                    </Form.Item>
                    <Form.Item label="Avax" name="avax">
                        <Input placeholder="请输入Avalanche API Key"/>
                    </Form.Item>
                    <Form.Item label="Ftm" name="ftm">
                        <Input placeholder="请输入Fantomscan API Key"/>
                    </Form.Item>
                </Form>
            </Modal>
            {/*<Tag color="blue" style={{marginBottom: "10px"}}>*/}
            {/*    获取数据使用的是作者的区块链浏览器API Key，用的人多可能会有卡顿报错的情况，如果有需要请自行更换API Key*/}
            {/*</Tag>*/}
            <Spin spinning={tableLoading}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowSelection={rowSelection}
                    pagination={false}
                    bordered={true}
                    size={"small"}
                    scroll={{y: tableHeight}}
                />
            </Spin>
            <Card>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <Button type="primary" onClick={handleRefresh} loading={isLoading} size={"large"}
                            style={{width: "15%"}}
                            icon={<SyncOutlined/>}>
                        刷新选中地址
                    </Button>
                    <Button type="primary" danger onClick={handleCheck} loading={isLoading} size={"large"}
                            style={{width: "15%"}}
                            icon={<FileSearchOutlined />}>
                        查询女巫(非本地)
                    </Button>
                    <Button type="primary" onClick={() => {
                        setIsModalVisible(true)
                    }} size={"large"} style={{width: "15%"}} icon={<PlusOutlined/>}>
                        添加地址
                    </Button>
                    <Button type="primary" onClick={() => {
                        setIsBatchModalVisible(true)
                    }} size={"large"} style={{width: "15%"}} icon={<UploadOutlined/>}>
                        批量添加地址
                    </Button>
                    <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                onConfirm={handleDeleteSelected}>
                        <Button type="primary" danger size={"large"}
                                style={{width: "15%"}}
                                icon={<DeleteOutlined/>}>
                            删除选中地址
                        </Button>
                    </Popconfirm>
                    <Button type="primary" onClick={() => {
                        setIsChangeApiModalVisible(true)
                    }} size={"large"}
                            style={{width: "15%"}} icon={<SlidersOutlined/>}>
                        更换API KEY
                    </Button>
                    <Button type="primary" icon={<DownloadOutlined/>} size={"large"} style={{width: "8%"}}
                            onClick={exportToExcelFile}
                    />
                </div>
            </Card>
        </Content>
    </div>)

}
export default Layer;
