import KafkaConfig from "../../src/utils/config";
const { ethers } = require('hardhat');

export default async function transferConsumer(req, res) {
    try {
        console.log("Get invoked consumemintkafka");
        const kafkaConfig = new KafkaConfig("cdd-t", "gdd-t");

        kafkaConfig.consume("my-topic-nft-transfer-consumer", async (value) => {

            const nftData = JSON.parse(value)
            const ownerAddress = process.env.OWNER_ADDRESS;
            const contractInstance = await ethers.getContractAt("GenericNft", nftData.nftAddress);

            const overrides = {
                gasLimit: ethers.BigNumber.from(1500000)
            };

            //transferring the NFT from owner's wallet to user's wallet
            const transferTransaction = await contractInstance.transferFrom(ownerAddress, nftData.cryptoAddress, nftData.tokenId, overrides);
            await transferTransaction.wait(1);

            const nftData2 = {
                userId: userId,
                missionId: missionId,
            }

            const nftDataString = JSON.stringify(nftData2);
            const messages = [
                { key: "transferedNftDetails", value: nftDataString },
            ];
            const kafkaConfig2 = new KafkaConfig("cId-t-44", "gId-t-44");
            kafkaConfig2.produce("my-topic-nft-transfer-consumer", messages);

        });
        // return res.status(200).json(`Nft transfer complete`);

    } catch (e) {
        //return res.status(500).json(`Server error while transfering NFT ${e}`);
    }
}