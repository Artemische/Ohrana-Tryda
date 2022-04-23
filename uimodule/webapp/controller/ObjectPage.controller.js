sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/m/MessageBox",
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ObjectPage", {
        
        onInit() {
            this.getRouter().getRoute("RouteOP").attachPatternMatched(this._onRouteMatched, this);
        },

        async _onRouteMatched(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const sId = oArguments.employeeId;
            let aItems;
            let sIndex;

            await this._authorizeUser();
            
            aItems = this.getModel().getProperty("/AvailableUsers");
            sIndex = aItems.findIndex(el => el.mobilePhone.toString() === sId );

            this.sId= sId;
            this.getView().bindElement({
                path: `/AvailableUsers/${sIndex}`
            });
        },

        navigateToTheListReport() {
            this.getRouter().navTo("RouteMainView");
        },

        /**
		 * Handle the click event for the breadcrumb and routes to the employees listing page.
		 * 
		 * @public
		 */
		onListEmployeesBreadcrumbsPress() {
            this.navigateToTheListReport();
		},

        onEditPress() {
            const oConfigModel = this.getModel("configModel");
            const oUserData = {
                ...this.getView().getBindingContext().getObject()
            };

            oConfigModel.setProperty("/userCashData", oUserData);
            oConfigModel.setProperty("/editMode", true);
        },

        onFooterActionPress(oEvent, bCancel) {
            const oConfigModel = this.getModel("configModel");

            if (bCancel) {
                const sPath = this.getView().getBindingContext().getPath();
                
                this.getModel().setProperty(sPath, oConfigModel.getProperty("/userCashData"));
            }

            oConfigModel.setProperty("/editMode", false);
        },

        onDeletePress() {
            const sWarningMessage = this.getResourceBundle().getText("deleteUserText");
            const sWarningTitle = this.getResourceBundle().getText("deleteUserTitle");
            const sDeleteAction = this.getResourceBundle().getText("deleteAction");
            const sCancelAction = this.getResourceBundle().getText("cancelAction");

            MessageBox.warning(sWarningMessage, {
                title: sWarningTitle,
                actions: [sDeleteAction, sCancelAction],
                onClose: (action) => {
                    action === sDeleteAction ? this.deleteUser() : null;
                }
            })
        },

        async deleteUser() {
            const oUsers = this.getModel().getProperty("/Users");
            const sSelectedUserId = this._getSelectedUserId(oUsers);
            const sSuccessMessage = this.getResourceBundle().getText("successUserDeletionMsg");
            const sSuccessTitle = this.getResourceBundle().getText("successUserDeletionTitle");

            await this.deleteBaseRequest(`Users/${sSelectedUserId}`);
            MessageBox.success(sSuccessMessage, {
                title: sSuccessTitle,
                onClose: () => {
                    this.navigateToTheListReport();
                }
            });
        },
        
        _getSelectedUserId(oUsers) {
            return Object.entries(oUsers).find(([key, value]) => value.mobilePhone.toString() === this.sId)[0];
        },

        async _authorizeUser() {
            const oModel = this.getModel();
            const oUsers = await this.readBaseRequest("Users/");
            const sActiveUserMobile = sessionStorage.getItem("ActiveUserMobile");
            const oActiveUser = Object.values(oUsers).find(user => user.mobilePhone == sActiveUserMobile);

            if (oActiveUser) {
                oModel.setProperty("/ActiveUser", oActiveUser);
                this._setAvailableUsers();  
            }
        },
    });
});
