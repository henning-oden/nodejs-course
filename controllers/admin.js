const mongoose = require('mongoose');

const fileHelper = require('../util/file');

const Product = require('../models/product');
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render(
      res.render('admin/edit-product', {
        path: '/add-product',
        pageTitle: 'Add Product',
        editing: false,
        hasError: true,
        errorMessage: 'Attached file is not an imge.',
        product: {
          title: title,
          price: price,
          description: description
        },
        validationErrors: []
      })
    );
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render(
      res.render('admin/edit-product', {
        path: '/add-product',
        pageTitle: 'Add Product',
        editing: false,
        hasError: true,
        errorMessage: errors.array()[0].msg,
        product: {
          title: title,
          price: price,
          description: description
        },
        validationErrors: errors.array()
      })
    );
  }

  const imageUrl = image.path;

  const product = new Product({
    // _id: mongoose.Types.ObjectId('5fad5fd6a5f2c720a85c285a'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // return res.status(422).render(
      //   res.render('admin/edit-product', {
      //     path: '/add-product',
      //     pageTitle: 'Add Product',
      //     editing: false,
      //     hasError: true,
      //     errorMessage: 'Database operation failed, please try again.',
      //     product: {
      //       title: title,
      //       imageUrl: imageUrl,
      //       price: price,
      //       description: description
      //     },
      //     validationErrors: []
      //   })
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        product: product,
        errorMessage: null,
        validationErrors: [],
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render(
      res.render('admin/edit-product', {
        path: '/add-product',
        pageTitle: 'Edit Product',
        editing: true,
        hasError: true,
        errorMessage: errors.array()[0].msg,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId
        },
        validationErrors: errors.array()
      })
    );
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save()
        .then(result => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({
    userId: req.user._id
  })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'))
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting product failed.' });
    });
};
