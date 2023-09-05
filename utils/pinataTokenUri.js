
const {
    storeTokenUriMetadata,
    storeImageInPinata,
  } = require("./singleImageUploadToPinata")


const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
      {
        trait_type: "NFT Reward",
        value: 100,
      },
    ],
  };

async function handleTokenUris(imagesLocation, imageName) {
    const ipfsResponse = await storeImageInPinata(imagesLocation, imageName);
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = imageName;
    tokenUriMetadata.description = `A ${tokenUriMetadata.name} token as a reward for service`;
    tokenUriMetadata.image = `ipfs://${ipfsResponse}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
  
    const tokenUris = `ipfs://${metadataUploadResponse.IpfsHash}`;
  
    console.log("Token URIs uploaded! They are:");
    console.log(tokenUris);
  
    return tokenUris;
  }

  module.exports = {
    handleTokenUris
}
  