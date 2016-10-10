var request = require('request'),
		Q = require('q');

module.exports = {
	getPosts: getPosts
}

//////////

/**
 * Retrieves posts from wordpress
 * 
 * @param  {Function} callback - Method to be run after posts are retrieved.
 * @return {Promise} A promise containing the posts as a json object.
 */
function getPosts(url){
	var deferred = Q.defer();

  options = {
    url: url,
    headers: {
    	'Accept': 'application/json'
    }
  } 

  request(options, function(err, resp, body){
    if(err){
      deferred.reject(new Error(err));
    }else if(resp.statusCode !== 200){
      deferred.reject(JSON.parse(body));
    }else{
      deferred.resolve(JSON.parse(body));
      
    }
	});

	return deferred.promise;
}
