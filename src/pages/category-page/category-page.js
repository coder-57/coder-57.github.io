/* ==================================================
   CATEGORY PAGE
================================================== */

import "./category-page.css";

import productData from "../../data/product.json";

import {
    createProductFilter
} from "../../components/product-filter/productFilter.js";


/* ==================================================
   LOAD CATEGORY PAGE
================================================== */

export function loadCategoryPage({

    category = null,

    subCategory = null,

    type = "category"

}) {

    const app =
        document.querySelector("#app");


    /* ==================================================
       APP CHECK
    ================================================== */

    if (!app) {

        console.error(
            "App container #app not found"
        );

        return;

    }


    /* ==================================================
       GET PRODUCTS
    ================================================== */

    let categoryProducts = [];


    /* ==================================================
       NORMAL CATEGORY
    ================================================== */

    if (type === "category") {

        categoryProducts =
            productData.filter(
                product => {

                    /* ----------------------------------
                       SUB CATEGORY
                    ---------------------------------- */

                    if (subCategory) {

                        return (

                            product.category ===
                                category &&

                            product.subCategory ===
                                subCategory

                        );

                    }


                    /* ----------------------------------
                       MAIN CATEGORY
                    ---------------------------------- */

                    return (
                        product.category ===
                        category
                    );

                }
            );

    }


    /* ==================================================
       BEST SELLERS
    ================================================== */

    else if (type === "best-sellers") {

        categoryProducts =
            [...productData]
                .sort(
                    (
                        productA,
                        productB
                    ) => {

                        const soldA =
                            Number(
                                productA.sold || 0
                            );


                        const soldB =
                            Number(
                                productB.sold || 0
                            );


                        return (
                            soldB - soldA
                        );

                    }
                );

    }


    /* ==================================================
       NEW ARRIVALS
    ================================================== */

    else if (type === "new-arrivals") {

        categoryProducts =
            [...productData]
                .sort(
                    (
                        productA,
                        productB
                    ) => {

                        /* --------------------------------
                           CREATED DATE
                        -------------------------------- */

                        const dateA =
                            new Date(
                                productA.createdAt ||
                                productA.date ||
                                0
                            ).getTime();


                        const dateB =
                            new Date(
                                productB.createdAt ||
                                productB.date ||
                                0
                            ).getTime();


                        /* --------------------------------
                           ID FALLBACK
                        -------------------------------- */

                        if (
                            dateA === 0 &&
                            dateB === 0
                        ) {

                            return (

                                Number(
                                    productB.id || 0
                                ) -

                                Number(
                                    productA.id || 0
                                )

                            );

                        }


                        return (
                            dateB - dateA
                        );

                    }
                );

    }


    /* ==================================================
       DEBUG
    ================================================== */

    console.log(
        "CATEGORY PAGE TYPE:",
        type
    );


    console.log(
        "CATEGORY:",
        category
    );


    console.log(
        "SUB CATEGORY:",
        subCategory
    );


    console.log(
        "CATEGORY PRODUCTS:",
        categoryProducts
    );


    /* ==================================================
       PAGE TITLE
    ================================================== */

    let pageTitle = "Products";


    if (type === "best-sellers") {

        pageTitle =
            "Best Sellers";

    }

    else if (type === "new-arrivals") {

        pageTitle =
            "New Arrivals";

    }

    else {

        pageTitle =
            subCategory ||
            category ||
            "Products";

    }


    /* ==================================================
       CLEAR OLD CATEGORY PAGE
    ================================================== */

    const oldPage =
        document.querySelector(
            "#categoryPage"
        );


    if (oldPage) {

        oldPage.remove();

    }


    /* ==================================================
       CATEGORY PAGE HTML
    ================================================== */

    app.insertAdjacentHTML(

        "beforeend",

        `

        <main
            class="category-page"
            id="categoryPage"
        >


            <!-- ======================================
                 CATEGORY HEADER
            ======================================= -->

            <section
                class="category-page-header"
            >

                <p
                    class="category-eyebrow"
                >
                    ${
                        type === "best-sellers"
                            ? "SHOP OUR MOST POPULAR"

                            : type === "new-arrivals"
                                ? "JUST DROPPED"

                                : "EXPLORE"
                    }
                </p>


                <h1
                    class="category-title"
                >
                    ${formatTitle(pageTitle)}
                </h1>


                <span
                    class="category-count"
                    id="categoryProductCount"
                >
                    ${categoryProducts.length}
                    PRODUCTS
                </span>

            </section>



            <!-- ======================================
                 FILTER + PRODUCTS
            ======================================= -->

            <section
                class="category-products-section"
            >


                <!-- FILTER -->

                <div
                    id="productFilterContainer"
                ></div>



                <!-- PRODUCT GRID -->

                <div
                    class="category-product-grid"
                    id="categoryProductGrid"
                ></div>


            </section>


        </main>

        `

    );


    /* ==================================================
       CURRENT PRODUCTS

       Filter aur Sort dono isi array par
       kaam karenge.
    ================================================== */

    let currentProducts =
        [...categoryProducts];


    /* ==================================================
       CREATE FILTER
    ================================================== */

    const filter =
        createProductFilter({

            /* ------------------------------------------
               ORIGINAL PRODUCTS
            ------------------------------------------ */

            products:
                categoryProducts,


            /* ------------------------------------------
               FILTER CALLBACK
            ------------------------------------------ */

            onFilter:
                (filteredProducts) => {

                    currentProducts =
                        [...filteredProducts];


                    renderProducts(
                        currentProducts
                    );

                },


            /* ------------------------------------------
               SORT CALLBACK
            ------------------------------------------ */

            onSort:
                (sortedProducts) => {

                    currentProducts =
                        [...sortedProducts];


                    renderProducts(
                        currentProducts
                    );

                }

        });


    /* ==================================================
       INSERT FILTER HTML
    ================================================== */

    const filterContainer =
        document.querySelector(
            "#productFilterContainer"
        );


    if (filterContainer) {

        filterContainer.innerHTML =
            filter.html;

    }


    /* ==================================================
       INITIALIZE FILTER
    ================================================== */

    filter.init();


    /* ==================================================
       INITIAL PRODUCTS
    ================================================== */

    renderProducts(
        currentProducts
    );


    /* ==================================================
       RENDER PRODUCTS
    ================================================== */

    function renderProducts(
        products
    ) {

        const grid =
            document.querySelector(
                "#categoryProductGrid"
            );


        if (!grid) {

            console.error(
                "Category product grid not found"
            );

            return;

        }


        /* ==========================================
           UPDATE PRODUCT COUNT
        =========================================== */

        const count =
            document.querySelector(
                "#categoryProductCount"
            );


        if (count) {

            count.textContent =
                `${products.length} PRODUCTS`;

        }


        /* ==========================================
           NO PRODUCTS
        =========================================== */

        if (!products.length) {

            grid.innerHTML = `

                <div
                    class="no-products"
                >

                    <div
                        class="no-products-icon"
                    >
                        🛍
                    </div>


                    <h2>
                        No Products Found
                    </h2>


                    <p>
                        We couldn't find products
                        matching your filters.
                    </p>


                    <button
                        type="button"
                        class="no-products-reset"
                        id="noProductsReset"
                    >
                        Clear Filters
                    </button>

                </div>

            `;


            /* ======================================
               RESET FILTERS
            ======================================= */

            const resetButton =
                document.querySelector(
                    "#noProductsReset"
                );


            resetButton?.addEventListener(

                "click",

                () => {

                    const filterReset =
                        document.querySelector(
                            "#filterReset"
                        );


                    filterReset?.click();

                }

            );


            return;

        }


        /* ==========================================
           PRODUCT GRID
        =========================================== */

        grid.innerHTML =
            products
                .map(
                    product =>
                        createProductCard(
                            product
                        )
                )
                .join("");

    }


    /* ==================================================
       PRODUCT CARD
       
       ONLY:
       IMAGE
       PRODUCT NAME
       NEW PRICE
    ================================================== */

    function createProductCard(
        product
    ) {

        /* ==========================================
           IMAGE
        =========================================== */

        const image =
            product
                .colors?.[0]
                ?.images?.[0]
                ||
                "/images/products/placeholder.jpg";


        /* ==========================================
           BASIC DATA
        =========================================== */

        const currency =
            product.currency ||
            "₹";


        const price =
            product.price ?? 0;


        const name =
            product.name ||
            "Product";


        const slug =
            product.slug ||
            product.id;


        /* ==========================================
           PRODUCT CARD
        =========================================== */

        return `

            <article
                class="product-card"
            >


                <!-- =================================
                     PRODUCT IMAGE
                ================================== -->

                <a
                    href="/product/${slug}"
                    class="product-image"
                >

                    <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                    >

                </a>



                <!-- =================================
                     PRODUCT INFO
                ================================== -->

                <div
                    class="product-info"
                >


                    <!-- PRODUCT NAME -->

                    <h2
                        class="product-name"
                    >

                        <a
                            href="/product/${slug}"
                        >
                            ${name}
                        </a>

                    </h2>



                    <!-- NEW PRICE -->

                    <div
                        class="product-price"
                    >

                        <strong
                            class="new-price"
                        >
                            ${currency}${Number(price).toLocaleString("en-IN")}
                        </strong>

                    </div>


                </div>


            </article>

        `;

    }

}


/* ==================================================
   FORMAT TITLE
================================================== */

function formatTitle(
    value
) {

    if (!value) {

        return "Products";

    }


    return String(value)

        .replace(
            /[-_]/g,
            " "
        )

        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}