const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Function to generate unique output paths
const generateUniquePath = (filePath) => {
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    const timestamp = Date.now(); // Generate a unique timestamp
    return path.join(path.dirname(filePath), `${basename}-${timestamp}${ext}`);
};

const compressImage = (inputPath, outputPath) => {
    return sharp(inputPath)
        .resize(800) // Resize to 800px width, maintaining aspect ratio
        .toFile(outputPath)
        .then(() => {
            fs.unlinkSync(inputPath); // Remove the original file
            return outputPath;
        });
};

const compressVideo = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        // Check if input and output paths are different
        if (inputPath === outputPath) {
            return reject(new Error('Input and output paths must be different'));
        }

        ffmpeg(inputPath)
            .outputOptions('-vcodec', 'libx264')
            .outputOptions('-crf', '28') // Adjust CRF value to control compression quality
            .save(outputPath)
            .on('end', () => {
                console.log('Video compression finished');
                fs.unlinkSync(inputPath); // Remove the original file
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Error compressing video:', err);
                reject(err);
            });
    });
};

module.exports = { compressImage, compressVideo, generateUniquePath };
