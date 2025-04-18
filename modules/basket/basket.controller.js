const createHttpError = require("http-errors");
const {
  Product,
  ProductSize,
  ProductColor,
} = require("../product/product.model");
const { ProductTypes } = require("../../common/constants");
const { Basket } = require("./basket.model");

async function addToBasket(req, res, next) {
  const { id: userId = undefined } = req?.user ?? {};
  const { productId, colorId, sizeId } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) throw createHttpError(404, "product not found");

  const basketItem = {
    productId: product.id,
    userId,
  };

  let productCount = product.count ?? 0;
  let colorCount;
  let sizeCount;

  if (product.type === ProductTypes.COLORING) {
    if (!colorId) throw createHttpError(400, "provide color details please");
    const productColor = await ProductColor.findByPk(colorId);
    if (!productColor) throw createHttpError(404, "product color not found");
    basketItem["colorId"] = colorId;
    colorCount = productColor?.count ?? 0;
    if (colorCount) throw createHttpError(400, "color count is not enough");
  } else if (product.type === ProductTypes.SIZING) {
    if (!sizeId) throw createHttpError(400, "provide size details please");
    const productSize = await ProductSize.findByPk(sizeId);
    if (!productSize) throw createHttpError(404, "product size not found");
    basketItem["sizeId"] = sizeId;
    sizeCount = productSize?.count ?? 0;
    if (sizeCount) throw createHttpError(400, "size count is not enough");
  } else {
    if (productCount) throw createHttpError(400, "count is not enough");
  }
  const basket = await Basket.findOne({ where: basketItem });
  if (basket) {
    if (colorCount && colorCount > basket?.count) {
      basket.count += 1;
    } else if (sizeCount && sizeCount > basket?.count) {
      basket.count += 1;
    } else if (productCount && productCount > basket?.count) {
      basket.count += 1;
    } else {
      throw createHttpError(400, "product count is not enough");
    }
    await basket.save();
  } else {
    await Basket.create({ ...basketItem, count: 1 });
  }
  return res.json({
    message: "added to basket successfully",
  });
}

async function getUserBasket(req, res, next) {
  try {
    const { id: userId } = req.user;
    const basket = await Basket.findAll({
      where: userId,
      include: [
        { model: Product, as: "product" },
        { model: ProductColor, as: "color" },
        { model: ProductSize, as: "size" },
      ],
    });
    let totalAmount = 0;
    let totalDiscount = 0;
    let finalAmount = 0;
    let finalBasket = [];
    for (const item of basket) {
      const { product, color, size, count } = item;
      const productIndex = finalBasket.findIndex(
        (item) => item.id === product.id
      );
      let productData = finalBasket.find((item) => item.id === product.id);
      if (!productData) {
        productData = {
          id: product.id,
          title: product.title,
          price: product.price,
          type: product.type,
          count,
          sizes: [],
          colors: [],
        };
      } else {
        productData.count += count;
      }
      if (product?.type === ProductTypes.COLORING) {
        let price = color.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;
        if (color.active_discount && color.discount > 0) {
          discountAmount = price * (color?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData["colors"].push({
          id: color.id,
          color_name: color?.color_name,
          color_code: color?.color_code,
          price,
          discountAmount,
          finalPrice,
          count,
        });
      } else if (product?.type === ProductTypes.SIZING) {
        let price = color.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;
        if (size.active_discount && size.discount > 0) {
          discountAmount = price * (size?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData["sizes"].push({
          id: size.id,
          size: size?.size,
          price,
          discountAmount,
          finalPrice,
          count,
        });
      } else if (product?.type === ProductTypes.SINGLE && product) {
        let price = product.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = 0;
        if (product.active_discount && product.discount > 0) {
          discountAmount = price * (product?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = price - discountAmount;
        finalAmount += finalPrice;
        productData["finalPrice"] = finalPrice;
        productData["discountAmount"] = discountAmount;
      }

      if (productIndex > -1) finalBasket[productIndex] = productData;
      else finalBasket.push(productData);

      return res.json({
        finalAmount,
        totalAmount,
        totalDiscount,
        basket: finalBasket,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToBasket,
  getUserBasket,
};
