const { Kafka } = require("kafkajs")

class KafkaConfig {
    constructor(clientIds, groupIds) {
        this.kafka = new Kafka({
          clientId: clientIds,
          brokers: ["localhost:9092"],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: groupIds });
      }
      /*constructor() {
        this.kafka = new Kafka({
          clientId: "nodejs-kafka",
          brokers: ["localhost:9092"],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: "test-group" });
      }*/

    async produce(topic, messages) {
        try {
            await this.producer.connect()
            await this.producer.send({
                topic: topic,
                messages: messages,
            })
        } catch (error) {
            console.error(error)
        } finally {
            await this.producer.disconnect()
        }
    }

    async consume(topic, callback) {
        try {
            await this.consumer.connect()
            await this.consumer.subscribe({ topic: topic, fromBeginning: false })
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value.toString()
                    callback(value)
                },
            })
        } catch (error) {
            console.error(error)
        }
    }
}

// export default KafkaConfig
module.exports = {
    KafkaConfig,
}
