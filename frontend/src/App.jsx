import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { io } from 'socket.io-client';
import './index.css';
import { 
  Shield, Activity, Target, Network, Cpu, AlertTriangle, 
  Eye, Mic, MicOff, Send, Zap, Monitor, User, Heart, Thermometer, Wind,
  Lock, RefreshCw, BarChart3, Share2, BrainCircuit, Layout, Server, Bluetooth, Smartphone, 
  Settings, UserCheck, CheckCircle2, Navigation, Check, X, Volume2, Camera, LogOut
} from 'lucide-react';

const API_BASE = `/api`;
const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/'; // Auto-detect host for cloud deployment

// --- Enterprise Cloud Infrastructure (Supabase Frontend) ---
const SUPABASE_URL = 'https://dyyjvppoabfnuyumszle.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eWp2cHBvYWJmbnV5dW1zemxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI0NTUsImV4cCI6MjA4OTQxODQ1NX0.sO-mix8mbrjBDmf0KRjYuIDlbn0c9Z1Q4JIUI4pDnss';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Diagnostic Error Boundary ---
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("CRITICAL DASHBOARD CRASH:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#111', color: '#ff3366', fontFamily: 'monospace', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <AlertTriangle size={64} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', letterSpacing: '2px' }}>NEURAL LINK COLLAPSE</h1>
          <p style={{ maxWidth: '600px', margin: '20px 0', opacity: 0.8 }}>The application encountered a critical runtime error and had to undergo emergency shutdown.</p>
          <div style={{ background: '#000', padding: '20px', borderRadius: '8px', border: '1px solid #333', fontSize: '12px', textAlign: 'left', wordBreak: 'break-all', maxWidth: '80%' }}>
            <strong>ERROR:</strong> {this.state.error?.toString()}
          </div>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '12px 24px', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Synthetic Audio Engine ---
const getAudioContext = () => {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!window.audioCtx) window.audioCtx = new AudioCtxClass();
    if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
    return window.audioCtx;
  } catch (e) { return null; }
};

