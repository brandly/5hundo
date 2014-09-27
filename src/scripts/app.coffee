app = angular.module '5hundo', ['youtube-embed']

app.controller 'VideoCtrl', ($scope) ->
  $scope.videoID = 'YKvCHDikwX8'
  $scope.vars = autoplay: true
  return
