import React from 'react'
import './Header.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import cetegories from './cetegoriesList';

export default function Cetegories(props) {

  const navigate = useNavigate();


  return (
    <div className='cat-container'> 
    <div>
       <span 
        className='pr-3'
        onClick={() => navigate('/')}
      >
        All Categories
      </span> 
           
 
        {cetegories && cetegories.length > 0 &&
           cetegories.map((item,index) => {
            return(
                <span onClick={() => navigate('/category/' + item)} key={index} className='category'> {item} </span>

            )
           })}
        </div>

    </div>
  )
}
