var app = angular.module('loginApp', ['angular-md5']);
app.controller('loginForm', ['$scope' ,'$http', 'md5', '$window', function($scope, $http, md5, $window) {
	$scope.submitPressed = false;
	$scope.login = function() {
		$scope.submitPressed = true;
		if($scope.loginForm.username.$error.required || $scope.loginForm.password.$error.required) {
			return;
		}
		$http
		.post("/admin/login", {
			username: $scope.username,
			password: md5.createHash($scope.password),
		})
    	.success(function(data, status, headers, config) {
    		switch(data.code) {
    			case 'B':
    				$scope.loginError = true;
    				$scope.errorInfo = "数据处理出现错误，请重试";
    				break;
    			case 'W':
    				$scope.loginError = true;
    				$scope.errorInfo = "登录信息有误，请重试";
    				break;
    			case 'R':
    				$scope.loginError = false;
    				$window.location.href = '/admin/';

    		}
    	})
    	.error(function(data, status, headers, config) {
			$scope.loginError = true;
			$scope.errorInfo = "数据处理出现错误，请重试";
    	});
	}
}]);