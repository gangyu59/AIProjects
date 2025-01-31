document.addEventListener("DOMContentLoaded", () => {
    fetch("../../data/stock_raw_data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Raw Data:", data);

            // **步骤 1：清理数据**
            let cleanedData = data
                .map(entry => ({
                    date: entry.date,
                    close: entry.close ? Number(entry.close) : null  // 转换类型
                }))
                .filter(entry => entry.close !== null && entry.close < 200);  // 去掉 null 和异常值

            console.log("Cleaned Data:", cleanedData);

            // **步骤 2：计算 3 日移动平均**
            let movingAverageData = cleanedData.map((entry, index, arr) => {
                if (index < 2) return { ...entry, ma3: null };
                let sum = arr[index - 2].close + arr[index - 1].close + entry.close;
                return { ...entry, ma3: sum / 3 };
            });

            console.log("Data with MA3:", movingAverageData);

            // **步骤 3：绘制数据**
            const dates = movingAverageData.map(entry => entry.date);
            const prices = movingAverageData.map(entry => entry.close);
            const ma3Values = movingAverageData.map(entry => entry.ma3);

            const ctx = document.getElementById("processedStockChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: "Stock Price",
                            data: prices,
                            borderColor: "#007BFF",
                            fill: false
                        },
                        {
                            label: "3-day MA",
                            data: ma3Values,
                            borderColor: "#FF5733",
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        })
        .catch(error => console.error("Error loading data:", error));
});