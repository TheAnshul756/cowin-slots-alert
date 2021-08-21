var pincode = undefined;
var head = ["center_id", "name", "address", "available_capacity_dose1", "available_capacity_dose2", "min_age_limit", "vaccine"];
var audio = new Audio("./static/sound/alarm_r.mp3");
var available = false;
var intervalId = undefined;

$(document).ready(function () {
    const newHttp = new XMLHttpRequest();
    newHttp.responseType = 'json';
    url = "https://api.countapi.xyz/hit/cowin-slots-alert/pageViews";
    newHttp.open("GET", url);
    newHttp.onload = () => {
        out = newHttp.response;
        countdiv = document.getElementById("viewscount");
        countdiv.innerHTML = "Total Page Views: " + out.value;
    };
    newHttp.send();
});

$("#doseType").click(function() {
    // console.log("switch Toggled");
    var doseSwitch = document.getElementById("doseType");
    var unselected = {"color": "black", "font-weight": "normal", "font-size": "16px"};
    var selected = {"color": "green", "font-weight": "bold", "font-size": "18px"};
    if(doseSwitch.checked) {
        $("#leftText").css(unselected);
        $("#rightText").css(selected);
    } else {
        $("#leftText").css(selected);
        $("#rightText").css(unselected);
    }
});

function setPinCode() {
    pincode = document.getElementById("pincode").value;
    // console.log("{{ url_for('static', filename='img/bell.jpeg')}}");
    checkAvailability()
    var status = document.getElementById('status');
    status.innerHTML = "Status: &#128994; (Updating List every 10 seconds)";
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(function () {
        checkAvailability();
    }, 10000);
}
function stopUpdating() {
    if (intervalId !== undefined) {
        var status = document.getElementById('status');
        status.innerHTML = "Status: &#128308; (Stopped Updating)";
        clearInterval(intervalId);
    }
}
function myFunction(obj, index, array) {
    var checkBox = document.getElementById("age");
    var doseSwitch = document.getElementById("doseType");
    if (((checkBox.checked == true && obj['min_age_limit'] == 18) || (checkBox.checked == false)) && obj['available_capacity'] > 0 && ((doseSwitch.checked == true && obj['available_capacity_dose2'] > 0) || (doseSwitch.checked == false && obj['available_capacity_dose1'] > 0))) {
        available = true;
        var txt = '<tr style="background-color:#00FF00">'
        for (key in obj) {
            if (obj.hasOwnProperty(key) && head.includes(key)) {
                txt = txt + '<td>' + obj[key] + '</td>';
            }
        }
        txt = txt + '</tr>';
        $(mytable).append(txt);
    } else {
        var txt = '<tr>'
        for (key in obj) {
            if (obj.hasOwnProperty(key) && head.includes(key)) {
                txt = txt + '<td>' + obj[key] + '</td>';
            }
        }
        txt = txt + '</tr>';
        $(mytable).append(txt);
    }
}
function checkAvailability() {
    if (pincode !== undefined) {
        console.log("Updating List...");
        var today = new Date();
        // add one day to current date because vaccine slots are now booked for next day
        var date = new Date(today.getTime() + (1000 * 60 * 60 * 24)).toLocaleString().slice(0, 10).split('-').reverse().join('-');
        var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?';
        // console.log(url+'pincode='+pincode+'&date='+date)
        const Http = new XMLHttpRequest();
        Http.responseType = 'json';
        Http.open("GET", url + 'pincode=' + pincode + '&date=' + date);
        Http.onload = () => {
            out = Http.response;
            var Table = document.getElementById("mytable");
            Table.innerHTML = "<tr><th>Center ID</th><th>Name</th><th>Address</th><th>Dose 1</th><th>Dose 2</th><th>Age Limit</th><th>Vaccine</th></tr>";
            available = false;
            out['sessions'].forEach(myFunction);
            if (available) {
                audio.play();
            }
        };
        Http.send();
    }
}