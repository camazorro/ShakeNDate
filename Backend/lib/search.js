/**
 * Created by camazorro on 9/12/15.
 */

module.exports = {
    fetch: function(options,fn){
        var error = null;
        var yelp = require("node-yelp");
        var client = yelp.createClient({
            oauth: {
                consumer_key: "YoOhqB2I7bHKTXmrr-bfyA",
                consumer_secret: "ED0aazNPTcODgyzZSTKVPiRqxw8",
                token: "TkKZ_-tQ9_OQUQJ1WEQZFF1JOb8_NoAm",
                token_secret: "DA3Fzvj6rbLvT2iIZmRcZ4877Gg"
            }
        });
        options.limit ="20";
        options.offset ="0";
        options.sort ="0";

        client.search(options).then(function (data) {

            var results = data;
            var totalResults = data.total;

            fn(results);

            var requestsParams = [];
            var i = 21;
            while(i<= totalResults){
                if(i >= 500) break;
                var resquestParams = new Object();
                resquestParams = {
                    term: options.term,
                    ll: options.ll,
                    redius_filter: options.redius_filter,
                    limit: '20',
                    offset: i.toString(),
                    sort: '0'
                };
                requestsParams.push(resquestParams);
                i = parseInt(i)+20;
            };

            var async = require('async');
            async.forEachOf(requestsParams, function(value,key,callBack){
                client.search(value).then(function(d){
                    results.businesses = results.businesses.concat(d.businesses);
                    callBack();
                });
            },function(err){

                var placeModel = require('../models/places');
                placeModel.savePlaces(data.businesses);
                console.log('finish');
                //fn(results);
            });

        });

    },
    getRandom: function(searchID){
        var random = require('mongoose-random');

    }
};