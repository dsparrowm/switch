import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtpRoute, addUserToOrganizationRoute } from '../utils/APIRoutes';
import { selectCurrentUser } from '../features/auth/authSlice';
import AlertHandler from '../components/Alert';
import CreateOranisationModal from '../components/modals/CreateOrganizationModal';
import logo from '../static/images/logos/swiich-secondy-logo.png';
import { postRequest } from '../utils/api';

function ConfirmEmail () {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const user = useSelector(selectCurrentUser);
  const [otp, setOtp] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [codeObj, setCodeObj] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: ''
  });

  const redirectPath = location.state?.path || '/';

  const handleJoinNow = async () => {
    const inviteCode = localStorage.getItem('inviteCode');
    // Add user to organization then redirect.
    postRequest(addUserToOrganizationRoute, {
      userId: user.id,
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

  const verifyOtp = async () => {
    setApiResponse('');
    postRequest(verifyOtpRoute, {
      user_id: user.id,
      otp
    })
      .then(res => {
        if (res?.data?.isSuccess) {
          setApiResponse(res?.data?.message);
          if (redirectPath.includes('office')) {
            handleJoinNow();
            navigate(redirectPath, { replace: true });
          } else {
            setOpenCreateModal(true);
          }
        } else {
          setApiResponse(res?.data?.message);
        }
      })
      .catch(err => console.error(err));
  };

  
  useEffect(() => {
    const fullcode = Object.values(codeObj).join('');
    if (fullcode.length > 5) {
      setOtp(fullcode);
    }
    // eslint-disable-next-line
  }, [codeObj.six]);
  
  useEffect(() => {
    if (otp.length) {
      verifyOtp();
    }
  }, [otp]);
  
  const handleChange = (event) => {
    setCodeObj({ ...codeObj, [event.target.name]: event.target.value });
  };

  const changeInputField = (event) => {
    const charCode = event.which;
    // Check if a character is deleted and then moves to the previous page
    if ((charCode === 8 || charCode === 46) && event.target.value.length < 1) {
      const previousSibling = event.target.previousElementSibling;
      const parentPreviousSibling = event.target.parentElement.previousElementSibling;
      if (previousSibling === null && parentPreviousSibling) {
        // Skip the divider to the prevoius input field
        parentPreviousSibling.previousElementSibling.children[2].focus();
        return;
      } else if (previousSibling === null && parentPreviousSibling === null) {
        return;
      }
      event.target.previousElementSibling.focus();
    } else if (
      // Does character checks to prevent empty fields and moves to the next input field
      event.target.value
    ) {
      const nextSibling = event.target.nextElementSibling;
      const parentNextSibling = event.target.parentElement.nextElementSibling;

      // Check that current input's parent has a sibling also
      if (nextSibling === null && parentNextSibling) {
        // Skip the divider to the next input field
        parentNextSibling.nextElementSibling.children[0].focus();
        return;
      } else if (nextSibling === null && parentNextSibling === null) {
        return;
      }
      event.target.nextElementSibling.focus();
    } else {
      event.preventDefault();
    }
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
        <main className='main'>
          <h1>
            Check your email
          </h1>
          <article className='help-text'>
            <h3>
              We've sent a 6-character otp to <strong>{user.email}</strong>. The otp expires in an hour, so please enter it soon.
            </h3>
          </article>
          <form
            className='check-email-form'
            noValidate
          >
            {apiResponse && <AlertHandler type='error' msg={apiResponse} isOpen={apiResponse.length} />}
            <AlertHandler type='error' msg={apiResponse} />
            <div className='row d-flex'>
              <div className='form-group col'>
                <input
                  type='text'
                  maxLength='1'
                  autoFocus
                  name='one'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
                <input
                  type='text'
                  maxLength='1'
                  name='two'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
                <input
                  type='text'
                  maxLength='1'
                  name='three'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
              </div>
              <div className='divider'>-</div>
              <div className='form-group col'>
                <input
                  type='text'
                  maxLength='1'
                  name='four'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
                <input
                  type='text'
                  maxLength='1'
                  name='five'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
                <input
                  type='text'
                  maxLength='1'
                  name='six'
                  pattern='[a-zA-Z0-9]*'
                  onChange={(e) => handleChange(e)}
                  onKeyUp={(e) => changeInputField(e)}
                />
              </div>
            </div>
          </form>
        </main>
        <footer className='footer'>
          <span>Contact Us</span>
        </footer>
      </div>
      <CreateOranisationModal
        onOpen={true}
        onClose={() => setOpenCreateModal(false)}
      />
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
  padding: 0 1rem; 
  top: 0;
  left: 0;

  header, footer {
    text-align: center;
    padding: 2rem 0;
    width: 100%;
  }

  footer {
    margin-top: auto;
  }

  .main-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 0 var(--padding-sm);
    width: 100%;

    main {
      max-width: 800px;
      width: 100%;
      margin: 4rem auto;
      text-align: center;
      padding: 0 2rem;
      padding-bottom: 2rem;
      background-color: var(--light-grey);
      border-radius: var(--border-redius-small);
  
      h1 {
        font-size: var(--font-size-xxx-large);
        letter-spacing: -.75px;
        line-height: 46px;
      }
  
      .help-text {
        font-size: var(--font-size-large);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--margin-sm);
      }
  
      form {
        max-width: 400px;
        width: 100%;
        margin: 2rem auto;
  
        .d-flex {
          display: flex;
          align-items: center;
          gap: 1rem;
  
          .divider {
            font-size: var(--font-size-x-large);
            font-stretch: extra-expanded;
          }
  
        .form-group {
          display: flex;
          padding: 0;

          &> * + * {
            border-left: 0;
          }

          input {
            border-radius: 0;
            font-size: var(--font-size-xx-large);
            height: 100px;
            text-transform: uppercase;
            text-align: center;
            padding: 0;

            &:focus {
              border: 0.05rem solid var(--color-secondry);
              z-index: 2;
            }
          }
        }
      }
    } 
  }
}
`;

export default ConfirmEmail;
