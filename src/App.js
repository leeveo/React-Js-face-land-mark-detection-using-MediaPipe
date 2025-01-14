import logo from './logo.svg';
import './App.css';
import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";


function App() {

  const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const connect = window.drawConnectors;
    var camera = null;

    function onResults(results) {
        // const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            if (landmarks.length > 0) {
              window.location.href = "https://vite-project-rho-ecru.vercel.app/";
              return;
            }
            const faceMeshLandmarks = [
              ...Facemesh.FACEMESH_TESSELATION,
              ...Facemesh.FACEMESH_RIGHT_EYE,
              ...Facemesh.FACEMESH_RIGHT_EYEBROW,
              ...Facemesh.FACEMESH_LEFT_EYE,
              ...Facemesh.FACEMESH_LEFT_EYEBROW,
              ...Facemesh.FACEMESH_FACE_OVAL,
              ...Facemesh.FACEMESH_LIPS
            ];
            if (faceMeshLandmarks.some(index => landmarks[index])) {
              window.location.href = "https://vite-project-rho-ecru.vercel.app/";
              return;
            }
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
              color: "#eae8fd",
              lineWidth: 1,
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
              color: "#7367f0",
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
              color: "#7367f0",
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
              color: "#7367f0",
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
              color: "#7367f0",
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
              color: "#7367f0",
            });
            connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
              color: "#7367f0",
            });
          }
        }
        canvasCtx.restore();
      }
      // }

      // setInterval(())
      useEffect(() => {
        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          minDetectionConfidence: 0.3,
          minTrackingConfidence: 0.3,
        });

        faceMesh.onResults(onResults);

        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null
        ) {
          camera = new cam.Camera(webcamRef.current.video, {
            onFrame: async () => {
              await faceMesh.send({ image: webcamRef.current.video });
            },
            width: 640,
            height: 480,
          });
          camera.start();
        }
      }, []);

  return (
    <div className="App">
      <header className="App-header">
            <center>
      <div className="App" style={{ position: 'relative', height: '100vh' }}>
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1%',
            display:'none'
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></canvas>
      </div>
    </center>
               
       <video
          src="https://leeveo.s3.eu-west-3.amazonaws.com/AgenceDeVoyage.mp4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            zIndex: 10
          }}
          controls
          autoPlay
        ></video> 
      </header>
    </div>
  );
}

export default App;
