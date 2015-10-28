/**
 * @author Adam
 * @classDescription Loads and parses CCLI SongSelect files (.usr extension)
 */

define(function () {

	/**
	 * CCLISong class
	 * Contains all of the data for a USR format song, as well as related getter mechanisms
	 * Getters are defined within the constructor rather than the object prototype for
	 *   a) Clarity
	 *   b) Very few CCLISong instances will be used, so the extra overhead of redefining the 
	 *   contained functions is negligible.
	 *   
	 *   Should this be in its own file? Probably
	 */
	function CCLISong (hashmap) {
		this._hashmap = hashmap;
		/**
		 * @returns an attribute of the songhash when given its corresponding key
		 * @key - the key to use. Format is per the .usr file specification
		 * @splitter - if supplied, splits the returned attribute to an array at the given regxp
		 * 
		 * For use by the CCLISong object only (private scope)
		 */
		this.getAttributeByKey = function(key, splitter) {			
			var attribute = this._hashmap[key];
			if(attribute !== undefined){
				if(arguments.length === 1) {
					return attribute;
				} else {
					return attribute.split(splitter);
				}				
			}
			return[];
			//throw new Error("Key: " + key + "not found");	
		};
		
		
		this.getTitle = function() {
			return this.getAttributeByKey("Title");
		};
		
		this.getFields = function() {
			return this.getAttributeByKey("Fields", "/t");
		};
		
		//returns a hashmap key = fieldName, data = [] of word lines
		this.getWords = function() {
			var fields = this.getFields();
			var fieldContents = this.getAttributeByKey("Words", "/t");
			var result = [];
			for(var i = 0; i < fields.length; i++) {
				result[fields[i]] = fieldContents[i].split("/n");
			}
			return result;
		};
		
		this.getCCLINumber = function() {
			return this.getAttributeByKey("CCLI");
		};					
		
		this.getCopyright = function() {
			return this.getAttributeByKey("Copyright", "|");
		};
		
		this.getThemes = function() {
			return this.getAttributeByKey("Themes", "/t");
		};
		
		this.getAdmin = function() {
			return this.getAttributeByKey("Themes", "/t");
		};
		
		this.getSongKeys = function() {
			return this.getAttributeByKey("Keys", "/t");
		};				
	}
	
	//returns a CCLISong object parsed from the given string
	//TODO: Take this out of the global namespace
	CCLISong.prototype.getCCLISong = function(filetext) {
		if(filetext === "") return false;
		
		var keyRegexp = /([A-Za-z]+)=(.*)/,
		ccliRegexp = /\[.*\]/,
		strings = filetext.split("\n"),
		songhash = {},
		counter = 0,
		match = null;
		
		for(counter; counter < strings.length; counter++) {
			match = keyRegexp.exec(strings[counter]);
			if(match !== null) {
				songhash[match[1]] = match[2];
			} else {
				//try matching with the CCLI tag
				match = ccliRegexp.exec(strings[counter]);
				if(match !== null) {
					songhash.CCLI = match[0];
				}
			}
		}
		return new CCLISong(songhash);
	};
	
	return CCLISong;
});