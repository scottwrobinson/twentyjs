var request = require('request');

// TODO:
// In findLocation, if IP not given, use our own
// In findDistance, if IP(s) not given, use our own

var toRad = function(num) {
    return num * (Math.PI / 180);
};

var getIpInfo = function(path, callback) {
    request('http://ipinfo.io/' + path, function(err, response, body) {
        var json = JSON.parse(body);
        callback(err, json);
    });
};

var ipDistance = function(lat1, lon1, lat2, lon2) {
    var r = 6371; // Earth radius in km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) + 
        Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    return r * c;
};

var findLocation = function(ip, callback) {
    var path;
    if (typeof(ip) === 'function' || !ip) path = 'json';
    else path = ip;

    getIpInfo(path, function(err, data) {
        callback(null, data.city + ', ' + data.region);
    });
};

var findDistance = function(ip1, ip2, callback) {
    var lat1, lon1, lat2, lon2;

    getIpInfo(ip1, function(err, data1) {
        var coords1 = data1.loc.split(',');
        lat1 = Number(coords1[0]);
        lon1 =  Number(coords1[1]);
        getIpInfo(ip2, function(err, data2) {
            var coords2 = data2.loc.split(',');
            lat2 =  Number(coords2[0]);
            lon2 =  Number(coords2[1]);

            var dist = ipDistance(lat1, lon1, lat2, lon2);
            callback(null, dist);
        });
    });
};

var cli = function() {
    var argv = require('yargs')
        .default('rtt', false)
        .alias('d', 'distance')
        .argv;

    var path = 'json';
    if (argv._[0]) {
        path = argv._[0];
    }

    if (argv.d) {
        findDistance(argv._[0], argv.d, function(err, distance) {
            console.log(distance);
        });
    } else {
        findLocation(path, function(err, location) {
            console.log(location);
        });
    }
};

exports.findLocation = findLocation;
exports.cli = cli;