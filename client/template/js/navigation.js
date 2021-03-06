/*******************************************************************************
Navigation
*******************************************************************************/

//#region Data

$(document).ready(function () {
  //#region Dashboard
  api.content.navigate(
    "#nav-link-dashboard",
    "entity/dashboard/",
    "#nav-link-dashboard"
  );
  //#endregion

  //#region Data
  api.content.navigate(
    "#nav-link-data",
    "entity/data/",
    "#nav-link-data"
  );
  //#endregion

  //#region Dashboard
  api.content.navigate(
    "#nav-link-dashboard",
    "entity/dashboard/",
    "#nav-link-dashboard"
  );
  //#endregion

  //#region Build
  api.content.navigate(
    "#nav-link-create",
    "entity/build/create/",
    "#nav-link-create",
    "#nav-link-build"
  );
  api.content.navigate(
    "#nav-link-update",
    "entity/build/update/",
    "#nav-link-update",
    "#nav-link-build"
  );

  //#endregion

  //#region Upload
  api.content.navigate(
    "#nav-link-upload",
    "entity/build/upload/",
    "#nav-link-upload",
    "#nav-link-build"
  );
  //#endregion

  //#region Release
  api.content.navigate(
    "#nav-link-release",
    "entity/release/",
    "#nav-link-release"
  );
  //#endregion

  //#region Analytics
  api.content.navigate(
    "#nav-link-analytic",
    "entity/analytic/",
    "#nav-link-analytic"
  );
  //#endregion

  //#region Manage
  api.content.navigate(
    "#nav-link-user",
    "entity/manage/user/",
    "#nav-link-user",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-group",
    "entity/manage/group/",
    "#nav-link-group",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-keyword-subject",
    "entity/keyword/subject/",
    "#nav-link-keyword-subject",
    "#nav-link-keyword"
  );
  api.content.navigate(
    "#nav-link-keyword-product",
    "entity/keyword/product/",
    "#nav-link-keyword-product",
    "#nav-link-keyword"
  );
  api.content.navigate(
    "#nav-link-alert",
    "entity/manage/alert/",
    "#nav-link-alert",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-email",
    "entity/manage/email/",
    "#nav-link-email",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-tracing",
    "entity/manage/tracing/",
    "#nav-link-tracing",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-logging",
    "entity/manage/logging/",
    "#nav-link-logging",
    "#nav-link-manage"
  );
  //#endregion

  //#region Configuration
  api.content.navigate(
    "#nav-link-language",
    "entity/configuration/language/",
    "#nav-link-language",
    "#nav-link-configuration"
  );
  api.content.navigate(
    "#nav-link-format",
    "entity/configuration/format/",
    "#nav-link-format",
    "#nav-link-configuration"
  );
  api.content.navigate(
    "#nav-link-copyright",
    "entity/configuration/copyright/",
    "#nav-link-copyright",
    "#nav-link-configuration"
  );
  api.content.navigate(
    "#nav-link-reason",
    "entity/configuration/reason/",
    "#nav-link-reason",
    "#nav-link-configuration"
  );
  //#endregion

  //#region Keyword
  api.content.navigate(
    "#nav-link-subject",
    "entity/manage/subject/",
    "#nav-link-subject",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-product",
    "entity/manage/product/",
    "#nav-link-product",
    "#nav-link-manage"
  );
  api.content.navigate(
    "#nav-link-keyword-release",
    "entity/keyword/release/",
    "#nav-link-keyword-release",
    "#nav-link-keyword"
  );
  //#endregion

  // Set current user's access
  app.navigation.access.ajax.set();

  // Set language dropdown
  app.navigation.language.ajax.read();
});
