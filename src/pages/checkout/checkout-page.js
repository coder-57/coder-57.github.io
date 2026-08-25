/* =========================================================
   CHECKOUT PAGE
   ASTRIKE SPORTS

   LOGIN:
   localStorage -> astrike_current_user

   CART:
   localStorage -> astrike_cart

   ORDERS:
   localStorage -> astrike_orders

   ORDER STATUS:
   Placed
   -> Processing
   -> Shipped
   -> Out for Delivery
   -> Delivered
   -> Completed
========================================================= */

import "./checkout-page.css";

import productData from "../../data/product.json";


/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_KEY = "astrike_cart";
const ORDERS_KEY = "astrike_orders";
const CURRENT_USER_KEY = "astrike_current_user";


/* =========================================================
   CHECK LOGIN
========================================================= */

function isLoggedIn() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

        return !!user;

    } catch (error) {

        console.error(
            "Login check error:",
            error
        );

        return false;
    }
}


/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem(
                    CURRENT_USER_KEY
                )
            );

        return user || null;

    } catch (error) {

        console.error(
            "Current user read error:",
            error
        );

        return null;
    }
}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    CART_KEY
                )
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Checkout cart read error:",
            error
        );

        return [];
    }
}


/* =========================================================
   GET ORDERS
========================================================= */

function getOrders() {

    try {

        const orders =
            JSON.parse(
                localStorage.getItem(
                    ORDERS_KEY
                )
            );

        return Array.isArray(orders)
            ? orders
            : [];

    } catch (error) {

        console.error(
            "Orders read error:",
            error
        );

        return [];
    }
}


/* =========================================================
   SAVE ORDERS
========================================================= */

function saveOrders(orders) {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
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
   GET CART SUBTOTAL
========================================================= */

function getCartSubtotal(cart) {

    return cart.reduce(
        (total, item) => {

            const price =
                Number(item.price || 0);

            const quantity =
                Number(item.quantity || 1);

            return (
                total +
                (price * quantity)
            );
        },
        0
    );
}


/* =========================================================
   GENERATE ORDER ID
========================================================= */

function generateOrderId() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `AST-${year}${month}${day}-${random}`;
}


/* =========================================================
   GET PRODUCT
========================================================= */

function getProduct(productId) {

    return productData.find(
        product =>
            String(product.id) ===
            String(productId)
    );
}


/* =========================================================
   GET PRODUCT SIZE STOCK
========================================================= */

