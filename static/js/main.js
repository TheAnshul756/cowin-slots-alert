var pincode = undefined;
var head = ["center_id", "name", "address", "available_capacity_dose1", "available_capacity_dose2", "min_age_limit", "vaccine"];
var audio = new Audio("./static/sound/alarm_r.mp3");
var available = false;
var intervalId = undefined;
function setPinCode() {
    pincode = document.getElementById("pincode").value;
    // console.log("{{ url_for('static', filename='img/bell.jpeg')}}");
    checkAvailability()
    var status = document.getElementById('status');
    status.innerHTML = "Status: &#128994; (Updating List every 10 seconds)";
    intervalId = window.setInterval(function(){
        checkAvailability();
    }, 10000);
}
function stopUpdating() {
    if(intervalId !== undefined) {
        var status = document.getElementById('status');
        status.innerHTML = "Status: &#128308; (Stopped Updating)";
        clearInterval(intervalId)
    }
}
function myFunction(obj, index, array) {
    var checkBox = document.getElementById("age");
    if((checkBox.checked ==  true && obj['min_age_limit'] == 18 && obj['available_capacity'] > 0) || (checkBox.checked ==  false && obj['available_capacity'] > 0)) {
        available = true;
        var txt = '<tr style="background-color:#00FF00">'
        for(key in obj) {
            if (obj.hasOwnProperty(key) && head.includes(key)) {
                txt = txt + '<td>' + obj[key] + '</td>';
            }
        }
        txt = txt + '</tr>';
        $(mytable).append(txt);
    } else {
        var txt = '<tr>'
        for(key in obj) {
            if (obj.hasOwnProperty(key) && head.includes(key)) {
                txt = txt + '<td>' + obj[key] + '</td>';
            }
        }
        txt = txt + '</tr>';
        $(mytable).append(txt);
    }
}
function checkAvailability() {
    if(pincode !== undefined) {
        console.log("Updating List...");
        const Http = new XMLHttpRequest();
        var date = new Date().toJSON().slice(0,10).split('-').reverse().join('-');
        var url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?';
        // console.log(url+'pincode='+pincode+'&date='+date)
        Http.responseType = 'json';
        Http.open("GET", url+'pincode='+pincode+'&date='+date);
        Http.onload = () => {
            out = Http.response;
            var Table = document.getElementById("mytable");
            Table.innerHTML = "<tr><th>Center ID</th><th>Name</th><th>Address</th><th>Dose 1</th><th>Dose 2</th><th>Age Limit</th><th>Vaccine</th></tr>";
            available = false;
            out['sessions'].forEach(myFunction);
            if(available) {
                audio.play();
            }
        };
        Http.send();
    }
}