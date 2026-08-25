/* =========================================================
   ASTRIKE SPORTS
   NAVBAR
   AUTH + PROFILE IMAGE + LOGOUT + CART + NAVIGATION
========================================================= */

import "./navbar.css";

import {
    getCurrentUser,
    logoutUser
} from "../../utils/auth.js";


/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_KEY =
    "astrike_cart";

const CURRENT_USER_KEY =
    "astrike_current_user";


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

    try {

        const data =
            localStorage.getItem(
                CART_KEY
            );

        if (!data) {
            return [];
        }

        const cart =
            JSON.parse(data);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "ASTRIKE CART READ ERROR:",
            error
        );

        return [];

    }

}


/* =========================================================
   GET CART QUANTITY
========================================================= */

function getCartQuantity() {

    const cart =
        getCart();

    return cart.reduce(
        (total, item) => {

            return (
                total +
                Number(
                    item?.quantity || 0
                )
            );

        },
        0
    );

}


/* =========================================================
   UPDATE CART BADGE
========================================================= */

function updateCartBadge() {

    const badge =
        document.getElementById(
            "cartBadge"
        );

    if (!badge) {
        return;
    }

    const quantity =
        getCartQuantity();

    badge.textContent =
        quantity;

    if (quantity <= 0) {

        badge.classList.add(
            "empty"
        );

    } else {

        badge.classList.remove(
            "empty"
        );

    }

}


/* =========================================================
   GET CURRENT USER
   AUTH.JS = SINGLE SOURCE OF TRUTH
========================================================= */

function getLoggedInUser() {

    try {

        const user =
            getCurrentUser();

        if (!user) {
            return null;
        }

        if (
            typeof user !== "object" ||
            !user.id
        ) {

            console.warn(
                "ASTRIKE INVALID CURRENT USER:",
                user
            );

            return null;

        }

        return user;

    } catch (error) {

        console.error(
            "ASTRIKE CURRENT USER ERROR:",
            error
        );

        return null;

    }

}


/* =========================================================
   GET USER DISPLAY NAME
========================================================= */

function getUserDisplayName(user) {

    if (!user) {
        return "Login";
    }

    return (
        user.name ||
        user.username ||
        user.fullName ||
        user.email ||
        "My Account"
    );

}


/* =========================================================
   UPDATE ACCOUNT BUTTON
   PROFILE IMAGE + NAME + LOGOUT
========================================================= */

