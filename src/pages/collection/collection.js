/* =========================================================
   ASTRIKE SPORTS
   COLLECTION PAGE
========================================================= */

import productData from "../../data/product.json";
import "./collection.css";

import {
    createProductFilter
} from "../../components/product-filter/productFilter.js";


/* =========================================================
   LOAD COLLECTION PAGE
========================================================= */

export function loadCollectionPage({

    collection = null

}) {

    const container =
        document.getElementById("collection");


    /* =====================================================
       CONTAINER CHECK
    ===================================================== */

    if (!container) {

        console.error(
            "Collection container #collection not found"
        );

        return;

    }


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    let collectionProducts = [];


    /* =====================================================
       COLLECTION LANDING PAGE

       /collection

       Show all products
    ===================================================== */

    if (!collection) {

        collectionProducts =
            [...productData];

    }


    /* =====================================================
       SPECIFIC COLLECTION

       /collection/summer-collection
    ===================================================== */

    else {

        collectionProducts =
            productData.filter(
                product => {

                    return product
                        .collections
                        ?.includes(
                            collection
                        );

                }
            );

    }


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "COLLECTION:",
        collection
    );


    console.log(
        "COLLECTION PRODUCTS:",
        collectionProducts
    );


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    let pageTitle =
        "Collections";


    let eyebrow =
        "EXPLORE COLLECTIONS";


    if (collection) {

        pageTitle =
            collection;


        eyebrow =
            "COLLECTION";

    }


    /* =====================================================
       CLEAR OLD COLLECTION PAGE
    ===================================================== */

    container.innerHTML = "";


    /* =====================================================
       COLLECTION PAGE HTML
    ===================================================== */

    container.innerHTML = `

        <section
            class="collection-section"
        >

            <!-- =========================================
                 COLLECTION HEADER
            ========================================== -->

            <div
                class="collection-header"
            >

                <span
                    class="section-label"
                >
                    ${eyebrow}
                </span>


                <h1>
                    ${formatTitle(pageTitle)}
                </h1>


                <p
                    id="collectionProductCount"
                >
                    ${collectionProducts.length}
                    Products
                </p>

            </div>


            <!-- =========================================
                 FILTER + PRODUCTS
            ========================================== -->

            <div
                class="collection-products-section"
            >

                <!-- =====================================
                     FILTER
                ====================================== -->

                <div
                    id="collectionFilterContainer"
                ></div>


                <!-- =====================================
                     PRODUCTS
                ====================================== -->

                <div
                    class="collection-grid"
                    id="collectionProductGrid"
                ></div>

            </div>

        </section>

    `;


    /* =====================================================
       CURRENT PRODUCTS
    ===================================================== */

    let currentProducts =
        [...collectionProducts];


    /* =====================================================
       CREATE FILTER
    ===================================================== */

    const filter =
        createProductFilter({

            /* -----------------------------------------
               ORIGINAL PRODUCTS
            ------------------------------------------ */

            products:
                collectionProducts,


            /* -----------------------------------------
               FILTER
            ------------------------------------------ */

            onFilter:
                (filteredProducts) => {

                    currentProducts =
                        [...filteredProducts];


                    renderProducts(
                        currentProducts
                    );

                },


            /* -----------------------------------------
               SORT
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


    /* =====================================================
       INSERT FILTER
    ===================================================== */

    const filterContainer =
        document.querySelector(
            "#collectionFilterContainer"
        );


    if (filterContainer) {

        filterContainer.innerHTML =
            filter.html;

    }


    /* =====================================================
       INITIALIZE FILTER
    ===================================================== */

    filter.init();


    /* =====================================================
       INITIAL PRODUCTS
    ===================================================== */

    renderProducts(
        currentProducts
    );


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts(
        products
    ) {

        const grid =
            document.querySelector(
                "#collectionProductGrid"
            );


        if (!grid) {

            console.error(
                "Collection product grid not found"
            );

            return;

        }


        /* =============================================
           UPDATE PRODUCT COUNT
        ============================================== */

        const count =
            document.querySelector(
                "#collectionProductCount"
            );


        if (count) {

            count.textContent =
                `${products.length} Products`;

        }


        /* =============================================
           NO PRODUCTS
        ============================================== */

        if (!products.length) {

            grid.innerHTML = `

                <div
                    class="collection-no-products"
                >

                    <div
                        class="collection-no-products-icon"
                    >
                        🛍
                    </div>


                    <h2>
                        No Products Found
                    </h2>


                    <p>
                        We couldn't find products
                        matching this collection.
                    </p>


                    <button
                        type="button"
                        class="collection-reset-btn"
                        id="collectionResetBtn"
                    >
                        Clear Filters
                    </button>

                </div>

            `;


            /* =========================================
               RESET FILTER
            ========================================== */

            const resetButton =
                document.querySelector(
                    "#collectionResetBtn"
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


        /* =============================================
           PRODUCT GRID
        ============================================== */

        grid.innerHTML =
            products
                .map(
                    product =>
                        createCollectionCard(
                            product
                        )
                )
                .join("");


        /* =============================================
           PRODUCT CLICK
        ============================================== */

        grid
            .querySelectorAll(
                ".collection-card"
            )
            .forEach(
                card => {

                    card.addEventListener(
                        "click",
                        () => {

                            const slug =
                                card.dataset.slug;


                            if (!slug) {

                                return;

                            }


                            window.location.href =
                                `/product/${slug}`;

                        }
                    );

                }
            );

    }

}


/* =========================================================
   COLLECTION PRODUCT CARD

   ONLY:
   IMAGE
   PRODUCT NAME
   PRICE
========================================================= */

function createCollectionCard(
    product
) {


    /* =====================================================
       IMAGE
    ===================================================== */

    const image =
        product
            .colors?.[0]
            ?.images?.[0]
            ||
        "/images/products/placeholder.jpg";


    /* =====================================================
       CURRENCY
    ===================================================== */

    const currency =
        product.currency ||
        "₹";


    /* =====================================================
       PRICE
    ===================================================== */

    const price =
        product.price ??
        0;


    /* =====================================================
       PRODUCT NAME
    ===================================================== */

    const name =
        product.name ||
        "Product";


    /* =====================================================
       PRODUCT SLUG
    ===================================================== */

    const slug =
        product.slug ||
        product.id;


    /* =====================================================
       PRODUCT CARD
    ===================================================== */

    return `

        <article
            class="collection-card"
            data-slug="${slug}"
        >

            <!-- =========================================
                 PRODUCT IMAGE
            ========================================== -->

            <div
                class="collection-image"
            >

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                />

            </div>


            <!-- =========================================
                 PRODUCT INFO
            ========================================== -->

            <div
                class="collection-info"
            >

                <!-- PRODUCT NAME -->

                <h3>
                    ${name}
                </h3>


                <!-- PRODUCT PRICE -->

                <div
                    class="collection-price"
                >

                    <strong>
                        ${currency}${price}
                    </strong>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   FORMAT TITLE
========================================================= */

function formatTitle(
    value
) {

    if (!value) {

        return "Collections";

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