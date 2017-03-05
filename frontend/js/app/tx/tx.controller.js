var multisig = angular.module('multisig');
var testNetwork = "https://horizon-testnet.stellar.org";
var liveNetwork = "https://horizon.stellar.org";

var server = new StellarSdk.Server(testNetwork);


    
multisig.controller('txController', function($scope, $state, $stateParams, $http, $rootScope, Multisig, randomString) {
		
	$scope.txObj = {};
	$scope.txEnvelope = {};
	$scope.txData = {};
	$scope.txError = [];
	$scope.srcAcct = "";
	$scope.responseData = {};
	$scope.signersObj = [{'operationCount' : 1}];
    $scope.qrcodedata = "test";
    
	$scope.init = function() {
		console.log("sP", $stateParams);
		$scope.txTag = $stateParams.tx_tag;
		console.log("tx_tag");
        console.log($scope.txTag);
        console.log("signer_url at init");
        console.log($scope.signer_url);
        $scope.signer_url = "http://sacarlson.github.io/my_wallet";

		Multisig.getTx($scope.txTag)
			.success(function(data) {
                console.log("multisig.getTx data");
				console.log(data);
				$scope.txObj = data.content.tx;
				$scope.txEnvelope = new StellarSdk.Transaction($scope.txObj.tx_xdr);
				$scope.txData.tx_id = data.content.tx.id;
                $scope.txObj.callback = "http://localhost:8888"; 
                $scope.qrcodedata = "%7B%22tx_tag%22:%22" + $scope.txTag + "%22,%22callback%22:%22" + $scope.txObj.callback + "%22%7D";                  
                console.log("qr", $scope.qrcode_text);            
			})
			.error(function(data) {
				console.log(data);
			});

	};



	$scope.signTx = function () {
		// change from xdr to tx builder object,
		// get key pair from each seed
		// sign tx with seed
		// change back to xdr
        console.log("signer_url at signTx");
        console.log($scope.signer_url);
		
		var txBlock = new StellarSdk.Transaction($scope.txObj.tx_xdr);
		console.log("tx txBlock", txBlock);
		console.log("pre signed env");
        console.log(txBlock.toEnvelope().toXDR().toString("base64"));
		// Add operations
		$scope.signersObj.forEach(function(ops) {
			console.log("ops: ",ops);
            console.log("opps seed");
            console.log(ops.seed);
			var keypair = StellarSdk.Keypair.fromSeed(ops.seed);
			console.log("keypair", keypair);
			txBlock.sign(keypair);
			$scope.txData.signer = keypair.accountId();
		});

		console.log("tx txBlock post sign", txBlock);
        console.log("post signed env");
        console.log(txBlock.toEnvelope().toXDR().toString("base64"));		
		$scope.txEnvelope = txBlock;
		var txString = txBlock.toEnvelope().toXDR().toString("base64");
		console.log("txString", txString);
		$scope.txObj.tx_xdr = txString;
		$scope.txData.tx_xdr = txString;
		// Save to DB incase others need to sign
		
		console.log("txData to be sent to api");
        console.log($scope.txData);
		
		Multisig.signTx($scope.txData)
			.success(function(data) {
				console.log(data);
				var params = {
				  tx_tag: $scope.txObj.tx_tag
											};
				$state.go('tx', params , {reload: true});
				
	    })
			.error(function(data) {
				console.log(data);
			});

	};

	$scope.submitTx = function () {
		
		var txBlock = new StellarSdk.Transaction($scope.txObj.tx_xdr);
		console.log("tx txBlock", txBlock);
		
		// submit Transaction
		server.submitTransaction(txBlock)
			.then(function(result) {
						console.log('Success! Results:', result);
						Multisig.submitTx($scope.txObj.tx_tag)
							.success(function(data) {
								console.log(data);
								var params = {
																tx_tag: $scope.txObj.tx_tag
															};
								$state.go('tx', params , {reload: true});
								
					    })
							.error(function(data) {
								console.log(data);
							});
	      })
	      .catch(function(error) {
	        console.error('Something went wrong at the end\n', error);
	        
	      });


	};	

	$scope.createAsset = function (assetType, assetCode, assetIssuer) {
		if (assetType == 0) {
			return StellarSdk.Asset.native();
		}else{

			return new StellarSdk.Asset(assetCode, assetIssuer);

		}

	};

	$scope.showMemo = function (memoType) {
		if (memoType === 'none') {
			return false;
		} else{
			return true;
		}
		
	};


	$scope.showOperation = function (opType, formType) {
		if (opType == formType) {
			return true;
		} else{
			return false;
		};
	};

	$scope.showAsset = function (assetType) {
		if (assetType == 4 || assetType == 12) {
			return true;
		} else{
			return false;
		};
	};

	$scope.addSignature = function () {
		var operationNo = $scope.signersObj.length+1;
		var newOps = {'operationCount': operationNo};
		$scope.signersObj.push(newOps);
		
		console.log("Ops: ", $scope.signersObj);
	};	

	$scope.removeOperation = function (index) {
		console.log("index", index);
		console.log("TX Data: ", $scope.txData);
		console.log("Ops: ", $scope.operations);
    $scope.operations.splice(index,1);

	};	

});
