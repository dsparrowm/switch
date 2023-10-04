import React from 'react';
import styled from 'styled-components';
import TaskList from '../../components/TaskList';

function Tasks () {
  // const [listTitle, setlistTitle] = useState('');
  // const [showListEditor, setShowListEditor] = useState(false);

  // const handleAddList = () => {
  //   console.log(listTitle);
  //   if (listTitle) {
  //     setShowListEditor(false);
  //   }
  // };

  const filteredTasksByStatus = (filter) => {
    return tasks.filter(({ status }) => status === filter);
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

            <TaskList
              title='To-Dos'
              taskList={filteredTasksByStatus('to-do')}
              filter='to-do'
            />

            <TaskList
              title='In Progress'
              taskList={filteredTasksByStatus('in-progress')}
              filter='in-progress'
            />

            <TaskList
              title='Completed'
              taskList={filteredTasksByStatus('completed')}
              filter='completed'
            />

            {/* Add new list section */}

            {/* <div className='card'>
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
            </div> */}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

const tasks = [
  {
    id: 1,
    title: 'Design homepage',
    description: 'Create a visually appealing homepage design',
    status: 'to-do'
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Set up user registration and login functionality',
    status: 'in progress'
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document the REST API for the backend',
    status: 'to-do'
  },
  {
    id: 4,
    title: 'Bug fixing',
    description: 'Address and resolve reported bugs',
    status: 'in-progress'
  },
  {
    id: 5,
    title: 'Deploy to production',
    description: 'Prepare and deploy the application to production servers',
    status: 'completed'
  }
];

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
        gap: 0.5rem;
        max-height: 100%;
      }

      &:first-child {
        margin-left: 1rem;
      }
    }
  }

  .task-editor {

    textarea {
      background-color: #e4eaee;
      border-radius: var(--border-redius-small);
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
