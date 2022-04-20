sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator",
], function (Controller, Fragment, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ObjectPage", {
        
        onInit() {
            this.getRouter().getRoute("RouteOP").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const aItems = this.getModel().getProperty("/AvailableUsers");
            const sId = oArguments.employeeId;
            const sIndex = aItems.findIndex(el => el.mobilePhone.toString() === sId );

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
		onListEmployeesBreadcrumbsPress: function() {
            this.navigateToTheListReport();
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
        }
    });
});
