import React from 'react';
import '../App.css';
import Header from '../parts/Header';

function Login() {
  return (
    <div className="LoginSigninApp">
      <Header/>
      <div className='Login'>
        <div className='FormBox'>
          <h2>Log In</h2>
          <form action="">
            <div>
              <legend>Username</legend>
              <input type="text"/>
            
              <legend>Password</legend>
              <input type="password" name="" id="" />
            </div>
            <button type="submit" className='btn'>Log in</button>

            <a href="">Forgot password?</a>
          </form>
        </div>
      </div>


      
    </div>
  );
}

export default Login;