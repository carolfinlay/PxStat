/*******************************************************************************
Application - Plugin - sanitise
*******************************************************************************/

// Sanitise constants for Casing
const C_SANITISE_UPPERCASE = "C_SANITISE_UPPERCASE";
const C_SANITISE_LOWERCASE = "C_SANITISE_LOWERCASE";
const C_SANITISE_NOCASE = "C_SANITISE_NOCASE";

String.prototype.sanitise = String.prototype.sanitise || function (pCase, pRegex, pNoTrim) {
  pCase = pCase || C_SANITISE_NOCASE;
  pRegex = pRegex || null;
  pNoTrim = pNoTrim || false;

  var value = this;

  if (!pNoTrim) {
    //trim the value
    value = value.trim();
  }
  if (pRegex) {
    // Sanitise according to the regex      
    value = value.replace(pRegex, "");
  }
  // Format case accordingly
  switch (pCase) {
    case C_SANITISE_UPPERCASE:
      value = value.toUpperCase(value);
      break;
    case C_SANITISE_LOWERCASE:
      value = value.toLowerCase(value);
      break;
    case C_SANITISE_NOCASE:
    default:
      // Do nothing
      break;
  }

  return value;
};

/*******************************************************************************
Application - Plugin - Moment for Datatable
*******************************************************************************/
$.fn.dataTable.moment(app.config.mask.datetime.display);

/*******************************************************************************
Application - Plugin - onSanitise
*******************************************************************************/

/**
 * Sanitise a form on event
 */
jQuery.fn.onSanitiseForm = function (pEvent, pHtmlEntities) {
  pEvent = pEvent || "keyup change";
  pHtmlEntities = pHtmlEntities || false;

  if (!pHtmlEntities) {
    this.find("input, textarea").each(function () {
      $(this).off(pEvent).bind(pEvent, function () {
        //strip HTMl
        this.value = this.value.replace(C_APP_REGEX_NOHTML, "");
        //convert HTML entities
        this.value = $(this).html(this.value).text();
      });
    });
  }
  return this;
};
/*******************************************************************************
Application - Plugin - Extend JQuery Validator - https://jqueryvalidation.org/
*******************************************************************************/

/**
 * Validation noLeadingTrailingSpace TO BE DELETED 
 */
jQuery.validator.addMethod("noLeadingTrailingSpace", function (value, element) {
  return this.optional(element) || /^([^\s][A-Za-z0-9.,\s]*[^\s])$/i.test(value);
  //return this.optional(element) || /^(?=[A-Za-z0-9])([A-Za-z0-9.,\h]*)(?<=[A-Za-z0-9])$/i.test(value);
}, app.label.static["no-leading-trailing-space"]);

/**
 * Validation required fields
 */
jQuery.validator.addMethod("required", function (value, element) {
  value = $.trim(value);
  return value.length ? true : false;
}, app.label.static["mandatory"]);


/**
 * Validation validEmailAddress
 */
jQuery.validator.addMethod("validEmailAddress", function (value, element) {
  return this.optional(element) || C_APP_REGEX_EMAIL.test(value);
}, app.label.static["invalid-format"]);

/**
 * Validation validPhoneNumber
 */
jQuery.validator.addMethod("validPhoneNumber", function (value, element) {
  var pattern = new RegExp(app.config.regex.phone.pattern);
  return this.optional(element) || pattern.test(value);
  //app.config.regex.phone.pattern
}, app.label.dynamic["invalid-phone-format"].sprintf([app.config.regex.phone.placeholder]));


/**
 * Validation ip Mask
 */
jQuery.validator.addMethod("validIpMask", function (value, element) {
  return this.optional(element) || C_APP_REGEX_IP_MASK.test(value);
}, app.label.static["invalid-ip-mask"]);

/**
 * Validation ip address
 */
jQuery.validator.addMethod("validIp", function (value, element) {
  return this.optional(element) || C_APP_REGEX_IP.test(value);
}, app.label.static["invalid-ip-address"]);


jQuery.validator.addMethod("notEqual", function (value, element, param) {
  return this.optional(element) || value != $(param).val();
}, app.label.static["statistic-label-not-equal-to-error-message"]);


/*******************************************************************************
Application - Plugin - Extend JQuery Validator - https://jqueryvalidation.org/ - translate messages
*******************************************************************************/

jQuery.extend(jQuery.validator.messages, {
  "url": app.label.static["please-enter-a-valid-url"]
});

/*******************************************************************************
Application - Plugin - load tinyMce library with key https://www.tiny.cloud/
*******************************************************************************/

//Load dynamically the source of TinyMce by using the API Key
loadTinyMce();
function loadTinyMce() {
  var tinyMce = document.createElement('script');
  tinyMce.src = app.config.plugin.tinymce.apiURL.sprintf([app.config.plugin.tinymce.apiKey]);
  document.head.appendChild(tinyMce);
}

/*******************************************************************************
Application - Plugin - load ShareThis library with key https://sharethis.com/
*******************************************************************************/

//Load dynamically the source of TinyMce by using the API Key
loadShareThis();
function loadShareThis() {
  var shareThis = document.createElement('script');
  shareThis.src = app.config.plugin.sharethis.apiURL.sprintf([app.config.plugin.sharethis.apiKey]);
  document.head.appendChild(shareThis);
}

/*******************************************************************************
Application - Plugin - JQuery extensions
*******************************************************************************/

//Unbind all events prior to binding a new event using .on
(function ($) {
  $.fn.once = function () {
    return this.off(arguments[0]).on.apply(this, arguments);
  };
})(jQuery);

/*******************************************************************************
Application - Plugin - Datatable
*******************************************************************************/

// Extend the datatable configuration with the language parameters
jQuery.extend(app.config.plugin.datatable, app.label.datatable);

/*******************************************************************************
Application - Plugin - Highcharts
*******************************************************************************/

if (app.config.plugin.highcharts.enabled
  && !jQuery.isEmptyObject(app.label.plugin.highcharts.lang)) {
  Highcharts.setOptions({
    // Extend the Highcharts lang 
    lang: app.label.plugin.highcharts.lang
  });
}

/*******************************************************************************
Application - Plugin - Google Charts
*******************************************************************************/

google.charts.load('current', { 'packages': ['corechart'], 'language': app.label.language.iso.code });

/*******************************************************************************
Application - Plugin - Bootstrap
*******************************************************************************/

// For modal over modal scenario such as confirm. 
// When top modal closed, we need to be able to scroll on existing modal by adding modal-open class to body
// https://stackoverflow.com/questions/28077066/bootstrap-modal-issue-scrolling-gets-disabled comment 34
$(document).ready(function () {
  $('body').on('hidden.bs.modal', function () {
    if ($('.modal.show').length > 0) {
      $('body').addClass('modal-open');
    }
  });
});

/*******************************************************************************
Application - Plugin - Cookie consent
*******************************************************************************/

$(document).ready(function () {
  // Set the options from the config and the label
  window.cookieconsent.initialise($.extend({}, app.config.plugin.cookieConsent, app.label.plugin.cookieConsent));

  // Bind load
  $(".cc-link").one('click', function (e) {
    e.preventDefault();

    // Load the Privacy (language specific) into the Modal
    api.content.load("#modal-read-privacy .modal-body", "internationalisation/privacy/" + app.label.language.iso.code + ".html");
    $("#modal-read-privacy").modal("show");
  });
});