function getProductSizeStock(
    productId,
    colorName,
    size
) {

    const product =
        getProduct(productId);

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
   LOAD CHECKOUT PAGE
========================================================= */

export function loadCheckoutPage() {

    /* =====================================================
       LOGIN REQUIRED

       Customer login ke bina checkout nahi kar sakta.
    ===================================================== */

    if (!isLoggedIn()) {

        window.location.href =
            "/login?redirect=/checkout";

        return;
    }


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const currentUser =
        getCurrentUser();


    /* =====================================================
       CHECKOUT CONTAINER
    ===================================================== */

    const container =
        document.querySelector(
            "#checkout"
        );

    if (!container) {

        console.error(
            "#checkout container not found"
        );

        return;
    }


    /* =====================================================
       GET CART
    ===================================================== */

    const cart =
        getCart();


    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        container.innerHTML = `

            <main class="checkout-page">

                <section class="checkout-empty">

                    <div class="checkout-empty-icon">
                        🛒
                    </div>

                    <p class="checkout-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>
                        YOUR CART IS EMPTY
                    </h1>

                    <p>
                        Add some products to your cart
                        before continuing to checkout.
                    </p>

                    <a
                        href="/"
                        class="checkout-back-btn"
                    >
                        CONTINUE SHOPPING
                    </a>

                </section>

            </main>
        `;

        return;
    }


    /* =====================================================
       TOTALS
    ===================================================== */

    const subtotal =
        getCartSubtotal(cart);

    const delivery = 0;

    const total =
        subtotal + delivery;

    const totalQuantity =
        cart.reduce(
            (sum, item) => {

                return (
                    sum +
                    Number(
                        item.quantity || 1
                    )
                );
            },
            0
        );


    /* =====================================================
       CHECKOUT HTML
    ===================================================== */

    container.innerHTML = `

        <main class="checkout-page">

            <!-- =========================================
                 HEADER
            ========================================== -->

            <section class="checkout-header">

                <p class="checkout-eyebrow">
                    ASTRIKE SPORTS
                </p>

                <h1>
                    CHECKOUT
                </h1>

                <p class="checkout-header-text">
                    Complete your details to place
                    your order.
                </p>

            </section>


            <!-- =========================================
                 CONTENT
            ========================================== -->

            <section class="checkout-content">


                <!-- =====================================
                     FORM
                ====================================== -->

                <div class="checkout-form-section">


                    <!-- =================================
                         CUSTOMER DETAILS
                    ================================== -->

                    <div class="checkout-card">

                        <div class="checkout-card-header">

                            <span>
                                01
                            </span>

                            <div>

                                <p>
                                    CHECKOUT
                                </p>

                                <h2>
                                    CUSTOMER DETAILS
                                </h2>

                            </div>

                        </div>


                        <div class="checkout-form-grid">


                            <!-- FIRST NAME -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutFirstName"
                                >
                                    First Name *
                                </label>

                                <input
                                    type="text"
                                    id="checkoutFirstName"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    autocomplete="given-name"
                                    value="${
                                        currentUser?.firstName ||
                                        ""
                                    }"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="firstName"
                                ></small>

                            </div>


                            <!-- LAST NAME -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutLastName"
                                >
                                    Last Name *
                                </label>

                                <input
                                    type="text"
                                    id="checkoutLastName"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    autocomplete="family-name"
                                    value="${
                                        currentUser?.lastName ||
                                        ""
                                    }"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="lastName"
                                ></small>

                            </div>


                            <!-- PHONE -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutPhone"
                                >
                                    Mobile Number *
                                </label>

                                <input
                                    type="tel"
                                    id="checkoutPhone"
                                    name="phone"
                                    placeholder="10 digit mobile number"
                                    autocomplete="tel"
                                    maxlength="10"
                                    inputmode="numeric"
                                    value="${
                                        currentUser?.phone ||
                                        currentUser?.mobile ||
                                        ""
                                    }"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="phone"
                                ></small>

                            </div>


                            <!-- EMAIL -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutEmail"
                                >
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="checkoutEmail"
                                    name="email"
                                    placeholder="Enter email address"
                                    autocomplete="email"
                                    value="${
                                        currentUser?.email ||
                                        ""
                                    }"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="email"
                                ></small>

                            </div>

                        </div>

                    </div>


                    <!-- =================================
                         SHIPPING ADDRESS
                    ================================== -->

                    <div class="checkout-card">

                        <div class="checkout-card-header">

                            <span>
                                02
                            </span>

                            <div>

                                <p>
                                    DELIVERY
                                </p>

                                <h2>
                                    SHIPPING ADDRESS
                                </h2>

                            </div>

                        </div>


                        <div class="checkout-form-grid">


                            <!-- ADDRESS -->

                            <div
                                class="
                                    checkout-field
                                    checkout-field-full
                                "
                            >

                                <label
                                    for="checkoutAddress"
                                >
                                    Address *
                                </label>

                                <textarea
                                    id="checkoutAddress"
                                    name="address"
                                    rows="3"
                                    placeholder="House no, street, area"
                                    autocomplete="street-address"
                                ></textarea>

                                <small
                                    class="checkout-error"
                                    data-error-for="address"
                                ></small>

                            </div>


                            <!-- CITY -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutCity"
                                >
                                    City *
                                </label>

                                <input
                                    type="text"
                                    id="checkoutCity"
                                    name="city"
                                    placeholder="Enter city"
                                    autocomplete="address-level2"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="city"
                                ></small>

                            </div>


                            <!-- STATE -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutState"
                                >
                                    State *
                                </label>

                                <input
                                    type="text"
                                    id="checkoutState"
                                    name="state"
                                    placeholder="Enter state"
                                    autocomplete="address-level1"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="state"
                                ></small>

                            </div>


                            <!-- PINCODE -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutPincode"
                                >
                                    Pincode *
                                </label>

                                <input
                                    type="text"
                                    id="checkoutPincode"
                                    name="pincode"
                                    placeholder="6 digit pincode"
                                    maxlength="6"
                                    inputmode="numeric"
                                    autocomplete="postal-code"
                                >

                                <small
                                    class="checkout-error"
                                    data-error-for="pincode"
                                ></small>

                            </div>


                            <!-- COUNTRY -->

                            <div class="checkout-field">

                                <label
                                    for="checkoutCountry"
                                >
                                    Country
                                </label>

                                <input
                                    type="text"
                                    id="checkoutCountry"
                                    name="country"
                                    value="India"
                                    autocomplete="country-name"
                                >

                            </div>

                        </div>

                    </div>


                    <!-- =================================
                         PAYMENT
                    ================================== -->

                    <div class="checkout-card">

                        <div class="checkout-card-header">

                            <span>
                                03
                            </span>

                            <div>

                                <p>
                                    PAYMENT
                                </p>

                                <h2>
                                    PAYMENT METHOD
                                </h2>

                            </div>

                        </div>


                        <div class="payment-options">


                            <!-- COD -->

                            <label class="payment-option">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked
                                >

                                <span
                                    class="payment-radio"
                                ></span>

                                <span
                                    class="payment-content"
                                >

                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <small>
                                        Pay when your order
                                        is delivered.
                                    </small>

                                </span>

                            </label>


                            <!-- ONLINE -->

                            <label class="payment-option">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ONLINE"
                                >

                                <span
                                    class="payment-radio"
                                ></span>

                                <span
                                    class="payment-content"
                                >

                                    <strong>
                                        Online Payment
                                    </strong>

                                    <small>
                                        Payment gateway can
                                        be connected later.
                                    </small>

                                </span>

                            </label>

                        </div>

                    </div>


                    <!-- =================================
                         PLACE ORDER
                    ================================== -->

                    <div class="checkout-place-order">

                        <label class="checkout-terms">

                            <input
                                type="checkbox"
                                id="checkoutTerms"
                            >

                            <span>
                                I agree to the terms and
                                conditions.
                            </span>

                        </label>

                        <small
                            class="checkout-error"
                            data-error-for="terms"
                        ></small>


                        <button
                            type="button"
                            id="placeOrderButton"
                            class="place-order-btn"
                        >
                            PLACE ORDER
                        </button>


                        <a
                            href="/cart"
                            class="back-to-cart"
                        >
                            ← BACK TO CART
                        </a>

                    </div>

                </div>


                <!-- =====================================
                     ORDER SUMMARY
                ====================================== -->

                <aside class="checkout-summary">

                    <div class="checkout-summary-inner">

                        <p class="checkout-summary-label">
                            YOUR ORDER
                        </p>

                        <h2>
                            ORDER SUMMARY
                        </h2>


                        <!-- PRODUCTS -->

                        <div class="checkout-products">

                            ${
                                cart
                                    .map(item => {

                                        const quantity =
                                            Number(
                                                item.quantity || 1
                                            );

                                        const itemTotal =
                                            Number(
                                                item.price || 0
                                            ) *
                                            quantity;

                                        return `

                                            <article
                                                class="checkout-product"
                                            >

                                                <div
                                                    class="
                                                        checkout-product-image
                                                    "
                                                >

                                                    ${
                                                        item.image
                                                            ? `
                                                                <img
                                                                    src="${item.image}"
                                                                    alt="${
                                                                        item.name ||
                                                                        "Product"
                                                                    }"
                                                                >
                                                            `
                                                            : `
                                                                <div
                                                                    class="no-image"
                                                                >
                                                                    No Image
                                                                </div>
                                                            `
                                                    }

                                                    <span>
                                                        ${quantity}
                                                    </span>

                                                </div>


                                                <div
                                                    class="
                                                        checkout-product-info
                                                    "
                                                >

                                                    <h3>
                                                        ${
                                                            item.name ||
                                                            "Product"
                                                        }
                                                    </h3>

                                                    <p>

                                                        ${
                                                            item.color ||
                                                            "Default"
                                                        }

                                                        /

                                                        ${
                                                            item.size ||
                                                            "-"
                                                        }

                                                    </p>

                                                    <strong>
                                                        ${formatPrice(
                                                            itemTotal
                                                        )}
                                                    </strong>

                                                </div>

                                            </article>
                                        `;
                                    })
                                    .join("")
                            }

                        </div>


                        <div
                            class="checkout-summary-divider"
                        ></div>


                        <!-- ITEMS -->

                        <div class="checkout-summary-row">

                            <span>
                                Items
                            </span>

                            <strong>
                                ${totalQuantity}
                            </strong>

                        </div>


                        <!-- SUBTOTAL -->

                        <div class="checkout-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatPrice(subtotal)}
                            </strong>

                        </div>


                        <!-- DELIVERY -->

                        <div class="checkout-summary-row">

                            <span>
                                Delivery
                            </span>

                            <strong class="free-text">
                                FREE
                            </strong>

                        </div>


                        <div
                            class="checkout-summary-divider"
                        ></div>


                        <!-- TOTAL -->

                        <div class="checkout-summary-total">

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                ${formatPrice(total)}
                            </strong>

                        </div>


                        <p class="checkout-secure-text">
                            🔒 Secure checkout
                        </p>

                    </div>

                </aside>

            </section>

        </main>
    `;


    /* =====================================================
       EVENTS
    ===================================================== */

    attachCheckoutEvents(
        cart,
        subtotal,
        delivery,
        total
    );
}


