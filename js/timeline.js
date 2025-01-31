document.addEventListener("DOMContentLoaded", () => {
    const timelineContainer = document.getElementById("timeline");

    fetch("../../data/events.json")
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.className = "event";

                // 年份标题
                const yearElement = document.createElement("h2");
                yearElement.textContent = event.year;

                // 描述文本
                const descriptionElement = document.createElement("p");
                descriptionElement.textContent = event.description;

                // 加载图片
                if (event.image) {
                    const imgElement = document.createElement("img");
                    imgElement.src = event.image;
                    imgElement.alt = `Image for year ${event.year}`;
                    imgElement.className = "event-image";
                    eventElement.appendChild(imgElement);
                }

                // 查看详情按钮
                const detailsButton = document.createElement("button");
                detailsButton.textContent = "View Details";
                detailsButton.addEventListener("click", () => {
                    alert(event.details); // 可替换为更复杂的展示逻辑
                });

                // 组装元素
                eventElement.appendChild(yearElement);
                eventElement.appendChild(descriptionElement);
                eventElement.appendChild(detailsButton);
                timelineContainer.appendChild(eventElement);
            });
        })
        .catch(error => console.error("Error loading events:", error));
});