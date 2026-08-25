/* ========================================
   NEW ARRIVALS
======================================== */

import productData from "../../data/product.json";
import "./newArrivals.css";


/* ========================================
   LOAD NEW ARRIVALS
======================================== */

export function loadNewArrivals() {

    const container =
        document.getElementById(
            "newArrivals"
        );


    /* ========================================
       CONTAINER CHECK
    ======================================== */

    if (!container) {

        console.warn(
            "New Arrivals container not found"
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
                    "new-arrivals"
                );

            }


            return (
                product.collections ===
                "new-arrivals"
            );

        });


    console.log(
        "NEW ARRIVALS PRODUCTS:",
        products
    );


    /* ========================================
       EMPTY CHECK
    ======================================== */

    if (!products.length) {

        container.innerHTML = `

            <section
                class="new-arrivals-section"
            >

                <div
                    class="new-arrivals-empty"
                >

                    <span class="section-label">
                        JUST DROPPED
                    </span>

                    <h2>
                        New Arrivals
                    </h2>

                    <p>
                        No new arrivals available.
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
            class="new-arrivals-section"
        >


            <!-- ==================================
                 HEADER
            =================================== -->

            <div
                class="new-arrivals-header"
            >

                <div
                    class="new-arrivals-title"
                >

                    <span class="section-label">
                        JUST DROPPED
                    </span>

                    <h2>
                        New Arrivals
                    </h2>

                </div>


                <!-- VIEW ALL -->

                <a
                    href="/collection/new-arrivals"
                    class="view-all"
                >
                    View All →
                </a>

            </div>


            <!-- ==================================
                 SLIDER
            =================================== -->

            <div
                class="new-arrivals-slider-wrapper"
            >


                <!-- LEFT BUTTON -->

                <button
                    class="
                        slider-btn
                        new-arrival-prev
                    "
                    id="newArrivalPrev"
                    type="button"
                    aria-label="Previous products"
                >
                    ←
                </button>


                <!-- PRODUCTS -->

                <div
                    class="new-arrivals-slider"
                    id="newArrivalsSlider"
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
                                   CURRENCY
                                ==================== */

                                const currency =
                                    product.currency ||
                                    "₹";


                                /* ====================
                                   NEW PRICE
                                ==================== */

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
                                            new-arrivals-card
                                        "
                                        data-slug="${slug}"
                                    >


                                        <!-- ====================
                                             PRODUCT IMAGE
                                        ==================== -->

                                        <a
                                            href="/product/${encodeURIComponent(slug)}"
                                            class="
                                                new-arrivals-image
                                            "
                                            aria-label="${name}"
                                        >

                                            <img
                                                src="${image}"
                                                alt="${name}"
                                                loading="lazy"
                                            />

                                        </a>


                                        <!-- ====================
                                             PRODUCT INFO
                                        ==================== -->

                                        <div
                                            class="
                                                new-arrivals-info
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
                        new-arrival-next
                    "
                    id="newArrivalNext"
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
            "newArrivalsSlider"
        );


    const prevBtn =
        document.getElementById(
            "newArrivalPrev"
        );


    const nextBtn =
        document.getElementById(
            "newArrivalNext"
        );


    if (!slider) {

        console.warn(
            "New Arrivals slider not found"
        );

        return;

    }


    /* ========================================
       GET SCROLL AMOUNT
    ======================================== */

    const getScrollAmount = () => {

        const card =
            slider.querySelector(
                ".new-arrivals-card"
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
            ".new-arrivals-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /* =================================
                   DON'T DOUBLE NAVIGATE FROM LINK
                ================================= */

                if (
                    event.target.closest("a")
                ) {

                    return;

                }


                /* =================================
                   GET SLUG
                ================================= */

                const slug =
                    card.dataset.slug?.trim();


                if (!slug) {

                    console.warn(
                        "Product slug not found"
                    );

                    return;

                }


                /* =================================
                   PRODUCT DETAIL
                ================================= */

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


        /* =================================
           PREVIOUS
        ================================= */

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


        /* =================================
           NEXT
        ================================= */

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