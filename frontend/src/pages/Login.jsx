import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginRoute, addUserToOrganizationRoute } from '../utils/APIRoutes';
import logo from '../static/images/logos/swiich-secondy-logo.png';
import axios from 'axios';
import Toast from '../components/Alert';
import {
  login,
  selectCurrentUser
} from '../features/auth/authSlice';
import HandleFormInputError from '../components/HandleFormInputError';
import { postRequest, setAuthToken } from '../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
// import

function Login () {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formDate, setSetFromData] = useState({
    email: '',
    password: ''
  });
  const [formErrorMsgs, setFormErrorMsgs] = useState('');
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidPassword, setInValidPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  const redirectPath = location.state?.path || '/';

  const handleJoinNow = async () => {
    const inviteCode = localStorage.getItem('inviteCode');
    // Add user to organization then redirect.
    postRequest(addUserToOrganizationRoute, {
      userId: user?.id,
      orgId: parseInt(JSON.parse(inviteCode))
    })
      .then(res => {
        if (res?.data?.isSuccess) {
          localStorage.removeItem('inviteCode');
          navigate(redirectPath);
        }
      })
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      setApiResponse('');
      setLoading(true);
      try {
        const { email, password } = formDate;
        const { data } = await axios.post(loginRoute, { email, password });
        if (data.isSuccess) {
          setAuthToken(data.token);
          dispatch(login(data));
          if (redirectPath.includes('office')) {
            handleJoinNow();
          }
          navigate(redirectPath, { replace: true });
        } else {
          setApiResponse(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setApiResponse(error.response.data.message);
        setLoading(false);
      }
    }
  };
  const handleChange = (e) => {
    setSetFromData({ ...formDate, [e.target.name]: e.target.value });
  };
  const handleValidation = () => {
    const { email, password } = formDate;
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
          <img
            width={200}
            height={100}
            src={logo}
            alt='Logo'
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
            className='login-form'
            noValidate
          >
            {apiResponse}
            {apiResponse && (
              <Toast
                type='error'
                msg={apiResponse}
                isOpen={apiResponse.length > 0}
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
              <HandleFormInputError
                state={inValidEmail}
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
              <button
                className='submit-button button-primary button'
                type='submit'
              >
                {loading
                  ? <CircularProgress size={25} />
                  : 'Sign In'}
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
