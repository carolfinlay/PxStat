/*******************************************************************************
Custom JS application specific
*******************************************************************************/
$(document).ready(function () {

    // Bind events
    $("#release-source").find("[name=lng-iso-code]").once("change", app.release.source.languageOnChange);
    $("#release-source").find("[name=download-source]").once("click", app.release.source.download);
    $("#release-source").find("[name=view-source]").once("click", app.release.source.view);

    // Load HTML for Data Set Modal 
    api.content.load("#data-view-modal #data-dataset-row", "entity/data/index.dataset.html");
    api.content.load("#data-view-modal #data-dataview-row", "entity/data/index.dataview.html");

    app.library.html.parseStaticLabel();
});

