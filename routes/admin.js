const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Title should be at least 3 characters long."),
    check("price").isFloat().withMessage("Price should be a number."),
    check("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        "Description should be at least 5 characters long and at most 400 characters long."
      ),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    check("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Title should be at least 3 characters long."),
    // check("imageUrl").isURL().withMessage("Please enter a valid URL."),
    check("price").isFloat().withMessage("Price should be a number."),
    check("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        "Description should be at least 5 characters long and at most 400 characters long."
      ),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
