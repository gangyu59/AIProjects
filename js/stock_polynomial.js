document.addEventListener("DOMContentLoaded", () => {
    fetch("../../data/stock_polynomial_data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Polynomial Training Data:", data);

            // **数据预处理**
            let dates = data.map((entry, index) => index);
            let prices = data.map(entry => Number(entry.close));

            // **训练多项式回归模型（2阶）**
            const degree = 2;  // 可调整阶数，拟合更复杂的趋势
            const regression = new PolynomialRegression(dates, prices, degree);
            console.log("Polynomial Regression Model:", regression);

            // **预测未来 3 天的价格**
            let futureDates = [dates.length, dates.length + 1, dates.length + 2];
            let futurePrices = futureDates.map(x => regression.predict(x));

            console.log("Future Predictions:", futurePrices);

            // **可视化结果**
            const ctx = document.getElementById("polynomialChart").getContext("2d");
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
                            label: "Predicted Prices",
                            data: [...prices, ...futurePrices],
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