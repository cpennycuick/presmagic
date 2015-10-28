define(['app/ccli/ccliconverter'], function (CCLISong) {
    
    /**
     * Contains functionality to deal with the SongSelect website programatically
     * 1. login/logout
     * 2. Search for songs
     * 3. Preview lyrics
     * 4. Download a usr file 
     */

	const SONG_SELECT_DOMAIN = "https://au.songselect.com/";
	
	/*
	 * Returns a promise object which resolves when logged in successfully, or rejects when there is any failure to log in
	 * Resolve will pass the parameter 'OrganizationName' through
	 */
	songSelectLogin = function (username, password) {
		
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
						var responseURL = xhr.responseURL;
						var $responseHTML = $(xhr.responseText);
						var verificationKey = $responseHTML.find("[name='__RequestVerificationToken']").val();					
						var data = new FormData();
						data.append("__RequestVerificationToken", verificationKey);
						data.append("ReturnUrl", "");
						data.append("UserName", username);
						data.append("Password", password);
						data.append("RememberMe", "false");					
						var loginRequest = new XMLHttpRequest();
						loginRequest.onload = function() {
							if (loginRequest.readyState == 4 && loginRequest.status == 200) {
								if(loginRequest.responseText.indexOf("Please enter a valid username/password") == -1) {								
									var $loggedInHtml = $(loginRequest.responseText);			
									var organizationName = $loggedInHtml.find("[class='organization']").text();
									resolve(organizationName);
									return organizationName; //Logged in successfully
								} else {
									reject(Error("Invalid username/password"));
								}							
							} else {
								reject(Error("Unable to contact SongSelect server"));
							}
						};
						loginRequest.open("POST", responseURL, true);
						loginRequest.send(data);
				 } else {
					 reject(Error("Unable to contact SongSelect server"));
				 }
			};
			xhr.open("GET", SONG_SELECT_DOMAIN + "account/login", true);
			xhr.send();
		});
	};
	
	songSelectLogout = function() {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log("Logged out");
					resolve("Logged out!");
				} else {
					reject(Error("Couldn't log out..."));
				}
			};
			xhr.open("GET", SONG_SELECT_DOMAIN + "account/logout", true);
			xhr.send();
		});

	};
	
	/**
	 * 
	 * @param searchTerms the terms to search song select for
	 * @param pageNumber page number of results you want returned
	 * 
	 * Note, will return a promise - if resolved, the promise passed through an array containing the results
	 */
	songSelectSearch = function(searchTerm, pageNumber) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();
			request.onload = function() {
				if(request.readyState == 4 && request.status == 200) {
					var $HTMLResults = $(request.responseText);
					if(!loggedIn($HTMLResults)) {
						reject("loggedout");
						return;
					}
					var $resultTable = $HTMLResults.find("[class='song-listing']").children("tbody").find("tr");
					var songSearchResults = [];
					for(var i = 0; i < $resultTable.length; i++) {
						var $thisResult = $($resultTable[i]);
						var name = $thisResult.find("a").first().text();
						var location = $thisResult.find("[class='lyrics icon']").find("a").attr('href');
						var authors = [];
						$thisAuthors = $thisResult.find("[class='authors']").find("li");
						
						for(var j = 0; j < $thisAuthors.length; j++) {
							authors[j] = $($thisAuthors[j]).text();
						}
						
						var catalogs = [];
						$thisCatalogs = $thisResult.find("[class='catalogs']").find("li");
						for(var k = 0; k < $thisCatalogs.length; k++) {
							catalogs[k] = $($thisCatalogs[k]).text();
						}
						songSearchResults[i] = new SongSearchResult(name, authors, catalogs, location);

					}
					resolve(songSearchResults);					
				} else {
					reject(Error("Couldn't load results"));
				}
			};
			
			request.onerror = function(error) {
				console.log('errorrr');
				reject(error);
			};
			
			request.open("GET", SONG_SELECT_DOMAIN + "search/results?SearchTerm=" + searchTerm + "&Page=" + pageNumber);
			request.send(); 
		});
	};
	
	/**
	 * Pass this function a page from songselect, returns true if logged in, false if not
	 */
	loggedIn = function($page) {
		return $page.find(".organization").length > 0;
		
	};

	
	SongSearchResult = function(name, authors, catalogs, location) {
		this._name = name;
		this._authors = authors;
		this._catalogs = catalogs;
		this._location = location;
	};
	
	SongSearchResult.prototype.getName = function() {
		return this._name || "";
	};
	
	SongSearchResult.prototype.getAuthors = function() {
		return this._authors || [];
	};
	
	SongSearchResult.prototype.getCatalogs = function() {
		return this._catalogs || [];
	};
	
	
	SongSearchResult.prototype.getLocation = function() {
		return this._location || "";
	};

	SongSearchResult.prototype.import = function() {
	    var self = this;
	    
	    return new Promise(function(resolve, reject) {

		var path = SONG_SELECT_DOMAIN + self._location.replace("viewlyrics", "lyrics/downloadusr");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', path, true);
		xhr.onload = function() {
		    if (this.status == 200) {
			resolve(CCLISong.prototype.getCCLISong(xhr.responseText));			 
		    } else {
			reject(Error("connection"));
		    }
		};
		xhr.send();

	    });

	};

	SongSearchResult.prototype.previewLyrics = function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			var path = SONG_SELECT_DOMAIN + self._location;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', path, true);
			xhr.onload = function() {
			  if (this.status == 200) {
				  $response = $(xhr.responseText);
				  if(loggedIn($response)) {
					  $lyrics = $response.find('.lyrics');
					  resolve($lyrics);
				  } else {
					  reject("loggedout");
				  }

			  } else {
				  reject("connection");
			  }
			};
			xhr.onerror = function() {
				reject("connection");
			};
			xhr.send();
		});
	};
	
});
