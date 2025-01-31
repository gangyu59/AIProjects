document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("../../data/stock_trading_strategy.json");
    const data = await response.json();
    console.log("Trading Data:", data);

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

    // **生成 AI 交易信号**
    let signals = prices.map((price, i) => {
        if (i < 5) return "Hold";
        if (rsi[i] !== null && rsi[i] < 30 && price < lowerBand[i]) return "Buy";
        if (rsi[i] !== null && rsi[i] > 70 && price > upperBand[i]) return "Sell";
        return "Hold";
    });

    console.log("Trading Signals:", signals);

    // **可视化交易信号**
    const ctx = document.getElementById("tradingChart").getContext("2d");
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
                    label: "Buy Signal",
                    data: signals.map((s, i) => (s === "Buy" ? prices[i] : null)),
                    borderColor: "#00CC66",
                    pointRadius: 5,
                    pointStyle: "triangle",
                    fill: false
                },
                {
                    label: "Sell Signal",
                    data: signals.map((s, i) => (s === "Sell" ? prices[i] : null)),
                    borderColor: "#FF5733",
                    pointRadius: 5,
                    pointStyle: "rect",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});