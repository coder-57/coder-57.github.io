/* =========================================================
   ASTRIKE SPORTS
   LOCAL STORAGE AUTHENTICATION
   USER PROFILE + ADDRESS + IMAGE
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const USERS_KEY =
    "astrike_users";

const CURRENT_USER_KEY =
    "astrike_current_user";


/* =========================================================
   DEFAULT USER PROFILE
========================================================= */

function getDefaultProfile() {

    return {

        phone: "",

        profileImage: "",

        address: {

            house: "",

            street: "",

            city: "",

            state: "",

            pincode: ""

        }

    };

}


/* =========================================================
   NORMALIZE USER
   OLD USERS WILL ALSO GET NEW FIELDS
========================================================= */

function normalizeUser(user) {

    if (
        !user ||
        typeof user !== "object"
    ) {

        return null;

    }


    const defaultProfile =
        getDefaultProfile();


    const oldAddress =
        user.address &&
        typeof user.address === "object"
            ? user.address
            : {};


    return {

        ...user,

        phone:
            String(
                user.phone ||
                user.mobile ||
                user.phoneNumber ||
                ""
            ).trim(),

        profileImage:
            String(
                user.profileImage ||
                user.image ||
                ""
            ).trim(),

        address: {

            house:
                String(
                    oldAddress.house ||
                    oldAddress.houseNumber ||
                    ""
                ).trim(),

            street:
                String(
                    oldAddress.street ||
                    oldAddress.area ||
                    ""
                ).trim(),

            city:
                String(
                    oldAddress.city ||
                    ""
                ).trim(),

            state:
                String(
                    oldAddress.state ||
                    ""
                ).trim(),

            pincode:
                String(
                    oldAddress.pincode ||
                    oldAddress.zipcode ||
                    oldAddress.zip ||
                    ""
                ).trim()

        }

    };

}


/* =========================================================
   GET ALL USERS
========================================================= */

export function getUsers() {

    try {

        const data =
            localStorage.getItem(
                USERS_KEY
            );


        if (!data) {

            return [];

        }


        const users =
            JSON.parse(data);


        if (!Array.isArray(users)) {

            return [];

        }


        return users.map(
            normalizeUser
        );

    } catch (error) {

        console.error(
            "ASTRIKE USERS READ ERROR:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users) {

    try {

        localStorage.setItem(

            USERS_KEY,

            JSON.stringify(users)

        );


        return true;

    } catch (error) {

        console.error(
            "ASTRIKE USERS SAVE ERROR:",
            error
        );


        return false;

    }

}


/* =========================================================
   DEFAULT ADMINS
========================================================= */

const DEFAULT_ADMINS = [

    {

        id:
            "admin-001",

        name:
            "ASTRIKE Admin",

        email:
            "admin@astrike.com",

        password:
            "admin123",

        role:
            "admin",

        phone:
            "",

        profileImage:
            "",

        address: {

            house: "",

            street: "",

            city: "",

            state: "",

            pincode: ""

        },

        createdAt:
            new Date().toISOString()

    },


    {

        id:
            "admin-002",

        name:
            "Shivam",

        email:
            "shivamkumar@gmail.com",

        password:
            "shivam@123",

        role:
            "admin",

        phone:
            "",

        profileImage:
            "",

        address: {

            house: "",

            street: "",

            city: "",

            state: "",

            pincode: ""

        },

        createdAt:
            new Date().toISOString()

    }

];


/* =========================================================
   CREATE DEFAULT ADMINS
========================================================= */

export function createDefaultAdmin() {

    const users =
        getUsers();


    let changed =
        false;


    DEFAULT_ADMINS.forEach(
        defaultAdmin => {

            const existingAdmin =
                users.find(
                    user =>
                        user.id ===
                        defaultAdmin.id
                );


            /* =============================================
               ADMIN DOES NOT EXIST
            ============================================= */

            if (!existingAdmin) {

                users.push({

                    ...defaultAdmin,

                    address: {
                        ...defaultAdmin.address
                    }

                });


                changed =
                    true;


                return;

            }


            /* =============================================
               FIX ADMIN ROLE
            ============================================= */

            if (
                existingAdmin.role !==
                "admin"
            ) {

                existingAdmin.role =
                    "admin";

                changed =
                    true;

            }


            /* =============================================
               ADD PROFILE FIELDS TO OLD ADMIN
            ============================================= */

            const normalized =
                normalizeUser(
                    existingAdmin
                );


            Object.assign(
                existingAdmin,
                normalized
            );


            changed =
                true;

        }
    );


    if (changed) {

        saveUsers(
            users
        );


        console.log(
            "ASTRIKE default admins initialized."
        );

    }

}


/* =========================================================
   REGISTER CUSTOMER
========================================================= */

export function registerCustomer({

    name,

    email,

    password

}) {

    const users =
        getUsers();


    /* =====================================================
       CLEAN DATA
    ===================================================== */

    name =
        String(
            name || ""
        ).trim();


    email =
        String(
            email || ""
        )
            .trim()
            .toLowerCase();


    password =
        String(
            password || ""
        );


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        return {

            success: false,

            message:
                "Please enter your name."

        };

    }


    if (!email) {

        return {

            success: false,

            message:
                "Please enter your email."

        };

    }


    if (!password) {

        return {

            success: false,

            message:
                "Please enter your password."

        };

    }


    if (
        password.length < 6
    ) {

        return {

            success: false,

            message:
                "Password must be at least 6 characters."

        };

    }


    /* =====================================================
       CHECK EMAIL
    ===================================================== */

    const existingUser =
        users.find(

            user =>

                String(
                    user.email || ""
                )
                    .trim()
                    .toLowerCase() ===
                email

        );


    if (existingUser) {

        return {

            success: false,

            message:
                "Email already registered."

        };

    }


    /* =====================================================
       CREATE CUSTOMER
    ===================================================== */

    const customer = {

        id:
            "customer-" +
            Date.now(),

        name,

        email,

        password,

        role:
            "customer",

        phone:
            "",

        profileImage:
            "",

        address: {

            house: "",

            street: "",

            city: "",

            state: "",

            pincode: ""

        },

        createdAt:
            new Date().toISOString()

    };


    /* =====================================================
       SAVE
    ===================================================== */

    users.push(
        customer
    );


    const saved =
        saveUsers(
            users
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to save account."

        };

    }


    /* =====================================================
       RETURN SAFE USER
    ===================================================== */

    return {

        success: true,

        message:
            "Registration successful.",

        user: {

            id:
                customer.id,

            name:
                customer.name,

            email:
                customer.email,

            role:
                customer.role,

            phone:
                customer.phone,

            profileImage:
                customer.profileImage,

            address: {
                ...customer.address
            }

        }

    };

}


