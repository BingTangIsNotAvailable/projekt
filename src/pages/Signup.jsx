import React from 'react';
import '../App.css';
import Header from '../parts/Header';

function Signup() {
  return (
    <div className="LoginSigninApp">
      <Header/>
      <div className='Signup'>
        <div className='FormBox'>
          <h2>Sign Up</h2>
          <form action="">
            <div>
              <legend>Username</legend>
              <input type="text"/>

              <legend>Password</legend>
              <input type="password"/>

              <legend>Email</legend>
              <input type="email"/>
            
            </div>
            <button type="submit" className='btn'>Sign up</button>
            <a href="/Login">Already have an account?</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;