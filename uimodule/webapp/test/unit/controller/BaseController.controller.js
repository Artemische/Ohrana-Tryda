/*global QUnit*/

sap.ui.define([
	"bntu/ohranaTryda/controller/BaseController.controller",
], function (Controller) {
	"use strict";

	QUnit.module("Base Controller");

	QUnit.test("I should test the Runs controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

	QUnit.module("Base functionality");

	QUnit.test("Метод для получения модели", function (assert) {
		var oViewStub = {
			getModel: this.stub()
		};
		
		var oControllerStub = {
			getView: this.stub().returns(oViewStub)
		};

		var fnIsolateFunction = Controller.getModel.bind(oControllerStub);
		fnIsolateFunction();
		assert.equal(oViewStub.getModel.calledOnce, 1, "Функия вызвана успешно!");
	});


});