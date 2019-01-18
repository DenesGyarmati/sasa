const express = require('express');
const bodyParser = require('body-parser');

var app = express();

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000);