document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("../../data/stock_lstm_data.json");
    const data = await response.json();
    console.log("LSTM Training Data:", data);

    // **数据预处理**
    let dates = data.map(entry => entry.date);
    let prices = data.map(entry => Number(entry.close));

    // **标准化数据**
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);
    let normalizedPrices = prices.map(p => (p - minPrice) / (maxPrice - minPrice));

    // **准备训练数据**
    let sequenceLength = 3;
    let trainX = [], trainY = [];
    for (let i = 0; i < normalizedPrices.length - sequenceLength; i++) {
        trainX.push(normalizedPrices.slice(i, i + sequenceLength));
        trainY.push(normalizedPrices[i + sequenceLength]);
    }

    // **构建 LSTM 模型**
    const model = tf.sequential();
    model.add(tf.layers.lstm({ units: 50, returnSequences: false, inputShape: [sequenceLength, 1] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // **训练模型**
    let xs = tf.tensor3d(trainX.map(seq => seq.map(p => [p])), [trainX.length, sequenceLength, 1]);
    let ys = tf.tensor2d(trainY, [trainY.length, 1]);

    await model.fit(xs, ys, { epochs: 50 });

    console.log("LSTM Model Trained");

    // **预测未来 3 天**
    let lastSequence = normalizedPrices.slice(-sequenceLength);
    let futurePredictions = [];
    for (let i = 0; i < 3; i++) {
        let tensorInput = tf.tensor3d([lastSequence.map(p => [p])], [1, sequenceLength, 1]);
        let prediction = model.predict(tensorInput).dataSync()[0];
        futurePredictions.push(prediction);
        lastSequence = [...lastSequence.slice(1), prediction]; // 滑动窗口
    }

    // **反标准化**
    let predictedPrices = futurePredictions.map(p => p * (maxPrice - minPrice) + minPrice);
    console.log("Future Predictions:", predictedPrices);

    // **可视化**
    const ctx = document.getElementById("lstmChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: [...dates, "2024-01-13", "2024-01-14", "2024-01-15"],
            datasets: [
                {
                    label: "Actual Prices",
                    data: prices,
                    borderColor: "#007BFF",
                    fill: false
                },
                {
                    label: "LSTM Predicted Prices",
                    data: [...prices, ...predictedPrices],
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
});