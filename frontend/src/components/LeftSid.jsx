import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Conversations from './Conversations';
import CustomModal from './modals/CustomModal';
import QuickActionMenu from './QuickActionMenu';

import {
  selectDepartmentConversation,
  selectPrivateConversation
} from '../features/conversations/conversationSlice';
import { selectOrganization } from '../features/organization/organizationSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Axios from '../utils/Axios';
import {
  createOrganizationInviteCodeRoute,
  updateOrganizationInfoRoute
} from '../utils/APIRoutes';

const style = {
  textTransform: 'none',
  fontSize: 'var(--font-size-medium)',
  color: 'var(--color-secondry)',
  padding: '0.5rem',
  margin: '0.5rem 0',
  textAlign: 'center'
};

function LeftSide () {
  const inviteRef = useRef();
  const user = useSelector(selectCurrentUser);
  const [openModal, setOpenModal] = useState(false);
  const departments = useSelector(selectDepartmentConversation);
  const privates = useSelector(selectPrivateConversation);
  const organization = useSelector(selectOrganization);
  const [isCopied, setIsCopied] = useState(false);

  const [loadingLink, setLoadingLink] = useState(false);
  const [orgLink, setOrgLink] = useState(null);

  // Generate new Organization Invite Link
  const generateInviteLink = async () => {
    try {
      setLoadingLink(true);
      const { data } = await Axios.post(createOrganizationInviteCodeRoute, {
        organisationId: organization.id,
        userId: user.id
      });

      if (data.isSuccess) {
        const { code } = data;
        const orgLink = `http://localhost:3000/office/${organization.id}/invite/${code}`;
        setOrgLink(orgLink);
        setLoadingLink(false);
        updateOrgInfo('invitationUrl', orgLink);
      }
    } catch (error) {
      console.error(error);
      setLoadingLink(false);
    }
  };

  // Update Organization Informations
  const updateOrgInfo = async (key, value) => {
    try {
      await Axios.put(updateOrganizationInfoRoute, {
        [key]: value,
        orgId: organization.id
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteRef.current.innerText);
    setIsCopied(true);
    // Reset the "Copied!" message after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Container>
      <section className='organization'>
        <h3 className='organization-title'>
          <Avatar
            sx={{ width: 24, height: 24 }}
            variant='square'
            src='/static/images/avatar/1.jpg'
          />
          <span className='organization-title__text'>
            {organization && organization.name}
          </span>
          <Button
            className='organization-title__btn'
            variant='text'
            onClick={() => setOpenModal(true)}
          >
            <MoreVertIcon />
          </Button>
        </h3>
      </section>
      <section className='body'>
        <QuickActionMenu />
        <section>
          <Conversations
            category='group'
            conversations={departments}
          />

          <Conversations conversations={privates} />
        </section>
        <section>
          <CustomModal
            title={`About ${organization && organization.name}`}
            openModal={openModal}
            onCloseModal={() => setOpenModal(false)}
          >
            <div className='about-org'>
              <section className='about-org__description'>

              </section>
              <section className='about-org__invite'>
                <Box>
                  <Typography
                    variant='h5'
                    gutterBottom
                  >
                    You can add more people to <b>{`${organization && organization.name}`}</b> by sharing the invite link
                  </Typography>
                  {!organization.invitation?.url &&
                    <>
                      <Typography
                        variant='h6'
                        gutterBottom
                      >
                        Ready to share the {`${organization && organization.name}`} magic? Click the button below to generate a link and invite others to join<b>{` ${organization && organization.name} `}</b> workspace!
                      </Typography>
                      <Button
                        sx={style}
                        variant='outlined'
                        className='invite__btn'
                        size='large'
                        onClick={generateInviteLink}
                      >
                        {loadingLink
                          ? <CircularProgress size={25} />
                          : 'Generate Invite link'}
                        {/* <Skeleton
                          sx={{ width: '100px' }}
                          animation="wave"
                        /> */}
                      </Button>
                    </>}
                  {(organization.invitation?.url || orgLink) &&
                    <div className='invite__link' style={{ backgroundColor: 'var(--light-grey)' }}>
                      <Typography
                        variant='button'
                        display='block'
                        gutterBottom
                        sx={style}
                      >
                        <span ref={inviteRef}>
                          {organization.invitation?.url || orgLink}
                        </span>
                        <Tooltip
                          title={<Typography sx={{ fontSize: 'var(--font-size-small)' }}>Copy Link</Typography>}
                          placement='top-end'
                          arrow
                        >
                          <IconButton
                            sx={{ borderRadius: 1, color: 'var(--color-primary)' }}
                            onClick={handleCopyLink}
                          >
                            {isCopied ? 'Copied!' : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </div>}
                </Box>
              </section>
              <section className='about-org__logout'>

              </section>
            </div>
          </CustomModal>
        </section>
      </section>
    </Container>
  );
}

const Container = styled.aside`
  border-bottom: var(--sw-border);
  border-right: var(--sw-border);
  background-color: var(--color-primary); 
  color: var(--color-white);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .body {
    flex-grow: 1;
    overflow-y: auto;
    height: calc(100vh - 91.17px);

    &::-webkit-scrollbar {
      width: 5px;
      background-color: var(--color-white);
  
      &-track {
  
      }
  
      &-thumb {
        background-color: var(--color-primary);
        border-radius: 3px;
      }
    }
  }

  .organization {
    padding: 1rem;
    background-color: var(--color-primary);
    border-bottom: var(--sw-border);

    &-title {
      display: flex;
      align-items: center;
      gap: 1rem;

      &__text {
        display: inline-block;
        margin-right: auto;
        overflow: hidden;
        text-overflow: ellipsis; 
        white-space: nowrap; 
        width: 70%;
      }

      &__btn {
        background-color: var(--color-white);
        padding: 0.5rem;
        min-width: 0;
      }
    }
  }

  .modal-content {
    border: 1px solid red;
  }

`;

export default LeftSide;
