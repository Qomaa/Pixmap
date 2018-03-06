"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    res.render('index', {
        title: 'iota.show',
    });
});
router.get('/table', function (req, res) {
    res.render('table', {
        title: 'iota.show',
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map