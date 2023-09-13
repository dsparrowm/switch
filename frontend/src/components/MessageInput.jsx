import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import EmojiPicker from 'emoji-picker-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const styles = {
  iconStyles: {
    fontSize: 'large',
    verticalAlign: 'middle',
    color: 'var(--color-secondry)'
  },
  editorStyles: {
    width: '100%',
    maxHeight: '300px'
  }
};

function MessageInput () {
  const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [msg, setMsg] = useState('');
  const editorRef = useRef(null);
  // const [value, setValue] = useState('');

  const handleEmojiClick = (emoji, event) => {
    if (!emoji.clickCount) {
      emoji.clickCount = 0;
      setSelectedEmoji(emoji);
      return;
    }
    emoji.clickCount += 1;
    setSelectedEmoji(emoji);
  };

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  useEffect(() => {
    if (selectedEmoji) {
      let message = msg;
      message += selectedEmoji.emoji;
      setMsg(message);
    }
  }, [selectedEmoji]);

  const handleChange = (e) => {
    setMsg(e);
    // console.log(e);
    if (displayEmojiPicker) {
      setDisplayEmojiPicker(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg) {
      setMsg('');
    }
  };

  return (
    <Container>
      <div className='emoji-picker'>
        <span className='emoji-picker__icon'>
          <button
            onClick={() => setDisplayEmojiPicker(!displayEmojiPicker)}
          >
            <EmojiEmotionsOutlinedIcon sx={styles.iconStyles} />
          </button>
        </span>
        {displayEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
      </div>
      <form
        onSubmit={handleSubmit}
        className='message-form'
      >
        <ReactQuill
          theme='snow'
          value={msg}
          onChange={handleChange}
          style={styles.editorStyles}
          ref={editorRef}
          placeholder='Type a message'
        />
        <button
          type='submit'
          className='message-form__submit'
        >
          <SendOutlinedIcon sx={styles.iconStyles} />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  button {
    border: none;
    outline: none;
    background-color: inherit;
    cursor: pointer;
    padding: 1rem;
  }
  ::placeholder {
    font-style: normal;
    font-size: var(--font-size-medium);
    font-weight: var(--font-weight-regular);
  }

  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-gap: 2rem;
  padding: 0 2rem;
  padding-bottom: 4rem;

  .message-form {
    flex-direction: row;
    gap: 2rem;
  }

  .quill, .ql-snow {
    background-color: var(--color-white);
  }

  .ql-editor {
    line-height: 1.46668;
    font-size: var(--font-size-medium);

    &::-webkit-scrollbar {
      width: 5px;
      background-color: var(--color-white);

      &-track {

      }

      &-thumb {
        background-color: var(--theme-light-fg);
        border-radius: 3px;
      }
    }  
  }

  .emoji-picker {
    position: relative;

    .EmojiPickerReact {
      box-shadow: 0 5px 10px var(--color-grey);
      position: absolute;
      top: -468px;
    }
  }
`;

export default MessageInput;
