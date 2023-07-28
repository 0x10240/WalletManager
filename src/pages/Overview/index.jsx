import React from 'react';
import {useEffect, useState} from 'react';
import {Layout, Typography, Button, message, Space, Card, Row, Col} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { getEthPrice } from '@/utils';

const {Content} = Layout;
const {Title, Text} = Typography;

const Overview = () => {

    const zksAddresses = localStorage.getItem('addresses');
    const starkAddresses = localStorage.getItem('stark_addresses');
    const l0Addresses = localStorage.getItem('l0_addresses');

    const zksAddressList = zksAddresses ? JSON.parse(zksAddresses) : [];
    const starkAddressList = starkAddresses ? JSON.parse(starkAddresses) : [];
    const l0AddressList = l0Addresses ? JSON.parse(l0Addresses) : [];

    const zksAddressCount = zksAddressList.length;
    const starkAddressCount = starkAddressList.length;
    const l0AddressCount = l0AddressList.length;
    const accountCount = zksAddressCount + starkAddressCount + l0AddressCount;
    const accountOption = {
        title : {
            text: '账号总览',
            subtext: `账号总数 ${accountCount}`,
            x:'center'
          },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          top: '5%',
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '账号总览',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: zksAddressCount, name: 'zkSync Era' },
              { value: starkAddressCount, name: 'StarkNet' },
              { value: l0AddressCount, name: 'LayerZero' }
            ]
          }
        ]
      };
    
    const totalzksEthBalance = zksAddressList.reduce((total, addressData) => {
    if ('eth_balance' in addressData) {
        const ethBalance = parseFloat(addressData.eth_balance);
        return total + ethBalance;
    }
        return total;
    }, 0);
    const totalzks1Balance = zksAddressList.reduce((total, addressData) => {
        if ('zks1_balance' in addressData) {
            const zks1_balance = parseFloat(addressData.zks1_balance);
            return total + zks1_balance;
        }
            return total;
    }, 0);
    const totalzks2Balance = zksAddressList.reduce((total, addressData) => {
        if ('zks2_balance' in addressData) {
            const zks2_balance = parseFloat(addressData.zks2_balance);
            return total + zks2_balance;
        }
            return total;
    }, 0);
    const totalzks2UsdcBalance = zksAddressList.reduce((total, addressData) => {
        if ('zks2_usdcBalance' in addressData) {
            const zks2_usdcBalance = parseFloat(addressData.zks2_usdcBalance);
            return total + zks2_usdcBalance;
        }
            return total;
    }, 0);
    const totalstarkEthBalance = starkAddressList.reduce((total, addressData) => {
        if ('stark_eth_balance' in addressData) {
            const stark_eth_balance = parseFloat(addressData.stark_eth_balance);
            return total + stark_eth_balance;
        }
            return total;
    }, 0);
    const totalstarkUsdcBalance = starkAddressList.reduce((total, addressData) => {
        if ('stark_usdc_balance' in addressData) {
            const stark_usdc_balance = parseFloat(addressData.stark_usdc_balance);
            return total + stark_usdc_balance;
        }
            return total;
    }, 0);
    const totalstarkUsdtBalance = starkAddressList.reduce((total, addressData) => {
        if ('stark_usdt_balance' in addressData) {
            const stark_usdt_balance = parseFloat(addressData.stark_usdt_balance);
            return total + stark_usdt_balance;
        }
            return total;
    }, 0);
    const totalstarkDaiBalance = starkAddressList.reduce((total, addressData) => {
        if ('stark_eth_balance' in addressData) {
            const stark_eth_balance = parseFloat(addressData.stark_eth_balance);
            return total + stark_eth_balance;
        }
            return total;
    }, 0);
    const totalEth = parseFloat(totalzksEthBalance + totalzks1Balance + totalzks2Balance + totalstarkEthBalance).toFixed(2);
    const totalUsdc = parseFloat(totalzks2UsdcBalance + totalstarkUsdcBalance).toFixed(2);
    const totalUsdt = parseFloat(totalstarkUsdtBalance).toFixed(2);
    const totalDai = parseFloat(totalstarkDaiBalance).toFixed(2);
    const ethPrice = 1880;
    const totalBalance = parseFloat(totalEth * ethPrice + totalUsdc + totalUsdt + totalDai).toFixed(2);
    const valueOption = {
    title : {
        text: '资产总览',
        subtext: `资产总额 ${totalBalance} USD`,
        x:'center'
        },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        top: '5%',
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
        name: '资产总览',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
        },
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: [
            { value: totalEth * ethPrice, name: 'ETH' },
            { value: totalUsdc, name: 'USDC' },
            { value: totalUsdt, name: 'USDT' },
            { value: totalDai, name: 'DAI' }
        ]
        }
    ]
    };

    const emptyOption = {
        title : {
            text: '暂无数据',
            x:'center'
            },
    };
    return (
        <Layout>
            <Content>
                <Row>
                    <Col span={12}>
                        <Card>
                            <ReactEcharts option={accountOption} style={{ height: '300px' }} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <ReactEcharts option={valueOption} style={{ height: '300px' }} />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card>
                        <ReactEcharts option={emptyOption} style={{ height: '300px' }} />
                            </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Overview;
