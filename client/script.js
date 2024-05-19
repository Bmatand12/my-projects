document.addEventListener("DOMContentLoaded", function() {
    const serverResult = document.querySelector("#serverResult");

    async function signUp() {
        const userFullName = document.querySelector("#userFullName").value;
        const userEmail = document.querySelector("#userEmail").value;
        const userPassword = document.querySelector("#userPassword").value;
        const userCheckPassword = document.querySelector("#userCheckPassword").value;

        if (!userFullName || !userEmail || !userPassword || !userCheckPassword) {
            alert("Please fill in all fields");
            return;
        }
        
        if (userCheckPassword !== userPassword) {
            alert("Your Passwords Are Not The Same");
            return;
        }
    
        if (!isValidEmail(userEmail)) {
            alert("Your Email Address Is Invalid");
            return;
        }

        try {
            const response = await fetch('/sign-up', {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    userPassword,
                    userFullName,
                    userEmail
                })
            });

            const data = await response.json();
            serverResult.textContent = data.message;
            alert(`Welcome ${userFullName}`);
            window.location.href = '/sign-in.html';
        } catch (error) {
            console.error('Error signing up:', error);
            serverResult.textContent = 'Error signing up.';
        }
    }

    function isValidEmail(email) {
        const specialChars = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
        if (specialChars.test(email)) {
            return false;
        }

        if (!/^[a-zA-Z0-9]/.test(email)) {
            return false;
        }

        if (email.indexOf('@') === -1) {
            return false;
        }

        const domain = email.split('@')[1];
        const domainParts = domain.split('.');
        if (domainParts.length < 2 || domainParts.some(part => !/^[a-zA-Z0-9-]+$/.test(part))) {
            return false;
        }

        return true;
    }

    const signUpButton = document.querySelector("#signUpButton");
    if (signUpButton) {
        signUpButton.addEventListener("click", signUp);
    }
});

async function signIn() {
    const userEmail = document.querySelector('#userEmail').value;
    const password = document.querySelector('#password').value;
    const signInResult = document.querySelector('#signInResult');

    try {
        const response = await fetch('/sign-in', {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ userEmail, password })

        });

        const data = await response.text();
        signInResult.textContent = data;
        localStorage.setItem('userEmail', userEmail);
        window.location.href = '/groceries.html';

    } catch (error) {
        console.error('Error signing in:', error);
        signInResult.textContent = 'Error signing in.';
    }
}

function checkLoggedInUser() {
    return localStorage.getItem('userEmail');
}

document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = checkLoggedInUser();
    const userDisplayName = document.getElementById('userDisplayName');
    const signOutButton = document.getElementById('signOutButton');

    if (loggedInUser) {
        userDisplayName.textContent = `Logged in as: ${loggedInUser}`;
        userDisplayName.style.display = 'block';
        signOutButton.style.display = 'block';
    } else {
        userDisplayName.style.display = 'none';
        signOutButton.style.display = 'none';
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const signOutButton = document.querySelector('#signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
    } else {
        console.error('Sign out button not found');
    }
});

function clearCart() {
    console.log(localStorage.getItem('cartItems'))
    localStorage.removeItem('cartItems');
}

function signOut() {
   
    clearCart();
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    window.location.href = '/homePage.html';
}


function ready() {
    let removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    let quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    let addCart = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    const btnBuy = document.getElementsByClassName('btn-buy')
    if(btnBuy && btnBuy.length){
        btnBuy[0].addEventListener("click", buyButtonClicked);
    }
}

function buyButtonClicked() {
    alert("You Need To Pay First");
    const cartItems = Array.from(document.querySelectorAll('.cart-box')).map(cartBox => ({
        title: cartBox.querySelector('.cart-product-title').textContent,
        price: cartBox.querySelector('.cart-price').textContent,
        productImg: cartBox.querySelector('.cart-img').src,
        productQuantity: cartBox.querySelector('.cart-quantity').value 
    }));
   
    console.log(JSON.stringify(cartItems))
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    window.location.href = 'buy.html';
}

function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}

function addCartClicked(event) {
    let button = event.target;
    let shopProducts = button.parentElement;
    let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    let price = shopProducts.getElementsByClassName("price")[0].innerText;
    let productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    let cartItems = document.querySelector(".cart-content");
    let cartItemsName = cartItems.getElementsByClassName("cart-product-title");
    for (let i = 0; i < cartItemsName.length; i++) {
        if (cartItemsName[i].innerHTML == title) {
            alert("You Have Already Add This Item To Your Cart");
            return;
        }
    }
    let cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);

    let productData = {
        title: title,
        price: price,
        productImg: productImg
    };
    let cartItemsData = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : ['soos'];
    cartItemsData.push(productData);
    console.log(JSON.stringify(cartItemsData))
    localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
}


