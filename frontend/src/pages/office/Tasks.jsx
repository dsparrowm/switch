import React, { useState } from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import OfflineBoltOutlinedIcon from '@mui/icons-material/OfflineBoltOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import CustomModal from '../../components/modals/CustomModal';
import TaskUpdate from '../../components/modals/TaskUpdate';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const ICON_SMALL = 24;

function Tasks () {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  const [listTitle, setlistTitle] = useState('');
  const [showListEditor, setShowListEditor] = useState(false);

  const handleClose = () => setOpenTaskModal(false);

  const handleOpen = (task) => {
    setOpenTaskModal(true);
  };

  const handleAddCard = () => {
    console.log(cardTitle);
    if (cardTitle) {
      setShowTaskEditor(false);
    }
  };

  const handleAddList = () => {
    console.log(listTitle);
    if (listTitle) {
      setShowListEditor(false);
    }
  };

  return (
    <PageWrapper>
      <section className='header'>
        <h3 className='header__heading'>
          Tasks
        </h3>
      </section>
      <section className='board'>
        <div className='board__content'>
          <div className='board__content__cards'>
            <div className='card'>
              <div
                className='card__header'
              >
                <h5>Proposed</h5>
                <IconButton aria-label='settings'>
                  <MoreHoriz />
                </IconButton>
              </div>
              <div className='card__content'>
                <article className='card__content__task'>
                  <h5 className='card__content__task__title'>
                    This impressive paella is a perfect party dish and a fun meal to cook
                  </h5>
                  <div className='card__content__task__actions'>
                    Action
                  </div>
                </article>
              </div>
              <div className='card__footer'>
                <>
                  <Button
                    className='card__footer__add-card'
                    aria-label='add a card'
                  >
                    <AddIcon />
                    <span>Add a card</span>
                  </Button>
                </>
              </div>
            </div>
            <div className='card'>
              <div
                className='card__header'
              >
                <h5>Proposed</h5>
                <IconButton aria-label='settings'>
                  <MoreHoriz />
                </IconButton>
              </div>
              <div className='card__content'>
                <article className='card__content__task'>
                  <Button
                    className='card__content__task__btn'
                    onClick={handleOpen}
                  >
                    <h5 className='card__content__task__title'>
                      This impressive paella is a perfect party dish and a fun meal to cook
                    </h5>
                    <div className='card__content__task__tags'>
                      <span>
                        <NotificationsNoneOutlinedIcon />
                      </span>
                      <span><OfflineBoltOutlinedIcon /></span>
                      <span><FormatListBulletedOutlinedIcon /></span>
                      <span><HourglassEmptyOutlinedIcon /></span>
                      <span><DoneAllOutlinedIcon /></span>
                    </div>
                  </Button>
                </article>
                <article className='card__content__task'>
                  <h5 className='card__content__task__title'>
                    This and a fun meal to cook
                  </h5>
                  <div className='card__content__task__actions'>
                    Action
                  </div>
                </article>
                <article className='card__content__task'>
                  <h5 className='card__content__task__title'>
                    This ind a fun meal to cook
                  </h5>
                  <div className='card__content__task__actions'>
                    Action
                  </div>
                </article>
                <article className='card__content__task'>
                  <h5 className='card__content__task__title'>
                    This impressive paella is a perfect party dish and a fun meal to cook
                  </h5>
                  <div className='card__content__task__actions'>
                    Action
                  </div>
                </article>
                {showTaskEditor &&
                  <article className='card__content__task'>
                    <div className='task-editor'>
                      <textarea
                        autoFocus
                        onChange={(e) => setCardTitle(e.target.value)}
                      />
                    </div>
                  </article>}
              </div>
              <div className='card__footer'>
                {!showTaskEditor &&
                  <>
                    <Button
                      className='card__footer__add-card'
                      aria-label='add a card'
                      onClick={() => setShowTaskEditor(true)}
                    >
                      <AddIcon />
                      <span>Add a card</span>
                    </Button>

                  </>}
                {showTaskEditor &&
                  <>
                    <Button
                      className='card__footer__add-btn'
                      onClick={handleAddCard}
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => setShowTaskEditor(false)}
                      className='card__footer__cancel-btn'
                    >
                      <ClearOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                    </Button>
                  </>}
              </div>
            </div>
            <div className='card'>
              <div className='card__add-list'>
                {!showListEditor &&
                  <Button
                    className='card__add-list__btn'
                    aria-label='add a new list item'
                    onClick={() => setShowListEditor(true)}
                  >
                    <AddIcon />
                    <span>Add another list</span>
                  </Button>}

                {showListEditor &&
                  <>
                    <div className='list-editor'>
                      <input
                        autoFocus
                        onChange={(e) => setlistTitle(e.target.value)}
                      />
                    </div>
                    <>
                      <Button
                        className='card__footer__add-btn'
                        onClick={handleAddList}
                      >
                        Add list
                      </Button>
                      <Button
                        onClick={() => setShowListEditor(false)}
                        className='card__footer__cancel-btn'
                      >
                        <ClearOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                      </Button>
                    </>
                  </>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomModal
        title='Update task details'
        openModal={openTaskModal}
        onCloseModal={handleClose}
        size={800}
      >
        <TaskUpdate />
      </CustomModal>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--light-grey);

  h5 {
    font-size: 100%;
    line-height: var(--line-height-small);
    font-weight: var(--font-weight-x-bold);
    font-family: var(--font-family-base);
  }

  .header {
    &__heading {
      padding: 1rem;
      background-color: var(--light-grey);
      border-bottom: var(--sw-border);
    }
  }
  
  .board {
    flex: 1 1 auto;
    position: relative;
    margin-top:  1rem;

    &__content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin-bottom:  0.5rem;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 1rem;

      &__cards {
        display: flex;
        // align-items: center;
        gap: 0.5rem;
        max-height: 100%;
      }

      &:first-child {
        margin-left: 1rem;
      }
    }


    .card {
      display: flex;
      flex-direction: column;
      position: relative;
      white-space: normal;
      margin: 0 0.5rem;
      padding: 0;
      max-width: 272px;
      // background-color: #bbb8b8;
      // border-radius: var(--border-redius-small);

      &__header, &__footer {
        background-color: #bbb8b8;
        padding: 0.5rem 1rem;
      }
      
      &__header {
        border-top-left-radius: var(--border-redius-small);
        border-top-right-radius: var(--border-redius-small);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      &__add-list {
        width: 272px;
        background-color: #00000014;
        border-radius: var(--border-redius-small);
        padding: 1rem;

        &:hover {
          cursor: pointer;
          opacity: 0.8;
        }

        &__btn {
          width: 100%;
          justify-content: flex-start;
          gap: 5px;
          font-size: 90%;
          text-transform: none;
          text-align: left;
          color: inherit;
        }
      }

      &__footer {
        display: flex;
        align-items: center;
        gap: 5px;
        border-bottom-left-radius: var(--border-redius-small);
        border-bottom-right-radius: var(--border-redius-small);

        &__add-card {
          justify-content: flex-start;
          gap: 5px;
          font-size: 90%;
          text-transform: none;
          text-align: left;
          color: inherit;
          width: 100%;

          &:hover {
            cursor: pointer;
            opacity: 0.8;
          }

        }

        &__add-btn, &__cancel-btn {
          color: inherit;
          font-size: 90%;
          text-transform: none;
          text-align: left;
          color: var(--color-white);

          &:hover {
            color: var(--color-primary);
            background-color: var(--color-white);
          }
        }

        &__add-btn {
          background-color: var(--color-primary);
        }
      }
      
      &__content {
        display: flex;
        // flex: 1 1 auto;
        // border: 1px solid red;
        flex-direction: column;
        gap: 7px;
        justify-content: space-between;
        // margin: 0 4px;
        min-height: 0;
        max-height: 100%;
        // max-width: 272px;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1rem 0.5rem;
        z-index: 1;
        background-color: #bbb8b8;
        // border-radius: var(--border-redius-small);
        
        &::-webkit-scrollbar {
          width: 5px;
          background-color: var(--color-white);
      
          &-track {
      
          }
      
          &-thumb {
            background-color: #e4eaee;
            border-radius: 3px;
          }
        }

        &__task {
          font-size: 95%;
          // background-color: var(--light-grey);
          background-color: #e4eaee;
          // color: var(--color-primary);
          border-radius: var(--border-redius-small);
          transition: all .3s;
          padding: 1rem 1.5rem;

          &:hover {
            background-color: var(--light-grey);
            cursor: pointer;
          }

          &__btn {
            display: inline-block;
            color: inherit;
            font-size: 90%;
            padding: 0;
            text-transform: none;
            text-align: left;
            width: 100%;
          }

          &__tags {
            margin-top: 1rem;
            font-size: 80%;
            display: flex;
            align-items: center;
            gap: 5px;

            &> span {
              display: flex;
              align-items: center;
              padding: 3px;
              border-radius: var(--border-redius-small-xs);
              background-color: var(--color-primary); 
              color: var(--color-white);

              &:hover {
                color: var(--color-primary);
                background-color: var(--color-white);
              }
            }
          }
        }
      }
    }
  }

  .task-editor {
    // border: 1px solid red;

    textarea {
      background-color: inherit;
      border: none;
    }
  }

  .list-editor {
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.5rem;
    }
  }
`;

export default Tasks;
