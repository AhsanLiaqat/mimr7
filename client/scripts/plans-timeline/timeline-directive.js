(function () {

angular.module('app').directive('myDirective', [yoo]);


     function yoo() {

  var controller = ['$scope', function($scope) {
    var me = this;

  }];
  //define the directive object
  var directive = {};
  directive.controller = controller;
  directive.restrict = 'A';//restrict to attribute
  directive.controllerAs = 'cus';
  directive.link = function(scope, element, attrs) {
     var testData = [
        {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
        {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
        {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]}
      ];

       var chart = d3.timeline();
        var svg = d3.select("#chart").append("svg").attr("width", "500")
          .datum(testData).call(chart);
  }
  return directive;
};

}());