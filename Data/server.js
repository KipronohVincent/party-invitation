#!/usr/bin/node
// express framework
const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs')
const CustomersService = require('./customers.js')

function getFileContents(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (err) {
        console.error(err);
    }
}


const upload = multer({ dest: __dirname + './asset' });

app.post('/upload', upload.single('file'), async (req, res) => {

    if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
    }

    const getContents = getFileContents(req.file.path)

    const result = CustomersService.fetchCustomersWithinRange(getContents)

    res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        customersWithinRange: result
    });

});
app.listen(3000, () => console.log('Server Started'));