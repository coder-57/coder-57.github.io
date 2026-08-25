/* =========================================================
   ASTRIKE SPORTS
   ORDERS PAGE
   USER-SPECIFIC ORDERS FROM LOCAL STORAGE
========================================================= */

import "./orders-page.css";

import {
    getCurrentUser
} from "../../utils/auth.js";


/* =========================================================
   STORAGE KEY
========================================================= */

const ORDERS_KEY = "astrike_orders";


/* =========================================================
   GET ALL ORDERS
========================================================= */

function getOrders() {

    try {

        const data =
            localStorage.getItem(
                ORDERS_KEY
            );

        if (!data) {
            return [];
        }

        const orders =
            JSON.parse(data);

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
   GET CURRENT USER ORDERS
========================================================= */

function getCurrentUserOrders() {

    const currentUser =
        getCurrentUser();

    /* =====================================================
       USER NOT LOGGED IN
    ===================================================== */

    if (!currentUser) {
        return [];
    }


    /* =====================================================
       GET ALL ORDERS
    ===================================================== */

    const allOrders =
        getOrders();


    /* =====================================================
       FILTER ORDERS BY USER ID
    ===================================================== */

    return allOrders.filter(
        order =>
            String(order.userId) ===
            String(currentUser.id)
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
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {
        return "Date unavailable";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "Date unavailable";

    }

    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   LOAD ORDERS PAGE
========================================================= */

export function loadOrdersPage() {

    const container =
        document.querySelector(
            "#orders"
        );


    /* =====================================================
       CONTAINER CHECK
    ===================================================== */

    if (!container) {

        console.error(
            "#orders container not found"
        );

        return;

    }


    /* =====================================================
       CHECK CURRENT USER
    ===================================================== */

    const currentUser =
        getCurrentUser();


    /* =====================================================
       USER NOT LOGGED IN
    ===================================================== */

    if (!currentUser) {

        container.innerHTML = `

            <main class="orders-page">

                <section class="orders-header">

                    <p class="orders-label">
                        MY ACCOUNT
                    </p>

                    <h1>
                        MY ORDERS
                    </h1>

                    <span>
                        0 ORDERS
                    </span>

                </section>


                <section class="orders-empty">

                    <div class="orders-empty-icon">
                        🔐
                    </div>

                    <h2>
                        Please Login
                    </h2>

                    <p>
                        Please login to view your orders.
                    </p>

                    <a
                        href="/login"
                        class="orders-shopping-btn"
                    >
                        LOGIN
                    </a>

                </section>

            </main>

        `;

        return;

    }


    /* =====================================================
       GET ONLY CURRENT USER ORDERS
    ===================================================== */

    const orders =
        getCurrentUserOrders();


    /* =====================================================
       EMPTY ORDERS
    ===================================================== */

    if (
        orders.length === 0
    ) {

        container.innerHTML = `

            <main class="orders-page">

                <section class="orders-header">

                    <p class="orders-label">
                        MY ACCOUNT
                    </p>

                    <h1>
                        MY ORDERS
                    </h1>

                    <span>
                        0 ORDERS
                    </span>

                </section>


                <section class="orders-empty">

                    <div class="orders-empty-icon">
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="/"
                        class="orders-shopping-btn"
                    >
                        START SHOPPING
                    </a>

                </section>

            </main>

        `;

        return;

    }


    /* =====================================================
       TOTAL ORDERS
    ===================================================== */

    const totalOrders =
        orders.length;


    /* =====================================================
       ORDERS HTML
    ===================================================== */

    container.innerHTML = `

        <main class="orders-page">


            <!-- =========================================
                 HEADER
            ========================================== -->

            <section class="orders-header">

                <p class="orders-label">
                    MY ACCOUNT
                </p>

                <h1>
                    MY ORDERS
                </h1>

                <span>
                    ${totalOrders}
                    ${
                        totalOrders === 1
                            ? " ORDER"
                            : " ORDERS"
                    }
                </span>

            </section>


            <!-- =========================================
                 ORDERS LIST
            ========================================== -->

            <section class="orders-list">

                ${
                    orders
                        .map(
                            (
                                order,
                                orderIndex
                            ) => {

                                return createOrderCard(
                                    order,
                                    orderIndex
                                );

                            }
                        )
                        .join("")
                }

            </section>


        </main>

    `;

}


/* =========================================================
   CREATE ORDER CARD
========================================================= */

function createOrderCard(
    order,
    orderIndex
) {

    const orderId =
        order.orderId ||
        order.id ||
        `AST-${orderIndex + 1}`;


    const orderDate =
        order.createdAt ||
        order.date ||
        order.orderDate;


    const status =
        order.status ||
        "Confirmed";


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const total =
        order.total ??
        order.subtotal ??
        items.reduce(
            (
                sum,
                item
            ) => {

                return sum +

                    (
                        Number(
                            item.price
                        ) || 0
                    )

                    *

                    (
                        Number(
                            item.quantity
                        ) || 1
                    );

            },
            0
        );


    return `

        <article
            class="order-card"
        >


            <!-- =====================================
                 ORDER TOP
            ====================================== -->

            <div class="order-card-header">


                <div class="order-number">

                    <span>
                        ORDER
                    </span>

                    <strong>
                        #${orderId}
                    </strong>

                </div>


                <div class="order-date">

                    <span>
                        ORDERED ON
                    </span>

                    <strong>
                        ${formatDate(orderDate)}
                    </strong>

                </div>


                <div
                    class="order-status order-status-${String(status)
                        .toLowerCase()
                        .replace(/\s+/g, "-")}"
                >
                    ${status}
                </div>


            </div>


            <!-- =====================================
                 ORDER ITEMS
            ====================================== -->

            <div class="order-items">

                ${
                    items.length

                        ?

                    items
                        .map(
                            item =>
                                createOrderItem(
                                    item
                                )
                        )
                        .join("")

                        :

                    `

                        <div class="order-no-items">
                            Order items unavailable.
                        </div>

                    `
                }

            </div>


            <!-- =====================================
                 ORDER BOTTOM
            ====================================== -->

            <div class="order-card-footer">


                <div class="order-items-count">

                    ${
                        items.reduce(
                            (
                                total,
                                item
                            ) => {

                                return total +

                                    Number(
                                        item.quantity || 1
                                    );

                            },
                            0
                        )
                    }

                    ${
                        items.length === 1
                            ? " ITEM"
                            : " ITEMS"
                    }

                </div>


                <div class="order-total">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        ${formatPrice(total)}
                    </strong>

                </div>


            </div>


        </article>

    `;

}


/* =========================================================
   CREATE ORDER ITEM
========================================================= */

function createOrderItem(item) {

    const image =
        item.image ||
        item.images?.[0] ||
        "/images/products/placeholder.jpg";


    const name =
        item.name ||
        "Product";


    const quantity =
        Number(
            item.quantity || 1
        );


    const price =
        Number(
            item.price || 0
        );


    return `

        <div class="order-item">


            <!-- IMAGE -->

            <div class="order-item-image">

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                >

            </div>


            <!-- INFO -->

            <div class="order-item-info">

                <h3>
                    ${name}
                </h3>


                ${
                    item.brand

                        ?

                    `
                        <p class="order-item-brand">
                            ${item.brand}
                        </p>
                    `

                        :

                    ""
                }


                ${
                    item.color

                        ?

                    `
                        <span>
                            Color:
                            <strong>
                                ${item.color}
                            </strong>
                        </span>
                    `

                        :

                    ""
                }


                ${
                    item.size

                        ?

                    `
                        <span>
                            Size:
                            <strong>
                                ${item.size}
                            </strong>
                        </span>
                    `

                        :

                    ""
                }

            </div>


            <!-- QUANTITY -->

            <div class="order-item-quantity">

                <span>
                    QTY
                </span>

                <strong>
                    ${quantity}
                </strong>

            </div>


            <!-- PRICE -->

            <div class="order-item-price">

                <strong>
                    ${formatPrice(
                        price * quantity
                    )}
                </strong>

            </div>


        </div>

    `;

}