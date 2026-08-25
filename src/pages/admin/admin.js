/* =========================================================
   ASTRIKE SPORTS
   ADMIN PANEL
   PRODUCT + CUSTOMER + ORDER MANAGEMENT
========================================================= */

import "./admin.css";

import {
    isAdmin,
    getCurrentUser,
    getUsers,
    logoutUser
} from "../../utils/auth.js";

import {
    getAdminProducts,
    addAdminProduct,
    deleteAdminProduct
} from "../../utils/adminProducts.js";


/* =========================================================
   STORAGE
========================================================= */

const ORDERS_KEY = "astrike_orders";


/* =========================================================
   ORDER STATUS
========================================================= */

const ORDER_STATUSES = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Completed"
];


/* =========================================================
   LOAD ORDERS
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
            "Unable to read orders:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE ORDERS
========================================================= */

function saveOrders(orders) {

    try {

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save orders:",
            error
        );

        return false;

    }

}


/* =========================================================
   LOAD ADMIN PAGE
========================================================= */

export function loadAdminPage() {

    const container =
        document.getElementById("admin");


    if (!container) {

        console.error(
            "Admin container not found"
        );

        return;

    }


    /* =====================================================
       ADMIN AUTH CHECK
    ===================================================== */

    if (!isAdmin()) {

        container.innerHTML = `

            <section class="admin-access-denied">

                <div class="access-box">

                    <h1>
                        Access Denied
                    </h1>

                    <p>
                        You do not have permission
                        to access the Admin Panel.
                    </p>

                    <a href="/login">
                        Go To Login
                    </a>

                </div>

            </section>

        `;

        return;
    }


    /* =====================================================
       CURRENT ADMIN
    ===================================================== */

    const admin =
        getCurrentUser();


    /* =====================================================
       USERS
    ===================================================== */

    const users =
        getUsers();


    const customers =
        users.filter(
            user =>
                user.role === "customer"
        );


    /* =====================================================
       PRODUCTS
    ===================================================== */

    const products =
        getAdminProducts();


    /* =====================================================
       ORDERS
    ===================================================== */

    const orders =
        getOrders();


    /* =====================================================
       RENDER
    ===================================================== */

    renderAdminDashboard({

        container,

        admin,

        users,

        customers,

        products,

        orders

    });

}


/* =========================================================
   RENDER DASHBOARD
========================================================= */

