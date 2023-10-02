import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import {
  selectCurrentAuth,
  selectCurrentUser
} from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import {
  addUserToOrganizationRoute,
  invitationDetailsRoute
} from '../../utils/APIRoutes';
import logo from '../../static/images/logos/swiich-secondy-logo.png';
import axios from 'axios';
import Axios from '../../utils/Axios';

function Invites () {
  const isAuthentication = useSelector(selectCurrentAuth);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { officeId, inviteCode } = useParams();
  const [invitDetails, setInviteDetails] = useState(null);

  const redirectPath = `/office/${officeId}`;
  let ignore = false;

  const handleJoinNow = async () => {
    if (!isAuthentication) {
      // Redirect to login page if not authenticated.
      localStorage.setItem('inviteCode', JSON.stringify(inviteCode));
      navigate(redirectPath);
      return;
    }
    // Add user to organization then redirect.
    try {
      const { data } = await Axios.post(addUserToOrganizationRoute, {
        userId: user.id,
        orgId: parseInt(officeId)
      });
      if (data.isSuccess) {
        console.log(data);
        navigate(redirectPath);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function getInvitationDetails () {
      try {
        const { data } = await axios.post(invitationDetailsRoute, { code: inviteCode });

        if (data.isSuccess) {
          const { organisation, user } = data.invitation;
          setInviteDetails({ organisation, user });
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (!ignore) {
      getInvitationDetails();
    }

    return () => {
      // eslint-disable-next-line
      ignore = true;
    };
  }, []);

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
            Welcome to Switch!
          </h1>
          <article className='help-text'>
            <h3>
              <strong>{invitDetails?.user?.name}</strong> is inviting you to join <strong>{invitDetails?.organisation?.name}</strong>
            </h3>
            <p>
              Please note, you may need to sign in or register, as required.
            </p>
          </article>
          <article className='take-actions'>
            <Stack
              direction='column'
              spacing={2}
              // mt={2}
            >
              <Button
                className='take-actions__btn outlined'
                variant='outlined'
                onClick={handleJoinNow}
              >
                Join Now
              </Button>
              <Button
                className='take-actions__btn button-primary'
                variant='contained'
                href='/'
              >
                Leave
              </Button>
            </Stack>
          </article>
        </main>
        <footer className='footer'>
          <span>Contact Us</span>
        </footer>
      </div>
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

      .take-actions {
        max-width: 400px;
        width: 100%;
        margin: 3.5rem auto;

        &__btn {
          font-size: var(--font-size-small);
          font-weight: var(--font-weight-bold);
        }

        .outlined {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .button-primary {
          background-color: var(--color-primary);
        }
      }
    } 
  }
`;

export default Invites;
