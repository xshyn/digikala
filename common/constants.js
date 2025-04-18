const ProductTypes = {
    SINGLE: "single",
    SIZING: "sizing",
    COLORING: "coloring",
}
const OrderStatus = {
    PENDING: "pending",
    ORDERED: "ordered",
    PROCESSING: "processing",
    PACKED: "packed",
    INTRANSIT: "in-transit",
    CANCELED: "canceled",
    DELIVERED: "delivered"
}

module.exports = {
    ProductTypes,
    OrderStatus
}