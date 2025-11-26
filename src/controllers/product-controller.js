const Product = require('../models/Product');
const { validateProduct, validateUpdateProduct} = require('../utils/validation');

// Create a new product
const createProduct= async (req, res) => {
    try {
        const { error } = validateProduct(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: error.details.map(detail => ({
                             field: detail.path.join('.'),
                             message: detail.message
                    }))
                }
            });
        }
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {product}
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'desc' ? -1 : 1;
        const sort = { [sortField]: sortOrder };

        // Filtering
        const filter = {};

        if (req.query.category) 
            {
                filter.category = req.query.category;
            }
        if (req.query.type) 
            {
                filter.type = req.query.type;
            }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice)
                {
                    filter.price.$gte = parseFloat(req.query.minPrice);
                } 
            if (req.query.maxPrice) 
                {
                    filter.price.$lte = parseFloat(req.query.maxPrice);
                }
        }

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // case-insensitive
            filter.$or = [
                { name: searchRegex }, 
                { description: searchRegex }
            ];
        }

        if (req.userRole === 'user') {
            filter.type = 'public';
        }
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalItems = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        });

    } catch (error) {
            res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product || (req.userRole === 'user' && product.type === 'private')) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                error: {
                    code: 'NOT_FOUND',
                    details: {
                        "resource": "Product",
                        "id": productId
                    }
                }
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: { product }
        });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }

}

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const { error } = validateUpdateProduct(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: error.details.map(detail => ({
                             field: detail.path.join('.'),
                             message: detail.message
                    }))
                }
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return  res.status(404).json({
                success: false,
                message: 'Product not found',
                error: {
                    code: 'NOT_FOUND',
                    details: {
                        "resource": "Product",
                        "id": productId
                    }
                }
            });
        }
            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: { product: updatedProduct }
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
                return  res.status(404).json({
                success: false,
                message: 'Product not found',
                error: {
                    code: 'NOT_FOUND',
                    details: {
                        "resource": "Product",
                        "id": productId
                    }
                }
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: { product: deletedProduct }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}

const productStatistics = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalInventoryValue = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
                }
            }
        ]);
        const totalDiscountedValue= await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalDiscounted: { $sum: { $multiply: ['$discountPrice', '$quantity'] } }
                    
                }
            }
        ])
        const averagePrice = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    avgPrice: { $avg: '$price' }
                }
            }
        ]);

        const outOfStockProducts = await Product.countDocuments({ quantity: 0 });
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const productsByType = await Product.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

      res.status(200).json({
            success: true,
            message: 'statistics retrieved successfully',
            data: {
                totalProducts,
                totalInventoryValue: totalInventoryValue[0] ? totalInventoryValue[0].totalValue : 0,
                totalDiscountedValue: totalDiscountedValue[0] ? totalDiscountedValue[0].totalDiscounted : 0,
                averagePrice: averagePrice[0] ? averagePrice[0].avgPrice : 0,
                outOfStockProducts,
                productsByCategory,
                productsByType
            }
        });  

    } catch (error) {
            res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
            error: {
                code: 'SERVER_ERROR',
                details: error.message
            }
        });
    }
}
module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, productStatistics };