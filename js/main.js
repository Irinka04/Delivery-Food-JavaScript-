const RED_COLOR = '#fff000';
// 33-35

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");


const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
// отмена в корзине
const buttonClearCart = document.querySelector('.clear-cart');
// переменная для авторизации
let login = localStorage.getItem("gloDelivery");

const cart = [];

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }
  return response.json();

};
const validName = function (star) {
  const regName = / ^[a-zA-z][a-zA-Z0-9-_\.]{3,20}$/;
  return regName.test(str);
}

const toggleModal = function () {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = function () {
  modalAuth.classList.toggle("is-open");
};

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }
  console.log('авторитизован');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('не авторитизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    localStorage.setItem('gloDelivery', login);

    toggleModalAuth();
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    logInForm.reset();
    checkAuth();
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);

}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
//checkAuth();

function createCardRestaurant({

  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {

  const cardRestaurants = document.createElement('a');
  cardRestaurants.className = 'card card-restaurants';
  cardRestaurants.products = products;
  cardRestaurants.info = {
    kitchen,
    name,
    price,
    stars
  }

  const card = `
    <img src = "${image}"
    alt = "image"
    class = "card-image card-image1" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
                <span class = "card-tag tag">${timeOfDelivery}
                </span>
							</div>

							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
                <div class = "price">От
                ${price} ₽ 
                </div>
                
								<div class = "category" >${kitchen}</div>
							</div>
						</div>
					

          `;
  cardRestaurants.insertAdjacentHTML("beforeend", card);

  cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurants);
}

function createCardGood({
  description,
  id,
  image,
  name,
  price
}) {
  const card = document.createElement("div");
  card.className = "card";
  // добовляем к карточке id но мы получим чере id кнопки добавив ниже 
  // card.id = id;
  card.insertAdjacentHTML('beforeend', `
  <img src = ${image} alt = ${name} class = card-image "/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3> 
        </div>
          <div class="card-info" >
            <p class="ingredients">${
              description
            }</p>
          </div>
          <div class="card-buttons">
            <button class = "button button-primary button-add-cart" id=${id}>
      <span class = "button-card-text"> В корзину 
      </span> <span class = "button-cart-svg"> </span> </button> 
      <strong class = "card-price card-price-bold"> ${price} ₽</strong>
      </div>
      </div>

  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest(".card-restaurants");

    if (restaurant) {
      // console.log(restaurant.dataset.products);

      cardsMenu.textContent = '';
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      const {
        kitchen,
        name,
        price,
        stars
      } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `от ${price}  ₽`;
      restaurantCategory.textContent = kitchen;



      getData(`./db/${restaurant.products}`).then(function (data) {
        // console.log(data);
        data.forEach(createCardGood);
      });

    }

  } else {
    toggleModalAuth();
  }
}
// корзина

function addToCart(event) {
  // cardsMenu
  const target = event.target;
  // переменная в корзину
  const buttonAddToCart = target.closest('.button-add-cart');
  // проверим попали ли в кнопку
  // console.log(buttonAddToCart);
  // проверим если попали  будем проверять карточку если нет то
  if (buttonAddToCart) {
    // получим карточку используя класс карточки card
    const card = target.closest('.card');
    // внутри карточки ищем вот эти элементы
    const title = card.querySelector('.card-title-reg').textContent;
    // получив title получим цену
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    // console.log(title, cost, id);
    // внутроь cart добовляю (пушу) обьект
    const food = cart.find(function (item) {
      // сравниваем выбранный ид
      return item.id === id;
    })
    // проверяем есть ли в нашем карт есть то увеличиваем каунд иначе если еды нет в карзине то добавим с нуля

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}
// формируем список товаров в корзине
function renderCart() {
  modalBody.textContent = '';
  // перебор товаров в корзине 22.4урок
  cart.forEach(function ({
    id,
    title,
    cost,
    count
  }) {
    const itemCart =
      `<div class="food-row">
        <span class="food-name">${title}</span>
          <strong class = "food-price" >${
            cost}</strong>
					<div class="food-counter">
						<button class = "counter-button counter-minus"
            data-id=${id}> - </button>
            <span class = "counter">${
            count}</span>
						<button class = "counter-button counter-plus"
						data-id = ${id}> + </button>
					</div>
        </div>`;
    modalBody.insertAdjacentHTML('afterbegin', itemCart)

  });
  // итоговая цена
  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);
  modalPrice.textContent = totalPrice + ' ₽';

}
// ф-я меняет количество товаров в корзине
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    if (target.classList.contains('counter-plus')) food.count++;
    renderCart();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    // console.log(data);
    data.forEach(createCardRestaurant)
  });
  // событие отмены в корзине
  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  })
  // меняет в корзине количество
  modalBody.addEventListener('click', changeCount);
  // обработчики событий
  // открывает модальное окно
  cartButton.addEventListener("click", function () {
    // формируем модальное окно описание выше
    renderCart();
    //  открываем модальное окно
    toggleModal();
  });
  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener('click', returnMain);
  checkAuth();


  inputSearch.addEventListener('keypress', function (event) {

    if (event.charCode === 13) {
      const value = event.target.value.trim();

      if (!value) {
        event.target.style.backgroundColor = RED_COLOR;
        console.log(value);
        event.target.value = '';
        setTimeout(function () {
          event.target.style.backgroundColor = '';
        }, 1000)
        return;
      }

      getData('./db/partners.json')
        .then(function (data) {
          const linkProducts = data.map(function (partner) {
            return partner.products;
          });
          return linkProducts
        })
        .then(function (linkProducts) {
          cardsMenu.textContent = '';
          linkProducts.forEach(function (link) {
            getData(`./db/${link}`)
              .then(function (data) {
                const resultSearch = data.filter(function (item) {
                  const name = item.name.toLowerCase();
                  return name.includes(value.toLowerCase());
                })

                containerPromo.classList.add("hide");
                restaurants.classList.add("hide");
                menu.classList.remove("hide");

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = ``;
                restaurantCategory.textContent = `Разная кухня`;
                resultSearch.forEach(createCardGood);

              })
          })

        })
    }
  })

}



init();
// Slaider https://swiperjs.com/get-started/

new Swiper('.swiper-container', {
  loop: true,
  sliderPerView: 1,
  autoplay: true,
  effect: 'coverflow',
  grabCursor: true,
  cubeEffect: {
    shadow: false,
  },
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },


});
// 1час31 мин после 3 урока доп