/* =========================================================
   CREATE CURRENT USER
========================================================= */

function createCurrentUser(
    user
) {

    const normalizedUser =
        normalizeUser(
            user
        );


    if (!normalizedUser) {

        return null;

    }


    return {

        id:
            normalizedUser.id,

        name:
            normalizedUser.name,

        email:
            normalizedUser.email,

        role:
            normalizedUser.role,

        phone:
            normalizedUser.phone,

        profileImage:
            normalizedUser.profileImage,

        address: {

            ...normalizedUser.address

        }

    };

}


/* =========================================================
   SAVE CURRENT USER
========================================================= */

function saveCurrentUser(
    user
) {

    try {

        localStorage.setItem(

            CURRENT_USER_KEY,

            JSON.stringify(
                user
            )

        );


        return true;

    } catch (error) {

        console.error(

            "ASTRIKE CURRENT USER SAVE ERROR:",

            error

        );


        return false;

    }

}


/* =========================================================
   LOGIN USER
========================================================= */

export function loginUser({

    email,

    password

}) {

    const users =
        getUsers();


    /* =====================================================
       CLEAN DATA
    ===================================================== */

    email =
        String(
            email || ""
        )
            .trim()
            .toLowerCase();


    password =
        String(
            password || ""
        );


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!email) {

        return {

            success: false,

            message:
                "Please enter your email."

        };

    }


    if (!password) {

        return {

            success: false,

            message:
                "Please enter your password."

        };

    }


    /* =====================================================
       FIND USER
    ===================================================== */

    const user =
        users.find(
            item => {

                const savedEmail =
                    String(
                        item.email || ""
                    )
                        .trim()
                        .toLowerCase();


                const savedPassword =
                    String(
                        item.password || ""
                    );


                return (

                    savedEmail ===
                    email &&

                    savedPassword ===
                    password

                );

            }
        );


    /* =====================================================
       INVALID LOGIN
    ===================================================== */

    if (!user) {

        console.warn(

            "ASTRIKE LOGIN FAILED:",

            email

        );


        return {

            success: false,

            message:
                "Invalid email or password."

        };

    }


    /* =====================================================
       CREATE CURRENT USER
    ===================================================== */

    const currentUser =
        createCurrentUser(
            user
        );


    if (!currentUser) {

        return {

            success: false,

            message:
                "Unable to create current user."

        };

    }


    /* =====================================================
       SAVE CURRENT USER
    ===================================================== */

    const saved =
        saveCurrentUser(
            currentUser
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to complete login."

        };

    }


    /* =====================================================
       VERIFY CURRENT USER
    ===================================================== */

    const savedCurrentUser =
        localStorage.getItem(
            CURRENT_USER_KEY
        );


    console.log(
        "ASTRIKE LOGIN SUCCESS"
    );


    console.log(
        "ASTRIKE CURRENT USER:",
        savedCurrentUser
    );


    /* =====================================================
       AUTH EVENT
    ===================================================== */

    window.dispatchEvent(

        new CustomEvent(

            "authUpdated",

            {
                detail:
                    currentUser
            }

        )

    );


    /* =====================================================
       RETURN
    ===================================================== */

    return {

        success: true,

        message:
            "Login successful.",

        user:
            currentUser

    };

}


/* =========================================================
   GET CURRENT USER
========================================================= */

