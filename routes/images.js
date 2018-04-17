const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const ImagesController = require('./../controllers/ImagesController');

router.get('/', function(req, res, next){
    ImagesController.getImagesList().then(res => {
        res.json({

        })
    });
    next();
    // console.log(ImagesController.getImagesList());
})

module.exports = router;