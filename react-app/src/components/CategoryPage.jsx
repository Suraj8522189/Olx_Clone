import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Link ,useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import Cetegories from './Cetegories';
import { FaHeart } from "react-icons/fa";
import './Home.css'
import API_URL from './constants';

export default function CategoryPage() {

      const navigate = useNavigate()

      const param = useParams()
      console.log(param)

      const [products , setproducts] = useState([]);
      const [cproducts , setcproducts] = useState([]);
      const [search , setsearch] = useState(['']);
       const [issearch , setissearch] = useState(false);
       const [likedproducts, setlikedproducts] = useState([]);
      const [refresh, setrefresh] = useState(false);



    // useEffect(()=>{
    //  if(!localStorage.getItem('token')){
    //   navigate('/login')
    //  }
    // },[])

     useEffect(()=>{
    const url = API_URL + '/get-product?catName=' + param.catName;
    axios.get(url)
    .then((res) =>{
      if(res.data.products){
        setproducts(res.data.products);
        
      }
    })
    .catch((err)=>{
      alert('server err',err)
    })

     const url2 = API_URL +'/liked-products';
        let data ={ userId:localStorage.getItem('userId') }
        axios.post(url2, data)
            .then((res) => {
                if (res.data.products) {
                    setlikedproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    },[param,refresh])

    const handlesearch = (value) => {
     setsearch(value)
    }
     const handleclick = () => {

    const url = API_URL + '/search?search=' + search + '&loc=' + localStorage.getItem('userLoc');
    axios.get(url)
    .then((res) =>{
     setcproducts(res.data.products);
     setissearch(true)
    })
    .catch((err)=>{
      alert('server err',err)
    })

    //  setsearch('products' ,products);
    //  let filteredProducts = products.filter((item)=>{
    //     if(item.pname.toLowerCase().includes(search.toLowerCase()) ||
    //     item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
    //     item.category.toLowerCase().includes(search.toLowerCase())){
    //       return item;
    //     }
    //  })
    //  setcproducts(filteredProducts)
    }

    const handleCategory =(value) => {
        let filteredProducts = products.filter((item,index)=>{
        if(item.category == value){
          return item;
        }
     })
     setcproducts(filteredProducts)
    }

    const handleLike = (productId, e) => {
      e.stopPropagation();
      let userId = localStorage.getItem('userId');

    const url = API_URL + '/like-product';
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


       const handleDisLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first.')
            return;
        }

        const url = API_URL +'/dislike-product';
        const data = { userId, productId }
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    // alert('DisLiked.')
                    setrefresh(!refresh)
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })

    }


    const handleProduct = (id) =>{
      navigate('/product/'+id)
    }

  return (
  <div>
    <Header search={search} handlesearch={handlesearch} handleclick={handleclick} />
    <Cetegories handleCategory={handleCategory} />

    <div className="container mt-4">

      {/* SEARCH RESULT SECTION */}
      {issearch && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Search Results</h4>
            <button className="btn btn-sm btn-outline-danger" onClick={() => setissearch(false)}>
              Clear
            </button>
          </div>

          {cproducts.length === 0 && (
            <div className="text-center text-muted">No Results Found</div>
          )}

          <div className="row">
            {cproducts.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card shadow border-0 h-100 product-card">

                  <div className="position-relative">
                    <img
                      src={API_URL + '/' + item.pimage}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt=""
                    />

                    <div
                      className="position-absolute top-0 end-0 m-2 bg-white p-2 rounded-circle shadow"
                      style={{ cursor: "pointer" }}
                    >
                      <FaHeart className="icons" />
                    </div>
                  </div>

                  <div className="card-body">
                    <h5>{item.pname}</h5>
                    <p className="text-muted">{item.category}</p>
                    <h6 className="text-danger">₹ {item.price}</h6>
                    <p className="text-success small">{item.pdesc}</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CATEGORY PRODUCTS */}
      {!issearch && (
        <>
          <h4 className="mb-4 text-center text-capitalize">
            {param.catName} Products
          </h4>

          <div className="row">
            {products.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div
                  onClick={() => handleProduct(item._id)}
                  className="card shadow border-0 h-100 product-card"
                  style={{ cursor: "pointer" }}
                >

                  <div className="position-relative">
                    <img
                      src={API_URL + '/' + item.pimage}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt=""
                    />

                    <div className="position-absolute top-0 end-0 m-2">
                      {
                        likedproducts.find((likedItem) => likedItem._id == item._id) ?
                          <FaHeart
                            onClick={(e) => handleDisLike(item._id, e)}
                            className="text-danger"
                            size={22}
                          />
                          :
                          <FaHeart
                            onClick={(e) => handleLike(item._id, e)}
                            className="text-secondary"
                            size={22}
                          />
                      }
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5>{item.pname}</h5>
                    <p className="text-muted">{item.category}</p>
                    <h6 className="text-danger">₹ {item.price}</h6>
                    <p className="text-success small flex-grow-1">
                      {item.pdesc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  </div>
);
}
