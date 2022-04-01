
var prayerTimes;
var prayerTimeHeader;
var current;
var next;

const COL_ID = 0;
const COL_DATE = 0;
const COL_PRAYER = 1;
const COL_ADHAAN = 2;
const COL_IQAMAH = 3;
const COL_ADHAAN_MOMENT = 4;
const COL_IQAMAH_MOMENT = 5;

const NEW_COL_DATE = 0;
const NEW_COL_FAJR_ADHAAN = 1;
const NEW_COL_FAJR_IQAAMAH = 2;
const NEW_COL_SUNRISE = 3;
const NEW_COL_DHUHR_ADHAAN = 4;
const NEW_COL_DHUHR_IQAAMAH = 5;
const NEW_COL_ASR_ADHAAN = 6;
const NEW_COL_ASR_IQAAMAH = 7;
const NEW_COL_MAGHRIB_ADHAAN = 8;
const NEW_COL_MAGHRIB_IQAAMAH = 9;
const NEW_COL_ISHA_ADHAAN = 10;
const NEW_COL_ISHA_IQAAMAH = 11;

/**
 * Loads the prayer times found in the csv based on the date string
 * If no date string is found, it will load the first set
 * @param {string} today Format YYYY-MM-DD 
 */
function loadPrayerTimes(today, tomorrow) {
    console.log("loading prayer times from file for ", today);
    var data;
    
    $.ajax({
        type: 'GET',
        url: './assets/data/current.csv',
        dataType: 'text',
        success: function(response) {
            var now = new Date();
            prayerTimes = $.csv.toArrays(response);
            prayerTimeHeader = prayerTimes[0]; 
            prayerTimes = prayerTimes.filter(function(item) {
                return item[NEW_COL_DATE] == today || item[NEW_COL_DATE] == tomorrow;
            });

            // console.log(prayerTimes);
            
            // momentize the time values in both prayer times
            prayerTimes.forEach(item => {
                for(var i=1; i < item.length; i++) {
                    item[i] =  moment(item[NEW_COL_DATE] + " " + item[i], "YYYY-MM-DD hh:mm A");
                }
            });
           
            // console.log("after momentizing: ", prayerTimes); 

            var prayers = setCurrentPrayer()
            current = prayers[0];
            next = prayers[1];

            updateTable(prayerTimes);

           
        }
    });
}

function setCurrentPrayer() {
    // 
    var now = moment(new Date());
    var currentPrayer;
    var nextPrayer;

    if (prayerTimes !== undefined) {
        for(var i=NEW_COL_DATE + 1; i < prayerTimes[0].length; i++) {
            if(i + 1 < prayerTimes[0].length) {  
                if (now <= prayerTimes[0][i]) {
                     // if it is past 12:00 am but not yet fajr
                    idx = i;
                    var currentPrayerIdx = prayerTimes[0].length - 1;
                    currentPrayer = [prayerTimeHeader[currentPrayerIdx], prayerTimes[0][currentPrayerIdx]]
                    nextPrayer = [prayerTimeHeader[i], prayerTimes[0][i]];
                    break;

                }
                else if (now > prayerTimes[0][i] && now < prayerTimes[0][i+1] ) {
                    idx = i;
                    currentPrayer = [prayerTimeHeader[i], prayerTimes[0][i]]
                    nextPrayer = [prayerTimeHeader[i+1], prayerTimes[0][i+1]]
                    break;
                }
            } else {
                currentPrayer = [prayerTimeHeader[i], prayerTimes[0][i]];
                nextPrayer = [prayerTimeHeader[NEW_COL_FAJR_ADHAAN], prayerTimes[1][NEW_COL_FAJR_ADHAAN]];
                break;
            }
        }
    }
    

    return [currentPrayer, nextPrayer];
}

function getTodaysDateAsISOString() {
    var today = new Date();
    return today.getFullYear().toString() + "-" + (today.getMonth() + 1).toString().padStart(2, '0') + "-" + today.getDate().toString().padStart(2, '0') ;
}
function getTomorrowsDateAsISOString() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') ;
}

function updateTable(prayerTimes) {
    var rows = ''
    var header = '';

    header += '<tr>';
    header += '<th></th>';
    header += '<th>Adhaan</th>';
    header += '<th>Iqamah</th>';
    header += '</tr>';

    for(var i=NEW_COL_DATE + 1; i<prayerTimes[0].length;) {
        var row = prayerTimes[0];
        
            if(prayerTimeHeader[i] == current[0]) {
                rows += "<tr class='current'>"
            } else {
                rows += '<tr>';
            }

            if (i === NEW_COL_SUNRISE) {
                rows += "<th>" + prayerTimeHeader[i] +  "</th>";
                rows += "<th>" + row[i].format('LT') + "</th>";
                i = i + 1;
                continue;
            } else 
            {
                rows += "<th>" + prayerTimeHeader[i] +  "</th>";
                rows += "<th>" + row[i].format('LT') + "</th>";
                rows += "<th>" + row[i+1].format('LT') + "</th>";
            }

            rows += '</tr>';

            i = i + 2;
    }

    $('#prayertimes tr').remove();
    $('#prayertimes').append(header);
    $('#prayertimes tr:last').after(rows);

    // $('#prayertimes tr').after(rows);
}

function main() {
    var today = getTodaysDateAsISOString();
    var tomorrow = getTomorrowsDateAsISOString();

    loadPrayerTimes(today, tomorrow);
}

$(function() {
    
    main();
    setInterval(function(){
        $('#now').html(moment().format('LT') + " (" + current[0] + " )");
    }, 1000); 

    setInterval(function(){
        main()
        $('#nextPrayer').html(next[0] + " @ " + next[1].format('LT'));
    }, 10000); 

})