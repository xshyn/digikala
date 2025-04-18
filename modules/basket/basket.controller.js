const createHttpError = require("http-errors");
const {
  Product,
  ProductSize,
  ProductColor,
} = require("../product/product.model");
const { ProductTypes } = require("../../common/constants");
const { Basket } = require("./basket.model");

async function addToBasketHandler(req, res, next) {
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
    message: "added to basket successfully"
  })
}

module.exports = {
    addToBasketHandler
}
