export class OrdersDto {
    constructor(apiOrder) {
        this.id = apiOrder.orderSerialNumber;
        this.products = this._mapProducts(apiOrder.orderDetails.productsResults);
        this.status = apiOrder.orderDetails.orderStatus;
        this.totalWorth = apiOrder.orderDetails.payments.orderBaseCurrency.orderProductsCost;
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
            updatedAt: new Date()
        }
    }
}