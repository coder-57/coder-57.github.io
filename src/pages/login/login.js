/* =========================================================
   ASTRIKE SPORTS
   LOGIN PAGE
========================================================= */

import "./login.css";

import {
    loginUser
} from "../../utils/auth.js";


/* =========================================================
   CURRENT USER STORAGE KEY
========================================================= */

const CURRENT_USER_KEY = "astrike_current_user";


/* =========================================================
   LOAD LOGIN PAGE
========================================================= */

export function loadLoginPage() {

    const container =
        document.getElementById("login");

    if (!container) {
        console.error("Login container not found.");
        return;
    }


    /* =====================================================
       LOGIN HTML
    ===================================================== */

    container.innerHTML = `

        <section class="login-page">

            <div class="login-container">

                <div class="login-header">

                    <h1>Welcome Back</h1>

                    <p>
                        Login to your ASTRIKE SPORTS account
                    </p>

                </div>


                <form
                    id="loginForm"
                    class="login-form"
                >

                    <div class="form-group">

                        <label for="loginEmail">
                            Email
                        </label>

                        <input
                            type="email"
                            id="loginEmail"
                            name="email"
                            placeholder="Enter your email"
                            autocomplete="email"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="loginPassword">
                            Password
                        </label>

                        <input
                            type="password"
                            id="loginPassword"
                            name="password"
                            placeholder="Enter your password"
                            autocomplete="current-password"
                            required
                        >

                    </div>


                    <p
                        id="loginMessage"
                        class="login-message"
                    ></p>


                    <button
                        type="submit"
                        class="login-btn"
                    >
                        Login
                    </button>


                    <div class="login-register">

                        <span>
                            Don't have an account?
                        </span>

                        <a href="/register">
                            Create Account
                        </a>

                    </div>

                </form>

            </div>

        </section>

    `;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const message =
        document.getElementById("loginMessage");


    if (!loginForm) {
        console.error("Login form not found.");
        return;
    }


    /* =====================================================
       LOGIN SUBMIT
    ===================================================== */

    loginForm.addEventListener(
        "submit",
        handleLogin
    );


    /* =====================================================
       LOGIN HANDLER
    ===================================================== */

    function handleLogin(event) {

        event.preventDefault();


        /* =================================================
           GET FORM VALUES
        ================================================= */

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        /* =================================================
           CALL LOGIN FUNCTION
        ================================================= */

        const result =
            loginUser({
                email,
                password
            });


        console.log(
            "LOGIN RESULT:",
            result
        );


        /* =================================================
           LOGIN FAILED
        ================================================= */

        if (
            !result ||
            !result.success ||
            !result.user
        ) {

            message.textContent =
                result?.message ||
                "Invalid email or password.";

            message.className =
                "login-message error";

            return;
        }


        /* =================================================
           USER
        ================================================= */

        const user = result.user;


        console.log(
            "LOGGED IN USER:",
            user
        );


        /* =================================================
           SAVE CURRENT USER
           
           IMPORTANT:
           Navbar isi storage ko read karta hai.
        ================================================= */

        try {

            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(user)
            );

        } catch (error) {

            console.error(
                "CURRENT USER SAVE ERROR:",
                error
            );

            message.textContent =
                "Login failed. Unable to save login session.";

            message.className =
                "login-message error";

            return;
        }


        /* =================================================
           VERIFY STORAGE
        ================================================= */

        const savedUser =
            localStorage.getItem(
                CURRENT_USER_KEY
            );


        console.log(
            "ASTRIKE CURRENT USER STORAGE:",
            savedUser
        );


        /* =================================================
           AUTH UPDATE EVENT
           
           Navbar ko immediately batayega
           ki user login ho gaya.
        ================================================= */

        window.dispatchEvent(
            new CustomEvent("authUpdated")
        );


        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        message.textContent =
            `Welcome ${user.name || "User"}! Login successful.`;

        message.className =
            "login-message success";


        /* =================================================
           REDIRECT
        ================================================= */

        setTimeout(() => {

            if (user.role === "admin") {

                window.location.href =
                    "/admin";

            } else {

                window.location.href =
                    "/";

            }

        }, 500);
    }
}