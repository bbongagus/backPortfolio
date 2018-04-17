const path          = require('path');
const sharp          = require('sharp');
const { promisify } = require('util');
const sizeOf        = promisify(require('image-size'));
let { readdir }   = require('fs');

readdir = promisify(readdir);
// async function getImageResolution(pathToFile){
//    let err, resolution;
//    [err, resolution] = await to(sizeOf(pathToFile));
//    if (!resolution){
//     console.log('??? Res not found');
//     return err;
//    }
//    if (err){
//     console.log('Shit happens');
//     return err;
//    }
//    return resolution; 
// }
//shift j snesti stroku snizu suda
export default class ImagesController{
    constructor(pathToImages){
        this.imagesList = [];
        this.pathToImages = pathToImages || path.resolve(__rootdir, 'src', 'images');
    }
    async updateImagesList(){
        let fileList = await readdir(this.pathToImages);
        if (fileList.length !== this.fileList.length){
            this.fileList.filter(fileName => {
                return RegExp(/\.(jpg|png)$/).test(fileName);
            })
        }
        return this.fileList.map(image => image);
    }
    async generateIcons(){

                
    }
}
// const getImagesList = async function(){
//     let pathToFiles = path.resolve(__rootdir, 'src', 'images');
//     let fileList = await readdir(pathToFiles);
//     return Promise.all(fileList
//         .filter(fileName => {
//             const imageExtReg = RegExp(/\.(jpg|png)$/);
//             return imageExtReg.test(fileName);
//         })
//         .map(async (fileName) => {
//             let pathToFile = path.resolve(pathToFiles, fileName);
//             let [err, fileInfo] = await to(sizeOf(pathToFile));
//             if (err){
//                 console.log('Shit happens');
//                 return err;
//             }
//             return Object.assign({fileName : fileName}, fileInfo);
//         }))
// }

module.exports.getImagesList = getImagesList;