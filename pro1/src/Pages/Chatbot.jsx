import { useState, useEffect, useRef } from "react";
import "./CSS/Chatbot.css";
import { faCommentDots, faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const [userEmail, setUserEmail] = useState(""); 

  // Function to send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    // If email is not set, assume user is providing their email
    if (!userEmail) {
      setUserEmail(input);
      setInput("");

      try {
        await fetch("http://localhost:4000/chat/set-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: input }),
        });

        setMessages((prev) => [...prev, { message: input, response: "Email saved! How can I help you today?" }]);
      } catch (error) {
        console.error("Error setting email:", error);
      }
      return;
    }

    const newMessage = { message: input };

    setMessages((prev) => [...prev, { message: input, response: "Typing..." }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      if (data.message.includes("May I know your email address")) {
        setUserEmail(""); // Reset email if bot asks for it again
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { message: newMessage.message, response: data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { message: newMessage.message, response: "Error: Unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon icon={faCommentDots} />
        </button>
      )}

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI Chatbot</h3>
            <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => setIsOpen(false)} />
          </div>

          <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <strong>You:</strong> {msg.message}
                <br />
                <strong>Bot:</strong> {msg.response}
              </div>
            ))}
            {isLoading && <div className="chat-message"><strong>Bot:</strong> Typing...</div>}
          </div>

          <div className="chat-input">
            {!userEmail ? (
              <input
                type="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your email"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
            )}
            <button onClick={sendMessage} disabled={isLoading}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
