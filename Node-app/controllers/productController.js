const mongoose = require('mongoose');



  let Schema = new mongoose.Schema({

    pname: String,
    pdesc: String,
    price: String,
    category: String, 
    pimage: String,
    pimage2: String,
    addedBy : mongoose.Schema.Types.ObjectId,
    ploc : {
      type: {
        type : String,
        enum : ['Point'],
        default : 'Point'
      },
      coordinates : {
        type : [Number]
      }
    }
  })

  Schema.index({ ploc: '2dsphere'});

  const Products = mongoose.model('Products',Schema);



module.exports.search =  (req, res) => {

  if (!req.query.loc) {
    return res.status(400).send({ message: "Location required" });
  }

  let [latitude, longitude] = req.query.loc.split(',');
  let search = req.query.search || '';

  Products.find({
    $or: [
      { pname: { $regex: search, $options: 'i' } },
      { pdesc: { $regex: search, $options: 'i' } },
      { price: { $regex: search  } },
    ],
    ploc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: 100000, // 100 km
      }
    }
  })
    .then((results) => {
      res.send({ message: 'success', products: results })
      

    })
    .catch((err) => {
      console.log("Search Error:", err);
      res.status(500).send({ message: 'server err' })
    })
}


module.exports.addProduct = (req,res)=>{

  console.log("files" , req.files)
  console.log("BODY:", req.body);
    const plat = parseFloat(req.body.plat);
    const plong = parseFloat(req.body.plong);
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const price = req.body.price;
    const category = req.body.category;
    const pimage = req.files.pimage[0].path;
    const pimage2 = req.files.pimage2[0].path;
    const addedBy = req.body.userId;


  const product = new Products({ pname, pdesc, price, category, pimage, pimage2, addedBy ,
    ploc: { 
  type: 'Point', 
  coordinates: [plong, plat]   //  longitude first, latitude second
}});
  product.save().then(()=>{
     res.send({message:'saved success'})
  })
  .catch(()=>{
    res.send({message:'server err'})
  })

}


module.exports.editProduct = (req,res)=>{

  console.log("files" , req.files)
  console.log("BODY:", req.body);
    
    const pid = req.body.pid;
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const price = req.body.price;
    const category = req.body.category;
    let pimage = '';
    let pimage2 = '';
    if(req.files && req.files.pimage && req.files.pimage.length > 0){
     pimage = req.files.pimage[0].path;
    }
    if(req.files && req.files.pimage2 && req.files.pimage.length > 0){
     pimage2 = req.files.pimage2[0].path;
    }
    // const addedBy = req.body.userId;


//   const product = new Products({ pname, pdesc, price, category, pimage, pimage2, addedBy ,
//     ploc: { 
//   type: 'Point', 
//   coordinates: [plong, plat]   
// }});

  let editObj = {};
  if(pname){
    editObj.pname = pname;
  }
  if(pdesc){
    editObj.pdesc = pdesc;
  }
  if(price){
    editObj.price = price;
  }
   if(category){
    editObj.category = category;
  }
   if(pimage){
    editObj.pimage = pimage;
  }
   if(pimage2){
    editObj.pimage2 = pimage2;
  }
  

  Products.updateOne({ _id: pid }, editObj, {new: true})
  .then((result)=>{
     res.send({message:'saved success' , product : result})
  })
  .catch(()=>{
    res.send({message:'server err'})
  })

}


module.exports.getProducts = (req, res) => {

  const catName = req.query.catName;
  let _f = {}

  if(catName){
    _f = {category: catName}
  }

  Products.find(_f)
    .then((result) => {
      res.send({ products: result });
    })
    .catch(() => {
      res.send({ message: 'server err' });
    });
}


module.exports.getProductById = (req, res) => {

  console.log(req.params)
  Products.findOne({ _id : req.params.pId} )
    .then((result) => {
      res.send({message: 'success', product: result });
    })
    .catch(() => {
      res.send({ message: 'server err' });
    });
}


module.exports.MyProduct = (req, res) => {

  const userId = req.body.userId;

  Products.find({ addedBy: userId })
    .then((result) => {
      res.send({ message: 'Success', products: result }); 
    })
    .catch((err) => {
      res.status(500).send({ message: 'server err' });
    });
}


module.exports.deleteProduct = (req,res) => {
  Products.findOne({ _id: req.body.pid })
  .then((result) => {
    if(result.addedBy == req.body.userId){
      Products.deleteOne({ _id: req.body.pid })
      .then((deleteResult)=>{
        if(deleteResult.acknowledged){
          res.send({ message: 'success' })
        }
      })
       .catch(() => {
      res.send({ message: 'server err' });
    });
    }
  })
   .catch(() => {
      res.send({ message: 'server err' });
    });
}

