import axios from "axios";

function getDayNumber(d) {
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + "W" + weekNo;
}

function getMonthNumber(d) {
    return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1);
}

async function getStarkActivity(address) {
    try {
        let dayActivity;
        let weekActivity;
        let monthActivity;
        let days = new Set();
        let weeks = new Set();
        let months = new Set();
        let url = `https://voyager.online/api/txns?to=${address}&ps=50&p=1&type=null`;
        const response = await axios.get(url);
        let receivedAtes = response.data.items.map(item => new Date(item.timestamp * 1000));
        for (let i = 2; i <= response.data.lastPage; i++) {
            const url = `https://voyager.online/api/txns?to=${address}=50&p=${i}&type=null`;
            const response = await axios.get(url);
            const newReceivedAtes = response.data.items.map(item => item.timestamp);
            receivedAtes.concat(newReceivedAtes);
        }
        receivedAtes.forEach(receivedAt => {
            days.add(getDayNumber(receivedAt));
            weeks.add(getWeekNumber(receivedAt));
            months.add(getMonthNumber(receivedAt));
        });
        dayActivity = days.size;
        weekActivity = weeks.size;
        monthActivity = months.size;
        return {
            dayActivity: dayActivity,
            weekActivity: weekActivity,
            monthActivity: monthActivity
        };
        

    } catch (error) {
        console.error(error);
        return {dayActivity: "Error", weekActivity: "Error", monthActivity: "Error"};
    }
    
}

export default getStarkActivity;