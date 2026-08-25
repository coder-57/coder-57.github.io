/* ========================================
   ASTRIKE SPORTS
   BEST SELLERS
======================================== */

import productData from "../../data/product.json";
import "./bestSellers.css";


/* ========================================
   LOAD BEST SELLERS
======================================== */

export function loadBestSellers() {

    const container =
        document.getElementById("bestSellers");


    /* ========================================
       CONTAINER CHECK
    ======================================== */

    if (!container) {

        console.warn(
            "Best Sellers container not found"
        );

        return;

    }


    /* ========================================
       FILTER PRODUCTS
    ======================================== */

    const products =
        productData.filter(product => {

            if (
                Array.isArray(
                    product.collections
                )
            ) {

                return product.collections.includes(
                    "best-sellers"
                );

            }

            return (
                product.collections ===
                "best-sellers"
            );

        });


    console.log(
        "BEST SELLERS PRODUCTS:",
        products
    );


    /* ========================================
       EMPTY CHECK
    ======================================== */

    if (!products.length) {

        container.innerHTML = `

            <section
                class="best-seller-section"
            >

                <div
                    class="best-seller-empty"
                >

                    <span class="section-label">
                        TOP PICKS
                    </span>

                    <h2>
                        Best Sellers
                    </h2>

                    <p>
                        No best sellers available.
                    </p>

                </div>

            </section>

        `;

        return;

    }


    /* ========================================
       HTML
    ======================================== */

    container.innerHTML = `

        <section
            class="best-seller-section"
        >


            <!-- ==================================
                 HEADER
            =================================== -->

            <div
                class="best-seller-header"
            >


                <!-- TITLE -->

                <div
                    class="best-seller-title"
                >

                    <span
                        class="section-label"
                    >
                        TOP PICKS
                    </span>

                    <h2>
                        Best Sellers
                    </h2>

                </div>


                <!-- VIEW ALL -->

                <a
                    href="/collection/best-sellers"
                    class="view-all"
                >
                    View All →
                </a>


            </div>


            <!-- ==================================
                 SLIDER
            =================================== -->

            <div
                class="best-seller-slider-wrapper"
            >


                <!-- LEFT BUTTON -->

                <button
                    class="
                        slider-btn
                        best-seller-prev
                    "
                    id="bestSellerPrev"
                    type="button"
                    aria-label="Previous products"
                >
                    ←
                </button>


                <!-- PRODUCTS -->

                <div
                    class="
                        best-seller-slider
                    "
                    id="bestSellerSlider"
                >

                    ${products.map(product => {

                        /* ============================
                           IMAGE
                        ============================ */

                        const image =
                            product.colors?.[0]
                                ?.images?.[0] || "";


                        /* ============================
                           PRODUCT NAME
                        ============================ */

                        const name =
                            product.name ||
                            "Product";


                        /* ============================
                           CURRENCY
                        ============================ */

                        const currency =
                            product.currency ||
                            "₹";


                        /* ============================
                           PRICE
                        ============================ */

                        const price =
                            product.price ?? 0;


                        /* ============================
                           SLUG
                        ============================ */

                        const slug =
                            product.slug ||
                            product.id ||
                            "";


                        return `

                            <article
                                class="
                                    best-seller-card
                                "
                                data-slug="${slug}"
                            >


                                <!-- ======================
                                     PRODUCT IMAGE
                                ======================= -->

                                <a
                                    href="/product/${encodeURIComponent(slug)}"
                                    class="
                                        best-seller-image
                                    "
                                    aria-label="${name}"
                                >

                                    <img
                                        src="${image}"
                                        alt="${name}"
                                        loading="lazy"
                                    />

                                </a>


                                <!-- ======================
                                     PRODUCT INFO
                                ======================= -->

                                <div
                                    class="
                                        best-seller-info
                                    "
                                >


                                    <!-- PRODUCT NAME -->

                                    <h3>
                                        ${name}
                                    </h3>


                                    <!-- CURRENT PRICE -->

                                    <div
                                        class="
                                            product-price
                                        "
                                    >

                                        <strong>

                                            ${currency}${Number(
                                                price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>

                                    </div>


                                </div>


                            </article>

                        `;

                    }).join("")}

                </div>


                <!-- RIGHT BUTTON -->

                <button
                    class="
                        slider-btn
                        best-seller-next
                    "
                    id="bestSellerNext"
                    type="button"
                    aria-label="Next products"
                >
                    →
                </button>


            </div>


        </section>

    `;


    /* ========================================
       ELEMENTS
    ======================================== */

    const slider =
        document.getElementById(
            "bestSellerSlider"
        );


    const prevBtn =
        document.getElementById(
            "bestSellerPrev"
        );


    const nextBtn =
        document.getElementById(
            "bestSellerNext"
        );


    if (!slider) {

        console.warn(
            "Best Seller slider not found"
        );

        return;

    }


    /* ========================================
       SCROLL AMOUNT
    ======================================== */

    const getScrollAmount = () => {

        const card =
            slider.querySelector(
                ".best-seller-card"
            );


        if (!card) {

            return 0;

        }


        const sliderStyle =
            window.getComputedStyle(
                slider
            );


        const gap =
            parseFloat(
                sliderStyle.gap
            ) || 0;


        return (
            card.offsetWidth +
            gap
        );

    };


    /* ========================================
       NEXT BUTTON
    ======================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                slider.scrollBy({

                    left:
                        getScrollAmount(),

                    behavior:
                        "smooth"

                });

            }
        );

    }


    /* ========================================
       PREVIOUS BUTTON
    ======================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                slider.scrollBy({

                    left:
                        -getScrollAmount(),

                    behavior:
                        "smooth"

                });

            }
        );

    }


    /* ========================================
       PRODUCT CLICK
    ======================================== */

    const cards =
        slider.querySelectorAll(
            ".best-seller-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /* -------------------------------
                   IF IMAGE LINK CLICKED
                -------------------------------- */

                if (
                    event.target.closest("a")
                ) {

                    return;

                }


                /* -------------------------------
                   GET SLUG
                -------------------------------- */

                const slug =
                    card.dataset.slug?.trim();


                if (!slug) {

                    console.warn(
                        "Product slug not found"
                    );

                    return;

                }


                /* -------------------------------
                   PRODUCT DETAIL
                -------------------------------- */

                window.location.href =
                    `/product/${encodeURIComponent(slug)}`;

            }
        );

    });


    /* ========================================
       BUTTON VISIBILITY
    ======================================== */

    function updateButtons() {

        if (
            !prevBtn ||
            !nextBtn
        ) {

            return;

        }


        const maxScroll =
            Math.max(
                0,
                slider.scrollWidth -
                slider.clientWidth
            );


        const currentScroll =
            slider.scrollLeft;


        /* ====================================
           PREVIOUS
        ==================================== */

        if (
            currentScroll <= 5
        ) {

            prevBtn.style.opacity =
                "0.45";

            prevBtn.disabled =
                true;

        }

        else {

            prevBtn.style.opacity =
                "1";

            prevBtn.disabled =
                false;

        }


        /* ====================================
           NEXT
        ==================================== */

        if (
            maxScroll <= 5 ||
            currentScroll >=
                maxScroll - 5
        ) {

            nextBtn.style.opacity =
                "0.45";

            nextBtn.disabled =
                true;

        }

        else {

            nextBtn.style.opacity =
                "1";

            nextBtn.disabled =
                false;

        }

    }


    /* ========================================
       SCROLL EVENT
    ======================================== */

    slider.addEventListener(
        "scroll",
        updateButtons,
        {
            passive: true
        }
    );


    /* ========================================
       INITIAL STATE
    ======================================== */

    updateButtons();


    /* ========================================
       RESIZE
    ======================================== */

    window.addEventListener(
        "resize",
        updateButtons
    );

}