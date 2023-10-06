import React, { useState } from 'react';
import styled from 'styled-components';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import OfflineBoltOutlinedIcon from '@mui/icons-material/OfflineBoltOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import CustomModal from '../components/modals/CustomModal';
import TaskUpdate from '../components/modals/TaskUpdate';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { updateTaskStatus } from '../features/task/tasksSlice';
import { useDispatch } from 'react-redux';
// import { createTaskRoute } from '../utils/APIRoutes';
// import { postRequest } from '../utils/api';
// import { addTask } from '../features/tasks/tasksSlice';

const ICON_SMALL = 24;

function TaskList ({ title, taskList, filter }) {
  const dispatch = useDispatch();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  // const [loading, setLoading] = useState(false);

  const handleClose = () => setOpenTaskModal(false);

  const handleOpen = (task) => {
    setSelectedTask(task);
    setOpenTaskModal(true);
  };

  // console.log(taskList);

  const handleAddCard = () => {
    console.log(cardTitle);
    if (cardTitle) {
      setShowTaskEditor(false);
    }
  };

  const changeTaskStatus = (e, task, status) => {
    // Prevent the click event from propagating to the parent div
    e.stopPropagation();
    dispatch(updateTaskStatus({ taskId: task.id, newStatus: status }));
  };

  return (
    <Container className='card'>
      <div
        className='card__header'
      >
        <h5>{title}</h5>
        <IconButton aria-label='settings'>
          <MoreHoriz />
        </IconButton>
      </div>
      <div className='card__content'>
        {taskList.length > 0 && taskList.map((task, i) => {
          return (filter === task.status &&
            <article key={i} className='card__content__task'>
              <div
                className='card__content__task__btn'
                onClick={() => handleOpen(task)}
                role='button'
                aria-label='Click me'
              >
                <h5 className='card__content__task__title'>
                  {task.title}
                </h5>
                <div className='card__content__task__tags'>
                  <IconButton>
                    <NotificationsNoneOutlinedIcon />
                  </IconButton>
                  <IconButton>
                    <OfflineBoltOutlinedIcon />
                  </IconButton>
                  {task.status !== 'to-do' &&
                    <IconButton
                      onClick={(e) => changeTaskStatus(e, task, 'to-do')}
                    >
                      <FormatListBulletedOutlinedIcon />
                    </IconButton>}
                  {task.status !== 'in-progress' &&
                    <IconButton
                      onClick={(e) => changeTaskStatus(e, task, 'in-progress')}
                    >
                      <HourglassEmptyOutlinedIcon />
                    </IconButton>}
                  {task.status !== 'completed' &&
                    <IconButton
                      onClick={(e) => changeTaskStatus(e, task, 'completed')}
                    >
                      <DoneAllOutlinedIcon />
                    </IconButton>}
                </div>
              </div>
            </article>
          );
        })}

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
        {(!showTaskEditor && filter === 'to-do') &&
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

      <CustomModal
        title={`Update ${selectedTask?.title}`}
        openModal={openTaskModal}
        onCloseModal={handleClose}
        size={800}
      >
        <TaskUpdate task={selectedTask} />
      </CustomModal>
    </Container>
  );
}

const Container = styled.div`
  width: 272px;
  display: flex;
  flex-direction: column;
  position: relative;
  white-space: normal;
  margin: 0 0.5rem;
  padding: 0;

.card {
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
    flex-direction: column;
    gap: 7px;
    justify-content: space-between;
    min-height: 0;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem 0.5rem;
    z-index: 1;
    background-color: #bbb8b8;
    
    &::-webkit-scrollbar {
      width: 5px;
      background-color: var(--color-white);
      border-radius: 3px;
  
      &-track {
  
      }
  
      &-thumb {
        // background-color: #bbb8b8;
        background-color: var(--color-primary);
        border-radius: 3px;
      }
    }

    &__task {
      // font-size: 95%;

      &__btn {
        background-color: #e4eaee;
        display: inline-block;
        color: inherit;
        font-size: 90%;
        padding: 1rem 1.5rem;
        border-radius: var(--border-redius-small);
        text-transform: none;
        text-align: left;
        z-index: 1;
        width: 100%;

        &:hover {
          background-color: var(--light-grey);
          cursor: pointer;
        }

        h5 {
          font-size: 115%;
        }
      }

      &__tags {
        margin-top: 1rem;
        // font-size: 80%;
        display: flex;
        align-items: center;
        gap: 5px;
        z-index: 5;

        &> button {
          padding: 5px;
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
`;

export default TaskList;
