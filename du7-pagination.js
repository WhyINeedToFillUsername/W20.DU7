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
        if (req.method === "GET" && req.url.match("^/orders")) {
            processGetRequest(req, res);
        } else {
            console.log("bad request");
            res.writeHead(400);
            res.end('bad request');
        }
    });

    function processGetRequest(req, res) {

        //TODO parse req - get pagination

        console.log("returning list of orders");
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Link': '</orders?page=2&per_page=10>; rel="next",  </orders?page=50&per_page=100>; rel="last"'
        });

        let orders = storage.getOrders(0, 10);
        res.end(JSON.stringify(orders));
    }
}).listen(8080);
