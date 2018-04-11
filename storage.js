exports.storage = {

    TOTAL_ORDERS: 105,
    PER_PAGE: 10,

    getOrders: function (from, to) {
        //TODO check from <= to, from >= 0, to <= total
        let t = [];
        for (let i = from; i < to; i++) {
            t[i] = {id: i, title: "order_" + i};
        }
        return (t);
    }
};
