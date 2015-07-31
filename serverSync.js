var https = require('https');
var fs = require('fs');

var eu = {};
console.time('done');
function nextreq(id){
  https.get("https://projecteuler.net/problem=" + id, function(res) {
  var str = '';

  res.on('data', function(chunk) {
    str += chunk;
  })

  res.on('end', function() {
    str = str.replace(/<\w+ [^>]+>|<\/\w+>|<\w+>/g, ' ')
          .split('secure connection').pop()
          .split("Project Euler")[0].replace(/(\\n|\\r*){2,}/g, ' ').trim();

    eu[id] = str;
    console.log('moving on: ', id);
    if (id < 512) {
      nextreq(++id)
    }
    else {
      fs.writeFile('euler.json', JSON.stringify(eu, null, 4), function(err) {
        if(err) console.log(err);
        console.timeEnd('done');
      })
    }
  })
});
}
nextreq(1)
