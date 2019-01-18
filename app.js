const express = require('express');
const bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

app.post("/", function (req, res, next) {
    var sasa = require("./src/app");
    res.redirect(307, "http://localhost:8080/result");
    let sasapromise = new Promise(function (resolve, reject) {
        var tree = sasa.main(req.body);
        if (tree != {}) {
            resolve(tree);
        } else {
            reject();
        }
    });
    sasapromise.then(function (resolveTree) {
        const fs = require('fs');
        let data = JSON.stringify(resolveTree);
        fs.writeFileSync('sasadata.json', data);
    })
});
app.get("/", function (req, res, next) {
    res.send("Working");
    res.end();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, ip);
