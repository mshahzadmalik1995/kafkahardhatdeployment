const { ethers } = require('hardhat');
const { KafkaConfig } = require("../utils/kafkaconfig");

async function main() {
    try {
        console.log("Get invoked consumemintkafka");
        const kafkaConfig = new KafkaConfig("cdd", "gdd");

        kafkaConfig.consume("my-topic-nft-mint-producer", async (value) => {

            const nftData = JSON.parse(value)

            console.log(nftData)
            const contractInstance = await ethers.getContractAt("GenericNft", nftData.nftAddress);

            //minting the NFT into owner's wallet
            const mintTransaction = await contractInstance.mintNft();
            await mintTransaction.wait(1);
            let tokenId = await contractInstance.getTokenCounter();
            tokenId = tokenId - 1;

            const nftData2 = {
                nftAddress: nftAddress,
                userId: userId,
                missionId: missionId,
                tokenId: tokenId
            }
            console.log(nftData2)

            const nftDataString = JSON.stringify(nftData2);
            const messages = [
                { key: "mintedNftDetails", value: nftDataString },
            ];
            const kafkaConfig2 = new KafkaConfig("cId-44", "gId-44");
            kafkaConfig2.produce("my-topic-nft-mint-consumer", messages);
            console.log("minted")
            //return res.status(200).json(`NFT minted successfully`);
        })
    } catch (e) {
        //return res.status(500).json(`Server error while claiming NFT ${e}`);
    }
}

main()