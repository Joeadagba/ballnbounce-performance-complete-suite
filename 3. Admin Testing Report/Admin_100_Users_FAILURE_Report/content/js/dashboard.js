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

    var data = {"OkPercent": 91.60671462829737, "KoPercent": 8.393285371702637};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8537170263788969, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8679245283018868, 500, 1500, "HTTP Request-Admin Login Page(GET)"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "HTTP Request-Admin Login Page(POST)"], "isController": false}, {"data": [0.8773584905660378, 500, 1500, "HTTP Request-Admin Dashboard"], "isController": false}, {"data": [0.9504950495049505, 500, 1500, "HTTP Request-System activity logs"], "isController": false}, {"data": [0.8857142857142857, 500, 1500, "HTTP Request-Member administration"], "isController": false}, {"data": [0.9223300970873787, 500, 1500, "HTTP Request-Staff management"], "isController": false}, {"data": [0.9134615384615384, 500, 1500, "HTTP Request-Financial reporting"], "isController": false}, {"data": [0.941747572815534, 500, 1500, "HTTP Request-Employee attendance"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 834, 70, 8.393285371702637, 377.6366906474822, 0, 21481, 109.0, 720.0, 750.0, 1126.85, 1.0745940959171867, 2.4372507693043617, 1.7539060335752674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-Admin Login Page(GET)", 106, 13, 12.264150943396226, 277.68867924528325, 0, 931, 288.5, 365.3, 408.4999999999998, 914.6899999999982, 0.14008026863695291, 0.3034586384098775, 0.016802818190347943], "isController": false}, {"data": ["HTTP Request-Admin Login Page(POST)", 106, 4, 3.7735849056603774, 742.3207547169811, 0, 1130, 734.5, 854.6999999999999, 1096.8, 1129.37, 0.13996226300493697, 0.42526251383117647, 0.1010105011309215], "isController": false}, {"data": ["HTTP Request-Admin Dashboard", 106, 13, 12.264150943396226, 284.16981132075466, 0, 19032, 106.5, 154.89999999999998, 175.24999999999994, 17721.179999999862, 0.14012915677940893, 0.30220255190397183, 0.2735012748778827], "isController": false}, {"data": ["HTTP Request-System activity logs", 101, 5, 4.9504950495049505, 511.4356435643562, 0, 21480, 107.0, 141.6, 209.49999999999977, 21431.56000000001, 0.13344995890798295, 0.28815534376246965, 0.28329213120905666], "isController": false}, {"data": ["HTTP Request-Member administration", 105, 12, 11.428571428571429, 490.24761904761897, 0, 21481, 106.0, 141.60000000000005, 259.3999999999995, 21336.939999999995, 0.13878736849896833, 0.30007217975806055, 0.2762232640178547], "isController": false}, {"data": ["HTTP Request-Staff management", 103, 8, 7.766990291262136, 501.09708737864077, 0, 21456, 108.0, 138.20000000000005, 246.79999999999973, 21359.159999999985, 0.13612922496213495, 0.29422560147971144, 0.28053936910051624], "isController": false}, {"data": ["HTTP Request-Financial reporting", 104, 9, 8.653846153846153, 105.36538461538467, 0, 280, 105.0, 137.5, 156.0, 279.15000000000003, 0.13744178547451777, 0.2948682281011625, 0.28101125271579686], "isController": false}, {"data": ["HTTP Request-Employee attendance", 103, 6, 5.825242718446602, 106.83495145631066, 0, 326, 105.0, 136.60000000000002, 142.8, 324.9599999999998, 0.13611213525581814, 0.2912747041873643, 0.2865346796045876], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 2, 2.857142857142857, 0.23980815347721823], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 2, 2.857142857142857, 0.23980815347721823], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 51, 72.85714285714286, 6.115107913669065], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 8, 11.428571428571429, 0.9592326139088729], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 7, 10.0, 0.8393285371702638], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 834, 70, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 51, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request-Admin Login Page(GET)", 106, 13, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Admin Login Page(POST)", 106, 4, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (dcmqyvkadyxrnbalpuuq.supabase.co)", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: dcmqyvkadyxrnbalpuuq.supabase.co", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Admin Dashboard", 106, 13, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 11, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["HTTP Request-System activity logs", 101, 5, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Member administration", 105, 12, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Staff management", 103, 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Financial reporting", 104, 9, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: This is usually a temporary error during hostname resolution and means that the local server did not receive a response from an authoritative server (booking.ballnbounce.com)", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request-Employee attendance", 103, 6, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: booking.ballnbounce.com", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
