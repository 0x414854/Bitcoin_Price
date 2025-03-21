let previousPrice = null;

async function getCurrency() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    if (data.country_code === "US") {
      return "usd";
    } else {
      return "eur";
    }
  } catch (error) {
    console.error(
      "ERROR: Erreur lors de la récupération de la devise géographique, utilisation de EUR par défaut",
      error
    );
    return "eur";
  }
}

async function fetchBitcoinPrice() {
  const currency = await getCurrency();
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
  );
  const data = await response.json();

  const price = data.bitcoin[currency];
  const symbol = currency === "usd" ? "$" : "€";
  updatePriceDisplay(price, symbol);
}

function updatePriceDisplay(price, symbol) {
  const priceStr = price.toFixed(2);
  const digits = priceStr.split("").map((digit) => {
    return `<div class="price-digit">${digit}</div>`;
  });

  const priceContainer = document.getElementById("price");
  priceContainer.innerHTML = digits.join("");

  const currencySymbol = document.getElementById("currency-symbol");
  const digitsElements = priceContainer.querySelectorAll(".price-digit");
  digitsElements.forEach((digit, index) => {
    const newDigit = priceStr[index];
    // const oldDigit = digit.innerText;
    console.log(price + "/" + previousPrice);
    let priceChange = price - previousPrice;
    console.log(priceChange);
    if (previousPrice == null) {
      currencySymbol.classList.remove("change-up-symbol", "change-down-symbol");
      digit.classList.remove("change-up", "change-down");
    } else {
      if (priceChange > 0) {
        digit.classList.add("change-up");
        currencySymbol.classList.add("change-up-symbol");
        setTimeout(() => {
          digit.classList.remove("change-up");
          currencySymbol.classList.remove("change-up-symbol");
        }, 2000);
      } else if (priceChange < 0) {
        digit.classList.add("change-down");
        currencySymbol.classList.add("change-down-symbol");
        setTimeout(() => {
          digit.classList.remove("change-down");
          currencySymbol.classList.remove("change-down-symbol");
        }, 2000);
      }
    }
    digit.innerText = newDigit;
  });

  previousPrice = price;

  currencySymbol.innerText = symbol;
}

setInterval(fetchBitcoinPrice, 60000);
window.onload = fetchBitcoinPrice;
