import React from 'react';
import { Layout, Typography, Button, message, Space, Row, Col, QRCode } from 'antd';
import { QrcodeOutlined, CopyOutlined } from '@ant-design/icons';
// import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

const { Content } = Layout;
const { Title, Text } = Typography;

const Donate = () => {
    const ethAddress = "0x73702db438f38eb8547d82Ca7E58888888888888";
    const tronAddress = "TBasrQ56zk1uz37Ncto4WZvrHhkLyLuoye"
    const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)', // Subtracting Header height
        padding: '20px',
        backgroundColor: '#F0F2F5' // Adding a light grey background color
    };

    const qrCodeStyle = {
        marginTop: '20px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#fff', // Adding a white background to the QR code
        borderRadius: '8px', // Adding some rounded corners to the QR code background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centering content horizontally
        textAlign: 'center', // Centering content vertically
    };

    const textStyle = {
        marginBottom: '20px' // Adding some space below the text
    };

    const copyAddress = (type) => {
        if (type === 'eth') {
            copy(ethAddress);
        } else if (type === 'tron') {
            copy(tronAddress);
        }
        message.success('地址已复制到剪贴板');
    };

    return (
        <Layout>
            <Content style={contentStyle}>
                <Title level={3} style={textStyle}>如果你赚麻了 能不能交互一下我的地址🍂</Title>
                <div style={textStyle}>
                    <Row>
                        <Space>
                            <Text><strong>EVM地址：</strong>{ethAddress}</Text>

                            <Button icon={<CopyOutlined />} onClick={() => copyAddress("eth")}></Button>
                        </Space>
                    </Row>
                    <Row>
                        <Space>
                            <Text><strong>TRON地址：</strong>{tronAddress}</Text>
                            <Button icon={<CopyOutlined />} onClick={() => copyAddress("tron")}></Button>
                        </Space>
                    </Row>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={qrCodeStyle}>
                    <QRCode value={ethAddress} />
                    <Text>EVM地址</Text>
                </div>

                <div style={qrCodeStyle}>
                    <QRCode value={tronAddress} />
                    <Text>Tron地址</Text>
                </div>

                <div style={qrCodeStyle}>
                    <QRCode value="https://www.binance.com/cn/qr/dplke96001d6f9ff4638937635614ef22189"/>
                    <Text>Binance</Text>
                </div>
                </div>

            </Content>
        </Layout>
    );
}

export default Donate;
