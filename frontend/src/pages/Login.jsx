import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { loginRoute } from '../utils/APIRoutes';
import axios from 'axios';
import Toast from '../components/Alert';

function Login () {
  const navigate = useNavigate();
  const [formDate, setSetFromData] = useState({
    email: '',
    password: '',
  });
  const [formErrorMsgs, setFormErrorMsgs] = useState('');
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidPassword, setInValidPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        const { email, password} = formDate;
        const { data } = await axios.post(loginRoute, { email, password });
        if (data.isSuccess) {
          navigate('/');
        } else {
          setApiResponse(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleChange = (e) => {
    setSetFromData({...formDate, [e.target.name]: e.target.value });
  };
  const handleValidation = () => {
    const { email, password} = formDate;
    if (!isValidEmail(email)) {
      setInValidEmail(true);
      if (!email) {
        setFormErrorMsgs('Required field - Please enter an email.');
      } else {
        setFormErrorMsgs('Invalid email address. Please check and try again.');
      }
      return false;
    } else if (!password || password.length < 6) {
      setInValidPassword(true);
      setInValidEmail(false);
      if (!password) {
        setFormErrorMsgs('Required field - Please set Password.');
      } else {
        setFormErrorMsgs('Invalid! Password can not be less than 6-characters/numbers.');
      }
      return false;
    } else {
      setInValidEmail(false);
      setInValidPassword(false);
      setFormErrorMsgs('');
      return true;
    }

  };
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <PageWrapper>
      <header className='header'>
        <div className='brand'>
          <img src='' alt='Logo' />
        </div>
      </header>
      <div className='main-container'>
        <main>
          <h1>
            Enter your work email
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='login-form'
            noValidate
          >
            {apiResponse && (
              <Toast
                type='error'
                msg={apiResponse}
                isOpen={apiResponse.length ? true : false}
              />
            )}
            <div className='form-group'>
              <input
                type='email'
                placeholder='name@work-email.com'
                name='email'
                className={`${inValidEmail ? 'invalid' : formDate.email && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <p className={`form-help ${inValidEmail ? 'valid' : 'hidden'}`}>
                <span className='form-field-icon'>i</span>
                {formErrorMsgs}
              </p>
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                className={`${inValidPassword ? 'invalid' : formDate.password && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <p className={`form-help ${inValidPassword ? 'valid' : 'hidden'}`}>
                <span className='form-field-icon'>i</span>
                {formErrorMsgs}
              </p>
            </div>
            <div className='form-group'>
              <button
                className='submit-button button-secondry button'
                type='submit'
              >
                Sign In
              </button>
            </div>
            <span className='alternate-action'>
              Don't have an account?
              <Link to='/register'> Create a new account</Link>
            </span>
          </form>
        </main>
        <footer className='footer'>
          <span>Contact Us</span>
        </footer>
      </div>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0 1rem; 
  top: 0;
  left: 0;

  header, footer {
    text-align: center;
    padding: 2rem 0;
  }

  footer {
    margin-top: auto;
  }

  .main-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 0 var(--padding-sm);

    main {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      text-align: center;
      background-color: var(--light-grey);
      padding: 0 0.5rem;
      padding-bottom: 2rem;
      border-radius: var(--border-redius-small);
  
      h1 {
        font-size: var(--font-size-xx-large);
        letter-spacing: -.75px;
        line-height: 46px;
      }
  
      form {
        max-width: 400px;
        width: 100%;
        margin: 0 auto;
  
        input {
          font-size: var(--font-size-large);
          font-weight: var(--font-weight-bold);
        }
  
        .form-help {
          color: var(--error-color);
        }
      }
  
    }
  }
`;

export default Login;
