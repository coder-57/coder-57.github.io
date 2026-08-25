/* =========================================================
   CART PAGE
   ALL CART LOGIC IS HERE
   cart.js IS NOT REQUIRED
========================================================= */

import "./cart-page.css";

import productData from "../../data/product.json";


/* =========================================================
   STORAGE KEY
========================================================= */

const CART_KEY = "astrike_cart";


/* =========================================================
   GET CART
========================================================= */

function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(CART_KEY)
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const value =
        Number(price) || 0;

    return `₹${value.toLocaleString("en-IN")}`;

}


/* =========================================================
   GET SUBTOTAL
========================================================= */

function getCartSubtotal(cart) {

    return cart.reduce(
        (total, item) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            return total +
                price * quantity;

        },
        0
    );

}


/* =========================================================
   FIND PRODUCT STOCK FROM product.json
========================================================= */

function getProductSizeStock(
    productId,
    colorName,
    size
) {

    const product =
        productData.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!product) {

        return 0;

    }


    const colors =
        Array.isArray(product.colors)
            ? product.colors
            : [];


    const selectedColor =
        colors.find(
            color =>
                String(
                    color.name || ""
                ).toLowerCase() ===
                String(
                    colorName || ""
                ).toLowerCase()
        );


    if (!selectedColor) {

        return 0;

    }


    if (!selectedColor.sizes) {

        return 0;

    }


    return Number(
        selectedColor.sizes[size] || 0
    );

}


/* =========================================================
   GET CURRENT STOCK
========================================================= */

function getCurrentStock(item) {

    const originalStock =
        getProductSizeStock(
            item.productId,
            item.color,
            item.size
        );


    if (originalStock <= 0) {

        return Number(
            item.stock || 0
        );

    }


    return originalStock;

}


/* =========================================================
   UPDATE QUANTITY
========================================================= */

function updateQuantity(
    index,
    newQuantity
) {

    const cart =
        getCart();


    const item =
        cart[index];


    if (!item) {

        return false;

    }


    const quantity =
        Number(newQuantity);


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        return false;

    }


    const originalStock =
        getProductSizeStock(
            item.productId,
            item.color,
            item.size
        );


    /* =====================================================
       MAX STOCK
    ===================================================== */

    if (
        originalStock > 0 &&
        quantity > originalStock
    ) {

        alert(
            `Only ${originalStock} pieces available.`
        );

        return false;

    }


    item.quantity =
        quantity;


    /* =====================================================
       REMAINING STOCK
    ===================================================== */

    if (originalStock > 0) {

        item.stock =
            Math.max(
                originalStock -
                quantity,
                0
            );

    }


    cart[index] =
        item;


    saveCart(cart);


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return true;

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(index) {

    const cart =
        getCart();


    const item =
        cart[index];


    if (!item) {

        return false;

    }


    cart.splice(
        index,
        1
    );


    saveCart(cart);


    window.dispatchEvent(
        new Event("cartUpdated")
    );


    return true;

}


/* =========================================================
   LOAD CART PAGE
========================================================= */

