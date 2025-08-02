import React, { useState, useRef, useEffect } from 'react';
import { 
  IconSend,  
  IconRestore,
  IconMessageChatbot
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Dobrý den! Jsem váš AI asistent pro nemovitosti. Můžu vám pomoci najít nemovitosti nebo naplánovat schůzku s našimi makléři. Jak vám mohu pomoci?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Session ID management
  const [sessionID] = useState(() => {
    let id = localStorage.getItem("sessionID");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("sessionID", id);
    }
    return id;
  });

  const API_ENDPOINT = "http://localhost:8080/api/chat";

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const testConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINT.replace('/chat', '/health'), {
        method: 'GET'
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        throw new Error('Server unavailable');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.warn('API not available:', error);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('cs-CZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          session_id: sessionID,
          user_input: inputValue
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.bot_reply || data.response || "Omlouvám se, nerozumím vaší otázce.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('API communication error:', error);
      
      const fallbackResponses = [
        "Omlouvám se, momentálně mám problémy s připojením. Zkuste to prosím za chvíli.",
        "Bohužel nemohu právě teď odpovědět. Kontaktujte prosím přímo našeho makléře na +420 123 456 789.",
        "Systém je dočasně nedostupný. Pro okamžitou pomoc volejte +420 123 456 789."
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus('error');
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        content: "Dobrý den! Jsem váš AI asistent pro nemovitosti. Můžu vám pomoci najít nemovitosti nebo naplánovat schůzku s našimi makléři. Jak vám mohu pomoci?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
    ]);
    setInputValue('');
    setIsTyping(false);
  };

  const sendQuickMessage = (message: string) => {
    setInputValue(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const getConnectionStatusText = () => {
    switch(connectionStatus) {
      case 'connected': return 'Připojen k serveru';
      case 'error': return 'Pracuje v offline režimu - některé funkce mohou být omezené';
      default: return 'Připojování k serveru...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700">
      {/* Connection Status */}
      <div className={`w-full py-3 px-4 text-center text-sm font-medium ${
        connectionStatus === 'connected' 
          ? 'bg-green-100 border-green-500 text-green-800' 
          : connectionStatus === 'error'
          ? 'bg-red-100 border-red-500 text-red-800'
          : 'bg-yellow-100 border-yellow-500 text-yellow-800'
      }`}>
        {getConnectionStatusText()}
      </div>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconMessageChatbot className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">ChatBot pro Makléře</h1>
                <div className="flex items-center gap-2 text-emerald-100 text-sm">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
            <Button
              onClick={resetChat}
              variant="secondary"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <IconRestore className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2">
            <Button
              onClick={() => sendQuickMessage('Hledám dům do 10 milionů Kč')}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
              disabled={isTyping}
            >
              Dům do 10M Kč
            </Button>
            <Button
              onClick={() => sendQuickMessage('Potřebuji byt v Praze')}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
              disabled={isTyping}
            >
              Byt v Praze
            </Button>
            <Button
              onClick={() => sendQuickMessage('Chci kontaktovat makléře')}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
              disabled={isTyping}
            >
              Kontakt makléř
            </Button>
            <Button
              onClick={() => sendQuickMessage('Jaké jsou ceny nemovitostí?')}
              variant="outline"
              size="sm"
              className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
              disabled={isTyping}
            >
              Ceny nemovitostí
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                {message.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    🤖
                  </div>
                )}
                
                <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {getCurrentTime()}
                    </p>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napište svou zprávu..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none min-h-[44px] max-h-[120px]"
                rows={1}
                disabled={isTyping}
                style={{
                  height: 'auto',
                  minHeight: '44px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl min-w-[44px] h-11 transition-transform hover:scale-105 disabled:hover:scale-100"
              >
                <IconSend className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}