function renderAdminDashboard({

    container,

    admin,

    users,

    customers,

    products,

    orders

}) {

    container.innerHTML = `

        <section class="admin-page">

            <div class="admin-wrapper">


                <!-- =====================================
                     HEADER
                ====================================== -->

                <header class="admin-header">

                    <div>

                        <span class="admin-label">
                            ASTRIKE SPORTS
                        </span>

                        <h1>
                            Admin Panel
                        </h1>

                        <p>
                            Welcome,
                            ${escapeHtml(
                                admin?.name ||
                                "Admin"
                            )}
                        </p>

                    </div>


                    <button
                        id="adminLogout"
                        class="admin-logout"
                    >
                        Logout
                    </button>

                </header>


                <!-- =====================================
                     STATS
                ====================================== -->

                <div class="admin-stats">


                    <!-- USERS -->

                    <div class="admin-stat-card">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            ${users.length}
                        </strong>

                    </div>


                    <!-- CUSTOMERS -->

                    <div class="admin-stat-card">

                        <span>
                            Customers
                        </span>

                        <strong>
                            ${customers.length}
                        </strong>

                    </div>


                    <!-- PRODUCTS -->

                    <div class="admin-stat-card">

                        <span>
                            Admin Products
                        </span>

                        <strong>
                            ${products.length}
                        </strong>

                    </div>


                    <!-- ORDERS -->

                    <div class="admin-stat-card">

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            ${orders.length}
                        </strong>

                    </div>


                </div>


                <!-- =====================================
                     ORDER MANAGEMENT
                ====================================== -->

                <section class="admin-section">


                    <div class="admin-section-header">

                        <div>

                            <h2>
                                Order Management
                            </h2>

                            <p>
                                View and manage customer orders.
                            </p>

                        </div>

                    </div>


                    <div class="admin-order-stats">

                        <div class="admin-order-stat">

                            <span>
                                Placed
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Placed"
                                )}
                            </strong>

                        </div>


                        <div class="admin-order-stat">

                            <span>
                                Processing
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Processing"
                                )}
                            </strong>

                        </div>


                        <div class="admin-order-stat">

                            <span>
                                Shipped
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Shipped"
                                )}
                            </strong>

                        </div>


                        <div class="admin-order-stat">

                            <span>
                                Out for Delivery
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Out for Delivery"
                                )}
                            </strong>

                        </div>


                        <div class="admin-order-stat">

                            <span>
                                Delivered
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Delivered"
                                )}
                            </strong>

                        </div>


                        <div class="admin-order-stat">

                            <span>
                                Completed
                            </span>

                            <strong>
                                ${countOrdersByStatus(
                                    orders,
                                    "Completed"
                                )}
                            </strong>

                        </div>

                    </div>


                    <!-- ORDER TABLE -->

                    <div class="admin-table-wrapper">

                        <table class="admin-table admin-orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Products
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="adminOrdersTable">

                                ${renderOrderRows(
                                    orders
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


                <!-- =====================================
                     PRODUCT MANAGEMENT
                ====================================== -->

                <section class="admin-section">


                    <div class="admin-section-header">

                        <div>

                            <h2>
                                Product Management
                            </h2>

                            <p>
                                Manage products from
                                the Admin Panel.
                            </p>

                        </div>


                        <button
                            id="addProductBtn"
                            class="admin-primary-btn"
                        >
                            + Add Product
                        </button>

                    </div>


                    <!-- PRODUCT FORM -->

                    <div
                        id="productFormContainer"
                        class="product-form-container hidden"
                    >

                        ${getProductForm()}

                    </div>


                    <!-- PRODUCT TABLE -->

                    <div class="admin-table-wrapper">

                        <table class="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="adminProductTable">

                                ${renderProductRows(
                                    products
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


                <!-- =====================================
                     CUSTOMERS
                ====================================== -->

                <section class="admin-section">


                    <div class="admin-section-header">

                        <div>

                            <h2>
                                Customer Accounts
                            </h2>

                            <p>
                                Registered customers.
                            </p>

                        </div>

                    </div>


                    <div class="admin-table-wrapper">

                        <table class="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${
                                    customers.length

                                    ?

                                    customers
                                        .map(
                                            user => `

                                                <tr>

                                                    <td>
                                                        ${escapeHtml(
                                                            user.name
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${escapeHtml(
                                                            user.email
                                                        )}
                                                    </td>

                                                    <td>

                                                        <span
                                                            class="role-badge customer"
                                                        >
                                                            Customer
                                                        </span>

                                                    </td>

                                                    <td>
                                                        ${formatDate(
                                                            user.createdAt
                                                        )}
                                                    </td>

                                                </tr>

                                            `
                                        )
                                        .join("")

                                    :

                                    `

                                        <tr>

                                            <td
                                                colspan="4"
                                                class="empty-users"
                                            >
                                                No customers
                                                registered yet.
                                            </td>

                                        </tr>

                                    `
                                }

                            </tbody>

                        </table>

                    </div>

                </section>


            </div>

        </section>

    `;


    attachAdminEvents();

}


/* =========================================================
   PRODUCT FORM
========================================================= */

function getProductForm() {

    return `

        <form
            id="adminProductForm"
            class="admin-product-form"
        >


            <div class="form-field">

                <label>
                    Product Name
                </label>

                <input
                    type="text"
                    id="productName"
                    placeholder="Men Performance T-Shirt"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Brand
                </label>

                <input
                    type="text"
                    id="productBrand"
                    placeholder="Astrike Sports"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Category
                </label>

                <input
                    type="text"
                    id="productCategory"
                    placeholder="men"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Sub Category
                </label>

                <input
                    type="text"
                    id="productSubCategory"
                    placeholder="t-shirts"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Price
                </label>

                <input
                    type="number"
                    id="productPrice"
                    placeholder="909"
                    min="0"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Old Price
                </label>

                <input
                    type="number"
                    id="productOldPrice"
                    placeholder="1309"
                    min="0"
                >

            </div>


            <div class="form-field">

                <label>
                    Stock
                </label>

                <input
                    type="number"
                    id="productStock"
                    placeholder="50"
                    min="0"
                    required
                >

            </div>


            <div class="form-field">

                <label>
                    Rating
                </label>

                <input
                    type="number"
                    id="productRating"
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                >

            </div>


            <div class="form-field full">

                <label>
                    Product Image URL
                </label>

                <input
                    type="url"
                    id="productImage"
                    placeholder="https://..."
                    required
                >

            </div>


            <div class="product-form-actions">

                <button
                    type="submit"
                    class="admin-primary-btn"
                >
                    Add Product
                </button>


                <button
                    type="button"
                    id="cancelProductBtn"
                    class="admin-secondary-btn"
                >
                    Cancel
                </button>

            </div>


        </form>

    `;

}


/* =========================================================
   PRODUCT ROWS
========================================================= */

function renderProductRows(products) {

    if (!products.length) {

        return `

            <tr>

                <td
                    colspan="5"
                    class="empty-users"
                >
                    No admin products added yet.
                </td>

            </tr>

        `;

    }


    return products
        .map(
            product => `

                <tr>

                    <td>

                        <div class="admin-product-info">

                            <img
                                src="${escapeHtml(
                                    product.image ||
                                    product.images?.[0] ||
                                    ""
                                )}"
                                alt="${escapeHtml(
                                    product.name
                                )}"
                            >

                            <span>
                                ${escapeHtml(
                                    product.name
                                )}
                            </span>

                        </div>

                    </td>


                    <td>
                        ${escapeHtml(
                            product.category
                        )}
                    </td>


                    <td>
                        ₹${Number(
                            product.price || 0
                        ).toLocaleString("en-IN")}
                    </td>


                    <td>
                        ${product.stock ?? 0}
                    </td>


                    <td>

                        <button
                            class="admin-delete-btn"
                            data-product-id="${escapeHtml(
                                product.id
                            )}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `
        )
        .join("");

}


/* =========================================================
   ORDER ROWS
========================================================= */

function renderOrderRows(orders) {

    if (!orders.length) {

        return `

            <tr>

                <td
                    colspan="8"
                    class="empty-users"
                >
                    No customer orders yet.
                </td>

            </tr>

        `;

    }


    /*
       Newest order first
    */

    const sortedOrders =
        [...orders].reverse();


    return sortedOrders
        .map(
            (order) => {

                const orderId =
                    order.orderId ||
                    order.id ||
                    "N/A";


                const customer =
                    order.customer || {};


                const customerName =
                    customer.fullName ||
                    `${customer.firstName || ""} ${
                        customer.lastName || ""
                    }`.trim() ||
                    "Guest Customer";


                const phone =
                    customer.phone ||
                    "";


                const items =
                    Array.isArray(order.items)
                        ? order.items
                        : [];


                const itemCount =
                    order.totalQuantity ??
                    items.reduce(
                        (
                            total,
                            item
                        ) => {

                            return (
                                total +
                                Number(
                                    item.quantity || 1
                                )
                            );

                        },
                        0
                    );


                const total =
                    Number(
                        order.total ||
                        order.subtotal ||
                        0
                    );


                const paymentMethod =
                    order.paymentMethod ||
                    "COD";


                const paymentStatus =
                    order.paymentStatus ||
                    "Pending";


                const status =
                    order.status ||
                    "Placed";


                return `

                    <tr>


                        <!-- ORDER -->

                        <td>

                            <div class="admin-order-info">

                                <strong>
                                    #${escapeHtml(
                                        orderId
                                    )}
                                </strong>

                                ${
                                    order.shippingAddress
                                        ? `

                                            <small>
                                                ${escapeHtml(
                                                    order.shippingAddress.city ||
                                                    ""
                                                )}
                                            </small>

                                        `
                                        : ""
                                }

                            </div>

                        </td>


                        <!-- CUSTOMER -->

                        <td>

                            <div class="admin-customer-info">

                                <strong>
                                    ${escapeHtml(
                                        customerName
                                    )}
                                </strong>

                                ${
                                    customer.email
                                        ? `

                                            <small>
                                                ${escapeHtml(
                                                    customer.email
                                                )}
                                            </small>

                                        `
                                        : ""
                                }

                                ${
                                    phone
                                        ? `

                                            <small>
                                                ${escapeHtml(
                                                    phone
                                                )}
                                            </small>

                                        `
                                        : ""
                                }

                            </div>

                        </td>


                        <!-- PRODUCTS -->

                        <td>

                            <button
                                type="button"
                                class="admin-view-order-btn"
                                data-order-id="${escapeHtml(
                                    orderId
                                )}"
                            >
                                ${itemCount}
                                ${
                                    itemCount === 1
                                        ? " Item"
                                        : " Items"
                                }
                            </button>

                        </td>


                        <!-- TOTAL -->

                        <td>

                            <strong>
                                ${formatPrice(
                                    total
                                )}
                            </strong>

                        </td>


                        <!-- PAYMENT -->

                        <td>

                            <div class="admin-payment-info">

                                <strong>
                                    ${escapeHtml(
                                        paymentMethod
                                    )}
                                </strong>

                                <small>
                                    ${escapeHtml(
                                        paymentStatus
                                    )}
                                </small>

                            </div>

                        </td>


                        <!-- DATE -->

                        <td>
                            ${formatDate(
                                order.createdAt ||
                                order.date ||
                                order.orderDate
                            )}
                        </td>


                        <!-- STATUS -->

                        <td>

                            <select
                                class="admin-order-status"
                                data-order-id="${escapeHtml(
                                    orderId
                                )}"
                            >

                                ${
                                    ORDER_STATUSES
                                        .map(
                                            orderStatus => `

                                                <option
                                                    value="${escapeHtml(
                                                        orderStatus
                                                    )}"
                                                    ${
                                                        orderStatus === status
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >
                                                    ${orderStatus}
                                                </option>

                                            `
                                        )
                                        .join("")
                                }

                            </select>

                        </td>


                        <!-- ACTION -->

                        <td>

                            <button
                                type="button"
                                class="admin-delete-order-btn"
                                data-order-id="${escapeHtml(
                                    orderId
                                )}"
                            >
                                Delete
                            </button>

                        </td>


                    </tr>

                `;

            }
        )
        .join("");

}


/* =========================================================
   ORDER STATUS COUNT
========================================================= */

function countOrdersByStatus(
    orders,
    status
) {

    return orders.filter(
        order =>
            String(
                order.status || "Placed"
            ).toLowerCase() ===
            status.toLowerCase()
    ).length;

}


/* =========================================================
   ORDER DETAILS
========================================================= */

function showOrderDetails(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                String(
                    item.orderId ||
                    item.id
                ) ===
                String(orderId)
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    const customer =
        order.customer || {};


    const shipping =
        order.shippingAddress || {};


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const itemsText =
        items.length

            ?

        items
            .map(
                item => {

                    const quantity =
                        Number(
                            item.quantity || 1
                        );

                    const price =
                        Number(
                            item.price || 0
                        );


                    return `

                        <div class="admin-order-detail-item">

                            <div>

                                <strong>
                                    ${escapeHtml(
                                        item.name ||
                                        "Product"
                                    )}
                                </strong>

                                <small>

                                    ${
                                        item.color
                                            ? `Color: ${escapeHtml(
                                                item.color
                                            )}`
                                            : ""
                                    }

                                    ${
                                        item.size
                                            ? ` | Size: ${escapeHtml(
                                                item.size
                                            )}`
                                            : ""
                                    }

                                </small>

                            </div>

                            <span>

                                ${quantity}
                                ×
                                ${formatPrice(
                                    price
                                )}

                            </span>

                        </div>

                    `;

                }
            )
            .join("")

            :

        `<p>No products found.</p>`;


    const existingModal =
        document.getElementById(
            "adminOrderModal"
        );


    existingModal?.remove();


    const modal =
        document.createElement("div");


    modal.id =
        "adminOrderModal";

    modal.className =
        "admin-order-modal";


    modal.innerHTML = `

        <div class="admin-order-modal-overlay">

            <div class="admin-order-modal-box">


                <button
                    type="button"
                    class="admin-order-modal-close"
                    id="closeAdminOrderModal"
                >
                    ×
                </button>


                <div class="admin-order-modal-header">

                    <span>
                        ORDER DETAILS
                    </span>

                    <h2>
                        #${escapeHtml(
                            order.orderId ||
                            order.id ||
                            "N/A"
                        )}
                    </h2>

                    <p>
                        ${formatDate(
                            order.createdAt
                        )}
                    </p>

                </div>


                <!-- CUSTOMER -->

                <div class="admin-order-detail-section">

                    <h3>
                        Customer
                    </h3>

                    <p>
                        <strong>
                            ${escapeHtml(
                                customer.fullName ||
                                `${customer.firstName || ""} ${
                                    customer.lastName || ""
                                }`.trim() ||
                                "Guest"
                            )}
                        </strong>
                    </p>

                    ${
                        customer.phone
                            ? `

                                <p>
                                    Phone:
                                    ${escapeHtml(
                                        customer.phone
                                    )}
                                </p>

                            `
                            : ""
                    }

                    ${
                        customer.email
                            ? `

                                <p>
                                    Email:
                                    ${escapeHtml(
                                        customer.email
                                    )}
                                </p>

                            `
                            : ""
                    }

                </div>


                <!-- SHIPPING -->

                <div class="admin-order-detail-section">

                    <h3>
                        Shipping Address
                    </h3>

                    <p>

                        ${escapeHtml(
                            shipping.address ||
                            ""
                        )}

                        ${
                            shipping.city
                                ? `, ${escapeHtml(
                                    shipping.city
                                )}`
                                : ""
                        }

                        ${
                            shipping.state
                                ? `, ${escapeHtml(
                                    shipping.state
                                )}`
                                : ""
                        }

                        ${
                            shipping.pincode
                                ? ` - ${escapeHtml(
                                    shipping.pincode
                                )}`
                                : ""
                        }

                        ${
                            shipping.country
                                ? `, ${escapeHtml(
                                    shipping.country
                                )}`
                                : ""
                        }

                    </p>

                </div>


                <!-- PRODUCTS -->

                <div class="admin-order-detail-section">

                    <h3>
                        Products
                    </h3>

                    <div class="admin-order-detail-items">

                        ${itemsText}

                    </div>

                </div>


                <!-- PAYMENT -->

                <div class="admin-order-detail-section">

                    <h3>
                        Payment
                    </h3>

                    <p>
                        Method:
                        <strong>
                            ${escapeHtml(
                                order.paymentMethod ||
                                "COD"
                            )}
                        </strong>
                    </p>

                    <p>
                        Status:
                        <strong>
                            ${escapeHtml(
                                order.paymentStatus ||
                                "Pending"
                            )}
                        </strong>
                    </p>

                </div>


                <!-- TOTAL -->

                <div class="admin-order-detail-total">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        ${formatPrice(
                            order.total ||
                            order.subtotal ||
                            0
                        )}
                    </strong>

                </div>


            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeButton =
        document.getElementById(
            "closeAdminOrderModal"
        );


    closeButton?.addEventListener(
        "click",
        () => {

            modal.remove();

        }
    );


    const overlay =
        modal.querySelector(
            ".admin-order-modal-overlay"
        );


    overlay?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   ATTACH ADMIN EVENTS
========================================================= */

function attachAdminEvents() {


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById(
            "adminLogout"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                logoutUser();

                window.location.href =
                    "/login";

            }
        );

    }


    /* =====================================================
       ADD PRODUCT BUTTON
    ===================================================== */

    const addProductBtn =
        document.getElementById(
            "addProductBtn"
        );


    const formContainer =
        document.getElementById(
            "productFormContainer"
        );


    if (addProductBtn) {

        addProductBtn.addEventListener(
            "click",
            () => {

                formContainer?.classList.toggle(
                    "hidden"
                );

            }
        );

    }


    /* =====================================================
       CANCEL PRODUCT
    ===================================================== */

    const cancelButton =
        document.getElementById(
            "cancelProductBtn"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                formContainer?.classList.add(
                    "hidden"
                );

            }
        );

    }


    /* =====================================================
       ADD PRODUCT FORM
    ===================================================== */

    const form =
        document.getElementById(
            "adminProductForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            handleAddProduct
        );

    }


    /* =====================================================
       DELETE PRODUCTS
    ===================================================== */

    document
        .querySelectorAll(
            ".admin-delete-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const productId =
                            button.dataset.productId;


                        const confirmDelete =
                            window.confirm(
                                "Delete this product?"
                            );


                        if (!confirmDelete) {
                            return;
                        }


                        const result =
                            deleteAdminProduct(
                                productId
                            );


                        if (result.success) {

                            loadAdminPage();

                        }

                    }
                );

            }
        );


    /* =====================================================
       ORDER STATUS CHANGE
    ===================================================== */

    document
        .querySelectorAll(
            ".admin-order-status"
        )
        .forEach(
            select => {

                select.addEventListener(
                    "change",
                    () => {

                        const orderId =
                            select.dataset.orderId;


                        const newStatus =
                            select.value;


                        updateOrderStatus(
                            orderId,
                            newStatus
                        );

                    }
                );

            }
        );


    /* =====================================================
       VIEW ORDER
    ===================================================== */

    document
        .querySelectorAll(
            ".admin-view-order-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const orderId =
                            button.dataset.orderId;


                        showOrderDetails(
                            orderId
                        );

                    }
                );

            }
        );


    /* =====================================================
       DELETE ORDER
    ===================================================== */

    document
        .querySelectorAll(
            ".admin-delete-order-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const orderId =
                            button.dataset.orderId;


                        const confirmed =
                            window.confirm(
                                "Delete this order permanently?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        deleteOrder(
                            orderId
                        );

                    }
                );

            }
        );

}


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

function updateOrderStatus(
    orderId,
    newStatus
) {

    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>
                String(
                    order.orderId ||
                    order.id
                ) ===
                String(orderId)
        );


    if (index === -1) {

        alert(
            "Order not found."
        );

        return;

    }


    orders[index] = {

        ...orders[index],

        status:
            newStatus,

        updatedAt:
            new Date().toISOString()

    };


    const saved =
        saveOrders(
            orders
        );


    if (!saved) {

        alert(
            "Unable to update order."
        );

        return;

    }


    /*
       Same browser me Orders Page
       ko update signal
    */

    window.dispatchEvent(
        new CustomEvent(
            "orderUpdated",
            {
                detail: {
                    orderId,
                    status: newStatus
                }
            }
        )
    );


    /*
       Small confirmation
    */

    showAdminMessage(
        `Order #${orderId} updated to ${newStatus}.`
    );


    /*
       Dashboard refresh
    */

    loadAdminPage();

}


