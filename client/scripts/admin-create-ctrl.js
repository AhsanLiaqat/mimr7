(function () {
  'use strict';

  angular.module('app')
  .controller('adminCreateCtrl', ['$scope', '$location', '$routeParams', '$http', 'AuthService','AccountService','ColorPaletteService','CustomMessageService', ctrlFunction]);

  function ctrlFunction($scope, $location, $routeParams, $http, AuthService, AccountService, ColorPaletteService, CustomMessageService) {

    function init() {
      $scope.validationOptions = {
        rules: {
          name: {
            required: true
          }
        }
      }
      if($routeParams.id !== undefined) {
       $scope.edit = true;
       AccountService.get($routeParams.id).then(function(response){
        $scope.account = response.data;

        $scope.name = $scope.account.organizationName;
      },function(err){
        if(err)
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
        else
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
      });
      //  var path  = '/settings/accounts/get?id=' + $routeParams.id;
      //  $http.get(path).then(function(response) {
        
      // });
      AccountService.getAdmin($routeParams.id).then(function(response){
        console.log(response)
        $scope.user = response.data;
        $scope.pass = $scope.user.password;
        delete $scope.user.password;
        $scope.usertocreate = $scope.user;
      },function(err){
        if(err)
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
        else
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
      });
      //  var path2 = '/settings/accounts/get-admin?id=' + $routeParams.id;
      //  $http.get(path2).then(function(response) {
        
      // });

     }
   }
   $scope.callback = function (selectedCountryObj) {
    $scope.num_str = selectedCountryObj.code;
    console.log($scope.num_str);
  };

  $scope.submit = function(name, user, form) {
    var user = angular.copy(user);
    if($scope.pass && user.password == undefined){
      user.password = $scope.pass;
    }
    console.log('form is ',user)
    if(user.password != undefined){
      if (form.validate()){
        if($routeParams.id !== undefined) {
          $scope.data = {};
          $scope.data.email = user.email
          $scope.data.id = user.id
          $scope.account.organizationName = name;
          $http.post('users/CheckEmail',{data:$scope.data}).then(function(res) {
            if(res.data.length > 0){
              toastr.error('User Aleardy Exist with Email provided!');
            }
            else{
              AccountService.update($scope.account).then(function(response){
                user.countryCode = $scope.num_str;
                user.userAccountId = response.data.id;
                if(user.password){
                  user.current_pass = $scope.pass;
                  user.new_pass = user.password;
                }
                delete user.password;
                $http.post('/users/update', {data: user}).then(function(response) {
                  $location.path('/superadmin');
                  toastr.success("Account updated successfully");
                });
              },function(err){
                if(err)
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
              });
              // $http.post('/settings/accounts/update', {data: $scope.account}).then(function(response) {
                
              // });
            }
          });
        }
        else {
          $scope.data = {};
          $scope.data.email = user.email;
          $http.post('users/One',{data:$scope.data}).then(function(res) {
            if(res.data.id){
              toastr.error('User Aleardy Exist with Email provided!');
            }else{
              user.role = 'admin';
              var data = {};
              data.organizationName = name;
              AccountService.checkName(data).then(function(res){
                if(res.data.id){
                  toastr.error('Organization Aleardy Exist with Name provided!');
                }else{
                  AccountService.save(data).then(function(response){
                    user.countryCode = $scope.num_str;
                    user.userAccountId = response.data.id;
                    user.id = undefined;

                    $http.post('/users/create2', {data: user}).then(function(response) {
                      $scope.createDefaultTemplates(user.userAccountId);
                      $scope.createDefaultColorPalettes(user.userAccountId);
                      if(response.data){
                        $scope.user = response.data;
                      }
                      $location.path('/superadmin');
                      toastr.success("Account created successfully");
                    });
                  },function(err){
                    if(err)
                      toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                    else
                      toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
                  });
                  // $http.post('/settings/accounts/save', {data: data}).then(function(response) {
                    
                  // });
                }
              },function(err){
                if(err)
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
                else
                  toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
              });

              // $http.post('/settings/accounts/check-name',{data:data}).then(function(res) {
                
              // })

            }

          });
        }
      }
    }
    else{
      toastr.error('Please Provide password in correct format');
    }
  }

  $scope.createDefaultTemplates = function(id){
    CustomMessageService.defaultTemplates(id).then(function(response){

    },function(err){
      if(err)
        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
      else
        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
    });
    // $http.get('/settings/custom-messages/default-templates?userAccountId='+id).then(function(response) {
    // });
  };

  $scope.createDefaultColorPalettes = function(id){
    ColorPaletteService.defaultColors(id).then(function(response){

    },function(err){
      if(err)
        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
      else
        toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
    });
    // $http.post('/settings/color-palettes/default-colors?userAccountId='+id).then(function(response) {
    // });
  };







  init();

}

}());
