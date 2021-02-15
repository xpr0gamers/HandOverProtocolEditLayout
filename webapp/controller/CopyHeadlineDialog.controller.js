sap.ui.define(
  ["./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox"],
  function (BaseController, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyHeadlineDialog", {
      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {},
      showDialog: function (oSelectedHeadline) {
        this.oDialog = this.getView().getContent()[0];
        this.oSelectedHeadline = oSelectedHeadline;
        this.oDialog.open();
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
      onSelectToCopyLayouts: function(oEvent){
        const oSelectedItems = oEvent.getParameter("selectedItems").map(function (oItemTemp) {
          return oItemTemp.getBindingContext("handoverLayout").getObject();
        });
        if (oSelectedItems.length == 0) {
          return;
        }
        this.getView().setBusy(true);
        const sGuidTargtes = oSelectedItems
          .map(function (oItemTemp) {
            return oItemTemp.Prodh;
          })
          .join(",");
        this.getView()
          .getModel("handoverLayout")
          .callFunction("/CopyHeadline", {
            method: "GET",
            urlParameters: {
              GuidRootItem: this.oSelectedHeadline.Guid,
              ProdhTargets: sGuidTargtes,
            },
            success: function () {
              this.getView().setBusy(false);
            }.bind(this),
            error: function(){
              this.getView().setBusy(false);
            }.bind(this)
          });
      }
    });
  }
);
