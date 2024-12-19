const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const form = document.querySelector("form");
const ul = document.querySelector("ul");

const hasCharactersRegex = /\D+/g;
let lastFocusedElement;

amount.addEventListener("focus", () => {
  lastFocusedElement = amount;
});

expense.addEventListener("focus", () => {
  lastFocusedElement = expense;
});

category.addEventListener("focus", () => {
  lastFocusedElement = category;
});

amount.addEventListener("input", () => {
  let value = amount.value;

  value = Number(value.replace(hasCharactersRegex, ""));

  if (value) {
    const valueInCents = value / 100;

    amount.value = formatCurrencyBRL(valueInCents);
  } else {
    amount.value = "";
  }
});

/**
 *
 * @param {Number} value value to be formatted.
 * @returns formatted value in Brazilian Real notation.
 */
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category: {
      id: category.value,
      name: category.options[category.selectedIndex].text,
    },
    amount: amount.value,
    created_at: new Date(),
  };

  addNewExpense(newExpense);
  updateTotals();
  clearInputs();
};
/**
 *
 * @param {Object} newExpense an Object that contains the expense data.
 */
const addNewExpense = (newExpense) => {
  try {
    const li = document.createElement("li");
    li.classList.add("expense");

    const categoryImg = document.createElement("img");
    categoryImg.setAttribute("src", `./img/${newExpense.category.id}.svg`);
    categoryImg.setAttribute("alt", "Ícone de tipo da despesa");

    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expense-info");
    const strong = document.createElement("strong");
    strong.textContent = newExpense.expense;
    const categorySpan = document.createElement("span");
    categorySpan.textContent = newExpense.category.name;

    expenseDiv.append(strong, categorySpan);

    const amountSpan = document.createElement("span");
    const amountSmall = document.createElement("small");
    amountSmall.textContent = "R$";
    amountSpan.appendChild(amountSmall);
    amountSpan.classList.add("expense-amount");
    amountSpan.innerText = newExpense.amount;

    const deleteImg = document.createElement("img");
    deleteImg.setAttribute("src", "./img/remove.svg");
    deleteImg.setAttribute("alt", "remover");
    deleteImg.classList.add("remove-icon");
    deleteImg.addEventListener("click", deleteExpense);

    li.append(categoryImg, expenseDiv, amountSpan, deleteImg);
    ul.appendChild(li);
  } catch (error) {
    console.log(error);
    alert("Não foi possível adicionar a despesa. Por favor, tente novamente.");
  }
};

/**
 *
 * @returns the total value of expenses
 */
function updateTotals() {
  try {
    const expenses = ul.children;
    const expensesSpan = document.querySelector("aside header p span");
    const expensesValueElement = document.querySelector("aside header h2");
    let expensesValue = 0;

    expensesSpan.textContent = `${expenses.length} ${
      expenses.length > 1 ? "despesas" : "despesa"
    }`;

    for (let expense of expenses) {
      const expenseSpan = expense.querySelector(".expense-amount");
      let spanValue = expenseSpan.innerText.split(",").join(".");
      spanValue = Number(spanValue.replace(hasCharactersRegex, ""));

      if (isNaN(spanValue)) {
        return;
      }

      expensesValue += spanValue;
    }

    const expensesValueInCents = expensesValue / 100;
    expensesValueElement.innerText = formatCurrencyBRL(expensesValueInCents);
  } catch (error) {
    console.log(error);
    alert("Não conseguimos atualizar o total de despesas.");
  }
}

/**
 *
 * @param {Object} event
 * deletes an expense, based on which delete image was clicked by the user.
 */
function deleteExpense(event) {
  const targetedExpense = event.target.parentNode;

  ul.removeChild(targetedExpense);
  updateTotals();
  setFocus(lastFocusedElement);
}

/**
 * clear the value of all form inputs and set focus on the expense field, easing the way to add others.
 */
function clearInputs() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  setFocus(expense);
}

function setFocus(element) {
  element.focus();
}
