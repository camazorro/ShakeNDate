/**
 * Created by camazorro on 9/12/15.
 */
var self = module.exports ={
    index: function(request,response,next){
        response.send('Categories');
    },
    register: function(server){
        server.get('/categories',self.index);
    }
};

self.__module ={
    provides:['routes/register']
}
