# Twenty

## What is it?
Twenty is a small package to help you get location (city/region and lat/lon coordinates) and ISP data from an IP address or URL. Other utilities are provided, like a method that provides the approximate distance between two IP addresses. All of this can also be done by specifying the FQDN, like "stackabuse.com" or "google.com".

For location data, the [ipinfo.io](http://ipinfo.io/) REST service is used.

Twenty was created in conjunction with [this article](http://stackabuse.com/how-to-create-a-node-js-cli-application/).

## Installation
Twenty can be installed as a project dependency or global CLI tool:

```bash
$ [sudo] npm install twenty [-g]
```

## Usage
There are two ways to use this package: through the command line or by within your code.

### Command Line
```bash
$ twenty [command] [ip | url] [-j]
```

Twenty takes an optional IP (or URL) address as an argument. If one isn't given, then your own IP address is used. If you're using the `distance` command, then you must provide at least one IP/URL, and optionally two.

The `-j` flag will print out all of the IP location info JSON format.

```bash
$ twenty stackabuse.com -j
{
    "ip": "54.173.122.231",
    "hostname": "ec2-54-173-122-231.compute-1.amazonaws.com",
    "city": "Ashburn",
    "region": "Virginia",
    "country": "US",
    "loc": "39.0437,-77.4875",
    "org": "AS14618 Amazon.com, Inc.",
    "postal": "20147"
}
```

### In Your Code
Twenty can also be used programmatically. Currently, the functions provided are `info()` and `distance()`.

- `info()`: Provides you with all the IP info as a JavaScript object
- `distance()`: Calculates the distance between two IPs/URLs in kilometers

#### Example Code

```javascript
var twenty = require('twenty');

twenty.info('8.8.8.8', function(err, data) {
    console.log('Google\'s DNS server is located at:', data.loc);
});

twenty.distance('8.8.8.8', '54.173.122.231', function(err, distance) {
    console.log('Distance between Google\'s DNS and stackabuse.com server (km):', distance);
});
```

## Note
Since Twenty uses the ipinfo.io REST service for getting location information, you'll need to be aware of your usage. The daily limit for free usage is 1,000 requests per day. Check the [ipinfo.io](http://ipinfo.io/about) About page for more information.

## Why 'Twenty'?
The name 'Twenty' came from the phrase "What's your 20?", which came from the police [10-code](https://en.wikipedia.org/wiki/Ten-code) "10-20", which means "identify your position" or "where are you?".

## Copyright & License
Copyright (c) 2016 Scott Robinson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.