import React, { useState, useRef, useEffect } from 'react';
import { 
  IconSend,  
  IconRestore,
  IconMessageChatbot,
  IconSparkles,
  IconBolt,
  IconHome,
  IconPhone,
  IconCurrency
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  model?: string;
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
        timestamp: new Date().toISOString(),
        model: data.model || data.model_name || 'AI'
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('API communication error:', error);
      
      const errorMessage = `Chyba: ${error instanceof Error ? error.message : String(error)}`;
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        model: 'AI'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/10 to-blue-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Connection Status */}
      <div className={`relative z-10 w-full py-2 px-4 text-center text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
        connectionStatus === 'connected' 
          ? 'bg-emerald-500/10 text-emerald-700 border-b border-emerald-200' 
          : connectionStatus === 'error'
          ? 'bg-red-500/10 text-red-700 border-b border-red-200'
          : 'bg-amber-500/10 text-amber-700 border-b border-amber-200'
      }`}>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-emerald-500' : 
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-amber-500'
          } ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}></div>
          {getConnectionStatusText()}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[700px]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white p-6 relative overflow-hidden">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <IconMessageChatbot className="h-7 w-7" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text">
                    Elite Properties Assistant
                  </h1>
                  <div className="flex items-center gap-2 text-emerald-100 text-sm mt-1">
                    <IconSparkles className="h-4 w-4" />
                    <span>Powered by AI • Specialista na nemovitosti</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={resetChat}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <IconRestore className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <IconBolt className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-700">Rychlé dotazy</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => sendQuickMessage('Hledám dům do 10 milionů Kč')}
                variant="outline"
                size="sm"
                className="group text-xs p-3 h-auto flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                disabled={isTyping}
              >
                <IconHome className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-center leading-tight">Dům do 10M Kč</span>
              </Button>
              <Button
                onClick={() => sendQuickMessage('Potřebuji byt v Praze')}
                variant="outline"
                size="sm"
                className="group text-xs p-3 h-auto flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                disabled={isTyping}
              >
                <IconHome className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-center leading-tight">Byt v Praze</span>
              </Button>
              <Button
                onClick={() => sendQuickMessage('Chci kontaktovat makléře')}
                variant="outline"
                size="sm"
                className="group text-xs p-3 h-auto flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                disabled={isTyping}
              >
                <IconPhone className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-center leading-tight">Kontakt makléř</span>
              </Button>
              <Button
                onClick={() => sendQuickMessage('Jaké jsou ceny nemovitostí?')}
                variant="outline"
                size="sm"
                className="group text-xs p-3 h-auto flex flex-col items-center gap-2 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                disabled={isTyping}
              >
                <IconCurrency className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-center leading-tight">Ceny nemovitostí</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/30 to-white/50 backdrop-blur-sm space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === 'ai' && (
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg shadow-lg">
                      🤖
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div className={`relative rounded-3xl px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white ml-auto'
                      : 'bg-white/90 text-gray-900 border border-gray-200/50'
                  }`}>
                    {/* Message tail */}
                    <div className={`absolute top-4 w-0 h-0 ${
                      message.sender === 'user' 
                        ? 'right-[-8px] border-l-[8px] border-l-emerald-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                        : 'left-[-8px] border-r-[8px] border-r-white/90 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                    }`}></div>
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className={`text-xs ${
                        message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {getCurrentTime()} {message.sender === 'ai' && typeof message.model === 'string' && message.model.length > 0 ? `• ${message.model}` : ''}
                      </p>
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                          <span className="text-xs text-emerald-600 ml-1">AI</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg">
                      👤
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg shadow-lg">
                    🤖
                  </div>
                </div>
                <div className="bg-white/90 rounded-3xl px-6 py-4 shadow-lg border border-gray-200/50 backdrop-blur-sm">
                  <div className="flex space-x-2 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI píše...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Chat Input */}
          <div className="border-t border-gray-200/50 p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex gap-4 items-end">
              {/* Text Input Container */}
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Napište svou zprávu o nemovitostech..."
                  className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 focus:border-emerald-500 focus:outline-none resize-none min-h-[56px] max-h-[140px] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  rows={1}
                  disabled={isTyping}
                  style={{
                    height: 'auto',
                    minHeight: '56px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 140) + 'px';
                  }}
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-14 w-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 flex-shrink-0"
              >
                <IconSend className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Input Footer */}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <IconSparkles className="h-4 w-4" />
                <span>Stiskněte Enter pro odeslání, Shift+Enter pro nový řádek</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Bezpečné šifrování</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}