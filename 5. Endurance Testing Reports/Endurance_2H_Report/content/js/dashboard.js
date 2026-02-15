/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.87932428593282, "KoPercent": 22.12067571406718};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7172272121331322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9328264045689999, 500, 1500, "HTTP Request-Admin Login Page(GET)"], "isController": false}, {"data": [0.9151068648634577, 500, 1500, "HTTP Request-Login Page-GET"], "isController": false}, {"data": [0.9370642106358622, 500, 1500, "HTTP Request-Tickets Page"], "isController": false}, {"data": [0.0596424774056353, 500, 1500, "HTTP Request-Admin Login Page(POST)"], "isController": false}, {"data": [0.8843621125448983, 500, 1500, "HTTP Request-Admin Dashboard"], "isController": false}, {"data": [0.0537890625, 500, 1500, "HTTP Request-Submit Login-POST"], "isController": false}, {"data": [0.9306868095301477, 500, 1500, "HTTP Request-Member administration"], "isController": false}, {"data": [0.9232407962186272, 500, 1500, "HTTP Request-Financial reporting"], "isController": false}, {"data": [0.9064756641205454, 500, 1500, "HTTP Request-Customer Dashboard"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 228795, 50611, 22.12067571406718, 334.4078804169597, 0, 19441, 124.0, 490.90000000000146, 648.0, 1035.9900000000016, 31.7890527947398, 60.24597950505218, 21.89786931514248], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-Admin Login Page(GET)", 15058, 52, 0.34533138531013413, 260.25992827732784, 0, 18997, 154.0, 519.0, 668.0499999999993, 1424.4599999999991, 2.092765172651737, 4.47617517931063, 0.2851321754653929], "isController": false}, {"data": ["HTTP Request-Login Page-GET", 38413, 236, 0.6143753416812017, 300.4253507926995, 0, 17671, 153.0, 573.0, 850.9000000000015, 1810.0, 5.340868453880247, 11.424572650924409, 0.7205270615570788], "isController": false}, {"data": ["HTTP Request-Tickets Page", 38436, 137, 0.3564366739515038, 253.93649183057474, 0, 17390, 143.0, 518.0, 719.0, 1569.9900000000016, 5.340594926935031, 11.422840049513676, 0.6911790612354454], "isController": false}, {"data": ["HTTP Request-Admin Login Page(POST)", 15048, 13900, 92.37107921318447, 486.60725677830885, 0, 9741, 391.0, 684.0, 834.0, 1243.0200000000004, 2.0925220703509035, 2.319574024211056, 1.565219858045572], "isController": false}, {"data": ["HTTP Request-Admin Dashboard", 15034, 81, 0.538778768125582, 371.9930158307831, 0, 7496, 227.0, 724.0, 1136.25, 2215.999999999978, 2.0917803772523267, 4.474450648074161, 4.628322737526782], "isController": false}, {"data": ["HTTP Request-Submit Login-POST", 38400, 35905, 93.50260416666667, 458.1376822916634, 0, 13212, 382.0, 688.0, 835.0, 1295.0, 5.33995784770774, 5.82175427340904, 4.001410912641905], "isController": false}, {"data": ["HTTP Request-Member administration", 15026, 65, 0.43258352189538135, 266.7029814987359, 0, 11728, 162.0, 520.0, 673.0, 1409.9199999999983, 2.0917982880553527, 4.4741473483157375, 4.680084599822464], "isController": false}, {"data": ["HTTP Request-Financial reporting", 15021, 60, 0.3994407829039345, 284.8207842354056, 0, 19441, 166.0, 539.0, 757.0, 1529.7800000000007, 2.0923780522204405, 4.4755898444775, 4.664623429932917], "isController": false}, {"data": ["HTTP Request-Customer Dashboard", 38359, 175, 0.4562162725827055, 325.8178523944843, 0, 12374, 182.0, 594.0, 909.0, 2003.8600000000224, 5.341064247326126, 11.424420081155034, 0.6957397044682593], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 7, 0.01383098535891407, 0.0030595074193054917], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, 0.007903420205093754, 0.0017482899538888525], "isController": false}, {"data": ["502/Bad Gateway", 6, 0.011855130307640632, 0.002622434930833279], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 117, 0.2311750409989923, 0.051137481151248936], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 786, 1.5530220703009228, 0.3435389759391595], "isController": false}, {"data": ["429/Too Many Requests", 49675, 98.15059967200806, 21.711575864857185], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 16, 0.031613680820375016, 0.00699315981555541], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 228795, 50611, "429/Too Many Requests", 49675, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 786, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 117, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 16, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 7], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request-Admin Login Page(GET)", 15058, 52, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 51, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Login Page-GET", 38413, 236, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 230, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Tickets Page", 38436, 137, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 136, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Admin Login Page(POST)", 15048, 13900, "429/Too Many Requests", 13859, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 36, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 4, "502/Bad Gateway", 1, "", ""], "isController": false}, {"data": ["HTTP Request-Admin Dashboard", 15034, 81, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 77, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Submit Login-POST", 38400, 35905, "429/Too Many Requests", 35816, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 81, "502/Bad Gateway", 5, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 3, "", ""], "isController": false}, {"data": ["HTTP Request-Member administration", 15026, 65, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Financial reporting", 15021, 60, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 57, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Customer Dashboard", 38359, 175, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 170, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
