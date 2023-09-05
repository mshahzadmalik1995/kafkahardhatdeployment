const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
require("dotenv").config()

//import {pinataSDK} from '@pinata/sdk';


const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || ""
const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)



async function storeImageInPinata(imagePath, imageName) {
    try {
        const options = {
            pinataMetadata: {
                name: imageName,
            },
        }
      const readableStreamForFile = fs.createReadStream(imagePath);
      const pinataResponse = await pinata.pinFileToIPFS(readableStreamForFile, options);
      return pinataResponse.IpfsHash;
    } catch (error) {
      console.error('Error storing image in Pinata:', error);
      throw error;
    }
  }

  async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
  
  // Example usage
  const imagePath = 'path/to/your/image.jpg';
  
 /* storeImageInPinata(imagePath)
    .then((ipfsHash) => {
      console.log('Image stored in Pinata. IPFS Hash:', ipfsHash);
    })
    .catch((error) => {
      console.error('Error:', error);
    });*/

    module.exports = { storeImageInPinata, storeTokenUriMetadata }