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
		var hashmap = hashmap;
		/**
		 * @returns an attribute of the songhash when given its corresponding key
		 * @key - the key to use. Format is per the .usr file specification
		 * @splitter - if supplied, splits the returned attribute to an array at the given regxp
		 * 
		 * For use by the CCLISong object only (private scope)
		 */
		var getAttributeByKey = function(key, splitter) {			
			var attribute = hashmap[key];
			if(attribute !== undefined){
				if(arguments.length === 1) {
					return attribute;
				} else {
					return attribute.split(splitter);
				}				
			}
			return[];
			//throw new Error("Key: " + key + "not found");	
		}
		
		
		this.getTitle = function() {
			return getAttributeByKey("Title");
		}
		
		this.getFields = function() {
			return getAttributeByKey("Fields", "/t");
		}
		
		//returns a hashmap key = fieldName, data = [] of word lines
		this.getWords = function() {
			var fields = this.getFields();
			var fieldContents = getAttributeByKey("Words", "/t");
			var result = [];
			console.log(fields.length + ", " + fieldContents.length)
			for(var i = 0; i < fields.length; i++) {
				result[fields[i]] = fieldContents[i].split("/n");
			}
			return result;
		}
		
		this.getCCLINumber = function() {
			return getAttributeByKey("CCLI");
		}					
		
		this.getCopyright = function() {
			return getAttributeByKey("Copyright", "|");
		}
		
		this.getThemes = function() {
			return getAttributeByKey("Themes", "/t");
		}
		
		this.getAdmin = function() {
			return getAttributeByKey("Themes", "/t");
		}
		
		this.getSongKeys = function() {
			return getAttributeByKey("Keys", "/t");
		}				
	};
	
	//returns a CCLISong object parsed from the given string
	getCCLISong = function(filetext) {
		if(filetext === "") return false;
		
		var keyRegexp = /([A-Za-z]+)=(.*)/,
		ccliRegexp = /\[.*\]/,
		strings = filetext.split("\n"),
		songhash = {},
		counter = 0,
		match = null;
		
		for(counter; counter < strings.length; counter++) {
			match = keyRegexp.exec(strings[counter]);
			if(match != null) {
				songhash[match[1]] = match[2];
			} else {
				//try matching with the CCLI tag
				match = ccliRegexp.exec(strings[counter]);
				if(match != null) {
					songhash['CCLI'] = match[0];
				}
			}
		}
		return new CCLISong(songhash);
	}

	//For now, lets just use a string of the usr format to test
	/*
	var fileText1 = "Title=First Song\nCopyright=2011 Said And Done Music | sixsteps Music | Thankyou Music | worshiptogether.com songs | SHOUT! Music Publishing (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) |" 
		+ "\n" + "Admin=SHOUT! Music Publishing/tCrossroad Distributors Pty. Ltd.\n" +
	"Themes=Adoration/tBlessing/tChristian Life/tPraise\n" + 
	"Keys=G\n" +
	"Fields=Verse 1/tVerse 2/tChorus 1/tVerse 3/tMisc 1\n[S A6016351]";
	
	var fileText2 = "Title=Second Song\nCopyright=5431 Said And Done Music | sevensteps Music | Thankyou Music | worshiptogether.com songs | SHOUT! Music Publishing (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) | (Admin. by Crossroad Distributors Pty. Ltd.) |" 
		+ "\n" + "Admin=CRY! Music Publishing/tCrossroad Distributors Pty. Ltd.\n" +
	"Themes=Singing/tHappy/tJoy joy/tcode\n" + 
	"Keys=A/tB\n" +
	"Fields=Verse 1/tVerse 2/tChorus 1/tVerse 3/tMisc 1/tBridge\n[S B1234567]";
	
	//test
	app.CCLIConverter.test = function() {
		var s1 = app.CCLIConverter.getSong(fileText1);
		var s2 = app.CCLIConverter.getSong(fileText2);
		
		console.log("Song 1: "+ s1.getTitle());
		var fields1 = s1.getFields();
		for(var c = 0; c < fields1.length; c++) {
			console.log(fields1[c]);
		}
		console.log("Song 2: "+ s2.getTitle());
		var fields2 = s2.getFields();
		for(c = 0; c < fields2.length; c++) {
			console.log(fields2[c]);
		}
	}
	*/
	
	/*Mechanism for converting to whatever our standard format is pseudocode
	
//	 * app.CCLIConverter.convertCCLI = function(cclisong) {
	 *   return new StandardSong(cclisong.getName(), cclisong.getFields(), cclisong.getVerses(), cclisong.getCCLI());
	 * }
	 */
	
	return app.CCLIConverter;
});