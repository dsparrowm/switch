import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkEmailRoute } from '../utils/APIRoutes';
import Alert from '../components/Alert';

function Register () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [inValidEmail, setInValidEmail] = useState(false);
  const [emailCheckFailed, setEmailCheckFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        // dispatch(login({email: 'Some emai', name: 'some name'}))
        const { data } = await axios.post(checkEmailRoute, { email });
        if (data) {
          console.log(data);
          localStorage.setItem('signup-email', email);
          navigate('/confirmemail');
        } else {
          setEmailCheckFailed(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleValidation = () => {
    if (!isValidEmail(email)) {
      setInValidEmail(true);
      if (!email) {
        setEmailErrorMsg('Required field - Please enter an email.');
      } else {
        setEmailErrorMsg('Invalid email address. Please check and try again.');
      }
      return false;
    }

    setInValidEmail(false);
    setEmailErrorMsg('');
    return true;
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
      <main className='form-container'>
        <h1>
          Enter your work email
        </h1>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className='register-form'
          noValidate
        >
          {emailCheckFailed && (
            <div className='form-group'>
              <Alert type='error' msg='Email Check has failed' />
            </div>
          )}
          <div className='form-group'>
            <input
              type='email'
              placeholder='name@work-email.com'
              name='email'
              className={`${inValidEmail ? 'invalid' : email && 'valid'}`}
              onChange={(e) => handleChange(e)}
            />
            <p className={`form-help ${inValidEmail ? 'valid' : 'hidden'}`}>
              <span className='form-field-icon'>i</span>
              {emailErrorMsg}
            </p>
          </div>
          <div className='form-group'>
            <button
              className='submit-button button-secondry button'
              type='submit'
            >
              Next
            </button>
          </div>
          <span className='alternate-action'>
            Already have an account?
            <Link to='/login'> Sign in</Link>
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

    h1 {
      font-size: var(--font-size-xxx-large);
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
`;

export default Register;
