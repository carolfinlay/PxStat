/*******************************************************************************
Custom JS application specific
*******************************************************************************/
app.build.upload_panel = {};
app.build.upload_panel.language = {};
app.build.upload_panel.language.ajax = {};
app.build.upload_panel.language.callback = {};
app.build.upload_panel.copyright = {};
app.build.upload_panel.copyright.ajax = {};
app.build.upload_panel.copyright.callback = {};
app.build.upload_panel.format = {};
app.build.upload_panel.format.ajax = {};
app.build.upload_panel.format.callback = {};
//#region Copy types

/**
 *Call Ajax for read
 */
app.build.upload_panel.format.ajax.read = function () {
  api.ajax.jsonrpc.request(
    app.config.url.api.public,
    "PxStat.System.Settings.Format_API.Read",
    {
      "FrmDirection": C_APP_TS_FORMAT_DIRECTION_UPLOAD
    },
    "app.build.upload_panel.format.callback.read"
  );
};

/**
 * Callback for read
 * @param {*} response
 */
app.build.upload_panel.format.callback.read = function (response) {
  if (response.error) {
    // Handle the Error in the Response first
    api.modal.error(response.error.message);
  } else if (response.data !== undefined) {
    // Handle the Data in the Response then
    app.build.upload_panel.format.callback.drawDataTable(response.data);
  }
  // Handle Exception
  else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw datatable after read from database
 * @param {*} data
 */
app.build.upload_panel.format.callback.drawDataTable = function (data) {

  var localOptions = {
    data: data,
    columns: [{ data: "FrmType" }, { data: "FrmVersion" }],
    "order": [[1, "desc"]],
    //Translate labels language
    language: app.label.plugin.datatable
  };

  $("#build-upload-panel-container").find("table[name=format-table]").DataTable($.extend(true, {}, app.config.plugin.datatable, localOptions));
};
//#endregion

//#region Read Copied

/**
 * copyright Draw Data table 
 * @param {*} data
 */
app.build.upload_panel.copyright.drawDatatable = function (data) {
  if ($.fn.dataTable.isDataTable("#build-upload-panel-container table[name=copyright-table]")) {
    app.library.datatable.reDraw("#build-upload-panel-container table[name=copyright-table]", data);
  } else {

    var localOptions = {
      createdRow: function (row, dataRow, dataIndex) {
        $(row).attr("idn", dataRow.CprCode);
        $(row).attr("CprUrl", dataRow.CprUrl);
      },
      data: data,
      columns: [
        { data: "CprCode" },
        { data: "CprValue" }
      ],
      //Translate labels language
      language: app.label.plugin.datatable
    };

    $("#build-upload-panel-container").find("table[name=copyright-table]").DataTable($.extend(true, {}, app.config.plugin.datatable, localOptions));
  }
};

/**
 * Read data table form server
 */
app.build.upload_panel.copyright.ajax.read = function () {
  api.ajax.jsonrpc.request(
    app.config.url.api.private,
    "PxStat.System.Settings.Copyright_API.Read",
    { CprCode: null },
    "app.build.upload_panel.copyright.callback.read"
  );
};

/**
 * Callback from server after reading data
 * @param {*} response
 */
app.build.upload_panel.copyright.callback.read = function (response) {
  if (response.error) {
    // Handle the Error in the Response first
    api.modal.error(response.error.message);
  } else if (response.data !== undefined) {
    // Handle the Data in the Response then
    app.build.upload_panel.copyright.drawDatatable(response.data);
  }
  // Handle Exception
  else api.modal.exception(app.label.static["api-ajax-exception"]);
};
//#endregion

/**
 * Draw Data Table Formats
 * @param {*} data
 */
app.build.upload_panel.drawDataTableFormats = function (data) {

  var localOptions = {
    createdRow: function (row, dataRow, dataIndex) {
      $(row).attr("idn", dataRow.FrtValue);
    },
    data: data,
    columns: [{ data: "FrtValue" }, { data: "FrvValue" }],
    //Translate labels language
    language: app.label.plugin.datatable
  };

  $("#build-upload-panel-container").find("table[name=format-table]").DataTable($.extend(true, {}, app.config.plugin.datatable, localOptions));

};

//#region Read Language

/**
 *Call Ajax for read
 */
app.build.upload_panel.language.ajax.read = function () {
  api.ajax.jsonrpc.request(
    app.config.url.api.public,
    "PxStat.System.Settings.Language_API.Read",
    { LngIsoCode: null },
    "app.build.upload_panel.language.callback.read"
  );
};

/**
 * Populate table
 * @param {*} data
 */
app.build.upload_panel.language.callback.drawDataTable = function (data) {
  if ($.fn.dataTable.isDataTable("#build-upload-panel-container table[name=language-table]")) {
    app.library.datatable.reDraw("#build-upload-panel-container table[name=language-table]", data);
  } else {

    var localOptions = {
      createdRow: function (row, dataRow, dataIndex) {
        $(row).attr("idn", dataRow.LngIsoCode);
      },
      data: data,
      columns: [{ data: "LngIsoCode" }, { data: "LngIsoName" }],
      //Translate labels language
      language: app.label.plugin.datatable
    };

    $("#build-upload-panel-container").find("table[name=language-table]").DataTable($.extend(true, {}, app.config.plugin.datatable, localOptions));

  }
};

/**
 * Callback for read
 * @param {*} response
 */
app.build.upload_panel.language.callback.read = function (response) {
  if (response.error) {
    // Handle the Error in the Response first
    api.modal.error(response.error.message);
  } else if (response.data !== undefined) {
    // Handle the Data in the Response then
    app.build.upload_panel.language.callback.drawDataTable(response.data);
  }
  // Handle Exception
  else api.modal.exception(app.label.static["api-ajax-exception"]);
};

//#endregion