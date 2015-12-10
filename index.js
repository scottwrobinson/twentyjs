var dns = require('dns');
var request = require('request');

var ipRegex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;

var toRad = function(num) {
    return num * (Math.PI / 180);
};

var getIpInfo = function(server, callback) {
    var ipinfo = function(p, cb) {
        request('http://ipinfo.io/' + p, function(err, response, body) {
            var json = JSON.parse(body);
            cb(err, json);
        });
    };

    if (!server) {
        return ipinfo('json', callback);
    } else if (!server.match(ipRegex)) {
        return dns.lookup(server, function(err, data) {
            ipinfo(data, callback);
        });
    } else {
        return ipinfo(server, callback);
    }
};

var ipDistance = function(lat1, lon1, lat2, lon2) {
    // Earth radius in km
    var r = 6371;

    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) + 
        Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    return r * c;
};

var findLocation = function(server, callback) {
    getIpInfo(server, function(err, data) {
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
        .alias('d', 'distance')
        .alias('j', 'json')
        .alias('i', 'info')
        .argv;

    if (argv.d) {
        findDistance(argv._[0], argv.d, function(err, distance) {
            console.log(distance);
        });
    } else if (argv.j) {
        getIpInfo(argv._[0], function(err, data) {
            console.log(JSON.stringify(data, null, 4));
        });
    } else if (argv.i) {
        getIpInfo(argv._[0], function(err, data) {
            console.log('IP:', data.ip);
            console.log('Hostname:', data.hostname);
            console.log('City:', data.city);
            console.log('Region:', data.region);
            console.log('Postal:', data.postal);
            console.log('Country:', data.country);
            console.log('Coordinates:', data.loc);
            console.log('ISP:', data.org);
        });
    } else {
        findLocation(argv._[0], function(err, location) {
            console.log(location);
        });
    }
};

exports.info = getIpInfo;
exports.location = findLocation;
exports.distance = findDistance;
exports.cli = cli;