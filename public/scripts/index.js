$(function () {
    var panelVisible = false;
    var selectedMarker = null;
    var map = L.map('main_map').setView([1.3733, 32.2903], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function openPanel() {
        $("#work_panel").addClass('work-panel-open');
    }

    function closePanel() {
        $("#work_panel").removeClass('work-panel-open');
    }
    function onMapClick(e) {
        if (selectedMarker) {
            selectedMarker.setLatLng(e.latlng);
        }
        else {
            selectedMarker = L.marker(e.latlng).addTo(map);
            openPanel();
        }
        if (e.latlng) {
            getEducationData(e.latlng);
        }
    }

    function getEducationData(latlng) {
        var url = 'https://pduy80sp4l.execute-api.us-east-1.amazonaws.com/prod/metrics/';
        input = latlng.lat + ',' + latlng.lng;
        // jQuery.get(  );
        console.log(input);
        jQuery.get(url + input,
            null,
            buildCharts,
            'json');
    }

    var charts = [];
    var datanumber = 0;

    map.on('click', onMapClick);
    var chart1 = null;
    function buildCharts(data) {
        
        var mainData = data.collections[0];
        console.log(mainData.country);
        $('#country_name').text(mainData.country);
        console.log(mainData);
        var title1 = mainData.title;
        $('#chart_1_title').text(title1);
        var labels = [];
        var values = [];
        for (var j = 0; j < mainData.data.length; j++) {
            labels.push(mainData.data[j].value);
            values.push(mainData.data[j].count);
        }

        if(values.length === 0) {
            $('#no_records').text('No Records Found');
        }
        else {
            $('#no_records').text('');            
        }
            
        if (chart1) {
            chart1.data.datasets[0].data  = values;
            chart1.data.labels = labels;
            chart1.update();
        }
        else {
            var ctx = document.getElementById("chart1");
            chart1 = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# of Votes',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    // scales: {
                    //     yAxes: [{
                    //         ticks: {
                    //             beginAtZero:true
                    //         }
                    //     }]
                    // }
                }
            });
        }

    }

});