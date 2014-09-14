'use strict';

(function() {
	// Answers Controller Spec
	describe('Answers Controller Tests', function() {
		// Initialize global variables
		var AnswersController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Answers controller.
			AnswersController = $controller('AnswersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Answer object fetched from XHR', inject(function(Answers) {
			// Create sample Answer using the Answers service
			var sampleAnswer = new Answers({
				name: 'New Answer'
			});

			// Create a sample Answers array that includes the new Answer
			var sampleAnswers = [sampleAnswer];

			// Set GET response
			$httpBackend.expectGET('answers').respond(sampleAnswers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.answers).toEqualData(sampleAnswers);
		}));

		it('$scope.findOne() should create an array with one Answer object fetched from XHR using a answerId URL parameter', inject(function(Answers) {
			// Define a sample Answer object
			var sampleAnswer = new Answers({
				name: 'New Answer'
			});

			// Set the URL parameter
			$stateParams.answerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/answers\/([0-9a-fA-F]{24})$/).respond(sampleAnswer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.answer).toEqualData(sampleAnswer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Answers) {
			// Create a sample Answer object
			var sampleAnswerPostData = new Answers({
				name: 'New Answer'
			});

			// Create a sample Answer response
			var sampleAnswerResponse = new Answers({
				_id: '525cf20451979dea2c000001',
				name: 'New Answer'
			});

			// Fixture mock form input values
			scope.name = 'New Answer';

			// Set POST response
			$httpBackend.expectPOST('answers', sampleAnswerPostData).respond(sampleAnswerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Answer was created
			expect($location.path()).toBe('/answers/' + sampleAnswerResponse._id);
		}));

		it('$scope.update() should update a valid Answer', inject(function(Answers) {
			// Define a sample Answer put data
			var sampleAnswerPutData = new Answers({
				_id: '525cf20451979dea2c000001',
				name: 'New Answer'
			});

			// Mock Answer in scope
			scope.answer = sampleAnswerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/answers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/answers/' + sampleAnswerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid answerId and remove the Answer from the scope', inject(function(Answers) {
			// Create new Answer object
			var sampleAnswer = new Answers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Answers array and include the Answer
			scope.answers = [sampleAnswer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/answers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAnswer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.answers.length).toBe(0);
		}));
	});
}());