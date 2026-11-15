import { useState } from 'react'
// --- [PREVIOUS: supersimpledev mock package] ---
// import { Chatbot } from 'supersimpledev'  // manual package by supersimple deb, for the Chatbot API

import './ChatInput.css'

export function ChatInput({ chatMessages, setChatMessages }){
    const [inputText, setInputText] = useState('');
    
    // function saveInputText(event){
    // 	setInputText(event.target.value)
    // }

    // [UPDATED]: Made async to await response from FastAPI backend
    async function sendMessage(){ // this function will replace chatMessages with this new array
      if (!inputText.trim()) return;

      const userText = inputText;
      setInputText('');  // after entering replace it with an empty string immediately

      const newMessages = [
        ...chatMessages,
        {
          message : userText,
          sender : 'user',
          id: crypto.randomUUID()
        }
      ]

      // 1. Render the user's message in the chat immediately
      setChatMessages(newMessages);
      
      /*
      // --- [PREVIOUS: Synchronous SuperSimpleDev Mock Response] ---
      const response = Chatbot.getResponse(inputText);
      setChatMessages([
        ...newMessages,
        {
          message : response,
          sender : 'robot',
          id: crypto.randomUUID()
        }
      ])
      */

      // --- [NEW: Calling Local Python RAG AI Assistant Backend] ---
      try {
        const res = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userText })
        });

        const data = await res.json();

        // 2. Add AI response to the chat
        setChatMessages(prev => [
            ...prev,
            { message: data.reply, sender: 'robot', id: crypto.randomUUID() }
        ]);
      } catch (error) {
        console.error("Error connecting to AI backend:", error);
        setChatMessages([
          ...newMessages,
          {
            message: "Error: Unable to connect to AI backend. Make sure FastAPI server is running on port 8000.",
            sender: 'robot',
            id: crypto.randomUUID()
          }
        ]);
      }
    }


    return (
        
        <div className="chat-input-container"> {/* Used div instead of fragment because of CSS container to use flexbox */}
        <input
            placeholder="Send a message to the Chatbot"
            size="30"
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            value = {inputText}
            className="chat-input"
            // Each time the input changes, React calls the inline arrow function.
            // That arrow function takes the event e and immediately extracts e.target.value and passes it to setInputText.
            // No separate named function is created — it’s all inlined.
        />
        
        <button onClick = {sendMessage} className="send-btn"> Send </button>
        </div>
    );
}
