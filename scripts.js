const searcForm = document.querySelector(".search-form");
const productList = document.querySelector(".product-list");
const priceChart = document.querySelector(".price-chart");

let myChart = "";

searcForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const inputValue = event.target[0].value;

  const data = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`
  );

  const products = (await data.json()).results.slice(0, 10);

  displayItems(products);
  updatePriceChart(products);
});

function displayItems(products) {
  console.log(products);
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="product-car">
            <img src="${product.thumbnail.replace(
              /\w\.jpg/gi,
              "W.jpg"
            )}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price-product">${product.price.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}</p>
            <p>Loja: ${product.seller.nickname}</p> 
        </div>
        `
    )
    .join("");
}

function updatePriceChart(products) {
  const ctx = priceChart.getContext("2d");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map(
        (products) => products.title.substring(0, 20) + "..."
      ),
      datasets: [
        {
          label: "Preço (R$)",
          data: products.map((product) => product.price),
          backgroundColor: "rgba(118, 143, 136, 0.6)",
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 1,
        },
      ],
    },

    options: {
      resposive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Comparador de Preços",
              font: {
                size: 18,
              },
            },
          },
        },
      },
    },
  });
}
