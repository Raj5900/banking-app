

const landingPage = document.getElementById('landingPage');
const dashboard = document.getElementById('dashboard');
const userButtons = document.getElementById('userButtons');
const authButtons = document.getElementById('authButtons');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const accountNumber = document.getElementById('accountNumber');
const balanceAmount = document.getElementById('balanceAmount');
const transactionsList = document.getElementById('transactionsList');
const transactionsTable = document.getElementById('transactionsTable');


let currentUser = null;


const getUsers = () => JSON.parse(localStorage.getItem('securebank_users') || '{}');
const saveUsers = (users) => localStorage.setItem('securebank_users', JSON.stringify(users));

//random account number
const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000);


function showDashboard() {
    if (!currentUser) return;
    landingPage.style.display = 'none';
    dashboard.style.display = 'block';
    userButtons.classList.remove('hidden');
    authButtons.classList.add('hidden');
    updateDashboardUI();
}

function logout() {
    currentUser = null;
    landingPage.style.display = 'block';
    dashboard.style.display = 'none';
    userButtons.classList.add('hidden');
    authButtons.classList.remove('hidden');
}

//signup or login
function openModal(modalType) {
    if (modalType === 'signupModal') {
        const name = prompt("Enter your name:");
        const email = prompt("Enter your email:");
        const password = prompt("Create a password:");

        if (name && email && password) {
            const users = getUsers();
            if (users[email]) {
                alert("User already exists.");
                return;
            }
            users[email] = {
                name,
                email,
                password,
                accountNumber: generateAccountNumber(),
                balance: 0,
                transactions: []
            };
            saveUsers(users);
            alert("Signup successful. Please login.");
        }
    } else if (modalType === 'loginModal') {
        const email = prompt("Enter your email:");
        const password = prompt("Enter your password:");
        const users = getUsers();
        const user = users[email];
        if (user && user.password === password) {
            currentUser = user;
            showDashboard();
        } else {
            alert("Invalid credentials.");
        }
    } else if (modalType === 'depositModal') {
        const amount = parseFloat(prompt("Enter deposit amount:"));
        if (!isNaN(amount) && amount > 0) {
            currentUser.balance += amount;
            currentUser.transactions.push({
                date: new Date().toLocaleString(),
                type: 'Deposit',
                amount,
                balance: currentUser.balance
            });
            updateUser();
            updateDashboardUI();
        }
    } else if (modalType === 'withdrawModal') {
        const amount = parseFloat(prompt("Enter withdrawal amount:"));
        if (!isNaN(amount) && amount > 0 && currentUser.balance >= amount) {
            currentUser.balance -= amount;
            currentUser.transactions.push({
                date: new Date().toLocaleString(),
                type: 'Withdraw',
                amount,
                balance: currentUser.balance
            });
            updateUser();
            updateDashboardUI();
        } else {
            alert("Invalid amount or insufficient balance.");
        }
    }
}


function updateUser() {
    const users = getUsers();
    users[currentUser.email] = currentUser;
    saveUsers(users);
}


function updateDashboardUI() {
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    accountNumber.textContent = currentUser.accountNumber;
    balanceAmount.textContent = `$${currentUser.balance.toFixed(2)}`;
    renderTransactions();
}


function showTransactions() {
    transactionsTable.style.display = 'block';
    renderTransactions();
}


function renderTransactions() {
    transactionsList.innerHTML = '';
    currentUser.transactions.slice().reverse().forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>$${t.balance.toFixed(2)}</td>
        `;
        transactionsList.appendChild(row);
    });
}