export function loadCartPage() {

    const container =
        document.querySelector("#cart");


    if (!container) {

        console.error(
            "#cart container not found"
        );

        return;

    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        const cart =
            getCart();


        /* =================================================
           EMPTY CART
        ================================================= */

        if (
            !Array.isArray(cart) ||
            cart.length === 0
        ) {

            container.innerHTML = `

                <main class="cart-page">

                    <div class="cart-empty">

                        <div class="cart-empty-icon">
                            🛒
                        </div>

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            Looks like you haven't added
                            anything to your cart yet.
                        </p>

                        <a
                            href="/"
                            class="continue-shopping-btn"
                        >
                            CONTINUE SHOPPING
                        </a>

                    </div>

                </main>

            `;

            return;

        }


        /* =================================================
           SYNC STOCK
        ================================================= */

        cart.forEach(
            item => {

                const originalStock =
                    getProductSizeStock(
                        item.productId,
                        item.color,
                        item.size
                    );


                if (
                    originalStock > 0
                ) {

                    item.quantity =
                        Math.min(
                            Number(
                                item.quantity || 1
                            ),
                            originalStock
                        );


                    item.stock =
                        Math.max(
                            originalStock -
                            item.quantity,
                            0
                        );

                }

            }
        );


        saveCart(cart);


        /* =================================================
           SUBTOTAL
        ================================================= */

        const subtotal =
            getCartSubtotal(cart);


        /* =================================================
           TOTAL QUANTITY
        ================================================= */

        const totalQuantity =
            cart.reduce(
                (
                    total,
                    item
                ) => {

                    return total +
                        Number(
                            item.quantity || 0
                        );

                },
                0
            );


        /* =================================================
           CART HTML
        ================================================= */

        container.innerHTML = `

            <main class="cart-page">


                <!-- =====================================
                     CART HEADER
                ====================================== -->

                <section class="cart-header">

                    <p class="cart-label">
                        SHOPPING BAG
                    </p>

                    <h1>
                        YOUR CART
                    </h1>

                    <span>
                        ${totalQuantity}

                        ${
                            totalQuantity === 1
                                ? "ITEM"
                                : "ITEMS"
                        }
                    </span>

                </section>


                <!-- =====================================
                     CART CONTENT
                ====================================== -->

                <section class="cart-content">


                    <!-- =================================
                         CART ITEMS
                    ================================== -->

                    <div class="cart-items">

                        ${
                            cart
                                .map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const quantity =
                                            Number(
                                                item.quantity || 1
                                            );


                                        const stock =
                                            Number(
                                                item.stock || 0
                                            );


                                        const originalStock =
                                            getProductSizeStock(
                                                item.productId,
                                                item.color,
                                                item.size
                                            );


                                        const itemTotal =
                                            Number(
                                                item.price || 0
                                            ) *
                                            quantity;


                                        return `

                                            <article
                                                class="cart-item"
                                                data-index="${index}"
                                            >


                                                <!-- IMAGE -->

                                                <a
                                                    href="/product/${item.slug}"
                                                    class="cart-item-image"
                                                >

                                                    ${
                                                        item.image

                                                            ?

                                                        `

                                                        <img
                                                            src="${item.image}"
                                                            alt="${
                                                                item.name ||
                                                                "Product"
                                                            }"
                                                        >

                                                        `

                                                            :

                                                        `

                                                        <div
                                                            class="cart-no-image"
                                                        >
                                                            No Image
                                                        </div>

                                                        `
                                                    }

                                                </a>


                                                <!-- INFO -->

                                                <div
                                                    class="cart-item-info"
                                                >


                                                    <!-- BRAND -->

                                                    <p
                                                        class="cart-item-brand"
                                                    >
                                                        ${
                                                            item.brand ||
                                                            "ASTRIKE SPORTS"
                                                        }
                                                    </p>


                                                    <!-- NAME -->

                                                    <h2
                                                        class="cart-item-name"
                                                    >

                                                        <a
                                                            href="/product/${item.slug}"
                                                        >
                                                            ${
                                                                item.name ||
                                                                "Product"
                                                            }
                                                        </a>

                                                    </h2>


                                                    <!-- COLOR -->

                                                    <div
                                                        class="cart-item-option"
                                                    >

                                                        <span>
                                                            Color:
                                                        </span>

                                                        <strong>
                                                            ${
                                                                item.color ||
                                                                "Default"
                                                            }
                                                        </strong>

                                                    </div>


                                                    <!-- SIZE -->

                                                    <div
                                                        class="cart-item-option"
                                                    >

                                                        <span>
                                                            Size:
                                                        </span>

                                                        <strong>
                                                            ${
                                                                item.size ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </div>


                                                    <!-- STOCK -->

                                                    <div
                                                        class="cart-item-stock"
                                                    >

                                                        ${
                                                            stock > 0

                                                                ?

                                                            `
                                                            ${stock}
                                                            available
                                                            `

                                                                :

                                                            `
                                                            Out of stock
                                                            `
                                                        }

                                                    </div>


                                                    <!-- PRICE -->

                                                    <div
                                                        class="cart-item-price"
                                                    >

                                                        <strong>
                                                            ${
                                                                formatPrice(
                                                                    item.price
                                                                )
                                                            }
                                                        </strong>


                                                        ${
                                                            item.oldPrice

                                                                ?

                                                            `
                                                            <del>
                                                                ${
                                                                    formatPrice(
                                                                        item.oldPrice
                                                                    )
                                                                }
                                                            </del>
                                                            `

                                                                :

                                                            ""
                                                        }

                                                    </div>


                                                    <!-- QUANTITY -->

                                                    <div
                                                        class="cart-quantity"
                                                        data-cart-index="${index}"
                                                    >

                                                        <button
                                                            type="button"
                                                            class="quantity-btn quantity-decrease"
                                                            data-index="${index}"
                                                            ${
                                                                quantity <= 1
                                                                    ? "disabled"
                                                                    : ""
                                                            }
                                                        >
                                                            −
                                                        </button>


                                                        <span
                                                            class="quantity-value"
                                                        >
                                                            ${quantity}
                                                        </span>


                                                        <button
                                                            type="button"
                                                            class="quantity-btn quantity-increase"
                                                            data-index="${index}"
                                                            ${
                                                                originalStock > 0 &&
                                                                quantity >= originalStock
                                                                    ? "disabled"
                                                                    : ""
                                                            }
                                                        >
                                                            +
                                                        </button>

                                                    </div>


                                                    <!-- REMOVE -->

                                                    <button
                                                        type="button"
                                                        class="remove-cart-item"
                                                        data-index="${index}"
                                                    >
                                                        REMOVE
                                                    </button>


                                                </div>


                                                <!-- ITEM TOTAL -->

                                                <div
                                                    class="cart-item-total"
                                                >

                                                    <strong>
                                                        ${
                                                            formatPrice(
                                                                itemTotal
                                                            )
                                                        }
                                                    </strong>

                                                </div>


                                            </article>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </div>


                    <!-- =================================
                         ORDER SUMMARY
                    ================================== -->

                    <aside
                        class="cart-summary"
                    >

                        <h2>
                            ORDER SUMMARY
                        </h2>


                        <!-- ITEMS -->

                        <div
                            class="summary-row"
                        >

                            <span>
                                Items
                            </span>

                            <strong>
                                ${totalQuantity}
                            </strong>

                        </div>


                        <!-- SUBTOTAL -->

                        <div
                            class="summary-row"
                        >

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${
                                    formatPrice(
                                        subtotal
                                    )
                                }
                            </strong>

                        </div>


                        <!-- DELIVERY -->

                        <div
                            class="summary-row"
                        >

                            <span>
                                Delivery
                            </span>

                            <strong>
                                FREE
                            </strong>

                        </div>


                        <div
                            class="summary-divider"
                        ></div>


                        <!-- TOTAL -->

                        <div
                            class="summary-total"
                        >

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                ${
                                    formatPrice(
                                        subtotal
                                    )
                                }
                            </strong>

                        </div>


                        <!-- CHECKOUT -->

                        <button
                            type="button"
                            class="checkout-btn"
                        >
                            PROCEED TO CHECKOUT
                        </button>


                        <!-- CONTINUE SHOPPING -->

                        <a
                            href="/"
                            class="continue-shopping"
                        >
                            ← Continue Shopping
                        </a>

                    </aside>


                </section>

            </main>

        `;


        attachEvents();

    }


    /* =====================================================
       ATTACH EVENTS
    ===================================================== */

    function attachEvents() {


        /* =================================================
           INCREASE QUANTITY
        ================================================= */

        container
            .querySelectorAll(
                ".quantity-increase"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset.index
                                );


                            const cart =
                                getCart();


                            const item =
                                cart[index];


                            if (!item) {

                                return;

                            }


                            const currentQuantity =
                                Number(
                                    item.quantity || 1
                                );


                            const originalStock =
                                getProductSizeStock(
                                    item.productId,
                                    item.color,
                                    item.size
                                );


                            if (
                                originalStock > 0 &&
                                currentQuantity >=
                                originalStock
                            ) {

                                alert(
                                    `Only ${originalStock} pieces available.`
                                );

                                return;

                            }


                            const updated =
                                updateQuantity(
                                    index,
                                    currentQuantity + 1
                                );


                            if (updated) {

                                renderCart();

                            }

                        }
                    );

                }
            );


        /* =================================================
           DECREASE QUANTITY
        ================================================= */

        container
            .querySelectorAll(
                ".quantity-decrease"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset.index
                                );


                            const cart =
                                getCart();


                            const item =
                                cart[index];


                            if (!item) {

                                return;

                            }


                            const currentQuantity =
                                Number(
                                    item.quantity || 1
                                );


                            if (
                                currentQuantity <= 1
                            ) {

                                return;

                            }


                            const updated =
                                updateQuantity(
                                    index,
                                    currentQuantity - 1
                                );


                            if (updated) {

                                renderCart();

                            }

                        }
                    );

                }
            );


        /* =================================================
           REMOVE ITEM
        ================================================= */

        container
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset.index
                                );


                            const cart =
                                getCart();


                            const item =
                                cart[index];


                            if (!item) {

                                return;

                            }


                            const confirmed =
                                confirm(
                                    `${item.name} remove from cart?`
                                );


                            if (!confirmed) {

                                return;

                            }


                            removeCartItem(
                                index
                            );


                            renderCart();

                        }
                    );

                }
            );


        /* =================================================
           CHECKOUT
           
           NO ALERT
           
           CART → CHECKOUT PAGE
        ================================================= */

        const checkoutButton =
            container.querySelector(
                ".checkout-btn"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                () => {

                    const cart =
                        getCart();


                    /* -------------------------------------
                       SAFETY CHECK
                    ------------------------------------- */

                    if (
                        !Array.isArray(cart) ||
                        cart.length === 0
                    ) {

                        window.location.href =
                            "/cart";

                        return;

                    }


                    /* -------------------------------------
                       GO TO CHECKOUT
                    ------------------------------------- */

                    window.location.href =
                        "/checkout";

                }
            );

        }

    }


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderCart();


    /* =====================================================
       CART UPDATE EVENT
    ===================================================== */

    window.addEventListener(
        "cartUpdated",
        () => {

            renderCart();

        }
    );

}