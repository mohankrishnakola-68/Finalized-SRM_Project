import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { processQuery } from './ai_assistant.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://dyyjvppoabfnuyumszle.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eWp2cHBvYWJmbnV5dW1zemxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDI0NTUsImV4cCI6MjA4OTQxODQ1NX0.sO-mix8mbrjBDmf0KRjYuIDlbn0c9Z1Q4JIUI4pDnss';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fallback Mock Local DB (LowDB)
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
const adapter = new FileSync('hospital_records.json');
const db = low(adapter);

// Initialize Hospital Schema
db.defaults({ 
    surgeries: [], 
    auditLogs: [], 
    telemetry: [], 
    intercomLogs: [] 
}).write();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- PRODUCTION: Serve Frontend Static Files ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// In-memory state for our simulation metrics
let systemState = {
    qber: 1.2,
    latency: 12.0,
    syncRate: 99.9,
    status: 'SECURE',
    lastGeneratedPaths: [] // Store paths for the optimizer
};

// ... existing AI Logic (OpenCV/Risk mocks) ...
function mockOpenCVOrganDetection() {
    console.log('[AI Vision] OpenCV Model executing... defining anatomical boundaries.');
    return {
        tumorZone: { x: 50, y: 50, radius: 15 },    // Dangerous area
        safeZone: { x: 120, y: 120, radius: 30 }    // Target safe area
    };
}

function mockScikitLearnRiskClassification(path, tumorZone) {
    const distanceToTumor = Math.sqrt(
        Math.pow(path.coordinates.x - tumorZone.x, 2) +
        Math.pow(path.coordinates.y - tumorZone.y, 2)
    );

    let risk_level = 'LOW';
    let risk_score = 0;

    if (distanceToTumor < tumorZone.radius + 5) {
        risk_level = 'HIGH';
        risk_score = 90 - (distanceToTumor * 0.5);
    } else if (distanceToTumor < tumorZone.radius + 20) {
        risk_level = 'MEDIUM';
        risk_score = 50 - (distanceToTumor * 0.2);
    } else {
        risk_level = 'LOW';
        risk_score = Math.random() * 10;
    }

    return { level: risk_level, score: Math.max(0, risk_score.toFixed(2)) };
}

// 🟢 SOCKET.IO REAL-TIME NERVOUS SYSTEM
io.on('connection', (socket) => {
    socket.currentRoom = 'LOBBY'; // Default room for backward compatibility
    socket.join('LOBBY');
    console.log(`[Neural Link] New terminal connected: ${socket.id}`);

    // Private Room Linker
    socket.on('join-room', (roomId) => {
        socket.leave(socket.currentRoom);
        socket.join(roomId);
        socket.currentRoom = roomId;
        console.log(`[Neural Link] Terminal ${socket.id} joined private room: ${roomId}`);
    });

    socket.on('cursor-move', (data) => {
        socket.to(socket.currentRoom).emit('cursor-update', data);
    });

    socket.on('session-sync', (data) => {
        socket.to(socket.currentRoom).emit('session-sync', data);
    });

    socket.on('location-sync', async (data) => {
        socket.to(socket.currentRoom).emit('location-update', data);
        
        // Supabase / Local Dual Mirroring
        const logData = { type: 'TELEMETRY_SYNC', timestamp: new Date(), ...data };
        db.get('auditLogs').push(logData).write();
        
        try {
            await supabase.from('audit_logs').insert([logData]);
        } catch(e) {}
    });

    socket.on('live-stream-frame', (frame) => {
        socket.to(socket.currentRoom).emit('live-stream-frame', frame);
    });

    socket.on('surgical-event', async (data) => {
        const incisionData = { type: 'LASER_INCISION', timestamp: new Date(), coords: data.point, organ: data.organ };
        db.get('auditLogs').push(incisionData).write();
        
        try {
            await supabase.from('audit_logs').insert([incisionData]);
        } catch(e) {}
    });

    socket.on('audio-packet', async (blob) => {
        socket.to(socket.currentRoom).emit('audio-packet', blob);
        const voiceLog = { sender: 'STAFF_COMM', timestamp: new Date(), type: 'VOICE_RELAY' };
        db.get('intercomLogs').push(voiceLog).write();
        
        try {
            await supabase.from('intercom_logs').insert([voiceLog]);
        } catch(e) {}
    });

    socket.on('broadcast-status', (status) => {
        socket.to(socket.currentRoom).emit('broadcast-status', status);
    });

    socket.on('broadcast-request', () => {
        socket.to(socket.currentRoom).emit('broadcast-request');
    });

    socket.on('broadcast-response', (status) => {
        socket.to(socket.currentRoom).emit('broadcast-response', status);
    });

    socket.on('broadcast-stop', () => {
        socket.to(socket.currentRoom).emit('broadcast-stop');
    });

    socket.on('vitals-update', async (vitals) => {
        const vitalsLog = { ...vitals, timestamp: new Date() };
        db.get('telemetry').push(vitalsLog).write();
        
        try {
            await supabase.from('patient_telemetry').insert([vitalsLog]);
        } catch(e) {}
    });

    socket.on('disconnect', () => {
        console.log(`[Neural Link] Terminal disconnected: ${socket.id} (from ${socket.currentRoom})`);
    });
});

