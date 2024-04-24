import React, { useEffect, useState, useReducer } from 'react';
import Gun from 'gun';
import { Box, Button, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
const gun = Gun({
  peers: ['http://localhost:3030/gun']
});
const currentState = {
  messages: []
};

const reducer = (state, message) => {
  return {
    messages: [message, ...state.messages]
  };
};

const ChatPage = () => {
  const [messageText, setMessageText] = useState('');
  const [state, dispatch] = useReducer(reducer, currentState);
  const address = useSelector(state => state.connectWallet.address);
  useEffect(() => {
    const messagesRef = gun.get('MESSAGES');
    messagesRef.map().on(m => {
      dispatch({
        userAddress: address,
        content: m.content,
        timestamp: m.timestamp
      });
    });
  }, []);
  const newMessagesArray = () => {
    const formattedMessages = state.messages.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        state.messages.findIndex(obj => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

    return formattedMessages;
  };
  const sendMessage = () => {
    const messagesRef = gun.get('MESSAGES');
    const messageObject = {
      sender: address,
      content: messageText,
      timestamp: Date().substring(16, 21)
    };
    messagesRef.set(messageObject);
    setMessageText('');
  };
  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: '80%',
          backgroundColor: '#ECE5DD',
          height: '80vh',
          marginTop: 5,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {newMessagesArray().map((msg, index) =>
          msg.userAddress.toUpperCase() === address.toUpperCase() ? (
            <div
              key={index}
              style={{
                backgroundColor: 'black',
                borderRadius: '10px',
                color: 'white',
                textAlign: 'left',
                width: 'max-content',
                padding: '10px',
                marginBottom: '20px'
              }}
            >
              <Typography sx={{}} gutterBottom>
                {msg.content}
              </Typography>
              <Typography sx={{ fontSize: '15px', fontWeight: 300, color: 'gray' }}>{msg.userAddress}</Typography>
            </div>
          ) : (
            <div
              key={index}
              style={{
                backgroundColor: 'blue',
                borderRadius: '10px',
                color: 'white',
                textAlign: 'right',
                width: 'max-content',
                padding: '10px',
                marginBottom: '20px'
              }}
            >
              <Typography sx={{}} gutterBottom>
                {msg.content}
              </Typography>
              <Typography sx={{ fontSize: '15px', fontWeight: 300, color: 'gray' }}>{msg.userAddress}</Typography>
            </div>
          )
        )}
        <Box sx={{ display: 'flex', position: 'absolute', bottom: 0, width: '100%' }}>
          <input
            type="text"
            placeholder="Say something"
            onChange={e => setMessageText(e.target.value)}
            value={messageText}
            style={{ flex: 1, outline: 'none', backgroundColor: '#f1f1f1', border: 'none' }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChatPage;
