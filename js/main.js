const video = document.getElementById("video")
let All_mediaDevices=navigator.mediaDevices

Promise.all([
	faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
	faceapi.nets.ageGenderNet.loadFromUri("./models")
]).then(startVideo);

function startVideo() {
	if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
		console.log("getUserMedia() not supported.");
		return;
	 }
	 All_mediaDevices.getUserMedia({
		audio: false,
		 video:{
			 facingMode: "user",
			 height:320,
			 width:320
		 }
		 })
	 .then(function(vidStream) {
		if ("srcObject" in video) {
		   video.srcObject = vidStream;
		} else {
		   video.src = window.URL.createObjectURL(vidStream);
		}
		video.onloadedmetadata = function(e) {
		   video.play();
		};
	 })
	 .catch(function(e) {
		console.log(e.name + ": " + e.message);
	 });
}
video.addEventListener("playing", () => {	
	setInterval(async () => {
		try {
			const detections = await faceapi.detectSingleFace(
				video,
				new faceapi.SsdMobilenetv1Options()).withAgeAndGender()
			   console.log(detections) 
			const element = document.getElementById("myBtn");
			element.addEventListener("click", myFunction);

			function myFunction() {
				if (detections.detection._score > 0.99) {
					console.log(`Your are ${detections.gender} of age ${Math.trunc(detections.age)} `)
					document.getElementById("demo").innerHTML = `Your are ${detections.gender} of age ${Math.trunc(detections.age)} `;
				}
			}

		} catch (error) {
			console.log(error)
		}
	}, 1);
});
