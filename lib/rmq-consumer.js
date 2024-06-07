const amqp = require('amqplib/callback_api');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const PhotoModel = require('../models/photo.model')

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'guest';

const rabbitmqUrl = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;


const consumeFromQueue = (queue = 'thumbnail_queue') => {
    const uploadDir = path.join(global.__rootdir, 'public', 'uploads');
    const thumbnailDir = path.join(global.__rootdir, 'public', 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir);
    }

    amqp.connect(rabbitmqUrl, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(queue, { durable: true });

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const content = msg.content.toString();
                    const { filename } = JSON.parse(content);

                    try {
                        const inputPath = path.join(uploadDir, filename);
                        const outputPath = path.join(thumbnailDir, `${path.basename(filename)}`);

                        await sharp(inputPath).resize(100, 100).toFile(outputPath);
                        await PhotoModel.updateOne(
                            {_id: filename.split('.')[0]},
                            {thumbPath: filename}
                        )
                        console.log(`[x] Processed ${filename} and generated thumbnail ${outputPath}`);
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing file:', error);
                        channel.nack(msg);
                    }
                }
            }, { noAck: false });
        });
    });
};

module.exports = { consumeFromQueue };
