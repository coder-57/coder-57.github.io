/* =========================================================
   ASTRIKE SPORTS
   PROFILE PAGE
   PROFILE + IMAGE + MOBILE + ADDRESS + EDIT
========================================================= */

import "./profile.css";

import {
    getCurrentUser,
    logoutUser,
    updateCurrentUserProfile
} from "../../utils/auth.js";


/* =========================================================
   DISPLAY VALUE
========================================================= */

function getValue(value, fallback = "Not added") {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   UPDATE IMAGE PREVIEW
========================================================= */

function updateImagePreview(element, image) {

    if (!element) {
        return;
    }


    if (image) {

        element.innerHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="Profile Preview"
            >

        `;

        return;
    }


    element.innerHTML = `

        <span class="material-symbols-outlined">
            person
        </span>

    `;

}


/* =========================================================
   PROFILE MESSAGE
========================================================= */

function showProfileMessage(text, type) {

    const message =
        document.getElementById(
            "profileEditMessage"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        "profile-edit-message";


    if (type) {

        message.classList.add(type);

    }

}


/* =========================================================
   ADDRESS MESSAGE
========================================================= */

function showAddressMessage(text, type) {

    const message =
        document.getElementById(
            "addressMessage"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        "profile-edit-message";


    if (type) {

        message.classList.add(type);

    }

}


/* =========================================================
   LOAD PROFILE PAGE
========================================================= */

export function loadProfilePage() {

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "ASTRIKE PROFILE: #app not found."
        );

        return;

    }


    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "/login";

        return;

    }


    /* =====================================================
       USER DATA
    ===================================================== */

    const name =
        getValue(
            user.name ||
            user.username ||
            user.fullName,
            "User"
        );


    const email =
        getValue(
            user.email,
            "Not available"
        );


    const phone =
        getValue(
            user.phone ||
            user.mobile ||
            user.phoneNumber,
            "Not added"
        );


    const profileImage =
        user.profileImage ||
        "";


    /* =====================================================
       ADDRESS
    ===================================================== */

    const address =
        user.address || {};


    const house =
        address.house ||
        "";


    const street =
        address.street ||
        address.area ||
        "";


    const city =
        address.city ||
        "";


    const state =
        address.state ||
        "";


    const pincode =
        address.pincode ||
        address.zip ||
        address.postalCode ||
        "";


    /* =====================================================
       FULL ADDRESS
    ===================================================== */

    const addressParts = [

        house,

        street,

        city,

        state,

        pincode

    ].filter(
        value =>
            value &&
            String(value).trim() !== ""
    );


    const fullAddress =
        addressParts.join(", ");


    /* =====================================================
       PROFILE AVATAR
    ===================================================== */

    const avatarHTML =
        profileImage

            ? `

                <img
                    src="${escapeHTML(profileImage)}"
                    alt="${escapeHTML(name)}"
                >

            `

            : `

                <span
                    class="material-symbols-outlined"
                >
                    person
                </span>

            `;


    /* =====================================================
       PROFILE HTML
    ===================================================== */

    app.insertAdjacentHTML(

        "beforeend",

        `

        <main class="profile-page">

            <section class="profile-container">


                <!-- =========================================
                     PROFILE HEADER
                ========================================== -->

                <div class="profile-header">


                    <div
                        class="profile-avatar"
                        id="profileAvatar"
                    >

                        ${avatarHTML}

                    </div>


                    <div class="profile-heading">

                        <p class="profile-small-title">
                            MY ACCOUNT
                        </p>

                        <h1>
                            ${escapeHTML(name)}
                        </h1>

                        <p>
                            ${escapeHTML(email)}
                        </p>

                    </div>


                    <button
                        id="editProfileBtn"
                        class="profile-edit-btn"
                        type="button"
                    >

                        <span class="material-symbols-outlined">
                            edit
                        </span>

                        Edit Profile

                    </button>

                </div>


                <!-- =========================================
                     PROFILE CONTENT
                ========================================== -->

                <div class="profile-content">


                    <!-- =====================================
                         PERSONAL INFORMATION
                    ====================================== -->

                    <section class="profile-card">

                        <div class="card-title-row">

                            <div>

                                <span class="material-symbols-outlined">
                                    person
                                </span>

                                <h2>
                                    Personal Information
                                </h2>

                            </div>

                        </div>


                        <div class="profile-details">


                            <div class="profile-detail">

                                <span class="detail-label">
                                    Full Name
                                </span>

                                <strong id="profileName">
                                    ${escapeHTML(name)}
                                </strong>

                            </div>


                            <div class="profile-detail">

                                <span class="detail-label">
                                    Email Address
                                </span>

                                <strong id="profileEmail">
                                    ${escapeHTML(email)}
                                </strong>

                            </div>


                            <div class="profile-detail">

                                <span class="detail-label">
                                    Phone Number
                                </span>

                                <strong id="profilePhone">
                                    ${escapeHTML(phone)}
                                </strong>

                            </div>


                        </div>

                    </section>


                    <!-- =====================================
                         ADDRESS
                    ====================================== -->

                    <section class="profile-card">

                        <div class="card-title-row">

                            <div>

                                <span class="material-symbols-outlined">
                                    location_on
                                </span>

                                <h2>
                                    Delivery Address
                                </h2>

                            </div>

                        </div>


                        <div
                            class="profile-address"
                            id="profileAddress"
                        >

                            ${
                                fullAddress

                                ? `

                                    <strong>
                                        ${escapeHTML(fullAddress)}
                                    </strong>

                                `

                                : `

                                    <span class="address-empty">
                                        No address added yet.
                                    </span>

                                `
                            }

                        </div>


                        <button
                            id="editAddressBtn"
                            class="profile-secondary-btn"
                            type="button"
                        >

                            <span class="material-symbols-outlined">
                                edit
                            </span>

                            ${
                                fullAddress
                                    ? "Edit Address"
                                    : "Add Address"
                            }

                        </button>

                    </section>


                    <!-- =====================================
                         EDIT PROFILE
                    ====================================== -->

                    <section
                        id="editProfileCard"
                        class="profile-card edit-profile-card"
                        style="display: none;"
                    >

                        <div class="card-title-row">

                            <div>

                                <span class="material-symbols-outlined">
                                    manage_accounts
                                </span>

                                <h2>
                                    Edit Profile
                                </h2>

                            </div>

                        </div>


                        <form
                            id="profileEditForm"
                            class="profile-edit-form"
                        >


                            <!-- PROFILE IMAGE -->

                            <div class="profile-edit-image">

                                <div
                                    id="editProfilePreview"
                                    class="edit-profile-preview"
                                >

                                    ${avatarHTML}

                                </div>


                                <label
                                    for="editProfileImage"
                                    class="profile-image-change-btn"
                                >

                                    <span class="material-symbols-outlined">
                                        photo_camera
                                    </span>

                                    Change Photo

                                </label>


                                <input
                                    type="file"
                                    id="editProfileImage"
                                    accept="image/*"
                                    hidden
                                />


                                <button
                                    type="button"
                                    id="removeProfileImageBtn"
                                    class="profile-remove-image-btn"
                                >

                                    Remove Photo

                                </button>

                            </div>


                            <!-- NAME -->

                            <div class="profile-form-group">

                                <label for="editProfileName">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="editProfileName"
                                    value="${escapeHTML(name)}"
                                    autocomplete="name"
                                    required
                                >

                            </div>


                            <!-- EMAIL -->

                            <div class="profile-form-group">

                                <label for="editProfileEmail">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="editProfileEmail"
                                    value="${escapeHTML(email)}"
                                    disabled
                                >

                                <small>
                                    Email cannot be changed.
                                </small>

                            </div>


                            <!-- PHONE -->

                            <div class="profile-form-group">

                                <label for="editProfilePhone">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    id="editProfilePhone"
                                    value="${
                                        phone === "Not added"
                                            ? ""
                                            : escapeHTML(phone)
                                    }"
                                    maxlength="10"
                                    inputmode="numeric"
                                    autocomplete="tel"
                                    required
                                >

                            </div>


                            <p
                                id="profileEditMessage"
                                class="profile-edit-message"
                            ></p>


                            <div class="profile-form-actions">

                                <button
                                    type="submit"
                                    class="profile-save-btn"
                                >

                                    <span class="material-symbols-outlined">
                                        save
                                    </span>

                                    Save Changes

                                </button>


                                <button
                                    type="button"
                                    id="cancelProfileEditBtn"
                                    class="profile-cancel-btn"
                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </section>


                    <!-- =====================================
                         ADDRESS FORM
                    ====================================== -->

                    <section
                        id="addressEditCard"
                        class="profile-card edit-address-card"
                        style="display: none;"
                    >

                        <div class="card-title-row">

                            <div>

                                <span class="material-symbols-outlined">
                                    home
                                </span>

                                <h2>
                                    Edit Delivery Address
                                </h2>

                            </div>

                        </div>


                        <form
                            id="addressForm"
                            class="profile-edit-form"
                        >


                            <!-- HOUSE -->

                            <div class="profile-form-group">

                                <label for="addressHouse">
                                    House / Flat / Building
                                </label>

                                <input
                                    type="text"
                                    id="addressHouse"
                                    value="${escapeHTML(house)}"
                                    placeholder="House no. / Flat no."
                                    required
                                >

                            </div>


                            <!-- STREET -->

                            <div class="profile-form-group">

                                <label for="addressArea">
                                    Area / Street
                                </label>

                                <input
                                    type="text"
                                    id="addressArea"
                                    value="${escapeHTML(street)}"
                                    placeholder="Area / Street / Locality"
                                    required
                                >

                            </div>


                            <!-- CITY -->

                            <div class="profile-form-group">

                                <label for="addressCity">
                                    City
                                </label>

                                <input
                                    type="text"
                                    id="addressCity"
                                    value="${escapeHTML(city)}"
                                    placeholder="Enter city"
                                    required
                                >

                            </div>


                            <!-- STATE -->

                            <div class="profile-form-group">

                                <label for="addressState">
                                    State
                                </label>

                                <input
                                    type="text"
                                    id="addressState"
                                    value="${escapeHTML(state)}"
                                    placeholder="Enter state"
                                    required
                                >

                            </div>


                            <!-- PINCODE -->

                            <div class="profile-form-group">

                                <label for="addressPincode">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    id="addressPincode"
                                    value="${escapeHTML(pincode)}"
                                    placeholder="6 digit pincode"
                                    maxlength="6"
                                    inputmode="numeric"
                                    required
                                >

                            </div>


                            <p
                                id="addressMessage"
                                class="profile-edit-message"
                            ></p>


                            <div class="profile-form-actions">

                                <button
                                    type="submit"
                                    class="profile-save-btn"
                                >

                                    <span class="material-symbols-outlined">
                                        save
                                    </span>

                                    Save Address

                                </button>


                                <button
                                    type="button"
                                    id="cancelAddressBtn"
                                    class="profile-cancel-btn"
                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </section>


                    <!-- =====================================
                         QUICK ACTIONS
                    ====================================== -->

                    <section class="profile-card">

                        <div class="card-title-row">

                            <div>

                                <span class="material-symbols-outlined">
                                    dashboard
                                </span>

                                <h2>
                                    My Account
                                </h2>

                            </div>

                        </div>


                        <div class="profile-actions">


                            <!-- ORDERS -->

                            <button
                                id="profileOrdersBtn"
                                class="profile-action"
                                type="button"
                            >

                                <span class="material-symbols-outlined">
                                    package_2
                                </span>

                                <span>

                                    <strong>
                                        My Orders
                                    </strong>

                                    <small>
                                        View your orders
                                    </small>

                                </span>

                                <span class="material-symbols-outlined action-arrow">
                                    chevron_right
                                </span>

                            </button>


                            <!-- HOME -->

                            <button
                                id="profileHomeBtn"
                                class="profile-action"
                                type="button"
                            >

                                <span class="material-symbols-outlined">
                                    shopping_bag
                                </span>

                                <span>

                                    <strong>
                                        Continue Shopping
                                    </strong>

                                    <small>
                                        Explore our products
                                    </small>

                                </span>

                                <span class="material-symbols-outlined action-arrow">
                                    chevron_right
                                </span>

                            </button>


                            <!-- LOGOUT -->

                            <button
                                id="profileLogoutBtn"
                                class="profile-action logout-action"
                                type="button"
                            >

                                <span class="material-symbols-outlined">
                                    logout
                                </span>

                                <span>

                                    <strong>
                                        Logout
                                    </strong>

                                    <small>
                                        Sign out from your account
                                    </small>

                                </span>

                                <span class="material-symbols-outlined action-arrow">
                                    chevron_right
                                </span>

                            </button>


                        </div>

                    </section>


                </div>

            </section>

        </main>

        `
    );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const editProfileBtn =
        document.getElementById(
            "editProfileBtn"
        );


    const editProfileCard =
        document.getElementById(
            "editProfileCard"
        );


    const profileEditForm =
        document.getElementById(
            "profileEditForm"
        );


    const cancelProfileEditBtn =
        document.getElementById(
            "cancelProfileEditBtn"
        );


    const editProfileImage =
        document.getElementById(
            "editProfileImage"
        );


    const editProfilePreview =
        document.getElementById(
            "editProfilePreview"
        );


    const removeProfileImageBtn =
        document.getElementById(
            "removeProfileImageBtn"
        );


    const editAddressBtn =
        document.getElementById(
            "editAddressBtn"
        );


    const addressEditCard =
        document.getElementById(
            "addressEditCard"
        );


    const addressForm =
        document.getElementById(
            "addressForm"
        );


    const cancelAddressBtn =
        document.getElementById(
            "cancelAddressBtn"
        );


    const ordersBtn =
        document.getElementById(
            "profileOrdersBtn"
        );


    const homeBtn =
        document.getElementById(
            "profileHomeBtn"
        );


    const logoutBtn =
        document.getElementById(
            "profileLogoutBtn"
        );


    /* =====================================================
       IMAGE VARIABLE
    ===================================================== */

    let editedProfileImage =
        profileImage;


    /* =====================================================
       OPEN PROFILE EDIT
    ===================================================== */

    if (editProfileBtn) {

        editProfileBtn.addEventListener(
            "click",
            () => {

                editProfileCard.style.display =
                    "block";

                editProfileCard.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    }


    /* =====================================================
       CANCEL PROFILE EDIT
    ===================================================== */

    if (cancelProfileEditBtn) {

        cancelProfileEditBtn.addEventListener(
            "click",
            () => {

                editProfileCard.style.display =
                    "none";

            }
        );

    }


    /* =====================================================
       IMAGE CHANGE
    ===================================================== */

    if (editProfileImage) {

        editProfileImage.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files?.[0];


                if (!file) {
                    return;
                }


                /* =========================================
                   IMAGE TYPE
                ========================================== */

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showProfileMessage(
                        "Please select a valid image.",
                        "error"
                    );

                    editProfileImage.value =
                        "";

                    return;

                }


                /* =========================================
                   MAX 2 MB
                ========================================== */

                if (
                    file.size >
                    2 * 1024 * 1024
                ) {

                    showProfileMessage(
                        "Profile image must be smaller than 2 MB.",
                        "error"
                    );

                    editProfileImage.value =
                        "";

                    return;

                }


                /* =========================================
                   READ IMAGE
                ========================================== */

                const reader =
                    new FileReader();


                reader.onload =
                    () => {

                        editedProfileImage =
                            reader.result;


                        updateImagePreview(
                            editProfilePreview,
                            editedProfileImage
                        );

                    };


                reader.onerror =
                    () => {

                        showProfileMessage(
                            "Unable to read image.",
                            "error"
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    if (removeProfileImageBtn) {

        removeProfileImageBtn.addEventListener(
            "click",
            () => {

                editedProfileImage =
                    "";


                if (editProfileImage) {

                    editProfileImage.value =
                        "";

                }


                updateImagePreview(
                    editProfilePreview,
                    ""
                );

            }
        );

    }


    /* =====================================================
       PROFILE SAVE
    ===================================================== */

    if (profileEditForm) {

        profileEditForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "editProfileName"
                    );


                const phoneInput =
                    document.getElementById(
                        "editProfilePhone"
                    );


                const newName =
                    nameInput?.value.trim() || "";


                const newPhone =
                    phoneInput?.value.trim() || "";


                /* =========================================
                   NAME VALIDATION
                ========================================== */

                if (!newName) {

                    showProfileMessage(
                        "Please enter your name.",
                        "error"
                    );

                    nameInput?.focus();

                    return;

                }


                /* =========================================
                   PHONE VALIDATION
                ========================================== */

                if (
                    !/^[6-9]\d{9}$/.test(
                        newPhone
                    )
                ) {

                    showProfileMessage(
                        "Please enter a valid 10 digit mobile number.",
                        "error"
                    );

                    phoneInput?.focus();

                    return;

                }


                /* =========================================
                   SAVE USING AUTH.JS
                ========================================== */

                const result =
                    updateCurrentUserProfile({

                        name:
                            newName,

                        phone:
                            newPhone,

                        profileImage:
                            editedProfileImage

                    });


                if (!result.success) {

                    showProfileMessage(
                        result.message,
                        "error"
                    );

                    return;

                }


                /* =========================================
                   SUCCESS
                ========================================== */

                showProfileMessage(
                    "Profile updated successfully.",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.reload();

                    },
                    600
                );

            }
        );

    }


    /* =====================================================
       OPEN ADDRESS EDIT
    ===================================================== */

    if (editAddressBtn) {

        editAddressBtn.addEventListener(
            "click",
            () => {

                addressEditCard.style.display =
                    "block";

                addressEditCard.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    }


    /* =====================================================
       CANCEL ADDRESS
    ===================================================== */

    if (cancelAddressBtn) {

        cancelAddressBtn.addEventListener(
            "click",
            () => {

                addressEditCard.style.display =
                    "none";

            }
        );

    }


    /* =====================================================
       PINCODE ONLY NUMBERS
    ===================================================== */

    const pincodeInput =
        document.getElementById(
            "addressPincode"
        );


    if (pincodeInput) {

        pincodeInput.addEventListener(
            "input",
            () => {

                pincodeInput.value =
                    pincodeInput.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

            }
        );

    }


    /* =====================================================
       PHONE ONLY NUMBERS
    ===================================================== */

    const phoneInput =
        document.getElementById(
            "editProfilePhone"
        );


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                phoneInput.value =
                    phoneInput.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );

    }


    /* =====================================================
       ADDRESS SAVE
    ===================================================== */

    if (addressForm) {

        addressForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const house =
                    document
                        .getElementById(
                            "addressHouse"
                        )
                        ?.value
                        .trim() || "";


                const street =
                    document
                        .getElementById(
                            "addressArea"
                        )
                        ?.value
                        .trim() || "";


                const city =
                    document
                        .getElementById(
                            "addressCity"
                        )
                        ?.value
                        .trim() || "";


                const state =
                    document
                        .getElementById(
                            "addressState"
                        )
                        ?.value
                        .trim() || "";


                const pincode =
                    document
                        .getElementById(
                            "addressPincode"
                        )
                        ?.value
                        .trim() || "";


                /* =========================================
                   VALIDATION
                ========================================== */

                if (
                    !house ||
                    !street ||
                    !city ||
                    !state ||
                    !pincode
                ) {

                    showAddressMessage(
                        "Please fill all address fields.",
                        "error"
                    );

                    return;

                }


                if (
                    !/^\d{6}$/.test(
                        pincode
                    )
                ) {

                    showAddressMessage(
                        "Please enter a valid 6 digit pincode.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   SAVE ADDRESS
                ========================================== */

                const result =
                    updateCurrentUserProfile({

                        address: {

                            house,

                            street,

                            city,

                            state,

                            pincode

                        }

                    });


                if (!result.success) {

                    showAddressMessage(
                        result.message,
                        "error"
                    );

                    return;

                }


                /* =========================================
                   SUCCESS
                ========================================== */

                showAddressMessage(
                    "Address saved successfully.",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.reload();

                    },
                    600
                );

            }
        );

    }


    /* =====================================================
       ORDERS
    ===================================================== */

    if (ordersBtn) {

        ordersBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/orders";

            }
        );

    }


    /* =====================================================
       HOME
    ===================================================== */

    if (homeBtn) {

        homeBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "/";

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                logoutUser();

                window.location.href =
                    "/";

            }
        );

    }


    /* =====================================================
       FINAL
    ===================================================== */

    console.log(
        "ASTRIKE PROFILE PAGE READY"
    );

}