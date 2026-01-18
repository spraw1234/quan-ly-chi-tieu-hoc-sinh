// script.js
document.addEventListener('DOMContentLoaded', () => {
    let budget = 0;
    let period = 'week'; // Default to week
    let totalExpense = 0;
    let expenses = { food: 0, study: 0, game: 0, travel: 0 };
    let chart;

    // Initialize Chart.js
    const ctx = document.getElementById('expense-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ăn uống', 'Học tập', 'Game/Giải trí', 'Di chuyển'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}%` } }
            }
        }
    });

    // Set Budget
    document.getElementById('set-budget').addEventListener('click', () => {
        budget = parseInt(document.getElementById('budget').value) || 0;
        period = document.getElementById('budget-period').value;
        updateRemaining();
        updatePetStatus();
    });

    // Add Expense
    document.getElementById('add-expense').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('expense-amount').value) || 0;
        const category = document.getElementById('expense-category').value;
        expenses[category] += amount;
        totalExpense += amount;
        updateChart();
        updateTotal();
        updateRemaining();
        updatePetStatus();
        document.getElementById('expense-amount').value = '';
    });

    // Set Goal
    document.getElementById('set-goal').addEventListener('click', () => {
        const item = document.getElementById('goal-item').value;
        const price = parseInt(document.getElementById('goal-price').value) || 0;
        const days = parseInt(document.getElementById('goal-days').value) || 1;
        const dailySave = price / days;
        document.getElementById('goal-message').textContent = `Để mua "${item}", bạn cần tiết kiệm ${dailySave.toFixed(0)} VND mỗi ngày trong ${days} ngày.`;
    });

    function updateChart() {
        const total = Object.values(expenses).reduce((a, b) => a + b, 0);
        const percentages = Object.values(expenses).map(val => total > 0 ? (val / total * 100).toFixed(2) : 0);
        chart.data.datasets[0].data = percentages;
        chart.update();
    }

    function updateTotal() {
        document.getElementById('total-expense').textContent = `Tổng chi tiêu: ${totalExpense} VND`;
    }

    function updateRemaining() {
        const remaining = budget - totalExpense;
        document.getElementById('remaining-budget').textContent = `Còn lại: ${remaining} VND`;
    }

    function updatePetStatus() {
        const petStatus = document.getElementById('pet-status');
        const petMessage = document.getElementById('pet-message');
        const ratio = budget > 0 ? totalExpense / budget : 0;

        if (ratio <= 0.5) {
            petStatus.textContent = '🐶'; // Happy dog
            petMessage.textContent = 'Thú cưng của bạn đang vui vẻ và lớn lên!';
        } else if (ratio <= 1) {
            petStatus.textContent = '🐕'; // Normal dog
            petMessage.textContent = 'Thú cưng của bạn ổn, nhưng hãy tiết kiệm hơn!';
        } else {
            petStatus.textContent = '😢'; // Sad
            petMessage.textContent = 'Thú cưng của bạn buồn vì chi tiêu quá đà!';
        }
    }
});