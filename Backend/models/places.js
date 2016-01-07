/**
 * Created by camazorro on 9/14/15.
 */
var tungus = require('tungus'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;


var optionsSchema = new Schema({
    title:                      String,
    purchase_url:               String,
    price:                      Number,
    formatted_price:            String,
    original_price:             Number,
    formatted_original_price:   String,
    is_quantity_limited:        Boolean,
    remaining_count:            Number
});

var dealsSchema = new Schema({
    id:                         String,
    title:                      String,
    url:                        String,
    image_url:                  String,
    currency_code:              String,
    time_start:                 Number,
    time_end:                   Number,
    is_popular:                 Boolean,
    what_you_get:               String,
    important_restrictions:     String,
    additional_restrictions:    String,
    "options":                    [optionsSchema]
});


var giftCertificatesOptionsSchema = new Schema({
    price:                  Number,
    formatted_price:        String
});

var giftCertificatesSchema = new Schema({
    id:                         String,
    url:                        String,
    image_url:                  String,
    currency_code:              String,
    unused_balances:            String,
    "options":                    [giftCertificatesOptionsSchema]
});

var reviewsSchema = new Schema({
    id:                             String,
    rating:                         Number,
    ratting_image_url:              String,
    ratting_image_small_url:        String,
    excerpt:                        String,
    time_created:                   Number,
    user: {
        id:             String,
        image_url:      String,
        name:           String
    }
});

var placesSchema = new Schema({
    id:                         {type: String, index: { unique: true, dropDups: true }},
    is_claimed:                 Boolean,
    is_closed:                  Boolean,
    name:                       String,
    image_url:                  String,
    url:                        String,
    mobile_url:                 String,
    phone:                      String,
    disply_phone:               String,
    review_count:               Number,
    categories:                 [],
    distance:                   Number,
    rating:                     Number,
    rating_img_url:             String,
    rating_img_url_small:       String,
    rating_img_url_large:       String,
    snippet_text:               String,
    snippet_image_url:          String,
    location:                   {
        address:            [],
        display_address:    [],
        city:               String,
        state_code:         String,
        postal_code:        String,
        country_code:       String,
        cross_streets:      String,
        neighborhoods:      []
    },
    deals:                      [dealsSchema],
    gift_certificates:          [giftCertificatesSchema],
    menu_provider:              String,
    menu_date_updated:          Number,
    reservation_url:            String,
    eat24_url:                  String,
    reviews:                    [reviewsSchema]
});

model.savePlaces = function(placesBag){
    var Places = mongoose.model('places', placesSchema);
    console.log('Saving Places');
    placesBag.forEach(function(value,index,ar){
        Places.create(value,function(err){
            if(err) console.log(err);
        });
    });

    /*Places.collection.insert(placesBag, function(error,docs){
        if (err) {
            // TODO: handle error
        } else {
            console.info('%d places were successfully stored.', docs.length);
        }
    });*/
};