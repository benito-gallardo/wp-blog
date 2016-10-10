
module.exports = {
	prettyJSON: prettyJSON
}

//////////

/**
 * @param  {Object} obj - JSON object to make pretty 
 * @return {String} JSON object made pretty
 */
function prettyJSON(obj){
	return JSON.stringify(obj, null, 2);
}