const express = require('express');
const router = express.Router();
const sharp = require('sharp');

const ImagesController = require('./../controllers/ImagesController');

router.get('/', function(req, res, next){
    ImagesController.getImagesList().then(imagesList => {
        
        console.log('​',imagesList );
        res.json({
            ...imagesList
        })
    })
    .catch(err => console.log(err));
    // console.log(ImagesController.getImagesList());
    // res.end()
})

module.exports = router;