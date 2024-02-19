import {Menu} from 'antd';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {GithubOutlined, TwitterOutlined, CaretDownOutlined} from "@ant-design/icons";
import './index.css'
import {getEthPrice} from "@utils";

const EthPrice = () => {
    const [ethPrice, setEthPrice] = useState(null);
    useEffect(() => {
        const fetchPrice = async () => {
            const price = await getEthPrice();
            setEthPrice(price);
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 10000);
        return () => clearInterval(interval);
    }, []);
    if (ethPrice === null) {
        return <div>Loading ETH Price...</div>;
    }
    return <div>ETH Price: ${ethPrice}</div>
}
const MenuHeader = () => {
    const items = [
        {
            label: 'Overview',
            key: 'overview',
        },
        {
            label: <span>zkSync <CaretDownOutlined /></span>,
            key: 'zks',
            children: [
                {
                    label: 'zkSync',
                    key: 'zksync',
                },
                {
                    label: 'zkSyncTasks',
                    key: 'zksyncTasks',
                },
                {
                    label: 'zkRank',
                    key: 'zkRank',
                },
            ],
        },
        {
            label: <span>Stark <CaretDownOutlined /></span>,
            key: 'starknet',
            children: [
                {
                    label: 'Stark',
                    key: 'stark',
                },
                {
                    label: 'StarkTasks',
                    key: 'starkTasks',
                },
            ],
        },
        {
            label: <span>Linea <CaretDownOutlined /></span>,
            key: 'lin',
            children: [
                {
                    label: 'Linea',
                    key: 'linea',
                },
                {
                    label: 'LineaTasks',
                    key: 'lineaTasks',
                },
            ],
        },
        {
            label: <span>Base <CaretDownOutlined /></span>,
            key: 'basechain',
            children: [
                {
                    label: 'Base',
                    key: 'base',
                },
                {
                    label: 'BaseTasks',
                    key: 'baseTasks',
                },
            ],
        },
        {
            label: 'Scroll',
            key: 'scroll',
        },
        {
            label: 'LayerZero',
            key: 'layer',
        },
        {
            label: 'Mirror',
            key: 'mirror',
        },
        {
            label: 'Deposit',
            key: 'deposit',
        },
        {
            label: '捐赠',
            key: 'donate',
        },
        {
            label: <a href="https://github.com/luoyeETH/MyWalletScan" target="_blank"
                      rel="noopener noreferrer"><GithubOutlined/></a>,
            key: 'github',
        },
        // {
        //     label: <a href="https://twitter.com/jingluo0" target="_blank"
        //               rel="noopener noreferrer"><TwitterOutlined/></a>,
        //     key: 'twitter',
        // },
        {
            label: <EthPrice/>,
            key: 'ethPrice',
        }
    ];
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname.replace('/', '') || 'overview');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    useEffect(() => {
        if (location.pathname.replace('/', '') === 'twitter' || location.pathname.replace('/', '') === 'github') {
            return;
        }
        setCurrent(location.pathname.replace('/', '') || 'overview');
    }, [location.pathname]);

    useEffect(() => {
        if (current === 'twitter' || current === 'github') {
            return;
        }
        navigate(`/${current}`);
    }, [current]);

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{
                display: 'flex',
                justifyContent: 'center'
            }}
            className="custom-menu"
            items={items}
        >
        </Menu>
    );

};
export default MenuHeader;
