/* ========================================
   SUMMER COLLECTION
======================================== */

import productData from "../../data/product.json";
import "./summerCollection.css";


/* ========================================
   LOAD SUMMER COLLECTION
======================================== */

export function loadSummerCollection() {

    const container =
        document.getElementById(
            "summerCollection"
        );


    /* ========================================
       CONTAINER CHECK
    ======================================== */

    if (!container) {

        console.warn(
            "Summer Collection container not found"
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
                    "summer-collection"
                );

            }


            return (
                product.collections ===
                "summer-collection"
            );

        });


    /* ========================================
       DEBUG
    ======================================== */

    console.log(
        "SUMMER COLLECTION PRODUCTS:",
        products
    );


    /* ========================================
       EMPTY CHECK
    ======================================== */

    if (!products.length) {

        container.innerHTML = `

            <section
                class="summer-collection-section"
            >

                <div
                    class="summer-collection-empty"
                >

                    <span class="section-label">
                        SUMMER COLLECTION
                    </span>

                    <h2>
                        Summer Collection
                    </h2>

                    <p>
                        No summer collection
                        products available.
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
            class="summer-collection-section"
        >


            <!-- ==================================
                 HEADER
            =================================== -->

            <div
                class="summer-collection-header"
            >


                <!-- TITLE -->

                <div
                    class="summer-collection-title"
                >

                    <span class="section-label">
                        SUMMER COLLECTION
                    </span>

                    <h2>
                        Summer Collection
                    </h2>

                </div>


                <!-- VIEW ALL -->

                <a
                    href="/collection/summer-collection"
                    class="view-all"
                >
                    View All →
                </a>


            </div>


            <!-- ==================================
                 SLIDER
            =================================== -->

            <div
                class="
                    summer-collection-slider-wrapper
                "
            >


                <!-- LEFT BUTTON -->

                <button
                    class="
                        slider-btn
                        summer-collection-prev
                    "
                    id="summerCollectionPrev"
                    type="button"
                    aria-label="Previous products"
                >
                    ←
                </button>


                <!-- PRODUCTS -->

                <div
                    class="
                        summer-collection-slider
                    "
                    id="summerCollectionSlider"
                >

                    ${
                        products
                            .map(product => {

                                /* ====================
                                   IMAGE
                                ==================== */

                                const image =
                                    product
                                        .colors?.[0]
                                        ?.images?.[0]
                                    || "";


                                /* ====================
                                   PRODUCT NAME
                                ==================== */

                                const name =
                                    product.name ||
                                    "Product";


                                /* ====================
                                   PRICE
                                ==================== */

                                const currency =
                                    product.currency ||
                                    "₹";


                                const price =
                                    product.price ??
                                    0;


                                /* ====================
                                   SLUG
                                ==================== */

                                const slug =
                                    product.slug ||
                                    product.id ||
                                    "";


                                return `

                                    <article
                                        class="
                                            summer-collection-card
                                        "
                                        data-slug="${slug}"
                                    >


                                        <!-- =================================
                                             PRODUCT IMAGE
                                        ================================== -->

                                        <a
                                            href="/product/${slug}"
                                            class="
                                                summer-collection-image
                                            "
                                            aria-label="${name}"
                                        >

                                            <img
                                                src="${image}"
                                                alt="${name}"
                                                loading="lazy"
                                            />

                                        </a>


                                        <!-- =================================
                                             PRODUCT INFO
                                        ================================== -->

                                        <div
                                            class="
                                                summer-collection-info
                                            "
                                        >


                                            <!-- PRODUCT NAME -->

                                            <h3>
                                                ${name}
                                            </h3>


                                            <!-- NEW PRICE -->

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

                            })
                            .join("")
                    }

                </div>


                <!-- RIGHT BUTTON -->

                <button
                    class="
                        slider-btn
                        summer-collection-next
                    "
                    id="summerCollectionNext"
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
            "summerCollectionSlider"
        );


    const prevBtn =
        document.getElementById(
            "summerCollectionPrev"
        );


    const nextBtn =
        document.getElementById(
            "summerCollectionNext"
        );


    if (!slider) {

        console.warn(
            "Summer Collection slider not found"
        );

        return;

    }


    /* ========================================
       SCROLL AMOUNT
    ======================================== */

    const getScrollAmount = () => {

        const card =
            slider.querySelector(
                ".summer-collection-card"
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
       → PRODUCT DETAIL
    ======================================== */

    const cards =
        slider.querySelectorAll(
            ".summer-collection-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /* --------------------------------
                   IGNORE PRODUCT LINK CLICK
                -------------------------------- */

                if (
                    event.target.closest(
                        "a"
                    )
                ) {

                    return;

                }


                /* --------------------------------
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


                /* --------------------------------
                   PRODUCT DETAIL
                -------------------------------- */

                window.location.href =
                    `/product/${slug}`;

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


        /* --------------------------------
           PREVIOUS
        -------------------------------- */

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


        /* --------------------------------
           NEXT
        -------------------------------- */

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