/* ==================================================
   ASTRIKE SPORTS
   PRODUCT PAGE

   JSON DRIVEN PRODUCT PAGE
   - Product Details
   - Images
   - Colors
   - Sizes
   - Stock
   - Cart
   - Related Products
================================================== */

import "./product-page.css";

import productData from "../../data/product.json";


/* ==================================================
   CART STORAGE
================================================== */

const CART_KEY = "astrike_cart";


/* ==================================================
   GET CART
================================================== */

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


/* ==================================================
   SAVE CART
================================================== */

function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    window.dispatchEvent(
        new Event("cartUpdated")
    );

}


/* ==================================================
   GET CART QUANTITY
================================================== */

function getCartQuantity(
    productId,
    color,
    size
) {

    const cart =
        getCart();

    const item =
        cart.find(
            cartItem =>

                String(
                    cartItem.productId
                ) ===
                String(
                    productId
                ) &&

                String(
                    cartItem.color || ""
                ) ===
                String(
                    color || ""
                ) &&

                String(
                    cartItem.size || ""
                ) ===
                String(
                    size || ""
                )
        );


    if (!item) {

        return 0;

    }


    return Number(
        item.quantity
    ) || 0;

}


/* ==================================================
   ADD PRODUCT TO CART
================================================== */

function addProductToCart(
    cartItem
) {

    const cart =
        getCart();


    const existingIndex =
        cart.findIndex(
            item =>

                String(
                    item.productId
                ) ===
                String(
                    cartItem.productId
                ) &&

                String(
                    item.color || ""
                ) ===
                String(
                    cartItem.color || ""
                ) &&

                String(
                    item.size || ""
                ) ===
                String(
                    cartItem.size || ""
                )
        );


    /* ==================================================
       EXISTING ITEM
    ================================================== */

    if (
        existingIndex !== -1
    ) {

        const existingItem =
            cart[
                existingIndex
            ];


        const originalStock =
            Number(
                existingItem.stock
            ) || 0;


        const currentQuantity =
            Number(
                existingItem.quantity
            ) || 0;


        if (
            currentQuantity >=
            originalStock
        ) {

            alert(
                "Maximum available stock reached."
            );

            return false;

        }


        existingItem.quantity =
            currentQuantity + 1;


        saveCart(
            cart
        );


        return true;

    }


    /* ==================================================
       NEW ITEM
    ================================================== */

    cart.push({

        ...cartItem,

        quantity: 1

    });


    saveCart(
        cart
    );


    return true;

}


/* ==================================================
   LOAD PRODUCT PAGE
================================================== */

