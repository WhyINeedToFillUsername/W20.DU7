const http = require("http");
const storage = require("./storage").storage;

http.createServer(function (req, res) {
    // log request object
    console.log("\nIncoming request: " + req.method + " " + req.url);

    // initialize the body to get the data asynchronously
    req.body = "";

    // get the data of the body
    req.on('data', function (chunk) {
        req.body += chunk;
        console.log("adding data");
    });

    // all data have been received
    req.on('end', function () {
        if (req.method === "GET" && req.url.match("^/orders\??")) {
            processGetRequest(req, res);
        } else {
            console.log("bad request");
            res.writeHead(400);
            res.end('bad request');
        }
    });

    // main function to process a GET request
    function processGetRequest(req, res) {
        let page = 1; // default value - first page
        let perPage = 10; // default value

        // read params from request
        let matchParams = req.url.match("^/orders\\?page=(\\d+)&per_page=(\\d+)");
        if (matchParams) {
            page = matchParams[1];
            perPage = matchParams[2];

            // basic values check
            const totalPages = Math.ceil(storage.TOTAL_ORDERS / perPage);
            if (page <= 0 || perPage <= 0) { // wrong params, return default page
                page = 1;
                perPage = 10;
            }
            if (page > totalPages) { // get the last page instead
                page = totalPages;
            }
        }

        let link = constructLinkHeader(page, perPage);
        let orders = storage.getOrdersPage(page, perPage); // get data from DB (simulated)

        console.log("returning orders - page " + page + ", " + perPage + " per page");
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Link': link
        });
        res.end(JSON.stringify(orders));
    }
}).listen(8080);

// helper function to construct the link header
function constructLinkHeader(page, perPage) {
    let link = "";
    const totalPages = Math.ceil(storage.TOTAL_ORDERS / perPage);

    const nextPage = Number(page) + Number(1);

    const first = '</orders?page=1&per_page=' + perPage + '>; rel="first"';
    const next = '</orders?page=' + nextPage + '&per_page=' + perPage + '>; rel="next"';
    const previous = '</orders?page=' + (page - 1) + '&per_page=' + perPage + '>; rel="previous"';
    const last = '</orders?page=' + totalPages + '&per_page=' + perPage + '>; rel="last"';

    // always include link to first and last page, dynamically add "next" and "previous"
    link += first;
    link += ', ';

    if (page > 1) {
        link += previous;
        link += ', ';
    }

    if (page < totalPages) {
        link += next;
        link += ', ';
    }

    link += last;

    return link;
}