import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import RightSide from '../../components/RightSide';
import image from '../../static/images/avatar/1.jpg'
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectOrganizationStaffs } from '../../features/organization/staffSlice';
import ProfileUpdater from '../../components/modals/ProfileUpdateContainer';
import CustomeModal from '../../components/modals/CustomModal';

function UserDetails() {
  const user = useSelector(selectCurrentUser);
  const staffList = useSelector(selectOrganizationStaffs);
  const params = useParams();
  const userId = parseInt(params.pageId);
  const [profile, setProfile] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      if (user.id === userId) {
        setProfile(user);
      } else {
        // const otherUsers = staffList.find(({ id }) => id === userId);
        // otherUsers && setProfile(otherUsers);
      }
    }

    return () => {
      ignore = true;
    }
  }, []);

  return (
    <PageWrapper>
      <RightSide title='Profile'>
        <div className='profile'>
          <section>
            <div className="profile__avatar">
              <img
                className='profile__avatar__img'
                src={image}
                alt='user profile'
                loading="lazy"
              />
            </div>
          </section>
          <section>
            <div className="profile__details">
              <div className="profile__details__name">
                <h1 className='profile__heading'>
                  <span>{profile?.name}</span>
                  {user.id === userId &&
                    <Button
                      variant='text'
                      size="medium"
                      onClick={() => setOpenModal(true)}
                    >
                      Edit
                    </Button>
                  }
                </h1>
                <span>
                  Role: Admin
                </span>
              </div>
              {user.id !== userId &&
                <div className="profile__details__actions">
                  <Button
                    variant='outlined'
                    size="medium"
                  >
                    Direct Message
                  </Button>
                </div>}
            </div>
          </section>
          <section>
          <Divider />
            <div className="profile__contact">
              <div className="profile__contact__info">
                <h3 className='profile__heading'>
                  <span>Contact information</span>
                  {user.id === userId &&
                    <Button
                      variant='text'
                      size="medium"
                    >
                      Edit
                    </Button>}
                </h3>
                <div className='profile__contact__items'>
                  <article className='profile__contact__items__item'>
                    <span><EmailOutlinedIcon sx={{ width: 24, height: 24 }} /></span>
                    <div>
                      <span>Email Address</span>
                      <span>{profile?.email}</span>
                    </div>
                  </article>
                  <article className='profile__contact__items__item'>
                    <span><LocalPhoneOutlinedIcon sx={{ width: 24, height: 24 }} /></span>
                    <div>
                      <span>Phone Number</span>
                      <span>{profile?.phone}</span>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      </RightSide>
      <CustomeModal
        title='Profile Update'
        openModal={openModal}
        onCloseModal={handleClose}
      >
        <ProfileUpdater />
      </CustomeModal>
    </PageWrapper>
  )
}

const PageWrapper = styled.aside`

  .profile {

    section {
      padding-top: 2rem;
    }

    &__heading {
      display: flex;
      justify-content: space-between;

      button {
        font-size: 1.5rem;
      }
    }

    &__avatar,
    &__details,
    &__contact {
      padding: 0 1rem;
    }

    &__avatar {
      border-radius: var(--border-redius-small);
      position: relative;
      overflow: hidden;
      width: 250px;
      height: 250px;
      margin: 0 auto;

      &__img {
        width: 100%;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        object-fit: cover;
      }
    }

    &__details {

      &__name h1 {
        font-size: 1.5em;
        margin: 0;
      }

      &__actions {
        margin-top: 1rem;

        button {
          font-size: 1.2rem;
        }
      }
    }

    &__contact {
      padding-top: 1.5rem;
      // margin-top: 1.5rem;
      &__items {

        &> * + * {
          margin-top: 1rem;
        }

        &__item {
          display: flex;
          gap: 1rem;

          &> span {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 1rem;
            background-color: var(--light-grey);
          }

          div {
            display: flex;
            flex-direction: column;
            color: var(--color-secondry-light);

            :first-child {
              color: var(--dull-text-color);
              font-size: var(--font-size-small);
              font-weight: var(--font-weight-bold);
            }
          }
        }
      }
    }
  }


`;

export default UserDetails;