/* =========================================================
   DELETE ORDER
========================================================= */

function deleteOrder(
    orderId
) {

    const orders =
        getOrders();


    const filtered =
        orders.filter(
            order =>
                String(
                    order.orderId ||
                    order.id
                ) !==
                String(orderId)
        );


    if (
        filtered.length ===
        orders.length
    ) {

        alert(
            "Order not found."
        );

        return;

    }


    saveOrders(
        filtered
    );


    loadAdminPage();

}


/* =========================================================
   ADMIN MESSAGE
========================================================= */

function showAdminMessage(
    message
) {

    const existing =
        document.getElementById(
            "adminMessage"
        );


    existing?.remove();


    const messageBox =
        document.createElement(
            "div"
        );


    messageBox.id =
        "adminMessage";


    messageBox.className =
        "admin-message";


    messageBox.textContent =
        message;


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        () => {

            messageBox.remove();

        },
        2500
    );

}


/* =========================================================
   ADD PRODUCT HANDLER
========================================================= */

function handleAddProduct(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "productName"
            )
            .value
            .trim();


    const brand =
        document
            .getElementById(
                "productBrand"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "productCategory"
            )
            .value
            .trim();


    const subCategory =
        document
            .getElementById(
                "productSubCategory"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "productPrice"
                )
                .value
        );


    const oldPrice =
        Number(
            document
                .getElementById(
                    "productOldPrice"
                )
                .value
        ) || 0;


    const stock =
        Number(
            document
                .getElementById(
                    "productStock"
                )
                .value
        );


    const rating =
        Number(
            document
                .getElementById(
                    "productRating"
                )
                .value
        ) || 0;


    const image =
        document
            .getElementById(
                "productImage"
            )
            .value
            .trim();


    if (
        !name ||
        !brand ||
        !category
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    /* =====================================================
       CREATE SLUG
    ===================================================== */

    const slug =
        name
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );


    /* =====================================================
       DISCOUNT
    ===================================================== */

    let discount = "";


    if (
        oldPrice > 0 &&
        oldPrice > price
    ) {

        const percentage =
            Math.round(
                (
                    (
                        oldPrice -
                        price
                    ) /
                    oldPrice
                ) *
                100
            );


        discount =
            `${percentage}% OFF`;

    }


    /* =====================================================
       PRODUCT
    ===================================================== */

    const product = {

        slug,

        name,

        brand,

        category,

        subCategory,

        gender:
            category,

        price,

        oldPrice,

        discount,

        currency:
            "₹",

        rating,

        reviews:
            0,

        stock,

        sold:
            0,

        fit:
            "",

        fabric:
            "",

        sizes:
            [],

        colors:
            [],

        image

    };


    addAdminProduct(
        product
    );


    alert(
        "Product added successfully."
    );


    loadAdminPage();

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(
    price
) {

    return `₹${Number(
        price || 0
    ).toLocaleString(
        "en-IN"
    )}`;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    date
) {

    if (!date) {

        return "-";

    }


    try {

        const parsedDate =
            new Date(
                date
            );


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    } catch {

        return "-";

    }

}