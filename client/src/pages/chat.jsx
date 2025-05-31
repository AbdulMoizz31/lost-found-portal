import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import app from '../services/firebase';
import { db } from '../services/firebase';
import { auth } from '../services/firebase';
// Firebase configuration (replace with your config)
/* // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); */

const ChatSystem = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState('');
  const [postId, setPostId] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to messages when chat is started
  useEffect(() => {
    if (!chatId || !user) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatId, user]);

  // Start or join a chat
  const startChat = async () => {
    if (0) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a unique chat ID based on post ID and participants
      const generatedChatId = `${postId}_${user.uid}`;
      setChatId(generatedChatId);
      setChatStarted(true);

      // Check if chat already exists, if not create initial system message
      const existingMessages = await getDocs(
        collection(db, 'chats', generatedChatId, 'messages')
      );

      if (existingMessages.empty) {
        await addDoc(collection(db, 'chats', generatedChatId, 'messages'), {
          text: `Chat started between ${userName} and ${uploaderName} about post #${postId}`,
          sender: 'system',
          senderName: 'System',
          timestamp: serverTimestamp(),
          postId: postId
        });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Error starting chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        sender: user.uid,
        senderName: userName,
        timestamp: serverTimestamp(),
        postId: postId
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!chatStarted) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Contact Post Uploader
                </h4>
              </div>
              <div className="card-body">
                <div>
                  <div className="mb-3">
                    <label htmlFor="postId" className="form-label">Post ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="postId"
                      value={postId}
                      onChange={(e) => setPostId(e.target.value)}
                      placeholder="Enter the post ID"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="uploaderName" className="form-label">Uploader Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="uploaderName"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Name of the person who posted"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <button 
                    onClick={startChat}
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Starting Chat...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-chat-fill me-2"></i>
                        Start Chat
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-12">
          <div className="card h-100 shadow">
            {/* Chat Header */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat about Post #{postId}
                </h5>
                <small>Between {userName} and {uploaderName}</small>
              </div>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                  setChatStarted(false);
                  setMessages([]);
                  setChatId('');
                }}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back
              </button>
            </div>

            {/* Messages Container */}
            <div className="card-body p-0 d-flex flex-column" style={{ height: '70vh' }}>
              <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: 'calc(70vh - 120px)' }}>
                {messages.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <i className="bi bi-chat-square-text display-4"></i>
                    <p className="mt-2">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="mb-3">
                      {message.sender === 'system' ? (
                        <div className="text-center">
                          <small className="text-muted bg-light rounded px-2 py-1">
                            {message.text}
                          </small>
                        </div>
                      ) : (
                        <div className={`d-flex ${message.sender === user?.uid ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className={`max-width-75 ${message.sender === user?.uid ? 'text-end' : 'text-start'}`}>
                            <div className={`rounded px-3 py-2 ${
                              message.sender === user?.uid 
                                ? 'bg-primary text-white' 
                                : 'bg-light text-dark'
                            }`}>
                              <div className="fw-bold small mb-1">
                                {message.senderName}
                              </div>
                              <div>{message.text}</div>
                            </div>
                            <small className="text-muted">
                              {formatTime(message.timestamp)}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-top p-3">
                <div>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      maxLength="500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </div>
                  <small className="text-muted">
                    {newMessage.length}/500 characters
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .max-width-75 {
          max-width: 75%;
        }
        .h-100 {
          height: 100vh !important;
        }
        @media (max-width: 768px) {
          .h-100 {
            height: 100vh !important;
          }
        }
      `}</style>

      {/* Bootstrap Icons CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default ChatSystem;


