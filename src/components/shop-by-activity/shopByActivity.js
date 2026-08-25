/* ========================================
   SHOP BY SUB CATEGORY
   DATA SOURCE → product.json
======================================== */

import productData from "../../data/product.json";
import "./shopByActivity.css";


export function loadShopByActivity() {

    const container =
        document.getElementById("shopByActivity");


    if (!container) {

        console.warn(
            "Shop By Activity container not found"
        );

        return;
    }


    /* ========================================
       UNIQUE SUB CATEGORIES
    ======================================== */

    const subCategories = [
        ...new Set(
            productData
                .map(product => product.subCategory)
                .filter(Boolean)
        )
    ];


    if (!subCategories.length) {

        container.innerHTML = "";

        return;
    }


    /* ========================================
       HTML
    ======================================== */

    container.innerHTML = `

        <section class="shop-activity-section">

            <!-- =================================
                 SUB CATEGORY HEADER
            ================================= -->

            <div class="shop-activity-header">

                <span class="section-label">
                    SHOP BY
                </span>


                <div
                    class="shop-activity-tabs"
                    id="shopActivityTabs"
                >

                    ${subCategories
                        .map(
                            (subCategory, index) => `

                                <button
                                    type="button"
                                    class="
                                        shop-activity-tab
                                        ${
                                            index === 0
                                                ? "active"
                                                : ""
                                        }
                                    "
                                    data-subcategory="${subCategory}"
                                >

                                    ${formatName(
                                        subCategory
                                    )}

                                </button>

                            `
                        )
                        .join("")
                    }

                </div>

            </div>


            <!-- =================================
                 PRODUCT CAROUSEL
            ================================= -->

            <div class="shop-activity-carousel">


                <!-- PREVIOUS -->

                <button
                    class="
                        shop-activity-btn
                        shop-activity-prev
                    "
                    id="shopActivityPrev"
                    type="button"
                >
                    ←
                </button>


                <!-- TRACK -->

                <div
                    class="
                        shop-activity-track-wrapper
                    "
                >

                    <div
                        class="
                            shop-activity-track
                        "
                        id="shopActivityTrack"
                    >
                    </div>

                </div>


                <!-- NEXT -->

                <button
                    class="
                        shop-activity-btn
                        shop-activity-next
                    "
                    id="shopActivityNext"
                    type="button"
                >
                    →
                </button>

            </div>

        </section>

    `;


    /* ========================================
       ELEMENTS
    ======================================== */

    const track =
        document.getElementById(
            "shopActivityTrack"
        );


    const tabs =
        document.querySelectorAll(
            ".shop-activity-tab"
        );


    const prevBtn =
        document.getElementById(
            "shopActivityPrev"
        );


    const nextBtn =
        document.getElementById(
            "shopActivityNext"
        );


    /* ========================================
       CURRENT SUB CATEGORY
    ======================================== */

    let selectedSubCategory =
        subCategories[0];


    let activeIndex = 0;


    /* ========================================
       GET PRODUCTS
    ======================================== */

    function getProducts() {

        return productData.filter(
            product =>
                product.subCategory ===
                selectedSubCategory
        );

    }


    /* ========================================
       RENDER PRODUCTS
    ======================================== */

    function renderProducts() {

        const products =
            getProducts();


        activeIndex = 0;


        if (!products.length) {

            track.innerHTML = `
                <div class="shop-activity-empty">
                    No products found
                </div>
            `;

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

            return;
        }


        /* ====================================
           PRODUCT CARDS
        ==================================== */

        track.innerHTML =
            products
                .map(
                    (
                        product,
                        index
                    ) => {

                        const image =
                            product
                                ?.colors?.[0]
                                ?.images?.[0]
                            || "";


                        return `

                            <article
                                class="
                                    shop-activity-card
                                "
                                data-index="${index}"
                                data-slug="${
                                    product.slug || ""
                                }"
                            >

                                <div
                                    class="
                                        shop-activity-image
                                    "
                                >

                                    <img
                                        src="${image}"
                                        alt="${
                                            product.name || ""
                                        }"
                                        loading="lazy"
                                    />

                                </div>


                                <div
                                    class="
                                        shop-activity-name
                                    "
                                >

                                    ${
                                        product.name || ""
                                    }

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");


        updateCarousel();


        /* ====================================
           CARD CLICK
        ==================================== */

        const cards =
            track.querySelectorAll(
                ".shop-activity-card"
            );


        cards.forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            card.dataset.index
                        );


                    /* SIDE CARD
                       → CENTER */

                    if (
                        index !==
                        activeIndex
                    ) {

                        activeIndex =
                            index;

                        updateCarousel();

                        return;
                    }


                    /* CENTER CARD
                       → PRODUCT PAGE */

                    const slug =
                        card.dataset.slug?.trim();


                    if (!slug) {

                        console.warn(
                            "Product slug not found"
                        );

                        return;
                    }


                    window.location.href =
                        `/product/${slug}`;

                }
            );

        });

    }


    /* ========================================
       UPDATE CAROUSEL
    ======================================== */

    function updateCarousel() {

        const cards =
            track.querySelectorAll(
                ".shop-activity-card"
            );


        const total =
            cards.length;


        if (!total) {

            return;
        }


        cards.forEach(
            (
                card,
                index
            ) => {

                let distance =
                    index -
                    activeIndex;


                /* ============================
                   LOOP DISTANCE
                ============================ */

                if (
                    distance >
                    total / 2
                ) {

                    distance -= total;

                }


                if (
                    distance <
                    -total / 2
                ) {

                    distance += total;

                }


                /* ============================
                   POSITION
                ============================ */

                const position =
                    distance * 230;


                /* ============================
                   SCALE
                ============================ */

                let scale = 0.72;


                if (
                    distance === 0
                ) {

                    scale = 1;

                }
                else if (
                    Math.abs(distance) === 1
                ) {

                    scale = 0.88;

                }


                /* ============================
                   STYLE
                ============================ */

                card.style.transform =
                    `
                        translateX(${position}px)
                        scale(${scale})
                    `;


                card.style.zIndex =
                    10 -
                    Math.abs(distance);


               


                /* ============================
                   CLASSES
                ============================ */

                card.classList.remove(
                    "active",
                    "near",
                    "far"
                );


                if (
                    distance === 0
                ) {

                    card.classList.add(
                        "active"
                    );

                }
                else if (
                    Math.abs(distance) === 1
                ) {

                    card.classList.add(
                        "near"
                    );

                }
                else {

                    card.classList.add(
                        "far"
                    );

                }

            }
        );


        /* ====================================
           BUTTON VISIBILITY
        ==================================== */

        if (total <= 1) {

            prevBtn.style.display =
                "none";

            nextBtn.style.display =
                "none";

        }
        else {

            prevBtn.style.display =
                "flex";

            nextBtn.style.display =
                "flex";

        }

    }


    /* ========================================
       NEXT
    ======================================== */

    nextBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const products =
                getProducts();


            if (
                products.length <= 1
            ) {

                return;
            }


            activeIndex =
                (
                    activeIndex + 1
                ) %
                products.length;


            updateCarousel();

        }
    );


    /* ========================================
       PREVIOUS
    ======================================== */

    prevBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const products =
                getProducts();


            if (
                products.length <= 1
            ) {

                return;
            }


            activeIndex =
                (
                    activeIndex -
                    1 +
                    products.length
                ) %
                products.length;


            updateCarousel();

        }
    );


    /* ========================================
       SUB CATEGORY CLICK
    ======================================== */

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                selectedSubCategory =
                    tab.dataset.subcategory;


                /* ACTIVE TAB */

                tabs.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                /* PRODUCT SLIDER RESET */

                renderProducts();

            }
        );

    });


    /* ========================================
       INITIAL
    ======================================== */

    renderProducts();

}


/* ========================================
   FORMAT NAME
======================================== */

function formatName(value) {

    return value

        .replace(
            /[-_]/g,
            " "
        )

        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        );

}