/* =========================================================
   ATTACH EVENTS
========================================================= */

function attachCheckoutEvents(
    cart,
    subtotal,
    delivery,
    total
) {

    const placeOrderButton =
        document.querySelector(
            "#placeOrderButton"
        );

    if (!placeOrderButton) {
        return;
    }


    /* =====================================================
       PHONE
    ===================================================== */

    const phoneInput =
        document.querySelector(
            "#checkoutPhone"
        );

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                phoneInput.value =
                    phoneInput.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
            }
        );
    }


    /* =====================================================
       PINCODE
    ===================================================== */

    const pincodeInput =
        document.querySelector(
            "#checkoutPincode"
        );

    if (pincodeInput) {

        pincodeInput.addEventListener(
            "input",
            () => {

                pincodeInput.value =
                    pincodeInput.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
            }
        );
    }


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    placeOrderButton.addEventListener(
        "click",
        () => {

            clearCheckoutErrors();


            /* =============================================
               LOGIN DOUBLE CHECK

               User checkout page par login ke baad aaya
               ho, phir bhi order place karte waqt check.
            ============================================== */

            if (!isLoggedIn()) {

                window.location.href =
                    "/login?redirect=/checkout";

                return;
            }


            /* =============================================
               GET VALUES
            ============================================== */

            const firstName =
                getInputValue(
                    "checkoutFirstName"
                );

            const lastName =
                getInputValue(
                    "checkoutLastName"
                );

            const phone =
                getInputValue(
                    "checkoutPhone"
                );

            const email =
                getInputValue(
                    "checkoutEmail"
                );

            const address =
                getInputValue(
                    "checkoutAddress"
                );

            const city =
                getInputValue(
                    "checkoutCity"
                );

            const state =
                getInputValue(
                    "checkoutState"
                );

            const pincode =
                getInputValue(
                    "checkoutPincode"
                );

            const country =
                getInputValue(
                    "checkoutCountry"
                );

            const terms =
                document.querySelector(
                    "#checkoutTerms"
                )?.checked;

            const paymentMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                )?.value || "COD";


            /* =============================================
               VALIDATION
            ============================================== */

            let isValid = true;


            /* FIRST NAME */

            if (!firstName) {

                showCheckoutError(
                    "firstName",
                    "First name is required."
                );

                isValid = false;
            }


            /* LAST NAME */

            if (!lastName) {

                showCheckoutError(
                    "lastName",
                    "Last name is required."
                );

                isValid = false;
            }


            /* PHONE */

            if (
                !/^[6-9]\d{9}$/.test(phone)
            ) {

                showCheckoutError(
                    "phone",
                    "Enter a valid 10 digit mobile number."
                );

                isValid = false;
            }


            /* EMAIL */

            if (
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {

                showCheckoutError(
                    "email",
                    "Enter a valid email address."
                );

                isValid = false;
            }


            /* ADDRESS */

            if (!address) {

                showCheckoutError(
                    "address",
                    "Address is required."
                );

                isValid = false;
            }


            /* CITY */

            if (!city) {

                showCheckoutError(
                    "city",
                    "City is required."
                );

                isValid = false;
            }


            /* STATE */

            if (!state) {

                showCheckoutError(
                    "state",
                    "State is required."
                );

                isValid = false;
            }


            /* PINCODE */

            if (
                !/^\d{6}$/.test(pincode)
            ) {

                showCheckoutError(
                    "pincode",
                    "Enter a valid 6 digit pincode."
                );

                isValid = false;
            }


            /* TERMS */

            if (!terms) {

                showCheckoutError(
                    "terms",
                    "Please accept the terms and conditions."
                );

                isValid = false;
            }


            /* =============================================
               STOP
            ============================================== */

            if (!isValid) {

                const firstError =
                    document.querySelector(
                        ".checkout-error:not(:empty)"
                    );

                firstError?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }


            /* =============================================
               PREVENT DOUBLE CLICK
            ============================================== */

            placeOrderButton.disabled = true;

            placeOrderButton.textContent =
                "PLACING ORDER...";


            /* =============================================
               CREATE ORDER
            ============================================== */

            const order =
                createOrder({

                    cart,

                    subtotal,

                    delivery,

                    total,

                    customer: {

                        firstName,

                        lastName,

                        fullName:
                            `${firstName} ${lastName}`,

                        phone,

                        email
                    },

                    shippingAddress: {

                        address,

                        city,

                        state,

                        pincode,

                        country
                    },

                    paymentMethod
                });


            /* =============================================
               SAVE ORDER
            ============================================== */

            const orders =
                getOrders();

            orders.push(order);

            saveOrders(orders);


            /* =============================================
               CLEAR CART
            ============================================== */

            localStorage.removeItem(
                CART_KEY
            );


            /* =============================================
               CART UPDATE EVENT
            ============================================== */

            window.dispatchEvent(
                new Event("cartUpdated")
            );


            /* =============================================
               SUCCESS
            ============================================== */

            showOrderSuccess(order);
        }
    );
}


