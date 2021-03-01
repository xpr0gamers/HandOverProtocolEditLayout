//@ui5-bundle sap/Beutlhauser/HandOverProtocolEditLayout/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"sap/Beutlhauser/HandOverProtocolEditLayout/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","./model/models","./controller/ErrorHandler"],function(t,e,s,i){"use strict";return t.extend("sap.Beutlhauser.HandOverProtocolEditLayout.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this._oErrorHandler=new i(this);this.setModel(s.createDeviceModel(),"device");this.getRouter().initialize()},destroy:function(){this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!e.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/App.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.App",{onInit:function(){var e,o,n=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");o=function(){e.setProperty("/busy",false);e.setProperty("/delay",n)};this.getOwnerComponent().getModel("handoverLayout").metadataLoaded().then(o);this.getOwnerComponent().getModel("handoverLayout").attachMetadataFailed(o);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/m/library"],function(e,t,r){"use strict";var o=r.URLHelper;return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.BaseController",{getRouter:function(){return t.getRouterFor(this)},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,t){return this.getView().setModel(e,t)},onNavBack:function(){var e=History.getInstance().getPreviousHash();if(e!==undefined){history.go(-1)}else{this.getRouter().navTo("worklist",{},true)}},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onShareEmailPress:function(){var e=this.getModel("objectView")||this.getModel("worklistView");o.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/CopyHeadlineDialog.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox"],function(e,t,o,n){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyHeadlineDialog",{onInit:function(){},showDialog:function(e){this.oDialog=this.getView().getContent()[0];this.oSelectedHeadline=e;this.oDialog.open()},onSearchProductLines:function(e){const n=[];const i=e.getParameter("value");if(i&&i.length>=1){n.push(new t("Description",o.Contains,i.toLowerCase()))}const s=e.getParameter("itemsBinding");s.filter(n)},onSelectToCopyLayouts:function(e){const t=e.getParameter("selectedItems").map(function(e){return e.getBindingContext("handoverLayout").getObject()});if(t.length==0){return}this.getView().setBusy(true);const o=t.map(function(e){return e.Prodh}).join(",");this.getView().getModel("handoverLayout").callFunction("/CopyHeadline",{method:"GET",urlParameters:{GuidRootItem:this.oSelectedHeadline.Guid,ProdhTargets:o},success:function(){this.getView().setBusy(false)}.bind(this),error:function(){this.getView().setBusy(false)}.bind(this)})}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/CopyLayoutDialog.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox"],function(t,e,o,n){"use strict";return t.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyLayoutDialog",{onInit:function(){},showDialog:function(t){this.oDialog=this.getView().getContent()[0];this.sProdhCopy=t;this.oDialog.open()},onSearchProductLines:function(t){const n=[];const i=t.getParameter("value");if(i&&i.length>=1){n.push(new e("Description",o.Contains,i.toLowerCase()))}const s=t.getParameter("itemsBinding");s.filter(n)},copyLayout:function(t){this.getView().setBusy(true);const e=t.map(function(t){return t.Prodh}).join(",");this.getView().getModel("handoverLayout").callFunction("/CopyLayout",{method:"GET",urlParameters:{Prodh:this.sProdhCopy,ProdhTargets:e},success:function(){this.getView().setBusy(false)}.bind(this),error:function(){this.getView().setBusy(false)}.bind(this)})},onSelectToCopyLayouts:function(t){const e=t.getParameter("selectedItems").map(function(t){return t.getBindingContext("handoverLayout").getObject()});if(e.length==0){return}const o=e.filter(function(t){return t.LayoutExists==true}).map(function(t){return t.Description}).join(", ");if(o.length!=0){n.confirm("Achtung, die Layouts für "+o+" werden überschrieben",{onClose:function(t){if(t!="OK"){return}this.copyLayout(e)}.bind(this)})}else{this.copyLayout(e)}}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/ErrorHandler.js":function(){sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox"],function(e,s){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.ErrorHandler",{constructor:function(e){this._oResourceBundle=e.getModel("i18n").getResourceBundle();this._oComponent=e;this._oModel=e.getModel("handoverLayout");this._bMessageOpen=false;this._sErrorText=this._oResourceBundle.getText("errorText");this._oModel.attachMetadataFailed(function(e){var s=e.getParameters();this._showServiceError(s.response)},this);this._oModel.attachRequestFailed(function(e){var s=e.getParameters();if(s.response.statusCode!=="404"||s.response.statusCode===404&&s.response.responseText.indexOf("Cannot POST")===0){this._showServiceError(s.response)}},this)},_showServiceError:function(e){if(this._bMessageOpen){return}this._bMessageOpen=true;s.error(this._sErrorText,{id:"serviceErrorMessageBox",details:e,styleClass:this._oComponent.getContentDensityClass(),actions:[s.Action.CLOSE],onClose:function(){this._bMessageOpen=false}.bind(this)})}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/Main.controller.js":function(){sap.ui.define(["./BaseController","sap/m/MessageBox"],function(e,t){"use strict";return e.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.Main",{onInit:function(){this.getRouter().getRoute("RouteMainView").attachPatternMatched(function(){this.getView().getModel("handoverLayout").setDeferredGroups(["own-group"]);this.getView().setModel(new sap.ui.model.json.JSONModel({oConfig:{oSelectedObject:null,oSelectedProductLineItem:null,sUrlHandoverPdf:null}}))},this)},loadObjects:function(e){this.getView().setBusy(true);this.getView().getModel("handoverLayout").read("/RootItemSet",{urlParameters:{$expand:"CriteriaItemSet",$filter:"Prodh eq '"+e+"'"},success:function(e){const t=e.results.map(function(e){e.CriteriaItemSet=e.CriteriaItemSet.results.map(function(e){e.Level=1;return e});e.Level=0;return e});this.getView().getModel().setProperty("/oObjects",t);this.getView().setBusy(false)}.bind(this),error:function(){this.getView().setBusy(false);this.showErrorMessage()}.bind(this)})},onClickAddRootItem:function(){this.getView().byId("TreeTableObjects").setBusy(true);var e=this.getView().getModel().getProperty("/oObjects")||[];const t="Überschrift Neu "+e.length;const i=this.getView().getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");this.getView().getModel("handoverLayout").create("/RootItemSet",{GroupLabel:t,Prodh:i},{success:function(i){this.getView().byId("handoverPdfViewer").invalidate();e=e.slice();e.push({Guid:i.Guid,GroupLabel:t,Level:0,CriteriaItemSet:[]});this.getView().getModel().setProperty("/oObjects",e);this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})},onClickAddCriterium:function(){var e=this.getView().getModel().getProperty("/oObjects");const t=this.getView().getModel().getProperty("/oConfig/oSelectedObject").getObject();const i="Kriterium Neu "+t.CriteriaItemSet.length;this.getView().getModel("handoverLayout").create("/CriteriaItemSet",{RootItemGuid:t.Guid,Bezeichnung:i},{success:function(o){this.getView().byId("handoverPdfViewer").invalidate();t.CriteriaItemSet.push({Guid:o.Guid,RootItemGuid:t.Guid,Bezeichnung:i,Level:1});e=e.slice();this.getView().getModel().setProperty("/oObjects",e);this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})},onClickDeleteLayout:function(){t.confirm("Layout sicher löschen?",{onClose:function(e){if(e!="OK"){return}this.getView().setBusy(true);const t=this.getView().getModel().getProperty("/oObjects");t.forEach(function(e){if(e.Guid){this.getView().getModel("handoverLayout").remove("/RootItemSet(Guid=guid'"+e.Guid+"')",{groupId:"own-group"})}}.bind(this));this.getView().getModel("handoverLayout").submitChanges({groupId:"own-group",success:function(){this.getView().byId("handoverPdfViewer").invalidate();this.getView().getModel().setProperty("/oObjects",[]);this.getView().setBusy(false)}.bind(this),error:function(){this.getView().setBusy(false)}.bind(this)});this.getView().getModel().setProperty("/oConfig/oSelectedObject",null)}.bind(this)})},onRowSelectionChangeObjects:function(e){const t=e.getParameter("rowContext");if(this.getView().byId("TreeTableObjects").getSelectedIndex()===-1){this.getView().getModel().setProperty("/oConfig/oSelectedObject",null)}else{this.getView().getModel().setProperty("/oConfig/oSelectedObject",t)}},isCriteriaAddVisibleFormatter(e){if(e){return e.getProperty("Level")===0}else{return false}},isCriteriaDeleteVisibleFormatter(e){if(e){return e.getProperty("Level")===1}else{return false}},isLayoutDeleteCopyVisibleFormatter:function(e){if(e&&e.length!=0){return true}else{return false}},onValueHelpRequested:function(e){const t=this.getOwnerComponent().runAsOwner(function(){return new sap.ui.view({viewName:"sap.Beutlhauser.HandOverProtocolEditLayout.view.SelectProductLineForMainDialog",type:sap.ui.core.mvc.ViewType.XML})});e.getSource().addDependent(t);t.getController().showDialog(function(e){this.getView().getModel().setProperty("/oConfig/oSelectedProductLineItem",e);const t=this.getView().getModel("handoverLayout").sServiceUrl;this.getView().getModel().setProperty("/oConfig/sUrlHandoverPdf",t+"/HandOverPdfSet('"+e.Prodh+"')/$value");this.loadObjects(e.Prodh)}.bind(this))},onClickCopyLayout:function(e){const t=this.getOwnerComponent().runAsOwner(function(){return new sap.ui.view({viewName:"sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyLayoutDialog",type:sap.ui.core.mvc.ViewType.XML})});e.getSource().addDependent(t);const i=this.getView().getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");t.getController().showDialog(i)},onClickCopyHeadline:function(e){const t=this.getOwnerComponent().runAsOwner(function(){return new sap.ui.view({viewName:"sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyHeadlineDialog",type:sap.ui.core.mvc.ViewType.XML})});e.getSource().addDependent(t);const i=this.getView().getModel().getProperty("/oConfig/oSelectedObject").getObject();t.getController().showDialog(i)},onClickDeleteCriteria:function(){const e=this.getView().getModel().getProperty("/oConfig/oSelectedObject");const i=this.getView().getModel("handoverLayout").createKey("/CriteriaItemSet",{Guid:e.getObject().Guid});t.confirm("Kriterium sicher löschen?",{onClose:function(t){if(t!="OK"){return}this.getView().byId("TreeTableObjects").setBusy(true);this.getView().getModel("handoverLayout").remove(i,{success:function(){this.getView().byId("handoverPdfViewer").invalidate();const t=this.getView().getModel().getProperty("/oObjects");const i=t.find(function(t){return t.CriteriaItemSet.indexOf(e.getObject())!=-1});const o=i.CriteriaItemSet.indexOf(e.getObject());i.CriteriaItemSet.splice(o,1);this.getView().getModel().setProperty("/oObjects",t);this.getView().getModel().setProperty("/oConfig/oSelectedObject",null);this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})}.bind(this)})},onClickDeleteHeadline:function(){var e=this.getView().getModel().getProperty("/oObjects");const i=this.getView().getModel().getProperty("/oConfig/oSelectedObject");const o=i.getObject();const s=e.indexOf(o);t.confirm("Überschrift sicher löschen?",{onClose:function(t){if(t!="OK"){return}this.getView().byId("TreeTableObjects").setBusy(true);this.getView().getModel("handoverLayout").remove("/RootItemSet(Guid=guid'"+o.Guid+"')",{success:function(){this.getView().byId("handoverPdfViewer").invalidate();e=e.slice();e.splice(s,1);this.getView().getModel().setProperty("/oObjects",e);this.getView().getModel().setProperty("/oConfig/oSelectedObject",null);this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})}.bind(this)})},onSelectCriteriaChange:function(e){const t=e.getSource().getBindingContext().getObject();this.changeCriteria(t)},onChangeGroupLabelRootItem:function(e){this.getView().byId("TreeTableObjects").setBusy(true);const t=e.getSource().getBindingContext().getObject();const i=this.getView().getModel("handoverLayout").createKey("/RootItemSet",{Guid:t.Guid});const o={GroupLabel:t.GroupLabel,Prodh:t.Prodh};this.getView().getModel("handoverLayout").update(i,o,{success:function(){this.getView().byId("handoverPdfViewer").invalidate();this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})},onChangeBezeichnungCriteria:function(e){this.changeCriteria(e.getSource().getBindingContext().getObject())},changeCriteria:function(e){this.getView().byId("TreeTableObjects").setBusy(true);const t=this.getView().getModel("handoverLayout").createKey("/CriteriaItemSet",{Guid:e.Guid});const i={Criteria:e.Criteria,Bezeichnung:e.Bezeichnung,CountImages:e.CountImages};this.getView().getModel("handoverLayout").update(t,i,{success:function(){this.getView().byId("handoverPdfViewer").invalidate();this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this),error:function(){this.getView().byId("TreeTableObjects").setBusy(false)}.bind(this)})}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/NotFound.controller.js":function(){sap.ui.define(["./BaseController"],function(t){"use strict";return t.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.NotFound",{onLinkPressed:function(){this.getRouter().navTo("worklist")}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/controller/SelectProductLineForMainDialog.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(t,e,o){"use strict";return t.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.SelectProductLineForMainDialog",{onInit:function(){},showDialog:function(t){this.oDialog=this.getView().getContent()[0];this.oCallback=t;this.oDialog.open()},onCloseDialog:function(){this.oDialog.close()},onSearchProductLines:function(t){const n=[];const i=t.getParameter("value");if(i&&i.length>=1){n.push(new e("Description",o.Contains,i.toLowerCase()))}const a=t.getParameter("itemsBinding");a.filter(n)},onSelectProductLine:function(t){const e=t.getParameter("selectedItem").getBindingContext("handoverLayout").getObject();this.oCallback(e)}})});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/i18n/i18n.properties":'# This is the resource bundle for HandocerProtocolLayoutEditor\n# __ldi.translation.uuid=\n\n#XTIT: Application name\nappTitle=HandocerProtocolLayoutEditor\n\n#YDES: Application description\nappDescription=\n\n#~~~ Worklist View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Worklist view title\nworklistViewTitle=Manage <RootItemSetPlural>\n\n#XTIT: Worklist page title\nworklistTitle=HandocerProtocolLayoutEditor\n\n#XTIT: Table view title\nworklistTableTitle=<RootItemSetPlural>\n\n#XTOL: Tooltip for the search field\nworklistSearchTooltip=Enter an <RootItemSet> name or a part of it.\n\n#XBLI: text for a table with no data with filter or search\nworklistNoDataWithSearchText=No matching <RootItemSetPlural> found\n\n#XTIT: Table view title with placeholder for the number of items\nworklistTableTitleCount=<RootItemSet> ({0})\n\n#XTIT: The title of the column containing the 3 of RootItemSet\ntableNameColumnTitle=<3>\n\n#XTIT: The title of the column containing the 3 and the unit of measure\ntableUnitNumberColumnTitle=<3>\n\n#XBLI: text for a table with no data\ntableNoDataText=No <RootItemSetPlural> are currently available\n\n#XLNK: text for link in \'not found\' pages\nbackToWorklist=Show HandocerProtocolLayoutEditor\n\n#~~~ Object View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Object view title\nobjectViewTitle=<RootItemSet> Details\n\n#XTIT: Object page title\nobjectTitle=<RootItemSet>\n\n\n#XTIT: Label for the 3\n3Label=3\n\n#XTIT: Label for the 3\n3Label=3\n\n\n#~~~ Share Menu Options ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Send E-Mail subject\nshareSendEmailWorklistSubject=<Email subject PLEASE REPLACE ACCORDING TO YOUR USE CASE>\n\n#YMSG: Send E-Mail message\nshareSendEmailWorklistMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE>\\r\\n{0}\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The RootItemSet not found text is displayed when there is no RootItemSet with this id\nnoObjectFoundText=This <RootItemSet> is not available\n\n#YMSG: The RootItemSet not available text is displayed when there is no data when starting the app\nnoObjectsAvailableText=No <RootItemSetPlural> are currently available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.',
	"sap/Beutlhauser/HandOverProtocolEditLayout/i18n/i18n_de.properties":'',
	"sap/Beutlhauser/HandOverProtocolEditLayout/i18n/i18n_de_DE.properties":'',
	"sap/Beutlhauser/HandOverProtocolEditLayout/i18n/i18n_en.properties":'',
	"sap/Beutlhauser/HandOverProtocolEditLayout/localService/metadata.xml":'<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0"\n\txmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx"><edmx:DataServices m:DataServiceVersion="2.0"\n\t\txmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"><Schema Namespace="WORKLIST" xml:lang="en"\n\t\t\txmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="Object" sap:content-version="1"\n\t\t\t\txmlns:sap="http://www.sap.com/Protocols/SAPData"><Key><PropertyRef Name="3" /></Key><Property Name="3" Type="Edm.String" Nullable="false"\n\t\t\t\t\tMaxLength="40" sap:label="Object ID" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" /><Property Name="3" Type="Edm.String" Nullable="false"\n\t\t\t\t\tMaxLength="255" sap:label="Name"\n\t\t\t\t\tsap:creatable="false"\n\t\t\t\t\tsap:updatable="false"/><Property Name="3" Type="Edm.String" Nullable="false"\n\t\t\t\t\tMaxLength="3" sap:label="Unit of Measure" sap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:sortable="false" sap:filterable="false" /><Property Name="3" Type="Edm.Decimal" Nullable="false"\n\t\t\t\t\tPrecision="23" Scale="4" sap:label="Unit Number"\n\t\t\t\t\tsap:creatable="false"\n\t\t\t\t\tsap:updatable="false" sap:filterable="false" /></EntityType><EntityContainer Name="WORKLIST_ENTITIES"\n\t\t\t\tm:IsDefaultEntityContainer="true"><EntitySet Name="RootItemSet" EntityType="WORKLIST.Object"\n\t\t\t\t\tsap:creatable="false"\n\t\t\t\t\tsap:updatable="false"\n\t\t\t\t\tsap:deletable="false"\n\t\t\t\t\tsap:pageable="false" sap:content-version="1"\n\t\t\t\t\txmlns:sap="http://www.sap.com/Protocols/SAPData" /></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/localService/mockserver.js":function(){sap.ui.define(["sap/ui/core/util/MockServer","sap/ui/model/json/JSONModel","sap/base/util/UriParameters","sap/base/Log"],function(e,t,r,a){"use strict";var o,i="sap/Beutlhauser/HandOverProtocolEditLayout/",n=i+"localService/mockdata";var s={init:function(s){var u=s||{};return new Promise(function(s,c){var p=sap.ui.require.toUrl(i+"manifest.json"),l=new t(p);l.attachRequestCompleted(function(){var t=new r(window.location.href),c=sap.ui.require.toUrl(n),p=l.getProperty("/sap.app/dataSources/mainService"),f=sap.ui.require.toUrl(i+p.settings.localUri),d=/.*\/$/.test(p.uri)?p.uri:p.uri+"/";d=d&&new URI(d).absoluteTo(sap.ui.require.toUrl(i)).toString();if(!o){o=new e({rootUri:d})}else{o.stop()}e.config({autoRespond:true,autoRespondAfter:u.delay||t.get("serverDelay")||500});o.simulate(f,{sMockdataBaseUrl:c,bGenerateMissingMockData:true});var v=o.getRequests();var m=function(e,t,r){r.response=function(r){r.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(u.metadataError||t.get("metadataError")){v.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){m(500,"metadata Error",e)}})}var g=u.errorType||t.get("errorType"),h=g==="badRequest"?400:500;if(g){v.forEach(function(e){m(h,g,e)})}o.setRequests(v);o.start();a.info("Running the app with mock data");s()});l.attachRequestFailed(function(){var e="Failed to load application manifest";a.error(e);c(new Error(e))})})},getMockServer:function(){return o}};return s});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.Beutlhauser.HandOverProtocolEditLayout","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"ach":"set-ach","resources":"resources.json","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZPRT_HANDOVER_PROTOCOL_SRV/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.Beutlhauser.HandOverProtocolEditLayout.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.66.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.Beutlhauser.HandOverProtocolEditLayout.i18n.i18n"}},"handoverLayout":{"dataSource":"mainService","preload":true}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.Beutlhauser.HandOverProtocolEditLayout.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":"","name":"RouteMainView","target":["main"]}],"targets":{"main":{"viewName":"Main","viewLevel":1},"notFound":{"viewName":"NotFound","viewId":"notFound"}}}}}',
	"sap/Beutlhauser/HandOverProtocolEditLayout/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/App.view.xml":'<mvc:View\n\tcontrollerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Shell><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"/></Shell></mvc:View>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/CopyHeadlineDialog.view.xml":'<mvc:View controllerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyHeadlineDialog"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"><SelectDialog\n            title="Layout kopieren"\n            multiSelect="true"\n            search=".onSearchProductLines"\n            confirm=".onSelectToCopyLayouts"\n            showClearButton="true"\n            items="{path: \'handoverLayout>/ProductLineSet\', filters: [{path: \'Stufe\', operator: \'EQ\', value1: \'3\'}]}"><StandardListItem\n                title="{handoverLayout>Description}"\n                iconDensityAware="false"\n                iconInset="false"\n                info="{= ${handoverLayout>LayoutExists} === true ? \'Layout vorhanden\' : \'kein Layout vorhanden\'}" \n                infoState="{= ${handoverLayout>LayoutExists} === true ? \'Warning\' : \'Success\'}"\n                type="Active" /></SelectDialog></mvc:View>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/CopyLayoutDialog.view.xml":'<mvc:View controllerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.CopyLayoutDialog"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"><SelectDialog\n            title="Layout kopieren"\n            multiSelect="true"\n            search=".onSearchProductLines"\n            confirm=".onSelectToCopyLayouts"\n            showClearButton="true"\n            items="{path: \'handoverLayout>/ProductLineSet\', filters: [{path: \'Stufe\', operator: \'EQ\', value1: \'3\'}]}"><StandardListItem\n                title="{handoverLayout>Description}"\n                iconDensityAware="false"\n                iconInset="false"\n                info="{= ${handoverLayout>LayoutExists} === true ? \'Layout vorhanden\' : \'kein Layout vorhanden\'}" \n                infoState="{= ${handoverLayout>LayoutExists} === true ? \'Warning\' : \'Success\'}"\n                type="Active" /></SelectDialog></mvc:View>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/Main.view.xml":'<mvc:View controllerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.Main"\n    xmlns="sap.m"\n    xmlns:table="sap.ui.table"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:mvc="sap.ui.core.mvc"><Page><customHeader><Toolbar><ToolbarSpacer/><Text text="{i18n>appTitle}"></Text><ToolbarSpacer/><MenuButton useDefaultActionOnly="true"><menu><Menu><MenuItem text="Layout löschen" icon="sap-icon://delete" visible="{path: \'/oObjects\', formatter: \'.isLayoutDeleteCopyVisibleFormatter\'}" press="onClickDeleteLayout"></MenuItem><MenuItem text="Layout kopieren" icon="sap-icon://copy" visible="{path: \'/oObjects\', formatter: \'.isLayoutDeleteCopyVisibleFormatter\'}" press="onClickCopyLayout"></MenuItem></Menu></menu></MenuButton></Toolbar></customHeader><content><VBox alignItems="Center" width="100%" height="50px" class="sapUiSmallMargin"><VBox alignItems="Center"><Label text="Produktlinie"/><Input showValueHelp="true" valueHelpOnly="true" width="250px" value="{/oConfig/oSelectedProductLineItem/Description}" valueHelpRequest=".onValueHelpRequested"></Input></VBox></VBox><l:Splitter height="calc(100% - 90px)" visible="{= ${/oConfig/oSelectedProductLineItem} !== null}"><table:TreeTable visibleRowCountMode="Auto" class="sapUiSizeCompact" id="TreeTableObjects" selectionMode="Single" rows="{path:\'/oObjects\', parameters: {arrayNames:[\'CriteriaItemSet\'], numberOfExpandedLevels: 2}}" enableSelectAll="false" rowSelectionChange="onRowSelectionChangeObjects" ariaLabelledBy="title"><table:extension><OverflowToolbar><Title id="title" text="Objekte"/><ToolbarSpacer/><MenuButton useDefaultActionOnly="true"><menu><Menu><MenuItem text="Überschrift hinzufügen" icon="sap-icon://add" press="onClickAddRootItem"></MenuItem><MenuItem text="Überschrift Löschen" icon="sap-icon://delete" visible="{path: \'/oConfig/oSelectedObject\', formatter: \'.isCriteriaAddVisibleFormatter\'}" press="onClickDeleteHeadline"></MenuItem><MenuItem text="Überschrift kopieren" icon="sap-icon://copy" visible="{path: \'/oConfig/oSelectedObject\', formatter: \'.isCriteriaAddVisibleFormatter\'}" press="onClickCopyHeadline"></MenuItem><MenuItem text="Kriterium hinzufügen" visible="{path: \'/oConfig/oSelectedObject\', formatter: \'.isCriteriaAddVisibleFormatter\'}" icon="sap-icon://journey-change" press="onClickAddCriterium"></MenuItem><MenuItem text="Kriterium Löschen" icon="sap-icon://delete" visible="{path: \'/oConfig/oSelectedObject\', formatter: \'.isCriteriaDeleteVisibleFormatter\'}" press="onClickDeleteCriteria"></MenuItem></Menu></menu></MenuButton></OverflowToolbar></table:extension><table:columns><table:Column width="13rem"><Label text="Überschrift"/><table:template><Input value="{GroupLabel}" visible="{= ${Level} === 0 }" class="sapUiSizeCompact" change="onChangeGroupLabelRootItem"/></table:template></table:Column><table:Column width="9rem"><Label text="Bezeichnung"/><table:template><Input value="{Bezeichnung}" visible="{= ${Level} === 1 }" class="sapUiSizeCompact" change="onChangeBezeichnungCriteria"/></table:template></table:Column><table:Column width="11rem"><Label text="Kriterium"/><table:template><Select items="{path: \'handoverLayout>/CriteriaSet\', templateShareable: true}" change="onSelectCriteriaChange" selectedKey="{Criteria}" visible="{= ${Level} === 1 }" forceSelection="false"><core:Item key="{handoverLayout>Key}" text="{handoverLayout>Description}"/></Select></table:template></table:Column><table:Column width="6rem"><Label text="Anzahl Bilder"/><table:template><StepInput\n                                            visible="{= ${Level} === 1 }"\n\t\t\t\t\t\t                    value="{path: \'CountImages\', type:\'sap.ui.model.odata.type.Decimal\'}"\n\t\t\t\t\t\t                    min="0"\n                                            max="999"\n\t\t\t\t\t\t                    change="onSelectCriteriaChange"/></table:template></table:Column></table:columns><table:layoutData><l:SplitterLayoutData size="700px"/></table:layoutData></table:TreeTable><PDFViewer source="{/oConfig/sUrlHandoverPdf}" title="Übergabeprotokoll" id="handoverPdfViewer"><layoutData><l:SplitterLayoutData size="auto"/></layoutData></PDFViewer></l:Splitter></content></Page></mvc:View>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\ttitle="{i18n>notFoundTitle}"\n\t\ttext="{i18n>notFoundText}"\n\t\ticon="sap-icon://document"\n\t\tid="page"\n\t\tdescription=""><customDescription><Link id="link" text="{i18n>backToWorklist}" press=".onLinkPressed"/></customDescription></MessagePage></mvc:View>',
	"sap/Beutlhauser/HandOverProtocolEditLayout/view/SelectProductLineForMainDialog.view.xml":'<mvc:View controllerName="sap.Beutlhauser.HandOverProtocolEditLayout.controller.SelectProductLineForMainDialog"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"><SelectDialog title="Produktlinie auswählen" confirm=".onSelectProductLine" search=".onSearchProductLines" items="{path: \'handoverLayout>/ProductLineSet\', filters: [{path: \'Stufe\', operator: \'EQ\', value1: \'3\'}]}"><StandardListItem title="{handoverLayout>Description}"\n        info="{= ${handoverLayout>LayoutExists} === true ? \'Layout vorhanden\' : \'kein Layout vorhanden\'}" \n        infoState="{= ${handoverLayout>LayoutExists} === true ? \'Success\' : \'Warning\'}"\n        iconDensityAware="false" iconInset="false" type="Active" /></SelectDialog></mvc:View>'
}});
