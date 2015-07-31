var https = require('https');
var fs = require('fs');

var eu = {};
var p1 = [];
var p2 = [];

console.time('done');

function run(b,e,p) {
  for (var i = b; i <= e; i++) {
    (function(id){
      p.push(
      getpage(id).then(function(res) {
        eu[id] = res;
      })
    )
    })(i);
  };
}

run(1,256, p1);

Promise.all(p1).then(function() {
  run(257,512, p2);
  Promise.all(p2).then(function(res){
    fs.writeFile('euler.json', JSON.stringify(eu, null, 4), function(err) {
      if(err) console.log(err);
      console.timeEnd('done');
    })
  })
})


function getpage(id){
  return new Promise(function(y, n) {
    https.get("https://projecteuler.net/problem=" + id, function(res) {
      var str = '';

      res.on('data', function(chunk) {
        str += chunk;
      })

      res.on('end', function(err) {
        str = str.replace(/<\w+ [^>]+>|<\/\w+>|<\w+>/g, ' ')
              .split('secure connection').pop()
              .split("Project Euler")[0].replace(/(\\n|\\r*){2,}/g, ' ').trim();
        if(err) n(err);
        console.log('moving on: ', id);
        y(str);
      })
    });
  })
}
