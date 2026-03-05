import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";
import API_URL from "./constants";

function Login() {
    const navigate = useNavigate();

    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState('');
    const [loading, setloading] = useState(false);

    const handleApi = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            seterror("All fields are required");
            return;
        }

        try {
            setloading(true);
            seterror('');

            const url = API_URL + '/login';
            const data = { email, password };

            const res = await axios.post(url, data);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('userName', res.data.username);
                navigate('/');
            } else {
                seterror(res.data.message || "Login failed");
            }

        } catch (err) {
            seterror("Server Error");
        } finally {
            setloading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="p-3 m-3" style={{ maxWidth: "400px", margin: "auto" }}>
                <h3>Login</h3>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleApi}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <Link to="/signup">Create New Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;