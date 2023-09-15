import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
// import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
// import ReactQuill from 'react-quill';
import ReactQuill, { Quill } from "react-quill";
import quillEmoji from "quill-emoji";
import 'react-quill/dist/quill.snow.css';
import "quill-emoji/dist/quill-emoji.css";
import { useDispatch } from 'react-redux';
import { addNewMessage } from '../features/conversations/messageSlice';

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

Quill.register(
  {
    "formats/emoji": quillEmoji.EmojiBlot,
    "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
    "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
    "modules/emoji-shortname": quillEmoji.ShortNameEmoji
  },
  true
);

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'emoji'],
    ['clean']
  ],
  "emoji-toolbar": true,
  "emoji-textarea": false,
  "emoji-shortname": true
}


const formats = ["header", "bold", "italic", "underline", "strike", "list", "indent", "align", "clean", "emoji"];

function TextEditor () {
  const dispatch = useDispatch();
  // const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  // const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [msg, setMsg] = useState('');
  const editorRef = useRef(null);
  // const [value, setValue] = useState('');

  // const handleEmojiClick = (emoji, event) => {
  //   // if (!emoji.clickCount) {
  //   //   emoji.clickCount = 0;
  //   //   setSelectedEmoji(emoji);
  //   //   return;
  //   // }
  //   // emoji.clickCount += 1;
  //   // setSelectedEmoji(emoji);
  //   console.log(emoji)
  // };

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setMsg(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg) {
      const message = {
        sender: 'Demo sender',
        conversationID: 1,
        content: msg
      };
      dispatch(addNewMessage(message));
      setMsg('');
    }
  };

  return (
    <Container>
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
          modules={modules}
          formats={formats}
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

  padding: 0 2rem;
  margin-bottom: 4rem;

  .message-form {
    flex-direction: row;
    gap: 2rem;
  }

  .quill, .ql-snow {
    background-color: var(--color-white);
  }

  .ql-snow {
    position: relative;
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

  #emoji-palette {
    // box-shadow: 0 5px 10px var(--color-grey);
    top: -300.8px !important;
  }

  #tab-panel {
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
      z-index: 5;
    }
  }
`;

export default TextEditor;