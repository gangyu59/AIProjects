document.addEventListener("DOMContentLoaded", () => {
    fetch("../../data/stock_training_data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Training Data:", data);

            // **数据预处理**
            let dates = data.map((entry, index) => index); // 使用索引作为 X 值
            let prices = data.map(entry => Number(entry.close)); // 确保转换为数值

            // **训练线性回归模型**
            const regression = new SimpleLinearRegression(dates, prices);
            console.log("Regression Model:", regression);

            // **预测未来 3 天的价格**
            let futureDates = [dates.length, dates.length + 1, dates.length + 2];
            let futurePrices = futureDates.map(x => regression.predict(x));

            console.log("Future Predictions:", futurePrices);

            // **可视化结果**
            const ctx = document.getElementById("predictionChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: [...dates, ...futureDates], // 过去 + 未来日期
                    datasets: [
                        {
                            label: "Stock Price",
                            data: [...prices, ...futurePrices],
                            borderColor: "#007BFF",
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