// 1. Start Simulation
app.post('/api/simulation/start', (req, res) => {
    console.log('[System] Simulation initialized by Surgeon Console');
    res.json({ message: 'Simulation initialized successfully', status: 'READY' });
});

// 2. Generate Paths
app.get('/api/paths/generate', (req, res) => {
    const zones = mockOpenCVOrganDetection();
    // Higher Resolution Sampling: Increase search space from 50 to 200 for 'full accuracy'
    const paths = Array.from({ length: 200 }).map((_, i) => {
        const pathCoords = { x: Math.random() * 200, y: Math.random() * 200 };
        const aiRisk = mockScikitLearnRiskClassification({ coordinates: pathCoords }, zones.tumorZone);
        return {
            path_id: `PATH-${1000 + i}`,
            distance: (Math.random() * 80 + 20).toFixed(2), // Nearer = Better
            coordinates: pathCoords,
            risk_level: aiRisk.level,
            risk_score: parseFloat(aiRisk.score)
        };
    });
    systemState.lastGeneratedPaths = paths;
    res.json({
        message: '200 candidate paths isolated and classified by Scikit-Learn (Simulated). Using high-resolution sampling for maximum precision.',
        total_paths: paths.length,
        paths: paths.slice(0, 5)
    });
});

// 3. Get Best Path
app.get('/api/paths/best', (req, res) => {
    if (systemState.lastGeneratedPaths.length === 0) {
        return res.status(400).json({ error: 'No paths generated yet.' });
    }
    let bestPath = systemState.lastGeneratedPaths[0];
    let bestHeuristic = Infinity;
    systemState.lastGeneratedPaths.forEach(path => {
        const heuristic = parseFloat(path.distance) + (path.risk_score * 5);
        if (heuristic < bestHeuristic) {
            bestHeuristic = heuristic;
            bestPath = path;
        }
    });
    const finalPathOutput = { ...bestPath, distance: bestPath.distance + ' mm', status: 'SAFE_FOR_SURGERY', color_code: '#00fa9a' };
    res.json({ message: 'Optimal path isolated successfully.', bestPath: finalPathOutput });
});

// --- Medical Data API Endpoints ---
app.get('/api/admin/records', async (req, res) => {
    try {
        const { data: surgeries } = await supabase.from('surgeries').select('*').order('start_time', { ascending: false });
        const { data: auditLogs } = await supabase.from('audit_logs').select('id', { count: 'exact' });
        res.json({ surgeries: surgeries || [], totalAuditPoints: auditLogs?.length || 0, systemStatus: 'CLINICAL_READY' });
    } catch (e) {
        const localRec = db.get('surgeries').value();
        res.json({ surgeries: localRec || [], totalAuditPoints: 0, systemStatus: 'LOCAL_FALLBACK' });
    }
});

app.get('/api/vitals/history', async (req, res) => {
    try {
        const { data } = await supabase.from('patient_telemetry').select('*').order('timestamp', { ascending: false }).limit(20);
        res.json(data || []);
    } catch (e) {
        res.json(db.get('telemetry').takeRight(20).value());
    }
});

app.post('/api/surgery/start', (req, res) => {
    const session = { id: 'SRG-'+Date.now(), startTime: new Date(), ...req.body };
    db.set('currentSession', session).write();
    db.get('surgeries').push(session).write();
    res.json(session);
});

// 4. Get Metrics
app.get('/api/metrics', (req, res) => {
    systemState.latency = Math.max(5, systemState.latency + (Math.random() * 4 - 2));
    systemState.syncRate = Math.min(100, systemState.syncRate + (Math.random() * 0.2 - 0.1));
    res.json({ latency: Math.abs(systemState.latency).toFixed(2), syncRate: Math.abs(systemState.syncRate).toFixed(2) });
});

// 5. Security Status
app.get('/api/security/qber', (req, res) => {
    if (systemState.qber > 5.0) systemState.status = 'COMPROMISED - DUMPING KEYS';
    else systemState.status = 'SECURE';
    res.json({ qber: Math.abs(systemState.qber).toFixed(2), status: systemState.status });
});

// 6. Simulate network intercept (Hacker)
app.post('/api/security/intercept', (req, res) => {
    systemState.qber = 15.5; 
    systemState.status = 'COMPROMISED';
    setTimeout(() => {
        systemState.qber = 1.1;
        systemState.status = 'SECURE';
    }, 2000);
    res.json({ message: 'Hacker intercept simulated. QBER spiked!' });
});

// 7. AI Assistant Command Endpoint
app.post('/api/ai/command', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    try {
        const result = await processQuery(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process AI command' });
    }
});

// --- PRODUCTION: Catch-all for React Routing ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=================================================`);
    console.log(`⚛️  Haptic-Q Backend Engine [Neural Link Mode] ⚛️`);
    console.log(`=================================================`);
    console.log(`Server running on: http://0.0.0.0:${PORT}`);
    console.log(`API + WebSockets are ready for multi-terminal sync.\n`);
});
