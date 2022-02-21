import express from "express";
import expressFileUpload from 'express-fileupload';
import fs from 'fs';
const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// File Upload
app.use(expressFileUpload({
    limits: { fileSize: 2 * 1024 * 1024 }, // 2mb
    abortOnLimit: true, // if limit is reached return 413
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: './uploads/'
}));
// Route
app.post('/api/upload', (req, res) => {
    console.log(req.files);
    // Check file
    if (!req.files) {
        res.status(400).json({ message: 'Bad request' });
        return
    };
    // Set image name
    let imageName = req.files.upload.name;
    if (req.files.upload.name.length > 13) {
        imageName = `${req.files.upload.name.substring(0,13).replace('.','_')}_.${req.files.upload.name.split('.')[1]}`;
        console.log(imageName);
    };
    try {
        fs.readdir('./uploads', (err, data) => {
            if (err) throw new Error(err);
            if (data) {
                fs.rename(`./uploads/${data[0]}`, `./uploads/${imageName}`, (renameErr) => {
                    if (renameErr) throw new Error(renameErr);
                    if (!renameErr) {
                        // Upload in the cloud then response

                        return res.status(200).json({ success: true, name: imageName });
                    } else {
                        return res.status(404).json({ success: false, name: '' });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    };

    // res.status(200).json({ message: 'OK' });
});


// Listener
app.listen(3031, console.log('Server running on port 3031'));