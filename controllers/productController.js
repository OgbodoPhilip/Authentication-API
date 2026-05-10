import Product from "../model/productSchema.js";


export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, inStock } = req.body;
    const product = new Product({ name, price, description, inStock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { name, minPrice, maxPrice } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }   
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }   
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  }
    catch (error) {
    next(error);
  } 
};

export const getProductById = async (req, res, next) => {
    try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });    
    } else {
      res.json(product);
    }
    } catch (error) {
    next(error);
  }
};

export const updateProduct =  async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }   
    } catch (error) {
    next(error);
  }     
};


export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;  
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }   
    } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { name, minPrice, maxPrice } = req.query;
    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }   

    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }   
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  }
    catch (error) {
    next(error);
  } 

};




