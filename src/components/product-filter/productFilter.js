import "./productFilter.css";


/* ==================================================
   PRODUCT FILTER COMPONENT
================================================== */

export function createProductFilter({
    products = [],
    onFilter = () => {},
    onSort = () => {}
}) {

    /* ==================================================
       GET UNIQUE VALUES FROM CURRENT CATEGORY PRODUCTS
    ================================================== */

    const unique = values =>
        [...new Set(
            values
                .filter(value =>
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                )
                .map(value => String(value).trim())
        )];


    /* ==================================================
       BRAND
    ================================================== */

    const brands = unique(
        products.map(product => product.brand)
    ).sort((a, b) =>
        a.localeCompare(b)
    );


    /* ==================================================
       GENDER
    ================================================== */

    const genders = unique(
        products.map(product => product.gender)
    ).sort((a, b) =>
        a.localeCompare(b)
    );


    /* ==================================================
       SUB CATEGORY
    ================================================== */

    const subCategories = unique(
        products.map(product => product.subCategory)
    ).sort((a, b) =>
        a.localeCompare(b)
    );


    /* ==================================================
       SIZE
    ================================================== */

    const sizes = unique(
        products.flatMap(product => {

            if (!Array.isArray(product.sizes)) {
                return [];
            }

            return product.sizes.map(size => {

                if (
                    typeof size === "object" &&
                    size !== null
                ) {
                    return size.size;
                }

                return size;

            });

        })
    );


    /* ==================================================
       SIZE ORDER
    ================================================== */

    const sizeOrder = [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL"
    ];


    sizes.sort((a, b) => {

        const indexA =
            sizeOrder.indexOf(a.toUpperCase());

        const indexB =
            sizeOrder.indexOf(b.toUpperCase());

        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        if (indexA !== -1) {
            return -1;
        }

        if (indexB !== -1) {
            return 1;
        }

        return a.localeCompare(b);
    });


    /* ==================================================
       COLOR
    ================================================== */

    const colors = unique(
        products.flatMap(product => {

            if (!Array.isArray(product.colors)) {
                return [];
            }

            return product.colors.map(color => {

                if (
                    typeof color === "object" &&
                    color !== null
                ) {
                    return color.name;
                }

                return color;

            });

        })
    ).sort((a, b) =>
        a.localeCompare(b)
    );


    /* ==================================================
       RATINGS
    ================================================== */

    const ratings = [
        4,
        3,
        2,
        1
    ];


    /* ==================================================
       MAX PRICE
    ================================================== */

    const maxProductPrice =
        products.length
            ? Math.max(
                ...products.map(product =>
                    Number(product.price) || 0
                )
            )
            : 5000;


    /* ==================================================
       FILTER HTML
    ================================================== */

    const filterHTML = `

        <!-- ==========================================
             FILTER OVERLAY
        =========================================== -->

        <div
            class="product-filter-overlay"
            id="productFilterOverlay"
        ></div>



        <!-- ==========================================
             FILTER SIDEBAR
        =========================================== -->

        <aside
            class="product-filter"
            id="productFilter"
        >

            <!-- HEADER -->

            <div class="product-filter-header">

                <div>

                    <p class="filter-eyebrow">
                        REFINE
                    </p>

                    <h2>
                        Filters
                    </h2>

                </div>


                <button
                    type="button"
                    class="filter-close"
                    id="filterClose"
                    aria-label="Close filters"
                >
                    ×
                </button>

            </div>



            <!-- ======================================
                 PRICE
            ======================================= -->

            <div class="filter-group">

                <button
                    type="button"
                    class="filter-group-title"
                    data-filter-toggle
                >

                    <span>
                        Price
                    </span>

                    <span>
                        +
                    </span>

                </button>


                <div class="filter-content">

                    <div class="price-inputs">

                        <input
                            type="number"
                            id="minPrice"
                            placeholder="Min"
                            min="0"
                            value="0"
                        >

                        <span>—</span>

                        <input
                            type="number"
                            id="maxPrice"
                            placeholder="Max"
                            min="0"
                            value="${maxProductPrice}"
                        >

                    </div>

                </div>

            </div>



            <!-- ======================================
                 SUB CATEGORY
            ======================================= -->

            ${
                subCategories.length
                    ? `

                        <div class="filter-group">

                            <button
                                type="button"
                                class="filter-group-title"
                                data-filter-toggle
                            >

                                <span>
                                    Sub Category
                                </span>

                                <span>
                                    +
                                </span>

                            </button>


                            <div class="filter-content">

                                ${

                                    subCategories
                                        .map(subCategory => `

                                            <label
                                                class="filter-checkbox"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="subCategory"
                                                    value="${subCategory}"
                                                >

                                                <span>
                                                    ${formatText(subCategory)}
                                                </span>

                                            </label>

                                        `)
                                        .join("")

                                }

                            </div>

                        </div>

                    `
                    : ""
            }



            <!-- ======================================
                 BRAND
            ======================================= -->

            ${
                brands.length
                    ? `

                        <div class="filter-group">

                            <button
                                type="button"
                                class="filter-group-title"
                                data-filter-toggle
                            >

                                <span>
                                    Brand
                                </span>

                                <span>
                                    +
                                </span>

                            </button>


                            <div class="filter-content">

                                ${

                                    brands
                                        .map(brand => `

                                            <label
                                                class="filter-checkbox"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="brand"
                                                    value="${brand}"
                                                >

                                                <span>
                                                    ${brand}
                                                </span>

                                            </label>

                                        `)
                                        .join("")

                                }

                            </div>

                        </div>

                    `
                    : ""
            }



            <!-- ======================================
                 GENDER
            ======================================= -->

            ${
                genders.length
                    ? `

                        <div class="filter-group">

                            <button
                                type="button"
                                class="filter-group-title"
                                data-filter-toggle
                            >

                                <span>
                                    Gender
                                </span>

                                <span>
                                    +
                                </span>

                            </button>


                            <div class="filter-content">

                                ${

                                    genders
                                        .map(gender => `

                                            <label
                                                class="filter-checkbox"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="gender"
                                                    value="${gender}"
                                                >

                                                <span>
                                                    ${formatText(gender)}
                                                </span>

                                            </label>

                                        `)
                                        .join("")

                                }

                            </div>

                        </div>

                    `
                    : ""
            }



            <!-- ======================================
                 SIZE
            ======================================= -->

            ${
                sizes.length
                    ? `

                        <div class="filter-group">

                            <button
                                type="button"
                                class="filter-group-title"
                                data-filter-toggle
                            >

                                <span>
                                    Size
                                </span>

                                <span>
                                    +
                                </span>

                            </button>


                            <div class="filter-content">

                                <div class="size-options">

                                    ${

                                        sizes
                                            .map(size => `

                                                <label
                                                    class="size-option"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        name="size"
                                                        value="${size}"
                                                    >

                                                    <span>
                                                        ${size}
                                                    </span>

                                                </label>

                                            `)
                                            .join("")

                                    }

                                </div>

                            </div>

                        </div>

                    `
                    : ""
            }



            <!-- ======================================
                 COLOR
            ======================================= -->

            ${
                colors.length
                    ? `

                        <div class="filter-group">

                            <button
                                type="button"
                                class="filter-group-title"
                                data-filter-toggle
                            >

                                <span>
                                    Color
                                </span>

                                <span>
                                    +
                                </span>

                            </button>


                            <div class="filter-content">

                                ${

                                    colors
                                        .map(color => `

                                            <label
                                                class="filter-checkbox"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="color"
                                                    value="${color}"
                                                >

                                                <span>
                                                    ${formatText(color)}
                                                </span>

                                            </label>

                                        `)
                                        .join("")

                                }

                            </div>

                        </div>

                    `
                    : ""
            }



            <!-- ======================================
                 RATING
            ======================================= -->

            <div class="filter-group">

                <button
                    type="button"
                    class="filter-group-title"
                    data-filter-toggle
                >

                    <span>
                        Rating
                    </span>

                    <span>
                        +
                    </span>

                </button>


                <div class="filter-content">

                    ${
                        ratings
                            .map(rating => `

                                <label
                                    class="filter-checkbox rating-option"
                                >

                                    <input
                                        type="checkbox"
                                        name="rating"
                                        value="${rating}"
                                    >

                                    <span>
                                        ${"★".repeat(rating)}
                                        ${"☆".repeat(5 - rating)}
                                        & above
                                    </span>

                                </label>

                            `)
                            .join("")
                    }

                </div>

            </div>



            <!-- ======================================
                 ACTIONS
            ======================================= -->

            <div class="filter-actions">

                <button
                    type="button"
                    class="filter-reset"
                    id="filterReset"
                >
                    Clear All
                </button>


                <button
                    type="button"
                    class="filter-apply"
                    id="filterApply"
                >
                    Apply Filters
                </button>

            </div>

        </aside>



        <!-- ==========================================
             TOOLBAR
        =========================================== -->

        <div class="product-filter-toolbar">

            <button
                type="button"
                class="filter-open-btn"
                id="filterOpen"
            >

                <span>
                    ☰
                </span>

                Filters

            </button>


            <span
                class="filter-result-count"
                id="filterResultCount"
            >
                ${products.length} Products
            </span>


            <!-- SORT -->

            <select
                class="product-sort"
                id="productSort"
            >

                <option value="default">
                    Sort By
                </option>

                <option value="price-low">
                    Price: Low to High
                </option>

                <option value="price-high">
                    Price: High to Low
                </option>

                <option value="name-az">
                    Name: A to Z
                </option>

                <option value="name-za">
                    Name: Z to A
                </option>

                <option value="rating-high">
                    Rating: High to Low
                </option>

                <option value="rating-low">
                    Rating: Low to High
                </option>

                <option value="discount-high">
                    Discount: High to Low
                </option>

            </select>

        </div>

    `;


    /* ==================================================
       RETURN COMPONENT
    ================================================== */

    return {

        html: filterHTML,


        /* ==============================================
           INIT
        ============================================== */

        init() {

            const filter =
                document.querySelector(
                    "#productFilter"
                );


            const overlay =
                document.querySelector(
                    "#productFilterOverlay"
                );


            const openButton =
                document.querySelector(
                    "#filterOpen"
                );


            const closeButton =
                document.querySelector(
                    "#filterClose"
                );


            const resetButton =
                document.querySelector(
                    "#filterReset"
                );


            const applyButton =
                document.querySelector(
                    "#filterApply"
                );


            const sortSelect =
                document.querySelector(
                    "#productSort"
                );


            /* ==========================================
               OPEN
            =========================================== */

            const openFilter = () => {

                filter?.classList.add(
                    "filter-active"
                );

                overlay?.classList.add(
                    "overlay-active"
                );

                document.body.classList.add(
                    "filter-open"
                );

            };


            /* ==========================================
               CLOSE
            =========================================== */

            const closeFilter = () => {

                filter?.classList.remove(
                    "filter-active"
                );

                overlay?.classList.remove(
                    "overlay-active"
                );

                document.body.classList.remove(
                    "filter-open"
                );

            };


            openButton?.addEventListener(
                "click",
                openFilter
            );


            closeButton?.addEventListener(
                "click",
                closeFilter
            );


            overlay?.addEventListener(
                "click",
                closeFilter
            );


            /* ==========================================
               ACCORDION
            =========================================== */

            document
                .querySelectorAll(
                    "[data-filter-toggle]"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const content =
                                button.nextElementSibling;


                            const icon =
                                button.querySelector(
                                    "span:last-child"
                                );


                            content?.classList.toggle(
                                "filter-content-open"
                            );


                            button.classList.toggle(
                                "filter-title-active"
                            );


                            if (
                                content?.classList.contains(
                                    "filter-content-open"
                                )
                            ) {

                                if (icon) {
                                    icon.textContent = "−";
                                }

                            } else {

                                if (icon) {
                                    icon.textContent = "+";
                                }

                            }

                        }
                    );

                });


            /* ==========================================
               APPLY FILTER
            =========================================== */

            applyButton?.addEventListener(
                "click",
                () => {

                    const minPrice =
                        Number(
                            document.querySelector(
                                "#minPrice"
                            )?.value
                        ) || 0;


                    const maxPrice =
                        Number(
                            document.querySelector(
                                "#maxPrice"
                            )?.value
                        ) || maxProductPrice;


                    const selectedSubCategories =
                        getCheckedValues(
                            "subCategory"
                        );


                    const selectedBrands =
                        getCheckedValues(
                            "brand"
                        );


                    const selectedGenders =
                        getCheckedValues(
                            "gender"
                        );


                    const selectedSizes =
                        getCheckedValues(
                            "size"
                        );


                    const selectedColors =
                        getCheckedValues(
                            "color"
                        );


                    const selectedRatings =
                        getCheckedValues(
                            "rating"
                        ).map(Number);


                    const filteredProducts =
                        products.filter(product => {

                            /* PRICE */

                            const price =
                                Number(
                                    product.price
                                ) || 0;


                            if (
                                price < minPrice ||
                                price > maxPrice
                            ) {

                                return false;

                            }


                            /* SUB CATEGORY */

                            if (
                                selectedSubCategories.length &&
                                !selectedSubCategories.includes(
                                    String(
                                        product.subCategory
                                    )
                                )
                            ) {

                                return false;

                            }


                            /* BRAND */

                            if (
                                selectedBrands.length &&
                                !selectedBrands.includes(
                                    product.brand
                                )
                            ) {

                                return false;

                            }


                            /* GENDER */

                            if (
                                selectedGenders.length &&
                                !selectedGenders.includes(
                                    product.gender
                                )
                            ) {

                                return false;

                            }


                            /* SIZE */

                            if (
                                selectedSizes.length
                            ) {

                                const productSizes =
                                    Array.isArray(
                                        product.sizes
                                    )
                                        ? product.sizes.map(
                                            size =>
                                                typeof size === "object" &&
                                                size !== null
                                                    ? String(size.size)
                                                    : String(size)
                                        )
                                        : [];


                                const hasSize =
                                    selectedSizes.some(
                                        size =>
                                            productSizes.includes(
                                                String(size)
                                            )
                                    );


                                if (!hasSize) {
                                    return false;
                                }

                            }


                            /* COLOR */

                            if (
                                selectedColors.length
                            ) {

                                const productColors =
                                    Array.isArray(
                                        product.colors
                                    )
                                        ? product.colors.map(
                                            color =>
                                                typeof color === "object" &&
                                                color !== null
                                                    ? String(color.name)
                                                    : String(color)
                                        )
                                        : [];


                                const hasColor =
                                    selectedColors.some(
                                        color =>
                                            productColors.includes(
                                                String(color)
                                            )
                                    );


                                if (!hasColor) {
                                    return false;
                                }

                            }


                            /* RATING */

                            if (
                                selectedRatings.length
                            ) {

                                const minimumRating =
                                    Math.min(
                                        ...selectedRatings
                                    );


                                if (
                                    Number(
                                        product.rating
                                    ) < minimumRating
                                ) {

                                    return false;

                                }

                            }


                            return true;

                        });


                    onFilter(
                        filteredProducts
                    );


                    updateCount(
                        filteredProducts.length
                    );


                    closeFilter();

                }
            );


            /* ==========================================
               RESET
            =========================================== */

            resetButton?.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#productFilter input[type='checkbox']"
                        )
                        .forEach(input => {

                            input.checked = false;

                        });


                    const minInput =
                        document.querySelector(
                            "#minPrice"
                        );


                    const maxInput =
                        document.querySelector(
                            "#maxPrice"
                        );


                    if (minInput) {
                        minInput.value = 0;
                    }


                    if (maxInput) {
                        maxInput.value =
                            maxProductPrice;
                    }


                    onFilter(
                        products
                    );


                    updateCount(
                        products.length
                    );


                    if (sortSelect) {
                        sortSelect.value = "default";
                    }


                    onSort(
                        products
                    );

                }
            );


            /* ==========================================
               SORT
            =========================================== */

            sortSelect?.addEventListener(
                "change",
                () => {

                    const sortedProducts =
                        sortProducts(
                            products,
                            sortSelect.value
                        );


                    onSort(
                        sortedProducts
                    );

                }
            );

        }

    };


    /* ==================================================
       GET CHECKED VALUES
    ================================================== */

    function getCheckedValues(name) {

        return [
            ...document.querySelectorAll(
                `#productFilter input[name="${name}"]:checked`
            )
        ].map(
            input => input.value
        );

    }


    /* ==================================================
       UPDATE COUNT
    ================================================== */

    function updateCount(count) {

        const countElement =
            document.querySelector(
                "#filterResultCount"
            );


        if (countElement) {

            countElement.textContent =
                `${count} Products`;

        }

    }

}


