import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import Cetegories from "./Cetegories"
import { FaHeart } from "react-icons/fa";
import './Home.css';
import API_URL from "./constants";


function Home() {
    console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("API_URL:", API_URL);

    const navigate = useNavigate()

    const [products, setproducts] = useState([]);
    const [likedproducts, setlikedproducts] = useState([]);
    const [refresh, setrefresh] = useState(false);
    const [cproducts, setcproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [issearch, setissearch] = useState(false);

    // useEffect(() => {
    //     if (!localStorage.getItem('token')) {
    //         navigate('/login')
    //     }
    // }, [])

    useEffect(() => {
        const url = API_URL +'/get-product';
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })

       const url2 = API_URL + '/liked-products';
        let data = { userId: localStorage.getItem('userId') }

        axios.post(url2, data)
            .then((res) => {
                if (res.data.products) {
                    setlikedproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }, [refresh])

    const handlesearch = (value) => {
        setsearch(value);
    }

    const handleClick = () => {
    const userLoc = localStorage.getItem('userLoc');
  if (!userLoc) {
    alert('Please select location first');
    return;
  }

        const url = API_URL +'/search?search=' + search + '&loc=' + userLoc;
        axios.get(url)
            .then((res) => {
                setcproducts(res.data.products);
                setissearch(true);
            })
            .catch((err) => {
                alert('Server Err.')
            })

        // let filteredProducts = products.filter((item) => {
        //     if (item.pname.toLowerCase().includes(search.toLowerCase()) ||
        //         item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        //         item.category.toLowerCase().includes(search.toLowerCase())) {
        //         return item;
        //     }
        // })
        // setcproducts(filteredProducts)

    }

    const handleCategory = (value) => {
      let filteredProducts = products.filter((item, index) => {
    return item.category === value;
    });
        setcproducts(filteredProducts)
    }

    const handleLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first.')
            navigate('/login')
        }

        const url = API_URL +'/like-product';
        const data = { userId, productId }
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    // alert('Liked.')
                    setrefresh(!refresh)
                }
            })
            .catch((err) => {
                alert('Server Err.')
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


    const handleProduct = (id) => {
        navigate('/product/' + id)
    }


    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Cetegories handleCategory={handleCategory} />
            {issearch && cproducts &&
                <h5> SEARCH RESULTS
                    <button className="clear-btn" onClick={() => setissearch(false)}> CLEAR </button>
                </h5>}

            {issearch && cproducts && cproducts.length === 0 && <h5> No Results Found </h5>}
            {issearch && <div className="d-flex justify-content-center flex-wrap">
                {cproducts && products.length > 0 &&
                    cproducts.map((item, index) => {

                        return (
                            <div key={item._id} className="card m-3 ">
                                <div onClick={() => handleLike(item._id)} className="icon-con">
                                  
                                </div>
                                <img width="300px" height="200px" src={ API_URL +'/' + item.pimage} alt="" />

                                <p className="m-2"> {item.pname}  | {item.category} </p>
                                <h3 className="m-2 text-danger"> {item.price} </h3>
                                <p className="m-2 text-success"> {item.pdesc} </p>
                                  <FaHeart className="icons" />
                            </div>
                        )

                    })}
            </div>}

            {!issearch && <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => {

                        return (
                             <div
                                onClick={() => handleProduct(item._id)}
                                key={item._id}
                                className="product-card"
                                >
                                <div className="image-wrapper">
                                    <img src={API_URL + '/' + item.pimage} alt="product" />

                                    <div className="heart-icon">
                                    {
                                        likedproducts.find((likedItem) => likedItem._id === item._id)
                                        ? <FaHeart onClick={(e) => handleDisLike(item._id, e)} className="red-icons" />
                                        : <FaHeart onClick={(e) => handleLike(item._id, e)} className="icons" />
                                    }
                                    </div>
                                </div>

                                <div className="card-body">
                                    <h4 className="price">₹  {item.price}</h4>
                                    <p className="title">{item.pname}</p>
                                    <p className="category">{item.category}</p>
                                    <p className="desc">{item.pdesc}</p>
                                </div>
                                </div>
                        )

                    })}
            </div>}

        </div>
    )
}

export default Home;