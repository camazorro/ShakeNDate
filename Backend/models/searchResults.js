/**
 * Created by camazorro on 9/14/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;

var searchResultsSchema = new Schema({
    searhchID: String,
    userID: String,
    places:[{
        placesID: String
    }]
});

model.saveSearch = function(serachID,userID,placesBag){
    var searchResults = mongoose.model('searchResults', searchResultsSchema);




    Places.collection.insert(placesBag, function(error,docs){
        if (err) {
            // TODO: handle error
        } else {
            console.info('%d places were successfully stored.', docs.length);
        }
    });
};