/* =========================================================
   ASTRIKE SPORTS
   ADMIN PRODUCT STORAGE
========================================================= */

const ADMIN_PRODUCTS_KEY = "astrike_admin_products";


/* =========================================================
   GET ADMIN PRODUCTS
========================================================= */

export function getAdminProducts() {

    try {

        const data =
            localStorage.getItem(
                ADMIN_PRODUCTS_KEY
            );

        if (!data) {
            return [];
        }

        const products =
            JSON.parse(data);

        return Array.isArray(products)
            ? products
            : [];

    } catch (error) {

        console.error(
            "Unable to read admin products:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE ADMIN PRODUCTS
========================================================= */

export function saveAdminProducts(products) {

    if (!Array.isArray(products)) {
        return false;
    }

    localStorage.setItem(
        ADMIN_PRODUCTS_KEY,
        JSON.stringify(products)
    );

    return true;
}


/* =========================================================
   ADD PRODUCT
========================================================= */

export function addAdminProduct(product) {

    const products =
        getAdminProducts();

    const newProduct = {

        ...product,

        id:
            product.id ||
            "admin-product-" + Date.now(),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };

    products.push(
        newProduct
    );

    saveAdminProducts(
        products
    );

    return newProduct;
}


/* =========================================================
   UPDATE PRODUCT
========================================================= */

export function updateAdminProduct(
    productId,
    updatedData
) {

    const products =
        getAdminProducts();

    const index =
        products.findIndex(
            product =>
                String(product.id) ===
                String(productId)
        );

    if (index === -1) {

        return {
            success: false,
            message: "Product not found."
        };

    }


    products[index] = {

        ...products[index],

        ...updatedData,

        id: products[index].id,

        updatedAt:
            new Date().toISOString()

    };


    saveAdminProducts(
        products
    );


    return {

        success: true,

        product:
            products[index]

    };

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

export function deleteAdminProduct(
    productId
) {

    const products =
        getAdminProducts();

    const filtered =
        products.filter(
            product =>
                String(product.id) !==
                String(productId)
        );


    if (
        filtered.length ===
        products.length
    ) {

        return {

            success: false,

            message:
                "Product not found."

        };

    }


    saveAdminProducts(
        filtered
    );


    return {

        success: true,

        message:
            "Product deleted successfully."

    };

}


/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export function getAdminProductById(
    productId
) {

    const products =
        getAdminProducts();

    return (

        products.find(
            product =>
                String(product.id) ===
                String(productId)
        ) || null

    );

}