export function loadProductPage(
    slug
) {

    const app =
        document.querySelector(
            "#app"
        );


    /* ==================================================
       APP CHECK
    ================================================== */

    if (!app) {

        console.error(
            "#app container not found"
        );

        return;

    }


    /* ==================================================
       CLEAR OLD PRODUCT PAGE
    ================================================== */

    const oldProductPage =
        app.querySelector(
            ".product-page"
        );


    if (oldProductPage) {

        oldProductPage.remove();

    }


    /* ==================================================
       FIND PRODUCT BY SLUG
    ================================================== */

    const product =
        productData.find(
            item =>

                String(
                    item.slug
                ) ===
                String(
                    slug
                )
        );


    console.log(
        "CURRENT PRODUCT:",
        product
    );


    /* ==================================================
       PRODUCT NOT FOUND
    ================================================== */

    if (!product) {

        app.insertAdjacentHTML(
            "beforeend",
            `

            <main class="product-not-found">

                <h1>
                    Product Not Found
                </h1>

                <p>
                    Sorry, this product is unavailable.
                </p>

                <a href="/">
                    Go Back Home
                </a>

            </main>

            `
        );

        return;

    }


    /* ==================================================
       COLORS
    ================================================== */

    const colors =
        Array.isArray(
            product.colors
        )
            ? product.colors
            : [];


    /* ==================================================
       STATE
    ================================================== */

    let selectedColorIndex =
        0;

    let selectedSize =
        null;


    /* ==================================================
       GET SELECTED COLOR
    ================================================== */

    function getSelectedColor() {

        return (
            colors[
                selectedColorIndex
            ] || null
        );

    }


    /* ==================================================
       GET ORIGINAL SIZE STOCK
    ================================================== */

    function getOriginalSizeStock(
        size
    ) {

        const selectedColor =
            getSelectedColor();


        if (
            !selectedColor ||
            !selectedColor.sizes
        ) {

            return 0;

        }


        return Number(
            selectedColor.sizes[
                size
            ] || 0
        );

    }


    /* ==================================================
       GET AVAILABLE SIZE STOCK
    ================================================== */

    function getSizeStock(
        size
    ) {

        const selectedColor =
            getSelectedColor();


        if (
            !selectedColor ||
            !selectedColor.sizes
        ) {

            return 0;

        }


        const originalStock =
            getOriginalSizeStock(
                size
            );


        const color =
            selectedColor.name ||
            "Default";


        const cartQuantity =
            getCartQuantity(
                product.id,
                color,
                size
            );


        const availableStock =
            originalStock -
            cartQuantity;


        return Math.max(
            0,
            availableStock
        );

    }


    /* ==================================================
       GET AVAILABLE SIZES
    ================================================== */

    function getSelectedColorSizes() {

        const selectedColor =
            getSelectedColor();


        if (
            !selectedColor ||
            !selectedColor.sizes
        ) {

            return [];

        }


        return Object.entries(
            selectedColor.sizes
        )
            .filter(
                ([size]) =>

                    getSizeStock(
                        size
                    ) > 0
            )
            .map(
                ([size]) =>
                    size
            );

    }


    /* ==================================================
       RELATED PRODUCTS
    ================================================== */

    const relatedProducts =
        productData
            .filter(
                item =>

                    item.id !==
                    product.id &&

                    item.category ===
                    product.category
            )
            .slice(
                0,
                4
            );


    /* ==================================================
       CREATE CART ITEM
    ================================================== */

    function createCartItem() {

        const selectedColor =
            getSelectedColor();


        const originalStock =
            getOriginalSizeStock(
                selectedSize
            );


        return {

            productId:
                product.id,

            slug:
                product.slug,

            name:
                product.name,

            brand:
                product.brand ||
                "ASTRIKE SPORTS",

            price:
                Number(
                    product.price
                ),

            oldPrice:
                product.oldPrice
                    ? Number(
                        product.oldPrice
                    )
                    : null,

            currency:
                product.currency ||
                "₹",

            image:
                selectedColor
                    ?.images?.[0] ||
                "",

            color:
                selectedColor?.name ||
                "Default",

            colorCode:
                selectedColor?.code ||
                selectedColor?.colorCode ||
                "",

            size:
                selectedSize,

            quantity:
                1,

            stock:
                Number(
                    originalStock
                )

        };

    }


    /* ==================================================
       RENDER PRODUCT PAGE
    ================================================== */

    function render() {

        const selectedColor =
            getSelectedColor();


        const images =
            Array.isArray(
                selectedColor?.images
            )
                ? selectedColor.images
                : [];


        const sizes =
            getSelectedColorSizes();


        const mainImage =
            images[0] ||
            "";


        /* ==================================================
           PRODUCT DETAILS FROM JSON
        ================================================== */

        const productDetails =
            product.productDetails ||
            "Product details not available.";


        /* ==================================================
           INSERT PRODUCT PAGE
        ================================================== */

        app.insertAdjacentHTML(
            "beforeend",
            `

            <main class="product-page">

                <!-- ======================================
                     PRODUCT MAIN SECTION
                ======================================= -->

                <section class="product-layout">


                    <!-- ==================================
                         PRODUCT GALLERY
                    ================================== -->

                    <div class="product-gallery">


                        <!-- THUMBNAILS -->

                        <div
                            class="product-thumbnails"
                            id="productThumbnails"
                        >

                            ${
                                images.length > 0

                                ?

                                images
                                    .map(
                                        (
                                            image,
                                            index
                                        ) => `

                                        <button
                                            type="button"
                                            class="
                                                product-thumbnail
                                                ${
                                                    index === 0
                                                        ? "active"
                                                        : ""
                                                }
                                            "
                                            data-image="${image}"
                                        >

                                            <img
                                                src="${image}"
                                                alt="${product.name}"
                                                loading="${
                                                    index === 0
                                                        ? "eager"
                                                        : "lazy"
                                                }"
                                                onerror="
                                                    this.style.display='none';
                                                "
                                            >

                                        </button>

                                        `
                                    )
                                    .join("")

                                :

                                `

                                <div class="no-images">
                                    No Images
                                </div>

                                `
                            }

                        </div>


                        <!-- MAIN IMAGE -->

                        <div
                            class="product-main-image"
                        >

                            ${
                                mainImage

                                ?

                                `

                                <img
                                    id="mainProductImage"
                                    src="${mainImage}"
                                    alt="${product.name}"
                                    loading="eager"
                                    onerror="
                                        this.style.display='none';
                                        document
                                            .querySelector('.main-image-error')
                                            ?.classList
                                            .remove('hidden');
                                    "
                                >

                                <div
                                    class="main-image-error hidden"
                                >
                                    Image Not Available
                                </div>

                                `

                                :

                                `

                                <div class="no-main-image">
                                    Image Not Available
                                </div>

                                `
                            }


                            <button
                                type="button"
                                class="wishlist-btn"
                                aria-label="Add to wishlist"
                            >
                                ♡
                            </button>

                        </div>

                    </div>


                    <!-- ==================================
                         PRODUCT INFORMATION
                    ================================== -->

                    <div class="product-info-panel">


                        <!-- BRAND -->

                        <p class="product-brand">

                            ${
                                product.brand ||
                                "ASTRIKE SPORTS"
                            }

                        </p>


                        <!-- NAME -->

                        <h1 class="product-title">

                            ${product.name}

                        </h1>


                        <!-- RATING -->

                        <div
                            class="product-rating"
                        >

                            <span>

                                ★
                                ${
                                    product.rating ||
                                    0
                                }

                            </span>

                            <span>

                                ${
                                    product.reviews ||
                                    0
                                }

                                Reviews

                            </span>

                        </div>


                        <!-- PRICE -->

                        <div
                            class="product-price"
                        >

                            <strong>

                                ${
                                    product.currency ||
                                    "₹"
                                }${product.price}

                            </strong>


                            ${
                                product.oldPrice

                                ?

                                `

                                <del>

                                    ${
                                        product.currency ||
                                        "₹"
                                    }${product.oldPrice}

                                </del>

                                `

                                :

                                ""
                            }


                            ${
                                product.discount

                                ?

                                `

                                <span>
                                    ${product.discount}
                                </span>

                                `

                                :

                                ""
                            }

                        </div>


                        <!-- ==================================
                             COLOR
                        ================================== -->

                        ${
                            colors.length > 0

                            ?

                            `

                            <div
                                class="product-option"
                            >

                                <div
                                    class="option-heading"
                                >

                                    <span>
                                        COLOR
                                    </span>

                                    <strong
                                        id="selectedColorName"
                                    >

                                        ${
                                            selectedColor?.name ||
                                            "Default"
                                        }

                                    </strong>

                                </div>


                                <div
                                    class="color-options"
                                    id="colorOptions"
                                >

                                    ${
                                        colors
                                            .map(
                                                (
                                                    color,
                                                    index
                                                ) => `

                                                <button
                                                    type="button"
                                                    class="
                                                        color-option
                                                        ${
                                                            index ===
                                                            selectedColorIndex
                                                                ? "active"
                                                                : ""
                                                        }
                                                    "
                                                    data-color-index="${index}"
                                                    title="${
                                                        color.name ||
                                                        ""
                                                    }"
                                                >

                                                    ${
                                                        color.images?.[0]

                                                        ?

                                                        `

                                                        <img
                                                            src="${color.images[0]}"
                                                            alt="${
                                                                color.name ||
                                                                product.name
                                                            }"
                                                            loading="lazy"
                                                            onerror="
                                                                this.style.display='none';
                                                            "
                                                        >

                                                        `

                                                        :

                                                        `

                                                        <span>

                                                            ${
                                                                color.name ||
                                                                "Color"
                                                            }

                                                        </span>

                                                        `
                                                    }

                                                </button>

                                                `
                                            )
                                            .join("")
                                    }

                                </div>

                            </div>

                            `

                            :

                            ""
                        }


                        <!-- ==================================
                             SIZE
                        ================================== -->

                        <div
                            class="product-option"
                        >

                            <div
                                class="option-heading"
                            >

                                <span>
                                    SELECT SIZE
                                </span>

                                <button
                                    type="button"
                                    class="size-guide"
                                >
                                    Size Guide
                                </button>

                            </div>


                            <div
                                class="size-options"
                                id="sizeOptions"
                            >

                                ${
                                    sizes.length > 0

                                    ?

                                    sizes
                                        .map(
                                            size => `

                                            <button
                                                type="button"
                                                class="size-option"
                                                data-size="${size}"
                                            >

                                                ${size}

                                            </button>

                                            `
                                        )
                                        .join("")

                                    :

                                    `

                                    <p class="no-size">
                                        No size available
                                    </p>

                                    `
                                }

                            </div>

                        </div>


                        <!-- ==================================
                             STOCK
                        ================================== -->

                        <div
                            class="product-availability"
                            id="productAvailability"
                        >

                            ${
                                sizes.length > 0

                                ?

                                `

                                <span>
                                    ● SELECT SIZE
                                </span>

                                <small>
                                    Choose your size
                                    to check stock
                                </small>

                                `

                                :

                                `

                                <span>
                                    ● OUT OF STOCK
                                </span>

                                `
                            }

                        </div>


                        <!-- ==================================
                             ACTIONS
                        ================================== -->

                        <div
                            class="product-actions"
                        >

                            <button
                                type="button"
                                class="add-to-cart-btn"
                                data-action="add-to-cart"
                                ${
                                    sizes.length === 0
                                        ? "disabled"
                                        : ""
                                }
                            >
                                ADD TO CART
                            </button>


                            <button
                                type="button"
                                class="buy-now-btn"
                                ${
                                    sizes.length === 0
                                        ? "disabled"
                                        : ""
                                }
                            >
                                BUY NOW
                            </button>

                        </div>


                        <!-- ==================================
                             DELIVERY
                        ================================== -->

                        <div
                            class="delivery-box"
                        >

                            <h3>
                                DELIVERY & AVAILABILITY
                            </h3>


                            <div
                                class="delivery-row"
                            >

                                <span>
                                    🚚
                                </span>

                                <div>

                                    <strong>
                                        Fast Delivery
                                    </strong>

                                    <p>
                                        Enter your pincode
                                        to check availability.
                                    </p>

                                </div>

                            </div>


                            <div
                                class="delivery-row"
                            >

                                <span>
                                    ↩
                                </span>

                                <div>

                                    <strong>
                                        Easy Returns
                                    </strong>

                                    <p>
                                        Simple return and
                                        exchange policy.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                <!-- ======================================
                     PRODUCT DETAILS
                ======================================= -->

                <section
                    class="product-extra"
                >

                    <div
                        class="extra-section"
                    >

                        <h2>
                            PRODUCT DETAILS
                        </h2>

                        <p>
                            ${productDetails}
                        </p>

                    </div>


                    <!-- ==================================
                         PRODUCT INFORMATION
                    ================================== -->

                    <div
                        class="extra-section"
                    >

                        <h2>
                            PRODUCT INFORMATION
                        </h2>


                        <div
                            class="product-specs"
                        >

                            <div>

                                <span>
                                    BRAND
                                </span>

                                <strong>
                                    ${
                                        product.brand ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    CATEGORY
                                </span>

                                <strong>
                                    ${
                                        product.subCategory ||
                                        product.category ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    GENDER
                                </span>

                                <strong>
                                    ${
                                        product.gender ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    FIT
                                </span>

                                <strong>
                                    ${
                                        product.fit ||
                                        "Regular Fit"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    FABRIC
                                </span>

                                <strong>
                                    ${
                                        product.fabric ||
                                        "Performance Fabric"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    SOLD
                                </span>

                                <strong>
                                    ${
                                        product.sold ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                <!-- ======================================
                     RELATED PRODUCTS
                ======================================= -->

                <section
                    class="related-products"
                >

                    <div
                        class="related-heading"
                    >

                        <p>
                            YOU MAY ALSO LIKE
                        </p>

                        <h2>
                            RELATED PRODUCTS
                        </h2>

                    </div>


                    <div
                        class="related-product-grid"
                    >

                        ${
                            relatedProducts.length > 0

                            ?

                            relatedProducts
                                .map(
                                    item => {

                                        const image =
                                            item
                                                .colors
                                                ?.[0]
                                                ?.images
                                                ?.[0];


                                        return `

                                        <article
                                            class="related-card"
                                        >

                                            <a
                                                href="/product/${item.slug}"
                                                class="related-image"
                                            >

                                                ${
                                                    image

                                                    ?

                                                    `

                                                    <img
                                                        src="${image}"
                                                        alt="${item.name}"
                                                        loading="lazy"
                                                        onerror="
                                                            this.style.display='none';
                                                        "
                                                    >

                                                    `

                                                    :

                                                    `

                                                    <div
                                                        class="no-product-image"
                                                    >
                                                        Image Not Available
                                                    </div>

                                                    `
                                                }

                                            </a>


                                            <div
                                                class="related-info"
                                            >

                                                <p>
                                                    ${
                                                        item.brand ||
                                                        ""
                                                    }
                                                </p>


                                                <h3>
                                                    ${item.name}
                                                </h3>


                                                <div
                                                    class="related-price"
                                                >

                                                    <strong>

                                                        ${
                                                            item.currency ||
                                                            "₹"
                                                        }${item.price}

                                                    </strong>


                                                    ${
                                                        item.oldPrice

                                                        ?

                                                        `

                                                        <del>

                                                            ${
                                                                item.currency ||
                                                                "₹"
                                                            }${item.oldPrice}

                                                        </del>

                                                        `

                                                        :

                                                        ""
                                                    }

                                                </div>

                                            </div>

                                        </article>

                                        `;

                                    }
                                )
                                .join("")

                            :

                            `

                            <div class="no-products">

                                <h2>
                                    No Related Products
                                </h2>

                            </div>

                            `
                        }

                    </div>

                </section>


            </main>

            `
        );


        attachEvents();

        updateAllStockUI();

    }


    /* ==================================================
       ATTACH EVENTS
    ================================================== */

    function attachEvents() {

        attachColorEvents();

        attachSizeEvents();

        attachThumbnailEvents();

        attachCartEvent();

        attachBuyNowEvent();

    }


    /* ==================================================
       COLOR EVENTS
    ================================================== */

    function attachColorEvents() {

        document
            .querySelectorAll(
                ".color-option"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            selectedColorIndex =
                                Number(
                                    button.dataset.colorIndex
                                );


                            selectedSize =
                                null;


                            updateColor();

                        }
                    );

                }
            );

    }


    /* ==================================================
       SIZE EVENTS
    ================================================== */

    function attachSizeEvents() {

        document
            .querySelectorAll(
                ".size-option"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    ".size-option"
                                )
                                .forEach(
                                    item => {

                                        item.classList.remove(
                                            "active"
                                        );

                                    }
                                );


                            button.classList.add(
                                "active"
                            );


                            selectedSize =
                                button.dataset.size;


                            const stock =
                                getSizeStock(
                                    selectedSize
                                );


                            updateAvailability(
                                stock
                            );

                        }
                    );

                }
            );

    }


    /* ==================================================
       UPDATE AVAILABILITY
    ================================================== */

    function updateAvailability(
        stock
    ) {

        const availability =
            document.querySelector(
                "#productAvailability"
            );


        if (!availability) {

            return;

        }


        if (stock > 0) {

            availability.innerHTML = `

                <span>
                    ● IN STOCK
                </span>

                <small>
                    ${stock}
                    pieces available
                </small>

            `;

        } else {

            availability.innerHTML = `

                <span>
                    ● OUT OF STOCK
                </span>

                <small>
                    This size is unavailable
                </small>

            `;

        }

    }


    /* ==================================================
       UPDATE ALL STOCK UI
    ================================================== */

    function updateAllStockUI() {

        const sizes =
            getSelectedColorSizes();


        const sizeButtons =
            document.querySelectorAll(
                ".size-option"
            );


        sizeButtons.forEach(
            button => {

                const size =
                    button.dataset.size;


                const stock =
                    getSizeStock(
                        size
                    );


                button.disabled =
                    stock <= 0;


                button.classList.toggle(
                    "out-of-stock",
                    stock <= 0
                );

            }
        );


        const addButton =
            document.querySelector(
                ".add-to-cart-btn"
            );


        const buyButton =
            document.querySelector(
                ".buy-now-btn"
            );


        const hasStock =
            sizes.length > 0;


        if (addButton) {

            addButton.disabled =
                !hasStock;

        }


        if (buyButton) {

            buyButton.disabled =
                !hasStock;

        }


        if (
            selectedSize &&
            getSizeStock(
                selectedSize
            ) > 0
        ) {

            updateAvailability(
                getSizeStock(
                    selectedSize
                )
            );

        } else if (
            selectedSize
        ) {

            selectedSize =
                null;


            sizeButtons.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            if (
                sizes.length > 0
            ) {

                const availability =
                    document.querySelector(
                        "#productAvailability"
                    );


                if (availability) {

                    availability.innerHTML = `

                        <span>
                            ● SELECT SIZE
                        </span>

                        <small>
                            Choose your size
                            to check stock
                        </small>

                    `;

                }

            }

        }

    }


    /* ==================================================
       UPDATE COLOR
    ================================================== */

    function updateColor() {

        const selectedColor =
            getSelectedColor();


        if (!selectedColor) {

            return;

        }


        const images =
            Array.isArray(
                selectedColor.images
            )
                ? selectedColor.images
                : [];


        /* ==================================================
           COLOR NAME
        ================================================== */

        const colorName =
            document.querySelector(
                "#selectedColorName"
            );


        if (colorName) {

            colorName.textContent =
                selectedColor.name ||
                "Default";

        }


        /* ==================================================
           MAIN IMAGE
        ================================================== */

        const mainImage =
            document.querySelector(
                "#mainProductImage"
            );


        if (
            mainImage &&
            images.length > 0
        ) {

            mainImage.style.display =
                "";

            mainImage.src =
                images[0];

        }


        /* ==================================================
           ACTIVE COLOR
        ================================================== */

        document
            .querySelectorAll(
                ".color-option"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


        const activeColorButton =
            document.querySelector(
                `[data-color-index="${selectedColorIndex}"]`
            );


        if (activeColorButton) {

            activeColorButton.classList.add(
                "active"
            );

        }


        /* ==================================================
           THUMBNAILS
        ================================================== */

        const thumbnails =
            document.querySelector(
                "#productThumbnails"
            );


        if (thumbnails) {

            if (
                images.length > 0
            ) {

                thumbnails.innerHTML =
                    images
                        .map(
                            (
                                image,
                                index
                            ) => `

                            <button
                                type="button"
                                class="
                                    product-thumbnail
                                    ${
                                        index === 0
                                            ? "active"
                                            : ""
                                    }
                                "
                                data-image="${image}"
                            >

                                <img
                                    src="${image}"
                                    alt="${product.name}"
                                    loading="${
                                        index === 0
                                            ? "eager"
                                            : "lazy"
                                    }"
                                    onerror="
                                        this.style.display='none';
                                    "
                                >

                            </button>

                            `
                        )
                        .join("");

            } else {

                thumbnails.innerHTML = `

                    <div class="no-images">
                        No Images
                    </div>

                `;

            }


            attachThumbnailEvents();

        }


        /* ==================================================
           UPDATE SIZE OPTIONS
        ================================================== */

        const sizeOptions =
            document.querySelector(
                "#sizeOptions"
            );


        const sizes =
            getSelectedColorSizes();


        selectedSize =
            null;


        if (sizeOptions) {

            if (
                sizes.length > 0
            ) {

                sizeOptions.innerHTML =
                    sizes
                        .map(
                            size => `

                            <button
                                type="button"
                                class="size-option"
                                data-size="${size}"
                            >
                                ${size}
                            </button>

                            `
                        )
                        .join("");

            } else {

                sizeOptions.innerHTML = `

                    <p class="no-size">
                        No size available
                    </p>

                `;

            }


            attachSizeEvents();

        }


        /* ==================================================
           RESET AVAILABILITY
        ================================================== */

        const availability =
            document.querySelector(
                "#productAvailability"
            );


        if (availability) {

            availability.innerHTML =

                sizes.length > 0

                    ?

                    `

                    <span>
                        ● SELECT SIZE
                    </span>

                    <small>
                        Choose your size
                        to check stock
                    </small>

                    `

                    :

                    `

                    <span>
                        ● OUT OF STOCK
                    </span>

                    `;

        }


        updateAllStockUI();

    }


    /* ==================================================
       THUMBNAIL EVENTS
    ================================================== */

    function attachThumbnailEvents() {

        document
            .querySelectorAll(
                ".product-thumbnail"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const image =
                                button.dataset.image;


                            const mainImage =
                                document.querySelector(
                                    "#mainProductImage"
                                );


                            if (mainImage) {

                                mainImage.style.display =
                                    "";

                                mainImage.src =
                                    image;

                            }


                            document
                                .querySelectorAll(
                                    ".product-thumbnail"
                                )
                                .forEach(
                                    item => {

                                        item.classList.remove(
                                            "active"
                                        );

                                    }
                                );


                            button.classList.add(
                                "active"
                            );

                        }
                    );

                }
            );

    }


    /* ==================================================
       ADD TO CART
    ================================================== */

    function attachCartEvent() {

        const addToBag =
            document.querySelector(
                ".add-to-cart-btn"
            );


        if (!addToBag) {

            return;

        }


        addToBag.addEventListener(
            "click",
            () => {

                if (!selectedSize) {

                    alert(
                        "Please select a size first."
                    );

                    return;

                }


                const stock =
                    getSizeStock(
                        selectedSize
                    );


                if (stock <= 0) {

                    alert(
                        "Selected size is out of stock."
                    );

                    updateAllStockUI();

                    return;

                }


                const cartItem =
                    createCartItem();


                const added =
                    addProductToCart(
                        cartItem
                    );


                if (!added) {

                    return;

                }


                const newStock =
                    getSizeStock(
                        selectedSize
                    );


                updateAvailability(
                    newStock
                );


                updateAllStockUI();


                console.log(
                    "========== ADDED TO CART =========="
                );


                console.log(
                    cartItem
                );


                alert(
                    `${product.name} added to cart`
                );

            }
        );

    }


    /* ==================================================
       BUY NOW
    ================================================== */

    function attachBuyNowEvent() {

        const buyNow =
            document.querySelector(
                ".buy-now-btn"
            );


        if (!buyNow) {

            return;

        }


        buyNow.addEventListener(
            "click",
            () => {

                if (!selectedSize) {

                    alert(
                        "Please select a size first."
                    );

                    return;

                }


                const stock =
                    getSizeStock(
                        selectedSize
                    );


                if (stock <= 0) {

                    alert(
                        "Selected size is out of stock."
                    );

                    return;

                }


                const cartItem =
                    createCartItem();


                const added =
                    addProductToCart(
                        cartItem
                    );


                if (!added) {

                    return;

                }


                window.location.href =
                    "/cart";

            }
        );

    }


    /* ==================================================
       CART UPDATED
    ================================================== */

    function handleCartUpdated() {

        updateAllStockUI();

    }


    window.addEventListener(
        "cartUpdated",
        handleCartUpdated
    );


    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                CART_KEY
            ) {

                updateAllStockUI();

            }

        }
    );


    /* ==================================================
       INITIAL RENDER
    ================================================== */

    render();

}