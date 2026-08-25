import "./home.css";
import sliderData from "../../data/slider.json";
import { loadCategories } from "../../components/category/category";
import { loadBestSellers }from "../../components/best-sellers/bestSellers";
import {loadNewArrivals} from "../../components/new-arrivals/newArrivals.js";
import {loadSummerCollection} from "../../components/summer-collection/summerCollection.js";
import {loadTrendingNow} from "../../components/trending-now/trendingNow.js";
import {loadShopByActivity} from "../../components/shop-by-activity/shopByActivity.js";




export function loadHome() {

    const app = document.querySelector("#app");

    let currentSlide = 0;

    let sliderInterval;


    app.insertAdjacentHTML("beforeend", `

        <main class="home-page">

            <section class="hero-section">

            </section>


            <section class="category-section">

                <div
                    class="category-grid"
                    id="categoryGrid"
                ></div>

            </section>

            <section id="bestSellers"></section>

            <section id="newArrivals"></section>

            <section id="summerCollection"></section>

            <section id="trendingNow"></section>

            <section id="shopByActivity"></section>

        </main>

    `);


    const hero =
        document.querySelector(".hero-section");


    function showSlide() {

        const slide =
            sliderData[currentSlide];


        hero.innerHTML = `

            <img
                src="${slide.image}"
                alt="${slide.title}"
                class="hero-image"
            >

            <div class="hero-content">

                <p class="hero-subtitle">
                    ${slide.subtitle}
                </p>

                <h1>
                    ${slide.title}
                </h1>

                <p class="hero-description">
                    ${slide.description}
                </p>

                <a
                    href="${slide.buttonLink}"
                    class="hero-btn"
                >
                    ${slide.buttonText}
                </a>

            </div>


            <button
                class="hero-prev"
                id="heroPrev"
            >
                ❮
            </button>


            <button
                class="hero-next"
                id="heroNext"
            >
                ❯
            </button>

        `;


        document
            .querySelector("#heroNext")
            .addEventListener("click", () => {

                currentSlide++;

                if (
                    currentSlide >=
                    sliderData.length
                ) {
                    currentSlide = 0;
                }

                showSlide();

            });


        document
            .querySelector("#heroPrev")
            .addEventListener("click", () => {

                currentSlide--;

                if (currentSlide < 0) {

                    currentSlide =
                        sliderData.length - 1;

                }

                showSlide();

            });

    }


    showSlide();


    sliderInterval =
        setInterval(() => {

            currentSlide++;

            if (
                currentSlide >=
                sliderData.length
            ) {
                currentSlide = 0;
            }

            showSlide();

        }, 5000);


    // CATEGORY LOAD
    loadCategories();

    // best-sellers
    loadBestSellers();

    // new arrival
    loadNewArrivals();

    //summer-collection
    loadSummerCollection();

    // trending now
    loadTrendingNow();

    loadShopByActivity();

}