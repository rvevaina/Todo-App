// Create module, controller and define functions to handle todos

var todoApp = angular.module('todo', []);

function mainController($scope, http) {
	$scope.formData = {};

	//when landing on page, get all todos and show them 
	$http.get('/api/todos') 
		.success(function(data){
			$scope.todos = data;
			console.log(data);
		})
		.error(funciton(data){
			console.log('Error: ' + data);
		});

	//when submitting the add form, send the text to the node API
	$scope.createTodo = function()
		$http.post('/api/todos', $scope.formData) 
			.success(function(data){
				$scope.formData = {}; //clear form so user can add another
				$scope.todos = data; //get new todo data
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data)
			});
	};

	//Delete todo after checking it
	$scope.deteleTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data){
				$scope.todos = data;
				console.log(data); 
			})
			.error(function(data){
				console.log('Error: ' + data)
			});
	};

}//function main controller  




jQuery(function($) {

});