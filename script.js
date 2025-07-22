class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memory = 0;
        this.decimalPlaces = 2;
        this.clear();
        this.updateMemoryIndicator();  // Initialize memory indicator
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Error') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error') this.clear();
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
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
        
        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) throw new Error("Division by zero");
                    computation = prev / current;
                    break;
                case 'x^y':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            
            this.currentOperand = this.formatNumber(computation);
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        } catch (error) {
            this.currentOperand = 'Error';
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }
    }

    scientificFunction(func) {
        if (this.currentOperand === 'Error') return;
        const current = parseFloat(this.currentOperand);
        let result;
        
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    if (Math.abs(current % 180) === 90) throw new Error("Invalid input");
                    result = Math.tan(current * Math.PI / 180);
                    break;
                case 'log':
                    if (current <= 0) throw new Error("Invalid input");
                    result = Math.log10(current);
                    break;
                case 'ln':
                    if (current <= 0) throw new Error("Invalid input");
                    result = Math.log(current);
                    break;
                case '√':
                    if (current < 0) throw new Error("Invalid input");
                    result = Math.sqrt(current);
                    break;
                case 'x!':
                    if (current < 0 || !Number.isInteger(current)) throw new Error("Invalid input");
                    result = this.factorial(current);
                    break;
                case 'π':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                default:
                    return;
            }
            
            this.currentOperand = this.formatNumber(result);
            this.updateDisplay();
        } catch (error) {
            this.currentOperand = 'Error';
            this.updateDisplay();
        }
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    memoryOperation(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        switch (operation) {
            case 'MC':
                this.memory = 0;
                break;
            case 'MR':
                this.currentOperand = this.formatNumber(this.memory);
                break;
            case 'M+':
                this.memory += current;
                break;
            case 'M-':
                this.memory -= current;
                break;
        }
        
        this.updateMemoryIndicator();
        this.updateDisplay();
    }

    formatNumber(number) {
        if (isNaN(number)) return 'Error';
        if (typeof number !== 'number') return number;
      
        // Handle very large/small numbers with exponential notation
        if (Math.abs(number) > 1e12 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return number.toExponential(this.decimalPlaces);
        }
        
        // Fixed decimal places formatting
        const parts = number.toFixed(this.decimalPlaces).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        if (parts[1] && parts[1].length > this.decimalPlaces) {
            parts[1] = parts[1].substring(0, this.decimalPlaces);
        }
        
        return parts[1] ? parts.join('.') : parts[0];
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = 
            this.operation ? `${this.previousOperand} ${this.operation}` : this.previousOperand;
    }

    updateMemoryIndicator() {
        const memoryIndicator = document.getElementById('memory-indicator');
        memoryIndicator.innerText = this.memory !== 0 ? 'M' : '';
    }

    setDecimalPlaces(places) {
        this.decimalPlaces = parseInt(places) || 0;
        if (this.currentOperand !== '0' && this.currentOperand !== 'Error') {
            this.currentOperand = this.formatNumber(parseFloat(this.currentOperand));
        }
        this.updateDisplay();
    }
}

// ... rest of your code remains the same ...

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const memoryButtons = document.querySelectorAll('.memory-btn');
const scientificButtons = document.querySelectorAll('.scientific-btn');
const clickSound = document.getElementById('click-sound');


const themeSelect = document.getElementById('theme-select');
const decimalPlacesInput = document.getElementById('decimal-places');
const soundToggle = document.getElementById('sound-toggle');
const memoryToggle = document.getElementById('memory-toggle');
const scientificToggle = document.getElementById('scientific-toggle');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound();
        calculator.appendNumber(button.innerText);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound();
        calculator.chooseOperation(button.innerText);
    });
});

equalsButton.addEventListener('click', () => {
    playSound();
    calculator.compute();
});

clearButton.addEventListener('click', () => {
    playSound();
    calculator.clear();
});

deleteButton.addEventListener('click', () => {
    playSound();
    calculator.delete();
});

memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound();
        calculator.memoryOperation(button.innerText);
    });
});

scientificButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound();
        calculator.scientificFunction(button.id);
    });
});

themeSelect.addEventListener('change', () => {
    document.body.className = '';
    document.body.classList.add(`${themeSelect.value}-theme`);
    playSound();
});

decimalPlacesInput.addEventListener('change', () => {
    calculator.setDecimalPlaces(parseInt(decimalPlacesInput.value));
    playSound();
});

soundToggle.addEventListener('change', () => {
    playSound();
});

memoryToggle.addEventListener('change', () => {
    document.querySelector('.calculator').classList.toggle('show-memory', memoryToggle.checked);
    playSound();
});

scientificToggle.addEventListener('change', () => {
    document.querySelector('.calculator').classList.toggle('show-scientific', scientificToggle.checked);
    playSound();
});

function playSound() {
    if (soundToggle.checked) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("Sound playback prevented:", e));
    }
}


document.body.classList.add('light-theme');
calculator.setDecimalPlaces(parseInt(decimalPlacesInput.value));