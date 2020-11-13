const express = require('express');
const { check, body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    body('title')
        .isString()
        .isLength({ min: 3 }),
    check('imageUrl')
        .isURL(),
    check('price')
        .isFloat(),
    body('description')
        .trim()
        .isLength({ min: 5, max: 400 }),
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    body('title')
        .isString()
        .isLength({ min: 3 }),
    check('imageUrl', 'Please enter a valid url.')
        .isURL(),
    check('price')
        .isFloat()
        .custom(value => {
            if (value < 0) {
                throw 'Please enter a positive price.'
            }
            return true;
        }),
    body('description')
        .trim()
        .isLength({ min: 5, max: 400 }),
    isAuth,
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
