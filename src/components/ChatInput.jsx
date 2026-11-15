import { useState } from 'react'
import { Chatbot } from 'supersimpledev'  // manual package by supersimple deb, for the Chatbot API

import './ChatInput.css'

export function ChatInput({ chatMessages, setChatMessages }){
    const [inputText, setInputText] = useState('');
    
    // function saveInputText(event){
    // 	setInputText(event.target.value)
    // }
    function sendMessage(){ // this function will replace chatMessages with this new array
      if (!inputText.trim()) return;

      const newMessages = [
        ...chatMessages,
        {
          message : inputText,
          sender : 'user',
          id: crypto.randomUUID()
        }
      ]
      
      const response = Chatbot.getResponse(inputText);
      setChatMessages([
        ...newMessages,
        {
          message : response,
          sender : 'robot',
          id: crypto.randomUUID()
        }
      ])
  
      setInputText('');  // after entering replace it with an empty string.
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