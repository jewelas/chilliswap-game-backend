const ipfs = require('../service/ipfs')

///QmTMoChaWNbbAziUHXNQiZoWmRydgHf7UpUje7SvThmuYf


const getImageFromIpfs = (path) => {
    return new Promise(async(reslove, reject)=> {
       try{
        //let imageResponse = await ipfs.files.catPullStream( path)
        let imageResponse = await ipfs.cat(path)
        reslove(imageResponse)
       }catch(err){
           reject(err)
       }
    })
}

const getMetadataFromIpfs = (path) => {
    return new Promise(async(reslove, reject)=> {
       try{
        //let imageResponse = await ipfs.files.catPullStream( path)
        let imageResponse = await ipfs.cat(path)
        var metadata = JSON.parse(imageResponse.toString());
        reslove(metadata)
       }catch(err){
           reject(err)
       }
    })
}

// ;(async()=>{
//     try{
//         //let imageResponse = await ipfs.files.catPullStream( path)
//         let imageResponse = await ipfs.cat('QmTMoChaWNbbAziUHXNQiZoWmRydgHf7UpUje7SvThmuYf')
//         console.log(imageResponse)
//         var temp = JSON.parse(imageResponse.toString());
//         console.log(temp)

//        }catch(err){
//         console.log(err)
//        }
// })()

//

module.exports = {
    getImageFromIpfs,
    getMetadataFromIpfs
}
  