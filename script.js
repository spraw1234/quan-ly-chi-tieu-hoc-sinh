document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const expenseForm = document.getElementById('expense-form');
    const pieChartCanvas = document.getElementById('pie-chart');
    const statsTableBody = document.querySelector('#stats-table tbody');
    const displayGoal = document.getElementById('display-goal');
    const daysToGoal = document.getElementById('days-to-goal');
    const daysCount = document.getElementById('days-count');
    const dailySavingDisplay = document.getElementById('daily-saving');
    const resetBtn = document.getElementById('reset-btn');
    const themeToggle = document.getElementById('theme-toggle');

    let chartInstance = null;

    // Hàm làm tròn xuống nghìn
    function roundToThousand(num) {
        return Math.floor(num / 1000) * 1000;
    }

    // Toggle theme - sửa để chắc chắn
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggle.textContent = 'Chuyển sang Dark Mode';
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeToggle.textContent = 'Chuyển sang Light Mode';
        }
    });

    // Phần còn lại giữ nguyên (form submit, chart, reset...)
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dailyAmount = parseFloat(document.getElementById('daily-amount').value);
        const daysPerWeek = parseInt(document.getElementById('days-per-week').value);
        const savingGoal = parseFloat(document.getElementById('saving-goal').value);
        const selectedItems = Array.from(document.querySelectorAll('.expense-item:checked'));

        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một mục chi tiêu!');
            return;
        }

        let totalRatio = 0;
        selectedItems.forEach(item => totalRatio += parseInt(item.dataset.ratio));

        const allocations = {};
        const chartData = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#00ffff', '#00ff00', '#ffff00', '#ff00ff', '#ff0000', '#0000ff', '#ffa500', '#800080']
            }]
        };

        selectedItems.forEach(item => {
            const ratio = parseInt(item.dataset.ratio);
            const normalizedRatio = (ratio / totalRatio) * 100;
            const dailyAlloc = (normalizedRatio / 100) * dailyAmount;
            const roundedDaily = roundToThousand(dailyAlloc);

            allocations[item.value] = {
                daily: roundedDaily,
                weekly: roundToThousand(roundedDaily * daysPerWeek),
                monthly: roundToThousand(roundedDaily * daysPerWeek * 4),
                yearly: roundToThousand(roundedDaily * daysPerWeek * 52)
            };

            chartData.labels.push(item.value);
            chartData.datasets[0].data.push(Math.round(normalizedRatio * 10) / 10);
        });

        displayGoal.textContent = savingGoal.toLocaleString();
        inputSection.style.display = 'none';
        resultSection.style.display = 'block';

        daysToGoal.style.display = 'none';
        if (allocations['Tiết kiệm']) {
            const dailySaving = allocations['Tiết kiệm'].daily;
            if (dailySaving > 0) {
                const daysNeeded = Math.ceil(savingGoal / dailySaving);
                daysCount.textContent = daysNeeded.toLocaleString();
                dailySavingDisplay.textContent = (dailySaving / 1000).toLocaleString();
                daysToGoal.style.display = 'block';
            }
        }

        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(pieChartCanvas, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { 
                            font: { size: 14 }, 
                            color: document.body.classList.contains('dark-mode') ? '#e0f7ff' : '#000000',
                            padding: 20 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Phân bổ phần trăm (%)',
                        font: { size: 16 },
                        color: document.body.classList.contains('dark-mode') ? '#00ffff' : '#007bff'
                    },
                    tooltip: {
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(1)}%` }
                    }
                },
                animation: { duration: 1200 }
            }
        });

        statsTableBody.innerHTML = '';
        for (const [item, amounts] of Object.entries(allocations)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item}</td>
                <td>${(amounts.daily / 1000).toLocaleString()}</td>
                <td>${(amounts.weekly / 1000).toLocaleString()}</td>
                <td>${(amounts.monthly / 1000).toLocaleString()}</td>
                <td>${(amounts.yearly / 1000).toLocaleString()}</td>
            `;
            statsTableBody.appendChild(row);
        }
    });

    resetBtn.addEventListener('click', () => {
        resultSection.style.display = 'none';
        inputSection.style.display = 'block';
        expenseForm.reset();
    });
});