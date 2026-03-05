import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import API_URL from './constants';

export default function MyProfile() {

  const [user, setuser] = useState({})
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    let url = API_URL + '/get-user/' + localStorage.getItem('userId');

    axios.get(url)
      .then((res) => {
        if (res.data.user) {
          setuser(res.data.user);
        }
      })
      .catch((err) => {
        alert('server err')
      })
  }, [])

  const handleChange = (e) => {

    setuser({
      ...user,
      [e.target.name]: e.target.value
    })

  }

  const updateProfile = () => {

    axios.post(API_URL + '/update-user', {
      userId: localStorage.getItem('userId'),
      username: user.username,
      email: user.email,
      mobile: user.mobile
    })
      .then((res) => {
        if (res.data.message === 'updated success') {
          alert('Profile Updated')
          setEditMode(false)
        }
      })
      .catch(() => {
        alert('server err')
      })

  }

  return (
    <div>

      <Header />

      <div className='m-3 p-3'>

        <h3 className='text-center mt-2'> USER PROFILE </h3>

        <table className='table table-dark table-bordered'>

          <thead>
            <tr>
              <td>USERNAME</td>
              <td>EMAIL ID</td>
              <td>MOBILE</td>
            </tr>
          </thead>

          <tbody>
            <tr>

              <td>
                {editMode ?
                  <input name="username" value={user.username} onChange={handleChange} />
                  :
                  user.username
                }
              </td>

              <td>
                {editMode ?
                  <input name="email" value={user.email} onChange={handleChange} />
                  :
                  user.email
                }
              </td>

              <td>
                {editMode ?
                  <input name="mobile" value={user.mobile} onChange={handleChange} />
                  :
                  user.mobile
                }
              </td>

            </tr>

          </tbody>

        </table>

        {!editMode ?

          <button
            className='btn btn-primary'
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>

          :

          <button
            className='btn btn-success'
            onClick={updateProfile}
          >
            Save Changes
          </button>

        }

      </div>

    </div>
  )
}