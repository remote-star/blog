define([], function() {
	var constants = {};
	constants.VERSION = "4.3.14";
	constants.MAIN_URL = "https://stackedit.io/";
	constants.BITLY_ACCESS_TOKEN = "317e033bfd48cf31155a68a536b1860013b09c4c";
	constants.DEFAULT_FILE_TITLE = "Title";
	constants.DEFAULT_FOLDER_NAME = "New folder";
	constants.EDITOR_DEFAULT_PADDING = 35;
	constants.CHECK_ONLINE_PERIOD = 120000;
	constants.AJAX_TIMEOUT = 30000;
	constants.ASYNC_TASK_DEFAULT_TIMEOUT = 60000;
	constants.ASYNC_TASK_LONG_TIMEOUT = 180000;
	constants.USER_IDLE_THRESHOLD = 300000;
	constants.IMPORT_FILE_MAX_CONTENT_SIZE = 100000;
	constants.IMPORT_IMG_MAX_CONTENT_SIZE = 10000000;
	constants.COUCHDB_PAGE_SIZE = 25;
	constants.TEMPORARY_FILE_INDEX = "file.tempIndex";
	constants.WELCOME_DOCUMENT_TITLE = "Hello!";
	constants.DOWNLOAD_IMPORT_URL = "/downloadImport";
	constants.PICASA_IMPORT_IMG_URL = "/picasaImportImg";
	constants.PDF_EXPORT_URL = "/pdfExport";
	constants.COUCHDB_URL = 'https://stackedit.smileupps.com/documents';

	// Site dependent
	constants.BASE_URL = "http://localhost/";
	constants.GITHUB_CLIENT_ID = 'e47fef6055344579799d';
	constants.GATEKEEPER_URL = "https://stackedit-gatekeeper-localhost.herokuapp.com/";

	constants.THEME_LIST = {
		"blue": "Blue",
		"default": "Default",
		"gray": "Gray",
		"night": "Night",
		"school": "School",
		"solarized-light": "Solarized Light",
		"solarized-dark": "Solarized Dark"
	};

	return constants;
});
