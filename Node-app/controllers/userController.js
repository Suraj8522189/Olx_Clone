const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


  const Users = mongoose.model('Users',{
    username: String,
    mobile: String,
    email: String,
    password: String,
    likedProducts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
  
  });


module.exports.likeProducts =  (req,res) =>{
  let productId = req.body.productId;
  let userId = req.body.userId;
  console.log(req.body)

  Users.updateOne({ _id: userId},{ $addToSet: { likedProducts: productId } })
      .then(() =>{
        res.send({ message: 'Liked success.' })
      })
      .catch(() => {
        res.send({ message: 'server err' })
      })
}


module.exports.dislikeProducts =  (req,res) =>{
  let productId = req.body.productId;
  let userId = req.body.userId;
  console.log(req.body)

  Users.updateOne({ _id: userId},{ $pull: { likedProducts: productId } })
      .then(() =>{
        res.send({ message: 'DisLiked success.' })
      })
      .catch(() => {
        res.send({ message: 'server err' })
      })
}


module.exports.signup = (req,res)=>
{
  const username = req.body.username;
   const password = req.body.password;
   const email = req.body.email;
   const mobile = req.body.mobile;
  const user = new Users({username: username, password: password ,email, mobile});
  user.save().then(()=>{
     res.send({message:'saved success'})
  })
  .catch(()=>{
    res.send({message:'server err'})
  })


}


module.exports.myProfileById =  (req,res)=>{
  const uid = req.params.userId

  Users.findOne({ _id : uid })
    .then((result)=>{
     res.send({message: 'success',user: {
      email: result.email,
      mobile: result.mobile,
      username: result.username} })
  })
  .catch(()=>{
    res.send({message:'server err'})
  })
}

module.exports.updateUser = (req, res) => {

  const uid = req.body.userId
  const username = req.body.username
  const email = req.body.email
  const mobile = req.body.mobile

  Users.updateOne(
    { _id: uid },
    { username: username, email: email, mobile: mobile }
  )
    .then(() => {
      res.send({ message: 'updated success' })
    })
    .catch(() => {
      res.send({ message: 'server err' })
    })

}

module.exports.getUserById =  (req,res)=>{

  const _userId = req.params.uId;
    Users.findOne({ _id: _userId })
    .then((result)=>{
     res.send({message: 'success',user: {
      email: result.email,
      mobile: result.mobile,
      username: result.username} })
  })
  .catch(()=>{
    res.send({message:'server err'})
  })
}


module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  Users.findOne({ email })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Email not found" });
      }

      if (result.password !== password) {
        return res.status(401).send({ message: "Password wrong" });
      }

      const token = jwt.sign(
        { userId: result._id },
        "Mykey",
        { expiresIn: "1h" }
      );

      res.send({
        message: "Login success",
        token: token,
        userId: result._id,
        username: result.username
      });
    })
    .catch((err) => {
      console.error("Login Error:", err);
      res.status(500).send({ message: "server err" });
    });
};



module.exports.likedProducts = (req, res) => {
  Users.findOne({ _id: req.body.userId })
    .populate('likedProducts')  //  correct field
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'User not found', products: [] });
      }
      res.send({ message: 'Success', products: result.likedProducts });
    })
    .catch((err) => {
      console.error(' liked-products error:', err); 
      res.status(500).send({ message: 'server err' });
    });
}