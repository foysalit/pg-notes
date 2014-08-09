'use strict';
angular
.module('NoteToSelf.services', [])
.factory('NoteFactory', function(ENV, $http) {
	var self = {
		apiUrl 	: ENV.apiEndpoint +'notes',
		items 	: []
	};

	self.getAll = function() {
		return $http.get(self.apiUrl).success(function (response) {
			if(response.error){
				self.items = null;
				return;
			}

			self.items = response.data;
		}).error(function (err) {
			console.log(err);
		});
	};

	self.getOne = function (id) {
		var endPoint = self.apiUrl +'/'+ id;

		return $http.get(endPoint).success(function (response) {
			if(response.error){
				self.item = null;
				return;
			}

			self.item = response.data;
		}).error(function (err) {
			console.log(err);
		});
	};

	self.removeOne = function (item) {
		if(!_.isObject(item) && !item.id){
			return;
		}

		return $http({
			url: self.apiUrl +'/'+ item.id,
			method: 'DELETE'
		}).success(function (response) {
			if(response.error){
				return;
			}

			_.remove(self.items, item);
		}).error(function (err) {
			console.log(err);
		});
	};
		
	self.createOne = function(note) {
		return $http({
			url: self.apiUrl,
			method: 'POST',
			data: note
		}).success(function (response) {
			console.log(response);
		}).error(function (err) {
			console.log(err);
		});
	};

	return self;
});
