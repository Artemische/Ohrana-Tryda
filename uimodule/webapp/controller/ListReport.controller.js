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

        async onAfterRendering() {
            const oModel = this.getModel();
            const oUsers = await this.readBaseRequest("Users/");
            const sActiveUserMobile = sessionStorage.getItem("ActiveUserMobile");
            const oActiveUser = Object.values(oUsers).find(user => user.mobilePhone == sActiveUserMobile);

            if (oActiveUser) {
                oModel.setProperty("/ActiveUser", oActiveUser);
                this._setAvailableUsers();  
            } else {
                this.openLoginDialog()
            }

            this._setDepartmentFilterValues(Object.values(oUsers));
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
                oLoginDialog.addEventDelegate({onsapenter: this.onSignInPress}, this);
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
                oCreateUserDialog.addEventDelegate({onsapenter: this.onSubmitPress}, this);
                oCreateUserDialog.open();
            });
        },

        onSignInPress() {
            const oAuthData = this.getModel("configModel").getProperty("/authData");
            this._authenticateUser(oAuthData);
        },

        async onSubmitPress() {
            const oNewUser = this.getModel("configModel").getProperty("/newUserData");
            const sSuccessUserCreationMessage = this.getResourceBundle().getText("successUserCreationMsg");
            const sSuccessUserCreationTitle = this.getResourceBundle().getText("successUserCreationTitle");

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
                    oLoginDialog.close().destroy();
                    this.oLoginDialog = null;
                });
            }

            this._clearAuthData();
        },

        closeCreateUserDialog() {
            if (this.oCreateUserDialog) {
                this.oCreateUserDialog.then(oCreateUserDialog => {
                    oCreateUserDialog.close().destroy();
                    this.oCreateUserDialog = null;
                });
            }

            this._clearNewUserData();
        },

        handleLoginException() {
            const sTitle = this.getResourceBundle().getText("loginErrorTitle");
            const sErrorMessage = this.getResourceBundle().getText("loginErrorText");
            const sCloseButtonText = this.getResourceBundle().getText("closeButton");

            MessageBox.error(sErrorMessage, {
                actions: [sCloseButtonText],
                title: sTitle
            })
        },
      
        onFilterChange() {
            const aFilterItems = this.byId("filterbar").getFilterItems();
            const aFilters = [];

            aFilterItems.forEach( item => {
                const oControl = item.getControl();
                const sValue = oControl.getValue ? oControl.getValue() : oControl.getSelectedKey();

                if (oControl.data("prop") === "isAttestationPassed") {
                    const bValue = (sValue === "Сдано");
                    if (sValue) {
                        aFilters.push(new Filter(oControl.data("prop"), FilterOperator.EQ, bValue));
                    }
                } else {
                    if (sValue) {
                        aFilters.push(new Filter(oControl.data("prop"), FilterOperator.Contains, sValue));
                    }
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

        onRgbResultSelect() {
            const oConfigModel = this.getModel("configModel");

            oConfigModel.setProperty("/newUserData/lastAttestationDate", "");
        },

        onRgbRoleSelect() {
            const oConfigModel = this.getModel("configModel");

            oConfigModel.setProperty("/newUserData/lastAttestationDate", "");
            oConfigModel.setProperty("/newUserData/ticket", "");
            oConfigModel.setProperty("/newUserData/isAttestationPassed", false);
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

        _verifyLoginUserExist(oLoginUser) {
            const oModel = this.getModel();
            const aUsers = Object.values(oModel.getData().Users);

            return aUsers.find(oUser => oUser.name.toLowerCase().trim() === oLoginUser.name.toLowerCase().trim() && 
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

        _setDepartmentFilterValues(aUsers) {
            const aDepartments = Array.from(new Set(aUsers.map(user => user.department)));
            const oConfigModel = this.getModel("configModel");
            const aFilterStructure = aDepartments.map((elem, index) => {
                return {
                    key: index,
                    value: elem
                }
            });

            oConfigModel.setProperty("/Departments", aFilterStructure);
        },
    });
});
