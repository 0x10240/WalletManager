import React from 'react';
import {useEffect, useState} from 'react';
import {Layout, Typography, Button, message, Space, Card, Row, Col, notification} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { getEthPrice } from '@/utils';

const {Content} = Layout;
const {Title, Text} = Typography;

const Overview = () => {
    
    const [latestVersion, setLatestVersion] = useState('');
    const [commitMessage, setCommitMessage] = useState('');

    useEffect(() => {
        // Function to fetch the latest version from GitHub API
        const fetchLatestVersion = () => {
          const url = "https://api.github.com/repos/luoyeETH/MyWalletScan/commits?per_page=1";
          fetch(url)
            .then(res => res.json())
            .then(res => {
              const version = res[0].sha;
              const message = res[0].commit.message;
              setLatestVersion(version);
              setCommitMessage(message);
            })
            .catch(error => {
              console.error('Error fetching latest version:', error);
            });
        };
    
        // Fetch the latest version on component mount
        fetchLatestVersion();
    
        // Schedule fetching the latest version every 10 mins
        const interval = setInterval(fetchLatestVersion, 600000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
      }, []);
    
      // Function to compare the latest version with the locally stored version
      const checkVersion = () => {
        const locallyStoredVersion = localStorage.getItem('version');
        if (locallyStoredVersion && latestVersion && locallyStoredVersion !== latestVersion) {
          // Perform actions when a new version is available
          notification.info({
              message: '检查到页面有新的版本! 请刷新',
              description: (
                  <div>
                      {commitMessage}
                      <br />
                      {locallyStoredVersion.substring(0, 7)} -{'>'} {latestVersion.substring(0, 7)}
                  </div>
              ),
              duration: 0,
          });
          localStorage.setItem('version', latestVersion);
        }
      };
    
    useEffect(checkVersion, [latestVersion]);

    useEffect(() => {
        const fetchEthPrice = async () => {
            const ethPrice = await getEthPrice();
            setEthPrice(ethPrice);
        };
        fetchEthPrice();
    }, []);

    const [ethPrice, setEthPrice] = useState(0);

    const zksAddresses = localStorage.getItem('addresses');
    const starkAddresses = localStorage.getItem('stark_addresses');
    const l0Addresses = localStorage.getItem('l0_addresses');
    const lineaAddresses = localStorage.getItem('linea_addresses');
    const baseAddresses = localStorage.getItem('base_addresses');
    const scrollAddresses = localStorage.getItem('scroll_addresses');

    const zksAddressList = zksAddresses ? JSON.parse(zksAddresses) : [];
    const starkAddressList = starkAddresses ? JSON.parse(starkAddresses) : [];
    const l0AddressList = l0Addresses ? JSON.parse(l0Addresses) : [];
    const lineaAddressList = lineaAddresses ? JSON.parse(lineaAddresses) : [];
    const baseAddressList = baseAddresses ? JSON.parse(baseAddresses) : [];
    const scrollAddressList = scrollAddresses ? JSON.parse(scrollAddresses) : [];

    const zksAddressCount = zksAddressList.length;
    const starkAddressCount = starkAddressList.length;
    const l0AddressCount = l0AddressList.length;
    const lineaAddressCount = lineaAddressList.length;
    const baseAddressCount = baseAddressList.length;
    const scrollAddressCount = scrollAddressList.length;
    const accountCount = zksAddressCount + starkAddressCount + l0AddressCount + lineaAddressCount + baseAddressCount + scrollAddressCount;
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
              { value: l0AddressCount, name: 'LayerZero' },
              { value: lineaAddressCount, name: 'Linea' },
              { value: baseAddressCount, name: 'Base' },
              { value: scrollAddressCount, name: 'Scroll' }
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
    const totallineaEthBalance = lineaAddressList.reduce((total, addressData) => {
        if ('linea_eth_balance' in addressData) {
            const linea_eth_balance = parseFloat(addressData.linea_eth_balance);
            return total + linea_eth_balance;
        }
            return total;
    }, 0);
    const totallineaBusdBalance = lineaAddressList.reduce((total, addressData) => {
        if ('linea_busd_balance' in addressData) {
            const linea_busd_balance = parseFloat(addressData.linea_busd_balance);
            return total + linea_busd_balance;
        }
            return total;
    }, 0);
    const totallineaUsdcBalance = lineaAddressList.reduce((total, addressData) => {
        if ('linea_usdc_balance' in addressData) {
            const linea_usdc_balance = parseFloat(addressData.linea_usdc_balance);
            return total + linea_usdc_balance;
        }
            return total;
    }, 0);
    const totalbaseEthBalance = baseAddressList.reduce((total, addressData) => {
        if ('base_eth_balance' in addressData) {
            const base_eth_balance = parseFloat(addressData.base_eth_balance);
            return total + base_eth_balance;
        }
            return total;
    }, 0);
    const totalbaseUsdcBalance = baseAddressList.reduce((total, addressData) => {
        if ('base_usdc_balance' in addressData) {
            const base_usdc_balance = parseFloat(addressData.base_usdc_balance);
            return total + base_usdc_balance;
        }
            return total;
    }, 0);
    const totalscrollEthBalance = scrollAddressList.reduce((total, addressData) => {
        if ('scroll_eth_balance' in addressData) {
            const scroll_eth_balance = parseFloat(addressData.scroll_eth_balance);
            return total + scroll_eth_balance;
        }
            return total;
    }, 0);
    const totalscrollUsdcBalance = scrollAddressList.reduce((total, addressData) => {
        if ('scroll_usdc_balance' in addressData) {
            const scroll_usdc_balance = parseFloat(addressData.scroll_usdc_balance);
            return total + scroll_usdc_balance;
        }
            return total;
    }, 0);
    const totalscrollUsdtBalance = scrollAddressList.reduce((total, addressData) => {
        if ('scroll_usdt_balance' in addressData) {
            const scroll_usdt_balance = parseFloat(addressData.scroll_usdt_balance);
            return total + scroll_usdt_balance;
        }
            return total;
    }, 0);
    const totalEth = parseFloat(totalzksEthBalance + totalzks1Balance + totalzks2Balance + totalstarkEthBalance + totallineaEthBalance + totalbaseEthBalance + totalbaseEthBalance).toFixed(2);
    const totalUsdc = parseFloat(totalzks2UsdcBalance + totalstarkUsdcBalance + totallineaUsdcBalance + totalbaseUsdcBalance + totalbaseUsdcBalance).toFixed(2);
    const totalUsdt = parseFloat(totalstarkUsdtBalance + totalscrollUsdtBalance).toFixed(2);
    const totalDai = parseFloat(totalstarkDaiBalance).toFixed(2);
    const totalBusd = parseFloat(totallineaBusdBalance).toFixed(2);
    const totalBalance = parseFloat(Number(totalEth) * ethPrice + Number(totalUsdc) + Number(totalUsdt) + Number(totalDai) + Number(totalBusd)).toFixed(2);
    const valueOption = {
    title : {
        text: '资产总览',
        subtext: `资产总额 ${totalBalance}U L2资产总额 ${parseInt(Number(totalBalance) - Number(totalzksEthBalance) * ethPrice)}U\n\nETH(${totalEth}) 稳定币(${parseInt(Number(totalzks2UsdcBalance) + Number(totalstarkUsdcBalance) + Number(totalstarkUsdtBalance) + Number(totalstarkDaiBalance) + Number(totallineaBusdBalance) + Number(totallineaUsdcBalance))})`,
        x:'center'
        },
    tooltip: {
        trigger: 'item',
        formatter: "{a} {b} <br/>价值 {c} ({d}%)"
    },
    legend: {
        top: '5%',
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
        name: '币种',
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
        left: 0,
        right: '35%',
        top: 0,
        bottom: 0,
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
            { value: totalDai, name: 'DAI' },
            { value: totalBusd, name: 'BUSD' }
        ]
        },
        {
        name: '链',
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
        left: "35%",
        right: 0,
        top: 0,
        bottom: 0,
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
            { value: parseInt(totalzksEthBalance * ethPrice), name: 'Ethereum' },
            { value: parseInt(totalzks2Balance * ethPrice + totalzks2UsdcBalance), name: 'zkSync Era' },
            { value: parseInt(totalzks1Balance * ethPrice), name: 'zkSync Lite' },
            { value: parseInt(totalstarkEthBalance * ethPrice + totalstarkUsdcBalance + totalstarkUsdtBalance + totalstarkDaiBalance), name: 'StarkNet' },
            { value: parseInt(totallineaEthBalance * ethPrice + totallineaBusdBalance + totallineaUsdcBalance), name: 'Linea' },
            { value: parseInt(totalbaseEthBalance * ethPrice ), name: 'Base' },
            { value: parseInt(totalscrollEthBalance * ethPrice + totalscrollUsdcBalance + totalscrollUsdtBalance), name: 'Scroll' },
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
    const lineaProgress = lineaAddressList.reduce((acc, entry) => {
        if ('progress' in entry) {
            acc.push(entry.progress);
        }
        return acc;
    }, []);
    const lineaProgressIntervalCounts = lineaProgress.reduce((acc, num) => {
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
            subtext: `zkSyncEra平均完成率 ${parseInt(zksProgress.reduce((acc, num) => acc + parseFloat(num), 0) / zksProgress.length)}%  StarkNet平均完成率 ${parseInt(starkProgress.reduce((acc, num) => acc + parseFloat(num), 0) / starkProgress.length)}% Linea平均完成率 ${parseInt(lineaProgress.reduce((acc, num) => acc + parseFloat(num), 0) / lineaProgress.length)}%`,
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
            data: ['zkSync Era', 'StarkNet', 'Linea']
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
            name: 'zkSync Era',
            data: [zksProgressIntervalCounts['0-10'], zksProgressIntervalCounts['10-20'], zksProgressIntervalCounts['20-30'], zksProgressIntervalCounts['30-40'], zksProgressIntervalCounts['40-50'], zksProgressIntervalCounts['50-60'], zksProgressIntervalCounts['60-70'], zksProgressIntervalCounts['70-80'], zksProgressIntervalCounts['80-90'], zksProgressIntervalCounts['90-100']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkProgressIntervalCounts['0-10'], starkProgressIntervalCounts['10-20'], starkProgressIntervalCounts['20-30'], starkProgressIntervalCounts['30-40'], starkProgressIntervalCounts['40-50'], starkProgressIntervalCounts['50-60'], starkProgressIntervalCounts['60-70'], starkProgressIntervalCounts['70-80'], starkProgressIntervalCounts['80-90'], starkProgressIntervalCounts['90-100']],
            type: 'bar'
          },
          {
            name: 'Linea',
            data: [lineaProgressIntervalCounts['0-10'], lineaProgressIntervalCounts['10-20'], lineaProgressIntervalCounts['20-30'], lineaProgressIntervalCounts['30-40'], lineaProgressIntervalCounts['40-50'], lineaProgressIntervalCounts['50-60'], lineaProgressIntervalCounts['60-70'], lineaProgressIntervalCounts['70-80'], lineaProgressIntervalCounts['80-90'], lineaProgressIntervalCounts['90-100']],
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
    const lineaTx = lineaAddressList.reduce((acc, entry) => {
        if ('linea_tx_amount' in entry) {
            if (typeof entry.linea_tx_amount === 'number') {
                acc.push(entry.linea_tx_amount);
            }
        }
        return acc;
    }, []);
    const lineaTxIntervalCounts = lineaTx.reduce((acc, num) => {
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
            subtext: `zkSyncEra平均tx ${parseInt(zksTx.reduce((acc, num) => acc + num, 0) / zksTx.length)}条  StarkNet平均tx ${parseInt(starkTx.reduce((acc, num) => acc + num, 0) / starkTx.length)}条 Linea平均tx ${parseInt(lineaTx.reduce((acc, num) => acc + num, 0) / lineaTx.length)}条`,
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
            data: ['zkSync Era', 'StarkNet', 'Linea']
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
            name: 'zkSync Era',
            data: [zksTxIntervalCounts['0-10'], zksTxIntervalCounts['10-20'], zksTxIntervalCounts['20-30'], zksTxIntervalCounts['30-40'], zksTxIntervalCounts['40-50'], zksTxIntervalCounts['50-60'], zksTxIntervalCounts['60-70'], zksTxIntervalCounts['70-80'], zksTxIntervalCounts['80-90'], zksTxIntervalCounts['90-100'], zksTxIntervalCounts['100+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkTxIntervalCounts['0-10'], starkTxIntervalCounts['10-20'], starkTxIntervalCounts['20-30'], starkTxIntervalCounts['30-40'], starkTxIntervalCounts['40-50'], starkTxIntervalCounts['50-60'], starkTxIntervalCounts['60-70'], starkTxIntervalCounts['70-80'], starkTxIntervalCounts['80-90'], starkTxIntervalCounts['90-100'], starkTxIntervalCounts['100+']],
            type: 'bar'
          },
          {
            name: 'Linea',
            data: [lineaTxIntervalCounts['0-10'], lineaTxIntervalCounts['10-20'], lineaTxIntervalCounts['20-30'], lineaTxIntervalCounts['30-40'], lineaTxIntervalCounts['40-50'], lineaTxIntervalCounts['50-60'], lineaTxIntervalCounts['60-70'], lineaTxIntervalCounts['70-80'], lineaTxIntervalCounts['80-90'], lineaTxIntervalCounts['90-100'], lineaTxIntervalCounts['100+']],
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
        } else if (num > 50) {
            acc['50+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50+': 0
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
        } else if (num > 50) {
            acc['50+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50+': 0,
      });
    const lineaDayActivity = lineaAddressList.reduce((acc, entry) => {
        if ('dayActivity' in entry) {
            if (typeof entry.dayActivity === 'number') {
                acc.push(entry.dayActivity);
            }
        }
        return acc;
    }, []);
    const lineaActivityIntervalCounts = lineaDayActivity.reduce((acc, num) => {
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
        } else if (num > 50) {
            acc['50+']++;
        }
        return acc;
      }, {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50+': 0,
      });
    const dayActivityOption = {
        title: {
            text: '日活跃天数分布',
            subtext: `zkSyncEra平均日活 ${parseInt(zksDayActivity.reduce((acc, num) => acc + num, 0) / zksDayActivity.length)}天  StarkNet平均日活 ${parseInt(starkDayActivity.reduce((acc, num) => acc + num, 0) / starkDayActivity.length)}天 Linea平均日活 ${parseInt(lineaDayActivity.reduce((acc, num) => acc + num, 0) / lineaDayActivity.length)}天`,
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
            data: ['zkSync Era', 'StarkNet', 'Linea']
        },
        xAxis: {
          type: 'category',
          data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50+'],
          axisLabel:{
    		interval: 0
    	    }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'zkSync Era',
            data: [zksActivityIntervalCounts['0-10'], zksActivityIntervalCounts['10-20'], zksActivityIntervalCounts['20-30'], zksActivityIntervalCounts['30-40'], zksActivityIntervalCounts['40-50'], zksActivityIntervalCounts['50+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkActivityIntervalCounts['0-10'], starkActivityIntervalCounts['10-20'], starkActivityIntervalCounts['20-30'], starkActivityIntervalCounts['30-40'], starkActivityIntervalCounts['40-50'], starkActivityIntervalCounts['50+']],
            type: 'bar'
          },
          {
            name: 'Linea',
            data: [lineaActivityIntervalCounts['0-10'], lineaActivityIntervalCounts['10-20'], lineaActivityIntervalCounts['20-30'], lineaActivityIntervalCounts['30-40'], lineaActivityIntervalCounts['40-50'], lineaActivityIntervalCounts['50+']],
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
    const lineaExchangeAmount = lineaAddressList.reduce((acc, entry) => {
        if ('totalExchangeAmount' in entry) {
            acc.push(entry.totalExchangeAmount);
        }
        return acc;
    }, []);
    const lineaExchangeAmountIntervalCounts = lineaExchangeAmount.reduce((acc, num) => {
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
            subtext: `zkSyncEra平均交易额 ${parseInt(zksExchangeAmount.reduce((acc, num) => acc + parseInt(num), 0) / zksExchangeAmount.length)}u  StarkNet平均交易额 ${parseInt(starkExchangeAmount.reduce((acc, num) => acc + parseInt(num), 0) / starkExchangeAmount.length)}u Linea平均交易额 ${parseInt(lineaExchangeAmount.reduce((acc, num) => acc + parseInt(num), 0) / lineaExchangeAmount.length)}u`,
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
            data: ['zkSync Era', 'StarkNet', 'Linea']
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
            name: 'zkSync Era',
            data: [zksExchangeAmountIntervalCounts['0-1k'], zksExchangeAmountIntervalCounts['1k-1w'], zksExchangeAmountIntervalCounts['1w-5w'], zksExchangeAmountIntervalCounts['5w-25w'], zksExchangeAmountIntervalCounts['25w+']],
            type: 'bar'
          },
          {
            name: 'StarkNet',
            data: [starkExchangeAmountIntervalCounts['0-1k'], starkExchangeAmountIntervalCounts['1k-1w'], starkExchangeAmountIntervalCounts['1w-5w'], starkExchangeAmountIntervalCounts['5w-25w'], starkExchangeAmountIntervalCounts['25w+']],
            type: 'bar'
          },
          {
            name: 'Linea',
            data: [lineaExchangeAmountIntervalCounts['0-1k'], lineaExchangeAmountIntervalCounts['1k-1w'], lineaExchangeAmountIntervalCounts['1w-5w'], lineaExchangeAmountIntervalCounts['5w-25w'], lineaExchangeAmountIntervalCounts['25w+']],
            type: 'bar'
          }
        ]
      };
    // Function to preprocess the timestamp data and convert it into a format suitable for the heatmap
    function preprocessData(timeArray) {
        // Create an object to store the counts for each date
        const dateCounts = {};

        timeArray.forEach((timestamp) => {
            const date = new Date(timestamp);
            const formattedDate = date.toISOString().substring(0, 10);
            if (dateCounts[formattedDate]) {
                dateCounts[formattedDate]++;
            } else {
                dateCounts[formattedDate] = 1;
            }
        });

        const data = [];
        for (const date in dateCounts) {
            data.push([date, dateCounts[date]]);
        }
        return data;
    }

    const zksTimestampsList = localStorage.getItem('zks_timestamps') ? JSON.parse(localStorage.getItem('zks_timestamps')) : [];
    const starkTimestampsList = localStorage.getItem('stark_timestamps') ? JSON.parse(localStorage.getItem('stark_timestamps')) : [];
    const lineaTimestampsList = localStorage.getItem('linea_timestamps') ? JSON.parse(localStorage.getItem('linea_timestamps')) : [];
    const baseTimestampsList = localStorage.getItem('base_timestamps') ? JSON.parse(localStorage.getItem('base_timestamps')) : [];
    const allTimestamps = zksTimestampsList.concat(starkTimestampsList).concat(lineaTimestampsList).concat(baseTimestampsList);

    const timeOption2023 = {
        title: {
            top: 30,
            left: 'center',
            // text: '黑奴工作量证明 (Proof of Gas)',
            // subtext: `2023年 日均交互次数 ${parseFloat(allTimestamps.length/365).toFixed(2) * accountCount}   zkSync Era ${(parseFloat(zksTimestampsList.length/365) * zksAddressCount).toFixed(2)} StarkNet ${parseInt(starkTimestampsList.length/365) * starkAddressCount} Linea ${parseInt(lineaTimestampsList.length/365)  * lineaAddressCount} Base ${parseInt(baseTimestampsList.length/365) * baseAddressCount}`,
        },
        tooltip: {
            position: 'top',
            formatter: function (p) {
                return `${p.data[0]}<br>tx: ${p.data[1]}`;
            }
        },
        visualMap: {
            type: 'piecewise',
            orient: 'vertical',
            left: 'left',
            show: false,
            top: "1%",
            pieces: [
                { min: 0, max: 3, label: '1-3', color: '#EAFCEA' },
                { min: 3, max: 10, label: '3-10', color: '#82C485' },
                { min: 10, max: 20, label: '10-20', color: '#52A86C' },
                { min: 20, max: 50, label: '20-50', color: '#1E703E' },
                { min: 50, max: 100, label: '50-100', color: '#008000' },
                { min: 100, max: 999, label: '金色传说 100+', color: '#FFDF00' },
            ],
        },
        calendar: {
            top: 20,
            left: 100,
            right: 100,
            cellSize: ['auto', 30],
            range: '2023',
            itemStyle: {
                borderWidth: 2,
                borderColor: '#F0F0F0',
            },
            yearLabel: { show: true },
            monthLabel: {
                nameMap: 'ZH',
                borderWidth: 0,
              },
            dayLabel: {
                nameMap: 'ZH',
            },
            splitLine: {
                lineStyle: {
                    color: '#F0F0F0',
                    width: 1.25
                }
            }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            // Pass your timestamp data array to the preprocessData function
            data: preprocessData(allTimestamps),
        },
    };
    const timeOption2024 = {
        title: {
            top: 30,
            left: 'center',
            text: '黑奴工作量证明 (Proof of Gas)',
            // subtext: `2024年 日均交互次数 ${parseInt(allTimestamps.length/365)}   zkSync Era ${parseInt(zksTimestampsList.length/365)} StarkNet ${parseInt(starkTimestampsList.length/365)} Linea ${parseInt(lineaTimestampsList.length/365)} Base ${parseInt(baseTimestampsList.length/365)}`,
        },
        tooltip: {
            position: 'top',
            formatter: function (p) {
                return `${p.data[0]}<br>tx: ${p.data[1]}`;
            }
        },
        visualMap: {
            type: 'piecewise',
            orient: 'vertical',
            left: 'left',
            show: true,
            top: "1%",
            pieces: [
                { min: 0, max: 3, label: '1-3', color: '#EAFCEA' },
                { min: 3, max: 10, label: '3-10', color: '#82C485' },
                { min: 10, max: 20, label: '10-20', color: '#52A86C' },
                { min: 20, max: 50, label: '20-50', color: '#1E703E' },
                { min: 50, max: 100, label: '50-100', color: '#008000' },
                { min: 100, max: 999, label: '金色传说 100+', color: '#FFDF00' },
            ],
        },
        calendar: {
            top: 100,
            left: 100,
            right: 100,
            cellSize: ['auto', 30],
            range: '2024',
            itemStyle: {
                borderWidth: 2,
                borderColor: '#F0F0F0',
            },
            yearLabel: { show: true },
            monthLabel: {
                nameMap: 'ZH',
                borderWidth: 0,
              },
            dayLabel: {
                nameMap: 'ZH',
            },
            splitLine: {
                lineStyle: {
                    color: '#F0F0F0',
                    width: 1.25
                }
            }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            // Pass your timestamp data array to the preprocessData function
            data: preprocessData(allTimestamps),
        },
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
                        <ReactEcharts option={exchangeAmountOption} style={{ height: '400px' }} />
                            </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                        <ReactEcharts option={dayActivityOption} style={{ height: '400px' }} />
                            </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card>
                            <ReactEcharts option={timeOption2024} style={{ height: '400px' }} />
                            <ReactEcharts option={timeOption2023} style={{ height: '400px' }} />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card>
                        <ReactEcharts option={emptyOption} style={{ height: '200px' }} />
                            </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Overview;
