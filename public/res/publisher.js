define([
	"jquery",
	"underscore",
	"constants",
	"utils",
	"storage",
	"settings",
	"eventMgr",
	"fileSystem",
	"fileMgr",
	"classes/Provider",
	"classes/AsyncTask",
], function($, _, constants, utils, storage, settings, eventMgr, fileSystem, fileMgr, Provider, AsyncTask) {

	var publisher = {};

	// Apply template to the current document
	publisher.applyTemplate = function(fileDesc, publishAttributes, html) {
		try {
			var template = (publishAttributes && publishAttributes.customTmpl) || settings.template;
			return _.template(template, {
				documentTitle: fileDesc.title,
				documentMarkdown: fileDesc.content,
				strippedDocumentMarkdown: fileDesc.content.substring(fileDesc.frontMatter ? fileDesc.frontMatter._frontMatter.length : 0),
				documentHTML: html.withoutComments,
				documentHTMLWithFrontMatter: (fileDesc.frontMatter ? fileDesc.frontMatter._frontMatter : '') + html.withoutComments,
				documentHTMLWithComments: html.withComments,
				frontMatter: fileDesc.frontMatter,
				publishAttributes: publishAttributes
			});
		}
		catch(e) {
			eventMgr.onError(e);
			return e.message;
		}
	};

	// Get the html from the onPreviewFinished callback
	var currentHTML;
	eventMgr.addListener("onPreviewFinished", function(htmlWithComments, htmlWithoutComments) {
		currentHTML = {
			withComments: htmlWithComments,
			withoutComments: htmlWithoutComments
		};
	});

	// Listen to offline status changes
	var isOffline = false;
	eventMgr.addListener("onOfflineChanged", function(isOfflineParam) {
		isOffline = isOfflineParam;
	});

	eventMgr.addListener("onReady", function() {

		// Save As menu items
		$(".action-download-md").click(function() {
			var content = fileMgr.currentFile.content;
			var title = fileMgr.currentFile.title;
			utils.saveAs(content, title + ".md");
		});
		$(".action-download-html").click(function() {
			var title = fileMgr.currentFile.title;
			utils.saveAs(currentHTML.withoutComments, title + ".html");
		});
		$(".action-download-template").click(function() {
			var fileDesc = fileMgr.currentFile;
			var content = publisher.applyTemplate(fileDesc, undefined, currentHTML);
			utils.saveAs(content, fileDesc.title + (settings.template.indexOf("documentHTML") === -1 ? ".md" : ".html"));
		});
		$(".action-download-pdf").click(function() {
			var fileDesc = fileMgr.currentFile;
			var content = publisher.applyTemplate(fileDesc, {
				customTmpl: settings.pdfTemplate
			}, currentHTML);
			var task = new AsyncTask();
			var pdf, token;
			task.onRun(function() {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', constants.PDF_EXPORT_URL + '?' + $.param({
					options: settings.pdfOptions
				}), true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.responseType = 'blob';
				xhr.onreadystatechange = function() {
					if(this.readyState == 4) {
						if(this.status == 200) {
							pdf = this.response;
						}
						else {
							eventMgr.onError("Error when trying to generate PDF: " + this.statusText);
						}
						task.chain();
					}
				};
				xhr.send(content);
			});
			task.onSuccess(function() {
				pdf && utils.saveAs(pdf, fileMgr.currentFile.title + ".pdf");
			});
			task.enqueue();
		});
	});

	eventMgr.onPublisherCreated(publisher);
	return publisher;
});
