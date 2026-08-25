/* =========================================================
   ASTRIKE SPORTS
   REGISTER PAGE
   NAME + EMAIL + MOBILE + PROFILE IMAGE + PASSWORD
========================================================= */

import "./register.css";

import {
    registerCustomer
} from "../../utils/auth.js";


/* =========================================================
   LOAD REGISTER PAGE
========================================================= */

export function loadRegisterPage() {

    const container =
        document.getElementById("register");


    if (!container) {

        console.error(
            "Register container not found"
        );

        return;
    }


    /* =====================================================
       REGISTER HTML
    ===================================================== */

    container.innerHTML = `

        <section class="register-page">

            <div class="register-container">


                <!-- =========================================
                     HEADER
                ========================================== -->

                <div class="register-header">

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join ASTRIKE SPORTS
                    </p>

                </div>


                <!-- =========================================
                     FORM
                ========================================== -->

                <form
                    id="registerForm"
                    class="register-form"
                >


                    <!-- =====================================
                         PROFILE IMAGE
                    ====================================== -->

                    <div class="register-image-section">

                        <div
                            id="registerImagePreview"
                            class="register-image-preview"
                        >

                            <span
                                class="material-symbols-outlined"
                            >
                                person
                            </span>

                        </div>


                        <label
                            for="registerProfileImage"
                            class="register-image-btn"
                        >

                            <span
                                class="material-symbols-outlined"
                            >
                                photo_camera
                            </span>

                            Choose Profile Photo

                        </label>


                        <input
                            type="file"
                            id="registerProfileImage"
                            accept="image/*"
                            hidden
                        />


                        <button
                            type="button"
                            id="removeRegisterImage"
                            class="remove-register-image"
                            style="display: none;"
                        >

                            Remove Photo

                        </button>


                        <small
                            class="register-image-hint"
                        >
                            JPG, PNG or WEBP
                        </small>

                    </div>


                    <!-- =====================================
                         NAME
                    ====================================== -->

                    <div class="form-group">

                        <label for="registerName">
                            Full Name
                        </label>

                        <input
                            type="text"
                            id="registerName"
                            placeholder="Enter your name"
                            autocomplete="name"
                            required
                        >

                    </div>


                    <!-- =====================================
                         EMAIL
                    ====================================== -->

                    <div class="form-group">

                        <label for="registerEmail">
                            Email
                        </label>

                        <input
                            type="email"
                            id="registerEmail"
                            placeholder="Enter your email"
                            autocomplete="email"
                            required
                        >

                    </div>


                    <!-- =====================================
                         MOBILE NUMBER
                    ====================================== -->

                    <div class="form-group">

                        <label for="registerPhone">
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            id="registerPhone"
                            placeholder="Enter 10 digit mobile number"
                            autocomplete="tel"
                            inputmode="numeric"
                            maxlength="10"
                            required
                        >

                    </div>


                    <!-- =====================================
                         PASSWORD
                    ====================================== -->

                    <div class="form-group">

                        <label for="registerPassword">
                            Password
                        </label>

                        <input
                            type="password"
                            id="registerPassword"
                            placeholder="Create password"
                            autocomplete="new-password"
                            minlength="6"
                            required
                        >

                    </div>


                    <!-- =====================================
                         CONFIRM PASSWORD
                    ====================================== -->

                    <div class="form-group">

                        <label for="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            autocomplete="new-password"
                            minlength="6"
                            required
                        >

                    </div>


                    <!-- =====================================
                         MESSAGE
                    ====================================== -->

                    <p
                        id="registerMessage"
                        class="register-message"
                    ></p>


                    <!-- =====================================
                         REGISTER BUTTON
                    ====================================== -->

                    <button
                        type="submit"
                        class="register-btn"
                    >

                        Create Account

                    </button>


                    <!-- =====================================
                         LOGIN
                    ====================================== -->

                    <div class="register-login">

                        <span>
                            Already have an account?
                        </span>

                        <a href="/login">
                            Login
                        </a>

                    </div>

                </form>

            </div>

        </section>

    `;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form =
        document.getElementById(
            "registerForm"
        );


    const message =
        document.getElementById(
            "registerMessage"
        );


    const nameInput =
        document.getElementById(
            "registerName"
        );


    const emailInput =
        document.getElementById(
            "registerEmail"
        );


    const phoneInput =
        document.getElementById(
            "registerPhone"
        );


    const passwordInput =
        document.getElementById(
            "registerPassword"
        );


    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword"
        );


    const imageInput =
        document.getElementById(
            "registerProfileImage"
        );


    const imagePreview =
        document.getElementById(
            "registerImagePreview"
        );


    const removeImageBtn =
        document.getElementById(
            "removeRegisterImage"
        );


    /* =====================================================
       PROFILE IMAGE VARIABLE
    ===================================================== */

    let profileImage = "";


    /* =====================================================
       PHONE INPUT
       ONLY NUMBERS
    ===================================================== */

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                phoneInput.value =
                    phoneInput.value
                        .replace(
                            /\D/g,
                            ""
                        )
                        .slice(
                            0,
                            10
                        );

            }
        );

    }


    /* =====================================================
       PROFILE IMAGE SELECT
    ===================================================== */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleImageSelect
        );

    }


    /* =====================================================
       IMAGE SELECT HANDLER
    ===================================================== */

    function handleImageSelect(event) {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        /* =================================================
           CHECK IMAGE TYPE
        ================================================= */

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                "Please select a valid image.",
                "error"
            );


            imageInput.value =
                "";

            return;

        }


        /* =================================================
           CHECK IMAGE SIZE
           MAX 2 MB
        ================================================= */

        const maxSize =
            2 * 1024 * 1024;


        if (
            file.size >
            maxSize
        ) {

            showMessage(
                "Profile image must be smaller than 2 MB.",
                "error"
            );


            imageInput.value =
                "";

            return;

        }


        /* =================================================
           FILE READER
        ================================================= */

        const reader =
            new FileReader();


        reader.onload =
            function () {

                profileImage =
                    reader.result;


                /* =========================================
                   PREVIEW
                ========================================== */

                if (imagePreview) {

                    imagePreview.innerHTML = `

                        <img
                            src="${profileImage}"
                            alt="Profile Preview"
                        >

                    `;

                }


                /* =========================================
                   SHOW REMOVE
                ========================================== */

                if (removeImageBtn) {

                    removeImageBtn.style.display =
                        "inline-flex";

                }


                showMessage(
                    "",
                    ""
                );

            };


        reader.onerror =
            function () {

                showMessage(
                    "Unable to read profile image.",
                    "error"
                );

            };


        reader.readAsDataURL(
            file
        );

    }


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    if (removeImageBtn) {

        removeImageBtn.addEventListener(
            "click",
            () => {

                profileImage =
                    "";

                if (imageInput) {

                    imageInput.value =
                        "";

                }


                if (imagePreview) {

                    imagePreview.innerHTML = `

                        <span
                            class="material-symbols-outlined"
                        >
                            person
                        </span>

                    `;

                }


                removeImageBtn.style.display =
                    "none";

            }
        );

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            handleRegister
        );

    }


    /* =====================================================
       REGISTER HANDLER
    ===================================================== */

    function handleRegister(event) {

        event.preventDefault();


        /* =================================================
           GET VALUES
        ================================================= */

        const name =
            nameInput
                ?.value
                .trim() || "";


        const email =
            emailInput
                ?.value
                .trim() || "";


        const phone =
            phoneInput
                ?.value
                .trim() || "";


        const password =
            passwordInput
                ?.value || "";


        const confirmPassword =
            confirmPasswordInput
                ?.value || "";


        /* =================================================
           NAME VALIDATION
        ================================================= */

        if (!name) {

            showMessage(
                "Please enter your name.",
                "error"
            );

            nameInput?.focus();

            return;

        }


        /* =================================================
           EMAIL VALIDATION
        ================================================= */

        if (!email) {

            showMessage(
                "Please enter your email.",
                "error"
            );

            emailInput?.focus();

            return;

        }


        /* =================================================
           MOBILE VALIDATION
        ================================================= */

        if (
            !/^[6-9]\d{9}$/.test(
                phone
            )
        ) {

            showMessage(
                "Please enter a valid 10 digit mobile number.",
                "error"
            );

            phoneInput?.focus();

            return;

        }


        /* =================================================
           PASSWORD VALIDATION
        ================================================= */

        if (
            password.length <
            6
        ) {

            showMessage(
                "Password must be at least 6 characters.",
                "error"
            );

            passwordInput?.focus();

            return;

        }


        /* =================================================
           PASSWORD MATCH
        ================================================= */

        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            confirmPasswordInput?.focus();

            return;

        }


        /* =================================================
           DISABLE BUTTON
        ================================================= */

        const submitBtn =
            form.querySelector(
                ".register-btn"
            );


        if (submitBtn) {

            submitBtn.disabled =
                true;

            submitBtn.textContent =
                "Creating Account...";

        }


        /* =================================================
           REGISTER CUSTOMER
        ================================================= */

        const result =
            registerCustomer({

                name,

                email,

                password,

                phone,

                profileImage

            });


        /* =================================================
           ENABLE BUTTON
        ================================================= */

        if (submitBtn) {

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Create Account";

        }


        /* =================================================
           ERROR
        ================================================= */

        if (
            !result ||
            !result.success
        ) {

            showMessage(

                result?.message ||
                "Unable to create account.",

                "error"

            );

            return;

        }


        /* =================================================
           SUCCESS
        ================================================= */

        showMessage(

            "Account created successfully!",

            "success"

        );


        /* =================================================
           REDIRECT LOGIN
        ================================================= */

        setTimeout(
            () => {

                window.location.href =
                    "/login";

            },
            900
        );

    }


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showMessage(
        text,
        type
    ) {

        if (!message) {

            return;

        }


        message.textContent =
            text;


        message.className =
            "register-message";


        if (type) {

            message.classList.add(
                type
            );

        }

    }


    /* =====================================================
       FINAL
    ===================================================== */

    console.log(
        "ASTRIKE REGISTER PAGE READY"
    );

}