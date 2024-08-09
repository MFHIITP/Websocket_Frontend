import React, { useState, useEffect , useRef} from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setws] = useState(null);
  const [dark, setDark] = useState(true)
  const [Name, setName] = useState("")

  const inputref = useRef(null)

  useEffect(() => {
    let nm = prompt("Enter your name");
    setName(nm);
    const value = JSON.parse(localStorage.getItem('chats')) || [];
    setMessages(value);
    inputref.current.focus();
  }, [])
  
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(messages));
  }, [messages])
  

  useEffect(() => {
    const connection = new WebSocket("wss://websocket-backend-97ub.onrender.com");
    connection.onopen = () => {
      console.log("Connection Established");
    };
    connection.onmessage = async (event) => {
      const msg = await event.data.text();
      setMessages((prevmessages) => [...prevmessages, JSON.parse(msg)]);
    };
    connection.onclose = () => {
      console.log("Connection closed");
    };
    setws(connection);
    return () => {
      connection.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws != null && input.length != 0) {
      ws.send(JSON.stringify({input: input, name: Name}));
      setInput("");
    }
  };

  return (
    <div className="relative">
      <div className={`absolute top-1 right-4 border rounded-lg p-1 ${dark == true ? 'bg-white' : 'bg-black'}`}><button className={`${dark == true ? 'text-black' : 'text-white'}`} onClick={()=>{setDark(!dark)}}>
        {dark == true ? <>Light Mode</> : <>Dark Mode</>}  
      </button></div>
      <div className={`flex justify-center border rounded-lg text-2xl m-2 p-1 ${dark == true ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        ChatApp
      </div>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className={`flex-grow ${dark == true ? 'bg-gray-900' : 'bg-white'} shadow-md rounded p-4 w-full mb-4`}>
          <div id="chat" className={`mb-4 max-h-full overflow-y-auto ${dark == true ? 'text-white' : 'text-black'}`}>
          {messages.map((msg, index) => (
              <div key={index} className="mx-10 p-2 border-b border-gray-200">
                <div
                  className={`flex flex-col ${
                    msg.name === Name ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-xs">{msg.name}</div>
                  <div className="text-lg">{msg.input}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-black h-2"></div>
        <div className="p-4 bg-white shadow-md rounded w-full">
          <input
            type="text"
            ref={inputref}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="border-2 border-black rounded p-2 w-full mb-2 opacity-100 placeholder-gray-900" style={{border: {width: "200px"}}}
            onKeyDown={(e)=>{if(e.key === "Enter"){sendMessage(); setInput('');}}}
          />
          <div className="flex justify-between">
          <button
            className="bg-gray-800 text-white rounded p-2 w-[80%]"
            onClick={sendMessage}
          >
            Send
          </button>
          <button
            className="bg-gray-800 text-white rounded p-2 w-[10%]"
            onClick={()=>{localStorage.clear(); window.location.reload()}}
          >
            Clear
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
