// ===== Calculator Class =====
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    scientificFunction(func) {
        let value = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'sqrt':
                if (value < 0) {
                    alert('Cannot calculate square root of negative number!');
                    return;
                }
                result = Math.sqrt(value);
                break;
            case 'log':
                if (value <= 0) {
                    alert('Logarithm is undefined for non-positive numbers!');
                    return;
                }
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) {
                    alert('Natural logarithm is undefined for non-positive numbers!');
                    return;
                }
                result = Math.log(value);
                break;
            case 'power':
                this.chooseOperation('**');
                return;
            case 'factorial':
                if (value < 0 || !Number.isInteger(value)) {
                    alert('Factorial is only defined for non-negative integers!');
                    return;
                }
                result = this.factorial(value);
                break;
            case 'percent':
                result = value / 100;
                break;
            case 'pi':
                this.currentOperand = Math.PI;
                this.updateDisplay();
                return;
            default:
                return;
        }

        this.currentOperand = result;
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        if (n > 170) {
            alert('Number too large for factorial calculation!');
            return;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
}

// ===== History Manager Class =====
class HistoryManager {
    constructor(maxItems = 20) {
        this.maxItems = maxItems;
        this.history = this.loadHistory();
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    addEntry(calculation, result) {
        const entry = {
            calculation: calculation,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };

        this.history.unshift(entry);
        if (this.history.length > this.maxItems) {
            this.history.pop();
        }
        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    clear() {
        this.history = [];
        this.saveHistory();
    }
}

// ===== Theme Manager Class =====
class ThemeManager {
    constructor(toggleButton) {
        this.toggleButton = toggleButton;
        this.loadTheme();
        this.setupToggle();
    }

    loadTheme() {
        const saved = localStorage.getItem('theme');
        const theme = saved || 'light-theme';
        document.body.className = theme;
        this.updateToggleIcon();
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
        this.updateToggleIcon();
    }

    toggle() {
        const currentTheme = document.body.className;
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        this.saveTheme(newTheme);
    }

    updateToggleIcon() {
        const isDark = document.body.className === 'dark-theme';
        this.toggleButton.textContent = isDark ? '☀️' : '🌙';
    }

    setupToggle() {
        this.toggleButton.addEventListener('click', () => this.toggle());
    }
}

// ===== DOM Elements =====
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-action]');
const themeToggle = document.getElementById('themeToggle');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistory');

// ===== Initialize Classes =====
const calculator = new Calculator(previousOperandElement, currentOperandElement);
const historyManager = new HistoryManager();
const themeManager = new ThemeManager(themeToggle);

// ===== Update History Display =====
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    historyManager.getHistory().forEach((entry, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.title = `${entry.calculation} = ${entry.result}`;
        historyItem.textContent = `${entry.calculation} = ${entry.result} (${entry.timestamp})`;
        
        historyItem.addEventListener('click', () => {
            calculator.currentOperand = entry.result;
            calculator.operation = undefined;
            calculator.previousOperand = '';
            calculator.updateDisplay();
        });

        historyList.appendChild(historyItem);
    });
}

// ===== Event Listeners: Numbers =====
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
    });
});

// ===== Event Listeners: Operators =====
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
    });
});

// ===== Event Listeners: Functions =====
functionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        if (action === 'equals') {
            calculator.compute();
            if (calculator.previousOperand && calculator.currentOperand) {
                const calculation = `${calculator.previousOperand} ${calculator.operation} ${calculator.currentOperand}`;
                historyManager.addEntry(calculation, calculator.currentOperand);
                updateHistoryDisplay();
            }
        } else if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else {
            calculator.scientificFunction(action);
        }
    });
});

// ===== Event Listeners: History =====
clearHistoryButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        historyManager.clear();
        updateHistoryDisplay();
    }
});

// ===== Keyboard Support =====
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
    } else if (e.key === '.') {
        calculator.appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
    } else if (e.key === '*') {
        e.preventDefault();
        calculator.chooseOperation('*');
    } else if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        if (calculator.previousOperand && calculator.currentOperand) {
            const calculation = `${calculator.previousOperand} ${calculator.operation} ${calculator.currentOperand}`;
            historyManager.addEntry(calculation, calculator.currentOperand);
            updateHistoryDisplay();
        }
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        calculator.delete();
    } else if (e.key === 'c' || e.key === 'C' || e.key === 'Escape') {
        e.preventDefault();
        calculator.clear();
    }
});

// ===== Initialize History Display =====
updateHistoryDisplay();