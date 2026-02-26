import React, { useState, useRef, useEffect } from 'react';
import { getAgriAdvice } from '../services/geminiService';
import { Send, Bot, Loader2, Mic, StopCircle, Radio, Volume2, Globe, ExternalLink, MapPin, Brain, MessageSquare, ChevronLeft, X } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string; type?: 'web' | 'map' }[];
}

interface AiAssistantProps {
  initialMode?: 'chat' | 'voice';
  onClose?: () => void;
}

// --- Audio Utils ---
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const AiAssistant: React.FC<AiAssistantProps> = ({ initialMode = 'selection', onClose }) => {
  const [mode, setMode] = useState<'selection' | 'chat' | 'voice'>(initialMode);

  // Chat State
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | undefined>(undefined);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Agri-Advisor. Ask me about crop diseases, market prices, or storage tips.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'speaking'>('disconnected');

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Update mode if prop changes
  useEffect(() => {
    if (initialMode && initialMode !== 'selection') {
      setMode(initialMode);
      if (initialMode === 'voice') {
        // Optionally auto-start voice? Let's leave it manual for permission reasons usually, 
        // but the user clicked a Mic button, so let's try to start it if it's a fresh mount.
        // For now, we'll keep the "Start Talking" button for stability.
      }
    }
  }, [initialMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mode]);

  // Get Geolocation on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation warning:", error.message);
        }
      );
    }
  }, []);

  // Cleanup on unmount or mode switch
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  // --- Text Chat Logic ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await getAgriAdvice(userMsg, {
      useSearch: false,
      useMaps: false,
      useThinking: false,
      location: userLocation
    });

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response.text || "I'm having trouble answering right now.",
      sources: response.sources
    }]);
    setIsLoading(false);
  };

  // --- Voice Logic ---
  const startVoiceSession = async () => {
    try {
      setVoiceStatus('connecting');
      const apiKey = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || '';
      if (!apiKey) {
        alert("Live Voice is unavailable: Missing API Key");
        setVoiceStatus('disconnected');
        return;
      }
      const ai = new GoogleGenAI({ apiKey });

      // 1. Setup Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;

      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: "You are a helpful agricultural expert for African farmers. Keep answers concise, encouraging, and practical.",
        },
        callbacks: {
          onopen: () => {
            setIsVoiceConnected(true);
            setVoiceStatus('listening');

            const source = inputCtx.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              const base64Data = arrayBufferToBase64(pcmData.buffer);

              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const { serverContent } = msg;

            const audioData = serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setVoiceStatus('speaking');
              playAudioChunk(audioData);
            }

            if (serverContent?.interrupted) {
              stopAudioPlayback();
              setVoiceStatus('listening');
            }

            if (serverContent?.turnComplete) {
              setVoiceStatus('listening');
            }
          },
          onclose: () => {
            setVoiceStatus('disconnected');
            setIsVoiceConnected(false);
          },
          onerror: (err) => {
            console.error("Voice Error:", err);
            setVoiceStatus('disconnected');
            setIsVoiceConnected(false);
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start voice session:", err);
      setVoiceStatus('disconnected');
    }
  };

  const playAudioChunk = async (base64Audio: string) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const arrayBuffer = base64ToUint8Array(base64Audio).buffer;

    const dataInt16 = new Int16Array(arrayBuffer);
    const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    source.onended = () => {
      audioSourcesRef.current.delete(source);
    };

    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    audioSourcesRef.current.add(source);
  };

  const stopAudioPlayback = () => {
    audioSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const stopVoiceSession = () => {
    if (sessionRef.current) {
      // sessionRef.current.then(s => s.close());
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current && inputAudioContextRef.current) {
      processorRef.current.disconnect();
      sourceRef.current?.disconnect();
    }

    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();

    inputAudioContextRef.current = null;
    audioContextRef.current = null;

    setVoiceStatus('disconnected');
    setIsVoiceConnected(false);
  };

  const handleBack = () => {
    stopVoiceSession();
    if (onClose) {
      onClose();
    } else {
      setMode('selection');
    }
  };

  // --- SELECTION SCREEN ---
  if (mode === 'selection') {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 h-full">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm transform rotate-3 hover:rotate-0 transition-transform">
            <Bot className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Agri-Advisor</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Choose how you want to interact with your AI assistant today.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
          <button
            onClick={() => setMode('chat')}
            className="p-4 rounded-xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 bg-white active:scale-95"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-bold text-slate-900">Text Chat</span>
          </button>

          <button
            onClick={() => { setMode('voice'); startVoiceSession(); }}
            className="p-4 rounded-xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all flex items-center gap-4 bg-white active:scale-95"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-bold text-slate-900">Live Voice</span>
          </button>
        </div>
      </div>
    );
  }

  // --- ACTIVE MODE CONTAINER ---
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Shared Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {!onClose && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-all active:scale-90"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            {mode === 'voice' ? (
              <div className="flex items-center gap-2 text-purple-700">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="font-bold">Live Voice</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-700">
                <Bot className="w-5 h-5" />
                <span className="font-bold">Agri-Advisor</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'voice' && isVoiceConnected && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 animate-pulse">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              LIVE
            </div>
          )}
          {onClose && (
            <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all active:scale-90">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {mode === 'chat' ? (
          // --- CHAT INTERFACE ---
          <>
            {/* Tool buttons removed as requested */}

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] rounded-2xl p-4 text-sm shadow-sm relative group
                    ${msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
                  `}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                          {msg.sources.some(s => s.type === 'map')
                            ? <><MapPin className="w-3 h-3" /> Locations</>
                            : <><Globe className="w-3 h-3" /> Sources</>
                          }
                        </div>
                        <div className="space-y-2">
                          {msg.sources.map((source, i) => (
                            <a
                              key={i}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 text-xs p-2 rounded transition-colors border
                                    ${source.type === 'map'
                                  ? 'bg-orange-50 text-orange-800 border-orange-100 hover:bg-orange-100'
                                  : 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100'}`}
                            >
                              {source.type === 'map' ? <MapPin className="w-3 h-3 shrink-0" /> : <ExternalLink className="w-3 h-3 shrink-0" />}
                              <span className="truncate">{source.title || source.uri}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex gap-2 relative">
                <input
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all pr-12"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1.5 bottom-1.5 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 transition-all shadow-sm aspect-square flex items-center justify-center active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // --- VOICE INTERFACE ---
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>

            <div className="z-10 flex flex-col items-center text-center space-y-8 w-full">
              <div className="relative">
                {isVoiceConnected && (
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping duration-[2000ms]"></div>
                )}

                <div className={`
                      w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl relative z-10
                      ${voiceStatus === 'speaking' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 scale-110 shadow-purple-500/50' :
                    voiceStatus === 'listening' ? 'bg-white border-4 border-purple-500' :
                      voiceStatus === 'connecting' ? 'bg-slate-200' : 'bg-slate-800'}
                  `}>
                  {voiceStatus === 'connecting' ? (
                    <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
                  ) : voiceStatus === 'listening' ? (
                    <Mic className="w-12 h-12 text-purple-600 animate-pulse" />
                  ) : voiceStatus === 'speaking' ? (
                    <Volume2 className="w-12 h-12 text-white animate-bounce" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {voiceStatus === 'disconnected' ? 'Start Conversation' :
                    voiceStatus === 'connecting' ? 'Connecting...' :
                      voiceStatus === 'listening' ? 'Listening...' : 'Speaking...'}
                </h3>
                <p className="text-slate-500">
                  {voiceStatus === 'disconnected'
                    ? "Tap microphone to start."
                    : "I'm listening..."}
                </p>
              </div>

              <div className="flex gap-4">
                {voiceStatus === 'disconnected' ? (
                  <button
                    onClick={startVoiceSession}
                    className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Talking
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceSession}
                    className="px-8 py-3 bg-red-50 text-red-600 border border-red-100 rounded-full font-bold hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <StopCircle className="w-5 h-5" />
                    End Session
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;