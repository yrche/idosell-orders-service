export class OrdersDto {
    constructor(order) {
        this.id = order.orderSerialNumber;
        this.products = this._mapProducts(order.orderDetails.productsResults);
        this.status = order.orderDetails.orderStatus;
        this.totalWorth = order.orderDetails.payments.orderBaseCurrency.orderProductsCost;
    }

    _mapProducts(products) {
        if (typeof products !== 'undefined' && products.length > 0) {
            return products
                .map((product) => ({
                    id: product.productId,
                    quantity: product.productQuantity
                }));
        } else {
            return [];
        }
    }

    toDataBaseFormat() {
        return {
            _id: this.id,
            products: this.products,
            status: this.status,
            totalWorth: this.totalWorth,
            updateAt: new Date(),
        }
    }
}