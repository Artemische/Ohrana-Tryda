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
            
        },

        onAfterRendering() {
            this.getFbLoadPromise().then(() => {
                const sActiveUserMobile = this.getModel().getProperty("/ActiveUser").mobilePhone;

                sActiveUserMobile ? this._setAvailableUsers() : this.openLoginDialog();
            }, (oError) => {
                console.log(oError);
                // handle data load fail 
            });
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

        async onSubmitPress() {
            const oNewUser = this.getModel("configModel").getProperty("/newUserData");
            const sSuccessUserCreationMessage = this.getResourceBundle().getText("successUserCreationMsg");
            const sSuccessUserCreationTitle = this.getResourceBundle().getText("successUserCreationTitle");
            debugger
            await this.createBaseRequest("Users/", oNewUser);

            MessageBox.success(sSuccessUserCreationMessage, {
                title: sSuccessUserCreationTitle,
                onClose: () => {
                    this.closeCreateUserDialog();
                }
            });            
        },

        closeLoginDialog() {
            if (this.oLoginDialog) {
                this.oLoginDialog.then(oLoginDialog => {
                    oLoginDialog.close();
                });
            }

            this._clearAuthData();
        },

        closeCreateUserDialog() {
            if (this.oCreateUserDialog) {
                this.oCreateUserDialog.then(oCreateUserDialog => {
                    oCreateUserDialog.close();
                });
            }

            this._clearNewUserData();
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

            this.getOwnerComponent().getRouter().navTo("RouteOP", {
                employeeId: sId
            })
        },

        _authenticateUser(oLoginCredentials) {
            const oModel = this.getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);

            if (oExistingUser) {
                sessionStorage.setItem("ActiveUserMobile", oExistingUser.mobilePhone);
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

            return oUsers.find(oUser => oUser.name.toLowerCase().trim() === oLoginUser.name.toLowerCase().trim() && 
                oUser.secondName.toLowerCase().trim() === oLoginUser.secondName.toLowerCase().trim() &&
                oUser.thirdName.toLowerCase().trim() === oLoginUser.thirdName.toLowerCase().trim());

        },

        _clearAuthData() {
            const oConfigModel = this.getModel("configModel");
            const oAuthData = oConfigModel.getData().authData;

            for (let  key in oAuthData) {
                oAuthData[key] = "";
            }
            
            oConfigModel.setProperty("/authData", oAuthData);
        },

        _clearNewUserData() {
            const oConfigModel = this.getModel("configModel");
            const oNewUserData = oConfigModel.getData().newUserData;

            for (let  key in oNewUserData) {
                typeof(oNewUserData[key]) === "string" ? oNewUserData[key] = "" : oNewUserData[key] = false;
            }

            oConfigModel.setProperty("/newUserData", oNewUserData);
        },
    });
});
