document.addEventListener("DOMContentLoaded", () => {
    let stockData = [
        { date: "2024-01-01", close: 150.5 },
        { date: "2024-01-02", close: 152.3 },
        { date: "2024-01-03", close: 148.7 },
        { date: "2024-01-04", close: 153.8 },
        { date: "2024-01-05", close: 155.2 }
    ];

    console.log("Corrected Stock Data:", JSON.stringify(stockData, null, 2));

    const dates = stockData.map(entry => entry.date);
    const prices = stockData.map(entry => Number(entry.close)); // 确保转换为数字

    const ctx = document.getElementById("stockChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Stock Price",
                data: prices,
                borderColor: "#007BFF",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    suggestedMin: Math.min(...prices) - 2, // Y 轴最小值（稍微低于最低价格）
                    suggestedMax: Math.max(...prices) + 2  // Y 轴最大值（稍微高于最高价格）
                }
            }
        }
    });
});