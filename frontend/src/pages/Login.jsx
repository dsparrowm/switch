import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Login () {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    console.log(e);
  };

  return (
    <PageWrapper>
      <header className='header'>
        <div className='brand'>
          <img src='' alt='Logo' />
        </div>
      </header>
      <main className='form-container'>
        <h1>
          Enter your work email
        </h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className='login-form'
        >
          {/* <div className='form-group'>
            <input
              type='text'
              placeholder='Username'
              name='username'
              onChange={(e) => handleChange(e)}
            />
          </div> */}
          <div className='form-group'>
            <input
              type='email'
              placeholder='name@work-email.com'
              name='email'
              onChange={(e) => handleChange(e)}
            />
          </div>
          {/* <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password'
              onChange={(e) => handleChange(e)}
            />
          </div> */}
          <div className='form-group'>
            <button
              className='submit-btn button-secondry button'
              type='submit'
            >
              Sign In
            </button>
          </div>
          <span>
            Don't have an account?
            <Link to='/register'>Create a new account</Link>
          </span>
        </form>
      </main>
      <footer className='footer'>
        <span>Contact Us</span>
      </footer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  header, footer {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    max-width: 800px;
    width: 100%;
    height: 80%;
    text-align: center;

    form {
      max-width: 400px;
      width: 100%;
      margin: 0 auto;

      input {
        font-size: var(--font-size-large);
        font-weight: var(--font-weight-bold);
      }

      .submit-btn {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
        font-weight: var(--font-weight-bold);
      }
    }

  }
`;

export default Login;
