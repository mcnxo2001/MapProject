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
        for (var i = 1; i <= snapshot.numChildren(); i++) {
            RenderMark(i);
        }
    });

function RenderMark(ID) {

    database.ref("/Station" + String(ID)).on("value", function (snapshot) {
        ExportToTable();
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
    ShowHide(1);
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
    });
}

if (screen.width > 780) {
    ArrowContainer.innerHTML = "🔚";
}
else {
    ArrowContainer.innerHTML = "⬆";
}

let ShowHIdeBool = false;

function ShowHide(a) {
    if (a == 0) {
        if (ShowHIdeBool == false && screen.width > 780) {
            MapInfomation.style.display = "none";
            ArrowContainer.innerHTML = "🔜";
            ArrowContainer.style.marginLeft = "0px";
            ShowHIdeBool = true;
        }
        else if (ShowHIdeBool == true && screen.width > 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "🔚";
            ArrowContainer.style.marginLeft = "420px";
            ShowHIdeBool = false;
        }

        if (ShowHIdeBool == false && screen.width < 780) {
            MapInfomation.style.display = "none";
            ArrowContainer.innerHTML = "⬇";
            ArrowContainer.style.marginTop = "0px";
            ShowHIdeBool = true;
        }
        else if (ShowHIdeBool == true && screen.width < 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "⬆";
            ArrowContainer.style.marginTop = "260px";
            ShowHIdeBool = false;
        }
    }
    if (a == 1) {
        if (ShowHIdeBool == true && screen.width > 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "🔚";
            ArrowContainer.style.marginLeft = "420px";
            ShowHIdeBool = false;
        }
        if (ShowHIdeBool == true && screen.width < 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "⬆";
            ArrowContainer.style.marginTop = "260px";
            ShowHIdeBool = false;
        }
    }
}

function ExportToTable() {
    var Exeabc = document.getElementById('Exeabc');
    let Value = `<table id="tabledata" border="1">
                    <tr>
                        <th>Name</th>
                        <th>Xvalue</th>
                        <th>Yvalue</th>
                        <th>CO2</th>
                        <th>Dust</th>
                    </tr>
                </table>
                `;
    Exeabc.innerHTML = Value;
    var ref1 = firebase.database().ref();
    ref1.once("value")
        .then(function (snapshot) {
            Exeabc.innerHTML = Value;
            for (var i = 1; i <= snapshot.numChildren(); i++) {
                database.ref("/Station" + String(i)).on("value", function (snapshot) {
                    Xvalue = snapshot.val().Xvalue;
                    Yvalue = snapshot.val().Yvalue;
                    Name = snapshot.val().Name;
                    CO2 = snapshot.val().CO2;
                    Dust = snapshot.val().Dust;
                    var tabledata = document.getElementById('tabledata');
                    var tr = document.createElement('tr');
                    var td1 = document.createElement('td');
                    td1.appendChild(document.createTextNode(`${Name}`));
                    var td2 = document.createElement('td');
                    td2.appendChild(document.createTextNode(`${Xvalue}`));
                    var td3 = document.createElement('td');
                    td3.appendChild(document.createTextNode(`${Yvalue}`));
                    var td4 = document.createElement('td');
                    td4.appendChild(document.createTextNode(`${CO2}`));
                    var td5 = document.createElement('td');
                    td5.appendChild(document.createTextNode(`${Dust}`));
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tabledata.appendChild(tr);
                })
            }
        });
}
function ExportExcelFile(){
    var tabledata = document.getElementById('tabledata');
    var wb = XLSX.utils.table_to_book(tabledata, { sheet: "sheet1" });
    return XLSX.writeFile(wb, "MapProject" + "." + "xlsx" || ("MySheet." + ("xlsx" || "xlsx")));
}

