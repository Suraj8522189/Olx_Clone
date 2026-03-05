import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import API_URL from './constants';
import io from 'socket.io-client';
let socket;

function ProductDetail() {

    const navigate = useNavigate()
    
    const [product, setproduct] = useState()
    const [msg, setmsg] = useState('')
    const [msgs, setmsgs] = useState([])
    const [user, setuser] = useState()
    // console.log(user, "userrrrr")
    const p = useParams()


    useEffect(() => {
        socket = io(API_URL)

        socket.on('connect', () => {
            console.log('con')
        })
        return () => {
            socket.off()
        }

    }, [])

    useEffect(() => {

        socket.on('getMsg', (data) => {

            const _data = data.filter((item, index) => {
                return item.productId == p.productId
            })
            console.log(_data, "_data")
            setmsgs(_data)
        })
    }, [p.productId])

    const handleSend = () => {
        let userId = localStorage.getItem('userId');

       if (!userId) {
            alert('Please Login first.')
            navigate('/login')
        }
        const data = { username: localStorage.getItem('userName'), msg, productId: localStorage.getItem('productId') }
        console.log(data, "data send")
        socket.emit('sendMsg', data)
        setmsg('')
    }

    useEffect(() => {
        const url = API_URL + '/get-product/' + p.productId;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    setproduct(res.data.product)
                    localStorage.setItem('productId', res.data.product._id)
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }, [])


    const handleContact = (addedBy) => {
        // console.log('id', addedBy)
        const url = API_URL + '/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setuser(res.data.user)
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }

   return (
  <>
    <Header />

    <div className="container mt-4">
      {product && (
        <div className="row">

          {/* LEFT SIDE - PRODUCT DETAILS */}
          <div className="col-md-7">
            <div className="card shadow p-3">
              <img
                className="img-fluid rounded mb-3"
                src={API_URL + '/' + product.pimage}
                alt="" height="100px" width="300px"
              />

              {product.pimage2 && (
                <img
                  className="img-fluid rounded mb-3"
                  src={API_URL + '/' + product.pimage2}
                  alt="" height="100px" width="300px"
                />
              )}

              <h3 className="text-primary">{product.pname}</h3>
              <h4 className="text-danger">₹ {product.price}</h4>
              <p className="text-muted">{product.category}</p>

              <hr />
              <h5>Description</h5>
              <p>{product.pdesc}</p>

              {product.addedBy && (
                <button
                  onClick={() => handleContact(product.addedBy)}
                  className="btn btn-dark mt-2"
                >
                  Show Contact Details
                </button>
              )}

              {user && (
                <div className="mt-3 p-3 border rounded bg-light">
                  <h5>Seller Info</h5>
                  <p><strong>Name:</strong> {user.username}</p>
                  <p><strong>Mobile:</strong> {user.mobile}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - CHAT */}
          <div className="col-md-5">
            <div className="card shadow p-3 chat-box">
              <h5 className="mb-3">Live Chat</h5>

              <div
                style={{
                  height: "350px",
                  overflowY: "auto",
                  background: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "8px"
                }}
              >
                {msgs &&
                  msgs.map((item) => (
                    <div
                      key={item._id}
                      className={`d-flex mb-2 ${
                        item.username === localStorage.getItem("userName")
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        style={{
                          background:
                            item.username === localStorage.getItem("userName")
                              ? "#0d6efd"
                              : "#343a40",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "15px",
                          maxWidth: "70%",
                        }}
                      >
                        <small>{item.username}</small>
                        <div>{item.msg}</div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="d-flex mt-3">
                <input
                  value={msg}
                  onChange={(e) => setmsg(e.target.value)}
                  className="form-control me-2"
                  type="text"
                  placeholder="Type message..."
                />
                <button onClick={handleSend} className="btn btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  </>
);
}

export default ProductDetail;



