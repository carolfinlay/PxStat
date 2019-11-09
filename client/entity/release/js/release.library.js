/*******************************************************************************
Custom JS application specific
*******************************************************************************/

//#region Add Namespace
app.release = {};
app.release.RlsCode = null;
app.release.RlsCodePrevious = null;
app.release.MtrCode = null;
app.release.SbjCode = null;
app.release.PrcCode = null;
app.release.RlsReservationFlag = null;
app.release.RlsArchiveFlag = null;

app.release.isModerator = true;
app.release.isApprover = false;

app.release.isLive = false;
app.release.isPending = false;
app.release.isHistorical = false;
app.release.isWorkInProgress = false;
app.release.isWorkflowInProgress = false;

app.release.fileContent = null;
app.release.fileType = null;
app.release.fileName = null;

app.release.ajax = {};
app.release.callback = {};

app.release.goTo = {};
app.release.goTo.MtrCode = null;
app.release.goTo.RlsCode = null;
//#endregion

//#region GoTo
/**
* 
 * @param {*} mtrCode
 * @param {*} rlsCode
 */
app.release.goTo.load = function (mtrCode, rlsCode) {
  //Default params
  app.release.MtrCode = mtrCode || app.release.goTo.MtrCode;
  app.release.RlsCode = rlsCode || app.release.goTo.RlsCode;

  // Reset goTo 
  app.release.goTo.MtrCode = null;
  app.release.goTo.RlsCode = null;

  // Load List of Releases from goTo
  if (app.release.MtrCode) {
    /*  Multi-steps:
      *  1. Set the Value
      *  2. Trigger Change to display the set Value above
      *  3. Trigger type: 'select2:select' to load the Select2 object 
      */
    $("#release-search").find("[name=mtr-code]").val(app.release.MtrCode).trigger("change").trigger({
      type: 'select2:select',
      params: {
        data: $("#release-search").find("[name=mtr-code]").select2('data')[0]
      }
    });
  }

  // Load a Release from goTo
  if (app.release.RlsCode) {
    // Load Release
    app.release.read();
  }
};
//#endregion

//#region Release
/**
 * 
 */
app.release.read = function () {
  // Read the previous Release Code
  app.release.comparison.ajax.readRlsCodePrevious();

  // Load first the privileges then the release
  app.release.ajax.isModerator();
};

/**
 * 
 */
app.release.ajax.isModerator = function () {
  api.ajax.jsonrpc.request(
    app.config.url.api.private,
    "PxStat.Security.Account_API.ReadIsModerator",
    null,
    "app.release.callback.isModerator",
    null,
    null,
    null,
    { async: false });
};

/**
* 
 * @param {*} response
 */
app.release.callback.isModerator = function (response) {
  if (response.error) {
    api.modal.error(response.error.message);
  }
  else if (response.data !== undefined) {
    // Store for later use
    app.release.isModerator = response.data;
    app.release.ajax.isApprover();
  }
  // Handle Exception
  else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * 
 */
app.release.ajax.isApprover = function () {
  api.ajax.jsonrpc.request(
    app.config.url.api.private,
    "PxStat.Security.Account_API.ReadIsApprover",
    { RlsCode: app.release.RlsCode },
    "app.release.callback.isApprover",
    null,
    null,
    null,
    { async: false });
};

/**
 * 
 */
app.release.callback.isApprover = function (response) {

  if (response.error) {
    api.modal.error(response.error.message);
  }
  else if (response.data !== undefined) {
    // Store for later use
    app.release.isApprover = response.data;

    app.release.information.read();
    app.release.source.read();
    app.release.workflow.read();
    app.release.workflow.history.read();
  }
  // Handle Exception
  else api.modal.exception(app.label.static["api-ajax-exception"]);
};

//#endregion

//#region Miscellaneous

/**
* 
 * @param {*} data
 */
app.release.checkStatusLive = function (data) {
  var now = Date.now();
  var dateFrom = (data.RlsLiveDatetimeFrom == null) ? null : Date.parse(data.RlsLiveDatetimeFrom);
  var dateTo = (data.RlsLiveDatetimeTo == null) ? null : Date.parse(data.RlsLiveDatetimeTo);
  if (
    (data.RlsVersion != 0 && data.RlsRevision == 0) && (dateFrom && dateFrom < now && (!dateTo || dateTo > now))) {
    return true;
  }
  return false;
};

/**
* 
 * @param {*} data
 */
app.release.checkStatusPending = function (data) {
  var now = Date.now();
  var dateFrom = (data.RlsLiveDatetimeFrom == null) ? null : Date.parse(data.RlsLiveDatetimeFrom);
  var dateTo = (data.RlsLiveDatetimeTo == null) ? null : Date.parse(data.RlsLiveDatetimeTo);

  if (
    (data.RlsVersion != 0 && data.RlsRevision == 0) &&
    (dateFrom && dateFrom > now && (!dateTo || dateTo > now))) {
    return true;
  }

  return false;
};

/**
* 
 * @param {*} data
 */
app.release.checkStatusHistorical = function (data) {
  var now = Date.now();
  var dateFrom = (data.RlsLiveDatetimeFrom == null) ? null : Date.parse(data.RlsLiveDatetimeFrom);
  var dateTo = (data.RlsLiveDatetimeTo == null) ? null : Date.parse(data.RlsLiveDatetimeTo);
  if (
    (data.RlsVersion != 0 && data.RlsRevision == 0) &&
    (dateFrom && dateFrom < now && dateTo && dateTo < now)) {
    return true;
  }
  return false;
};

/**
* 
 * @param {*} data
 */
app.release.checkStatusWorkInProgress = function (data) {
  var now = Date.now();
  var dateFrom = (data.RlsLiveDatetimeFrom == null) ? null : Date.parse(data.RlsLiveDatetimeFrom);
  var dateTo = (data.RlsLiveDatetimeTo == null) ? null : Date.parse(data.RlsLiveDatetimeTo);
  if (
    data.RlsRevision != 0 &&
    (!dateFrom && !dateTo)) {
    return true;
  }
  return false;
};

/**
 * Render the Release Status
 * @param {*} data 
 */
app.release.renderStatus = function (data) {
  // Live Release
  if (app.release.checkStatusLive(data)) {
    return $("<span>", {
      class: "badge badge-danger p-2",
      text: app.label.static["live"]
    }).get(0).outerHTML;
  }

  // Pending Release
  if (app.release.checkStatusPending(data)) {
    return $("<span>", {
      class: "badge badge-warning p-2",
      text: app.label.static["pending-live"]
    }).get(0).outerHTML;
  }

  // Historical Release
  if (app.release.checkStatusHistorical(data)) {
    return $("<span>", {
      class: "badge badge-dark p-2",
      text: app.label.static["historical"]
    }).get(0).outerHTML;
  }

  // Work in Progress Release
  if (app.release.checkStatusWorkInProgress(data)) {
    return $("<span>", {
      class: "badge badge-secondary p-2",
      text: app.label.static["work-in-progress"]
    }).get(0).outerHTML;
  }

  // Not Available (this should never happen)
  return $("<span>", {
    class: "badge badge-secondary p-2",
    text: app.label.static["n-a"]
  }).get(0).outerHTML;
};
//#endregion