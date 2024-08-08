import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = message.trim();
    if (userMessage === "") return;

    setResponses([...responses, { text: userMessage, sender: "user" }]);
    setMessage("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const aiMessage = response.data.choices[0].message.content;
      setResponses([
        ...responses,
        { text: userMessage, sender: "user" },
        { text: aiMessage, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
    }
  };

  return (
    <div>
      <div className="chat-container">
        {responses.map((response, index) => (
          <div key={index} className={response.sender}>
            <p>{response.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="chat-button">
          Send
        </button>
      </form>
      <style jsx>{`
        .chat-container {
          padding: 20px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .user {
          text-align: right;
        }
        .ai {
          text-align: left;
        }
        .chat-form {
          position: fixed;
          bottom: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          background-color: #fff;
          border-top: 1px solid #ddd;
          padding: 10px;
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
        }
        .chat-input {
          flex: 1;
          padding: 10px;
          margin-right: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 16px;
        }
        .chat-button {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition:
            background-color 0.3s,
            transform 0.3s;
        }
        .chat-button:hover {
          background-color: #0056b3;
        }
        .chat-button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
