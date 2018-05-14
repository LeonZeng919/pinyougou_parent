//indexController
app.controller("indexController",function ($scope,loginService) {
    //读取登陆人信息
    $scope.showLoginName=function () {
        loginService.loginName().success(function (response) {
            $scope.loginName=response.loginName;
        })
    }
});