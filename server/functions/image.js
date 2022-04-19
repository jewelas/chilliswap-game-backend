const ImgixAPI = require("imgix-management-js");
const s3 = require('../service/s3bucket');

const imgix = new ImgixAPI({
    apiKey: `ak_70792946cd8099cebea3eced88356308758cb3b585b94259417dbab6eefb008d`
});

const BUCKET_NAME = 'knfts';


const UploadImage = (image, key) => {
    return new Promise((resolve, reject)=>{
    // Read content from the file
    // const fileContent = fs.readFileSync(fileName);
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: image
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            reject(err);
            return
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data)
        return
    });
    
    }).catch((err)=>console.log(err))
};





// const UploadImage = (data,imageUrl) => {
//     return new Promise((reslove, reject)=> {
//         imgix.request(`sources/upload/${imageUrl}`, {
//             method: 'POST',
//             body: data,
//             headers: {
//                 Authorization: `Bearer ak_e157c0f180d24d1444179ed4c5e0930625d2b4b820f3dae404dac8d12874d5f5`,
//               },
//         })
//         .then(response => {
//             console.log(JSON.stringify(response, null, 2))
//             reslove(response)
//         }).catch((err)=>{
//             reject(err)
//         })
//     })
// }

module.exports = {
    UploadImage,
}
  