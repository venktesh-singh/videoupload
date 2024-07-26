const UploadVideo = require('../model/uploadvideo');
const Category = require('../model/catvideo'); // Ensure the correct path
const path = require('path');
const { compressImage, compressVideo, generateUniquePath } = require('../utils/compress');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;  
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports.getUploadVideo = async function (req, res) {
    try {
        const uploadVideo = await UploadVideo.find().populate('category').sort({ dateCreated: -1 });
        if (uploadVideo) {
            return res.status(200).json({ success: true, message: "Upload Video Found Successfully", uploadVideo });
        } else {
            return res.status(404).json({ success: false, message: "Upload Video cannot be found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports.getUploadVideoById = async function (req, res) {
    try {
        const uploadVideo = await UploadVideo.findById(req.params.id).populate('category');
        if (uploadVideo) {
            return res.status(200).json({ success: true, message: "Upload Video Found Successfully", uploadVideo });
        } else {
            return res.status(404).json({ success: false, message: "Upload Video cannot be found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports.addUploadVideo = async function (req, res) {
    const { video_title, video_desc, category } = req.body;
    const videoUrl = `${req.protocol}://${req.get('host')}/public/uploads/video/`;
    const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/videoimg/`;
    const videoPaths = req.files['video_upload'] ? req.files['video_upload'].map(file => file.path) : [];
    const imagePath = req.files['video_img'] ? req.files['video_img'][0].path : null;

    try {
        let compressVideoPaths = [];
        let compressImagePath;

        for (let videoPath of videoPaths) {
            let compressVideoPath = generateUniquePath(videoPath);
            await compressVideo(videoPath, compressVideoPath);
            compressVideoPaths.push(`${videoUrl}${path.basename(compressVideoPath)}`);
        }

        if (imagePath) {
            compressImagePath = generateUniquePath(imagePath);
            await compressImage(imagePath, compressImagePath);
            compressImagePath = `${imageUrl}${path.basename(compressImagePath)}`;
        }

        const categoryCheck = await Category.findById(category);
        if (!categoryCheck) {
            return res.status(404).json({ success: false, message: "Category Not found" });
        }

        const uploadVideo = new UploadVideo({
            video_title,
            video_desc,
            video_img: compressImagePath,
            category: categoryCheck._id,
            video_upload: compressVideoPaths
        });

        const savedVideo = await uploadVideo.save();
        if (savedVideo) {
            return res.status(200).json({ success: true, message: "Upload Video Created Successfully", video: savedVideo });
        } else {
            return res.status(404).json({ success: false, message: "Upload Video cannot be created" });
        }
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
};

module.exports.editUploadVideo = async function (req, res) {
    const { video_title, video_desc, category } = req.body;
    const videoUrl = `${req.protocol}://${req.get('host')}/public/uploads/video/`;
    const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/videoimg/`;
    const videoPaths = req.files['video_upload'] ? req.files['video_upload'].map(file => file.path) : [];
    const imagePath = req.files['video_img'] ? req.files['video_img'][0].path : null;
    
    try{
        let compressVideoPaths = [];
        let compressImagePath;

        for (let videoPath of videoPaths) {
            let compressVideoPath = generateUniquePath(videoPath);
            await compressVideo(videoPath, compressVideoPath);
            compressVideoPaths.push(`${videoUrl}${path.basename(compressVideoPath)}`);
        }

        if (imagePath) {
            compressImagePath = generateUniquePath(imagePath);
            await compressImage(imagePath, compressImagePath);
            compressImagePath = `${imageUrl}${path.basename(compressImagePath)}`;
        }

        const categoryCheck = await Category.findById(category);
        if (!categoryCheck) {
            return res.status(404).json({ success: false, message: "Category Not found" });
        }

        const uploadVideo = await UploadVideo.findByIdAndUpdate(req.params.id,{
            video_title,
            video_desc,
            video_img: compressImagePath,
            category: categoryCheck._id,
            video_upload: compressVideoPaths
        },
        {new:true},
        );
        if(uploadVideo){
            return res.status(200).json({success:true, message:"Video Updated Successfully", updateVideo:uploadVideo})
        }else{
            return res.status(404).json({success:false, message:"Video Not Found"})
        }
    }catch {
        return res.status(500).json({success:true, message:"Internal Server Error"})
    }
}


module.exports.deleteUploadVideo = async function (req, res) {
    try {
        const uploadVideo = await UploadVideo.findByIdAndDelete(req.params.id);
        if (uploadVideo) {
            return res.status(200).json({ success: true, message: "Upload Video Deleted Successfully", uploadVideo });
        } else {
            return res.status(404).json({ success: false, message: "Upload Video cannot be found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
