const joi=require('joi');

const validateProduct = (product) => {
     const schema=joi.object({
        sku: joi.string()
            .pattern(/^[A-Za-z0-9_-]+$/)
            .min(3)
            .max(50)
            .messages({
                'string.pattern.base': 'SKU must contain only alphanumeric characters, dashes, or underscores',
                'string.min': 'SKU must be at least 3 characters long',
                'string.max': 'SKU must be at most 50 characters long',
                'string.empty': 'SKU is required',
            })
            .required(),

        name: joi.string()
            .trim()
            .min(3)
            .max(200)
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name must be at most 200 characters long',
                'string.empty': 'Name is required',
            })
            .required(),

        description: joi.string()
            .max(1000)
            .optional()
            .messages({
                'string.max': 'Description must be at most 1000 characters long',
            }),
            

        category: joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Category must be at least 2 characters long',
                'string.max': 'Category must be at most 100 characters long',
                'string.empty': 'Category is required',
            }),
            

        type: joi.string()
            .valid('public', 'private')
            .default('public')
            .messages({
                'any.only': 'Type must be either "public" or "private"',
            }),

        price: joi.number()
            .positive()
            .precision(2)
            .required()
            .messages({
                'number.positive': 'Price must be a positive number',
                'number.precision': 'Price must have at most 2 decimal places',
                'number.base': 'Price must be a number',
                'number.empty': 'Price is required',
            }),
            

        discountPrice: joi.number()
            .min(0)
            .precision(2)
            .less(joi.ref('price'))
            .optional()
            .messages({
                'number.less': 'Discount price must be less than the original price',
                'number.min': 'Discount price must be a positive number',
                'number.precision': 'Discount price must have at most 2 decimal places',
                'number.base': 'Discount price must be a number',
            }),
            

        quantity: joi.number()
            .integer()
            .min(0)
            .required()
            .messages({
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be greater than or equal to 0',
                'number.empty': 'Quantity is required',
            })
            
     })
      
    return schema.validate(product, { abortEarly: false });
}

const validateUpdateProduct = (product) => {
    const schema = joi.object({
        sku: joi.string()
            .pattern(/^[A-Za-z0-9_-]+$/)
            .min(3)
            .max(50)
            .messages({
                'string.pattern.base': 'SKU must contain only alphanumeric characters, dashes, or underscores',
                'string.min': 'SKU must be at least 3 characters long',
                'string.max': 'SKU must be at most 50 characters long',
            }),

        name: joi.string()
            .trim()
            .min(3)
            .max(200)
            .messages({
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name must be at most 200 characters long',
            }),

        description: joi.string()
            .max(1000)
            .optional()
            .messages({
                'string.max': 'Description must be at most 1000 characters long',
            }),

        category: joi.string()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Category must be at least 2 characters long',
                'string.max': 'Category must be at most 100 characters long',
            }),

        type: joi.string()
            .valid('public', 'private')
            .messages({
                'any.only': 'Type must be either "public" or "private"',
            }),

        price: joi.number()
            .positive()
            .precision(2)
            .messages({
                'number.positive': 'Price must be a positive number',
                'number.precision': 'Price must have at most 2 decimal places',
                'number.base': 'Price must be a number',
            }),

        discountPrice: joi.number()
            .min(0)
            .precision(2)
            .less(joi.ref('price'))
            .optional()
            .messages({
                'number.less': 'Discount price must be less than the original price',
                'number.min': 'Discount price must be a positive number',
                'number.precision': 'Discount price must have at most 2 decimal places',
                'number.base': 'Discount price must be a number',
            }),

        quantity: joi.number()
            .integer()
            .min(0)
            .messages({
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be greater than or equal to 0',
            })
    });

    return schema.validate(product, { abortEarly: false });
}

module.exports={validateProduct , validateUpdateProduct};