/* =========================================================
   CREATE ORDER
========================================================= */

function createOrder({
    cart,
    subtotal,
    delivery,
    total,
    customer,
    shippingAddress,
    paymentMethod
}) {

    const now =
        new Date();


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const currentUser =
        getCurrentUser();


    /* =====================================================
       ORDER ITEMS
    ===================================================== */

    const orderItems =
        cart.map(item => {

            const quantity =
                Number(
                    item.quantity || 1
                );

            const price =
                Number(
                    item.price || 0
                );


            return {

                productId:
                    item.productId,

                slug:
                    item.slug || "",

                name:
                    item.name || "Product",

                brand:
                    item.brand ||
                    "ASTRIKE SPORTS",

                image:
                    item.image || "",

                color:
                    item.color || "Default",

                size:
                    item.size || "-",

                price,

                oldPrice:
                    Number(
                        item.oldPrice || 0
                    ),

                quantity,

                itemTotal:
                    price * quantity
            };
        });


    /* =====================================================
       ORDER OBJECT
    ===================================================== */

    return {

        /* ORDER ID */

        orderId:
            generateOrderId(),


        /* DATE */

        createdAt:
            now.toISOString(),


        /* USER ID / EMAIL

           Admin ke liye customer order identify karna
           easy hoga.
        */

        userId:
            currentUser?.id ||
            currentUser?.userId ||
            currentUser?.email ||
            null,

        userEmail:
            currentUser?.email ||
            customer.email ||
            "",


        /* STATUS */

        status:
            "Placed",


        /* PAYMENT STATUS */

        paymentStatus:
            paymentMethod === "COD"
                ? "Pending"
                : "Paid",


        /* PAYMENT METHOD */

        paymentMethod,


        /* CUSTOMER */

        customer,


        /* SHIPPING */

        shippingAddress,


        /* PRODUCTS */

        items:
            orderItems,


        /* TOTAL QUANTITY */

        totalQuantity:
            orderItems.reduce(
                (sum, item) => {

                    return (
                        sum +
                        item.quantity
                    );
                },
                0
            ),


        /* PRICE */

        subtotal,

        delivery,

        total
    };
}


