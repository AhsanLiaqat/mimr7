(function () {
  'use strict';

  angular.module('app')
  .controller('actionPlanCtrl', ['$q','$scope', '$filter', '$routeParams', '$http', 'AuthService', 'ModalService', '$location','filterFilter','ActionPlanService','$timeout', editFunction]);

  function editFunction($q,$scope, $filter, $routeParams, $http, AuthService, ModalService, $location,filterFilter, ActionPlanService,$timeout) {

    $scope.items = [{name: '10 items per page', val: 10},
                    {name: '20 items per page', val: 20},
                    {name: '30 items per page', val: 30},
                    {name: 'show all items', val: 30000}]
    $scope.pageItems = 10;

    var setSocketForActionPlan = function () {
      $timeout(function () {
          console.log("Socket set for action_plan:" + $scope.user.userAccountId);
          SOCKET.on('action_plan:' + $scope.user.userAccountId, function (response) {
              console.log("listening sockets....",response);
              var data = response.data;
              if(response.action == "new"){
                  console.log("incident_plan_activity new",data);
                  $scope.plans.push(data);
                  get_plans_ready();
                  $scope.plans = $scope.paginate($scope.plans);
                  toastr.success("New Plan Added.");
              }else if(response.action == "delete"){
                  console.log("incident_plan_activity delete",data);
              }else if(response.action == "update"){
                  
              }
              else {
                  toastr.error("Something went wrong!");
                  console.log("incoming_message --> does not match any action incident_plan_activity socket.",response);
              }
              $scope.$apply();
          });
      })
    }

    $scope.paginate = function(arr){
      var tableState = $scope.tableState;
      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 10;
      $scope.a = arr;
      $scope.total = arr.length;
      var filtered = tableState.search.predicateObject ? $filter('filter')($scope.a, tableState.search.predicateObject) : $scope.a;
      if (tableState.sort.predicate) {
          filtered = $filter('orderBy')(filtered, tableState.sort.predicate, tableState.sort.reverse);
      }
      var result = filtered.slice(start, start + number);
      tableState.pagination.numberOfPages = Math.ceil(filtered.length / number);
      return result;
    }
    
    var get_plans_ready = function(){
      $scope.plans = filterFilter($scope.plans, { 'active': true });
      $scope.sortByCreate = _.sortBy($scope.plans, function (o) { return new Date(o.createdAt); });
      $scope.plans = $scope.sortByCreate.reverse();
    }

    $scope.planTable = function (tableState) {
      $scope.isLoading = true;
      $scope.tableState = tableState;
      ActionPlanService.all().then(function(response){
        $scope.plans = response.data;
        get_plans_ready();
        $scope.plans = $scope.paginate($scope.plans);
        $scope.isLoading = false;
        setSocketForActionPlan();
      },function(err){
        if(err)
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
        else
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
      });
      // $http.get('/settings/action-plans/all').then(function (response) {
        
      // });
    };

    // edit modal call from wizard
    $scope.editModal = function (plan) {
      ModalService.showModal({
        templateUrl: "views/wizard/edit-action-plan-modal.html",
        controller: "editActionPlanWizardModalCtrl",
        inputs: {
          plan: plan
        }
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (result) {
          $scope.planTable($scope.tableState);
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
        });
      });
    };

    //edit action plan modal
    $scope.editNewPlan = function (planId) {
      ModalService.showModal({
        templateUrl: "views/settings/action-plans/form-modal-edit.html",
        controller: "editActionPlanModalCtrl",
        inputs: {
          planId: planId
        }
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (result) {
          $scope.planTable($scope.tableState);
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
        });
      });
    };

    $scope.dateFormat = function (dat) {
      return moment(dat).utc().local().format('HH:mm DD-MM-YYYY');
    };

    //delete action plan and soft delete if its activities exists
    $scope.delete = function (index,plan){
      var data = {};
      data.id = plan.id;
      ActionPlanService.activities(data.id).then(function(response){
        $scope.activities = response.data;
        if($scope.activities.length == 0){
          ActionPlanService.delete(data.id).then(function(res){
            toastr.success('Action Plan Deleted Successfully');
            $scope.planTable($scope.tableState)
          },function(err){
            if(err)
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
          });
          // $http.post("/settings/action-plans/delete", {data: data}).then(function(res){
            
          // });
        }else{
          var dat = {};
          dat.id = plan.id;
          dat.active = false;
          dat.isDeleted = true;
          ActionPlanService.update(dat).then(function(response){
            toastr.success('Action Plan InActivated Successfully');
            $scope.planTable($scope.tableState)
          },function(err){
            if(err)
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
            else
              toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
          });
          // $http.post('/settings/action-plans/update', { data: dat }).then(function (response) {
            
          // });
        }
      },function(err){
        if(err)
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
        else
          toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
      });
      // $http.get("/settings/action-plans/activities?actionPlanId=" + data.id).then(function (response) {
        
      // });
    };

      //print action plan things
     $scope.printPlan=function(plan){
        $scope.printPlanActivities='';
        $scope.printPlanActivities+='<h1>Plan Name: '+ plan.name+'</h1><br>'
        ActionPlanService.activities(plan.id).then(function(response){
          var loopPromises = [];
          $scope.activities = response.data;
          $scope.activities = _.sortBy($scope.activities, function (o) { return o.index });
          $scope.printPlanActivities+='<table>'
           _.each($scope.activities, function (activity,ind) {
              var deferred = $q.defer();
              loopPromises.push(deferred.promise);
              if(activity.role==null || activity.responsibility_level==null){
                  activity.role='N/A';
                  activity.responsibility_level='N/A';
              }
              ind = ind + 1;
             $scope.printPlanActivities+='<tr>'
             $scope.printPlanActivities+='<td>' + ind + ' - ' + activity.title +'</td>'
             $scope.printPlanActivities+='</tr>'
             $scope.printPlanActivities+='<tr>'
             $scope.printPlanActivities+='<td></td>'
             $scope.printPlanActivities+='<td></td>'
             $scope.printPlanActivities+='</tr>'

             setTimeout(function () {
                   deferred.resolve();
                   console.log('long-running operation inside loop done');
                }, 2000);
           });
           $scope.printPlanActivities+='</table>'

           $q.all(loopPromises).then(function () {
                var printContents=$scope.printPlanActivities;
                var popupWin = window.open('', '_blank', 'width=1000,height=800');
                if(popupWin){
                  popupWin.document.open();
                  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                  popupWin.document.close();
                }
          });
        },function(err){
          if(err)
            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Error')
          else
            toastr.error(AppConstant.GENERAL_ERROR_MSG,'Custom Error')
        });
        // $http.get("/settings/action-plans/activities?actionPlanId=" + plan.id)
        //                 .then(function (response) {
          
        // });
   }

    $scope.clonePlan = function (plan) {
      ModalService.showModal({
        templateUrl: "views/settings/action-plans/clone-modal.html",
        controller: "clonePlanModalCtrl",
        inputs: {
          plan: plan
        }
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (result) {
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          if (result) {
            $scope.plans.unshift(result);
            toastr.success('Plan copied', 'Success');
          }
        });
      });
    };

    // show action plan
    $scope.viewPlan = function(planId) {
      ModalService.showModal({
        templateUrl: "views/settings/action-plans/view.html",
        controller: "viewActionPlanModalCtrl",
        inputs: {
          planId: planId
        }
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (response) {

          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
        });
      });
    };

    $scope.createSectionPlan = function () {
      ModalService.showModal({
        templateUrl: "views/wizard/new-section-plan-modal.html",
        controller: "newSectionPlanModalCtrl"
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (result) {
          if (result) {
            $scope.plans.unshift(result);
          }
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
        });
      });
    };

    $scope.createNewActionPlan = function () {
      ModalService.showModal({
        templateUrl: "views/settings/action-plans/form-modal-add.html",
        controller: "newActionPlanModalCtrl",
        inputs: {
          planId: null
        }
      }).then(function (modal) {
        modal.element.modal({ backdrop: 'static', keyboard: false });
        modal.close.then(function (result) {
          if (result) {
            $scope.plans.unshift(result);
          }
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
        });
      });
    };
  }
}());
