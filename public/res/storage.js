// Setup an empty localStorage or upgrade an existing one
define([
    "underscore"
], function(_) {

    function retrieveIndexArray(storeIndex) {
        try {
            return _.compact(localStorage[storeIndex].split(";"));
        }
        catch(e) {
            localStorage[storeIndex] = ";";
            return [];
        }
    }

    var fileIndexList = retrieveIndexArray("file.list");
    var currentFileIndex, settings;

    // localStorage versioning
    var version = localStorage.version;

    if(version === undefined) {

        // Not used anymore
        localStorage.removeItem("sync.queue");
        localStorage.removeItem("sync.current");
        localStorage.removeItem("file.counter");

        _.each(fileIndexList, function(fileIndex) {
            localStorage[fileIndex + ".publish"] = ";";
            var syncIndexList = retrieveIndexArray(fileIndex + ".sync");
            _.each(syncIndexList, function(syncIndex) {
                localStorage[syncIndex + ".contentCRC"] = "0";
                // We store title CRC only for Google Drive synchronization
                if(localStorage[syncIndex + ".etag"] !== undefined) {
                    localStorage[syncIndex + ".titleCRC"] = "0";
                }
            });
        });
        version = "v1";
    }

    if(version == "v1") {
        _.each(fileIndexList, function(fileIndex) {
            var syncIndexList = retrieveIndexArray(fileIndex + ".sync");
            _.each(syncIndexList, function(syncIndex) {
                var syncAttributes = {};
                localStorage[syncIndex] = JSON.stringify(syncAttributes);
                localStorage.removeItem(syncIndex + ".etag");
                localStorage.removeItem(syncIndex + ".version");
                localStorage.removeItem(syncIndex + ".contentCRC");
                localStorage.removeItem(syncIndex + ".titleCRC");
            });
        });
        version = "v2";
    }

    if(version == "v2") {
        _.each(fileIndexList, function(fileIndex) {
            if(!_.has(localStorage, fileIndex + ".sync")) {
                localStorage.removeItem(fileIndex + ".title");
                localStorage.removeItem(fileIndex + ".publish");
                localStorage.removeItem(fileIndex + ".content");
                localStorage["file.list"].replace(";" + fileIndex + ";", ";");
            }
        });
        version = "v3";
    }

    if(version == "v3") {
        currentFileIndex = localStorage["file.current"];
        if(currentFileIndex !== undefined && localStorage["file.list"].indexOf(";" + currentFileIndex + ";") === -1) {
            localStorage.removeItem("file.current");
        }
        version = "v4";
    }

    if(version == "v4") {
        version = "v5";
    }

    if(version == "v5") {
        _.each(fileIndexList, function(fileIndex) {
            var publishIndexList = retrieveIndexArray(fileIndex + ".publish");
            _.each(publishIndexList, function(publishIndex) {
                var publishAttributes = JSON.parse(localStorage[publishIndex]);
            });
        });
        version = "v6";
    }

    if(version == "v6") {
        currentFileIndex = localStorage["file.current"];
        if(currentFileIndex !== undefined) {
            localStorage[currentFileIndex + ".selectTime"] = new Date().getTime();
            localStorage.removeItem("file.current");
        }
        version = "v7";
    }

    if(version == "v7" || version == "v8" || version == "v9") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            delete settings.editorFontFamily;
            delete settings.editorFontSize;
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v10";
    }

    if(version == "v10") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            ((settings.extensionSettings || {}).markdownExtra || {}).extensions && settings.extensionSettings.markdownExtra.extensions.push('smartypants');
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v11";
    }

    if(version == "v11") {
        // Force new theme by using themeV3 variable
        localStorage.removeItem("theme");
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            // Force new font
            delete settings.editorFontFamily;
            delete settings.editorFontSize;
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v12";
    }

    if(version == "v12" || version == "v13") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            // Have to reset the font because of Monaco issue with ACE
            delete settings.editorFontFamily;
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v14";
    }

    if(version == "v14") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v15";
    }

    if(version == "v15") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            if(((settings.extensionSettings || {}).markdownExtra || {}).extensions) {
                settings.extensionSettings.markdownExtra.extensions.push('newlines');
                settings.extensionSettings.markdownExtra.extensions.push('strikethrough');
            }
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v16";
    }

    if(version == "v16" || version == "v17") {
        localStorage.removeItem('focusMode');
        localStorage.removeItem('mode');
        localStorage.removeItem('google.picasa0.permissions');
        localStorage.removeItem('google.picasa0.userId');
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            delete settings.shortcuts;
            delete settings.editorFontFamily;
            delete settings.editorFontSize;
            delete settings.maxWidth;
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v18";
    }

	if(version == 'v18') {
		if(_.has(localStorage, 'settings')) {
			settings = JSON.parse(localStorage.settings);
			((settings.extensionSettings || {}).markdownExtra || {}).diagrams = true;
			localStorage.settings = JSON.stringify(settings);
		}
		version = "v19";
	}

	if(version == 'v19') {
		// Force new theme by using themeV4 variable
		localStorage.removeItem("themeV3");
		if(_.has(localStorage, 'settings')) {
			settings = JSON.parse(localStorage.settings);
			// New web services
			localStorage.settings = JSON.stringify(settings);
		}
		version = "v20";
	}

	if(version == 'v20') {
		if(_.has(localStorage, 'settings')) {
			settings = JSON.parse(localStorage.settings);
			// Force use of text/plain
			delete settings.markdownMimeType;
			localStorage.settings = JSON.stringify(settings);
		}
		version = "v21";
	}

    if(version == "v21") {
        if(_.has(localStorage, 'settings')) {
            settings = JSON.parse(localStorage.settings);
            localStorage.settings = JSON.stringify(settings);
        }
        version = "v22";
    }

	if(version == "v22") {
		if(_.has(localStorage, 'settings')) {
			settings = JSON.parse(localStorage.settings);
			settings.couchdbUrl && (settings.couchdbUrl = settings.couchdbUrl.replace('https://stackedit.couchappy.com/documents', 'https://stackedit.smileupps.com/documents'));
			localStorage.settings = JSON.stringify(settings);
		}
		version = "v23";
	}

	localStorage.version = version;
    return localStorage;
});
