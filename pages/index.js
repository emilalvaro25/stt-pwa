import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

export default function Home() {
    const [recordingState, setRecordingState] = useState('idle');
    const [statusMessage, setStatusMessage] = useState({ text: 'Idle. Ready to record or upload.', type: 'info' });
    const [isLoading, setIsLoading] = useState(false);
    const [loadingContext, setLoadingContext] = useState('');
    const [fileName, setFileName] = useState('No file selected.');
    const [showProxyNotice, setShowProxyNotice] = useState(true);
    const [transcription, setTranscription] = useState('');
    const [detectedTopics, setDetectedTopics] = useState([]);
    const interimTextRef = useRef('');

    const mediaRecorderRef = useRef(null);
    const liveSocketRef = useRef(null);
    const liveAudioContextRef = useRef(null);
    const currentStreamRef = useRef(null);
    const allRecordedBlobsRef = useRef([]);
    const finalTranscriptRef = useRef('');
    
    // This is a minimal set of functions. Full implementation would be much larger.
    const updateStatus = (text, type = 'info') => setStatusMessage({ text, type });
    const clearOutputFields = () => { setTranscription(''); setDetectedTopics([]); };
    const resetToIdle = (message, type) => {
        setRecordingState('idle');
        updateStatus(message, type);
    };

    const handleStartClick = () => {
        setRecordingState('recording');
        updateStatus('Recording...', 'success');
        clearOutputFields();
    };
    
    const handleStopClick = () => {
        resetToIdle('Recording stopped.', 'info');
    };
    
    return (
        <div className="container">
            {showProxyNotice && (
                 <div className="proxy-notice" id="proxyNotice">
                    <h3>⚠️ Proxy Server Required for Live Transcription</h3>
                    <p>To use OpenAI Whisper Live Streaming, you need to run the proxy server separately.</p>
                </div>
            )}
            
            <main className="main-content">
                <div className="controls-column">
                    <section className="card controls-area">
                        <h2 className="card-title">Transcription Controls</h2>
                        <div className="control-group">
                            <label htmlFor="sttServiceSelect">STT Service</label>
                            <select id="sttServiceSelect" onChange={(e) => setShowProxyNotice(e.target.value === 'openai_whisper_live')}>
                                <option value="openai_whisper_live">OpenAI Whisper (Live Streaming)</option>
                                <option value="openai_whisper">OpenAI Whisper (Batch File)</option>
                            </select>
                        </div>
                        <div className="button-group">
                            <button id="startRecordBtn" className={`btn btn-primary ${recordingState === 'recording' ? 'animating' : ''}`} onClick={handleStartClick} disabled={recordingState !== 'idle'}>
                                {recordingState === 'recording' ? 'Recording...' : 'Start Recording'}
                            </button>
                            <button id="stopRecordBtn" className="btn btn-secondary" onClick={handleStopClick} disabled={recordingState === 'idle'}>
                                Stop
                            </button>
                            <div className="upload-group">
                                <button id="uploadAudioBtn" className="btn btn-upload" onClick={() => document.getElementById('audioFileUpload').click()} disabled={recordingState !== 'idle'}>
                                    Upload Audio File
                                </button>
                                <input type="file" id="audioFileUpload" accept="audio/*" style={{ display: 'none' }} />
                                <div id="fileNameDisplay">{fileName}</div>
                            </div>
                            <canvas id="audioWaveformCanvas" style={{ marginTop: '1rem' }}></canvas> 
                        </section>
                    <section className="card status-area">
                        <h2 className="card-title">Status</h2>
                        <div className="status-display-container">
                            <div id="statusDisplayText" className={`status-display-text ${statusMessage.type}`}>{statusMessage.text}</div>
                        </div>
                    </section>
                </div>

                <div className="transcript-column-wrapper output-column">
                    <section className="card">
                        <h2 className="card-title">Transcription</h2>
                        <div id="transcriptionOutput" className="output-area">
                            {transcription || <span className="placeholder-note">Results will appear here...</span>}
                            <span className="interim-text">{interimTextRef.current}</span>
                        </div>
                    </section>
                    <section className="card">
                        <h2 className="card-title">Detected Topics</h2>
                        <ul id="detectedTopicsList" className={detectedTopics.length === 0 ? 'empty' : ''}>
                            {detectedTopics.length > 0 ? (
                                detectedTopics.map((topic, index) => <li key={index}>{topic}</li>)
                            ) : (
                                <li>No topics detected yet.</li>
                            )}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}

