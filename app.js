const firebaseConfig = {
  apiKey: "AIzaSyA_yV8_5Ihna9fqUTH2jGOOzes4oILOPuM",
  authDomain: "womensafetyapp-1c08a.firebaseapp.com",
  databaseURL: "https://womensafetyapp-1c08a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "womensafetyapp-1c08a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
let map;
let marker;
const email = document.getElementById("email");
const password = document.getElementById("password");
function register() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(() => {
      alert("Registered Successfully");
      window.location = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      window.location = "dashboard.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

function sendSOS() {
    navigator.geolocation.getCurrentPosition(pos => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Save to Firebase (optional)
        db.ref("sos").push({
            latitude: lat,
            longitude: lng,
            time: new Date().toString()
        });
        document.getElementById("status").innerText =
        "SOS activated! Your location has been shared.";
        // ✅ SHOW MAP HERE (CORRECT PLACE)
        showMap(lat, lng);

        alert("SOS sent!");

    }, error => {
        alert("Location permission denied");
    });
}
function showMap(lat, lng){

const location = {lat: lat, lng: lng};

if(!map){

map = new google.maps.Map(document.getElementById("map"), {
zoom: 15,
center: location
});

marker = new google.maps.Marker({
position: location,
map: map
});

}else{

marker.setPosition(location);
map.setCenter(location);

}

}
function startVoiceSOS() {

const recognition = new webkitSpeechRecognition();

recognition.start();

recognition.onresult = function(event){

let speech = event.results[0][0].transcript;

if(speech.toLowerCase().includes("help")){

sendSOS();

}

};

}
let shakeThreshold = 15;

window.addEventListener("devicemotion", function(event){

let acceleration = event.accelerationIncludingGravity;

let x = acceleration.x;
let y = acceleration.y;
let z = acceleration.z;

let totalAcceleration = Math.sqrt(x*x + y*y + z*z);

if(totalAcceleration > shakeThreshold){

alert("Phone shaken! SOS activated.")

sendSOS();

}

});
function findPolice(){

if(!map){
alert("Map not loaded yet");
return;
}

navigator.geolocation.getCurrentPosition(function(position){

const userLocation = new google.maps.LatLng(
position.coords.latitude,
position.coords.longitude
);

const service = new google.maps.places.PlacesService(map);

service.nearbySearch({
location: userLocation,
radius: 5000,
type: ['police']
}, function(results, status){

if(status === google.maps.places.PlacesServiceStatus.OK){

for(let i=0;i<results.length;i++){

new google.maps.Marker({
map: map,
position: results[i].geometry.location,
title: results[i].name
});

}

}else{

alert("Status: " + status);

}

});

});

}

function fakeCall(){

alert("📞 Incoming Call from Mom...");

let audio = new Audio("https://www.soundjay.com/phone/phone-ring-01.mp3");
audio.play();

setTimeout(()=>{
alert("Call ended.");
audio.pause();
},10000);

}

function logout() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
