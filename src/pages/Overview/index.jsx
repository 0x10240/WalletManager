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
    const zksProgress = zksAddressList.reduce((acc, entry) => {
        if ('progress' in entry) {
            acc.push(entry.progress);
        }
        return acc;
    }, []);
    const zksProgressIntervalCounts = zksProgress.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0
      });
    const starkProgress = starkAddressList.reduce((acc, entry) => {
        if ('progress' in entry) {
            acc.push(entry.progress);
        }
        return acc;
    }, []);
    const starkProgressIntervalCounts = starkProgress.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0
      });
    const progressOption = {
        title: {
            text: '任务进度分布',
            subtext: `zksync: ${zksProgress.length}  StarkNet: ${starkProgress.length}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            top: '1%',
            orient: 'vertical',
            left: 'left',
            data: ['zksync Era', 'StarkNet']
        },
        xAxis: {
          type: 'category',
          data: ['0-10%', '10%-20%', '20%-30%', '30%-40%', '40%-50%', '50%-60%', '60%-70%', '70%-80%', '80%-90%', '90%-100%'],
          axisLabel:{
    		interval: 0
    	    }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'zksync Era',
            data: [zksProgressIntervalCounts['0-10'], zksProgressIntervalCounts['10-20'], zksProgressIntervalCounts['20-30'], zksProgressIntervalCounts['30-40'], zksProgressIntervalCounts['40-50'], zksProgressIntervalCounts['50-60'], zksProgressIntervalCounts['60-70'], zksProgressIntervalCounts['70-80'], zksProgressIntervalCounts['80-90'], zksProgressIntervalCounts['90-100']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkProgressIntervalCounts['0-10'], starkProgressIntervalCounts['10-20'], starkProgressIntervalCounts['20-30'], starkProgressIntervalCounts['30-40'], starkProgressIntervalCounts['40-50'], starkProgressIntervalCounts['50-60'], starkProgressIntervalCounts['60-70'], starkProgressIntervalCounts['70-80'], starkProgressIntervalCounts['80-90'], starkProgressIntervalCounts['90-100']],
            type: 'bar'
          }
        ]
      };

    const zksTx = zksAddressList.reduce((acc, entry) => {
        if ('zks2_tx_amount' in entry) {
            if (typeof entry.zks2_tx_amount === 'number') {
                acc.push(entry.zks2_tx_amount);
            }
        }
        return acc;
    }, []);
    const zksTxIntervalCounts = zksTx.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        } else if (num > 100) {
            acc['100+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0,
        '100+': 0
      });
    const starkTx = starkAddressList.reduce((acc, entry) => {
        if ('stark_tx_amount' in entry) {
            if (typeof entry.stark_tx_amount === 'number') {
                acc.push(entry.stark_tx_amount);
            }
        }
        return acc;
    }, []);
    const starkTxIntervalCounts = starkTx.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        } else if (num > 100) {
            acc['100+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0,
        '100+': 0
      });
    const txOption = {
        title: {
            text: 'Tx数分布',
            subtext: `zkSyncEra平均tx ${parseInt(zksTx.reduce((acc, num) => acc + num, 0) / zksTx.length)}  StarkNet平均Tx ${parseInt(starkTx.reduce((acc, num) => acc + num, 0) / starkTx.length)}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            top: '1%',
            orient: 'vertical',
            left: 'left',
            data: ['zksync Era', 'StarkNet']
        },
        xAxis: {
          type: 'category',
          data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', '100+'],
          axisLabel:{
    		interval: 0
    	    }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'zksync Era',
            data: [zksTxIntervalCounts['0-10'], zksTxIntervalCounts['10-20'], zksTxIntervalCounts['20-30'], zksTxIntervalCounts['30-40'], zksTxIntervalCounts['40-50'], zksTxIntervalCounts['50-60'], zksTxIntervalCounts['60-70'], zksTxIntervalCounts['70-80'], zksTxIntervalCounts['80-90'], zksTxIntervalCounts['90-100'], zksTxIntervalCounts['100+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkTxIntervalCounts['0-10'], starkTxIntervalCounts['10-20'], starkTxIntervalCounts['20-30'], starkTxIntervalCounts['30-40'], starkTxIntervalCounts['40-50'], starkTxIntervalCounts['50-60'], starkTxIntervalCounts['60-70'], starkTxIntervalCounts['70-80'], starkTxIntervalCounts['80-90'], starkTxIntervalCounts['90-100'], starkTxIntervalCounts['100+']],
            type: 'bar'
          }
        ]
      };
    const zksDayActivity = zksAddressList.reduce((acc, entry) => {
        if ('dayActivity' in entry) {
            if (typeof entry.dayActivity === 'number') {
                acc.push(entry.dayActivity);
            }
        }
        return acc;
    }, []);
    const zksActivityIntervalCounts = zksDayActivity.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        } else if (num > 100) {
            acc['100+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0,
        '100+': 0
      });
    const starkDayActivity = starkAddressList.reduce((acc, entry) => {
        if ('dayActivity' in entry) {
            if (typeof entry.dayActivity === 'number') {
                acc.push(entry.dayActivity);
            }
        }
        return acc;
    }, []);
    const starkActivityIntervalCounts = starkDayActivity.reduce((acc, num) => {
        if (num >= 0 && num <= 10) {
            acc['0-10']++;
        } else if (num > 10 && num <= 20) {
            acc['10-20']++;
        } else if (num > 20 && num <= 30) {
            acc['20-30']++;
        } else if (num > 30 && num <= 40) {
            acc['30-40']++;
        } else if (num > 40 && num <= 50) {
            acc['40-50']++;
        } else if (num > 50 && num <= 60) {
            acc['50-60']++;
        } else if (num > 60 && num <= 70) {
            acc['60-70']++;
        } else if (num > 70 && num <= 80) {
            acc['70-80']++;
        } else if (num > 80 && num <= 90) {
            acc['80-90']++;
        } else if (num > 90 && num <= 100) {
            acc['90-100']++;
        } else if (num > 100) {
            acc['100+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-100': 0,
        '100+': 0
      });
    const dayActivityOption = {
        title: {
            text: '日活跃天数分布',
            subtext: `zkSyncEra平均日活 ${parseInt(zksDayActivity.reduce((acc, num) => acc + num, 0) / zksDayActivity.length)}  StarkNet平均日活 ${parseInt(starkDayActivity.reduce((acc, num) => acc + num, 0) / starkDayActivity.length)}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            top: '1%',
            orient: 'vertical',
            left: 'left',
            data: ['zksync Era', 'StarkNet']
        },
        xAxis: {
          type: 'category',
          data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', '100+'],
          axisLabel:{
    		interval: 0
    	    }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'zksync Era',
            data: [zksActivityIntervalCounts['0-10'], zksActivityIntervalCounts['10-20'], zksActivityIntervalCounts['20-30'], zksActivityIntervalCounts['30-40'], zksActivityIntervalCounts['40-50'], zksActivityIntervalCounts['50-60'], zksActivityIntervalCounts['60-70'], zksActivityIntervalCounts['70-80'], zksActivityIntervalCounts['80-90'], zksActivityIntervalCounts['90-100'], zksActivityIntervalCounts['100+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkActivityIntervalCounts['0-10'], starkActivityIntervalCounts['10-20'], starkActivityIntervalCounts['20-30'], starkActivityIntervalCounts['30-40'], starkActivityIntervalCounts['40-50'], starkActivityIntervalCounts['50-60'], starkActivityIntervalCounts['60-70'], starkActivityIntervalCounts['70-80'], starkActivityIntervalCounts['80-90'], starkActivityIntervalCounts['90-100'], starkActivityIntervalCounts['100+']],
            type: 'bar'
          }
        ]
      };
    const zksExchangeAmount = zksAddressList.reduce((acc, entry) => {
        if ('totalExchangeAmount' in entry) {
            acc.push(entry.totalExchangeAmount);
        }
        return acc;
    }, []);
    const zksExchangeAmountIntervalCounts = zksExchangeAmount.reduce((acc, num) => {
        if (num >= 0 && num <= 1000) {
            acc['0-1k']++;
        } else if (num > 1000 && num <= 10000) {
            acc['1k-1w']++;
        } else if (num > 10000 && num <= 50000) {
            acc['1w-5w']++;
        } else if (num > 50000 && num <= 250000) {
            acc['5w-25w']++;
        } else if (num > 250000) {
            acc['25w+']++;
        }
        return acc;
      }, {
        '0-1k': 0,
        '1k-1w': 0,
        '1w-5w': 0,
        '5w-25w': 0,
        '25w+': 0
      });
    const starkExchangeAmount = starkAddressList.reduce((acc, entry) => {
        if ('stark_exchange_amount' in entry) {
            acc.push(entry.stark_exchange_amount);
        }
        return acc;
    }, []);
    const starkExchangeAmountIntervalCounts = starkExchangeAmount.reduce((acc, num) => {
        if (num >= 0 && num <= 1000) {
            acc['0-1k']++;
        } else if (num > 1000 && num <= 10000) {
            acc['1k-1w']++;
        } else if (num > 10000 && num <= 50000) {
            acc['1w-5w']++;
        } else if (num > 50000 && num <= 250000) {
            acc['5w-25w']++;
        } else if (num > 250000) {
            acc['25w+']++;
        }
        return acc;
      }, {
        '0-1k': 0,
        '1k-1w': 0,
        '1w-5w': 0,
        '5w-25w': 0,
        '25w+': 0
    });
    const exchangeAmountOption = {
        title: {
            text: '交易额分布',
            subtext: `zkSyncEra平均交易额 ${parseInt(zksExchangeAmount.reduce((acc, num) => acc + parseInt(num), 0) / zksExchangeAmount.length)}  StarkNet平均交易额 ${parseInt(starkExchangeAmount.reduce((acc, num) => acc + parseInt(num), 0) / starkExchangeAmount.length)}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            top: '1%',
            orient: 'vertical',
            left: 'left',
            data: ['zksync Era', 'StarkNet']
        },
        xAxis: {
          type: 'category',
          data: ['0-1k', '1k-1w', '1w-5w', '5w-25w', '25w+'],
          axisLabel:{
    		interval: 0
    	    }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'zksync Era',
            data: [zksExchangeAmountIntervalCounts['0-1k'], zksExchangeAmountIntervalCounts['1k-1w'], zksExchangeAmountIntervalCounts['1w-5w'], zksExchangeAmountIntervalCounts['5w-25w'], zksExchangeAmountIntervalCounts['25w+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkExchangeAmountIntervalCounts['0-1k'], starkExchangeAmountIntervalCounts['1k-1w'], starkExchangeAmountIntervalCounts['1w-5w'], starkExchangeAmountIntervalCounts['5w-25w'], starkExchangeAmountIntervalCounts['25w+']],
            type: 'bar'
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
                    <Col span={12}>
                        <Card>
                        <ReactEcharts option={progressOption} style={{ height: '400px' }} />
                            </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                        <ReactEcharts option={txOption} style={{ height: '400px' }} />
                            </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Card>
                        <ReactEcharts option={dayActivityOption} style={{ height: '400px' }} />
                            </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                        <ReactEcharts option={exchangeAmountOption} style={{ height: '400px' }} />
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