/* =========================================================
   GET INPUT VALUE
========================================================= */

function getInputValue(id) {

    const input =
        document.getElementById(id);

    return input
        ? input.value.trim()
        : "";
}


/* =========================================================
   SHOW ERROR
========================================================= */

function showCheckoutError(
    field,
    message
) {

    const error =
        document.querySelector(
            `[data-error-for="${field}"]`
        );

    if (error) {

        error.textContent =
            message;
    }


    const input =
        document.getElementById(
            `checkout${capitalize(field)}`
        );

    if (input) {

        input.classList.add(
            "checkout-input-error"
        );
    }
}


/* =========================================================
   CLEAR ERRORS
========================================================= */

function clearCheckoutErrors() {

    document
        .querySelectorAll(
            ".checkout-error"
        )
        .forEach(error => {

            error.textContent = "";
        });


    document
        .querySelectorAll(
            ".checkout-input-error"
        )
        .forEach(input => {

            input.classList.remove(
                "checkout-input-error"
            );
        });
}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
}


/* =========================================================
   ORDER SUCCESS
========================================================= */

function showOrderSuccess(order) {

    const container =
        document.querySelector(
            "#checkout"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <main class="checkout-page">

            <section class="order-success">

                <div class="order-success-icon">
                    ✓
                </div>


                <p class="checkout-eyebrow">
                    ORDER CONFIRMED
                </p>


                <h1>
                    THANK YOU FOR YOUR ORDER
                </h1>


                <p class="order-success-text">
                    Your order has been placed
                    successfully.
                </p>


                <!-- ORDER ID -->

                <div class="order-success-id">

                    <span>
                        ORDER ID
                    </span>

                    <strong>
                        ${order.orderId}
                    </strong>

                </div>


                <!-- DETAILS -->

                <div class="order-success-details">

                    <div>

                        <span>
                            STATUS
                        </span>

                        <strong>
                            ${order.status}
                        </strong>

                    </div>


                    <div>

                        <span>
                            PAYMENT
                        </span>

                        <strong>
                            ${order.paymentMethod}
                        </strong>

                    </div>


                    <div>

                        <span>
                            TOTAL
                        </span>

                        <strong>
                            ${formatPrice(order.total)}
                        </strong>

                    </div>

                </div>


                <!-- NOTE -->

                <div class="order-success-note">

                    <strong>
                        Order Status: ${order.status}
                    </strong>

                    <p>
                        Your order will remain in the
                        delivery process until the parcel
                        reaches you.
                    </p>

                </div>


                <!-- ACTIONS -->

                <div class="order-success-actions">

                    <a
                        href="/orders"
                        class="view-orders-btn"
                    >
                        VIEW MY ORDERS
                    </a>


                    <a
                        href="/"
                        class="continue-shopping-btn"
                    >
                        CONTINUE SHOPPING
                    </a>

                </div>

            </section>

        </main>
    `;
}