const firebaseConfig = {
    apiKey: "AIzaSyALtR5Ybh3PkmhI2r8G_0Vv5v9ZGiFhWK4",
    authDomain: "mapproject-a58fc.firebaseapp.com",
    databaseURL: "https://mapproject-a58fc-default-rtdb.firebaseio.com",
    projectId: "mapproject-a58fc",
    storageBucket: "mapproject-a58fc.appspot.com",
    messagingSenderId: "845894187948",
    appId: "1:845894187948:web:7fa8edc9e0387fc7a31809",
    measurementId: "G-34KZEMF8F9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

const map = L.map('Mapid').setView([21.038859, 105.783181], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var ref = firebase.database().ref();
ref.once("value")
    .then(function (snapshot) {
        console.log(snapshot.numChildren());
        for (var i = 1; i <= snapshot.numChildren(); i++) {
            RenderMark(i);
        }
    });

function RenderMark(ID) {

    database.ref("/Station" + String(ID)).on("value", function (snapshot) {
        Xvalue = snapshot.val().Xvalue;
        Yvalue = snapshot.val().Yvalue;
        const markerPoint = L.marker([Xvalue, Yvalue]).addTo(map);

        let InformationStation1 =
            `
    <div onclick="RenderInformation(${ID})" class="MarkerStation">Thông tin trạm</div>
    `
        markerPoint.bindPopup(InformationStation1);
        const circlePoint = L.circle([Xvalue, Yvalue], {
            radius: 100,
            color: 'green',
            fillColor: 'red',
            fillOpacity: 0.2
        }).addTo(map);
    })
}

function RenderInformation(ID) {
    var NameStationElement = document.getElementById('NameStationElement');
    var CO2StationElement = document.getElementById('CO2StationElement');
    var DustStationElement = document.getElementById('DustStationElement');
    var CoordinatesStationXvalue = document.getElementById('CoordinatesStationXvalue');
    var CoordinatesStationYvalue = document.getElementById('CoordinatesStationYvalue');
    database.ref("/Station" + String(ID) + "/Name").on("value", function (snapshot) {
        NameStationElement.innerHTML = snapshot.val();
    })
    database.ref("/Station" + String(ID) + "/CO2").on("value", function (snapshot) {
        CO2StationElement.innerHTML = snapshot.val();
    })
    database.ref("/Station" + String(ID) + "/Xvalue").on("value", function (snapshot) {
        CoordinatesStationXvalue.innerHTML = snapshot.val();
    })
    database.ref("/Station" + String(ID) + "/Yvalue").on("value", function (snapshot) {
        CoordinatesStationYvalue.innerHTML = snapshot.val();
    })
    database.ref("/Station" + String(ID) + "/Dust").on("value", function (snapshot) {
        DustStationElement.innerHTML = snapshot.val();
    })
}

if(screen.width> 780){
    ArrowContainer.innerHTML = "<";
}
else
{
    ArrowContainer.innerHTML = "Up";
}

let ShowHIdeBool = false;

function ShowHide() {
    if (ShowHIdeBool == false && screen.width > 780) {
        MapInfomation.style.display = "none";
        ArrowContainer.innerHTML = ">";
        ArrowContainer.style.marginLeft = "0px";
        ShowHIdeBool = true;
    }
    else if (ShowHIdeBool == true && screen.width > 780){
        MapInfomation.style.display = "block";
        ArrowContainer.innerHTML = "<";
        ArrowContainer.style.marginLeft = "420px";
        ShowHIdeBool = false;
    }

    if (ShowHIdeBool == false && screen.width < 780) {
        MapInfomation.style.display = "none";
        ArrowContainer.innerHTML = "Up";
        ArrowContainer.style.marginTop = "0px";
        ShowHIdeBool = true;
        Mapid.style.height = "670px";
    }
    else if (ShowHIdeBool == true && screen.width < 780) {
        MapInfomation.style.display = "block";
        ArrowContainer.innerHTML = "Down";
        ArrowContainer.style.marginTop = "260px";
        ShowHIdeBool = false;
        Mapid.style.height = "400px";
    }
}

