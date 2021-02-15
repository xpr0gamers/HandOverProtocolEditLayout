sap.ui.define(["./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (BaseController, Filter, FilterOperator) {
  "use strict";

  return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.SelectProductLineForMainDialog", {
    /**
     * Called when the worklist controller is instantiated.
     * @public
     */
    onInit: function () {},
    showDialog: function (oCallback) {
      this.oDialog = this.getView().getContent()[0];
      this.oCallback = oCallback;
      this.oDialog.open();
    },
    onCloseDialog: function () {
      this.oDialog.close();
    },
    onSearchProductLines: function (oEvent) {
      const oFilters = [];
      const sValue = oEvent.getParameter("value");
      if (sValue && sValue.length >= 1) {
        oFilters.push(new Filter("Description", FilterOperator.Contains, sValue.toLowerCase()));
        //oFilters.push(new Filter("toLower(Description)", FilterOperator.Contains, sValue.toLowerCase()));
      }
      const oBinding = oEvent.getParameter("itemsBinding");
      oBinding.filter(oFilters);
    },
    onSelectProductLine: function (oEvent) {
      const oSelectedProductLineItem = oEvent.getParameter("selectedItem").getBindingContext("handoverLayout").getObject();
      this.oCallback(oSelectedProductLineItem);
    },
  });
});
