const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let currentValue = "0";
let storedValue = null;
let operator = null;
let shouldResetDisplay = false;

const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) return null;
    return a / b;
  },
};

function updateDisplay(value, isError = false) {
  display.textContent = value;
  display.classList.toggle("error", isError);
}

function formatNumber(num) {
  const str = String(num);
  if (str.length <= 12) return str;
  return Number(num).toPrecision(10).replace(/\.?0+$/, "");
}

function getCurrentNumber() {
  return parseFloat(currentValue);
}

function clearAll() {
  currentValue = "0";
  storedValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay("0");
  clearActiveOperator();
}

function clearActiveOperator() {
  keys.querySelectorAll(".key-op").forEach((btn) => {
    btn.classList.remove("active");
  });
}

function setActiveOperator(opButton) {
  clearActiveOperator();
  if (opButton) opButton.classList.add("active");
}

function inputDigit(digit) {
  if (shouldResetDisplay) {
    currentValue = digit;
    shouldResetDisplay = false;
  } else if (currentValue === "0") {
    currentValue = digit;
  } else if (currentValue.length < 12) {
    currentValue += digit;
  }
  updateDisplay(currentValue);
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = "0.";
    shouldResetDisplay = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay(currentValue);
}

function toggleSign() {
  if (currentValue === "0") return;
  currentValue = currentValue.startsWith("-")
    ? currentValue.slice(1)
    : "-" + currentValue;
  updateDisplay(currentValue);
}

function inputPercent() {
  const num = getCurrentNumber() / 100;
  currentValue = formatNumber(num);
  updateDisplay(currentValue);
}

function chooseOperator(nextOp, opButton) {
  const current = getCurrentNumber();

  if (operator !== null && !shouldResetDisplay) {
    const result = calculate(storedValue, current, operator);
    if (result === null) {
      updateDisplay("Cannot divide by zero", true);
      clearAll();
      return;
    }
    storedValue = result;
    currentValue = formatNumber(result);
    updateDisplay(currentValue);
  } else {
    storedValue = current;
  }

  operator = nextOp;
  shouldResetDisplay = true;
  setActiveOperator(opButton);
}

function calculate(a, b, op) {
  const fn = OPERATIONS[op];
  return fn ? fn(a, b) : b;
}

function equals() {
  if (operator === null) return;

  const current = getCurrentNumber();
  const result = calculate(storedValue, current, operator);

  if (result === null) {
    updateDisplay("Cannot divide by zero", true);
    clearAll();
    return;
  }

  currentValue = formatNumber(result);
  updateDisplay(currentValue);
  operator = null;
  storedValue = null;
  shouldResetDisplay = true;
  clearActiveOperator();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit) {
    inputDigit(button.dataset.digit);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator, button);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearAll();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      inputPercent();
      break;
    case "equals":
      equals();
      break;
    default:
      break;
  }
});