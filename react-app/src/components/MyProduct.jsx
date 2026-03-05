import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
import Cetegories from './Cetegories';
import { FaHeart } from "react-icons/fa";
import './Home.css'
import API_URL from './constants';

export default function MyProducts() {

      const navigate = useNavigate()
      const [products , setproducts] = useState([]);
      const [cproducts , setcproducts] = useState([]);
      const [search , setsearch] = useState(['']);
      const [refresh , setrefresh] = useState(false);


    // useEffect(()=>{
    //  if(!localStorage.getItem('token')){
    //   navigate('/login')
    //  }
    // },[])

     useEffect(()=>{
    const url = API_URL +'/my-products';
    let data = { userId:localStorage.getItem('userId') }
    axios.post(url,data)
    .then((res) =>{
      if(res.data.products){
        console.log(res.data.products)
        setproducts(res.data.products);
     

      }
    })
    .catch((err)=>{
      alert('server err',err)
      console.log(err)
    })
    },[refresh])

    const handlesearch = (value) => {
     setsearch(value)
    }
     const handleclick = () => {
     setsearch('products' ,products);
 let filteredProducts = products.filter((item) => {
    return (
        item.pname.toLowerCase().includes(search.toLowerCase()) ||
        item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );
});
     setcproducts(filteredProducts)
    }

    const handleCategory =(value) => {
    let filteredProducts = products.filter((item, index) => {
    return item.category === value;
    });
     setcproducts(filteredProducts)
    }

    const handleLike = (productId) => {
      let userId = localStorage.getItem('userId');

    const url = API_URL +'/like-product';
    const data = { userId, productId }
    axios.post(url,data)
    .then((res) =>{
      if(res.data.message){
        alert('liked.')
      }
    })
    .catch((err)=>{
      alert('server err',err)
    })
    }


    const handleDel = (pid)=>{
      if(!localStorage.getItem('userId')){
        alert('please login First')
        return;
      }
      const url = API_URL + '/delete-product';
      const data ={
        pid,
        userId : localStorage.getItem('userId')
      }
      axios.post(url, data)
      .then((res) =>{
        if(res.data.message){
          alert('Delete Sucess')
          setrefresh(!refresh)
        }
      }).catch((err) => {
        alert('server Err')
      })
    }

  return (
    <div>
        <Header search={search} handlesearch={handlesearch} handleclick ={handleclick} />
        <Cetegories handleCategory={handleCategory} />


     <div className="d-flex justify-content-center flex-wrap">
      {cproducts && products.length > 0 && 
        cproducts.map((item, index) => {

          return(
            
            <div className="card m-3" key={item._id}>
                 <div onClick={() => handleLike(item._id)} className='icon-con'> 
                <FaHeart className='icons' />
              </div>
            <img width="300px" alt='' height="200px"  src={ API_URL +'/' + item.pimage}></img>
            <p className="m-2" >{item.pname} | {item.category}</p>
            <h3 className="m-2 text-danger">{item.price}</h3>
            <p className="m-2 text-success"> {item.pdesc} </p>
         

            </div>
          )
        }) }
      </div>
            <h5> ALL RESULT </h5>

      <div className="d-flex justify-content-center flex-wrap">
      {products && products.length > 0 && 
        products.map((item, index) => {

          return(
            
            <div className="card m-3" key={item._id}>
              <div onClick={() => handleLike(item._id)} className='icon-con'> 
                <FaHeart className='icons' />
              </div>
            <img width="300px" height="200px"  src={ API_URL +'/' + item.pimage} alt='' ></img>
            <p className="m-2" >{item.pname} | {item.category}</p>
            <h3 className="m-2 text-danger">₹ {item.price}</h3>
            <p className="m-2 text-success"> {item.pdesc} </p>
            <p className="m-2 text-success"> 
              <Link to={ `/edit-product/${item._id}` }> Edit Product </Link> 
            </p>
            <button onClick={()=>handleDel(item._id)} > DELETE PRODUCT </button>
            <button onClick={()=>navigate('/product/' + item._id)} > PRODUCT DETAILS </button>
         

            </div>
          )
        }) }
      </div>

      

    </div>
  )
}
