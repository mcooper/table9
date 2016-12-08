exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event));
    
    // get country code from lat/lng provided
    console.log('lat/lng', event.latlng);
    var http = require('http');
    var options = {
      host: 'maps.googleapis.com',
      port: 80,
      path: '/maps/api/geocode/json?sensor=false&language=en&latlng=' + event.latlng
    };
    
    var countryCode = 'GHA';
    http.get(options, function(resp) {
      resp.on('data', function(chunk) {
        console.log("response: "+ chunk);
        // countryCode = chunk.
        
        var pg = require('pg');
        // var connection = 'postgres://con-int-primary.cv3dqcstogil.us-east-1.rds.amazonaws.com';
        var connectionString = 'postgres://postgres:table9team@con-int-primary.cv3dqcstogil.us-east-1.rds.amazonaws.com:5432/vitalsigns_staging';
        var sql = 'select label, sub.value::varchar, count(*) from "curation__household_secC" a inner join (select key, value from "MetadataSummary", json_each(values::json) where name = \'hh_c02\') sub on a.hh_c02 = sub.key cross join "MetadataSummary" meta where meta.name = \'hh_c02\' and "Country" = \'GHA\' group by meta.label, sub.key, sub.value::varchar';
        
        var client = new pg.Client(connectionString);
        client.connect();
        
        var payload = {};
        var query = client.query(sql);
        query.on('end', function(data) { 
            // prep data
            payload.collections = [
                {
                    title: 'Education - Reading/Writing Ability',
                    description: 'Data on populations reading/writing ability',
                    data: data.rows
                }
            ];
            
            client.end(); 
            
            callback(null, payload);
        });
      });
    }).on("error", function(e) {
      console.log("Got error: " + e.message);
    });
    
};
