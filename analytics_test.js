var plotly = require('plotly')("sealneaward", "tt2lczxubi");

var data = [
    {
        x: ["giraffes", "orangutans", "monkeys"],
        y: [20, 14, 23],
        type: "bar"
    }
];
var graphOptions = {filename: "basic-bar", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    var url = msg.url + '.embed'
    console.log(url);

});