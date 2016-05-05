var app = angular.module('postApp', []);
app.controller('postBoard', ['$scope', '$compile', function($scope, $compile) {
    $scope.input = '';
	$scope.updatePreview = function() {
		var previewDiv = angular.element($('#postPreview')),
            post = angular.element($('#postInput')).html();
        console.info(post);
        post = unescapeEntity(post);
        console.info(post);
        post = cleanTags(post);
        console.info(post);
        post = markdown.toHTML(post, 'Maruku');
        console.info(post);
        previewDiv.html(post);
        $compile(previewDiv)($scope);
	}
    var unescapeEntity = function(str) {
        var reg = /&(?:nbsp|#160|lt|#60|gt|62|amp|#38|quot|#34|cent|#162|pound|#163|yen|#165|euro|#8364|sect|#167|copy|#169|reg|#174|trade|#8482|times|#215|divide|#247);/g,
            entity = {
            '&nbsp;'   : ' ',
            '&#160;'   : ' ',
            '&lt;'     : '<',
            '&#60;'    : '<',
            '&gt;'     : '>',
            '&62;'     : '>',
            '&amp;'    : '&',
            '&#38;'    : '&',
            '&quot;'   : '"',
            '&#34;'    : '"',
            '&cent;'   : '￠',
            '&#162;'   : '￠',
            '&pound;'  : '£',
            '&#163;'   : '£',
            '&yen;'    : '¥',
            '&#165;'   : '¥',
            '&euro;'   : '€',
            '&#8364;'  : '€',
            '&sect;'   : '§',
            '&#167;'   : '§',
            '&copy;'   : '©',
            '&#169;'   : '©',
            '&reg;'    : '®',
            '&#174;'   : '®',
            '&trade;'  : '™',
            '&#8482;'  : '™',
            '&times;'  : '×',
            '&#215;'   : '×',
            '&divide;' : '÷',
            '&#247;'   : '÷'
        };
        if (str === null) {
            return '';
        }
        return str.indexOf(';') < 0 ? str : str.replace(reg, function(chars) {
            return entity[chars];
        });
    };
    var cleanTags = function(str) {
        var connected = /<br>\s*<\/[^\^<^>^(br)/]+?>/ig,
            br = /<br>/ig,
            left = /<[^\^<^>/]+?>/ig,
            right = /<\/[^\^<^>/]+?>/ig;
        if (str === null) {
            return '';
        }
        return str.replace(connected, '\n').replace(br, '\n').replace(left, '').replace(right, '\n');
    };
}]);