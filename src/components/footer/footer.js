import "./footer.css";


export function loadFooter() {

    const app =
        document.getElementById("app");

    if (!app) return;


    const footer =
        document.createElement("footer");

    footer.className =
        "site-footer";


    footer.innerHTML = `

        <div class="footer-container">

            <div class="footer-column">

                <h3>
                    ASTRIKE
                </h3>

                <p>
                    Performance wear made
                    for your everyday movement.
                </p>

            </div>


            <div class="footer-column">

                <h4>
                    SHOP
                </h4>

                <a href="/category/men">
                    Men
                </a>

                <a href="/category/women">
                    Women
                </a>

                <a href="/collection/best-sellers">
                    Best Sellers
                </a>

                <a href="/collection/new-arrivals">
                    New Arrivals
                </a>

            </div>


            <div class="footer-column">

                <h4>
                    HELP
                </h4>

                <a href="#">
                    Contact Us
                </a>

                <a href="#">
                    Shipping
                </a>

                <a href="#">
                    Returns
                </a>

                <a href="#">
                    FAQ
                </a>

            </div>


            <div class="footer-column">

                <h4>
                    FOLLOW US
                </h4>

                <a href="#">
                    Instagram
                </a>

                <a href="#">
                    Facebook
                </a>

                <a href="#">
                    YouTube
                </a>

            </div>

        </div>


        <div class="footer-bottom">

            <p>
                © 2026 ASTRIKE SPORTS.
                All Rights Reserved.
            </p>

        </div>

    `;


    app.appendChild(
        footer
    );

}