sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator",
], function (Controller, Fragment, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ListReport", {
        
        onInit() {
            this.openLoginDialog();
        },

        openLoginDialog() {
            const oView = this.getView();

            if (!this.oLoginDialog) {
                this.oLoginDialog = Fragment.load({
                    id: oView.getId(),
                    name: "bntu.ohranaTryda.view.fragments.Login",
                    controller: this
                }).then(oLoginDialog => {
                    oView.addDependent(oLoginDialog);
                    return oLoginDialog;
                });
            }
            this.oLoginDialog.then(oLoginDialog => {
                oLoginDialog.open();
            });
        },

        onLoginCancelPress() {
            this.closeLoginDialog();
        },

        onCreateCancelPress() {
            this.closeCreateUserDialog();
        },

        onCreateUserPress() {
            const oView = this.getView();

            if (!this.oCreateUserDialog) {
                this.oCreateUserDialog = Fragment.load({
                    id: oView.getId(),
                    name: "bntu.ohranaTryda.view.fragments.CreateUser",
                    controller: this
                }).then(oCreateUserDialog => {
                    oView.addDependent(oCreateUserDialog);
                    return oCreateUserDialog;
                });
            }
            this.oCreateUserDialog.then(oCreateUserDialog => {
                oCreateUserDialog.open();
            });
        },

        onSignInPress() {
            var sName = this.byId("loginFirstNameFieldId").getValue();
            var sSecondName = this.byId("loginSecondNameFieldId").getValue();
            var sThirdName = this.byId("loginThirdNameFieldId").getValue();
            const oLoginCredentials = {
                name: sName,
                secondName: sSecondName,
                thirdName: sThirdName
            };
            this._authenticateUser(oLoginCredentials);
        },

        onSubmitPress() {

        },

        closeLoginDialog() {
            if (this.oLoginDialog) {
                this.oLoginDialog.then(oLoginDialog => {
                    oLoginDialog.close().destroy();
                    this.oLoginDialog = null;
                });
            }
        },

        closeCreateUserDialog() {
            if (this.oCreateUserDialog) {
                this.oCreateUserDialog.then(oCreateUserDialog => {
                    oCreateUserDialog.close().destroy();
                    this.oCreateUserDialog = null;
                });
            }
        },

        handleLoginException() {
            const sTitle = this.getResourceBundle().getText("loginErrorTitle");
            const sErrorMessage = this.getResourceBundle().getText("loginErrorText");

            MessageBox.error(sErrorMessage, {
                title: sTitle
            })
        },
      
        onFilterChange() {
            const aFilterItems = this.byId("filterbar").getFilterItems();
            const aFilters = [];

            aFilterItems.forEach( item => {
                const oControl = item.getControl();
                const sValue = oControl.getValue ? oControl.getValue() : oControl.getSelectedKey();

                if (sValue) {
                    aFilters.push(new Filter(oControl.data("prop"), FilterOperator.Contains, sValue));
                }
            });
            
            this.byId("usersTableId").getBinding("items").filter(aFilters);
        },

        onLineItemPress(oEvent) {
            const oData = oEvent.getSource().getBindingContext().getObject();
            const sId = oData.mobilePhone;

            this.getRouter().navTo("RouteOP", {
                epmployeId: sId
            })
        },

        _authenticateUser(oLoginCredentials) {
            const oModel = this.getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);

            if (oExistingUser) {
                oModel.setProperty("/ActiveUser", oExistingUser);
                this._setAvailableUsers();
                this.closeLoginDialog();
            } else {
                this.handleLoginException();
            }
        },

        _setAvailableUsers() {
            const oModel = this.getModel();
            const bActiveUserIsAdmin = oModel.getProperty("/ActiveUser/isAdmin");
            const sProperty = bActiveUserIsAdmin ? "/Users" : "/ActiveUser";

            oModel.setProperty("/AvailableUsers", [].concat(oModel.getProperty(sProperty)));
        },

        _verifyLoginUserExist(oLoginUser) {
            const oModel = this.getModel();
            const oUsers = oModel.getData().Users;

            return oUsers.find(oUser => oUser.name.toLowerCase() === oLoginUser.name.toLowerCase() && 
                oUser.secondName.toLowerCase() === oLoginUser.secondName.toLowerCase() &&
                oUser.thirdName.toLowerCase() === oLoginUser.thirdName.toLowerCase());

        },
    });
});
