document.addEventListener("DOMContentLoaded", () => {
    fetch("../../data/stock_evaluation_data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Evaluation Data:", data);

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

            // **计算误差**
            let predictions = dates.map(x => regression.predict(x));
            let mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - prices[i]), 0) / prices.length;
            let mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - prices[i], 2), 0) / prices.length;
            let rmse = Math.sqrt(mse);
            let meanPrice = prices.reduce((sum, val) => sum + val, 0) / prices.length;
            let r2 = 1 - (mse / prices.reduce((sum, val) => sum + Math.pow(val - meanPrice, 2), 0));

            console.log("Evaluation Metrics:", { MAE: mae, MSE: mse, RMSE: rmse, R2: r2 });

            // **展示误差**
            document.getElementById("evaluationResults").innerHTML = `
                <strong>Evaluation Metrics:</strong><br>
                MAE: ${mae.toFixed(2)}<br>
                MSE: ${mse.toFixed(2)}<br>
                RMSE: ${rmse.toFixed(2)}<br>
                R²: ${r2.toFixed(2)}
            `;

            // **可视化**
            const ctx = document.getElementById("evaluationChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: [...dates, ...futureDates], // 过去 + 未来日期
                    datasets: [
                        {
                            label: "Actual Prices",
                            data: prices,
                            borderColor: "#007BFF",
                            fill: false
                        },
                        {
                            label: "Predicted Prices",
                            data: [...predictions, ...futurePrices],
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