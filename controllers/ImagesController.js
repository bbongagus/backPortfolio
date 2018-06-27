const path                                               = require('path'); const sharp = require('sharp');
const { readFileSync, readdirSync, readFile, writeFile } = require('fs');
const sizeOf                                             = require('image-size');
const { promisify }                                      = require('util');
const __rootdir                                          = global.__rootdir;
const promisifiedWriteFile                               = promisify(writeFile);
const promisifiedSizeOf                                  = promisify(sizeOf);


const defaultPathToImages                                = path.resolve(__rootdir, 'src', 'images');
const defaultPathToPreviews                              = path.resolve(defaultPathToImages, 'previews');
const defaultPathToJson                                  = path.resolve(defaultPathToPreviews, 'previews.json');

const def          = x => typeof x !== 'undefined';
const loadJSONdata = (pathToJson) => {
    const json = JSON.parse(readFileSync(pathToJson));
    return () => json;
}
const getJSONdata        = loadJSONdata(defaultPathToJson);
const readDirectory      = (pathToDir) => readdirSync(pathToDir).filter(value => RegExp(/\.(jpg|png|JPG)$/).test(value));
const readImageDirectory = () => readDirectory(defaultPathToImages);
const compareLists       = ([list1, list2]) => list1.filter(value => list2.indexOf(value) == -1);
const getUnindexedImages = () => compareLists([readImageDirectory(), Object.keys(getJSONdata())]);
const getPreviewPath = (fileName) => path.resolve(defaultPathToPreviews, `preview_${fileName}`);
const getImagePath = (fileName) => path.resolve(defaultPathToImages, fileName);
const generateGalleryItems = (unindexedImages, width = 1920) => {
    const generateOneGalleryItem = (imageName) => {
        return new Promise((resolve, reject) => {
            
            const generateRandomKey = () => '_' + Math.random().toString(36).substring(2, 9);
            sharp(getImagePath(imageName))
                .resize(width / 3, null)
                .toFile(getPreviewPath(imageName))
                .then(result => {
                    const {width, height} = result; 
                    resolve({image: imageName, width: width, height: height, preview: `preview_${imageName}`, key: generateRandomKey()});
                })
                .catch(error => reject(error));
        })
    }
    const newGalleryItems = unindexedImages.map(undefinedImage => generateOneGalleryItem(undefinedImage));
    return Promise.all(newGalleryItems);
}
const updateJSON = async (newDataPromise) => {
    const newData = await newDataPromise;
    console.log('​updateJSON -> ', newData);
    if (newData.length > 0){
        const updatedJSONData = Object.assign(newData.reduce((obj, curr) => {
            obj[curr['image']] = curr;
            return obj;
        }, {}), getJSONdata());
        promisifiedWriteFile(defaultPathToJson, JSON.stringify(updatedJSONData, null, 4))
            .catch(error => console.log(error));
    return updatedJSONData;
    }
    return getJSONdata();
}
const getImagesList = () => updateJSON(generateGalleryItems(getUnindexedImages()));
module.exports.getImagesList = getImagesList;