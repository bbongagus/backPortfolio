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
const readDirectory      = (pathToDir) => readdirSync(pathToDir).filter(value => RegExp(/\.(jpg|png)$/).test(value));
const readImageDirectory = () => readDirectory(defaultPathToImages);
const compareLists       = ([list1, list2]) => list1.filter(value => list2.indexOf(value) == -1);
const getUnindexedImages = () => compareLists([readImageDirectory(), Object.keys(getJSONdata())]);
const getPreviewPath = (fileName) => path.resolve(defaultPathToPreviews, fileName);
const getImagePath = (fileName) => path.resolve(defaultPathToImages, fileName);
const generateGalleryItems = (unindexedImages, height = 1080) => {
    const generateOneGalleryItem = (imageName) => {
        return new Promise((resolve, reject) => {
            
            const generateRandomKey = () => '_' + Math.random().toString(36).substring(2, 9);
            sharp(getImagePath(imageName))
                .resize(null, height / 3)
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
// const resizeImages = async(images, height = 1080) => {
//     const addElem = () => {
//         var elems = [];
//         return (x, ...xs) => def(x) ? elems.push(x, ...xs) : elems;
//     }
//     const readyPreview = addElem();
//     const imageHeight = () => height / 3;
//     const resizeImage = async(image) => 
//         def(image) 
//             ? sharp(image)
//                 .resize(null, imageHeight())
//                 .toFile(path.resolve(defaultPathToPreviews, `preview_${path.basename(image)}`))
//                 .then(readyPreview(image))
//             :  false;
//     await images.forEach(image => resizeImage(path.resolve(defaultPathToImages, image)));
//     return readyPreview().map(value => path.basename(value));
// }
// const updateJSON = async(previewsListPromise) => {
//     const previewsList = await previewsListPromise; 

    // console.log('​updateJSON -> ',previewsList  );
    // const previewsSizes = await previewsList.map(preview => sizeOf(preview));
//     const getPreviewName = (name) => `preview_${name}`;
//     // const previewsSizes=  previewsList.map(preview => sizeOf(path.resolve(defaultPathToPreviews, getPreviewName(preview))));
    
//     let lol = await promisifiedSizeOf(path.resolve(defaultPathToPreviews, getPreviewName(previewsList[1])))

//     console.log(lol);
//     const newJSON = previewsList.reduce((obj, cur, i) => {return {...obj, [cur]: {preview: getPreviewName(cur),
//                                                                                   height: 333}};}, {}); 
//     const entireJSON = Object.assign(getJSONdata(), newJSON);
//     promisifiedWriteFile(defaultPathToJson, JSON.stringify(entireJSON, null, 4))
//         .then(console.log('successed write to file'));
//     return entireJSON;
// }
// const getImagesList = () => updateJSON(resizeImages(getUnindexedImages()));



// module.exports.defaultPathToImages   = defaultPathToImages;
// module.exports.defaultPathToPreviews = defaultPathToPreviews;
// module.exports.defaultPathToJson     = defaultPathToJson;
// module.exports.getImagesList         = getImagesList;