const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const path = require('path');
const http = require('http')
const multer = require('multer')
const { Server } = require('socket.io');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })   
const bodyParser = require('body-parser')
const { scheduler } = require('timers/promises');

dotenv.config();
const app = express();
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});
const port = 4000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err.message));


app.get('/', (req, res) => {
  res.send('hello');
});
// search
app.get('/search', productController.search);
// Like-Products
app.post('/like-product',userController.likeProducts);
// disLisk-product
app.post('/dislike-product',userController.dislikeProducts);
app.post('/liked-products',userController.likedProducts );
// My-Product
app.post('/my-products', productController.MyProduct );
// Add Product
app.post('/add-products', upload.fields([ {name: 'pimage'}, {name: 'pimage2'} ]), productController.addProduct);
// Edit-product
app.post('/edit-product', upload.fields([ {name: 'pimage'}, {name: 'pimage2'} ]), productController.editProduct);
// Get Product
app.get('/get-product', productController.getProducts);
// Delete Product
app.post('/delete-product', productController.deleteProduct);
// Product id
app.get('/get-product/:pId', productController.getProductById );
// Signup 
app.post('/signup', userController.signup);
// my-profile
app.get('/my-profile/:userId', userController.myProfileById );
// Update user
app.post('/update-user', userController.updateUser);
//  Get-User
app.get('/get-user/:uId', userController.getUserById);
// Login
app.post('/login', userController.login );


// Socket.io
let messages = [];

io.on('connection', (Socket)=>{
  console.log('socket connected', Socket.id)

  Socket.on('sendMsg',(data) => {
    messages.push(data);
      io.emit('getMsg',messages)

})

  io.emit('getMsg',messages)
})


// Start server
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});