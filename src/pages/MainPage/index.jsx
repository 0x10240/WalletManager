import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {Layout, FloatButton} from "antd";
import Linea from "@pages/Linea/index.jsx";
import LineaTasks from "@pages/LineaTasks/index.jsx";
import Base from "@pages/Base/index.jsx";
import BaseTasks from "@pages/BaseTasks/index.jsx";
import Scroll from "@pages/Scroll/index.jsx";
import Layer from "@pages/Layer/index.jsx";
import Mirror from "@pages/Mirror/index.jsx";
import Coffee from "@pages/Coffee/index.jsx";
import ZksyncTasks from "@pages/ZksyncTasks/index.jsx";
import ZkRank from "@pages/ZkRank/index.jsx";
import Deposit from "@pages/Deposit/index.jsx";
import Notice from "@components/Notice/index.jsx";
import StarkTasks from "@pages/StarkTasks/index.jsx";
import Overview from "@pages/Overview/index.jsx";

function MainPage() {
    const location = useLocation()
    return (
        <div
            style={{
                backgroundColor: "#f0f2f5",
                minHeight: "100vh",
            }}
        >
            {/*<Notice/>*/}
            <Layout>
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        width: "100%",
                        zIndex: 1,
                    }}
                >
                    <MenuHeader
                        style={{
                            backgroundColor: "#f0f2f5",
                            borderBottom: "1px solid #e8e8e8",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        }}
                    />
                </div>
                <div
                    style={{
                        // paddingTop: "5px",
                        minHeight: "85vh",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        borderRadius: "4px",
                        marginTop: "45px",
                    }}
                >
                    <div>
                        {location.pathname === "/" && <Zksync/>}
                        {location.pathname === "/zksync" && <Zksync/>}
                        {location.pathname === "/zksyncTasks" && <ZksyncTasks/>}
                        {location.pathname === "/zkRank" && <ZkRank/>}
                        {location.pathname === "/stark" && <Stark/>}
                        {location.pathname === "/starkTasks" && <StarkTasks/>}
                        {location.pathname === "/linea" && <Linea/>}
                        {location.pathname === "/lineaTasks" && <LineaTasks/>}
                        {location.pathname === "/base" && <Base/>}
                        {location.pathname === "/baseTasks" && <BaseTasks/>}
                        {location.pathname === "/scroll" && <Scroll/>}
                        {location.pathname === "/layer" && <Layer/>}
                        {location.pathname === "/mirror" && <Mirror/>}
                        {/* {location.pathname === "/coffee" && <Coffee/>} */}
                        {location.pathname === "/deposit" && <Deposit/>}
                        {location.pathname === "/overview" && <Overview/>}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default MainPage;
