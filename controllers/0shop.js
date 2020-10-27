const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Index',
            path: '/index',
            hasProducts: products.length > 0,
            productCSS: true
        });
    }))
};

exports.getCart = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Cart',
            path: '/cart',
            productCSS: true
        });
    }))
};