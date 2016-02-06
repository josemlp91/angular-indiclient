/**
* Master Controller
*/

angular.module('RDash')

.controller('ModalNewConecctionCtrl', ['$scope', '$uibModalInstance', ModalNewConecctionCtrl])
.controller('MasterCtrl', ['$scope', '$cookieStore', '$uibModal','IndiService', MasterCtrl])
.factory('IndiService', function($websocket) {

  var service = {};

  // Función de espera del turno para enviar datos.
  var waitForConnection = function (callback, interval) {
    if (service.ws.readyState === 1) {
      callback();
    } else {
      var that = this;
      setTimeout(function () {
        waitForConnection(callback, interval);
      }, interval);
    }
  };


  service.connect = function(host,port) {
    if(service.ws) { return; }

    var ws = new WebSocket("ws://" + host +":" + port, ['binary', 'base64']);

    ws.onopen = function() {
      console.log("Succeeded to open a connection");

    };

    ws.onerror = function() {
      console.log("Failed to open a connection");

    }

    ws.onmessage = function(message) {
      console.log(message);
    };

    service.ws = ws;

  }

  service.status=function(){
    var status=service.ws;
  }

  service.send = function(message) {
    waitForConnection(function () {
      service.ws.send(message);
      if (typeof callback !== 'undefined') {
        callback();
      }
    }, 1000);
  }

  return service;
});


function MasterCtrl($scope, $cookieStore, $uibModal, IndiService) {

  $scope.indi_connect = function(host,port) {
    IndiService.connect(host,port);
  }

  $scope.indi_init = function() {
    IndiService.send("<getProperties version=\"1.7\"/>");
  }

  $scope.indi_status = function() {
    IndiService.status();
  }


  /////////////////////////////////// TEST //////////////////////////////////
  $scope.indi_connect("localhost", "9999");
  $scope.indi_init();
  /////////////////////////////////// TEST //////////////////////////////////

  var mobileView = 992;

  $scope.getWidth = function() {
    return window.innerWidth;
  };

  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    if (newValue >= mobileView) {
      if (angular.isDefined($cookieStore.get('toggle'))) {
        $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
      } else {
        $scope.toggle = true;
      }
    } else {
      $scope.toggle = false;
    }

  });

  $scope.toggleSidebar = function() {
    $scope.toggle = !$scope.toggle;
    $cookieStore.put('toggle', $scope.toggle);
  };

  window.onresize = function() {
    $scope.$apply();
  };


  $scope.animationsEnabled = true;

  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'open_connection_modal.html',
      controller: 'ModalNewConecctionCtrl',
      size: size,
      resolve: {
        connection_param: function () {
          var connection_param={"name" : $scope.connection_name,
          "ip" : $scope.connection_server_ip,
          "port" : $scope.connection_server_port,
          "status": false
        };

        return $scope.connection_param;
      }
    }

  });


  modalInstance.result.then(function (connection_param) {

    console.log($scope.connection);
    $scope.connection = connection_param;

    $scope.indi_connect(connection_param.ip, connection_param.port);
    $scope.indi_init();

  });
};

$scope.toggleAnimation = function () {
  $scope.animationsEnabled = !$scope.animationsEnabled;
};

}

// Controlador de la ventana modal de conexiones.
function ModalNewConecctionCtrl ($scope, $uibModalInstance) {

  $scope.ok = function () {
    console.log($scope.connection_name);
    console.log($scope.connection_server_ip);
    console.log($scope.connection_server_ip);

    var connection_param={"name" : $scope.connection_name,
    "ip" : $scope.connection_server_ip,
    "port" : $scope.connection_server_port,
    "status": false
  };

  $uibModalInstance.close(connection_param);

};

$scope.cancel = function () {
  console.log("salir");
  $uibModalInstance.dismiss('cancel');
};
};

////////////////////////////////////////////////////////////////////////////////
