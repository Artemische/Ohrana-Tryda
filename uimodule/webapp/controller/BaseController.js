sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/UIComponent",
        "bntu/ohranaTryda/model/formatter",
        "../Firebase"
    ],
    function (Controller, History, UIComponent, formatter, Firebase) {
        "use strict";

        return Controller.extend("bntu.ohranaTryda.controller.BaseController", {
            formatter: formatter,

            /**
             * Convenience method for getting the view model by name in every controller of the application.
             * @public
             * @param {string} sName the model name
             * @returns {sap.ui.model.Model} the model instance
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             * Convenience method for setting the view model in every controller of the application.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
             * Convenience method for getting the resource bundle.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
             */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            /**
             * Method for navigation to specific view
             * @public
             * @param {string} psTarget Parameter containing the string for the target navigation
             * @param {Object.<string, string>} pmParameters? Parameters for navigation
             * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
             */
            navTo: function (psTarget, pmParameters, pbReplace) {
                this.getRouter().navTo(psTarget, pmParameters, pbReplace);
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            onNavBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.back();
                } else {
                    this.getRouter().navTo("appHome", {}, true /*no history*/);
                }
            },
            
            async readBaseRequest(sPath) {
                return await Firebase.handleOnceMethod(sPath);
            },

            createBaseRequest(sPath, oDoc) {
                return Firebase.handleSetMethod(sPath, oDoc);
            },

            deleteBaseRequest(sPath) {
                return Firebase.handleRemoveMethod(sPath);
            },

            updateBaseRequest(sPath, oDoc) {
                return Firebase.handleUpdateMethod(sPath, oDoc);
            },

            _setAvailableUsers() {
                const oModel = this.getModel();
                debugger
                const bActiveUserIsAdmin = oModel.getProperty("/ActiveUser/isAdmin");
                if (bActiveUserIsAdmin) {
                    oModel.setProperty("/AvailableUsers", Object.values(oModel.getProperty("/Users")));            
                } else {
                    oModel.setProperty("/AvailableUsers", [oModel.getProperty("/ActiveUser")]);
                }
            },
            
        });
    }
);
