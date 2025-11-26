const express = require('express');
const router = express.Router();
const { createProduct , getAllProducts, getProductById,updateProduct,deleteProduct,productStatistics} = require('../controllers/product-controller');
const {authenticateAdmin, authenticateUser}=require('../middleware/authMiddleware');

// Route to create a new product
router.post('/products', authenticateAdmin, createProduct);
router.get('/products', authenticateUser, getAllProducts);
router.get('/products/stats', authenticateAdmin, productStatistics);
router.get('/products/:id', authenticateUser, getProductById);
router.put('/products/:id', authenticateAdmin, updateProduct);
router.delete('/products/:id', authenticateAdmin, deleteProduct);


module.exports = router;