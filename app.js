const firebaseConfig = {
  apiKey: "AIzaSyA_yV8_5Ihna9fqUTH2jGOOzes4oILOPuM",
  authDomain: "womensafetyapp-1c08a.firebaseapp.com",
  databaseURL: "https://womensafetyapp-1c08a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "womensafetyapp-1c08a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
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
function showMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: lng},
        zoom: 15
    });

    new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: "Your Location"
    });
}


function logout() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
