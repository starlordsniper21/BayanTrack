// Get elements from the DOM
const expenseForm = document.getElementById('expense-form');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expensesList = document.getElementById('expenses');
const totalExpenseElement = document.getElementById('total');
const categoryTotalsList = document.getElementById('category-totals');
const categoryPercentageList = document.getElementById('category-percentage');

// Initialize data
let totalExpense = 0;
let categoryTotals = {};
let expenseChart;

// Load data from localStorage
function loadData() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    totalExpense = localStorage.getItem('totalExpense') || 0;
    categoryTotals = JSON.parse(localStorage.getItem('categoryTotals')) || {};

    expenses.forEach(expense => addExpenseToDOM(expense.name, expense.amount, expense.category));
    totalExpenseElement.textContent = formatCurrency(totalExpense);
    updateAnalytics();
}

// Save data to localStorage
function saveData() {
    const expenses = Array.from(expensesList.children).map(li => {
        const [name, amount, category] = li.textContent.split(' - ');
        return {
            name: name.replace(' - ', ''),
            amount: parseFloat(amount.replace('PHP ', '').replace(',', '')),
            category: category.replace('(', '').replace(')', '')
        };
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('totalExpense', totalExpense);
    localStorage.setItem('categoryTotals', JSON.stringify(categoryTotals));
}

// Function to format number to currency (PHP)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
}

// Function to add a new expense to the DOM
function addExpenseToDOM(name, amount, category) {
    const li = document.createElement('li');
    li.innerHTML = `
        <strong>${name}</strong> - ${formatCurrency(amount)} (${category})
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    expensesList.appendChild(li);

    // Add event listeners for edit and delete buttons
    li.querySelector('.edit-btn').addEventListener('click', () => editExpense(li));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(li, amount, category));
}

// Function to add a new expense
function addExpense(name, amount, category) {
    addExpenseToDOM(name, amount, category);

    // Update totals
    totalExpense += parseFloat(amount);
    totalExpenseElement.textContent = formatCurrency(totalExpense);

    if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
    }
    categoryTotals[category] += parseFloat(amount);

    // Update analytics and save data
    updateAnalytics();
    saveData();
}

// Function to update the analytics
function updateAnalytics() {
    categoryTotalsList.innerHTML = '';
    categoryPercentageList.innerHTML = '';

    for (const category in categoryTotals) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${category}:</strong> ${formatCurrency(categoryTotals[category])}`;
        categoryTotalsList.appendChild(li);
    }

    for (const category in categoryTotals) {
        const percentage = ((categoryTotals[category] / totalExpense) * 100).toFixed(2);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${category}:</strong> ${percentage}% of total expenses`;
        categoryPercentageList.appendChild(li);
    }

    updateChart();
}

// Edit expense function
function editExpense(li) {
    const [name, amount, category] = li.innerText.split(' - ');
    expenseName.value = name;
    expenseAmount.value = parseFloat(amount.replace('PHP ', '').replace(',', ''));
    expenseCategory.value = category.replace('(', '').replace(')', '');
    li.remove();
    totalExpense -= parseFloat(amount.replace('PHP ', '').replace(',', ''));
    totalExpenseElement.textContent = formatCurrency(totalExpense);
    saveData();
}

// Delete expense function
function deleteExpense(li, amount, category) {
    li.remove();
    totalExpense -= parseFloat(amount);
    categoryTotals[category] -= parseFloat(amount);

    if (categoryTotals[category] <= 0) {
        delete categoryTotals[category];
    }

    totalExpenseElement.textContent = formatCurrency(totalExpense);
    updateAnalytics();
    saveData();
}

// Initialize Chart.js
function initChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#d8d8d8'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            return `${label}: ${formatCurrency(value)}`;
                        }
                    }
                }
            }
        }
    });
}

// Update chart data
function updateChart() {
    if (expenseChart) {
        expenseChart.data.labels = Object.keys(categoryTotals);
        expenseChart.data.datasets[0].data = Object.values(categoryTotals);
        expenseChart.update();
    } else {
        initChart();
    }
}

// Handle form submission
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = expenseName.value;
    const amount = expenseAmount.value;
    const category = expenseCategory.value;

    // Add the expense to the list and update total
    addExpense(name, amount, category);

    // Clear form fields
    expenseName.value = '';
    expenseAmount.value = '';
    expenseCategory.value = '';
});

// Load data on page load
window.addEventListener('load', loadData);
