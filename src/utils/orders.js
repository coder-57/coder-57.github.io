/* =========================================================
   ASTRIKE SPORTS
   ORDERS STORAGE
   LOCAL STORAGE ORDER MANAGEMENT
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const ORDERS_KEY = "astrike_orders";
const CURRENT_USER_KEY = "astrike_current_user";


/* =========================================================
   GET CURRENT LOGGED-IN USER
========================================================= */

export function getCurrentUser() {

    try {

        const data =
            localStorage.getItem(
                CURRENT_USER_KEY
            );

        if (!data) {
            return null;
        }

        const user =
            JSON.parse(data);

        return user || null;

    } catch (error) {

        console.error(
            "Unable to read current user:",
            error
        );

        return null;

    }

}


/* =========================================================
   GET CURRENT USER ID
========================================================= */

export function getCurrentUserId() {

    const user =
        getCurrentUser();

    if (!user) {
        return null;
    }

    return user.id || null;

}


/* =========================================================
   GET ALL ORDERS
   ADMIN USE
========================================================= */

export function getOrders() {

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
   SAVE ALL ORDERS
========================================================= */

export function saveOrders(orders) {

    if (!Array.isArray(orders)) {

        return false;

    }

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
   CREATE ORDER
========================================================= */

export function createOrder(orderData = {}) {

    const orders =
        getOrders();


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const currentUser =
        getCurrentUser();


    /* =====================================================
       CUSTOMER ID
       
       Priority:
       1. Explicit customerId
       2. Logged-in user's ID
    ===================================================== */

    const customerId =
        orderData.customerId ||
        currentUser?.id ||
        null;


    /* =====================================================
       CUSTOMER INFORMATION
    ===================================================== */

    const customer =
        orderData.customer ||
        (
            currentUser
                ? {
                    id:
                        currentUser.id,

                    name:
                        currentUser.name,

                    email:
                        currentUser.email,

                    role:
                        currentUser.role
                }
                : null
        );


    /* =====================================================
       ITEMS
    ===================================================== */

    const items =
        Array.isArray(orderData.items)
            ? orderData.items
            : [];


    /* =====================================================
       CALCULATE SUBTOTAL
    ===================================================== */

    const calculatedSubtotal =
        items.reduce(
            (
                total,
                item
            ) => {

                const price =
                    Number(
                        item.price || 0
                    );

                const quantity =
                    Number(
                        item.quantity || 1
                    );

                return (
                    total +
                    price * quantity
                );

            },
            0
        );


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    const subtotal =
        Number(
            orderData.subtotal
        ) || calculatedSubtotal;


    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping =
        Number(
            orderData.shipping
        ) || 0;


    /* =====================================================
       DISCOUNT
    ===================================================== */

    const discount =
        Number(
            orderData.discount
        ) || 0;


    /* =====================================================
       TOTAL
    ===================================================== */

    const calculatedTotal =
        subtotal +
        shipping -
        discount;


    const total =
        Number(
            orderData.total
        ) || calculatedTotal;


    /* =====================================================
       CREATE ORDER ID
    ===================================================== */

    const orderId =
        "AST-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();


    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const order = {

        /* ================================================
           ORDER IDENTIFICATION
        ================================================= */

        id:
            orderId,

        orderId,


        /* ================================================
           USER OWNERSHIP
        ================================================= */

        customerId,


        customer,


        /* ================================================
           DATE
        ================================================= */

        createdAt:
            new Date().toISOString(),


        /* ================================================
           ORDER STATUS
        ================================================= */

        status:
            orderData.status ||
            "Confirmed",


        /* ================================================
           PAYMENT
        ================================================= */

        paymentStatus:
            orderData.paymentStatus ||
            "Pending",

        paymentMethod:
            orderData.paymentMethod ||
            "Cash on Delivery",


        /* ================================================
           SHIPPING ADDRESS
        ================================================= */

        shippingAddress:
            orderData.shippingAddress ||
            null,


        /* ================================================
           PRODUCTS
        ================================================= */

        items,


        /* ================================================
           PRICE
        ================================================= */

        subtotal,

        shipping,

        discount,

        total,


        /* ================================================
           EXTRA
        ================================================= */

        notes:
            orderData.notes ||
            ""

    };


    /* =====================================================
       SAVE ORDER
    ===================================================== */

    orders.unshift(
        order
    );


    const saved =
        saveOrders(
            orders
        );


    if (!saved) {

        return null;

    }


    /* =====================================================
       RETURN ORDER
    ===================================================== */

    return order;

}


/* =========================================================
   GET ORDER BY ID
========================================================= */

export function getOrderById(
    orderId
) {

    const orders =
        getOrders();


    return (

        orders.find(
            order =>
                String(
                    order.orderId
                ) ===
                String(orderId)
        ) ||

        orders.find(
            order =>
                String(
                    order.id
                ) ===
                String(orderId)
        ) ||

        null

    );

}


/* =========================================================
   GET ORDERS BY CUSTOMER ID
========================================================= */

export function getOrdersByCustomer(
    customerId
) {

    if (!customerId) {

        return [];

    }


    const orders =
        getOrders();


    return orders.filter(
        order =>

            String(
                order.customerId
            ) ===
            String(customerId)
    );

}


/* =========================================================
   GET ORDERS OF CURRENT LOGGED-IN USER
========================================================= */

export function getOrdersByCurrentUser() {

    const currentUserId =
        getCurrentUserId();


    /* =====================================================
       USER NOT LOGGED IN
    ===================================================== */

    if (!currentUserId) {

        return [];

    }


    return getOrdersByCustomer(
        currentUserId
    );

}


/* =========================================================
   GET CURRENT USER ORDERS COUNT
========================================================= */

export function getCurrentUserOrderCount() {

    return (
        getOrdersByCurrentUser()
            .length
    );

}


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

export function updateOrderStatus(
    orderId,
    status
) {

    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>

                String(
                    order.orderId
                ) ===
                String(orderId)
        );


    if (index === -1) {

        return {

            success: false,

            message:
                "Order not found."

        };

    }


    orders[index] = {

        ...orders[index],

        status,

        updatedAt:
            new Date().toISOString()

    };


    const saved =
        saveOrders(
            orders
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to update order."

        };

    }


    return {

        success: true,

        message:
            "Order status updated.",

        order:
            orders[index]

    };

}


