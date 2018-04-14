exports.storage = {

    TOTAL_ORDERS: 105,
    PER_PAGE: 10,

    getOrdersPage: function(page, perPage){
        const from = page * perPage - perPage;
        const to =  page * perPage - 1;
        return this.getOrders(from, to);
    },

    // simulate data in DB - generates array of "order" objects like {"id":100,"title":"order_100"}
    getOrders: function (from, to) {
        // check bounds
        if (to > this.TOTAL_ORDERS) to = this.TOTAL_ORDERS;
        if (from < 0) from = 0;
        if (to < 0) to = 0;
        if (from > to) from = to;

        let t = [];
        for (let i = from; i <= to; i++) {
            t.push({id: i, title: "order_" + i});
        }
        return (t);
    }
};
