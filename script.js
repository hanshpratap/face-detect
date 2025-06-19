const video = document.getElementById('video');

// Load models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo);

// Start webcam
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error('Camera error:', err));
}

// Detect faces and gender
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withAgeAndGender();

    const resized = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
    faceapi.draw.drawDetections(canvas, resized);
    resized.forEach(result => {
      const { gender, genderProbability } = result;
      const box = result.detection.box;
      const text = `${gender} (${(genderProbability * 100).toFixed(1)}%)`;
      const drawBox = new faceapi.draw.DrawBox(box, { label: text });
      drawBox.draw(canvas);
    });
  }, 200);
});
// const video = document.getElementById('video');

// Load models
// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//   faceapi.nets.ageGenderNet.loadFromUri('/models')
// ]).then(startVideo);

// // Start webcam
// function startVideo() {
//   navigator.mediaDevices.getUserMedia({ video: {} })
//     .then(stream => video.srcObject = stream)
//     .catch(err => console.error('Camera error:', err));
// }

// // Detect faces and gender
// video.addEventListener('play', () => {
//   // Remove previous canvas if exists
//   const existingCanvas = document.querySelector('canvas');
//   if (existingCanvas) existingCanvas.remove();

//   const canvas = faceapi.createCanvasFromMedia(video);
//   document.body.append(canvas);
//   const displaySize = { width: video.width, height: video.height };
//   faceapi.matchDimensions(canvas, displaySize);

//   setInterval(async () => {
//     const detections = await faceapi.detectAllFaces(
//       video,
//       new faceapi.TinyFaceDetectorOptions()
//     ).withAgeAndGender();

//     const resized = faceapi.resizeResults(detections, displaySize);
//     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
//     faceapi.draw.drawDetections(canvas, resized);
//     resized.forEach(result => {
//       const { gender, genderProbability } = result;
//       const box = result.detection.box;
//       const text = `${gender} (${(genderProbability * 100).toFixed(1)}%)`;  // Fixed template literal
//       const drawBox = new faceapi.draw.DrawBox(box, { label: text });
//       drawBox.draw(canvas);
//     });
//   }, 200);
// });