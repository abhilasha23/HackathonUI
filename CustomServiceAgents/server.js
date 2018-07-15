/**
 * Created by abhilashak on 22/11/17.
 */
// set up ========================
var express = require('express');

var app = express();                               //create our app w/ express
var http = require('http');
var https = require('https');
var typaheadWords;
var serverip = '0.0.0.0'; //hiding the organization IP address
var pythonserverport = '8080';







console.log("Inside getWordsTypeahead");
//var reqString = ((req.params.aids).slice(1,-1)).replace(/,/g ,'%20' );
//console.log(reqString);

var opts = {
    host: serverip,
    port: 8983,
    path: '/solr/vocab/select?q=*:*&wt=json'
};

console.log(opts.host + opts.path);
var callback1 = function (response) {
    var str = '';

    console.log("inside callback");
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        //console.log(str);
        typaheadWords = JSON.parse(str);
        console.log("typeahead words loaded");

    });
};
var post_req1 = http.request(opts, callback1);
post_req1.on('error', function(err) {
    console.log("error in typeahead - " + err);
});


post_req1.end();


app.get('/api/customagents/loadtypeaheaddata',function(req,res){

    console.log("inside loadtypeaheaddata");
    res.json(typaheadWords);

});

app.get('/api/customagents/getArticleData/:aids', function (req, res) {

    console.log("Inside customagents api get Insights");
    var reqString = ((req.params.aids).slice(1,-1)).replace(/,/g ,'%20' );
    console.log(reqString);

    var options = {
        host: serverip,
        port: 8983,
        path: '/solr/custom_agents/select?q=article_id:('+reqString+')&rows=10000&wt=json'
    };

    console.log(options.host + options.path);
    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            //console.log(str);
            var obj = JSON.parse(str);
            res.json(obj);
        });
    };
    var post_req = http.request(options, callback);
    post_req.on('error', function(err) {
        console.log("error in typeahead - " + err);
    });

    post_req.end();
});


app.get('/api/customagents/getWordsPlus/:words', function(req,res){

    console.log("inside getWordsPlus");

    var reqString = (req.params.words).slice(1,-1);

    console.log("reqString = " + reqString);
    //var postquery = JSON.stringify({"message":"aws,cloud"});
    var postquery = JSON.stringify({"message":reqString});

    var post_options = {
        host: serverip,
        port: 8080,
        path: '/swe' ,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(post_options.host+post_options.path);

    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            //console.log(str);
            //var obj = JSON.parse(str);
            //console.log(obj);
            res.json(str);
        });

    };
    var post_req = http.request(post_options, callback);

    // post the data
    post_req.write(postquery);
    post_req.on('error', function(err) {
        console.log("error in /swe - " + err);
    });
    post_req.end();

});

app.get('/api/customagents/getInsights/:sel/:dsel', function(req,res){

    console.log("inside getWordsPlus");

    var messagesel = (req.params.sel).slice(1,-1);
    var messagedsel = (req.params.dsel).slice(1,-1);

    console.log("messagesel = " + messagesel);
    console.log("messagedsel = "+ messagedsel);
    //var postquery = JSON.stringify({"message":"aws,cloud"});
    var postquery = JSON.stringify({"messagesel":messagesel,"messagedsel":messagedsel});

    var post_options = {
        host: serverip,
        port: 8080,
        path: '/swe2' ,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(post_options.host+post_options.path);

    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            //console.log(str);
            //var obj = JSON.parse(str);
            //console.log(obj);
            res.json(str);
        });

        response.on('error',function(){
            console.log("some error occured.");
        })
    };
    var post_req = http.request(post_options, callback);

    // post the data
    post_req.write(postquery);

    post_req.on('error', function(err) {
        console.log("error in /swekmeans - " + err);
    });
    post_req.end();

});

app.get('/api/customagents/getFinalResultSet/:sel/:dsel/:wordsel/:worddsel', function(req,res){

    console.log("inside getWordsPlus");

    var messagesel = (req.params.sel).slice(1,-1);
    var messagedsel = (req.params.dsel).slice(1,-1);
    var wordsel = (req.params.wordsel).slice(1,-1);
    var worddsel = (req.params.worddsel).slice(1,-1);

    console.log("xxmessagesel = " + messagesel);
    console.log("xxmessagedsel = "+ messagedsel);
    //var postquery = JSON.stringify({"message":"aws,cloud"});
    var postquery = JSON.stringify({"messagesel":messagesel,"messagedsel":messagedsel,"wordsel":wordsel,"worddsel":worddsel});

    var post_options = {
        host: serverip,
        port: 8080,
        path: '/results' ,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(post_options.host+post_options.path);

    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            //console.log(str);
            //var obj = JSON.parse(str);
            //console.log(obj);
            res.json(str);
        });

    };
    var post_req = http.request(post_options, callback);

    // post the data
    post_req.write(postquery);

    post_req.on('error', function(err) {
        console.log("error in /results - " + err);
    });
    post_req.end();

});




var distDir = '/Users/abhilashakanitkar/WebstormProjects' + "/CustomServiceAgents";
//var distDir = '/models/custom_agents/Alpha_Rays/UIcode' + "/CustomServiceAgents/";
app.use(express.static(distDir));


// listen (start app with node server.js) ======================================
app.listen(8081);
console.log("App listening on port 8081");

