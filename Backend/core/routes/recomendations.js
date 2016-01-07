/**
 * Created by camazorro on 9/12/15.
 */
var self = module.exports ={
    index: function(request,response,next){

        if(request.params.SearchID === null || request.params.SearchID === undefined ){
            //Create new Search
            var util = require('./../../lib/utils.js');
            var searchID = util.guid();





            //Fetch 3 Random
            var places = require('./../../lib/search');
            var options = {
                "term": "restaurants",
                //"term": request.query.Categories,
                //"ll": "28.0878350,-81.9812520",
                "ll": request.query.lat + "," + request.query.lon,
                "redius_filter": "8047"
            };
            console.log(options);
            places.fetch(options,function(data){

                var resJON  =[];
                var yelp = data.businesses.slice(0,3);

                for(i=0;i< 3;i++){
                    var obj= {
                        searchID : searchID,
                        yelpJSON: JSON.stringify(yelp[i])
                    }

                    resJON.push(obj);
                };

                var resBack = {
                    isSuccess: true,
                    data: resJON
                };

                response.send(200,resBack);
            });
            places =null;
        }
        else{
            //Fetch 3 Random
            var places = require(baseDir + '/lib/searchResults.js');
            var options = {
                "term": "restaurants",
                //"term": request.query.Categories,
                "ll": "28.0878350,-81.9812520",
                //"ll": request.query.lat + "," + request.query.lon,
                "redius_filter": "8047"
            };
            places.fetch(options,function(data){
                response.send(200,data);
            });

        }



    },
    register: function(server){
        server.get({path:"/SAD/GetRecomendations"},self.index);
        server.get({path:"recomendations"},self.index);
    }
};

self.__module ={
    provides:['routes/register']
}
