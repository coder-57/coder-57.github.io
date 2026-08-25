/* =========================================================
   ASTRIKE SPORTS
   MAIN JS
   ROUTING + PAGES
========================================================= */


/* =========================================================
   GLOBAL CSS
========================================================= */

import "./styles/global.css";


/* =========================================================
   NAVBAR
========================================================= */

import {
    loadNavbar
} from "./components/navbar/navbar.js";


/* =========================================================
   HOME
========================================================= */

import {
    loadHome
} from "./pages/home/home.js";


/* =========================================================
   CATEGORY
========================================================= */

import {
    loadCategoryPage
} from "./pages/category-page/category-page.js";


/* =========================================================
   PRODUCT
========================================================= */

import {
    loadProductPage
} from "./pages/product/product-page.js";


/* =========================================================
   COLLECTION
========================================================= */

import {
    loadCollectionPage
} from "./pages/collection/collection.js";


/* =========================================================
   CART
========================================================= */

import {
    loadCartPage
} from "./pages/cart/cart-page.js";


/* =========================================================
   CHECKOUT
========================================================= */

import {
    loadCheckoutPage
} from "./pages/checkout/checkout-page.js";


/* =========================================================
   ORDERS
========================================================= */

import {
    loadOrdersPage
} from "./pages/orders-page/orders-page.js";


/* =========================================================
   PROFILE
========================================================= */

import {
    loadProfilePage
} from "./pages/profile/profile.js";


/* =========================================================
   LOGIN
========================================================= */

import {
    loadLoginPage
} from "./pages/login/login.js";


/* =========================================================
   REGISTER
========================================================= */

import {
    loadRegisterPage
} from "./pages/register/register.js";


/* =========================================================
   ADMIN
========================================================= */

import {
    loadAdminPage
} from "./pages/admin/admin.js";


/* =========================================================
   FOOTER
========================================================= */

import {
    loadFooter
} from "./components/footer/footer.js";


/* =========================================================
   APP
========================================================= */

const app =
    document.querySelector(
        "#app"
    );


if (!app) {

    console.error(
        "#app not found"
    );
}


/* =========================================================
   NAVBAR
========================================================= */

loadNavbar();


/* =========================================================
   GET CURRENT URL
========================================================= */

const cleanPath =
    window.location.pathname
        .replace(/\/$/, "");


/* =========================================================
   HOME PAGE
========================================================= */

if (

    cleanPath === "" ||

    cleanPath === "/"

) {

    console.log(
        "HOME PAGE"
    );

    loadHome();
}


/* =========================================================
   CATEGORY LANDING PAGE
========================================================= */

else if (

    cleanPath === "/category"

) {

    console.log(
        "CATEGORY LANDING PAGE"
    );

}


/* =========================================================
   BEST SELLERS PAGE
========================================================= */

else if (

    cleanPath === "/best-sellers"

) {

    console.log(
        "BEST SELLERS PAGE"
    );


    loadCategoryPage({

        category: null,

        subCategory: null,

        type: "best-sellers"

    });

}


/* =========================================================
   NEW ARRIVALS PAGE
========================================================= */

else if (

    cleanPath === "/new-arrivals"

) {

    console.log(
        "NEW ARRIVALS PAGE"
    );


    loadCategoryPage({

        category: null,

        subCategory: null,

        type: "new-arrivals"

    });

}


/* =========================================================
   CATEGORY PRODUCTS PAGE
========================================================= */

else if (

    cleanPath.startsWith(
        "/category/"
    )

) {

    const categoryPath =
        cleanPath.replace(
            "/category/",
            ""
        );


    const parts =
        categoryPath
            .split("/")
            .filter(Boolean);


    const category =
        parts[0] || null;


    const subCategory =
        parts[1] || null;


    console.log(
        "CATEGORY:",
        category
    );


    console.log(
        "SUB CATEGORY:",
        subCategory
    );


    loadCategoryPage({

        category,

        subCategory,

        type: "category"

    });

}


/* =========================================================
   PRODUCT DETAIL PAGE
========================================================= */

else if (

    cleanPath.startsWith(
        "/product/"
    )

) {

    const slug =
        cleanPath
            .replace(
                "/product/",
                ""
            )
            .trim();


    console.log(
        "PRODUCT SLUG:",
        slug
    );


    if (!slug) {

        console.warn(
            "Product slug not found"
        );

    }

    else {

        loadProductPage(
            slug
        );

    }

}


/* =========================================================
   CART PAGE
========================================================= */

else if (

    cleanPath === "/cart"

) {

    console.log(
        "CART PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="cart"
                ></section>
            `

        );

    }


    loadCartPage();

}


/* =========================================================
   CHECKOUT PAGE
========================================================= */

else if (

    cleanPath === "/checkout"

) {

    console.log(
        "CHECKOUT PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="checkout"
                ></section>
            `

        );

    }


    loadCheckoutPage();

}


/* =========================================================
   LOGIN PAGE
========================================================= */

else if (

    cleanPath === "/login"

) {

    console.log(
        "LOGIN PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="login"
                ></section>
            `

        );

    }


    loadLoginPage();

}


/* =========================================================
   REGISTER PAGE
========================================================= */

else if (

    cleanPath === "/register"

) {

    console.log(
        "REGISTER PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="register"
                ></section>
            `

        );

    }


    loadRegisterPage();

}


/* =========================================================
   PROFILE PAGE
========================================================= */

else if (

    cleanPath === "/profile"

) {

    console.log(
        "PROFILE PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="profile"
                ></section>
            `

        );

    }


    loadProfilePage();

}


/* =========================================================
   ADMIN PAGE
========================================================= */

else if (

    cleanPath === "/admin"

) {

    console.log(
        "ADMIN PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="admin"
                ></section>
            `

        );

    }


    loadAdminPage();

}


/* =========================================================
   ORDERS PAGE
========================================================= */

else if (

    cleanPath === "/orders"

) {

    console.log(
        "ORDERS PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="orders"
                ></section>
            `

        );

    }


    loadOrdersPage();

}


/* =========================================================
   COLLECTION LANDING PAGE
========================================================= */

else if (

    cleanPath === "/collection"

) {

    console.log(
        "COLLECTION LANDING PAGE"
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="collection"
                ></section>
            `

        );

    }


    loadCollectionPage({

        collection: null

    });

}


/* =========================================================
   COLLECTION PRODUCTS PAGE
========================================================= */

else if (

    cleanPath.startsWith(
        "/collection/"
    )

) {

    const collectionPath =
        cleanPath.replace(
            "/collection/",
            ""
        );


    const collection =
        collectionPath
            .split("/")
            .filter(Boolean)[0];


    console.log(
        "COLLECTION:",
        collection
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    id="collection"
                ></section>
            `

        );

    }


    loadCollectionPage({

        collection

    });

}


/* =========================================================
   UNKNOWN PAGE
========================================================= */

else {

    console.log(
        "404 PAGE:",
        cleanPath
    );


    if (app) {

        app.insertAdjacentHTML(

            "beforeend",

            `
                <section
                    class="page-not-found"
                >

                    <h1>
                        404
                    </h1>

                    <p>
                        Page Not Found
                    </p>

                    <a href="/">
                        Go Back Home
                    </a>

                </section>
            `

        );

    }

}


/* =========================================================
   FOOTER
========================================================= */

loadFooter();