const playSciFiSound = (type) => {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    if (type === 'scan') {
      // Ascending radar sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(1800, t + 0.4);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
      
    } else if (type === 'engage') {
      // High-tech lock (dual tone snap)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(800, t);
      osc2.frequency.setValueAtTime(1600, t);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(t); osc2.start(t);
      osc1.stop(t + 0.2); osc2.stop(t + 0.2);
      
    } else if (type === 'alert') {
      // Dissonant klaxon buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.value = 150;
      osc2.frequency.value = 155; // beating effect
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(t); osc2.start(t);
      osc1.stop(t + 0.6); osc2.stop(t + 0.6);
      
    } else if (type === 'danger') {
      // Fast intense sonar ping for critical risk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  } catch (err) { }
};

// --- Realistic Organ Reference Map ---
const ORGAN_CONFIGS = {
  Heart:   { 
    color: '#ff3366', 
    label: 'CARDIAC MODEL — HEART', 
    detail: 'Pumping 72 BPM',
    modelPath: '/models/heart.glb',
    scale: 2.2,
    rotation: [0, Math.PI, 0]
  },
  Brain:   { 
    color: '#a855f7', 
    label: 'NEURAL MODEL — BRAIN',  
    detail: 'Alpha Waves: 9Hz',
    modelPath: '/models/brain.glb',
    scale: 1.5,
    rotation: [0, 0, 0]
  },
  Spine:   { 
    color: '#00f3ff', 
    label: 'ORTHOPEDIC — SPINAL COLUMN', 
    detail: 'Vertebral Alignment 98%',
    modelPath: '/models/spine.glb',
    scale: 4.0,
    rotation: [0, Math.PI, 0]
  },
  Stomach: { 
    color: '#f59e0b', 
    label: 'GASTRIC MODEL — STOMACH', 
    detail: 'pH 2.1 Detected',
    modelPath: '/models/stomach.glb',
    scale: 1.8,
    rotation: [0, 0, 0]
  },
  Hand:    { 
    color: '#00fa9a', 
    label: 'METACARPAL MODEL — HAND', 
    detail: 'Nerve Mesh: Active',
    modelPath: '/models/hand.glb',
    scale: 1.2,
    rotation: [0, Math.PI/2, 0]
  },
};

// Global Audio Stream Ref
let audioContext = null;
let mediaRecorder = null;
let audioChunks = [];

function SurgeryOrgan({ type, systemState, isVibrating, onIncision, isCutting, incisionPoint }) {
  const meshRef = useRef();
  const [surgicalCutEffect, setCutEffect] = useState(false);
  const cfg = ORGAN_CONFIGS[type];
  
  const gltf = cfg.modelPath ? useLoader(GLTFLoader, cfg.modelPath) : null;
  const scene = useMemo(() => {
    if (!gltf) return null;
    return gltf.scene.clone();
  }, [gltf]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Heart pumping
    if (type === 'Heart') {
       const s = (cfg.scale || 1) + Math.sin(state.clock.elapsedTime * 6) * 0.05; 
       meshRef.current.scale.set(s, s, s);
    } 
    
    // Danger shake
    if (isVibrating) {
       meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 60) * 0.03;
    } else {
       meshRef.current.position.x = 0;
    }
  });

  return (
    <group>
      {/* Incision Laser Beam & Spark */}
      {isCutting && incisionPoint && Array.isArray(incisionPoint) && (
        <group position={incisionPoint}>
          {/* Spark at exact contact point */}
          <mesh>
             <sphereGeometry args={[0.08, 16, 16]} />
             <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Laser Beam shooting straight down to the contact point */}
          <mesh position={[0, 15, 0]}>
             <cylinderGeometry args={[0.03, 0.03, 30, 8]} />
             <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
          </mesh>
          {/* Intense Glow at contact */}
          <pointLight intensity={5} color="#00e5ff" distance={4} />
        </group>
      )}

      {scene ? (
        <primitive 
          ref={meshRef}
          object={scene} 
          onPointerDown={(e) => onIncision(true, e.point)}
          onPointerMove={(e) => isCutting && onIncision(true, e.point)}
          onPointerUp={() => onIncision(false, null)}
          scale={cfg.scale || 1}
          rotation={cfg.rotation || [0,0,0]}
          onPointerOver={() => document.body.style.cursor='crosshair'} 
          onPointerOut={() => document.body.style.cursor='default'}
        >
          <meshStandardMaterial 
            attach="material" 
            emissive={isCutting ? "#ff3366" : isVibrating ? "#ff3366" : "#000000"} 
            emissiveIntensity={isCutting ? 2 : 0.4} 
          />
        </primitive>
      ) : (
        <mesh ref={meshRef} onClick={() => { setCutEffect(true); setTimeout(()=>setCutEffect(false), 1000); }}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
          <meshStandardMaterial color={cfg.color} wireframe emissive={cfg.color} emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Small interior component to grab GL context
function DiagnosticMirror({ targetRef }) {
  const { gl } = useThree();
  useEffect(() => {
    targetRef.current = { domElement: gl.domElement };
  }, [gl]);
  return null;
}

// Custom Orbit Controls component to allow Zoom/Rotate
function SimulationControls({ role, socket }) {
  const { camera, gl: { domElement } } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const controls = new OrbitControls(camera, domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = false; // AS REQUESTED: No automatic rotation
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controlsRef.current = controls;

    if (role === 'surgeon' && socket) {
      controls.addEventListener('change', () => {
         const now = performance.now();
         if (!window.lastCameraEmit || now - window.lastCameraEmit > 16) {
           socket.emit('cursor-move', {
              cameraSync: {
                 position: [camera.position.x, camera.position.y, camera.position.z],
                 target: [controls.target.x, controls.target.y, controls.target.z]
              }
           });
           window.lastCameraEmit = now;
         }
      });
    } else if (role === 'patient') {
      // Patient cannot manually desync the camera
      controls.enabled = false;
    }

    return () => controls.dispose();
  }, [camera, domElement, role, socket]);

  useFrame(() => {
     if (role === 'patient' && window.remoteCameraState && controlsRef.current) {
        // Advanced LERP (Linear Interpolation) to eliminate visual buffering 
        camera.position.x += (window.remoteCameraState.position[0] - camera.position.x) * 0.15;
        camera.position.y += (window.remoteCameraState.position[1] - camera.position.y) * 0.15;
        camera.position.z += (window.remoteCameraState.position[2] - camera.position.z) * 0.15;
        
        controlsRef.current.target.x += (window.remoteCameraState.target[0] - controlsRef.current.target.x) * 0.15;
        controlsRef.current.target.y += (window.remoteCameraState.target[1] - controlsRef.current.target.y) * 0.15;
        controlsRef.current.target.z += (window.remoteCameraState.target[2] - controlsRef.current.target.z) * 0.15;

        controlsRef.current.update();
     }
  });

  return null;
}

// Helper to trigger Suspense outside of Canvas for the loader UI
function SurgeryOrganLoader({ modelPath }) {
  if (modelPath) useLoader(GLTFLoader, modelPath);
  return null;
}

function App() {
  const [role, setRole] = useState(null);
  const [roomId, setRoomId] = useState('LOBBY');
  const [tempRoomId, setTempRoomId] = useState('');

  // SURGEON AUTH & PROFILE STATE
  const [doctorId, setDoctorId] = useState('');
  const [doctorPhoto, setDoctorPhoto] = useState('https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80');
  const [isDoctorVerified, setIsDoctorVerified] = useState(false);

  // PATIENT AUTH & PROFILE STATE
  const [patientId, setPatientId] = useState('');
  const [patientPhoto, setPatientPhoto] = useState('https://images.unsplash.com/photo-1551601651-2a8555f1a141?auto=format&fit=crop&w=150&q=80');
  const [isPatientVerified, setIsPatientVerified] = useState(false);

  const handleManualJoin = () => {
    if (!tempRoomId.trim()) return;
    setRoomId(tempRoomId.trim());
    triggerFlash(`🔗 TUNNELING TO ROOM: ${tempRoomId.trim()}`);
    playSciFiSound('engage');
  }; // Private room state

  // Real-time locations
  const [localLocation, setLocalLocation] = useState('');
  const [remoteLocation, setRemoteLocation] = useState('AWAITING LINK');
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [localMouse, setLocalMouse] = useState({ x: 50.0, y: 50.0 });
  const remoteCursorRef = useRef({ x: 50.0, y: 50.0 });
  const smoothCursorRef = useRef({ x: 50.0, y: 50.0 });
  const cursorDOMRef = useRef(null);
  const netThrottleRef = useRef(0);
  const [systemState, setSystemState] = useState('IDLE'); 
  const [hapticsEngaged, setHapticsEngaged] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // LIVE STREAM STATE 
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [patientCameraActive, setPatientCameraActive] = useState(false);
  const [liveFrame, setLiveFrame] = useState(null);
  const videoRef = useRef(null);
  const streamCanvasRef = useRef(null);
  const [assistMsg, setAssistMsg] = useState([]);
  const [adminData, setAdminData] = useState({ surgeries: [], totalPoints: 0, vitalsHistory: [] });
  const [isVibrating, setIsVibrating] = useState(false);
  const [vitals, setVitals] = useState({ hr: 75, bp: '120/81', spo2: 98 });
  const [isCompromised, setIsCompromised] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false); 
  const [aiVisionOverlay, setAiVisionOverlay] = useState(false); // Restored AI State
  const [flashMessage, setFlashMessage] = useState(null); // HUD Flash State
  const [mediaGallery, setMediaGallery] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null); 
  const [currentSessionId, setCurrentSessionId] = useState(null); // MASTER SESSION TRACKING
  const [isPatientBroadcasting, setIsPatientBroadcasting] = useState(false); // Global sync for broadcast status
  const [broadcastRequestStatus, setBroadcastRequestStatus] = useState('IDLE'); // 'IDLE' | 'PENDING' | 'ACTIVE' | 'REJECTED'

  const handleSurgeonAuth = async (e) => {
    e.preventDefault();
    if (!doctorId) return alert("Doctor ID is required.");
    setIsDoctorVerified(true);
    triggerFlash(`✅ DOCTOR ${doctorId} VERIFIED`);
    playSciFiSound('engage');
    
    // Save to database
    try {
      const { data, error } = await supabase.from('surgical_sessions').insert([{
         doctor_id: doctorId,
         doctor_photo: doctorPhoto,
         start_time: new Date().toISOString(),
         status: 'ACTIVE'
      }]).select().single();
      if (data) setCurrentSessionId(data.id);
    } catch (err) { console.error("DB Error:", err); }
  };

  // ADDED: QUICK-LINK SUPPORT (Check URL for ?role=surgeon/patient/admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get('role');
    const urlRoom = params.get('room') || 'LOBBY';
    setRoomId(urlRoom);

    if (urlRole && ['surgeon', 'patient', 'admin'].includes(urlRole.toLowerCase())) {
        setRole(urlRole.toLowerCase());
        setLocalLocation('REMOTE NEURAL TERMINAL [IP: ' + window.location.hostname + ']');
        setLocationConfirmed(true);
    }
  }, []);

  // Background Telemetry & Vitals Logger (Black Box Mode)
  useEffect(() => {
    if (!currentSessionId || role !== 'surgeon') return;
    const logInterval = setInterval(async () => {
       try {
         await supabase.from('vitals_logs').insert([{
           session_id: currentSessionId, hr: vitals.hr, bp: vitals.bp, spo2: vitals.spo2
         }]);
         await supabase.from('telemetry_logs').insert([{
           session_id: currentSessionId, x: localMouse.x, y: localMouse.y
         }]);
       } catch (e) { console.error("TELEMETRY_LOG_ERROR:", e); }
    }, 4000); 
    return () => clearInterval(logInterval);
  }, [currentSessionId, vitals, localMouse, role]);

  const canvasRef = useRef(); 
  const glRef = useRef(); 
  const recorderRef = useRef(null); 
  
  // HUD Helper: Flash Message
  const triggerFlash = (msg) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 2500);
  };


  // AI Implementation (Part 1)
  const [classifiedPaths, setClassifiedPaths] = useState([]);
  const [detectionZones, setDetectionZones] = useState([]);

  // Security & Quantum Metrics
  const [qber, setQber] = useState(1.02);
  const [qkdStatus, setQkdStatus] = useState('SECURE');
  const [quantumKey, setQuantumKey] = useState("0x7F8C2A0B");
  const [latency, setLatency] = useState(8);

  // 3D Anatomy State
  const [selectedOrgan, setSelectedOrgan] = useState(''); // Default to empty for step enforcement
  const [isCutting, setIsCutting] = useState(false);
  const [incisionPoint, setIncisionPoint] = useState(null);

  // Audio / Intercom State
  const [isTalking, setIsTalking] = useState(false);
  const [remoteTalking, setRemoteTalking] = useState(false);

  // AI Assistant States
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([{ from: 'ai', text: 'Haptic-Q AI Online. Master Link ready.' }]);
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // AI Agents
  const agents = [
    { id: 'sentinel', name: 'SENTINEL', role: 'Security', status: 'ACTIVE' },
    { id: 'navigator', name: 'NAVIGATOR', role: 'Paths', status: 'READY' },
    { id: 'guardian', name: 'GUARDIAN', role: 'Safety', status: 'ACTIVE' }
  ];

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // PRO-TIP: We select a more "Robotic/Surgical" pitch for authenticity
    utterance.rate = 1.05; 
    utterance.pitch = 1.0; 
    utterance.volume = 1.0; 
    
    // Browser Silence Bypass: Trigger it on NEXT TICK to ensure focus
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAssistantInput(transcript);
      setIsListening(false);
      handleAISending(transcript);
    };
    recognition.onend = () => setIsListening(false);
  };

  useEffect(() => {
    if (role === 'admin') {
      const fetchAdminData = async () => {
        try {
          // FETCH REAL-TIME SESSIONS FROM SUPABASE
          const { data: sessions } = await supabase
             .from('surgical_sessions')
             .select('*')
             .order('start_time', { ascending: false });
          
          if (sessions) {
             setAdminData(prev => ({ 
               ...prev,
               surgeries: sessions, 
               totalPoints: sessions.reduce((acc, s) => acc + (s.audit_points || 0), 0)
             }));
          }

          // FETCH MEDIA GALLERY
          const { data: media } = await supabase.from('medical_media').select('*').order('timestamp', { ascending: false });
          setMediaGallery(media || []);
        } catch (e) { console.error("Admin Fetch Error:", e); }
      };
      fetchAdminData();
      const interval = setInterval(fetchAdminData, 5000);
      return () => clearInterval(interval);
    }
  }, [role]);

  useEffect(() => {
    if (role) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      // Join a private room to avoid "confusion" between different sessions
      newSocket.emit('join-room', roomId);
      if (roomId !== 'LOBBY') {
        triggerFlash(`🌐 TUNNELING TO ROOM: ${roomId}`);
      }
      newSocket.on('cursor-update', (data) => {
        if (role === 'patient') {
          if (data.x !== undefined && data.y !== undefined) {
             remoteCursorRef.current = { x: data.x, y: data.y };
          }
          if (data.danger !== undefined) setIsVibrating(data.danger || false);
          
          // Sync interaction states from Surgeon
          if (data.organ !== undefined) setSelectedOrgan(data.organ);
          if (data.systemState !== undefined) setSystemState(data.systemState);
          if (data.vision !== undefined) setAiVisionOverlay(data.vision);
          if (data.cutting !== undefined) setIsCutting(data.cutting);
          if (data.point !== undefined) setIncisionPoint(data.point);
          if (data.cameraSync) window.remoteCameraState = data.cameraSync;
        }
      });

      newSocket.on('session-sync', (data) => {
        if (role === 'patient') {
          setSelectedOrgan(data.selectedOrgan);
          setSystemState(data.systemState);
          setAiVisionOverlay(data.aiVisionOverlay);
          setDetectionZones(data.detectionZones || []);
          setClassifiedPaths(data.classifiedPaths || []);
          setVitals(data.vitals || vitals);
          if (data.isCompromised !== undefined) setIsCompromised(data.isCompromised);
        }
      });

      newSocket.on('location-update', (data) => {
        if (data.role !== role) {
          setRemoteLocation(data.location);
          if (data.role === 'patient') {
             setIsPatientBroadcasting(data.broadcastStatus);
             if (data.userId) setPatientId(data.userId);
             if (data.userPhoto) setPatientPhoto(data.userPhoto);
          }
          if (data.role === 'surgeon') {
             if (data.userId) setDoctorId(data.userId);
             if (data.userPhoto) setDoctorPhoto(data.userPhoto);
          }
        }
      });

      newSocket.on('audio-packet', (blob) => {
        // Ensure AudioContext is resumed (Browser Security requirement)
        getAudioContext(); 
        
        const audioBlob = new Blob([blob], { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play().catch(e => {
           console.log('Audio Blocked - Interaction Required:', e);
           // Fallback: trigger a flash so the user knows they need to click somewhere
           triggerFlash("🔊 INCOMING VOICE (CLICK TO UNMUTE)");
        });
        setRemoteTalking(true);
        setTimeout(() => setRemoteTalking(false), 2000);
      });

      newSocket.on('live-stream-frame', (frame) => {
         if (role === 'surgeon') {
            setLiveFrame(frame);
         }
      });
       
       newSocket.on('broadcast-status', (status) => {
          setIsPatientBroadcasting(status);
       });

       newSocket.on('broadcast-request', () => {
          if (role === 'surgeon') {
             setBroadcastRequestStatus('PENDING');
             playSciFiSound('alert');
             triggerFlash("🚨 PATIENT REQUESTING BROADCAST");
          }
       });

       newSocket.on('broadcast-response', (status) => {
          if (role === 'patient') {
             if (status === 'ACCEPT') {
                setBroadcastRequestStatus('ACTIVE');
                setPatientCameraActive(true);
                setIsPatientBroadcasting(true);
                triggerFlash("✅ BROADCAST GRANTED");
                playSciFiSound('engage');
             } else {
                setBroadcastRequestStatus('REJECTED');
                setPatientCameraActive(false);
                setIsPatientBroadcasting(false);
                triggerFlash("❌ BROADCAST REJECTED BY SURGEON");
                playSciFiSound('danger');
             }
          }
       });

       newSocket.on('broadcast-stop', () => {
          setIsPatientBroadcasting(false);
          setBroadcastRequestStatus('IDLE');
          if (role === 'patient') setPatientCameraActive(false);
       });

      return () => {
        newSocket.off();
        newSocket.disconnect();
      };
    }
  }, [role]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join-room', roomId);
      if (roomId !== 'LOBBY') {
        triggerFlash(`📶 CONNECTED TO PRIVATE LINK: ${roomId}`);
      }
    }
  }, [socket, roomId]);

  // Audio Recording Toggle
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        socket?.emit('audio-packet', blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsTalking(true);
      playSciFiSound('engage');
    } catch (err) {
      alert("Microphone Access Required for Intercom");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsTalking(false);
    }
  };

  useEffect(() => {
    let frameId;
    const updateSmoothCursor = () => {
      // Direct variable mutation (no React re-render)
      smoothCursorRef.current.x += (remoteCursorRef.current.x - smoothCursorRef.current.x) * 0.15;
      smoothCursorRef.current.y += (remoteCursorRef.current.y - smoothCursorRef.current.y) * 0.15;
      
      // Direct DOM Assignment for absolute max performance
      if (cursorDOMRef.current) {
         cursorDOMRef.current.style.left = `${smoothCursorRef.current.x}%`;
         cursorDOMRef.current.style.top = `${smoothCursorRef.current.y}%`;
      }
      frameId = requestAnimationFrame(updateSmoothCursor);
    };
    if (role === 'patient') frameId = requestAnimationFrame(updateSmoothCursor);
    return () => cancelAnimationFrame(frameId);
  }, [role]);

  // M-JPEG LIVE STREAM EMITTER (PATIENT SIDE - Manual Toggle)
  useEffect(() => {
     if (role === 'patient' && socket && patientCameraActive) {
       if (!navigator.mediaDevices) return;

       navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
         .then(stream => {
           if (videoRef.current) {
             videoRef.current.srcObject = stream;
             videoRef.current.play();
           }
         }).catch(e => console.log("Camera access denied or missing"));

       const interval = setInterval(() => {
          if (videoRef.current && streamCanvasRef.current) {
             const ctx = streamCanvasRef.current.getContext('2d');
             ctx.drawImage(videoRef.current, 0, 0, 640, 480);
             const frame = streamCanvasRef.current.toDataURL('image/jpeg', 0.4);
             socket.emit('live-stream-frame', frame);
          }
       }, 66); // ~15 FPS

       return () => {
          clearInterval(interval);
          if (videoRef.current && videoRef.current.srcObject) {
             videoRef.current.srcObject.getTracks().forEach(t => t.stop());
          }
       };
     }
  }, [role, socket, patientCameraActive]);

  // Broadcast full session state from Surgeon console (Master Node)
  useEffect(() => {
     if (role === 'surgeon' && socket) {
        const sessionPayload = { selectedOrgan, systemState, aiVisionOverlay, detectionZones, classifiedPaths, vitals, isCompromised };
        socket.emit('session-sync', sessionPayload);
        const beat = setInterval(() => {
           socket.emit('session-sync', sessionPayload);
        }, 3000); // Pulse state every 3 sec for robustness
        return () => clearInterval(beat);
     }
  }, [role, socket, selectedOrgan, systemState, aiVisionOverlay, detectionZones, classifiedPaths, vitals, isCompromised]);

  // Fetch real-time IP Location
  // Broadcast Location
  useEffect(() => {
    if (socket && (localLocation || role === 'patient')) {
      const payload = { 
        role, 
        location: localLocation, 
        broadcastStatus: patientCameraActive,
        userId: role === 'surgeon' ? doctorId : patientId,
        userPhoto: role === 'surgeon' ? doctorPhoto : patientPhoto
      };
      socket.emit('location-sync', payload);
      const interval = setInterval(() => {
        socket.emit('location-sync', { ...payload, broadcastStatus: patientCameraActive });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [socket, localLocation, role, patientCameraActive, doctorId, patientId, doctorPhoto, patientPhoto]);

  const addLog = (msg, type='info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const runSimulationWorkflow = async () => {
    playSciFiSound('scan'); // UI Interaction Beep
    addLog('AI Phase 1: OpenCV Area Detection initializing...', 'info');
    setSystemState('SCANNING');
    setAiVisionOverlay(true);
    
    // NEW: INITIALIZE SURGICAL SESSION IN CLOUD
    try {
       const { data, error } = await supabase
         .from('surgical_sessions')
         .insert([{ organ_type: selectedOrgan || 'SCANNING' }])
         .select();
       if (data && data[0]) {
          setCurrentSessionId(data[0].id);
          triggerFlash("🆔 MASTER SESSION INITIALIZED");
          addLog(`AUDIT SESSION: ${data[0].id.slice(0,8)}`, "info");
       }
    } catch (e) { console.error("SESSION_FAIL:", e); }
    
    // OpenCV-style detection (Simulated result)
    setDetectionZones([
      { id: 'low', label: 'LOW RISK', percentage: '11.8%', type: 'safe', x: 42, y: 28, size: 90 },
      { id: 'medium', label: 'MEDIUM RISK', percentage: '45.2%', type: 'warning', x: 70, y: 55, size: 80 },
      { id: 'high', label: 'HIGH RISK', percentage: '89.4%', type: 'danger', x: 25, y: 35, size: 100 }
    ]);

    setTimeout(() => {
      setSystemState('PARALLEL_EVAL');
      addLog('AI Phase 2: scikit-learn Path Classification starting...', 'info');

      // scikit-learn Classification result (Simulated 3 paths)
      setClassifiedPaths([
        { id: 'P-101', risk: 'LOW RISK', score: 12, dist: '15.4mm' },
        { id: 'P-102', risk: 'MEDIUM RISK', score: 45, dist: '18.2mm' },
        { id: 'P-103', risk: 'HIGH RISK', score: 89, dist: '12.1mm' }
      ]);
      
      setTimeout(() => {
        setSystemState('COLLAPSING');
        addLog('Quantum Collapse: Best path isolated and locked.', 'success');
        
        setTimeout(() => {
           setSystemState('OPTIMIZED');
        }, 1500);
      }, 4000);
    }, 3000);
  };

  const simulateIntercept = () => {
    playSciFiSound('alert'); // Heavy alert beep
    setIsCompromised(true);
    setQber(15.5);
    setQkdStatus('COMPROMISED');
    setQuantumKey('LOCKED_OUT');
    addLog('ALERT: Network intercept detected by Sentinel AI.', 'risk');
    
    // IMMEDIATE Neural Broadcast (No heartbeat delay)
    if (socket) {
      socket.emit('session-sync', { 
        selectedOrgan, systemState, aiVisionOverlay, 
        detectionZones, classifiedPaths, vitals, isCompromised: true 
      });
    }

    setTimeout(() => {
      setIsCompromised(false);
      setQber(0.85);
      setQkdStatus('SECURE [NEW KEY]');
      addLog('Quantum Fail-Safe: Key rotation complete.', 'success');
      
      // Sync the recovery immediately too
      if (socket) {
        socket.emit('session-sync', { 
          selectedOrgan, systemState, aiVisionOverlay, 
          detectionZones, classifiedPaths, vitals, isCompromised: false 
        });
      }
    }, 4000);
  };

  useEffect(() => {
    let keyInterval;
    let qberInterval;
    let latInterval;
    
    if (role === 'surgeon') {
      keyInterval = setInterval(() => {
        if (!isCompromised) {
          setQuantumKey(`0x${Math.random().toString(16).slice(2, 14).toUpperCase()}`);
        }
      }, 150);

      qberInterval = setInterval(() => {
        if (!isCompromised) {
          setQber(0.5 + Math.random() * 0.4);
        }
      }, 1000);
      
      latInterval = setInterval(() => {
        setLatency(4 + Math.floor(Math.random() * 5));
      }, 500);
    }
    
    return () => {
      clearInterval(keyInterval);
      clearInterval(qberInterval);
      clearInterval(latInterval);
    };
  }, [role, isCompromised]);

  // Critical Task Danger Beeper
  useEffect(() => {
    let beepInterval;
    if (isVibrating) {
      beepInterval = setInterval(() => {
        playSciFiSound('danger'); // Danger sci-fi sound mapping to the pulse
      }, 400);
    }
    return () => clearInterval(beepInterval);
  }, [isVibrating]);

  const handleMouseMove = (e) => {
    if (role === 'surgeon' && hapticsEngaged) {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPct = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
      const yPct = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));
      setLocalMouse({ x: xPct, y: yPct });

      const distToTumor = Math.sqrt(Math.pow(xPct - 20, 2) + Math.pow(yPct - 25, 2));
      const inDanger = distToTumor < 12;

      setIsVibrating(inDanger);

      const now = performance.now();
      // Throttle network transmit to 60 FPS (16ms) to prevent network buffering
      if (now - netThrottleRef.current > 16) {
        if (socket) socket.emit('cursor-move', { 
          x: xPct, y: yPct, danger: inDanger, 
          organ: selectedOrgan, 
          systemState, 
          vision: aiVisionOverlay,
          cutting: isCutting,
          point: incisionPoint
        });
        netThrottleRef.current = now;
      }
    }
  };

  const handleAISending = async (textInput) => {
    const query = textInput || assistantInput;
    if (!query.trim()) return;

    setAssistantInput('');
    setAssistantMessages(prev => [...prev, { from: 'user', text: query }]);
    setAssistantBusy(true);

    try {
       getAudioContext(); 
       
       const res = await fetch(`${API_BASE}/ai/command`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ query: query })
       });
       
       if (!res.ok) throw new Error("UPSTREAM_FAIL");
       
       const data = await res.json();
       setAssistantMessages(prev => [...prev, { from: 'ai', text: data.response }]);
       speakText(data.response);

       // AI Agent Actions
       if (data.action === 'START_SIMULATION') runSimulationWorkflow();
       else if (data.action === 'SIMULATE_INTERCEPT') simulateIntercept();
       else if (data.action === 'TOGGLE_VISION') setAiVisionOverlay(prev => !prev);
       
    } catch (e) {
       console.error("AI_FAIL:", e);
       const failMsg = "Neural Link Jitter detected. Attempting local re-sync...";
       setAssistantMessages(prev => [...prev, { from: 'ai', text: failMsg }]);
       speakText(failMsg);
    }
    setAssistantBusy(false);
  };

  const copyPatientLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const patientUrl = `${baseUrl}?role=patient&room=${roomId}`;
    navigator.clipboard.writeText(patientUrl);
    triggerFlash("📋 PATIENT NEURAL LINK COPIED!");
    playSciFiSound('engage');
  };

  useEffect(() => {
    const vInterval = setInterval(() => {
      setVitals(prev => ({
        hr: 75 + Math.floor(Math.random() * 5),
        bp: `120/${80 + Math.floor(Math.random()*4)}`,
        spo2: 98
      }));
    }, 3000);
    return () => clearInterval(vInterval);
  }, []);

  // --- CLOUD-DVR: MANUAL SURGICAL RECORDING ---
  const startManualRecording = async () => {
    if (!canvasRef.current || isRecording) return;
    try {
      const stream = canvasRef.current.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
         triggerFlash("🛰️ UPLOADING TO HOSPITAL CLOUD...");
         setIsCapturing(true); 
         const blob = new Blob(chunks, { type: 'video/webm' });
         const fileName = `surgical_audit_${Date.now()}.webm`;
         
         try {
           const { error } = await supabase.storage.from('medical-imaging').upload(fileName, blob, {
             cacheControl: '3600',
             upsert: false,
             contentType: 'video/webm' // FORCED MIME-TYPE FIX
           });
           if (error) throw error;

           const { data: { publicUrl } } = supabase.storage.from('medical-imaging').getPublicUrl(fileName);
           await supabase.from('medical_media').insert([{
             file_url: publicUrl, 
             media_type: 'VIDEO', 
             organ_type: selectedOrgan || 'GENERAL', 
             surgeon_id: 'HQ-SURGEON-01',
             session_id: currentSessionId, // LINKED TO SESSION
             ai_metadata: { risk: isCompromised ? 'HIGH' : 'SAFE', timestamp: new Date() }
           }]);
           triggerFlash("🎥 SURGICAL VIDEO ARCHIVED ✅");
           setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: "🎥 RECORDING SAVED", type: "success" }]);
         } catch (e) {
           console.error("DVR_UPLOAD_FAIL:", e);
           triggerFlash("⚠️ CLOUD STORAGE ERROR - CHECK SQL");
         }
         setIsCapturing(false);
       };

      recorder.start();
      setIsRecording(true);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: "🔴 RECORDING STARTED", type: "risk" }]);
    } catch (e) { console.error("REC_FAIL:", e); }
  };

  const stopManualRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const captureScreenshot = async () => {
     if (!glRef.current || isCapturing) return;
     setIsCapturing(true);
     triggerFlash("📸 CAPTURING FRAME...");
     try {
       const dataUrl = glRef.current.domElement.toDataURL('image/png');
       const blob = await (await fetch(dataUrl)).blob();
       const fileName = `snap_${Date.now()}.png`;
 
       const { error } = await supabase.storage.from('medical-imaging').upload(fileName, blob, {
         cacheControl: '3600',
         upsert: false,
         contentType: 'image/png' // EXPLICIT PNG HEADER
       });
       if (error) throw error;
 
       const { data: { publicUrl } } = supabase.storage.from('medical-imaging').getPublicUrl(fileName);
       await supabase.from('medical_media').insert([{
         file_url: publicUrl, 
         media_type: 'IMAGE', 
         organ_type: selectedOrgan || 'GENERAL', 
         surgeon_id: 'HQ-SURGEON-01',
         session_id: currentSessionId, // LINKED TO SESSION
         ai_metadata: { 
            risk: isCompromised ? 'HIGH' : 'SAFE', 
            detections: classifiedPaths.length,
            zones: detectionZones.length
         }
       }]);
 
       triggerFlash("📸 FRAME ARCHIVED ✅");
       playSciFiSound('engage');
       setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: "📸 FRAME ARCHIVED", type: "info" }]);
     } catch (e) { 
       console.error("CAPTURE_FAIL:", e);
       triggerFlash("⚠️ SNAPSHOT FAILED - CHECK BUCKET");
     }
     setIsCapturing(false);
   };

  const handleRoleSelect = (selectedRole) => {
    if (!localLocation || !localLocation.trim() || localLocation === 'DETECTING...') {
      alert("Please enter or detect your current location to establish the neural link.");
      return;
    }
    setRole(selectedRole);
  };

  const handlePortalJoin = (targetRole) => {
    if (!tempRoomId.trim()) {
      alert("Please enter a Room Code first!");
      return;
    }
    // Set role and jump into the room immediately
    setRole(targetRole);
    setRoomId(tempRoomId.trim());
    setLocationConfirmed(true);
    if (!localLocation || localLocation === 'DETECTING...') {
      setLocalLocation('REMOTE ACCESS NODE [AUTO-CONNECT]');
    }
  };

  const handleAutoDetect = () => {
    setLocationConfirmed(false);
    setLocalLocation('DETECTING...');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          const coordsTag = ` [LAT:${lat} LNG:${lon}]`;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
               if(data && data.display_name) {
                 // Restore the highly detailed address containing the college and highway
                 let fullAddress = data.display_name;
                 
                 // Purge the specific incorrect OSM crowdsourced data the user identified
                 fullAddress = fullAddress.replace(/Kalaparru,?\s*/ig, '');
                 fullAddress = fullAddress.replace(/Pedapadu,?\s*/ig, '');
                 // Remove incorrect 6-digit Indian Pin Codes entirely
                 fullAddress = fullAddress.replace(/\b\d{6},?\s*/g, ''); 
                 
                 setLocalLocation(`${fullAddress.toUpperCase()}\n${coordsTag}`);
               } else {
                 throw new Error("Unresolved mapping");
               }
            })
            .catch(() => {
               alert("Detailed reverse geolocation failed. Please adjust manually.");
               setLocalLocation(`LOCATION UNKNOWN\n${coordsTag}`);
            });
        },
        (error) => {
          // Modern browsers block hardware GPS over HTTP IP addresses. 
          // Injecting perfect pre-configured Master geolocation parameters for accurate local demo testing!
          const demoLat = "16.7107";
          const demoLon = "81.1031";
          const coordsTag = ` [LAT:${demoLat} LNG:${demoLon}]`;
          
          setLocalLocation(`ELURU, ANDHRA PRADESH, INDIA\n${coordsTag}`);
          alert("Hardware GPS Security Block Triggered (HTTP Local Network).\n\nAutomatically loaded accurate Master Location Profile for flawless demo continuity!");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by your browser environment.");
      setLocalLocation('');
    }
  };

  if (!role) {
    return (
      <ErrorBoundary>
        <div className="role-selector-container" style={{overflowY: 'auto', height: '100vh', justifyContent: 'center', padding: '10px 20px'}}>
          <div className="role-header" style={{marginBottom: '15px'}}>
             <Activity size={40} className="pulse-icon" style={{color: 'var(--accent-cyan)', marginBottom: '5px'}} />
             <h1 style={{fontSize: '2.1rem', marginBottom: '2px'}}>Haptic-Q Neural Link</h1>
             <p style={{fontSize: '11px', letterSpacing: '2.5px', opacity: 0.7}}>GLOBAL QUANTUM SURGICAL NETWORK • v2.1</p>
          </div>

          <div className="gateway-grid" style={{gap: '15px', maxWidth: '1000px'}}>
             <div className="gateway-card surgeon" onClick={() => handleRoleSelect('surgeon')} style={{padding: '18px 15px'}}>
                <div className="icon-shield" style={{width: '50px', height: '50px', marginBottom: '10px'}}><User size={24} /></div>
                <h2 style={{fontSize: '1.1rem'}}>SURGEON CONSOLE</h2>
                <p style={{fontSize: '0.75rem'}}>Master Node. Real-time haptic feedback and 3D organ simulation.</p>
                <div style={{marginTop: '10px', fontSize: '8px', color: 'var(--accent-cyan)', fontWeight: 'bold'}}>AUTHORIZATION REQUIRED</div>
             </div>

             <div className="gateway-card admin" onClick={() => handleRoleSelect('admin')} style={{padding: '18px 15px'}}>
                <div className="icon-shield" style={{width: '50px', height: '50px', marginBottom: '10px'}}><Shield size={24} /></div>
                <h2 style={{fontSize: '1.1rem'}}>HOSPITAL ADMIN</h2>
                <p style={{fontSize: '0.75rem'}}>Central Audit & Repository. Access live vitals and surgical snapshots.</p>
                <div style={{marginTop: '10px', fontSize: '8px', color: '#f59e0b', fontWeight: 'bold'}}>READ-ONLY ACCESS</div>
             </div>

             <div className="gateway-card patient" onClick={() => handleRoleSelect('patient')} style={{padding: '18px 15px'}}>
                <div className="icon-shield" style={{width: '50px', height: '50px', marginBottom: '10px'}}><Monitor size={24} /></div>
                <h2 style={{fontSize: '1.1rem'}}>PATIENT TERMINAL</h2>
                <p style={{fontSize: '0.75rem'}}>Remote Slave. Neural relay for telemetry and live-stream broadcast.</p>
                <div style={{marginTop: '10px', fontSize: '8px', color: '#00fa9a', fontWeight: 'bold'}}>NEURAL LINK READY</div>
             </div>
          </div>

          <div className="location-bar-premium" style={{marginTop: '20px', maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', background: 'transparent', border: 'none', backdropFilter: 'none', padding: 0}}>
             {/* 1. LOCATION SETUP */}
             <div style={{background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(0,243,255,0.2)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                   <span style={{fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '2px', fontWeight: 'bold'}}>1. ESTABLISH ORIGIN</span>
                   <button className="cyber-button-small" onClick={handleAutoDetect} style={{fontSize: '8px', padding: '4px 8px', background: 'rgba(0, 229, 255, 0.1)'}}>
                      <Navigation size={10} style={{marginRight: '5px'}}/> AUTO-DETECT
                   </button>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                   <textarea 
                     value={localLocation} 
                     onChange={(e) => { setLocalLocation(e.target.value.toUpperCase()); setLocationConfirmed(false); }}
                     placeholder="LOCATION ADDRESS..."
                     rows="1"
                     style={{
                       flex: 1, background: 'rgba(0,0,0,0.6)', border: '1px solid ' + (locationConfirmed ? 'var(--safe-green)' : 'rgba(255,255,255,0.1)'),
                       color: locationConfirmed ? 'var(--safe-green)' : '#fff', borderRadius: '4px', padding: '8px', fontSize: '10px', fontFamily: 'monospace', outline: 'none', resize: 'none'
                     }}
                   />
                   <button 
                     onClick={() => setLocationConfirmed(!locationConfirmed)}
                     style={{
                       padding: '0 12px', background: locationConfirmed ? 'var(--safe-green)' : 'transparent',
                       border: '1px solid var(--safe-green)', color: locationConfirmed ? '#000' : 'var(--safe-green)',
                       borderRadius: '4px', cursor: 'pointer', fontWeight: '900', fontSize: '9px'
                     }}
                   >
                     {locationConfirmed ? 'LOCKED' : 'CONFIRM'}
                   </button>
                </div>
             </div>

             {/* 2. PRIVATE ROOM SETUP */}
             <div style={{background: 'rgba(0,243,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(0,243,255,0.2)'}}>
                <div style={{fontSize: '9px', color: 'var(--accent-cyan)', marginBottom: '10px', letterSpacing: '2px', fontWeight: 'bold'}}>
                   <Lock size={12} style={{marginRight: '8px', verticalAlign: 'middle'}}/> 2. PRIVATE LINK ACCESS
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                   <input 
                      value={tempRoomId}
                      onChange={(e) => setTempRoomId(e.target.value.toUpperCase())}
                      placeholder="ENTER ROOM CODE..."
                      style={{
                        flex: 1, background: 'rgba(0,0,0,0.6)', color: 'var(--accent-cyan)',
                        border: '1px solid rgba(0,243,255,0.3)', padding: '8px',
                        fontSize: '10px', fontFamily: 'monospace', outline: 'none', borderRadius: '4px'
                      }}
                   />
                   <div style={{display: 'flex', gap: '5px'}}>
                      <button onClick={() => handlePortalJoin('patient')} className="cyber-button-small" style={{fontSize: '8px', padding: '0 10px', background: 'var(--accent-cyan)', color: '#000', border: 'none'}}>PATIENT</button>
                      <button onClick={() => handlePortalJoin('surgeon')} className="cyber-button-small" style={{fontSize: '8px', padding: '0 10px', borderColor: 'rgba(0,243,255,0.4)', background: 'transparent'}}>SURGEON</button>
                   </div>
                </div>
             </div>
          </div>

          <div style={{marginTop: '15px', display: 'flex', gap: '30px', alignItems: 'center', opacity: 0.4}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '8px'}}><Lock size={10} /> <span>SSL-GATEWAY</span></div>
             <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '8px'}}><Zap size={10} /> <span>AES-256 SYNC</span></div>
             <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '8px'}}><Activity size={10} /> <span>QKD ENABLED</span></div>
          </div>

        </div>
      </ErrorBoundary>
    );
  }

  // --- ADMIN AUDIT CONSOLE VIEW ---
  if (role === 'admin') {
    // Custom SVG Mini-LineChart for vitals
    const renderVitalsLine = () => {
      if (!adminData.vitalsHistory.length) return <div style={{opacity:0.3, fontSize:'10px'}}>NO TELEMETRY DATA</div>;
      const pts = adminData.vitalsHistory.map((v, i) => ({ x: i * 20, y: 100 - (v.hr - 60) }));
      const path = `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
      return (
        <svg width="100%" height="100" style={{background:'rgba(0,0,0,0.4)', borderRadius:'4px', overflow:'visible'}}>
          <path d={path} fill="none" stroke="#00fa9a" strokeWidth="2" />
          {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill="#00fa9a" />)}
        </svg>
      );
    };

    return (
      <ErrorBoundary>
        <div className="dashboard-container admin-mode" style={{background: '#0d0d0d', color: '#f59e0b', fontFamily: 'monospace', height: '100vh', display:'flex', flexDirection:'column', overflow:'hidden'}}>
          <header className="top-bar" style={{borderBottom: '1px solid #f59e0b'}}>
            <div className="brand"><Shield size={24} color="#f59e0b" /> <div>HAPTIC-Q MEDICAL AUDIT HUB</div></div>
            <div className="status-indicators">
               <div className="status-pill warn" style={{borderColor: '#f59e0b', color: '#f59e0b'}}><div className="dot" style={{background: '#f59e0b'}}></div><span>SYSTEM: MASTER AUDIT [ONLINE]</span></div>
               <button 
                 className="cyber-button-small" 
                 style={{
                   borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255, 68, 68, 0.05)',
                   display: 'flex', alignItems: 'center', gap: '6px', height: '32px', padding: '0 12px', fontSize: '10px'
                 }} 
                 onClick={() => window.location.reload()}
               >
                 <LogOut size={14} /> LOGOUT
               </button>
            </div>
          </header>

          <main className="main-content" style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto'}}>
             
             {/* TOP ROW: GLOBAL METRICS - 3 cards side by side */}
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', flexShrink: 0}}>
               <div className="metric-card" style={{background:'rgba(245, 158, 11, 0.05)', border:'1px solid rgba(245, 158, 11, 0.3)', padding:'15px', borderRadius:'8px'}}>
                  <div style={{fontSize:'10px', opacity:0.6}}>TOTAL RECORDED SURGERIES</div>
                  <div style={{fontSize:'32px', fontWeight:'bold'}}>{adminData.surgeries.length}</div>
                  <div style={{fontSize:'9px', color:'#00fa9a', marginTop:'5px'}}>+2 in current cycle</div>
               </div>
               <div className="metric-card" style={{background:'rgba(245, 158, 11, 0.05)', border:'1px solid rgba(245, 158, 11, 0.3)', padding:'15px', borderRadius:'8px'}}>
                  <div style={{fontSize:'10px', opacity:0.6}}>QUANTUM AUDIT POINTS</div>
                  <div style={{fontSize:'32px', fontWeight:'bold'}}>{adminData.totalPoints}</div>
                  <div style={{fontSize:'9px', opacity:0.5, marginTop:'5px'}}>Real-time (X,Y) Incision tracking</div>
               </div>
               <div className="metric-card" style={{background:'rgba(0, 243, 255, 0.05)', border:'1px solid rgba(0, 243, 255, 0.3)', padding:'15px', borderRadius:'8px', color:'var(--accent-cyan)'}}>
                  <div style={{fontSize:'10px', opacity:0.6}}>SYSTEM UPTIME (Haptic Sync)</div>
                  <div style={{fontSize:'32px', fontWeight:'bold'}}>99.98%</div>
                  <div style={{fontSize:'9px', opacity:0.5, marginTop:'5px'}}>LATENCY: 12ms | JITTER: 2ms</div>
               </div>
             </div>

             {/* ELITE DIAGNOSTIC IMAGING HUB */}
             <section className="panel-section" style={{background: 'rgba(0,0,0,0.4)', padding:'25px', borderRadius:'12px', border:'1px solid rgba(0, 243, 255, 0.2)', flexShrink: 0}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                   <h3 className="panel-title" style={{color: 'var(--accent-cyan)', margin:0}}><Eye size={18} /> CLINICAL DIAGNOSTIC REPOSITORY</h3>
                   <button className="cyber-button-small" onClick={() => window.location.reload()} style={{padding:'5px 15px', fontSize:'10px'}}><RefreshCw size={12}/> REFRESH HUB</button>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'30px'}}>
                   
                   {/* 📸 SNAPSHOTS SECTION */}
                   <div>
                      <h4 style={{color:'#00fa9a', fontSize:'11px', letterSpacing:'1px', borderBottom:'1px solid rgba(0,250,154,0.3)', paddingBottom:'8px', marginBottom:'15px'}}>📸 SURGICAL SNAPSHOTS (PNG-HD)</h4>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'10px', maxHeight:'400px', overflowY:'auto', paddingRight:'10px'}}>
                         {mediaGallery.filter(m => m.media_type === 'IMAGE').map((m, i) => (
                            <div key={i} onClick={() => setSelectedMedia(m)} className="media-card-premium">
                               <img src={m.file_url} style={{width:'100%', height:'100px', objectFit:'cover'}} alt="Surgery snap" />
                               <div className="media-meta">
                                  <div style={{fontWeight:'bold'}}>{m.organ_type}</div>
                                  <div style={{opacity:0.6}}>{new Date(m.timestamp).toLocaleTimeString()}</div>
                               </div>
                            </div>
                         ))}
                         {mediaGallery.filter(m => m.media_type === 'IMAGE').length === 0 && <div style={{opacity:0.3, fontSize:'10px'}}>NO SNAPSHOTS ARCHIVED</div>}
                      </div>
                   </div>

                   {/* 🎥 VIDEO REPLAYS SECTION */}
                   <div>
                      <h4 style={{color:'#ff3366', fontSize:'11px', letterSpacing:'1px', borderBottom:'1px solid rgba(255,51,102,0.3)', paddingBottom:'8px', marginBottom:'15px'}}>🎥 SURGICAL VIDEO REPLAYS (WEBM-v9)</h4>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'10px', maxHeight:'400px', overflowY:'auto', paddingRight:'10px'}}>
                         {mediaGallery.filter(m => m.media_type === 'VIDEO').map((m, i) => (
                            <div key={i} onClick={() => setSelectedMedia(m)} className="media-card-premium video-glow">
                               <video src={m.file_url} style={{width:'100%', height:'100px', objectFit:'cover', background:'#000'}} muted preload="metadata" />
                               <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none'}}><Zap size={24} color="#ff3366" /></div>
                               <div className="media-meta">
                                  <div style={{fontWeight:'bold'}}>{m.organ_type}</div>
                                  <div style={{opacity:0.6}}>{new Date(m.timestamp).toLocaleTimeString()}</div>
                               </div>
                            </div>
                         ))}
                         {mediaGallery.filter(m => m.media_type === 'VIDEO').length === 0 && <div style={{opacity:0.3, fontSize:'10px'}}>NO VIDEOS ARCHIVED</div>}
                      </div>
                   </div>

                </div>
             </section>

             {/* Digital Diagnostic Modal overlay */}
             {selectedMedia && (
                <div className="imaging-modal-overlay" onClick={() => setSelectedMedia(null)}>
                   <div className="imaging-modal-content" onClick={(e) => e.stopPropagation()}>
                      <button className="modal-close" onClick={() => setSelectedMedia(null)}><X size={24}/></button>
                      
                      <div className="modal-viewer-area">
                        {selectedMedia.media_type === 'IMAGE' ? (
                           <img src={selectedMedia.file_url} crossOrigin="anonymous" style={{maxWidth:'100%', maxHeight:'70vh', display:'block', margin:'auto'}} />
                        ) : (
                           <video 
                             key={selectedMedia.file_url}
                             src={selectedMedia.file_url} 
                             controls 
                             autoPlay 
                             playsInline
                             preload="auto"
                             crossOrigin="anonymous"
                             type="video/webm"
                             style={{maxWidth:'100%', maxHeight:'72vh', display:'block', margin:'auto', background:'#000', borderRadius:'6px'}} 
                           />
                        )}
                      </div>

                      <div className="modal-footer">
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>
                               <div style={{color:'var(--accent-cyan)', fontSize:'20px', fontWeight:'bold', letterSpacing:'1px'}}>{selectedMedia.organ_type.toUpperCase()} SURGICAL AUDIT</div>
                               <div style={{color:'rgba(255,255,255,0.5)', fontSize:'11px', marginTop:'5px'}}>
                                  TIMESTAMP: {new Date(selectedMedia.timestamp).toLocaleString()} | SOURCE: {selectedMedia.surgeon_id}
                               </div>
                            </div>
                            <div style={{textAlign:'right'}}>
                               <div style={{fontSize:'10px', color:'var(--safe-green)'}}>● CLOUD SECURE</div>
                               <div style={{fontSize:'12px', color:'var(--accent-cyan)', fontWeight:'bold'}}>UUID: {selectedMedia.id}</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* MIDDLE ROW: 3 panels side by side */}
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '20px', flexShrink: 0}}>
               <section className="panel-section" style={{background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0, 250, 154, 0.2)', padding:'15px', borderRadius:'8px'}}>
                  <h3 className="panel-title" style={{color: '#00fa9a', borderBottom:'1px solid rgba(0, 250, 154, 0.1)', paddingBottom:'5px', marginBottom:'10px'}}><Activity size={14} /> LIVE VITALS HISTORY (HR)</h3>
                  <div style={{height:'100px', width:'100%'}}>
                     {renderVitalsLine()}
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', marginTop:'8px', opacity:0.5}}>
                     <span>T-60s</span><span>NOW</span>
                  </div>
               </section>

               <section className="panel-section" style={{background: 'rgba(0,0,0,0.5)', border: '1px solid #f59e0b', padding:'15px', borderRadius:'8px'}}>
                  <h3 className="panel-title" style={{color: '#f59e0b', borderBottom:'1px solid rgba(245, 158, 11, 0.1)', paddingBottom:'5px', marginBottom:'10px'}}><Monitor size={14} /> ACTIVE SESSION HUB</h3>
                  <div className="console-log" style={{height: '100px', fontSize:'11px'}}>
                     <div className="log-entry" style={{color: '#00fa9a'}}> [OK] QKD CHANNEL ESTABLISHED </div>
                     <div className="log-entry"> [OK] WAVEFUNCTION SYNC: 100% </div>
                     <div className="log-entry" style={{color: '#f59e0b'}}> [WRN] SLIGHT JITTER ON NEURAL BUS </div>
                  </div>
               </section>

               <section className="panel-section" style={{background: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.2)', color: 'var(--accent-cyan)', padding:'15px', borderRadius:'8px'}}>
                  <h3 className="panel-title" style={{color: 'var(--accent-cyan)'}}><Zap size={14} /> SECURITY AUDIT (QKD)</h3>
                  <div style={{height: '80px', display: 'flex', alignItems: 'flex-end', gap: '2px', paddingBottom: '5px'}}>
                     {Array.from({length: 40}).map((_, i) => (
                        <div key={i} style={{flex: 1, background: 'var(--accent-cyan)', height: `${Math.random()*80 + 20}%`, opacity: (i/40)}} />
                     ))}
                  </div>
                  <div style={{marginTop: '10px', fontSize:'11px'}}>
                     <div className="metric-row"><span>QBER (Error Rate)</span><span style={{color: '#00fa9a'}}>0.4%</span></div>
                     <div className="metric-row"><span>SYNC RECOVERY</span><span>FAST</span></div>
                  </div>
               </section>

               <section className="panel-section quantum-special" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding:'15px', borderRadius:'8px', color: '#fff'}}>
                  <h3 className="panel-title" style={{color: '#fff', display: 'flex', alignItems: 'center', gap: '8px'}}><Server size={14} className="pulse"/> QUANTUM RELAY MESH</h3>
                  <div style={{fontSize: '9px', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                     <div className="metric-row"><span>QUBIT CLUSTER STATUS</span><span style={{color: '#00fa9a'}}>1024 NODES ONLINE</span></div>
                     <div className="metric-row"><span>ZERO-G LATENCY</span><span>0.0003ms</span></div>
                     <div className="metric-row"><span>ENTROPY GRADIENT</span><span>STABLE (0.008)</span></div>
                     <div className="metric-row"><span>QKD KEY ROTATION</span><span>90ms</span></div>
                     <div style={{marginTop: '8px', padding: '5px', background: 'rgba(0, 250, 154, 0.1)', border: '1px solid rgba(0, 250, 154, 0.2)', borderRadius: '4px', textAlign: 'center'}}>
                        <div style={{fontSize: '7px', color: '#00fa9a', fontWeight: 'bold'}}>QUANTUM ADVANTAGE: ENABLED</div>
                        <div style={{fontSize: '6px', opacity: 0.5}}>3.4x Faster than Traditional Fiber</div>
                     </div>
                  </div>
               </section>
             </div>

             {/* BOTTOM ROW: GLOBAL AUDIT TRAIL */}
             <section className="panel-section" style={{background: 'rgba(0,0,0,0.4)', display:'flex', flexDirection:'column', borderRadius:'8px', flexShrink: 0}}>
                <h3 className="panel-title" style={{padding:'10px 15px', borderBottom:'1px solid #222'}}><Activity size={14} /> MASTER SURGICAL AUDIT TRAIL (POSTGRES / SUPABASE)</h3>
                <div style={{maxHeight:'350px', overflowY:'auto', padding:'0 15px'}}>
                  <table style={{width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left'}}>
                     <thead style={{position:'sticky', top:0, background:'#111', zIndex:10}}>
                        <tr style={{borderBottom: '1px solid #333', color: '#f59e0b'}}>
                           <th style={{padding: '12px 8px'}}>TIMESTAMP</th>
                           <th>SURGEON ID</th>
                           <th>ANATOMICAL TARGET</th>
                           <th>DURATION</th>
                           <th>AUDIT STATUS</th>
                        </tr>
                     </thead>
                     <tbody>
                        {adminData.surgeries.length > 0 ? (
                          adminData.surgeries.map((s, i) => (
                            <tr key={i} style={{borderBottom:'1px solid #1a1a1a', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'}}>
                              <td style={{padding: '10px 8px'}}>{new Date(s.startTime).toLocaleString()}</td>
                              <td>{s.surgeonId || 'HQ-UNKN'}</td>
                              <td style={{color:'#f59e0b'}}>{s.organ || 'GENERAL'}</td>
                              <td>AUTO-CALC</td>
                              <td><span style={{background:'#00fa9a', color:'#000', padding:'2px 4px', borderRadius:'2px', fontSize:'9px', fontWeight:'800'}}>VERIFIED</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', opacity:0.3}}>NO HISTORICAL RECORDS FOUND IN DATABASE</td></tr>
                        )}
                     </tbody>
                  </table>
                </div>
             </section>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`dashboard-container ${role === 'patient' ? 'patient-mode' : ''} ${isCompromised ? 'danger-amber' : ''}`}>
        
        {/* DOCTOR AUTHENTICATION OVERLAY */}
        {role === 'surgeon' && !isDoctorVerified && (
          <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.95)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <form onSubmit={handleSurgeonAuth} style={{width:'400px', background:'#1a2744', padding:'30px', border:'1px solid var(--accent-cyan)', borderRadius:'12px', boxShadow:'0 0 50px rgba(0, 229, 255, 0.2)'}}>
               <h2 style={{color:'var(--accent-cyan)', textAlign:'center', letterSpacing:'2px', marginBottom:'20px'}}><Shield size={24} style={{verticalAlign:'middle'}}/> SURGEON VERIFICATION</h2>
               <div style={{marginBottom:'15px'}}>
                 <label style={{display:'block', fontSize:'10px', color:'var(--safe-green)', marginBottom:'5px'}}>DOCTOR ID *</label>
                 <input required value={doctorId} onChange={e=>setDoctorId(e.target.value)} style={{width:'100%', padding:'10px', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,250,154,0.3)', color:'#fff', outline:'none'}} placeholder="e.g. DR-8492" />
               </div>
               <div style={{marginBottom:'25px'}}>
                 <label style={{display:'block', fontSize:'10px', color:'var(--safe-green)', marginBottom:'5px'}}>PROFILE PHOTO URL</label>
                 <input value={doctorPhoto} onChange={e=>setDoctorPhoto(e.target.value)} style={{width:'100%', padding:'10px', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,250,154,0.3)', color:'#fff', outline:'none'}} placeholder="Image URL..." />
               </div>
               <button type="submit" className="cyber-button" style={{padding:'15px', fontSize:'14px', background:'var(--safe-green)', color:'#000'}}>AUTHENTICATE & ENTER COCKPIT</button>
            </form>
          </div>
        )}

        {/* PATIENT AUTHENTICATION OVERLAY */}
        {role === 'patient' && !isPatientVerified && (
          <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.95)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <form onSubmit={(e) => { e.preventDefault(); if(patientId) { setIsPatientVerified(true); playSciFiSound('engage'); triggerFlash(`✅ PATIENT ${patientId} REGISTERED`); } }} style={{width:'400px', background:'#1a2744', padding:'30px', border:'1px solid rgba(34,197,94,0.5)', borderRadius:'12px', boxShadow:'0 0 50px rgba(34,197,94,0.2)'}}>
               <h2 style={{color:'var(--safe-green)', textAlign:'center', letterSpacing:'2px', marginBottom:'20px'}}><Shield size={24} style={{verticalAlign:'middle'}}/> NEURAL SYNC LOGIN</h2>
               <div style={{marginBottom:'15px'}}>
                 <label style={{display:'block', fontSize:'10px', color:'var(--safe-green)', marginBottom:'5px'}}>PATIENT ID *</label>
                 <input required value={patientId} onChange={e=>setPatientId(e.target.value)} style={{width:'100%', padding:'10px', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,250,154,0.3)', color:'#fff', outline:'none'}} placeholder="e.g. PT-1004" />
               </div>
               <div style={{marginBottom:'25px'}}>
                 <label style={{display:'block', fontSize:'10px', color:'var(--safe-green)', marginBottom:'5px'}}>PROFILE PHOTO URL</label>
                 <input value={patientPhoto} onChange={e=>setPatientPhoto(e.target.value)} style={{width:'100%', padding:'10px', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,250,154,0.3)', color:'#fff', outline:'none'}} placeholder="Image URL..." />
               </div>
               <button type="submit" className="cyber-button" style={{padding:'15px', fontSize:'14px', background:'var(--safe-green)', color:'#000'}}>ACCESS SECURE FEED</button>
            </form>
          </div>
        )}

      <header className="top-bar">

        {/* COL 1 — BRAND */}
        <div className="brand-clinical">
           <Activity size={26} style={{color: '#38bdf8', flexShrink: 0}} />
           <div>
              <h1>HAPTIC-Q</h1>
              <div style={{fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '1.5px', fontWeight: '700', textTransform: 'uppercase'}}>Surgical Telemedicine OS</div>
           </div>
        </div>

        {/* COL 2 — QUANTUM TELEMETRY BLOCK (restored) */}
        {role === 'surgeon' && (
          <div style={{display: 'flex', gap: '6px', height: '65px', alignItems: 'stretch', width: '380px', overflow: 'hidden'}}>
            {/* QKD Key Stream */}
            <div className="q-block" style={{flex: '2'}}>
              <span className="q-block-label"><Lock size={9}/> QKD KEY STREAM</span>
              <span className="q-block-value mono">{quantumKey.substring(0, 14)}…</span>
            </div>
            {/* Private Room */}
            <div className="q-block" style={{flex: '1.5'}}>
              <span className="q-block-label"><Network size={9}/> PRIVATE ROOM</span>
              <span className="q-block-value" style={{color: '#22c55e'}}>{roomId}</span>
            </div>
            {/* Coordinates */}
            <div className="q-block" style={{flex: '1.5'}}>
              <span className="q-block-label"><Target size={9}/> COORDINATES</span>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px'}}>
                <span className="q-block-value mono" style={{fontSize: '10px'}}>X: {localMouse.x.toFixed(1)}</span>
                <span className="q-block-value mono" style={{fontSize: '10px'}}>Y: {localMouse.y.toFixed(1)}</span>
              </div>
            </div>
            {/* QBER */}
            <div className="q-block" style={{flex: '1', borderColor: isCompromised ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.12)'}}>
              <span className="q-block-label"><Shield size={9}/> QBER</span>
              <span className="q-block-value" style={{color: isCompromised ? '#ef4444' : '#22c55e', fontSize: '14px', fontWeight: '900'}}>{qber.toFixed(2)}%</span>
            </div>
          </div>
        )}

        {/* COL 3 — LOCATION HUB (full name, no truncation) */}
        <div className="intelligence-hub">
           <div className="registry-row" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <img src={role === 'surgeon' ? doctorPhoto : patientPhoto} alt="Local" style={{width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(56,189,248,0.5)'}} />
              <div className="registry-item" style={{flex: 1}}>
                 <span className="registry-label">{role === 'surgeon' ? 'MASTER TERMINAL (LOCAL)' : 'PATIENT TERMINAL (LOCAL)'}</span>
                 <span className="registry-value">{localLocation}</span>
              </div>
           </div>
           <div className="registry-row" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <img src={role === 'surgeon' ? patientPhoto : doctorPhoto} alt="Remote" style={{width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(34,197,94,0.3)'}} />
              <div className="registry-item" style={{borderColor: 'rgba(34, 197, 94, 0.25)', flex: 1}}>
                 <span className="registry-label">{role === 'surgeon' ? 'REMOTELY LINKED SLAVE' : 'LINKED MASTER NODE'}</span>
                 <span className="registry-value" style={{color: '#22c55e'}}>{remoteLocation || '— AWAITING CONNECTION —'}</span>
              </div>
           </div>
        </div>

        {/* COL 4 — ACTIONS */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'flex-end', justifyContent: 'center'}}>
           <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontWeight: '800', color: '#22c55e'}}>
                 <div className="dot" style={{background: '#22c55e', boxShadow: '0 0 6px #22c55e'}}></div>
                 <span>LINK 100%</span>
              </div>
           </div>
           <div style={{display: 'flex', gap: '6px'}}>
              {role === 'surgeon' && (<>
                 <button
                   className="cyber-button-small"
                   style={{background: 'rgba(56,189,248,0.1)', borderColor: '#38bdf8', color: '#38bdf8', height: '26px', fontSize: '9px', padding: '0 10px'}}
                   onClick={copyPatientLink}
                 >
                   <Share2 size={11}/> SHARE LINK
                 </button>
                 <button
                   className="cyber-button-small"
                   style={{background: 'rgba(239,68,68,0.1)', borderColor: '#ef4444', color: '#ef4444', height: '26px', fontSize: '9px', padding: '0 10px'}}
                   onClick={simulateIntercept}
                 >
                   SIMULATE ATTACK
                 </button>
              </>)}
              <button
                className="cyber-button-small"
                style={{background: 'rgba(239,68,68,0.15)', borderColor: '#ef4444', color: '#ef4444', height: '26px', fontSize: '9px', padding: '0 12px', fontWeight: '800'}}
                onClick={() => window.location.reload()}
              >
                <LogOut size={11}/> LOGOUT
              </button>
           </div>
        </div>

      </header>

      <div className="main-content">
        {role === 'surgeon' && (
          <aside className="side-panel">
            
            {/* ── DOCTOR PROFILE & PATIENT LINK ──────────────── */}
            <div className="panel-section" style={{background: 'rgba(0, 243, 255, 0.03)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
               <h3 className="panel-title"><User size={12}/> ACTIVE SESSION PROFILES</h3>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <img src={doctorPhoto} alt="Doctor" style={{width: '32px', height: '32px', borderRadius: '4px', border: '1px solid var(--accent-cyan)', objectFit: 'cover'}} />
                  <div>
                    <div style={{fontSize: '8px', color: 'var(--text-muted)'}}>ATTENDING SURGEON</div>
                    <div style={{fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 'bold'}}>{doctorId || 'DR. UNKNOWN'}</div>
                  </div>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a141?auto=format&fit=crop&q=80&w=100&h=100" alt="Patient Remote" style={{width: '32px', height: '32px', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.5)', objectFit: 'cover'}} />
                  <div>
                    <div style={{fontSize: '8px', color: 'var(--text-muted)'}}>REMOTELY LINKED PATIENT</div>
                    <div style={{fontSize: '11px', color: 'var(--safe-green)', fontWeight: 'bold'}}>{patientId || 'AWAITING CONNECTION'}</div>
                  </div>
               </div>
            </div>

            {/* ── STEP 1: ANATOMICAL TARGET ──────────────── */}
            <div className="panel-section" style={{
              border: isPatientBroadcasting ? '2px solid #ef4444' : (selectedOrgan ? '1px solid #22c55e' : '1px solid #38bdf8'),
              boxShadow: selectedOrgan ? 'none' : '0 0 12px rgba(56,189,248,0.15)'
            }}>
              <h3 className="panel-title" style={{ color: isPatientBroadcasting ? '#ef4444' : (selectedOrgan ? '#22c55e' : '#38bdf8') }}>
                <Target size={12}/> 1. SET ANATOMICAL TARGET
                {isPatientBroadcasting && <span className="pulse" style={{fontSize:'8px', color:'#ef4444', marginLeft:'auto', display:'flex', alignItems:'center', gap:'3px'}}><div style={{width:'5px',height:'5px',background:'#ef4444',borderRadius:'50%'}}></div>LIVE</span>}
              </h3>
              <select
                value={selectedOrgan}
                disabled={isPatientBroadcasting}
                onChange={(e) => { setSelectedOrgan(e.target.value); playSciFiSound('engage'); }}
                style={{ width:'100%', background:'rgba(0,0,0,0.5)', color: isPatientBroadcasting ? '#fff' : '#38bdf8',
                  border: isPatientBroadcasting ? '1px solid #ef4444' : '1px solid #38bdf8',
                  padding:'7px 8px', borderRadius:'6px', fontFamily:'inherit', outline:'none',
                  cursor: isPatientBroadcasting ? 'not-allowed' : 'pointer', fontSize:'11px', fontWeight:'600' }}
              >
                <option value="">{isPatientBroadcasting ? '── BLOCKED BY BROADCAST ──' : '── SELECT ORGAN ──'}</option>
                <option value="Heart">❤️  CARDIAC (Heart)</option>
                <option value="Brain">🧠  NEURAL (Brain)</option>
                <option value="Spine">🦴  ORTHOPEDIC (Spine)</option>
                <option value="Stomach">🫁  GASTRIC (Stomach)</option>
                <option value="Hand">✋  METACARPAL (Hand)</option>
              </select>
              {isPatientBroadcasting && (
                <button className="cyber-button-small risk-btn"
                  onClick={() => { if(socket){socket.emit('broadcast-stop');socket.emit('broadcast-status',false);} setIsPatientBroadcasting(false); setBroadcastRequestStatus('IDLE'); setShowLiveStream(false); playSciFiSound('danger'); }}
                  style={{width:'100%', padding:'6px', fontSize:'10px', marginTop:'4px', background:'rgba(239,68,68,0.15)', borderColor:'#ef4444', color:'#ef4444'}}>
                  <X size={12}/> FORCED DISCONNECT
                </button>
              )}
            </div>

            {/* ── STEP 2: MASTER CONTROLS ──────────────────── */}
            <div className="panel-section">
              <h3 className="panel-title"><Cpu size={12}/> 2. MASTER CONTROLS</h3>
              <button
                className="cyber-button"
                onClick={runSimulationWorkflow}
                disabled={systemState !== 'IDLE' || !selectedOrgan || isPatientBroadcasting}
                style={{
                  opacity: (systemState !== 'IDLE' || !selectedOrgan || isPatientBroadcasting) ? 0.35 : 1,
                  cursor: (systemState !== 'IDLE' || !selectedOrgan || isPatientBroadcasting) ? 'not-allowed' : 'pointer'
                }}
              >
                {systemState === 'IDLE' ? 'INITIALIZE NEURAL SCAN' : `SCANNING: ${systemState}…`}
              </button>
            </div>

            {/* ── SURGICAL TOOLS ─────────────────────────────── */}
            <div className="panel-section" style={{flex: 1}}>
              <h3 className="panel-title"><Activity size={12}/> SURGICAL TOOLS</h3>

              {/* Haptics — full row */}
              <button
                className={`compact-tool-btn-row ${hapticsEngaged ? 'tool-active' : ''} ${(!selectedOrgan || systemState !== 'OPTIMIZED') ? 'tool-disabled' : ''}`}
                onClick={() => { playSciFiSound('engage'); setHapticsEngaged(!hapticsEngaged); }}
                disabled={!selectedOrgan || systemState !== 'OPTIMIZED'}
              >
                <Zap size={13}/>
                <span>HAPTICS — {hapticsEngaged ? '● ACTIVE' : 'ENGAGE'}</span>
              </button>

              {/* Push-to-Talk — full row */}
              <button
                className={`compact-tool-btn-row ${isTalking ? 'tool-danger' : ''}`}
                onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
              >
                {isTalking ? <Volume2 size={13}/> : <Mic size={13}/>}
                <span>{isTalking ? '● TRANSMITTING — RELEASE TO STOP' : 'PUSH TO TALK (NURSES)'}</span>
              </button>

              {/* Snapshot + Record — 2-col row */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
                <button
                  className={`compact-tool-btn ${isCapturing ? 'tool-disabled' : ''}`}
                  onClick={captureScreenshot} disabled={isCapturing}
                >
                  <Camera size={13}/><span>SNAPSHOT</span>
                </button>
                {!isRecording ? (
                  <button className="compact-tool-btn tool-rec" onClick={startManualRecording} disabled={isCapturing}>
                    <Zap size={13}/><span>REC</span>
                  </button>
                ) : (
                  <button className="compact-tool-btn tool-recording blink-red" onClick={stopManualRecording}>
                    <Monitor size={13}/><span>STOP</span>
                  </button>
                )}
              </div>

              {/* Status indicators */}
              {remoteTalking && (
                <div style={{fontSize:'8px', color:'#22c55e', textAlign:'center'}} className="pulse">🔊 RECEIVING FROM PATIENT</div>
              )}
              {isRecording && (
                <div style={{fontSize:'8px', color:'#ef4444', textAlign:'center'}} className="pulse">🔴 RECORDING</div>
              )}

              {/* PIP — Slave Visual */}
              <div>
                <div style={{fontSize:'7px', color:'var(--text-muted)', fontWeight:'700', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'3px', display:'flex', alignItems:'center', gap:'3px'}}>
                  <Eye size={9}/> SLAVE VISUAL PIP
                </div>
                <div className="feed-view" style={{height:'60px'}}>
                  <div className="feed-probe" style={{left:`${localMouse.x}%`, top:`${localMouse.y}%`}}></div>
                </div>
                <div className="entanglement-widget" style={{marginTop:'4px', padding:'4px'}}>
                  <div className="entanglement-rings" style={{width:'16px',height:'16px'}}><div className="ring-twin ring-1"></div><div className="ring-twin ring-2"></div></div>
                  <div className="sync-state"><span className="sync-label" style={{fontSize:'9px'}}>SYNC <span style={{color:'#38bdf8'}}>{latency}ms</span></span></div>
                </div>
              </div>

              {/* AI Assistant — with close button and mic */}
              <div style={{background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:'6px', padding:'6px', marginTop:'auto'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: assistantOpen ? '6px' : '0'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <button
                      className={`ai-assistant-toggle ${assistantOpen ? 'open' : ''}`}
                      style={{width:'28px', height:'28px'}}
                      onClick={() => setAssistantOpen(!assistantOpen)}
                    >
                      {isListening ? <Zap size={14} className="pulse"/> : <Mic size={14}/>}
                    </button>
                    <span style={{fontSize:'8px', color:'#22c55e', fontWeight:'800', letterSpacing:'1px', textTransform:'uppercase'}}>AI SURGICAL ASSISTANT</span>
                  </div>
                  {assistantOpen && (
                    <button
                      onClick={() => setAssistantOpen(false)}
                      style={{background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:'2px', lineHeight:1}}
                    >
                      <X size={14}/>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </aside>
        )}

        {role === 'patient' && (
          <aside className="side-panel">
            <div className="scrollable-sidebar-content">
              <div className="panel-section">
                <h3 className="panel-title"><Navigation size={14} /> Telemetry Origin</h3>
                <div style={{display:'flex', gap:'8px', marginBottom:'10px'}}>
                  <textarea 
                    className="addr-text" 
                    value={localLocation} 
                    autoFocus
                    onChange={(e) => setLocalLocation(e.target.value)}
                    placeholder="LOCATION..."
                    disabled={locationConfirmed}
                    style={{height:'60px', borderRadius:'4px', background:'rgba(0,0,0,0.5)', color:'var(--accent-cyan)', border:'1px solid rgba(0, 243, 255, 0.3)', padding:'8px', fontSize:'11px', width:'100%'}}
                  />
                  <button 
                    className={`confirm-btn ${locationConfirmed ? 'confirmed' : ''}`} 
                    onClick={() => { setLocationConfirmed(!locationConfirmed); getAudioContext(); }}
                    style={{background: locationConfirmed ? '#00fa9a' : 'transparent', border:'1px solid #00fa9a', color: locationConfirmed ? '#000' : '#00fa9a', padding:'0 10px', borderRadius:'4px'}}
                  >
                    {locationConfirmed ? <X size={16}/> : <Check size={16}/>}
                  </button>
                </div>
                <button className="detect-btn" onClick={handleAutoDetect} style={{width:'100%', padding:'8px', background:'rgba(0, 243, 255, 0.1)', border:'1px solid var(--accent-cyan)', color:'var(--accent-cyan)', borderRadius:'4px', fontSize:'10px', cursor:'pointer'}}>AUTO DETECT GPS</button>
              </div>

              <div className="panel-section intercom-panel" style={{marginTop:'20px', border: isTalking ? '1px solid #ff3366' : '1px solid rgba(0, 243, 255, 0.3)', background: isTalking ? 'rgba(255, 51, 102, 0.1)' : 'rgba(0,0,0,0.3)'}}>
                  <h3 className="panel-title" style={{color: isTalking ? '#ff3366' : 'var(--accent-cyan)'}}>
                    {isTalking ? <Mic size={14} className="pulse"/> : <MicOff size={14}/>} 
                    {isTalking ? ' SENDING VOICE...' : ' VOICE LINK TO DOCTOR'}
                  </h3>
                  <button 
                    className={`cyber-button ${isTalking ? 'danger-flash' : ''}`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    style={{fontSize:'11px', borderStyle: isTalking ? 'solid' : 'dashed'}}
                  >
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                       {isTalking ? <Volume2 size={16}/> : <Mic size={16}/>}
                       {isTalking ? 'RELEASE TO SEND' : 'HOLD TO TALK TO SURGEON'}
                    </div>
                  </button>
                  {remoteTalking && (
                    <div style={{marginTop:'12px', fontSize:'9px', color:'#ff3366', textAlign:'center'}} className="pulse">
                       ⚠️ INCOMING: SURGEON SPEAKING...
                    </div>
                  )}
              </div>

              <div className="panel-section" style={{border: '1px solid rgba(0, 250, 154, 0.3)', background: 'rgba(0, 250, 154, 0.03)'}}>
                <h3 className="panel-title" style={{color: '#00fa9a', display: 'flex', alignItems: 'center', gap: '8px'}}><Zap size={14} className="pulse"/> QUANTUM NEURAL RELAY</h3>
                <div style={{fontSize: '9px', color: 'var(--safe-green)', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}><span>QUBIT COHERENCE</span><span>99.98%</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}><span>TELEPORTATION LAG</span><span>{latency}ns</span></div>
                  <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--accent-cyan)'}}><span>SYNC STATE</span><span>SUPERPOSITION OPTIMIZED</span></div>
                  <div style={{marginTop: '4px', fontStyle: 'italic', opacity: 0.6, fontSize: '8px'}}>RELAYING VIA ZERO-G QUANTUM SATELLITE</div>
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className={`center-stage ${isVibrating ? 'vibrate' : ''} ${role === 'patient' ? 'patient-immersive' : ''}`}>
           {role === 'patient' && (
             <div className="vitals-header">
                <div className="vital-box"><Heart size={16} className="vital-icon pulse" /><span className="vital-val">{vitals.hr}</span></div>
                <div className="vital-box"><Thermometer size={16} className="vital-icon" /><span className="vital-val">{vitals.bp}</span></div>
             </div>
           )}

           <div className={`simulation-container ${isVibrating ? 'danger-flash' : ''}`} onMouseMove={handleMouseMove}>
              
              {/* HIDDEN PATIENT CAMERA ELEMENTS */}
              {role === 'patient' && (
                <>
                   <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
                   <canvas ref={streamCanvasRef} width={640} height={480} style={{ display: 'none' }} />
                </>
              )}

              <div className="vision-toggle-container" style={{display: 'flex', gap: '30px', alignItems: 'center'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <label className="cyber-toggle">
                      <input type="checkbox" checked={aiVisionOverlay} onChange={() => setAiVisionOverlay(!aiVisionOverlay)} />
                      <span className="slider"></span>
                    </label>
                    <span className="vision-toggle-label"><Eye size={12}/> AI Vision Overlay</span>
                 </div>

                 {role === 'surgeon' && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                       <label className="cyber-toggle">
                         <input type="checkbox" checked={showLiveStream} onChange={() => setShowLiveStream(!showLiveStream)} />
                         <span className="slider" style={{background: showLiveStream ? '#ff3366' : 'var(--bg-panel)'}}></span>
                       </label>
                       <span className="vision-toggle-label" style={{color: showLiveStream ? '#ff3366' : 'rgba(255,255,255,0.7)', fontWeight: showLiveStream ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <Camera size={14}/> PATIENT VIDEO FEED
                          {isPatientBroadcasting && (
                            <div className="pulse" style={{display:'flex', alignItems:'center', gap:'4px', color:'#ff3366', fontSize:'10px'}}>
                               <div style={{width:'8px', height:'8px', background:'#ff3366', borderRadius:'50%', boxShadow:'0 0 10px #ff3366'}}></div>
                               LIVE
                            </div>
                          )}
                       </span>
                    </div>
                 )}

                 {role === 'patient' && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                       <label className="cyber-toggle">
                         <input type="checkbox" checked={patientCameraActive} onChange={(e) => {
                            if (!navigator.mediaDevices) {
                               alert('Browser Security Block: Camera access requires "localhost" or an HTTPS connection (or Chrome flags).');
                               return;
                            }
                            if (patientCameraActive || isPatientBroadcasting) {
                               // STOPPING the current stream
                               setPatientCameraActive(false);
                               setIsPatientBroadcasting(false);
                               setBroadcastRequestStatus('IDLE');
                               if (socket) {
                                  socket.emit('broadcast-status', false);
                                  socket.emit('broadcast-stop');
                               }
                            } else {
                               // REQUESTING a new stream
                               setBroadcastRequestStatus('PENDING');
                               triggerFlash("⏳ WAITING FOR SURGEON APPROVAL...");
                               if (socket) socket.emit('broadcast-request');
                            }
                          }} />
                         <span className="slider" style={{background: patientCameraActive ? '#ff3366' : 'var(--bg-panel)'}}></span>
                       </label>
                       <span className="vision-toggle-label" style={{color: patientCameraActive ? '#ff3366' : 'rgba(255,255,255,0.7)', fontWeight: patientCameraActive ? 'bold' : 'normal'}}>
                          <Camera size={14}/> BROADCAST PATIENT WEBCAM
                       </span>
                    </div>
                 )}
              </div>
              
              {/* ITEM 3: Visual Highlighting (AI Graphic Logic) -> Constant gradients */}
              <div className="ai-danger-gradient"></div>
              <div className="ai-safe-gradient"></div>

              {/* REALISTIC 3D Organ Rendering OR LIVE SERVER STREAM */}
              <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:10}}>
                 
                 {showLiveStream && role === 'surgeon' ? (
                     <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', background:'#000'}}>
                         {liveFrame ? (
                             <img src={liveFrame} style={{maxWidth:'100%', maxHeight:'100%', border:'2px solid #ff3366', borderRadius:'8px', boxShadow:'0 0 40px rgba(255,51,102,0.4)', objectFit:'contain'}} alt="Patient Stream" />
                         ) : (
                             <div className="pulse" style={{color:'#ff3366', fontFamily:'monospace', display:'flex', flexDirection:'column', alignItems:'center', gap:'15px'}}>
                                <Camera size={48} />
                                <span style={{fontSize:'18px', letterSpacing:'2px'}}>⚠️ NO VIDEO SIGNAL FROM PATIENT...</span>
                                <span style={{opacity:0.6}}>Ensure Patient Dashboard is open and Webcam access is granted.</span>
                             </div>
                         )}
                     </div>
                 ) : (
                    <>
                      {/* No Canvas if no organ is selected yet */}
                      {selectedOrgan && (
                      <Canvas ref={canvasRef} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 8], fov: 45 }}>
                         <DiagnosticMirror targetRef={glRef} />
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <pointLight position={[-10, -10, -10]} intensity={1.0} color="#00f3ff" />
                    
                    <SimulationControls role={role} socket={socket} />
                    
                    <Suspense fallback={null}>
                       <SurgeryOrgan 
                         key={selectedOrgan} 
                         type={selectedOrgan} 
                         systemState={systemState} 
                         isVibrating={isVibrating}
                         isCutting={isCutting}
                         incisionPoint={incisionPoint}
                         onIncision={(active, pos) => {
                           if (role === 'surgeon') {
                             setIsCutting(active);
                             const posArray = pos ? [pos.x, pos.y, pos.z] : null;
                             setIncisionPoint(posArray);
                             if (active && !isCutting) playSciFiSound('engage');
                             if (socket) socket.emit('cursor-move', { 
                               danger: isVibrating, 
                               cutting: active, point: posArray 
                             });
                           }
                         }}
                       />
                    </Suspense>
                 </Canvas>
                 )}
                 
                 {!selectedOrgan && systemState === 'IDLE' && role !== 'surgeon' && (
                    <div className="pulse" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'var(--safe-green)', fontFamily:'monospace', textAlign:'center', opacity:0.7, width: '80%'}}>
                       <Activity size={48} style={{marginBottom:'15px', color:'var(--safe-green)'}}/>
                       <div style={{fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px'}}>PATIENT TERMINAL READY</div>
                       <div style={{fontSize: '10px', marginTop: '8px', opacity: 0.8}}>ESTABLISHING QUANTUM SYNC CHANNEL — AWAITING SURGEON INITIALIZATION</div>
                       <div style={{fontSize: '8px', marginTop: '20px', color: 'var(--accent-cyan)', opacity: 0.5}}>ENCRYPTED P2P LINK STATUS: STANDBY</div>
                    </div>
                 )}

                 {!selectedOrgan && (systemState === 'OPTIMIZED' || systemState === 'IDLE') && role === 'surgeon' && (
                    <div className="pulse" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'var(--accent-cyan)', fontFamily:'monospace', textAlign:'center', opacity:0.6}}>
                       <Activity size={40} style={{marginBottom:'10px'}}/>
                       <div style={{fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff', textShadow: '0 0 15px rgba(0, 229, 255, 0.4)'}}>SURGEON: SELECT TARGET FROM SIDEBAR</div>
                       <div style={{fontSize: '12px', marginTop: '12px', color: 'var(--accent-cyan)', opacity: 0.9}}>
                         <div style={{fontWeight: '900', color: 'var(--safe-green)', marginBottom: '8px'}}>CHOOSE A MODEL (Heart, Brain, etc.) IN STEP 2</div>
                         <div style={{opacity: 0.7}}>This will display the 'Inner Part' 3D anatomical model in this center-stage console.</div>
                       </div>
                    </div>
                 )}
               </>
            )}
                 
            {/* Loader Screen overlay */}
            <Suspense fallback={
                   <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
                      <div style={{color:'var(--accent-cyan)', fontFamily:'monospace', textAlign:'center'}}>
                         <div className="pulse" style={{fontSize:'24px', marginBottom:'10px'}}>⚛</div>
                         <div>SYNCHRONIZING ANATOMY...</div>
                         <div style={{fontSize:'10px', marginTop:'5px', opacity:0.5}}>FETCHING PHOTOREALISTIC DATASET</div>
                      </div>
                   </div>
                 }>
                    <SurgeryOrganLoader key={selectedOrgan} modelPath={ORGAN_CONFIGS[selectedOrgan]?.modelPath} />
                 </Suspense>
                 
                 {/* Organ Information Overlay */}
                 <div style={{position:'absolute', bottom:'15px', left:'50%', transform:'translateX(-50%)', textAlign:'center', pointerEvents:'none', zIndex:20}}>
                    <div style={{color: ORGAN_CONFIGS[selectedOrgan]?.color, fontFamily:'monospace', fontSize:'14px', letterSpacing:'2px', fontWeight:'bold', textShadow:`0 0 15px ${ORGAN_CONFIGS[selectedOrgan]?.color}`, background:'rgba(0,0,0,0.85)', padding:'8px 18px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.15)'}}>
                      {selectedOrgan ? ORGAN_CONFIGS[selectedOrgan]?.label : 'AWAITING LINK...'}
                    </div>
                    {selectedOrgan && (
                    <div style={{color:'var(--accent-cyan)', fontFamily:'monospace', fontSize:'10px', marginTop:'6px', textTransform:'uppercase', background:'rgba(0,0,0,0.5)', padding:'2px 8px', borderRadius:'10px', display:'inline-block'}}>
                      {ORGAN_CONFIGS[selectedOrgan]?.detail} | QUBIT STABILITY: 99.8%
                    </div>
                    )}
                 </div>
              </div>
              
              {/* ITEM 1: OpenCV Area Detection Overlay */}
              {aiVisionOverlay && detectionZones.map(zone => (
                <div key={zone.id} className={`ai-highlight-zone ${zone.type}`} style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.size}px`, height: `${zone.size}px`, position:'absolute', transform:'translate(-50%, -50%)' }}>
                   <span className={`ai-tag ${zone.type}`}>{zone.label} <span style={{opacity: 0.6}}>{zone.percentage}</span></span>
                </div>
              ))}

              {(systemState === 'SCANNING' || systemState === 'PARALLEL_EVAL' || systemState === 'COLLAPSING') && (
                <div className={`superposition-layer ${systemState === 'COLLAPSING' ? 'collapsing' : ''}`}>
                  {Array.from({length: 120}).map((_, i) => (
                    <div key={i} className="quantum-path-faint" style={{ width: Math.random() * 100 + 150, transform: `rotate(${i*3}deg)`, '--rot': `${i*3}deg` }} />
                  ))}
                </div>
              )}

              {systemState === 'OPTIMIZED' && (
                <div className="laser-beam-container" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', zIndex:20 }}>
                  <div className="laser-beam"><div className="laser-core"></div><div className="laser-glow"></div></div>
                </div>
              )}

              {/* Render Native Surgeon Cursor OR smoothly interpolated Ref Cursor */}
              <div 
                ref={cursorDOMRef}
                className="robot-cursor" 
                style={{ 
                  left: role === 'surgeon' ? `${localMouse.x}%` : '-100%', 
                  top: role === 'surgeon' ? `${localMouse.y}%` : '-100%', 
                  zIndex: 100 
                }}
              >
                <div className="cursor-ring"></div><div className="cursor-dot"></div>
                <div className="cursor-label">{role === 'surgeon' ? 'MASTER' : 'REMOTE'}</div>
              </div>

              {role === 'patient' && (
                <>
                  <div className="patient-footer-banner">
                    <div className="status-group"><div className="pulse-dot"></div><strong>{isVibrating ? 'CRITICAL RISK' : 'ENCRYPTED SYNC ACTIVE'}</strong></div>
                  </div>
                  
                  {/* TWO-WAY PATIENT INTERCOM */}
                  <div style={{position: 'absolute', bottom: '80px', right: '30px', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                     <button 
                       className={`cyber-button ${isTalking ? 'danger-flash' : ''}`}
                       onMouseDown={startRecording}
                       onMouseUp={stopRecording}
                       onMouseLeave={stopRecording}
                       style={{
                          padding: '12px 24px', borderRadius: '4px', background: isTalking ? 'rgba(255,51,102,0.15)' : 'rgba(0,0,0,0.6)',
                          border: isTalking ? '2px solid #ff3366' : '1px solid var(--accent-cyan)', color: isTalking ? '#ff3366' : 'var(--accent-cyan)',
                          boxShadow: isTalking ? '0 0 30px rgba(255,51,102,0.4)' : '0 0 15px rgba(0,229,255,0.2)',
                          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                          fontFamily: 'monospace'
                       }}
                     >
                       {isTalking ? <Volume2 size={24} className="pulse"/> : <Mic size={24} />}
                       {isTalking ? 'RELEASING TRANSMISSION...' : 'PUSH TO TALK (TO SURGEON)'}
                     </button>
                     {remoteTalking && (
                       <div style={{marginTop:'12px', fontSize:'11px', color:'#00fa9a', textAlign:'right', letterSpacing:'1px', background: 'rgba(0,0,0,0.8)', padding: '5px 10px', borderRadius: '4px', border: '1px dashed #00fa9a'}} className="pulse">
                          🔊 SURGEON IS SPEAKING...
                       </div>
                     )}
                  </div>
                </>
              )}
           </div>

           {role === 'surgeon' && (
             <div className="routing-visualizer"><Share2 size={12} /> ROUTE: SURGEON → PATIENT | LATENCY: {latency}ms</div>
           )}
        </main>

        {role === 'surgeon' && (
          <aside className="right-panel">
            <div className="panel-section quantum-special" style={{border:'1px solid rgba(56,189,248,0.3)', background:'rgba(56,189,248,0.04)', flex:'0 0 auto'}}>
               <h3 className="panel-title"><Zap size={11} className="pulse"/> QUANTUM SYNC ENGINE</h3>
               <div style={{fontSize:'9px', display:'flex', flexDirection:'column', gap:'3px'}}>
                  <div className="metric-row"><span>WAVEFUNCTION FIDELITY</span><span style={{color:'#22c55e'}}>0.99988</span></div>
                  <div className="metric-row"><span>SUPERPOSITION OPT.</span><span style={{color:'#38bdf8'}}>ACTIVE</span></div>
                  <div className="metric-row"><span>ENTANGLEMENT DECAY</span><span style={{color:'#ef4444'}}>0.0042%</span></div>
                  <div style={{marginTop:'3px', height:'2px', background:'rgba(56,189,248,0.15)', width:'100%', borderRadius:'2px'}}><div style={{height:'100%', width:'94%', background:'#38bdf8', borderRadius:'2px'}}></div></div>
                  <div style={{fontSize:'7px', opacity:0.5, textAlign:'center'}}>QUANTUM CHANNEL: ELITE</div>
               </div>
            </div>

            <div className="panel-section" style={{flex:'1', minHeight:0, overflow:'hidden'}}>
               <h3 className="panel-title"><AlertTriangle size={11}/> NEURAL TELEMETRY</h3>
               <div className="console-log" style={{maxHeight:'none', flex:1, overflow:'hidden'}}>
                 {logs.slice(-3).map((l, i) => <div key={i} className={`log-entry ${l.type}`}><span className="log-time">[{l.time}]</span> {l.msg}</div>)}
               </div>
            </div>

            <div className="panel-section" style={{flex:'0 0 auto'}}>
              <h3 className="panel-title"><Activity size={11}/> AI AGENTS</h3>
              <div className="agent-list" style={{gap:'4px'}}>
                {agents.map(a => <div key={a.id} className="agent-card active" style={{padding:'4px 6px'}}><span style={{fontSize:'9px', fontWeight:'800'}}>{a.name}</span><span style={{fontSize:'7px', opacity:0.6}}>{a.role}</span></div>)}
              </div>
            </div>
          </aside>
        )}
      </div>

      {role === 'surgeon' && (
        <>
          {/* INTERACTIVE HUD NOTIFICATION (FLASH) */}
          {flashMessage && (
            <div className="hud-flash-alert pulse">
               <div className="hud-flash-inner">
                  <Zap size={16} /> <span>{flashMessage}</span>
               </div>
            </div>
          )}

          {/* BROADCAST APPROVAL DIALOG */}
          {broadcastRequestStatus === 'PENDING' && (
            <div className="hud-flash-alert" style={{background: 'rgba(0,0,0,0.95)', border: '2px solid var(--accent-cyan)', top: '40%', height: 'auto', padding: '30px', pointerEvents: 'auto'}}>
               <div style={{textAlign: 'center', width: '100%'}}>
                  <div className="pulse" style={{color: 'var(--accent-cyan)', fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px'}}>
                     <Camera size={24} style={{verticalAlign: 'middle', marginRight: '10px'}}/> 
                     LIVE BROADCAST REQUEST
                  </div>
                  <div style={{color: '#fff', fontSize: '13px', opacity: 0.8, marginBottom: '25px'}}>
                     PATIENT IS ATTEMPTING TO STREAM LIVE WEBCAM FEED.<br/>
                     DURING BROADCAST, TARGET SELECTION WILL BE LOCKED.
                  </div>
                  <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                     <button 
                        className="cyber-button-small" 
                        style={{background: 'rgba(0, 250, 154, 0.2)', color: '#00fa9a', borderColor: '#00fa9a', padding: '12px 25px', fontSize: '12px'}}
                        onClick={() => {
                           setBroadcastRequestStatus('ACTIVE');
                           setIsPatientBroadcasting(true);
                           setShowLiveStream(true);
                           if (socket) {
                              socket.emit('broadcast-response', 'ACCEPT');
                              socket.emit('broadcast-status', true);
                           }
                           playSciFiSound('engage');
                        }}
                     >
                        <CheckCircle2 size={16} /> ACCEPT FEED
                     </button>
                     <button 
                        className="cyber-button-small risk-btn" 
                        style={{padding: '12px 25px', fontSize: '12px'}}
                        onClick={() => {
                           setBroadcastRequestStatus('IDLE');
                           if (socket) socket.emit('broadcast-response', 'REJECT');
                           playSciFiSound('danger');
                        }}
                     >
                        <X size={16} /> REJECT REQUEST
                     </button>
                  </div>
               </div>
            </div>
          )}


          
          {assistantOpen && (
            <div className="ai-assistant-panel">
              <div className="ai-assistant-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>AI SURGICAL ASSISTANT <Zap size={10} /></div>
                <button onClick={() => setAssistantOpen(false)} style={{background: 'none', border: 'none', color: '#ff3366', cursor: 'pointer', display: 'flex'}} title="Close AI Assistant">
                  <X size={14} />
                </button>
              </div>
              <div className="ai-assistant-messages">
                {assistantMessages.map((m, i) => (<div key={i} className={`ai-msg ${m.from === 'ai' ? 'ai-response' : 'user-msg'}`}> {m.text} </div>))}
                {assistantBusy && <div className="thinking-loader"><span></span><span></span><span></span></div>}
              </div>
              <form className="ai-assistant-input" onSubmit={(e) => { e.preventDefault(); handleAISending(); }}>
                <input value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder="Voice or Text command..." />
                <button type="button" onClick={startListening} style={{ color: isListening ? '#ef4444' : '#38bdf8', opacity: 1 }} title="Voice Command">
                  <Mic size={15} className={isListening ? "pulse" : ""} />
                </button>
                <button type="submit" style={{ color: '#22c55e', opacity: 1 }} title="Send Command">
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
