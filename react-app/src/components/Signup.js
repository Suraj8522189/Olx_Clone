import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";
import API_URL from "./constants";
// import API_URL from "../constants";

function Signup() {

      const navigate = useNavigate()

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [email, setemail] = useState('');
    const [mobile, setmobile] = useState('');


    const handleApi = () => {

      if (!username || !email || !mobile || !password) {
      alert("Please fill in both fields");
      return;
      }

        const url = API_URL +'/signup';
        const data = { username, password, mobile, email };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert(navigate('/'));
                }
            })
            .catch((err) => {
                alert('SERVER ERR')
            })
    }
    return (
        <div>
            <Header />
            <div className="p-3 m-3">
                <h3> Welcome to Signup Page </h3>
                <br></br>
                USERNAME
                <input className="form-control" type="text" placeholder="FullName" value={username}
                    onChange={(e) => {
                        setusername(e.target.value)
                    }} />
                <br></br>
                MOBILE
                <input className="form-control" type="text" placeholder="+91-12345 67890" value={mobile}
                    onChange={(e) => {
                        setmobile(e.target.value)
                    }} />
                <br></br>
                EMAIL
                <input className="form-control" type="text" placeholder="User@gmail.com" value={email}
                    onChange={(e) => {
                        setemail(e.target.value)
                    }} />
                <br></br>
                PASSWORD
                <input className="form-control" type="password" placeholder="******" value={password}
                    onChange={(e) => {
                        setpassword(e.target.value)
                    }} />
                <br></br>
                <button className="btn btn-primary mr-3" onClick={handleApi}> SIGNUP </button>
                  <p>
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                    </p>
            </div>
        </div>
    )
}

export default Signup;