function saveCartItems() {

    const cartItems = document.querySelectorAll('.cart-box');
    const cartItemsData = [];
    cartItems.forEach(item => {
        const title = item.querySelector('.cart-product-title').textContent;
        const price = item.querySelector('.cart-price').textContent;
        const productImg = item.querySelector('.cart-img').src;
        const productQuantity = item.querySelector('.cart-quantity').value;

        cartItemsData.push({
            title: title,
            price: price,
            productImg: productImg,
            productQuantity: productQuantity
        });
    });
    console.log(JSON.stringify(cartItemsData))
    localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
}

function loadCartItems() {
    const cartItemsData = JSON.parse(localStorage.getItem('cartItems'));

    if (cartItemsData) {
        const cartContent = document.querySelector('.cart-content');

        cartItemsData.forEach(item => {
            const cartBox = document.createElement('div');
            cartBox.classList.add('cart-box');
            cartBox.innerHTML = `
                <img src="${item.productImg}" alt="" class="cart-img">
                <div class="detail-box">
                    <div class="cart-product-title">${item.title}</div>
                    <div class="cart-price">${item.price}</div>
                    <input type="number" value="${item.productQuantity}" class="cart-quantity">
                </div>
                <i class='bx bxs-trash-alt cart-remove'></i>
            `;
            cartContent.appendChild(cartBox);

            cartBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
            cartBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
        });

        updateTotal();
    }
}


function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

function updateTotal() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    if(!cartContent){
        return;
    }
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName("cart-price")[0];
        let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        let price = parseFloat(priceElement.innerText.replace("₪", ""));
        let quantity = parseFloat(quantityElement.value);
        total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementById("total-price").innerText = "₪" + total;
}


function displayTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    const totalPriceElement = document.getElementById('total-price');

    const totalPrice = cartItems.reduce((acc, curr) => {
        return acc + parseFloat(curr.price) * parseFloat(curr.productQuantity);
    }, 0) || 0;
    totalPriceElement.textContent = totalPrice.toFixed(2) + " ₪";
    localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
    
}

const container = document.querySelector(".container");
const searchButton = document.getElementById("searchButton");
const searchIcons = document.querySelectorAll(".search-bar i");
const cartItemsElement = document.getElementById('cartItems');

searchIcons.forEach((searchIcon) => {
    searchIcon.addEventListener("click", () => {
        container.classList.toggle("change");
    });
});

function filterProducts(event) {
    event.preventDefault();
    const search = document.getElementById('name').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('minPrice').value);
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    fetch('/get-products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            search: search,
            minPrice: minPrice,
            maxPrice: maxPrice
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log(data);
        displayFilteredProducts(data.products);
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
        alert('There was a problem with fetching data. Please try again later.');
    });
}

function displayFilteredProducts(products) {
    const countElement = document.getElementById('count');
    const mainDiv = document.getElementById('mainDiv');
    mainDiv.innerHTML = ''; 

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product-box');
    

        const productImg = document.createElement('img');
        productImg.src = product.productImg; 
        productImg.alt = product.productName;
        productImg.classList.add('product-img');
        div.appendChild(productImg);

        const productName = document.createElement('h2');
        productName.textContent = product.productName;
        productName.classList.add('product-title');
        div.appendChild(productName);

        const productPrice = document.createElement('span');
        productPrice.textContent = product.productPrice + ' ₪';
        productPrice.classList.add('price');
        div.appendChild(productPrice);

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.classList.add('product-quantity');
        div.appendChild(quantityInput);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('add-cart');
        addToCartButton.addEventListener('click', function() {
            const title = product.productName;
            const price = product.productPrice;
            const productImg = product.productImg;
            const productQuantity = parseInt(quantityInput.value);
            addToCart(title, price, productImg, productQuantity);
            
        });
        div.appendChild(addToCartButton);

        mainDiv.appendChild(div); 
    });

    countElement.textContent = products.length; 
}

document.getElementById('searchButton').addEventListener('click', filterProducts);
document.querySelector('.search-bar i.fa-xmark').addEventListener('click', function() {
    document.getElementById('name').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
});

function addToCart(title, price, productImg, quantity) {
    const cartItem = {
        title: title,
        price: price,
        productImg: productImg,
        quantity: quantity
    };

    let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

  
    const existingCartItem = cartItems.find(item => item.title === title);
    if (existingCartItem) {
        alert('This product is already in the cart!');
        return;
    }
     
    else 
{

    cartItem.quantity = Math.max(quantity, 2);
    cartItems.push(cartItem);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
}

function displayCartItems() {
    cartItemsElement.innerHTML = '';
    let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.title} - Quantity: ${item.quantity} - Price: ${item.price * item.quantity} ₪`;
        cartItemsElement.appendChild(li);
    });
}
