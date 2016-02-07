/**
* Master Controller
*/

angular.module('RDash')

.controller('ModalNewConecctionCtrl', ['$scope', '$uibModalInstance', ModalNewConecctionCtrl])
.controller('MasterCtrl', ['$scope', '$cookieStore', '$uibModal','IndiService', MasterCtrl])
.factory('IndiService', function($websocket,$rootScope) {

   var messages = [];
   var status;
   var service = { messages: messages, status:status};




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

// Conversion between UTF-8 ArrayBuffer and String
  var  uintToString = function(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
       decodedString = decodeURIComponent(escape(encodedString));
   return decodedString;
};

var xml2json =function(xml) {
  var x2js = new X2JS();
  var json = x2js.xml_str2json( xml );
  return json;
};



  service.connect = function(host,port) {
    if(service.ws) { return; }

    var ws = new WebSocket("ws://" + host +":" + port, ['binary', 'base64']);

    ws.onopen = function() {
      service.status=true;
      console.log("Succeeded to open a connection");

    };

    ws.onerror = function() {
      service.status=false;
      console.log("Failed to open a connection");

    }

    ws.onmessage = function(message) {
      var utf8_array;
      var xml;
      var json;
      var fr = new FileReader();

      // Mostramos cuerpo de larespuesta en bruto.
      console.log((message));

      fr.onload = function (e) {
        // Convertimos blob en utf8 array
        utf8_array=(new Uint8Array(e.target.result));
        // Convertimos utf8 array en string
        xml=uintToString(utf8_array);

        service.xml=xml;

         service.messages.push(xml);
        //console.log(xml);


      };
      fr.readAsArrayBuffer(message.data);
    };

    service.ws = ws;

  }

  service.last_message=function(){
    console.log(_last_message)
    return _last_message;
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


function MasterCtrl($scope, $cookieStore, $uibModal, IndiService, $rootScope) {

  $scope.indi_connect = function(host,port) {
    IndiService.connect(host,port);
  }

  $scope.indi_init = function() {
    IndiService.send("<getProperties version=\"1.7\"/>");
  }

  $scope.indi_status = function() {
    IndiService.status();
  }


  $scope.xml=IndiService;

  /////////////////////////////////// TEST //////////////////////////////////
  //$scope.indi_connect("localhost", "9999");
  //$scope.indi_init();
  //$scope.xml=IndiService;
  //console.log(IndiService);
  //console.log($scope.xml);
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