/* ==================================================
   SORT PRODUCTS
================================================== */

function sortProducts(
    products,
    sortType
) {

    const sorted = [
        ...products
    ];


    switch (sortType) {

        case "price-low":

            sorted.sort(
                (a, b) =>
                    Number(a.price || 0) -
                    Number(b.price || 0)
            );

            break;


        case "price-high":

            sorted.sort(
                (a, b) =>
                    Number(b.price || 0) -
                    Number(a.price || 0)
            );

            break;


        case "name-az":

            sorted.sort(
                (a, b) =>
                    String(a.name || "")
                        .localeCompare(
                            String(b.name || "")
                        )
            );

            break;


        case "name-za":

            sorted.sort(
                (a, b) =>
                    String(b.name || "")
                        .localeCompare(
                            String(a.name || "")
                        )
            );

            break;


        case "rating-high":

            sorted.sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            );

            break;


        case "rating-low":

            sorted.sort(
                (a, b) =>
                    Number(a.rating || 0) -
                    Number(b.rating || 0)
            );

            break;


        case "discount-high":

            sorted.sort(
                (a, b) =>
                    getDiscountNumber(b.discount) -
                    getDiscountNumber(a.discount)
            );

            break;


        default:

            break;

    }


    return sorted;

}


/* ==================================================
   DISCOUNT NUMBER
================================================== */

function getDiscountNumber(
    discount
) {

    if (!discount) {
        return 0;
    }


    const number =
        String(discount)
            .replace(/[^\d.]/g, "");


    return Number(number) || 0;

}


/* ==================================================
   FORMAT TEXT
================================================== */

function formatText(
    value
) {

    if (!value) {
        return "";
    }


    return String(value)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );

}