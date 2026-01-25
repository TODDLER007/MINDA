
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Role } from '../types';
import { geminiService, ChatHistoryItem, LocationData } from '../services/geminiService';
import MascotLogo from './MascotLogo';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatWindowProps {
  initialPrompt: string | null;
  onPromptConsumed: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ initialPrompt, onPromptConsumed }) => {
  const userName = localStorage.getItem('minda_user_name') || 'Friend';
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('serenity_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        return [];
      }
    }
    return [{
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userName}. I'm MINDA. I'm here to listen, support, and help you navigate your feelings. How are you doing in this moment?`,
      timestamp: new Date(),
    }];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [location, setLocation] = useState<LocationData | undefined>();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionInstanceRef = useRef<any>(null);
  const isStartingRef = useRef(false); // Prevents rapid toggle race conditions

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    localStorage.setItem('serenity_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Request location for grounding
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.warn("Geolocation access denied: ", error.message)
      );
    }
  }, []);

  // Robust Speech Recognition Implementation
  const startListening = () => {
    if (isStartingRef.current) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    // CRITICAL: Clean up any existing instances immediately
    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort();
      } catch (e) {}
    }

    isStartingRef.current = true;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      isStartingRef.current = false;
      setVoiceError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      isStartingRef.current = false;
      recognitionInstanceRef.current = null;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      isStartingRef.current = false;
      
      if (event.error === 'not-allowed') {
        const isSecure = window.location.protocol === 'https:';
        setVoiceError(
          !isSecure 
            ? "Voice requires a secure (HTTPS) connection." 
            : "Microphone blocked. Please allow mic access in browser settings."
        );
      } else if (event.error === 'no-speech') {
        // Stop quietly if no sound detected
      } else if (event.error === 'aborted') {
        // System or manual abort, no message needed
      } else {
        setVoiceError(`Could not hear you (Error: ${event.error})`);
      }
      
      setTimeout(() => setVoiceError(null), 6000);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    try {
      recognition.start();
      recognitionInstanceRef.current = recognition;
    } catch (e: any) {
      console.error("Critical Recognition Error:", e);
      isStartingRef.current = false;
      if (e.name === 'InvalidStateError' || e.message?.includes('already started')) {
        // Engine is actually running, sync UI
        setIsListening(true);
      } else {
        setVoiceError("Microphone failed to start. Please refresh the page.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionInstanceRef.current) {
      try {
        // Use abort for immediate cleanup vs stop
        recognitionInstanceRef.current.abort();
      } catch (e) {
        console.error("Stop Error:", e);
      } finally {
        setIsListening(false);
        isStartingRef.current = false;
      }
    }
  };

  const toggleListening = () => {
    if (isListening || isStartingRef.current) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeySelection = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setErrorState(null);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorState(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history: ChatHistoryItem[] = messages
      .filter(m => 
        m.id !== 'welcome' && 
        m.id !== 'error' && 
        m.content.trim() !== ''
      )
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      let fullResponse = '';
      const stream = geminiService.sendMessageStream(text, history, location);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullResponse } 
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "";
      if (errorMsg === 'AUTH_ERROR' || errorMsg.includes("Requested entity was not found")) {
        setErrorState('AUTH');
        if (window.aistudio) {
          handleKeySelection();
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: 'error',
            role: 'assistant',
            content: "I'm having a little trouble connecting. Please check your internet or try refreshing.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isLoading, location]);

  useEffect(() => {
    if (initialPrompt && !isLoading) {
      sendMessage(initialPrompt);
      onPromptConsumed();
    }
  }, [initialPrompt, isLoading, sendMessage, onPromptConsumed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    if (window.confirm("Clear conversation?")) {
      const initial = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello again ${userName}. How can I support you right now?`,
        timestamp: new Date(),
      };
      setMessages([initial]);
      localStorage.removeItem('serenity_chat_history');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] relative pb-safe">
      <header className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <MascotLogo size={40} className="hover:scale-110 transition-transform cursor-pointer" aria-hidden="true" />
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">MINDA</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {location ? 'Local Support Active' : 'Online Support'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat} 
          className="text-[10px] text-slate-400 font-bold px-3 py-1.5 rounded-lg border border-slate-100 uppercase hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
          aria-label="Clear chat history"
        >
          Clear
        </button>
      </header>

      <div 
        className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {errorState === 'AUTH' && (
            <div 
              role="alert" 
              className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-4 mb-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm"
            >
              <p className="text-sm text-amber-800 font-semibold leading-relaxed">Please select a valid API key to continue using MINDA's AI features.</p>
              <button 
                onClick={handleKeySelection}
                className="bg-amber-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-amber-700 focus:ring-4 focus:ring-amber-200 outline-none active:scale-95 transition-all"
              >
                Select API Key
              </button>
              <p className="text-[10px] text-amber-600 font-bold">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-amber-700">Learn about billing</a>
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                  : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                }`}
              >
                <span className="sr-only">{msg.role === 'user' ? 'You said:' : 'MINDA said:'}</span>
                <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content || <span className="italic opacity-60" aria-hidden="true">MINDA is thinking...</span>}
                </p>
                <div className={`text-[9px] mt-2 opacity-50 font-black uppercase tracking-wider ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length-1]?.content === '' && (
            <div className="flex justify-start animate-in fade-in duration-300" aria-hidden="true">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="p-4 md:p-8 bg-white border-t border-slate-100 sticky bottom-0 z-30">
        <div className="max-w-3xl mx-auto">
          {voiceError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black text-red-600 uppercase tracking-widest animate-in slide-in-from-bottom-2 duration-300 flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2">⚠️ {voiceError}</span>
              <button onClick={() => setVoiceError(null)} className="opacity-50 hover:opacity-100">✕</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative group flex items-center gap-2">
            <div className="relative flex-1">
              <label htmlFor="chat-input" className="sr-only">Type your message to MINDA</label>
              <input
                id="chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "How can I support you today?"}
                className={`w-full pl-6 pr-14 py-4 md:py-5 rounded-[2rem] bg-slate-50 border-2 focus:bg-white focus:outline-none focus:ring-4 transition-all text-base text-slate-900 placeholder:text-slate-400 shadow-inner font-medium ${
                  isListening ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-50/50'
                }`}
                disabled={isLoading}
                autoComplete="off"
              />
              <button 
                type="button"
                onClick={toggleListening}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse shadow-lg ring-4 ring-red-100' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                disabled={isLoading}
              >
                <span className="text-base" aria-hidden="true">{isListening ? '⏹' : '🎤'}</span>
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="w-12 md:w-14 h-12 md:h-14 bg-indigo-600 text-white flex items-center justify-center rounded-full font-black shadow-lg hover:bg-indigo-700 hover:scale-105 focus:ring-2 focus:ring-indigo-300 outline-none active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-xl" aria-hidden="true">→</span>
              )}
            </button>
          </form>
          
          <div className="flex justify-start items-center gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar px-1" role="group" aria-label="Suggested topics">
            <button onClick={() => sendMessage("Find therapists near me.")} className="whitespace-nowrap text-[10px] bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase font-black border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none">Find Help Nearby</button>
            <button onClick={() => sendMessage("I'm feeling overwhelmed.")} className="whitespace-nowrap text-[10px] bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase font-black border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none">Overwhelmed</button>
            <button onClick={() => sendMessage("Help me sleep better.")} className="whitespace-nowrap text-[10px] bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase font-black border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none">Sleep Help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
