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

const map = L.map('Mapid').setView([21.038859, 105.783181], 14);
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
        let Xvalue = snapshot.val().Xvalue;
        let Yvalue = snapshot.val().Yvalue;
        let markerPoint = L.marker([Xvalue, Yvalue]).addTo(map);

        let InformationStation1 =
            `
            <div onclick="RenderInformation(${ID})" class="MarkerStation">Thông tin trạm</div>
            `
        markerPoint.bindPopup(InformationStation1);
        ExportToTable();
    })
}

let CurrentStation = 0;

function RenderInformation(IDItem) {
    ShowHide(1);
    var NameStationElement = document.getElementById('NameStationElement');
    var CoordinatesStationXvalue = document.getElementById('CoordinatesStationXvalue');
    var CoordinatesStationYvalue = document.getElementById('CoordinatesStationYvalue');
    var BarDataNumber1 = document.getElementById('BarDataNumber1');
    var BarDataNumber2 = document.getElementById('BarDataNumber2');
    var BarDataNumber3 = document.getElementById('BarDataNumber3');
    var BarDataNumber4 = document.getElementById('BarDataNumber4');
    database.ref("/Station" + String(CurrentStation) + "/Name").on("value", function (snapshot) {
        NameStationElement.innerHTML = snapshot.val();
    })
    database.ref("/Station" + String(CurrentStation) + "/Xvalue").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            CoordinatesStationXvalue.innerHTML = snapshot.val();
        }
    })
    database.ref("/Station" + String(CurrentStation) + "/Yvalue").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            CoordinatesStationYvalue.innerHTML = snapshot.val();
        }
    })
    database.ref("/Station" + String(CurrentStation) + "/Ph").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            var RatePh = snapshot.val() / 10 * 100;
            BarDataNumber1.innerHTML = snapshot.val();
            RateData(Math.round(RatePh), 'CircleData1');
        }
    });
    database.ref("/Station" + String(CurrentStation) + "/TDS").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            var RateTDS = snapshot.val() / 1500 * 100;
            BarDataNumber2.innerHTML = snapshot.val();
            RateData(Math.round(RateTDS), 'CircleData2');
        }
    })
    database.ref("/Station" + String(CurrentStation) + "/Temperature").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            var RateTemperature = snapshot.val();
            BarDataNumber3.innerHTML = snapshot.val();
            RateData(Math.round(RateTemperature), 'CircleData3');
        }
    })
    database.ref("/Station" + String(CurrentStation) + "/Turbidity").on("value", function (snapshot) {
        if (NameStationElement.textContent == "Trạm " + String(IDItem)) {
            var RateTurbidity = snapshot.val() / 70 * 100;
            BarDataNumber4.innerHTML = snapshot.val();
            RateData(Math.round(RateTurbidity), 'CircleData4');
        }
    })
    return;
}

if (screen.width > 780) {
    ArrowContainer.innerHTML = "🔚";
}
else {
    ArrowContainer.innerHTML = "⬇";
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
            ArrowContainer.style.marginLeft = "450px";
            ShowHIdeBool = false;
        }

        if (ShowHIdeBool == true && screen.width < 780) {
            MapInfomation.style.display = "none";
            ArrowContainer.innerHTML = "⬇";
            ArrowContainer.style.marginTop = "0px";
            ShowHIdeBool = false;
        }
        else if (ShowHIdeBool == false && screen.width < 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "⬆";
            ArrowContainer.style.marginTop = "630px";
            ShowHIdeBool = true;
        }
    }
    if (a == 1) {
        if (ShowHIdeBool == true && screen.width > 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "🔚";
            ArrowContainer.style.marginLeft = "450px";
            ShowHIdeBool = false;
        }
        if (ShowHIdeBool == false && screen.width < 780) {
            MapInfomation.style.display = "block";
            ArrowContainer.innerHTML = "⬆";
            ArrowContainer.style.marginTop = "630px";
            ShowHIdeBool = true;
        }
    }
}

function ExportToTable() {
    var TableData = document.getElementById('TableData');
    let Value = `<table id="tabledata" border="1">
                    <tr>
                        <th>Name</th>
                        <th>Xvalue</th>
                        <th>Yvalue</th>
                        <th>Ph</th>
                        <th>TDS</th>
                        <th>Temperature</th>
                        <th>Turbidity</th>
                    </tr>
                </table>
                `;
    var ref1 = firebase.database().ref();
    ref1.once("value")
        .then(function (snapshot) {
            TableData.innerHTML = Value;
            for (var i = 1; i <= snapshot.numChildren(); i++) {
                database.ref("/Station" + String(i)).on("value", function (snapshot) {
                    let Xvalue = snapshot.val().Xvalue;
                    let Yvalue = snapshot.val().Yvalue;
                    let Name = snapshot.val().Name;
                    let TDS = snapshot.val().TDS;
                    let Temperature = snapshot.val().Temperature;
                    let Turbidity = snapshot.val().Turbidity;
                    let Ph = snapshot.val().Ph;
                    var tabledata = document.getElementById('tabledata');
                    var tr = document.createElement('tr');
                    var td1 = document.createElement('td');
                    td1.appendChild(document.createTextNode(`${Name}`));
                    var td2 = document.createElement('td');
                    td2.appendChild(document.createTextNode(`${Xvalue}`));
                    var td3 = document.createElement('td');
                    td3.appendChild(document.createTextNode(`${Yvalue}`));
                    var td4 = document.createElement('td');
                    td4.appendChild(document.createTextNode(`${Ph}`));
                    var td5 = document.createElement('td');
                    td5.appendChild(document.createTextNode(`${TDS}`));
                    var td6 = document.createElement('td');
                    td6.appendChild(document.createTextNode(`${Temperature}`));
                    var td7 = document.createElement('td');
                    td7.appendChild(document.createTextNode(`${Turbidity}`));
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tr.appendChild(td7);
                    tabledata.appendChild(tr);
                })
            }
        });
}
function ExportExcelFile() {
    var tabledata = document.getElementById('tabledata');
    var wb = XLSX.utils.table_to_book(tabledata, { sheet: "sheet1" });
    return XLSX.writeFile(wb, "MapProject" + "." + "xlsx" || ("MySheet." + ("xlsx" || "xlsx")));
}

function RateData(numbers, idCircles) {
    var CircleData = document.getElementById(idCircles);
    let rate = numbers;
    let ratedata = 472 - 440 * rate / 100;
    CircleData.style.strokeDashoffset = ratedata;
}