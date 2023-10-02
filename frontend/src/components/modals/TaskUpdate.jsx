import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import PopoverPopup from '../PopoverPopup';
import TaskDueDatePicker from '../TaskDueDatePicker';
// import DatePickr from '../DatePickr';

const ICON_SMALL = 24;

function TaskUpdate ({ task }) {
  const [showTextEditor, setShowTaskEditor] = useState(false);
  const [description, setDescription] = useState(task?.description);

  const handleSave = (e) => {
    e.preventDefault();
    setShowTaskEditor(false);
  };

  return (
    <Container>
      <section className='task right'>
        <div className='task__description'>
        <div className='task__description__summary'>
        </div>
          <div className='task__description__header'>
            <SubjectIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
            <h3>Descrption</h3>
            <Button
              variant='contained'
              className='task__description__header__btn'
              onClick={() => setShowTaskEditor(!showTextEditor)}
            >
              Edit
            </Button>
          </div>
          <div className='task__description__body'>
            <span />
            {!showTextEditor &&
              <article>
                {description}
              </article>}
            {showTextEditor &&
              <form onSubmit={handleSave}>
                <textarea
                  autoFocus
                  rows={8}
                  className='task__description__body__editor'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                  variant='contained'
                  className='task__description__body__submit'
                  type='submit'
                >
                  Save
                </Button>
              </form>}
          </div>
        </div>
      </section>
      <section className='left'>
        <div className='tool-bar'>
          <div className='tool-bar__join'>
            <h3>
              Suggested
            </h3>
            <div className='tool-bar__actions__wrapper'>
              <Button
                variant='contained'
                className='tool-bar__actions__wrapper__btns'
              >
                <PersonOutlineOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                <span>Join</span>
              </Button>
            </div>
          </div>

          <div className='tool-bar__add-to-card'>
            <h3>
              Add to card
            </h3>
            <div className='tool-bar__actions__wrapper'>
              {/* <Button
                variant='contained'
                className='tool-bar__actions__wrapper__btns'
                onClick={handleClick}
              >
                <PeopleAltOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                <span>Members</span>
              </Button> */}
              {/* <Popover
                id={id}
                open={open}
                anchorEl={showMembers}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              >
                Demo Pop
              </Popover> */}
              <PopoverPopup
                action={
                  <>
                    <PeopleAltOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                    <span>Members</span>
                  </>
                  }
              >
                Demo content 1
              </PopoverPopup>
              <PopoverPopup
                action={
                  <>
                    <CalendarMonthOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                    <span>Dates</span>
                  </>
                  }
                title='Dates'
              >
                <TaskDueDatePicker taskId={task.id} />
              </PopoverPopup>
              {/* <Button
                variant='contained'
                className='tool-bar__actions__wrapper__btns'
              >
                <CalendarMonthOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                <span>Dates</span>
              </Button> */}
            </div>
          </div>

          <div className='tool-bar__more-actions'>
            <h3>
              Actions
            </h3>
            <div className='tool-bar__actions__wrapper'>
              <Button
                variant='contained'
                className='tool-bar__actions__wrapper__btns'
              >
                <DeleteForeverOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                <span>Delete</span>
              </Button>
            </div>
          </div>

        </div>
      </section>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  grid-gap: 2rem;
  font-size: 100%;

  button {
    font-size: 100%;
    text-transform: none;
    text-align: left;
    color: inherit;
    // background-color: var(--color-primary);
    // background-color: var(--light-grey);
    background-color: #bbb8b8;
    padding: 3px 1rem;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-white);
    }
  }

  .task {
    &__summary {

    }

    &__description {
      &__summary {
        min-height: 100px;
      }

      &__header {
        display: grid;
        grid-gap: 2rem;
        grid-template-columns: auto minmax(0,1fr) 1fr;
        grid-template-rows: 1fr;
        align-items: center;
        margin-bottom: 1.5rem;

        &__btn {
          justify-self: end;
          padding: 3px 1rem;
        }
      }

      &__body {
        display: flex;
        gap: 2rem;
        margin-left: 24px;

        form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;

          button {
            align-self: flex-start;
            background-color: var(--color-primary);
            color: var(--color-white);
          }
        }
      }
    }
  }

  .tool-bar {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    h3 {
      font-size: 90%;
      margin-bottom: 0.5rem;
    }

    &__actions__wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      font-size: 95%;

      &__btns {
        justify-content: flex-start;
        gap: 1rem;
      }
    }
  }
`;

export default TaskUpdate;