export function getCurrentUser() {

    try {

        const data =
            localStorage.getItem(
                CURRENT_USER_KEY
            );


        if (!data) {

            return null;

        }


        const user =
            JSON.parse(
                data
            );


        if (

            !user ||

            typeof user !==
                "object" ||

            !user.id

        ) {

            localStorage.removeItem(
                CURRENT_USER_KEY
            );


            return null;

        }


        /* =================================================
           NORMALIZE CURRENT USER
        ================================================= */

        const normalizedUser =
            normalizeUser(
                user
            );


        /* =================================================
           KEEP CURRENT USER UPDATED
        ================================================= */

        if (
            JSON.stringify(
                normalizedUser
            ) !==
            JSON.stringify(
                user
            )
        ) {

            saveCurrentUser(
                createCurrentUser(
                    normalizedUser
                )
            );

        }


        return normalizedUser;

    } catch (error) {

        console.error(

            "ASTRIKE CURRENT USER READ ERROR:",

            error

        );


        localStorage.removeItem(
            CURRENT_USER_KEY
        );


        return null;

    }

}


/* =========================================================
   UPDATE CURRENT USER PROFILE
========================================================= */

export function updateCurrentUserProfile({

    name,

    phone,

    profileImage,

    address

}) {

    const currentUser =
        getCurrentUser();


    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    if (!currentUser) {

        return {

            success: false,

            message:
                "Please login first."

        };

    }


    const users =
        getUsers();


    /* =====================================================
       FIND CURRENT USER
    ===================================================== */

    const userIndex =
        users.findIndex(

            user =>
                user.id ===
                currentUser.id

        );


    if (
        userIndex === -1
    ) {

        return {

            success: false,

            message:
                "User account not found."

        };

    }


    /* =====================================================
       OLD USER
    ===================================================== */

    const user =
        normalizeUser(
            users[userIndex]
        );


    /* =====================================================
       CLEAN NAME
    ===================================================== */

    if (
        name !== undefined
    ) {

        user.name =
            String(
                name || ""
            ).trim();

    }


    /* =====================================================
       PHONE
    ===================================================== */

    if (
        phone !== undefined
    ) {

        user.phone =
            String(
                phone || ""
            ).trim();

    }


    /* =====================================================
       PROFILE IMAGE
    ===================================================== */

    if (
        profileImage !== undefined
    ) {

        user.profileImage =
            String(
                profileImage || ""
            );

    }


    /* =====================================================
       ADDRESS
    ===================================================== */

    if (
        address &&
        typeof address === "object"
    ) {

        user.address = {

            ...user.address,

            house:
                String(
                    address.house ??
                    user.address.house ??
                    ""
                ).trim(),

            street:
                String(
                    address.street ??
                    user.address.street ??
                    ""
                ).trim(),

            city:
                String(
                    address.city ??
                    user.address.city ??
                    ""
                ).trim(),

            state:
                String(
                    address.state ??
                    user.address.state ??
                    ""
                ).trim(),

            pincode:
                String(
                    address.pincode ??
                    user.address.pincode ??
                    ""
                ).trim()

        };

    }


    /* =====================================================
       SAVE USER
    ===================================================== */

    users[userIndex] =
        user;


    const saved =
        saveUsers(
            users
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Unable to save profile."

        };

    }


    /* =====================================================
       UPDATE CURRENT USER
    ===================================================== */

    const updatedCurrentUser =
        createCurrentUser(
            user
        );


    const currentSaved =
        saveCurrentUser(
            updatedCurrentUser
        );


    if (!currentSaved) {

        return {

            success: false,

            message:
                "Profile saved but current session could not be updated."

        };

    }


    /* =====================================================
       AUTH EVENT
    ===================================================== */

    window.dispatchEvent(

        new CustomEvent(

            "authUpdated",

            {
                detail:
                    updatedCurrentUser
            }

        )

    );


    /* =====================================================
       RETURN
    ===================================================== */

    return {

        success: true,

        message:
            "Profile updated successfully.",

        user:
            updatedCurrentUser

    };

}


/* =========================================================
   CHECK LOGIN
========================================================= */

export function isLoggedIn() {

    return (

        getCurrentUser() !==
        null

    );

}


/* =========================================================
   CHECK ADMIN
========================================================= */

export function isAdmin() {

    const user =
        getCurrentUser();


    return (

        user !== null &&

        user.role ===
            "admin"

    );

}


/* =========================================================
   CHECK CUSTOMER
========================================================= */

export function isCustomer() {

    const user =
        getCurrentUser();


    return (

        user !== null &&

        user.role ===
            "customer"

    );

}


/* =========================================================
   LOGOUT
========================================================= */

export function logoutUser() {

    localStorage.removeItem(

        CURRENT_USER_KEY

    );


    window.dispatchEvent(

        new CustomEvent(
            "authUpdated"
        )

    );


    console.log(
        "ASTRIKE USER LOGGED OUT"
    );

}


/* =========================================================
   GET USER BY ID
========================================================= */

export function getUserById(
    id
) {

    const users =
        getUsers();


    return (

        users.find(

            user =>
                user.id ===
                id

        ) || null

    );

}


/* =========================================================
   INITIALIZE AUTH
========================================================= */

createDefaultAdmin();


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "ASTRIKE AUTH INITIALIZED"
);