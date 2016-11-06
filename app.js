(function () {
  "use strict";

  angular.module('twitchAppByPJ', ['ui.router', 'twitchApiModule', 'spinLoader'])

    .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/streams');

      $stateProvider
        .state('streams', {
          url: '/streams',
          templateUrl: 'partial-streams.html'
        })

        .state('stream', {
          url: '/stream/:channel/:game',
          templateUrl: 'partial-stream.html'
        });

    })

    .controller('StreamsController', function ($http, twitchApiService) {
      var vm = this;
      vm.spinLoaderActive = true;

      vm.searchStream = function () {
        var text = (!vm.search) ? 'Fifa' : vm.search;

        twitchApiService.getStreams(text)
          .success(function (data) {
            vm.streams = data.streams;
            vm.spinLoaderActive = false;
          })
          .error(function (data) {
            alert("something went wrong, please check console");
            vm.spinLoaderActive = false;
          });
      };

      vm.searchStream();

    })

    .controller('StreamController', function ($scope, $stateParams, twitchApiService, $sce, $interval) {
      var vm = this;
      vm.channelStreamUrl = $sce.trustAsResourceUrl("http://player.twitch.tv/?channel=" + $stateParams.channel);
      vm.channelName = $stateParams.channel;
      vm.game = $stateParams.game;

      vm.spinLoaderActive = true;

      var interval = $interval(function () {
        twitchApiService.getViewersCount(vm.channelName)
          .then(function (res) {
            vm.viewersCount = res;
            vm.spinLoaderActive = false;
          },
          function (error) { vm.viewersCount = 'error getting Viewers Count' });
      }, 5000);

       $scope.$on("$destroy", function () {
         $interval.cancel(interval);
         vm = null;
        });

    });

})();