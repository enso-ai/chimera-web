export function formatNumber(num, decimals = 1) {
    if (num === null || num === undefined || num === 'N/A' || isNaN(num)) return "N/A";
    
    // Ensure num is treated as a number
    num = Number(num);
    if (num < 1000) return num.toString();

    const units = ["K", "M", "B", "T"];
    let unitIndex = -1;
    let formattedNum = num;

    while (formattedNum >= 1000 && unitIndex < units.length - 1) {
        formattedNum /= 1000;
        unitIndex++;
    }

    return formattedNum.toFixed(decimals).replace(/\.0+$/, "") + units[unitIndex];
}
