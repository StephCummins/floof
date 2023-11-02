const path = require('path');
const express = require('express');

const multer  = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true)
    } else {
      cb (null, false);
      req.body.error = "An error occurred! File must be a png or jpeg.";
    }
  }
});

const crypto = require('crypto');

const { uploadFile, getFile } = require('./s3');
const { addOrUpdateFloof, getFloof, getFloofOfTheDay, updateTopFloof, addToIdTable, getIds } = require('../database/dynamo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/error', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/error.html'))
});

// Post request for users to upload a new floof to S3 bucket storage.
// S3 bucket storage returns a promise object w/the storage key for the image.
// Storage key and image details are added to DynamoDB.
app.post('/addfloof', upload.single('floofPic'), async (req, res, next) => {
  // If Multer flags a file-type error, redirect to error page:
  if (req.body.error) return res.status(400).redirect('/error');
  
  const file = req.file;
  const newId = crypto.randomUUID();

  try {
    const result = await uploadFile(file);

    const newFloof = {
      id: newId,
      imageLocation: result.Key,
      name: req.body.floofName,
      totalImageViews: 0,
      totalVotes: 0
    }
  
    const addToDB = await addOrUpdateFloof(newFloof);
    const addID = await addToIdTable({id: newId});
    res.status(200).redirect('/');
  } catch(err) {
    console.error(err);
    res.status(500).json({err: 'Error adding floof.'});
  }

});

app.get('/gettopfloof', async(req, res) => {
  try {
    const newFloof = await getFloofOfTheDay();
    res.status(200).json(newFloof.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({err: 'Error getting top floof.'});
  }
});

app.put('/updatetopfloof', async(req, res) => {
  const floof = req.body;
  floof.floof_id = req.body.id;
  floof.id = 0;

  try {
    const updatedFloof = await updateTopFloof(floof);
    res.status(200).json(updatedFloof);
  } catch(err) {
    console.error(err);
    res.status(500).json({err: 'Error updating floof.'});
  }
});

app.get('/loadfloofs', async (req, res) => {
  try {
    let floofIds = await getIds();
    floofIds = floofIds.Items;
    let numOne = Math.floor(Math.random() * floofIds.length);
    let numTwo = Math.floor(Math.random() * floofIds.length);

    while (numOne === numTwo) {
      numTwo = Math.floor(Math.random() * floofIds.length);
    }

    const item1 = await getFloof(floofIds[numOne].id);
    const item2 = await getFloof(floofIds[numTwo].id);
    console.log(item1);
    console.log(item2);
    res.json([item1, item2]);
  } catch (err) {
    console.error(err);
    res.status(500).json({err: 'Error loading floof.'});
  }
});

app.get('/images/:key', async (req, res) => {
  const key = req.params.key;
  const readStream = getFile(key);
  readStream.pipe(res);
});

app.put('/updatefloofs', async (req, res) => {
  const floof = req.body;
  try {
    const updatedFloof = await addOrUpdateFloof(floof);
    res.status(200).json(updatedFloof);
  } catch(err) {
    console.error(err);
    res.status(500).json({err: 'Error updating floof.'});
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
