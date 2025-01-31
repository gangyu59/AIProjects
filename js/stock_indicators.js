document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("../../data/stock_indicators.json");
    const data = await response.json();
    console.log("Stock Data:", data);

    // **数据预处理**
    let dates = data.map(entry => entry.date);
    let prices = data.map(entry => Number(entry.close));

    // **计算 5 日移动平均（MA5）**
    function calculateMA(prices, period) {
        return prices.map((_, i, arr) =>
            i >= period - 1 ? arr.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period : null
        );
    }

    let ma5 = calculateMA(prices, 5);

    // **计算 RSI**
    function calculateRSI(prices, period = 14) {
        let gains = [], losses = [];
        for (let i = 1; i < prices.length; i++) {
            let diff = prices[i] - prices[i - 1];
            gains.push(diff > 0 ? diff : 0);
            losses.push(diff < 0 ? -diff : 0);
        }
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
        return prices.map((_, i) => {
            if (i < period) return null;
            let rs = avgGain / avgLoss;
            return 100 - (100 / (1 + rs));
        });
    }

    let rsi = calculateRSI(prices, 5);

    // **计算布林带**
    function calculateBollingerBands(prices, period = 5) {
        let ma = calculateMA(prices, period);
        let stdDev = prices.map((_, i, arr) =>
            i >= period - 1
                ? Math.sqrt(
                      arr.slice(i - period + 1, i + 1).reduce((a, b) => a + Math.pow(b - ma[i], 2), 0) / period
                  )
                : null
        );
        let upperBand = ma.map((m, i) => (m !== null ? m + 2 * stdDev[i] : null));
        let lowerBand = ma.map((m, i) => (m !== null ? m - 2 * stdDev[i] : null));
        return { upperBand, lowerBand };
    }

    let { upperBand, lowerBand } = calculateBollingerBands(prices, 5);

    // **可视化数据**
    const ctx = document.getElementById("indicatorsChart").getContext("2d");
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
                    label: "MA5",
                    data: ma5,
                    borderColor: "#00CC66",
                    fill: false
                },
                {
                    label: "Upper Bollinger Band",
                    data: upperBand,
                    borderColor: "#FF5733",
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: "Lower Bollinger Band",
                    data: lowerBand,
                    borderColor: "#FF5733",
                    fill: false,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    console.log("Technical Indicators:", { MA5: ma5, RSI: rsi, BollingerBands: { upperBand, lowerBand } });
});