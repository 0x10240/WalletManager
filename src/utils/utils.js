export function getLastTxTime(lastTxDatetime) {
    const lastTxDate = new Date(lastTxDatetime).getTime(); // 转换为毫秒值
    const now = Date.now(); // 直接获取当前时间的UTC毫秒值
    const diff = now - lastTxDate; // 计算差值，结果是毫秒数
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} 天前`;
    } else if (diffInHours > 0) {
        return `${diffInHours} 小时前`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} 分钟前`;
    } else {
        return "刚刚";
    }
}
