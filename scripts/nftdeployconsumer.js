const hre = require("hardhat");
const fs = require("fs");
const {
    handleTokenUris
  } = require("../utils/pinataTokenUri")
const {KafkaConfig} = require("../utils/kafkaconfig");
const path = require('path');

async function main() {
    let tokenUris;
    let originalNameImage;
    let nftNameValue;
    let nftDescriptionValue;
    let nftImagePathValue;
    try{
        

        console.log("Get invoked")
        const kafkaConfig = new KafkaConfig("cId-2", "gId-2")
        kafkaConfig.consume("my-topic", async (value) => {
            console.log("hi kafka")
            const val = JSON.parse(value)
            const {nftName, nftDescription, originalname, nftImagePath, rarity} = val;
            nftNameValue = nftName;
            nftDescriptionValue = nftDescription;
            nftImagePathValue = nftImagePath;
            originalNameImage = originalname;
            const byteArray = val.imageByteArray;
            const imageNumByteArray = byteArray.split(",").map(Number);
            const byteArray2 = Buffer.from(imageNumByteArray);
            const fileName = `image_${Date.now()}.png`;
            const storageDirectory = path.join(process.cwd(), 'images', 'uploads');
            if (!fs.existsSync(storageDirectory)) {
            fs.mkdirSync(storageDirectory, { recursive: true });
            }

            console.log(path.join(storageDirectory, fileName));

            const nftImagePathMy = path.join(storageDirectory, fileName);

            // Write the image file to the server
            fs.writeFileSync(path.join(storageDirectory, fileName), byteArray2);

            //const nftImagePath = "C:/Shahzad/hardhatmondodbtesting/image/uploads/image_1688884988751.png";
            try{
                tokenUris = await handleTokenUris(nftImagePathMy, originalname);
                //const sttokenUris = await handleTokenUris(nftImagePathMyjadfa, originalnameaafd);
                console.log("image uploaded to pinata");
                const Nft1 = await hre.ethers.getContractFactory("GenericNft");
                const nft1 = await Nft1.deploy(tokenUris, nftName, nftDescription);
                await nft1.deployed();
                //const nft1 = await Nft1.deploy(tokenUris, "shahzad", "abc");
                const nftAddress = nft1.address;
                const nftAbi = JSON.parse(nft1.interface.format("json"));
                //console.log("nft1", nft1)
                console.log(`Nft contract deployed to address: ${nft1.address}`);

                const nftData = {
                    nftName: nftName,
                    nftDescription: nftDescription,
                    nftImageName: originalname,
                    nftImagePath: nftImagePath,
                    nftTokenUri: tokenUris,
                    missionId: "0",
                    isAssociated:false,
                    nftAddress: nftAddress,
                    nftAbi: nftAbi,
                    nftContractName:"GenericNft",
                    isDeployed: true,
                    rarity:rarity
                }
                const nftDataString = JSON.stringify(nftData);
            // console.log("nftDataString", nftDataString)
                const messages = [
                { key: "key1", value: nftDataString },
                ];
                const kafkaConfig2 = new KafkaConfig("cId-3", "gId-3");
                kafkaConfig2.produce("my-topic-nft", messages);
                console.log("hi after data")

            } catch(e) {
                console.log(e);
                const nftData = {
                    nftName: nftNameValue,
                    nftDescription: nftDescriptionValue,
                    nftImageName: originalNameImage,
                    nftImagePath: nftImagePathValue,
                    nftTokenUri: tokenUris,
                    missionId: "0",
                    nftAddress: "0",
                    nftAbi: "0",
                    nftContractName:"GenericNft",
                    isAssociated:false,
                    isDeployed: false
                }
                const nftDataString = JSON.stringify(nftData);
            // console.log("nftDataString", nftDataString)
                const messages = [
                { key: "key1", value: nftDataString },
                ];
                const kafkaConfig2 = new KafkaConfig("cId-3", "gId-3");
                kafkaConfig2.produce("my-topic-nft", messages);
            }
        })

    }catch(e){
        console.log(e)
        console.log("in exception")
        const nftData = {
            nftName: nftNameValue,
            nftDescription: nftDescriptionValue,
            nftImageName: originalNameImage,
            nftImagePath: nftImagePathValue,
            nftTokenUri: tokenUris,
            missionId: "0",
            nftAddress: "0",
            nftAbi: "0",
            nftContractName:"GenericNft",
            isAssociated:false,
            isDeployed: false
        }
        const nftDataString = JSON.stringify(nftData);
    // console.log("nftDataString", nftDataString)
        const messages = [
        { key: "key1", value: nftDataString },
        ];
        const kafkaConfig2 = new KafkaConfig("cId-3", "gId-3");
        kafkaConfig2.produce("my-topic-nft", messages);
    }
}


/*main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });*/

  main();
