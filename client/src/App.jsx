import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:8080");

function App() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setChatLog((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, `Friend: ${data.message}`]);
    });

    // Cleanup to prevent multiple listeners
    return () => socket.off("receive_message");
  }, []);

  return (
<div className="container py-5 d-flex justify-content-center">
  <div className="card shadow-sm w-100" style={{ maxWidth: '500px' }}>
    <div className="card-header bg-primary text-white">
      <h5 className="mb-0 text-center">Real-Time Chat</h5>
    </div>
    
    <div className="card-body bg-light" style={{ height: '400px', overflowY: 'auto' }}>
      {chatLog.map((msg, i) => (
        <div key={i} className="mb-2">
          <span className="p-2 px-3 rounded-pill bg-white border d-inline-block shadow-sm">
            {msg}
          </span>
        </div>
      ))}
    </div>

    <div className="card-footer bg-white border-top-0 p-3">
      <div className="input-group">
        <input 
          type="text"
          className="form-control rounded-pill me-2" 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button 
          className="btn btn-primary rounded-pill px-4" 
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>
  );
}

export default App;