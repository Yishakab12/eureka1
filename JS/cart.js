document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.getElementById("cart-items");
    const cartQuantitiesDiv = document.getElementById("cart-quantities");
    const cartDataInput = document.getElementById("cart-data");
    const checkoutForm = document.getElementById("checkout-form");
    let cart = [];

    // Function to add item to cart
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart-btn") || event.target.classList.contains("salebtn")) {
            let itemContainer = event.target.closest(".px-3") || event.target.closest(".text-center");
            if (!itemContainer) return;

            const itemNameElement = itemContainer.querySelector("p");
            const priceElement = itemContainer.querySelector("span:not([style])");
            const sizeSelectElement = itemContainer.querySelector(".size-select");

            if (!itemNameElement || !priceElement || !sizeSelectElement) return;

            const itemName = itemNameElement.innerText.trim();
            const itemPrice = parseFloat(priceElement.innerText.replace("$", ""));
            const selectedSize = sizeSelectElement.value;

            if (!selectedSize) {
                alert("Please select a size before adding to cart.");
                return;
            }

            const existingItem = cart.find(item => item.name === itemName && item.size === selectedSize);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: itemName, size: selectedSize, price: itemPrice, quantity: 1 });
            }

            updateCart();
        }
    });

    function updateCart() {
        cartTableBody.innerHTML = "";
        cartQuantitiesDiv.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>`;
            cartDataInput.value = "";
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control item-quantity" data-index="${index}" min="1" value="${item.quantity}" required>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartTableBody.appendChild(row);

            const quantityInput = document.createElement("input");
            quantityInput.type = "hidden";
            quantityInput.name = `quantity_${index}`;
            quantityInput.value = item.quantity;
            cartQuantitiesDiv.appendChild(quantityInput);
        });

        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td></td>
            <td></td>
        `;
        cartTableBody.appendChild(totalRow);

        cartDataInput.value = JSON.stringify(cart);
    }

    // Quantity change listener
    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("item-quantity")) {
            const index = event.target.dataset.index;
            cart[index].quantity = parseInt(event.target.value, 10);
            updateCart();
        }
    });

    // Remove item listener
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.dataset.index;
            cart.splice(index, 1);
            updateCart();
        }
    });

    // Prevent form submission and handle the order
    checkoutForm.addEventListener("submit", function (event) {
        
        console.log("Order submitted:", cart);
        alert("Order submitted!"); // Replace with actual submission logic
    });
});
