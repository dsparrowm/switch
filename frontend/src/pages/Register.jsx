import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import logo from '../static/images/logos/swiich-secondy-logo.png';
import { registerRoute } from '../utils/APIRoutes';
import { login } from '../features/auth/authSlice';
import Toast from '../components/Alert';
import HandleFormInputError from '../components/HandleFormInputError';

function Register () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formDate, setSetFromData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrorMsgs, setFormErrorMsgs] = useState('');
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidFirstName, setInValidFirstName] = useState(false);
  const [inValidLastName, setInValidLastName] = useState(false);
  const [inValidPassword, setInValidPassword] = useState(false);
  const [inValidConfirmPassword, setInValidConfirmPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse('');
    if (handleValidation()) {
      const { email, firstname, lastname, password } = formDate;
      const fullName = `${firstname} ${lastname}`;
      try {
        const { data } = await axios.post(registerRoute, {
          email,
          password,
          name: fullName
        });
        if (data.isSuccess) {
          localStorage.setItem('access_token', data.token);
          dispatch(login(data));
          navigate('/confirmemail');
        } else {
          setApiResponse(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleChange = (e) => {
    setSetFromData({ ...formDate, [e.target.name]: e.target.value });
  };
  const handleValidation = () => {
    const { email, firstname, lastname, password, confirmPassword } = formDate;
    if (!isValidEmail(email)) {
      setInValidEmail(true);
      if (!email) {
        setFormErrorMsgs('Required field - Please enter an Email.');
      } else {
        setFormErrorMsgs('Invalid! email address. Please check and try again.');
      }
      return false;
    } else if (!firstname || firstname.length < 4) {
      setInValidFirstName(true);
      setInValidEmail(false);
      if (!firstname) {
        setFormErrorMsgs('Required field - Please enter your First Name.');
      } else {
        setFormErrorMsgs('Invalid! First Name can not be less than 4-characters.');
      }
      return false;
    } else if (!lastname || lastname.length < 4) {
      setInValidLastName(true);
      setInValidFirstName(false);
      if (!lastname) {
        setFormErrorMsgs('Required field - Please enter your Last Name.');
      } else {
        setFormErrorMsgs('Invalid! Last Name can not be less than 4-characters.');
      }
      return false;
    } else if (!password || password.length < 6) {
      setInValidPassword(true);
      setInValidLastName(false);
      if (!password) {
        setFormErrorMsgs('Required field - Please set Password.');
      } else {
        setFormErrorMsgs('Invalid! Password can not be less than 6-characters/numbers.');
      }
      return false;
    } else if (confirmPassword !== password ) {
      setInValidConfirmPassword(true);
      setInValidPassword(false);
      if (!confirmPassword) {
        setFormErrorMsgs('Required field - Please confirm your Password.');
      } else {
        setFormErrorMsgs('Invalid! Must match Password.');
      }
      return false;
    } else {
      setInValidEmail(false);
      setInValidFirstName(false);
      setInValidLastName(false);
      setInValidPassword(false);
      setInValidConfirmPassword(false);
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
          <img
            width={200}
            height={100}
            src={logo}
            alt='Swiich Logo'
          />
        </div>
      </header>
      <div className='main-container'>
        <main>
          <h1>
            Enter your work email
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='register-form'
            noValidate
          >
            {apiResponse && (
              <Toast
                type='error'
                isOpen={apiResponse.length}
                msg={apiResponse}
              />)}
            <div className='form-group'>
              <input
                type='email'
                placeholder='name@work-email.com'
                name='email'
                className={`${inValidEmail ? 'invalid' : formDate.email && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidEmail}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='First Name'
                name='firstname'
                className={`${inValidFirstName ? 'invalid' : formDate.firstname && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidFirstName}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Last Name'
                name='lastname'
                className={`${inValidLastName ? 'invalid' : formDate.lastname && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidLastName}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Password'
                name='password'
                className={`${inValidPassword ? 'invalid' : formDate.password && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidPassword}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                className={`${inValidConfirmPassword ? 'invalid' : formDate.confirmPassword && 'valid'}`}
                onChange={(e) => handleChange(e)}
              />
              <HandleFormInputError
                state={inValidConfirmPassword}
                msg={formErrorMsgs}
              />
            </div>
            <div className='form-group'>
              <button
                className='submit-button button-primary button'
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

export default Register;
