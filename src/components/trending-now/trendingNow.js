/* ========================================
   TRENDING NOW
======================================== */

import productData from "../../data/product.json";
import "./trendingNow.css";


/* ========================================
   LOAD TRENDING NOW
======================================== */

export function loadTrendingNow() {

    const container =
        document.getElementById(
            "trendingNow"
        );


    /* ========================================
       CONTAINER CHECK
    ======================================== */

    if (!container) {

        console.warn(
            "Trending Now container not found"
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
                    "trending-now"
                );

            }


            return (
                product.collections ===
                "trending-now"
            );

        });


    /* ========================================
       DEBUG
    ======================================== */

    console.log(
        "TRENDING NOW PRODUCTS:",
        products
    );


    /* ========================================
       EMPTY CHECK
    ======================================== */

    if (!products.length) {

        container.innerHTML = `

            <section
                class="trending-now-section"
            >

                <div
                    class="trending-now-empty"
                >

                    <span
                        class="section-label"
                    >
                        TRENDING NOW
                    </span>


                    <h2>
                        Trending Now
                    </h2>


                    <p>
                        No trending products
                        available.
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
            class="trending-now-section"
        >


            <!-- ==================================
                 HEADER
            =================================== -->

            <div
                class="trending-now-header"
            >


                <!-- TITLE -->

                <div
                    class="trending-now-title"
                >

                    <span
                        class="section-label"
                    >
                        TRENDING NOW
                    </span>


                    <h2>
                        Trending Now
                    </h2>

                </div>


                <!-- VIEW ALL -->

                <a
                    href="/collection/trending-now"
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
                    trending-now-slider-wrapper
                "
            >


                <!-- LEFT BUTTON -->

                <button
                    class="
                        slider-btn
                        trending-now-prev
                    "
                    id="trendingNowPrev"
                    type="button"
                    aria-label="Previous products"
                >
                    ←
                </button>



                <!-- PRODUCTS -->

                <div
                    class="
                        trending-now-slider
                    "
                    id="trendingNowSlider"
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
                                            trending-now-card
                                        "
                                        data-slug="${slug}"
                                    >


                                        <!-- =================================
                                             PRODUCT IMAGE
                                        ================================== -->

                                        <a
                                            href="/product/${slug}"
                                            class="
                                                trending-now-image
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
                                                trending-now-info
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
                        trending-now-next
                    "
                    id="trendingNowNext"
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
            "trendingNowSlider"
        );


    const prevBtn =
        document.getElementById(
            "trendingNowPrev"
        );


    const nextBtn =
        document.getElementById(
            "trendingNowNext"
        );


    if (!slider) {

        console.warn(
            "Trending Now slider not found"
        );

        return;

    }


    /* ========================================
       SCROLL AMOUNT
    ======================================== */

    const getScrollAmount = () => {

        const card =
            slider.querySelector(
                ".trending-now-card"
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
            ".trending-now-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /* --------------------------------
                   LINK PAR CLICK
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
           PREVIOUS BUTTON
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
           NEXT BUTTON
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