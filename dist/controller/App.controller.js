sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.App",{onInit:function(){var e,o,n=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");o=function(){e.setProperty("/busy",false);e.setProperty("/delay",n)};this.getOwnerComponent().getModel("handoverLayout").metadataLoaded().then(o);this.getOwnerComponent().getModel("handoverLayout").attachMetadataFailed(o);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});