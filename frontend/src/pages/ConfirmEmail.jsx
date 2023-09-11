import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
// import { registerRoute } from '../utils/APIRoutes';
// import { login } from '../features/user/userSlice';
import CreateOranisationModal from '../components/modals/CreateOrganisationModal';


function ConfirmEmail () {
  // const user = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [codeObj, setCodeObj] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
  });

  useEffect(() => {
    const fullcode = Object.values(codeObj).join('');
    if (fullcode.length > 5) {
      setCode(fullcode);
    }
  }, [codeObj]);

  const handleChange = (event) => {
    setCodeObj({...codeObj, [event.target.name]: event.target.value});
  };

  // const ConfirmCode = () => {
  //   try {
      
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const performSignIn = () => {};

  // const performSignUp = () => {};

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
          <img src='' alt='Logo' />
        </div>
      </header>
      <main className='main'>
        <h1>
          Check your email
        </h1>
        <article className='help-text'>
          <h3>
            We've sent a 6-character code to <strong>jujudem@gmail.com</strong>. The code expires shortly, so please enter it soon.
          </h3>
        </article>
        <form
          className='check-email-form'
          noValidate
        >
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
      <CreateOranisationModal isOpen={false} />
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
  padding: 0 var(--padding-sm);

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

`;

export default ConfirmEmail;
