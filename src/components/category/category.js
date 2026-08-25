import "./category.css";

import productData from "../../data/product.json";


/* ==================================================
   HOME PAGE — CATEGORY CARDS
================================================== */

export function loadCategories() {

    const categorySection =
        document.querySelector(".category-section");

    if (!categorySection) return;


    const categories = [
        ...new Set(
            productData.map(
                product => product.category
            )
        )
    ];


    categorySection.innerHTML = `

        <div class="category-container">

            <div class="category-heading">

                <p>
                    EXPLORE
                </p>

                <h2>
                    SHOP BY CATEGORY
                </h2>

            </div>


            <div class="category-grid">

                ${categories.map(category => {

                    const product =
                        productData.find(
                            product =>
                                product.category === category
                        );


                    const image =
                        product.colors[0].images[0];


                    return `

                        <a
                            href="/category/${category}"
                            class="category-card"
                        >

                            <div class="category-image">

                                <img
                                    src="${image}"
                                    alt="${category}"
                                >

                            </div>


                            <div class="category-content">

                                <h3>
                                    ${category}
                                </h3>

                                <span>
                                    SHOP NOW →
                                </span>

                            </div>

                        </a>

                    `;

                }).join("")}

            </div>

        </div>

    `;
}

