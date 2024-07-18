import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [massage , setMassage] = useState("no face detected")
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const videoConstraints = {
    facingMode: 'environment',
    width: 640,
    height: 480,
  };
  const drawProcessedImage = (imageSrc) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  const captureFrame = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recognize_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (response.ok) {
        const data = await response.json();
        const processedImageSrc = `data:image/jpeg;base64,${data.processedImage}`;
        setMassage(data.massage)
        drawProcessedImage(processedImageSrc);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  }, []);

  const handleToggleCamera = () => {
    if (isCameraOn){
      setMassage("no face detected")
    }
    setIsCameraOn((prevState) => !prevState);
  };

  useEffect(() => {
    if (isCameraOn) {
      captureIntervalRef.current = setInterval(captureFrame, 1000 / 4); // 4 FPS
    } else {
      clearInterval(captureIntervalRef.current);
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }

    return () => {
      clearInterval(captureIntervalRef.current);
    };
  }, [isCameraOn, captureFrame]);

  return (
    <>
    <div style={{ position: 'relative', width: '311px', height: '192px', borderRadius: '8px', backgroundColor: '#a3b1c1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{position: 'absolute', bottom: '10px', display:"flex", justifyContent :"center"}}>
      <button
        style={{
          border: '1px solid #fafafa',
          borderRadius: '50%',
          padding: '8px',
          paddingBottom: '4px',
          backgroundColor: isCameraOn ? 'transparent' : 'rgb(234,67,53)',
          zIndex: 1,
        }}
        onClick={handleToggleCamera}
      >
        {isCameraOn ? (
          <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" className="Hdh4hc cIGbvc NMm5M">
            <path fill="white" d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98zm-2-.79V18H4V6h12v3.69z"></path>
          </svg>
        ) : (
          <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" className="Hdh4hc cIGbvc NMm5M">
            <path fill="white" d="M18 10.48V6c0-1.1-.9-2-2-2H6.83l2 2H16v7.17l2 2v-1.65l4 3.98v-11l-4 3.98zM16 16L6 6 4 4 2.81 2.81 1.39 4.22l.85.85C2.09 5.35 2 5.66 2 6v12c0 1.1.9 2 2 2h12c.34 0 .65-.09.93-.24l2.85 2.85 1.41-1.41L18 18l-2-2zM4 18V6.83L15.17 18H4z"></path>
          </svg>
        )}
      </button>
      </div>
      
      {isCameraOn ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Webcam
            ref={webcamRef}
            videoConstraints={videoConstraints}
            audio={false}
            screenshotFormat="image/jpeg"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
          <canvas
            ref={canvasRef}
            width={videoConstraints.width}
            height={videoConstraints.height}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
          />
        </div>
      ) : (
        <h1 style={{ fontSize: '16px' , }}>Camera is off</h1>
      )}
      
    </div>
    {isCameraOn && massage !== "no face detected" && <h4>{massage}</h4>}
    </>
      )}

export default CameraCapture;



