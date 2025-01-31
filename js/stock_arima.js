document.addEventListener("DOMContentLoaded", () => {
    fetch("../../data/stock_time_series.json")
        .then(response => response.json())
        .then(data => {
            console.log("Time Series Data:", data);

            // **数据预处理**
            let dates = data.map(entry => entry.date);
            let prices = data.map(entry => Number(entry.close));

            // **使用 ARIMA 进行预测**
            let ts = new TimeSeries(prices);
            let arimaModel = ts.ARIMA(2, 1, 2);  // p=2, d=1, q=2
            let futurePrices = arimaModel.predict(3); // 预测未来 3 天

            console.log("Future Predictions:", futurePrices);

            // **构造预测数据**
            let futureDates = [
                "2024-01-13", "2024-01-14", "2024-01-15"
            ];

            // **可视化数据**
            const ctx = document.getElementById("arimaChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: [...dates, ...futureDates],
                    datasets: [
                        {
                            label: "Actual Prices",
                            data: prices,
                            borderColor: "#007BFF",
                            fill: false
                        },
                        {
                            label: "ARIMA Predicted Prices",
                            data: [...prices, ...futurePrices],
                            borderColor: "#FF5733",
                            fill: false,
                            borderDash: [5, 5]  // 让预测线变成虚线
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