function updateAccountButton() {

    const accountBtn =
        document.getElementById(
            "accountBtn"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    if (!accountBtn) {
        return;
    }


    const avatar =
        accountBtn.querySelector(
            "#accountAvatar"
        );


    const nameElement =
        accountBtn.querySelector(
            "#accountUserName"
        );


    const user =
        getLoggedInUser();


    /* =====================================================
       LOGGED IN
    ===================================================== */

    if (user) {

        const name =
            getUserDisplayName(
                user
            );


        accountBtn.title =
            `Logged in as ${name}`;


        accountBtn.setAttribute(
            "aria-label",
            `Logged in as ${name}`
        );


        /* =================================================
           PROFILE IMAGE
        ================================================= */

        if (
            avatar &&
            user.profileImage
        ) {

            avatar.innerHTML = `

                <img
                    src="${escapeHTML(
                        user.profileImage
                    )}"
                    alt="${escapeHTML(
                        name
                    )}"
                    class="navbar-profile-image"
                >

            `;

        } else if (avatar) {

            avatar.innerHTML = `

                <span
                    class="material-symbols-outlined"
                >
                    person
                </span>

            `;

        }


        /* =================================================
           USER NAME
        ================================================= */

        if (nameElement) {

            nameElement.textContent =
                name;

        }


        /* =================================================
           SHOW LOGOUT
        ================================================= */

        if (logoutBtn) {

            logoutBtn.style.display =
                "flex";

        }


        console.log(
            "ASTRIKE NAVBAR USER:",
            name
        );

        return;

    }


    /* =====================================================
       NOT LOGGED IN
    ===================================================== */

    accountBtn.title =
        "Login";


    accountBtn.setAttribute(
        "aria-label",
        "Login"
    );


    /* =====================================================
       DEFAULT PERSON ICON
    ===================================================== */

    if (avatar) {

        avatar.innerHTML = `

            <span
                class="material-symbols-outlined"
            >
                person
            </span>

        `;

    }


    /* =====================================================
       LOGIN TEXT
    ===================================================== */

    if (nameElement) {

        nameElement.textContent =
            "Login";

    }


    /* =====================================================
       HIDE LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.style.display =
            "none";

    }


    console.log(
        "ASTRIKE NAVBAR: NOT LOGGED IN"
    );

}


/* =========================================================
   LOAD NAVBAR
========================================================= */

export function loadNavbar() {

    const app =
        document.getElementById(
            "app"
        );


    /* =====================================================
       APP CHECK
    ===================================================== */

    if (!app) {

        console.error(
            "ASTRIKE: #app not found."
        );

        return;

    }


    /* =====================================================
       PREVENT DUPLICATE NAVBAR
    ===================================================== */

    if (
        document.querySelector(
            ".site-navbar"
        )
    ) {

        console.warn(
            "ASTRIKE NAVBAR ALREADY EXISTS."
        );


        updateCartBadge();

        updateAccountButton();

        return;

    }


    /* =====================================================
       NAVBAR HTML
    ===================================================== */

    app.insertAdjacentHTML(

        "afterbegin",

        `

        <header class="site-navbar">


            <!-- =================================================
                 TOP SHIPPING BAR
            ================================================= -->

            <div class="top-shipping">

                FREE SHIPPING ON ORDERS ABOVE ₹999

            </div>


            <!-- =================================================
                 MAIN NAVBAR
            ================================================= -->

            <nav class="main-navbar">


                <!-- =================================================
                     LEFT
                ================================================= -->

                <div class="navbar-left">


                    <!-- MOBILE MENU -->

                    <button
                        id="mobileMenuBtn"
                        class="mobile-menu-btn"
                        type="button"
                        aria-label="Open menu"
                        aria-expanded="false"
                    >

                        ☰

                    </button>


                    <!-- LOGO -->

                    <a
                        href="/"
                        class="astrike-logo"
                    >

                        <span class="logo-mark">
                            A
                        </span>

                        <span>
                            ASTRIKE
                        </span>

                    </a>


                    <!-- =================================================
                         DESKTOP NAV
                    ================================================= -->

                    <div class="desktop-nav-links">


                        <!-- MEN -->

                        <a
                            href="/category/men"
                            data-nav="men"
                        >
                            MEN
                        </a>


                        <!-- WOMEN -->

                        <a
                            href="/category/women"
                            data-nav="women"
                        >
                            WOMEN
                        </a>


                        <!-- COLLECTIONS -->

                        <a
                            href="/collection"
                            data-nav="collection"
                        >
                            COLLECTIONS
                        </a>


                        <!-- BEST SELLERS -->

                        <a
                            href="/best-sellers"
                            data-nav="best-sellers"
                        >
                            BEST SELLERS
                        </a>


                        <!-- NEW ARRIVALS -->

                        <a
                            href="/new-arrivals"
                            data-nav="new-arrivals"
                        >
                            NEW ARRIVALS
                        </a>


                    </div>

                </div>


                <!-- =================================================
                     RIGHT
                ================================================= -->

                <div class="navbar-right">


                    <!-- =================================================
                         ACCOUNT
                    ================================================= -->

                    <button
                        id="accountBtn"
                        class="navbar-icon account-button"
                        type="button"
                        aria-label="Login"
                        title="Login"
                    >

                        <span
                            class="account-avatar"
                            id="accountAvatar"
                        >

                            <span
                                class="material-symbols-outlined"
                            >
                                person
                            </span>

                        </span>


                        <span
                            id="accountUserName"
                            class="account-user-name"
                        >
                            Login
                        </span>

                    </button>


                    <!-- =================================================
                         LOGOUT
                    ================================================= -->

                    <button
                        id="logoutBtn"
                        class="navbar-icon logout-button"
                        type="button"
                        aria-label="Logout"
                        title="Logout"
                        style="display: none;"
                    >

                        <span
                            class="material-symbols-outlined"
                        >
                            logout
                        </span>

                        <span class="logout-text">
                            Logout
                        </span>

                    </button>


                    <!-- =================================================
                         MY ORDERS
                    ================================================= -->

                    <button
                        id="ordersBtn"
                        class="navbar-icon"
                        type="button"
                        aria-label="My Orders"
                        title="My Orders"
                    >

                        <span
                            class="material-symbols-outlined"
                        >
                            package_2
                        </span>

                    </button>


                    <!-- =================================================
                         CART
                    ================================================= -->

                    <button
                        id="cartBtn"
                        class="navbar-icon cart-button"
                        type="button"
                        aria-label="Cart"
                        title="Cart"
                    >

                        <span
                            class="material-symbols-outlined"
                        >
                            shopping_bag
                        </span>


                        <span
                            id="cartBadge"
                            class="cart-badge empty"
                        >
                            0
                        </span>

                    </button>


                </div>

            </nav>


            <!-- =================================================
                 SEARCH
            ================================================= -->

            <div class="navbar-search-row">

                <div class="navbar-search">


                    <input
                        id="navbarSearchInput"
                        type="text"
                        placeholder="Search for products..."
                        autocomplete="off"
                    />


                    <button
                        id="navbarSearchBtn"
                        type="button"
                        aria-label="Search"
                        title="Search"
                    >

                        <span
                            class="material-symbols-outlined"
                        >
                            search
                        </span>

                    </button>


                </div>

            </div>


            <!-- =================================================
                 MOBILE MENU
            ================================================= -->

            <div
                id="mobileMenu"
                class="mobile-menu"
                aria-hidden="true"
            >


                <a
                    href="/category/men"
                    data-nav="men"
                >
                    MEN
                </a>


                <a
                    href="/category/women"
                    data-nav="women"
                >
                    WOMEN
                </a>


                <a
                    href="/collection"
                    data-nav="collection"
                >
                    COLLECTIONS
                </a>


                <a
                    href="/best-sellers"
                    data-nav="best-sellers"
                >
                    BEST SELLERS
                </a>


                <a
                    href="/new-arrivals"
                    data-nav="new-arrivals"
                >
                    NEW ARRIVALS
                </a>


            </div>


        </header>

        `
    );


    /* =========================================================
       GET NAVBAR
    ========================================================= */

    const navbar =
        document.querySelector(
            ".site-navbar"
        );


    if (!navbar) {

        console.error(
            "ASTRIKE NAVBAR CREATION FAILED."
        );

        return;

    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const mobileMenuBtn =
        navbar.querySelector(
            "#mobileMenuBtn"
        );


    const mobileMenu =
        navbar.querySelector(
            "#mobileMenu"
        );


    const searchInput =
        navbar.querySelector(
            "#navbarSearchInput"
        );


    const searchBtn =
        navbar.querySelector(
            "#navbarSearchBtn"
        );


    const accountBtn =
        navbar.querySelector(
            "#accountBtn"
        );


    const logoutBtn =
        navbar.querySelector(
            "#logoutBtn"
        );


    const ordersBtn =
        navbar.querySelector(
            "#ordersBtn"
        );


    const cartBtn =
        navbar.querySelector(
            "#cartBtn"
        );


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    updateCartBadge();

    updateAccountButton();


    /* =========================================================
       MOBILE MENU OPEN
    ========================================================= */

    function openMobileMenu() {

        if (!mobileMenu) {
            return;
        }


        mobileMenu.classList.add(
            "active"
        );


        if (mobileMenuBtn) {

            mobileMenuBtn.textContent =
                "×";


            mobileMenuBtn.setAttribute(
                "aria-label",
                "Close menu"
            );


            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =========================================================
       MOBILE MENU CLOSE
    ========================================================= */

    function closeMobileMenu() {

        if (!mobileMenu) {
            return;
        }


        mobileMenu.classList.remove(
            "active"
        );


        if (mobileMenuBtn) {

            mobileMenuBtn.textContent =
                "☰";


            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open menu"
            );


            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =========================================================
       MOBILE MENU TOGGLE
    ========================================================= */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const isOpen =
                    mobileMenu &&
                    mobileMenu.classList.contains(
                        "active"
                    );


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );

    }


    /* =========================================================
       MOBILE LINKS
    ========================================================= */

    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                    }
                );

            });

    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    let currentPath =
        window.location.pathname;


    if (
        currentPath.length > 1 &&
        currentPath.endsWith("/")
    ) {

        currentPath =
            currentPath.slice(
                0,
                -1
            );

    }


    navbar
        .querySelectorAll(
            "[data-nav]"
        )
        .forEach(link => {

            const navType =
                link.dataset.nav;


            let active =
                false;


            /* =================================================
               MEN
            ================================================= */

            if (
                navType === "men" &&
                (
                    currentPath ===
                        "/category/men" ||

                    currentPath.startsWith(
                        "/category/men/"
                    )
                )
            ) {

                active = true;

            }


            /* =================================================
               WOMEN
            ================================================= */

            if (
                navType === "women" &&
                (
                    currentPath ===
                        "/category/women" ||

                    currentPath.startsWith(
                        "/category/women/"
                    )
                )
            ) {

                active = true;

            }


            /* =================================================
               COLLECTION
            ================================================= */

            if (
                navType === "collection" &&
                (
                    currentPath ===
                        "/collection" ||

                    currentPath.startsWith(
                        "/collection/"
                    )
                )
            ) {

                active = true;

            }


            /* =================================================
               BEST SELLERS
            ================================================= */

            if (
                navType === "best-sellers" &&
                currentPath ===
                    "/best-sellers"
            ) {

                active = true;

            }


            /* =================================================
               NEW ARRIVALS
            ================================================= */

            if (
                navType === "new-arrivals" &&
                currentPath ===
                    "/new-arrivals"
            ) {

                active = true;

            }


            /* =================================================
               APPLY ACTIVE
            ================================================= */

            if (active) {

                link.classList.add(
                    "active"
                );

            }

        });


    /* =========================================================
       SEARCH
    ========================================================= */

    function performSearch() {

        if (!searchInput) {
            return;
        }


        const value =
            searchInput.value.trim();


        if (!value) {

            searchInput.focus();

            return;

        }


        const query =
            encodeURIComponent(
                value
            );


        window.location.href =
            `/search?q=${query}`;

    }


    /* =========================================================
       SEARCH BUTTON
    ========================================================= */

    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            performSearch
        );

    }


    /* =========================================================
       SEARCH ENTER
    ========================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    performSearch();

                }

            }
        );

    }


    /* =========================================================
       ACCOUNT
       
       LOGGED OUT → LOGIN
       LOGGED IN → PROFILE
    ========================================================= */

    if (accountBtn) {

        accountBtn.addEventListener(
            "click",
            () => {

                const user =
                    getLoggedInUser();


                /* =============================================
                   NOT LOGGED IN
                ============================================= */

                if (!user) {

                    window.location.href =
                        "/login";

                    return;

                }


                /* =============================================
                   LOGGED IN → PROFILE
                ============================================= */

                window.location.href =
                    "/profile";

            }
        );

    }


    /* =========================================================
       LOGOUT
    ========================================================= */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const user =
                    getLoggedInUser();


                /* =============================================
                   NO USER
                ============================================= */

                if (!user) {

                    window.location.href =
                        "/login";

                    return;

                }


                /* =============================================
                   LOGOUT
                ============================================= */

                logoutUser();


                console.log(
                    "ASTRIKE USER LOGGED OUT:",
                    user.email
                );


                /* =============================================
                   UPDATE NAVBAR
                ============================================= */

                updateAccountButton();


                /* =============================================
                   AUTH EVENT
                ============================================= */

                window.dispatchEvent(
                    new CustomEvent(
                        "authUpdated"
                    )
                );


                /* =============================================
                   HOME
                ============================================= */

                window.location.href =
                    "/";

            }
        );

    }


    /* =========================================================
       MY ORDERS
       
       LOGGED OUT → LOGIN
       LOGGED IN → ORDERS
    ========================================================= */

    if (ordersBtn) {

        ordersBtn.addEventListener(
            "click",
            () => {

                const user =
                    getLoggedInUser();


                console.log(
                    "ASTRIKE ORDERS CLICK USER:",
                    user
                );


                if (!user) {

                    window.location.href =
                        "/login";

                    return;

                }


                window.location.href =
                    "/orders";

            }
        );

    }


    /* =========================================================
       CART
    ========================================================= */

    if (cartBtn) {

        cartBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/cart";

            }
        );

    }


    /* =========================================================
       CART UPDATE EVENT
    ========================================================= */

    window.addEventListener(
        "cartUpdated",
        () => {

            updateCartBadge();

        }
    );


    /* =========================================================
       AUTH UPDATE EVENT
       
       PROFILE IMAGE CHANGE
       LOGIN
       LOGOUT
       PROFILE UPDATE
    ========================================================= */

    window.addEventListener(
        "authUpdated",
        event => {

            console.log(
                "ASTRIKE AUTH UPDATED:",
                event?.detail
            );


            updateAccountButton();

        }
    );


    /* =========================================================
       STORAGE EVENT
       
       OTHER TAB / WINDOW
    ========================================================= */

    window.addEventListener(
        "storage",
        event => {


            /* ================================================
               CART
            ================================================ */

            if (
                event.key ===
                CART_KEY
            ) {

                updateCartBadge();

            }


            /* ================================================
               CURRENT USER
            ================================================ */

            if (
                event.key ===
                CURRENT_USER_KEY
            ) {

                console.log(
                    "ASTRIKE CURRENT USER STORAGE CHANGED"
                );


                updateAccountButton();

            }

        }
    );


    /* =========================================================
       CLICK OUTSIDE
    ========================================================= */

    document.addEventListener(
        "click",
        event => {

            if (
                !navbar.contains(
                    event.target
                )
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =========================================================
       ESC KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =========================================================
       RESIZE
    ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >
                768
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =========================================================
       FINAL
    ========================================================= */

    console.log(
        "ASTRIKE NAVBAR READY"
    );

}