/* =========================================================
   UPDATE PAYMENT STATUS
========================================================= */

export function updatePaymentStatus(
    orderId,
    paymentStatus
) {

    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>

                String(
                    order.orderId
                ) ===
                String(orderId)
        );


    if (index === -1) {

        return {

            success: false,

            message:
                "Order not found."

        };

    }


    orders[index] = {

        ...orders[index],

        paymentStatus,

        updatedAt:
            new Date().toISOString()

    };


    const saved =
        saveOrders(
            orders
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to update payment status."

        };

    }


    return {

        success: true,

        message:
            "Payment status updated.",

        order:
            orders[index]

    };

}


/* =========================================================
   DELETE ORDER
========================================================= */

export function deleteOrder(
    orderId
) {

    const orders =
        getOrders();


    const filtered =
        orders.filter(
            order =>

                String(
                    order.orderId
                ) !==
                String(orderId)
        );


    if (
        filtered.length ===
        orders.length
    ) {

        return {

            success: false,

            message:
                "Order not found."

        };

    }


    const saved =
        saveOrders(
            filtered
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to delete order."

        };

    }


    return {

        success: true,

        message:
            "Order deleted successfully."

    };

}


/* =========================================================
   DELETE CURRENT USER ORDER
========================================================= */

export function deleteCurrentUserOrder(
    orderId
) {

    const currentUserId =
        getCurrentUserId();


    if (!currentUserId) {

        return {

            success: false,

            message:
                "Please login first."

        };

    }


    const orders =
        getOrders();


    const order =
        orders.find(
            item =>

                String(
                    item.orderId
                ) ===
                String(orderId)
        );


    if (!order) {

        return {

            success: false,

            message:
                "Order not found."

        };

    }


    /* =====================================================
       SECURITY CHECK
       USER CAN DELETE ONLY HIS OWN ORDER
    ===================================================== */

    if (
        String(
            order.customerId
        ) !==
        String(currentUserId)
    ) {

        return {

            success: false,

            message:
                "You cannot delete this order."

        };

    }


    const filtered =
        orders.filter(
            item =>

                String(
                    item.orderId
                ) !==
                String(orderId)
        );


    saveOrders(
        filtered
    );


    return {

        success: true,

        message:
            "Order deleted successfully."

    };

}


/* =========================================================
   CLEAR ALL ORDERS
   ADMIN USE ONLY
========================================================= */

export function clearOrders() {

    localStorage.removeItem(
        ORDERS_KEY
    );

}


/* =========================================================
   GET TOTAL ORDERS
   ADMIN USE
========================================================= */

export function getOrderCount() {

    return (
        getOrders().length
    );

}


/* =========================================================
   GET CURRENT USER ORDER COUNT
========================================================= */

export function getMyOrderCount() {

    return (
        getOrdersByCurrentUser()
            .length
    );

}


/* =========================================================
   GET TOTAL SALES
   ADMIN USE
========================================================= */

export function getTotalSales() {

    const orders =
        getOrders();


    return orders.reduce(
        (
            total,
            order
        ) => {

            return (

                total +

                (
                    Number(
                        order.total
                    ) || 0
                )

            );

        },
        0
    );

}


/* =========================================================
   GET CURRENT USER TOTAL SPENDING
========================================================= */

export function getCurrentUserTotalSpending() {

    const orders =
        getOrdersByCurrentUser();


    return orders.reduce(
        (
            total,
            order
        ) => {

            return (

                total +

                (
                    Number(
                        order.total
                    ) || 0
                )

            );

        },
        0
    );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "ASTRIKE ORDERS STORAGE READY"
);