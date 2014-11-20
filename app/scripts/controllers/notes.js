'use strict';

/*jshint curly: false */
/*global _: true, Camera: true */

angular
.module('NoteToSelf.controllers', [])
.controller('NotesController', function($rootScope, $scope, $location, $stateParams, $ionicPopup, NoteFactory) {
	var self = this;
	self.factory = NoteFactory;

	self.goHome = function () {
		$location.path('/tab/notes');
	};

	if(!self.factory)
		return;

	self.factory.getAll().then(function () {
		self.items = self.factory.items;
	});

	self.searchResults = self.factory.searchResults;

	if($stateParams.noteId){
		self.factory.getOne($stateParams.noteId).then(function () {
			self.item = self.factory.item;
		});
	}

	self.create = function () {
		self.factory.createOne(self.createForm).then(function () {
			self.createForm = null;
			self.goHome();
		});
	};

	self.edit = function () {
		self.factory.c(self.createForm).then(self.goHome);
	};

	self.remove = function (params) {
		if(_.isArray(params)){
			self.factory.removeMultiple(params).then(self.goHome);
		}else{
			self.factory.removeOne(params).then(function () {
				if($stateParams.noteId)
					self.goHome();
			});
		}
	};

	$scope.$on('notes.photos.added', function (event, image) {
		if(_.isUndefined(self.createForm)) self.createForm = {};

		if(!_.has(self.createForm, 'pictures')){
			self.createForm.pictures = [image];
		}else if(_.isArray(self.createForm.pictures)){
			self.createForm.pictures.push(image);
		}else{
			self.showPopup('photo adding error!');
		}

		console.log(self.createForm);
		$scope.$apply();
	});

	self.showPopup = function (title, message) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: message
		});

		alertPopup.then(function(res) {
			console.log('photo popup shown!', res);
		});
	};

	self.addPhoto = function (formData) {
		var title = 'Photo Upload result';

		if(_.isUndefined(Camera)){
			return self.showPopup(title, 'no camera');
		}

		var config = {
			quality: 50,
		    destinationType: Camera.DestinationType.DATA_URL,
		    encodingType: Camera.EncodingType.JPEG,
		    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		};

		var photoAdded = function (image) {
			$rootScope.$broadcast('notes.photos.added', image);
		};

		var photoFailed = function (err) {
			self.showPopup(title, 'Photo processing error!', err);
		};

		navigator.camera.getPicture(photoAdded, photoFailed, config);
	};

	self.search = function () {
		self.factory.search(self.searchForm).then(function () {
			$location.path('/tab/notes/search/results');
		});
	};
});