/*
 * Inline Form Validation Engine 2.6.2, jQuery plugin
 *
 * Copyright(c) 2010, Cedric Dugas
 * http://www.position-absolute.com
 *
 * 2.0 Rewrite by Olivier Refalo
 * http://www.crionics.com
 *
 * Form validation engine allowing custom regex rules to be added.
 * Licensed under the MIT License
 */
 (function($) {

	"use strict";

	var methods = {

		/**
		* Kind of the constructor, called before any action
		* @param {Map} user options
		*/
		init: function(options) {
			var form = this;
			if (!form.data('jqv') || form.data('jqv') == null ) {
				options = methods._saveOptions(form, options);
				// bind all formError elements to close on click
				$(document).on("click", ".formError", function() {
					$(this).fadeOut(150, function() {
						// remove prompt once invisible
						$(this).closest('.formError').remove();
					});
				});
			}
			return this;
		 },
		/**
		* Attachs jQuery.validationEngine to form.submit and field.blur events
		* Takes an optional params: a list of options
		* ie. jQuery("#formID1").validationEngine('attach', {promptPosition : "centerRight"});
		*/
		attach: function(userOptions) {

			var form = this;
			var options;

			if(userOptions)
				options = methods._saveOptions(form, userOptions);
			else
				options = form.data('jqv');

			options.validateAttribute = (form.find("[data-validation-engine*=validate]").length) ? "data-validation-engine" : "class";
			if (options.binded) {

				// delegate fields
				form.on(options.validationEventTrigger, "["+options.validateAttribute+"*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", methods._onFieldEvent);
				form.on("click", "["+options.validateAttribute+"*=validate][type=checkbox],["+options.validateAttribute+"*=validate][type=radio]", methods._onFieldEvent);
				form.on(options.validationEventTrigger,"["+options.validateAttribute+"*=validate][class*=datepicker]", {"delay": 300}, methods._onFieldEvent);
			}
			if (options.autoPositionUpdate) {
				$(window).bind("resize", {
					"noAnimation": true,
					"formElem": form
				}, methods.updatePromptsPosition);
			}
			form.on("click","a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
			form.removeData('jqv_submitButton');

			// bind form.submit
			form.on("submit", methods._onSubmitEvent);
			return this;
		},
		/**
		* Unregisters any bindings that may point to jQuery.validaitonEngine
		*/
		detach: function() {

			var form = this;
			var options = form.data('jqv');

			// unbind fields
			form.off(options.validationEventTrigger, "["+options.validateAttribute+"*=validate]:not([type=checkbox]):not([type=radio]):not(.datepicker)", methods._onFieldEvent);
			form.off("click", "["+options.validateAttribute+"*=validate][type=checkbox],["+options.validateAttribute+"*=validate][type=radio]", methods._onFieldEvent);
			form.off(options.validationEventTrigger,"["+options.validateAttribute+"*=validate][class*=datepicker]", methods._onFieldEvent);

			// unbind form.submit
			form.off("submit", methods._onSubmitEvent);
			form.removeData('jqv');

			form.off("click", "a[data-validation-engine-skip], a[class*='validate-skip'], button[data-validation-engine-skip], button[class*='validate-skip'], input[data-validation-engine-skip], input[class*='validate-skip']", methods._submitButtonClick);
			form.removeData('jqv_submitButton');

			if (options.autoPositionUpdate)
				$(window).off("resize", methods.updatePromptsPosition);

			return this;
		},
		/**
		* Validates either a form or a list of fields, shows prompts accordingly.
		* Note: There is no ajax form validation with this method, only field ajax validation are evaluated
		*
		* @return true if the form validates, false if it fails
		*/
		validate: function(userOptions) {
			var element = $(this);
			var valid = null;
			var options;

			if (element.is("form") || element.hasClass("validationEngineContainer")) {
				if (element.hasClass('validating')) {
					// form is already validating.
					// Should abort old validation and start new one. I don't know how to implement it.
					return false;
				} else {
					element.addClass('validating');
					if(userOptions)
						options = methods._saveOptions(element, userOptions);
					else
						options = element.data('jqv');
					var valid = methods._validateFields(this);

					// If the form doesn't validate, clear the 'validating' class before the user has a chance to submit again
					setTimeout(function(){
						element.removeClass('validating');
					}, 100);
					if (valid && options.onSuccess) {
						options.onSuccess();
					} else if (!valid && options.onFailure) {
						options.onFailure();
					}
				}
			} else if (element.is('form') || element.hasClass('validationEngineContainer')) {
				element.removeClass('validating');
			} else {
				// field validation
				var form = element.closest('form, .validationEngineContainer'),
					options = (form.data('jqv')) ? form.data('jqv') : $.validationEngine.defaults,
					valid = methods._validateField(element, options);
			}
			if(options.onValidationComplete) {
				// !! ensures that an undefined return is interpreted as return false but allows a onValidationComplete() to possibly return true and have form continue processing
				return !!options.onValidationComplete(form, valid);
			}
			return valid;
		},
		/**
		*  Redraw prompts position, useful when you change the DOM state when validating
		*/
		updatePromptsPosition: function(event) {

			if (event && this == window) {
				var form = event.data.formElem;
				var noAnimation = event.data.noAnimation;
			}
			else
				var form = $(this.closest('form, .validationEngineContainer'));

			var options = form.data('jqv');
			// No option, take default one
			if (!options)
				options = methods._saveOptions(form, options);
			form.find('['+options.validateAttribute+'*=validate]').not(":disabled").each(function(){
				var field = $(this);
				if (options.prettySelect && field.is(":hidden"))
				  field = form.find("#" + options.usePrefix + field.attr('id') + options.useSuffix);
				var prompt = methods._getPrompt(field);
				var promptText = $(prompt).find(".formErrorContent").html();

				if(prompt)
					methods._updatePrompt(field, $(prompt), promptText, undefined, false, options, noAnimation);
			});
			return this;
		},
		/**
		* Displays a prompt on a element.
		* Note that the element needs an id!
		*
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {String} possible values topLeft, topRight, bottomLeft, centerRight, bottomRight
		*/
		showPrompt: function(promptText, type, promptPosition, showArrow) {
			var form = this.closest('form, .validationEngineContainer');
			var options = form.data('jqv');
			// No option, take default one
			if(!options)
				options = methods._saveOptions(this, options);
			if(promptPosition)
				options.promptPosition=promptPosition;
			options.showArrow = showArrow==true;

			methods._showPrompt(this, promptText, type, false, options);
			return this;
		},
		/**
		* Closes form error prompts, CAN be invidual
		*/
		hide: function() {
			 var form = $(this).closest('form, .validationEngineContainer');
			 var options = form.data('jqv');
			 // No option, take default one
			 if (!options)
				options = methods._saveOptions(form, options);
			 var fadeDuration = (options && options.fadeDuration) ? options.fadeDuration : 0.3;
			 var closingtag;

			 if($(this).is("form") || $(this).hasClass("validationEngineContainer")) {
				 closingtag = "parentForm"+methods._getClassName($(this).attr("id"));
			 } else {
				 closingtag = methods._getClassName($(this).attr("id")) +"formError";
			 }
			 $('.'+closingtag).fadeTo(fadeDuration, 0, function() {
				 $(this).closest('.formError').remove();
			 });
			 return this;
		 },
		 /**
		 * Closes all error prompts on the page
		 */
		 hideAll: function() {             
			 var form = this;
			 var options = form.data('jqv');
			 var duration = options ? options.fadeDuration:300;
			 $('.formError').fadeTo(duration, 0, function() {                 
				 $(this).closest('.formError').remove();
			 });
			 return this;
		 },
		/**
		* Typically called when user exists a field using tab or a mouse click, triggers a field
		* validation
		*/
		_onFieldEvent: function(event) {
			var field = $(this);
			var form = field.closest('form, .validationEngineContainer');
			var options = form.data('jqv');
			// No option, take default one
			if (!options)
				options = methods._saveOptions(form, options);
			options.eventTrigger = "field";

            if (options.notEmpty == true){

                if(field.val().length > 0){
                    // validate the current field
                    window.setTimeout(function() {
                        methods._validateField(field, options);
                    }, (event.data) ? event.data.delay : 0);

                }

            }else{

                // validate the current field
                window.setTimeout(function() {
                    methods._validateField(field, options);
                }, (event.data) ? event.data.delay : 0);

            }




		},
		/**
		* Called when the form is submited, shows prompts accordingly
		*
		* @param {jqObject}
		*            form
		* @return false if form submission needs to be cancelled
		*/
		_onSubmitEvent: function() {
			var form = $(this);
			var options = form.data('jqv');

			//check if it is trigger from skipped button
			if (form.data("jqv_submitButton")){
				var submitButton = $("#" + form.data("jqv_submitButton"));
				if (submitButton){
					if (submitButton.length > 0){
						if (submitButton.hasClass("validate-skip") || submitButton.attr("data-validation-engine-skip") == "true")
							return true;
					}
				}
			}

			options.eventTrigger = "submit";

			// validate each field
			// (- skip field ajax validation, not necessary IF we will perform an ajax form validation)
			var r=methods._validateFields(form);

			if (r && options.ajaxFormValidation) {
				methods._validateFormWithAjax(form, options);
				// cancel form auto-submission - process with async call onAjaxFormComplete
				return false;
			}

			if(options.onValidationComplete) {
				// !! ensures that an undefined return is interpreted as return false but allows a onValidationComplete() to possibly return true and have form continue processing
				return !!options.onValidationComplete(form, r);
			}
			return r;
		},
		/**
		* Return true if the ajax field validations passed so far
		* @param {Object} options
		* @return true, is all ajax validation passed so far (remember ajax is async)
		*/
		_checkAjaxStatus: function(options) {
			var status = true;
			$.each(options.ajaxValidCache, function(key, value) {
				if (!value) {
					status = false;
					// break the each
					return false;
				}
			});
			return status;
		},

		/**
		* Return true if the ajax field is validated
		* @param {String} fieldid
		* @param {Object} options
		* @return true, if validation passed, false if false or doesn't exist
		*/
		_checkAjaxFieldStatus: function(fieldid, options) {
			return options.ajaxValidCache[fieldid] == true;
		},
		/**
		* Validates form fields, shows prompts accordingly
		*
		* @param {jqObject}
		*            form
		* @param {skipAjaxFieldValidation}
		*            boolean - when set to true, ajax field validation is skipped, typically used when the submit button is clicked
		*
		* @return true if form is valid, false if not, undefined if ajax form validation is done
		*/
		_validateFields: function(form) {
			var options = form.data('jqv');

			// this variable is set to true if an error is found
			var errorFound = false;

			// Trigger hook, start validation
			form.trigger("jqv.form.validating");
			// first, evaluate status of non ajax fields
			var first_err=null;
			form.find('['+options.validateAttribute+'*=validate]').not(":disabled").each( function() {
				var field = $(this);
				var names = [];
				if ($.inArray(field.attr('name'), names) < 0) {
					errorFound |= methods._validateField(field, options);
					if (errorFound && first_err==null)
						if (field.is(":hidden") && options.prettySelect)
							first_err = field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
						else {

							//Check if we need to adjust what element to show the prompt on
							//and and such scroll to instead
							if(field.data('jqv-prompt-at') instanceof jQuery ){
								field = field.data('jqv-prompt-at');
							} else if(field.data('jqv-prompt-at')) {
								field = $(field.data('jqv-prompt-at'));
							}
							first_err=field;
						}
					if (options.doNotShowAllErrosOnSubmit)
						return false;
					names.push(field.attr('name'));

					//if option set, stop checking validation rules after one error is found
					if(options.showOneMessage == true && errorFound){
						return false;
					}
				}
			});

			// second, check to see if all ajax calls completed ok
			// errorFound |= !methods._checkAjaxStatus(options);

			// third, check status and scroll the container accordingly
			form.trigger("jqv.form.result", [errorFound]);

			if (errorFound) {
				if (options.scroll) {
					var destination=first_err.offset().top;
					var fixleft = first_err.offset().left;

					//prompt positioning adjustment support. Usage: positionType:Xshift,Yshift (for ex.: bottomLeft:+20 or bottomLeft:-20,+10)
					var positionType=options.promptPosition;
					if (typeof(positionType)=='string' && positionType.indexOf(":")!=-1)
						positionType=positionType.substring(0,positionType.indexOf(":"));

					if (positionType!="bottomRight" && positionType!="bottomLeft") {
						var prompt_err= methods._getPrompt(first_err);
						if (prompt_err) {
							destination=prompt_err.offset().top;
						}
					}

					// Offset the amount the page scrolls by an amount in px to accomodate fixed elements at top of page
					if (options.scrollOffset) {
						destination -= options.scrollOffset;
					}

					// get the position of the first error, there should be at least one, no need to check this
					//var destination = form.find(".formError:not('.greenPopup'):first").offset().top;
					if (options.isOverflown) {
						var overflowDIV = $(options.overflownDIV);
						if(!overflowDIV.length) return false;
						var scrollContainerScroll = overflowDIV.scrollTop();
						var scrollContainerPos = -parseInt(overflowDIV.offset().top);

						destination += scrollContainerScroll + scrollContainerPos - 5;
						var scrollContainer = $(options.overflownDIV).filter(":not(:animated)");

						scrollContainer.animate({ scrollTop: destination }, 1100, function(){
							if(options.focusFirstField) first_err.focus();
						});

					} else {
						$("html, body").animate({
							scrollTop: destination
						}, 1100, function(){
							if(options.focusFirstField) first_err.focus();
						});
						$("html, body").animate({scrollLeft: fixleft},1100)
					}

				} else if(options.focusFirstField)
					first_err.focus();
				return false;
			}
			return true;
		},
		/**
		* This method is called to perform an ajax form validation.
		* During this process all the (field, value) pairs are sent to the server which returns a list of invalid fields or true
		*
		* @param {jqObject} form
		* @param {Map} options
		*/
		_validateFormWithAjax: function(form, options) {

			var data = form.serialize();
									var type = (options.ajaxFormValidationMethod) ? options.ajaxFormValidationMethod : "GET";
			var url = (options.ajaxFormValidationURL) ? options.ajaxFormValidationURL : form.attr("action");
									var dataType = (options.dataType) ? options.dataType : "json";
			$.ajax({
				type: type,
				url: url,
				cache: false,
				dataType: dataType,
				data: data,
				form: form,
				methods: methods,
				options: options,
				beforeSend: function() {
					return options.onBeforeAjaxFormValidation(form, options);
				},
				error: function(data, transport) {
					if (options.onFailure) {
						options.onFailure(data, transport);
					} else {
						methods._ajaxError(data, transport);
					}
				},
				success: function(json) {
					if ((dataType == "json") && (json !== true)) {
						// getting to this case doesn't necessary means that the form is invalid
						// the server may return green or closing prompt actions
						// this flag helps figuring it out
						var errorInForm=false;
						for (var i = 0; i < json.length; i++) {
							var value = json[i];

							var errorFieldId = value[0];
							var errorField = $($("#" + errorFieldId)[0]);

							// make sure we found the element
							if (errorField.length == 1) {

								// promptText or selector
								var msg = value[2];
								// if the field is valid
								if (value[1] == true) {

									if (msg == ""  || !msg){
										// if for some reason, status==true and error="", just close the prompt
										methods._closePrompt(errorField);
									} else {
										// the field is valid, but we are displaying a green prompt
										if (options.allrules[msg]) {
											var txt = options.allrules[msg].alertTextOk;
											if (txt)
												msg = txt;
										}
										if (options.showPrompts) methods._showPrompt(errorField, msg, "pass", false, options, true);
									}
								} else {
									// the field is invalid, show the red error prompt
									errorInForm|=true;
									if (options.allrules[msg]) {
										var txt = options.allrules[msg].alertText;
										if (txt)
											msg = txt;
									}
									if(options.showPrompts) methods._showPrompt(errorField, msg, "", false, options, true);
								}
							}
						}
						options.onAjaxFormComplete(!errorInForm, form, json, options);
					} else
						options.onAjaxFormComplete(true, form, json, options);

				}
			});

		},
		/**
		* Validates field, shows prompts accordingly
		*
		* @param {jqObject}
		*            field
		* @param {Array[String]}
		*            field's validation rules
		* @param {Map}
		*            user options
		* @return false if field is valid (It is inversed for *fields*, it return false on validate and true on errors.)
		*/
		_validateField: function(field, options, skipAjaxValidation) {
			if (!field.attr("id")) {
				field.attr("id", "form-validation-field-" + $.validationEngine.fieldIdCounter);
				++$.validationEngine.fieldIdCounter;
			}

			if(field.hasClass(options.ignoreFieldsWithClass))
				return false;

           if (!options.validateNonVisibleFields && (field.is(":hidden") && !options.prettySelect || field.parent().is(":hidden")))
				return false;

			var rulesParsing = field.attr(options.validateAttribute);
			var getRules = /validate\[(.*)\]/.exec(rulesParsing);

			if (!getRules)
				return false;
			var str = getRules[1];
			var rules = str.split(/\[|,|\]/);

			// true if we ran the ajax validation, tells the logic to stop messing with prompts
			var isAjaxValidator = false;
			var fieldName = field.attr("name");
			var promptText = "";
			var promptType = "";
			var required = false;
			var limitErrors = false;
			options.isError = false;
			options.showArrow = true;

			// If the programmer wants to limit the amount of error messages per field,
			if (options.maxErrorsPerField > 0) {
				limitErrors = true;
			}

			var form = $(field.closest("form, .validationEngineContainer"));
			// Fix for adding spaces in the rules
			for (var i = 0; i < rules.length; i++) {
				rules[i] = rules[i].replace(" ", "");
				// Remove any parsing errors
				if (rules[i] === '') {
					delete rules[i];
				}
			}

			for (var i = 0, field_errors = 0; i < rules.length; i++) {

				// If we are limiting errors, and have hit the max, break
				if (limitErrors && field_errors >= options.maxErrorsPerField) {
					// If we haven't hit a required yet, check to see if there is one in the validation rules for this
					// field and that it's index is greater or equal to our current index
					if (!required) {
						var have_required = $.inArray('required', rules);
						required = (have_required != -1 &&  have_required >= i);
					}
					break;
				}


				var errorMsg = undefined;
				switch (rules[i]) {

					case "required":
						required = true;
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._required);
						break;
					case "custom":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._custom);
						break;
					case "pwvd":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._pwvd);
						break;
					case "chkpwd":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._chkpwd);
						break;
					case "chkikeypwd":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._chkikeypwd);
						break;
					case "numcheck":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._numcheck);
						break;
					case "newcolumn":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._newcolumn);
						break;
					case "recolumn":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._recolumn);
						break;
					case "verification_date":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._verification_date);
						break;
					case "verification_twodate":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._verification_twodate);
						break;
					case "groupRequired":
						// Check is its the first of group, if not, reload validation with first field
						// AND continue normal validation on present field
						var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
						var firstOfGroup = form.find(classGroup).eq(0);
						if(firstOfGroup[0] != field[0]){

							methods._validateField(firstOfGroup, options, skipAjaxValidation);
							options.showArrow = true;

						}
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._groupRequired);
						if(errorMsg)  required = true;
						options.showArrow = false;
						break;
					case "ajax":
						// AJAX defaults to returning it's loading message
						errorMsg = methods._ajax(field, rules, i, options);
						if (errorMsg) {
							promptType = "load";
						}
						break;
					case "minSize":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minSize);
						break;
					case "maxSize":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxSize);
						break;
					case "min":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._min);
						break;
					case "max":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._max);
						break;
					case "past":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._past);
						break;
					case "future":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._future);
						break;
					case "dateRange":
						var classGroup = "["+options.validateAttribute+"*=" + rules[i + 1] + "]";
						options.firstOfGroup = form.find(classGroup).eq(0);
						options.secondOfGroup = form.find(classGroup).eq(1);

						//if one entry out of the pair has value then proceed to run through validation
						if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
							errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._dateRange);
						}
						if (errorMsg) required = true;
						options.showArrow = false;
						break;

					case "dateTimeRange":
						var classGroup = "["+options.validateAttribute+"*=" + rules[i + 1] + "]";
						options.firstOfGroup = form.find(classGroup).eq(0);
						options.secondOfGroup = form.find(classGroup).eq(1);

						//if one entry out of the pair has value then proceed to run through validation
						if (options.firstOfGroup[0].value || options.secondOfGroup[0].value) {
							errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._dateTimeRange);
						}
						if (errorMsg) required = true;
						options.showArrow = false;
						break;
					case "maxCheckbox":
						field = $(form.find("input[name='" + fieldName + "']"));
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._maxCheckbox);
						break;
					case "minCheckbox":
						field = $(form.find("input[name='" + fieldName + "']"));
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._minCheckbox);
						break;
					case "equals":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._equals);
						break;
					case "equals2":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._equals2);
						break;
					case "notEquals":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._notEquals);
						break;
					case "funcCall":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._funcCall);
						break;
					case "creditCard":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._creditCard);
						break;
					case "condRequired":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._condRequired);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "funcCallRequired":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._funcCallRequired);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "branchId":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._branchId);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "_branchId_II":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._branchId_II);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "twDate":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._twDate);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "twYear":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._twYear);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "decimal":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._decimal);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "groupCheckbox":
						var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
						var firstOfGroup = form.find(classGroup).eq(0);
						if(firstOfGroup[0] != field[0]){

							methods._validateField(firstOfGroup, options, skipAjaxValidation);
							options.showArrow = true;

						}
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._groupCheckbox);
						if(errorMsg)  required = true;
						options.showArrow = false;
						break;
					case "notChinese":
						errorMsg = methods._getErrorMessage(form, field, rules[i], rules, i, options, methods._notChinese);
						if (errorMsg !== undefined) {
							required = true;
						}
						break;
					case "twPast":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._twPast);
						break;
					case "twFuture":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._twFuture);
						break;
					case "mutilIpv4":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._mutilIpv4);
						break;
					case "userId":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._userId);
						break;
					case "twIdCheck":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._twIdCheck);
						break;
					case "CCtwIdCheck":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._CCtwIdCheck);
						break;
					case "validate_CheckDateScope2":
						errorMsg = methods._getErrorMessage(form, field,rules[i], rules, i, options, methods._validate_CheckDateScope2);
						break;
					default:
				}

				var end_validation = false;

				// If we were passed back an message object, check what the status was to determine what to do
				if (typeof errorMsg == "object") {
					switch (errorMsg.status) {
						case "_break":
							end_validation = true;
							break;
						// If we have an error message, set errorMsg to the error message
						case "_error":
							errorMsg = errorMsg.message;
							break;
						// If we want to throw an error, but not show a prompt, return early with true
						case "_error_no_prompt":
							return true;
							break;
						// Anything else we continue on
						default:
							break;
					}
				}

				//funcCallRequired, first in rules, and has error, skip anything else
				if( i==0 && str.indexOf('funcCallRequired')==0 && errorMsg !== undefined ){
					promptText += errorMsg + "<br/>";
					options.isError=true;
					field_errors++;
					end_validation=true;
				}

				// If it has been specified that validation should end now, break
				if (end_validation) {
					break;
				}

				// If we have a string, that means that we have an error, so add it to the error message.
				if (typeof errorMsg == 'string') {
					promptText += errorMsg + "<br/>";
					options.isError = true;
					field_errors++;
				}
			}
			// If the rules required is not added, an empty field is not validated
			//the 3rd condition is added so that even empty password fields should be equal
			//otherwise if one is filled and another left empty, the "equal" condition would fail
			//which does not make any sense
			if(!required && !(field.val()) && field.val().length < 1 && $.inArray('equals', rules) < 0) options.isError = false;

			// Hack for radio/checkbox group button, the validation go into the
			// first radio/checkbox of the group
			var fieldType = field.prop("type");
			var positionType=field.data("promptPosition") || options.promptPosition;

			if ((fieldType == "radio" || fieldType == "checkbox") && form.find("input[name='" + fieldName + "']").length > 1) {
				if(positionType === 'inline') {
					field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:last"));
				} else {
				field = $(form.find("input[name='" + fieldName + "'][type!=hidden]:first"));
				}
				options.showArrow = options.showArrowOnRadioAndCheckbox;
			}

			if(field.is(":hidden") && options.prettySelect) {
				field = form.find("#" + options.usePrefix + methods._jqSelector(field.attr('id')) + options.useSuffix);
			}

			if (options.isError && options.showPrompts){
				methods._showPrompt(field, promptText, promptType, false, options);
			}else{
				if (!isAjaxValidator) methods._closePrompt(field);
			}

			if (!isAjaxValidator) {
				field.trigger("jqv.field.result", [field, options.isError, promptText]);
			}

			/* Record error */
			var errindex = $.inArray(field[0], options.InvalidFields);
			if (errindex == -1) {
				if (options.isError)
				options.InvalidFields.push(field[0]);
			} else if (!options.isError) {
				options.InvalidFields.splice(errindex, 1);
			}

			methods._handleStatusCssClasses(field, options);

			/* run callback function for each field */
			if (options.isError && options.onFieldFailure)
				options.onFieldFailure(field);

			if (!options.isError && options.onFieldSuccess)
				options.onFieldSuccess(field);

			return options.isError;
		},
		/**
		* Handling css classes of fields indicating result of validation
		*
		* @param {jqObject}
		*            field
		* @param {Array[String]}
		*            field's validation rules
		* @private
		*/
		_handleStatusCssClasses: function(field, options) {
			/* remove all classes */
			if(options.addSuccessCssClassToField)
				field.removeClass(options.addSuccessCssClassToField);

			if(options.addFailureCssClassToField)
				field.removeClass(options.addFailureCssClassToField);

			/* Add classes */
			if (options.addSuccessCssClassToField && !options.isError)
				field.addClass(options.addSuccessCssClassToField);

			if (options.addFailureCssClassToField && options.isError)
				field.addClass(options.addFailureCssClassToField);
		},

		 /********************
		  * _getErrorMessage
		  *
		  * @param form
		  * @param field
		  * @param rule
		  * @param rules
		  * @param i
		  * @param options
		  * @param originalValidationMethod
		  * @return {*}
		  * @private
		  */
		 _getErrorMessage:function (form, field, rule, rules, i, options, originalValidationMethod) {
			 // If we are using the custon validation type, build the index for the rule.
			 // Otherwise if we are doing a function call, make the call and return the object
			 // that is passed back.
	 		 var rule_index = jQuery.inArray(rule, rules);
			 if (rule === "custom" || rule === "funcCall" || rule === "funcCallRequired") {
				 var custom_validation_type = rules[rule_index + 1];
				 rule = rule + "[" + custom_validation_type + "]";
				 // Delete the rule from the rules array so that it doesn't try to call the
			    // same rule over again
			    delete(rules[rule_index]);
			 }
			 // Change the rule to the composite rule, if it was different from the original
			 var alteredRule = rule;


			 var element_classes = (field.attr("data-validation-engine")) ? field.attr("data-validation-engine") : field.attr("class");
			 var element_classes_array = element_classes.split(" ");

			 // Call the original validation method. If we are dealing with dates or checkboxes, also pass the form
			 var errorMsg;
			 if (rule == "future" || rule == "past"  || rule == "maxCheckbox" || rule == "minCheckbox" || rule == "twPast" || rule == "twFuture") {
				 errorMsg = originalValidationMethod(form, field, rules, i, options);
			 } else {
				 errorMsg = originalValidationMethod(field, rules, i, options);
			 }

			 // If the original validation method returned an error and we have a custom error message,
			 // return the custom message instead. Otherwise return the original error message.
			 if (errorMsg != undefined) {
				 var custom_message = methods._getCustomErrorMessage($(field), element_classes_array, alteredRule, options);
				 if (custom_message) errorMsg = custom_message;
			 }
			 return errorMsg;

		 },
		 _getCustomErrorMessage:function (field, classes, rule, options) {
			var custom_message = false;
			var validityProp = /^custom\[.*\]$/.test(rule) ? methods._validityProp["custom"] : methods._validityProp[rule];
			 // If there is a validityProp for this rule, check to see if the field has an attribute for it
			if (validityProp != undefined) {
				custom_message = field.attr("data-errormessage-"+validityProp);
				// If there was an error message for it, return the message
				if (custom_message != undefined)
					return custom_message;
			}
			custom_message = field.attr("data-errormessage");
			 // If there is an inline custom error message, return it
			if (custom_message != undefined)
				return custom_message;
			var id = '#' + field.attr("id");
			// If we have custom messages for the element's id, get the message for the rule from the id.
			// Otherwise, if we have custom messages for the element's classes, use the first class message we find instead.
			if (typeof options.custom_error_messages[id] != "undefined" &&
				typeof options.custom_error_messages[id][rule] != "undefined" ) {
						  custom_message = options.custom_error_messages[id][rule]['message'];
			} else if (classes.length > 0) {
				for (var i = 0; i < classes.length && classes.length > 0; i++) {
					 var element_class = "." + classes[i];
					if (typeof options.custom_error_messages[element_class] != "undefined" &&
						typeof options.custom_error_messages[element_class][rule] != "undefined") {
							custom_message = options.custom_error_messages[element_class][rule]['message'];
							break;
					}
				}
			}
			if (!custom_message &&
				typeof options.custom_error_messages[rule] != "undefined" &&
				typeof options.custom_error_messages[rule]['message'] != "undefined"){
					 custom_message = options.custom_error_messages[rule]['message'];
			 }
			 return custom_message;
		 },
		 _validityProp: {
			 "required": "value-missing",
			 "custom": "custom-error",
			 "groupRequired": "value-missing",
			 "newcolumn": "value-missing",
			 "recolumn": "value-missing",
			 "ajax": "custom-error",
			 "minSize": "range-underflow",
			 "maxSize": "range-overflow",
			 "min": "range-underflow",
			 "max": "range-overflow",
			 "past": "type-mismatch",
			 "future": "type-mismatch",
			 "dateRange": "type-mismatch",
			 "dateTimeRange": "type-mismatch",
			 "maxCheckbox": "range-overflow",
			 "minCheckbox": "range-underflow",
			 "equals": "pattern-mismatch",
			 "funcCall": "custom-error",
			 "funcCallRequired": "custom-error",
			 "creditCard": "pattern-mismatch",
			 "condRequired": "value-missing",
			 "twIdCheck":"pattern-mismatch"
		 },
		/**
		* Required validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @param {bool} condRequired flag when method is used for internal purpose in condRequired check
		* @return an error string if validation failed
		*/
		_required: function(field, rules, i, options, condRequired) {
			switch (field.prop("type")) {
				case "radio":
					if (!field.prop('checked')) {
						console.log(field.prop('checked'))
						return options.allrules[rules[i]].alertTextCheckboxMultiple;
					}
					break;
				case "checkbox":
					// new validation style to only check dependent field
					if (condRequired) {
						if (!field.prop('checked')) {
							return options.allrules[rules[i]].alertTextCheckboxMultiple;
						}
						break;
					}
					// old validation style
					var form = field.closest("form, .validationEngineContainer");
					var name = field.attr("name");
					if (form.find("input[name='" + name + "']:checked").length == 0) {
						if (form.find("input[name='" + name + "']:visible").length == 1)
							return options.allrules[rules[i]].alertTextCheckboxe;
						else
							return options.allrules[rules[i]].alertTextCheckboxMultiple;
					}
					break;
				case "text":
				case "password":
				case "textarea":
				case "file":
				case "select-one":
				case "select-multiple":
				default:
					var field_val      = $.trim( field.val()                               );
					var dv_placeholder = $.trim( field.attr("data-validation-placeholder") );
					var placeholder    = $.trim( field.attr("placeholder")                 );
					if (
						   ( !field_val                                    )
						|| ( dv_placeholder && field_val == dv_placeholder )
						|| ( placeholder    && field_val == placeholder    )
					) {
						return options.allrules[rules[i]].alertText;
					}
					break;
			}
		},
		/**
		* Validate that 1 from the group field is required
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_groupRequired: function(field, rules, i, options) {
			var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
			var isValid = false;
			// Check all fields from the group
			field.closest("form, .validationEngineContainer").find(classGroup).each(function(){
				if(!methods._required($(this), rules, i, options)){
					isValid = true;
					return false;
				}
			});

			if(!isValid) {
		  return options.allrules[rules[i]].alertText;
		}
		},
		/**
		* Validate rules
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_custom: function(field, rules, i, options) {
			var customRule = rules[i + 1];
			var rule = options.allrules[customRule];
			var fn;
			if(!rule) {
				alert("jqv:custom rule not found - "+customRule);
				return;
			}

			if(rule["regex"]) {
				 var ex=rule.regex;
					if(!ex) {
						alert("jqv:custom regex not found - "+customRule);
						return;
					}
					var pattern = new RegExp(ex);

					if (!pattern.test(field.val())) return options.allrules[customRule].alertText;

			} else if(rule["func"]) {
				fn = rule["func"];

				if (typeof(fn) !== "function") {
					alert("jqv:custom parameter 'function' is no function - "+customRule);
						return;
				}

				if (!fn(field, rules, i, options))
					return options.allrules[customRule].alertText;
			} else {
				alert("jqv:custom type not allowed "+customRule);
					return;
			}
		},
		/**
		* Validate custom function outside of the engine scope
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_funcCall: function(field, rules, i, options) {
			var functionName = rules[i + 1];
			var fn;
			if(functionName.indexOf('.') >-1)
			{
				var namespaces = functionName.split('.');
				var scope = window;
				while(namespaces.length)
				{
					scope = scope[namespaces.shift()];
				}
				fn = scope;
			}
			else
				fn = window[functionName] || options.customFunctions[functionName];
			if (typeof(fn) == 'function')
				return fn(field, rules, i, options);

		},
		_funcCallRequired: function(field, rules, i, options) {
			return methods._funcCall(field,rules,i,options);
		},
		/**
		* Check pwvd
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @return an error string if validation failed
		*/
		_pwvd: function(field, rules, i, options){
			var type = rules[i + 1];
			var column = rules[i + 2];
			//比較密碼
			if(type == "PW"){
				if($("#" + column).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}	
			}
			//比較帳號
			if(type == "ACCT"){
				if($("#" + column).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}		
			}
		},
		
		/**
		 * Check pwd
		 *
		 * @param {jqObject} field
		 * @param {Array[String]} rules
		 * @param {int} i rules index
		 * @param {Map}
		 *            user options
		 * @return an error string if validation failed
		 */
		_chkpwd: function(field, rules, i, options){
			var pw = rules[i + 1];
			var pwval = $('#'+ pw).val();
			var passwordreg = /^[0-9a-zA-Z]+$/;
			 if (pwval.length<6) {
				 rules.push('required');
				 return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
			 }else if (!passwordreg.test(pwval)) {
				 return options.allrules.onlyLetterNumber.alertText;
			 }else {
			      var init=pwval[0];
			      for (var i = 0; i < pwval.length; i++) {
			        if(i==0){
			        	continue;
			        }else if(i<2){
			        	if(parseInt(pwval[i]) === parseInt(pwval[i-1])){
			        		return options.allrules.notContinueOrSame.alertText2;
			        	}
			        	if(pwval[i]===init){
			        		return options.allrules.notContinueOrSame.alertText2;
			              }else{
			            	 init = pwval[i];
			            }
			        	
			        }else{
			        	if(parseInt(pwval[i]) === parseInt(pwval[i-1])){
			        		return options.allrules.notContinueOrSame.alertText2;
			        	}
			        	if(pwval[i]===init){
			        		return options.allrules.notContinueOrSame.alertText2;
			              }else{
			            	 init = pwval[i];
			            }
			        	if((pwval.charCodeAt(i)-pwval.charCodeAt(i-1)== 1) && (pwval.charCodeAt(i-1)-pwval.charCodeAt(i-2)==1)){
			        		return options.allrules.notContinueOrSame.alertText1;
			        	}
			        	if((pwval.charCodeAt(i)-pwval.charCodeAt(i-1)==-1) && (pwval.charCodeAt(i-1)-pwval.charCodeAt(i-2)==-1)){
			        		return options.allrules.notContinueOrSame.alertText1;
			        	}
			        }
			       
			      }
			      
			   }
		},
		
		/**
		 * Check pwd2 for ikey changepw
		 *
		 * @param {jqObject} field
		 * @param {Array[String]} rules
		 * @param {int} i rules index
		 * @param {Map}
		 *            user options
		 * @return an error string if validation failed
		 */
		_chkikeypwd : function(field, rules, i, options) {
			var pw = rules[i + 1];
			var pwval = $('#' + pw).val();
			var passwordreg = /^[0-9a-zA-Z]+$/;
			var result=false;
			if (pwval.length < 6) {
				rules.push('required');
				console.log("error , need at least 6 words");
				return options.allrules.minSize.alertText + "6"
						+ options.allrules.minSize.alertText2;
			} else if (!passwordreg.test(pwval)) {
				return options.allrules.onlyLetterNumber.alertText;
			} else {
				var init = pwval[0];
				for (var i = 0; i < pwval.length; i++) {
					if (i == 0) {
						continue;
					} else {
						console.log("init  >> " + init);
						console.log("pwval[i]  >> " + pwval[i]);
						console.log("pwval[i]===init >> " + pwval[i]===init );
						if(pwval[i]===init){
							result = false;
						}else{
							result = true;
						}
					}

				}
				if(result==false){
					return options.allrules.notContinueOrSame.alertText3
				}

			}
		},
		/**
		 * Check numcheck
		 * 
		 * @param {jqObject}
		 *            field
		 * @param {Array[String]}
		 *            rules
		 * @param {int}
		 *            i rules index
		 * @return an error string if validation failed
		 */
		_numcheck: function(field, rules, i, options){
			var number = rules[i + 1];
			var num = $("#" + number).val();
			var re = /^[0-9]+$/;
				if(!re.exec(num)){
					return options.allrules.onlyNumberSp.alertText;
				}
		},
		/**
		* Check newcolumn
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_newcolumn: function(field, rules, i, options){
			var type = rules[i + 1];
			var oldc = rules[i + 2];
			var newc = rules[i + 3];
			var userid = rules[i + 4];
			var uid = rules[i + 5];
			//比較密碼
			if(type == "PW"){
				// 新舊密碼不能相同
				if ($("#" + oldc).val() == $("#" + newc).val() ){				
					return options.allrules.pwcolumn.alertText;
				}
				// 不得與使用者名稱相同
				if($("#" + newc).val() == $("#" + userid).val()){
					return options.allrules.pwcolumn.alertText4;
				}
				// 不得與身分證/營利事業統一編號相同
				if($("#" + newc).val() == $("#" + uid).val()){
					return "* 不得與身分證/營利事業統一編號相同";
				}
				// 請輸入6-8位英數字
				var reNumber = /^[A-Za-z0-9]+$/;
				if ($("#" + newc).val().length < 6 || $("#" + newc).val().length > 8 || !reNumber.test($("#" + newc).val())) {
					return "* 請輸入6-8位英數字";
				}
				// 不得與使用者名稱部分相同
				if($("#" + userid).val().toUpperCase().indexOf($("#" + newc).val().toUpperCase())>=0) {
					return "* 不得與使用者名稱部分相同";
				}
				// 不得與身分證/營利事業統一編號部分相同
				if($("#" + uid).val().toUpperCase().indexOf($("#" + newc).val().toUpperCase())>=0) {
					return "* 不得與身分證/營利事業統一編號部分相同";
				}
			}
			//比較帳號
			if(type == "ACCT"){
				if ($("#" + oldc).val() == $("#" + newc).val() ){				
					return options.allrules.acctcolumn.alertText;
				}else if($("#" + oldc).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}else if($("#" + newc).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}		
			}
		},
		/**
		* Check recolumn
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_recolumn: function(field, rules, i, options){
			var type = rules[i + 1];
			var oldc = rules[i + 2];
			var newc = rules[i + 3];
			var renewc = rules[i + 4];
			if(type == "PW"){
				// 請輸入兩次相同的新密碼
				if ($("#" + newc).val() != $("#" + renewc).val() ){				
					return options.allrules.pwcolumn.alertText2;			
				}
				// 與原密碼不能相同
				if($("#" + oldc).val() == $("#" + renewc).val()){
					return options.allrules.pwcolumn.alertText;
				}
				// 請輸入6-8位英數字
				var reNumber = /^[A-Za-z0-9]+$/;
				if ($("#" + renewc).val().length < 6 || $("#" + renewc).val().length > 8 || !reNumber.test($("#" + renewc).val())) {
					return "* 請輸入6-8位英數字";
				}
			}
			if(type == "ACCT"){
				if ($("#" + newc).val() != $("#" + renewc).val() ){				
					return options.allrules.acctcolumn.alertText2;			
				}else if($("#" + oldc).val() == $("#" + renewc).val()){
					return options.allrules.acctcolumn.alertText;
				}else if($("#" + oldc).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}else if($("#" + newc).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}else if($("#" + renewc).val().length < 6){
					return options.allrules.minSize.alertText + "6" + options.allrules.minSize.alertText2;
				}	
			}
			//比較欄位相同與否
			if(type == "CK"){
				if ($("#" + oldc).val() == $("#" + newc).val() ){
					return options.allrules.pwcolumn.alertText2;						
				}
				if($("#" + newc).val() == $("#" + renewc).val() ){
					return options.allrules.pwcolumn.alertText3;
				}
			}	
			// 比對新與舊、新與確認新
			if(type == "CP"){
				// 請輸入兩次相同的新密碼
				if ($("#" + newc).val() != $("#" + renewc).val() ){				
					return options.allrules.pwcolumn.alertText2;			
				}
				// 與原密碼不能相同
				if($("#" + oldc).val() == $("#" + renewc).val()){
					return options.allrules.pwcolumn.alertText;
				}
			}
			
		},
		/**
		 * Check verification_date
		 *
		 * @param {jqObject} field
		 * @param {Array[String]} rules
		 * @param {int} i rules index
		 * @param {Map}
		 *            user options
		 * @return an error string if validation failed
		 */
		_verification_date: function(field, rules, i, options){
			//日期格式
			var datevalue = rules[i + 1];
			var datetype = $("#" + datevalue).val();
			var re = new RegExp("^([0-9]{4})[./]{1}([0-9]{2})[./]{1}([0-9]{2})$");
			var strDataValue;
			var infoValidation = true;			
			
				//驗證第一格參數			
				if ((strDataValue = re.exec(datetype)) != null) {
					var i;
					i = parseFloat(strDataValue[1]);
					if (i <= 0 || i > 9999) { /*年*/
						infoValidation = false;
					}
					i = parseFloat(strDataValue[2]);
					if (i <= 0 || i > 12) { /*月*/
						infoValidation = false;
					}else{
						//2月判斷
						if(i == 2){
							var fullYear = parseFloat(strDataValue[1]);
							var fullday = parseFloat(strDataValue[3]);
							//閏年
							if( fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0)){
								if(fullday > 29){
									infoValidation = false;
								}
							}else{
								if(fullday > 28){
									infoValidation = false;
								}
							}
						}		      
					}			    
					i = parseFloat(strDataValue[3]);
					if (i <= 0 || i > 31) { /*日*/
						infoValidation = false;
					}
				} else {
					infoValidation = false;
				}
				
				//判斷是否符合
				if (!infoValidation) {
					return options.allrules.verification_date.alertText;
				}							
			
		},
		/**
		 * Check verification_twodate
		 *
		 * @param {jqObject} field
		 * @param {Array[String]} rules
		 * @param {int} i rules index
		 * @param {Map}
		 *            user options
		 * @return an error string if validation failed
		 */
		_verification_twodate: function(field, rules, i, options){
			//日期格式
			var datevalue = rules[i + 1];
			var datevalueTwo = rules[i + 2];
			var datetype = $("#" + datevalue).val();
			var datetypeTwo = $("#" + datevalueTwo).val();
			var re = new RegExp("^([0-9]{4})[./]{1}([0-9]{2})[./]{1}([0-9]{2})$");
			var strDataValue;
			var strDataValueTwo;
			var infoValidation = true;
			var infoValidationTwo = true;

			//驗證第一格參數			
			if ((strDataValue = re.exec(datetype)) != null) {
				var i;
				i = parseFloat(strDataValue[1]);
				if (i <= 0 || i > 9999) { /*年*/
					infoValidation = false;
				}
				i = parseFloat(strDataValue[2]);
				if (i <= 0 || i > 12) { /*月*/
					infoValidation = false;
				}else{
					//2月判斷
					if(i == 2){
						var fullYear = parseFloat(strDataValue[1]);
						var fullday = parseFloat(strDataValue[3]);
						//閏年
						if( fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0)){
							if(fullday > 29){
								infoValidation = false;
							}
						}else{
							if(fullday > 28){
								infoValidation = false;
							}
						}
					}		      
				}			    
				i = parseFloat(strDataValue[3]);
				if (i <= 0 || i > 31) { /*日*/
					infoValidation = false;
				}
			} else {
				infoValidation = false;
			}
			
			//驗證第二格參數
			if ((strDataValueTwo = re.exec(datetypeTwo)) != null) {
				var i;
				i = parseFloat(strDataValueTwo[1]);
				if (i <= 0 || i > 9999) { /*年*/
					infoValidationTwo = false;
				}
				i = parseFloat(strDataValueTwo[2]);
				if (i <= 0 || i > 12) { /*月*/
					iinfoValidationTwo = false;
				}else{
					//2月判斷
					if(i == 2){
						var fullYear = parseFloat(strDataValueTwo[1]);
						var fullday = parseFloat(strDataValueTwo[3]);
						//閏年
						if( fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0)){
							if(fullday > 29){
								infoValidationTwo = false;
							}
						}else{
							if(fullday > 28){
								infoValidationTwo = false;
							}
						}
					}		      
				}			    
				i = parseFloat(strDataValueTwo[3]);
				if (i <= 0 || i > 31) { /*日*/
					infoValidationTwo = false;
				}
			} else {
				infoValidationTwo = false;
			}
			
			//判斷是否符合
			if (!infoValidation || !infoValidationTwo) {
				return options.allrules.verification_date.alertText;
			}							
			
		},
		/**
		* Field match
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_equals: function(field, rules, i, options) {
			var equalsField = rules[i + 1];

			if (field.val() != $("#" + equalsField).val())
				return options.allrules.equals.alertText;
		},
		/**
		* Field match
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_equals2: function(field, rules, i, options) {
			rules.push('required');
			var funcName = rules[i+1];
			var equalsField = rules[i + 2];
			
			switch(funcName){
			case "CN19":
				if (field.val() != $("#" + equalsField).val())
					return options.allrules.equals.CN19;
			case "N1010_CP":
				if (field.val() != $("#" + equalsField).val())
					return options.allrules.equals.N1010_CP;
			}

			
		},
		
		/**
		* Field match
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_notEquals: function(field, rules, i, options) {
			rules.push('required');
			var funcName = rules[i+1];
			var equalsField = rules[i + 2];
			
			switch(funcName){
			case "N1010_CP":
				if (field.val() == $("#" + equalsField).val())
					return options.allrules.notEquals.N1010_CP;
			}

			
		},
		/**
		* Check the maximum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_maxSize: function(field, rules, i, options) {
			var max = rules[i + 1];
			var len = field.val().length;

			if (len > max) {
				var rule = options.allrules.maxSize;
				return rule.alertText + max + rule.alertText2;
			}
		},
		/**
		* Check the minimum size (in characters)
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_minSize: function(field, rules, i, options) {
			var min = rules[i + 1];
			var len = field.val().length;

			if (len < min) {
				return options.allrules.minSize.alertText + min + options.allrules.minSize.alertText2;
			}
		},
		/**
		* Check number minimum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_min: function(field, rules, i, options) {
			var min = parseFloat(rules[i + 1]);
			var len = parseFloat(field.val());

			if (len < min) {
				var rule = options.allrules.min;
				if (rule.alertText2) return rule.alertText + min + rule.alertText2;
				return rule.alertText + min;
			}
		},
		/**
		* Check number maximum value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_max: function(field, rules, i, options) {
			var max = parseFloat(rules[i + 1]);
			var len = parseFloat(field.val());

			if (len >max ) {
				var rule = options.allrules.max;
				if (rule.alertText2) return rule.alertText + max + rule.alertText2;
				//orefalo: to review, also do the translations
				return rule.alertText + max;
			}
		},
		/**
		* Checks date is in the past
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_past: function(form, field, rules, i, options) {
			var p=rules[i + 1];
			var fieldAlt = $(form.find("*[name='" + p.replace(/^#+/, '') + "']"));
			var pdate;
			
			if (p.toLowerCase() == "now") {
				pdate = new Date();
			} else if (undefined != fieldAlt.val()) {
				if (fieldAlt.is(":disabled"))
					return;
				pdate = methods._parseDate(fieldAlt.val());
			} else {
				pdate = methods._parseDate(p);
			}
			var vdate = methods._parseDate(field.val());

			if (vdate > pdate ) {
				var rule = options.allrules.past;
				if (rule.alertText2) return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
				return rule.alertText + methods._dateToString(pdate);
			}
		},
		/**
		* Checks date is in the future
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_future: function(form, field, rules, i, options) {

			var p=rules[i + 1];
			var fieldAlt = $(form.find("*[name='" + p.replace(/^#+/, '') + "']"));
			var pdate;

			if (p.toLowerCase() == "now") {
				pdate = new Date();
			} else if (undefined != fieldAlt.val()) {
				if (fieldAlt.is(":disabled"))
					return;
				pdate = methods._parseDate(fieldAlt.val());
			} else {
				pdate = methods._parseDate(p);
			}
			var vdate = methods._parseDate(field.val());

			if (vdate < pdate ) {
				var rule = options.allrules.future;
				if (rule.alertText2)
					return rule.alertText + methods._dateToString(pdate) + rule.alertText2;
				return rule.alertText + methods._dateToString(pdate);
			}
		},
		/**
		* Checks if valid date
		*
		* @param {string} date string
		* @return a bool based on determination of valid date
		*/
		_isDate: function (value) {
			var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
			return dateRegEx.test(value);
		},
		/**
		* Checks if valid date time
		*
		* @param {string} date string
		* @return a bool based on determination of valid date time
		*/
		_isDateTime: function (value){
			var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
			return dateTimeRegEx.test(value);
		},
		//Checks if the start date is before the end date
		//returns true if end is later than start
		_dateCompare: function (start, end) {
			return (new Date(start.toString()) < new Date(end.toString()));
		},
		/**
		* Checks date range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
		_dateRange: function (field, rules, i, options) {
			//are not both populated
			if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}

			//are not both dates
			if (!methods._isDate(options.firstOfGroup[0].value) || !methods._isDate(options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}

			//are both dates but range is off
			if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
		},
		/**
		* Checks date time range
		*
		* @param {jqObject} first field name
		* @param {jqObject} second field name
		* @return an error string if validation failed
		*/
		_dateTimeRange: function (field, rules, i, options) {
			//are not both populated
			if ((!options.firstOfGroup[0].value && options.secondOfGroup[0].value) || (options.firstOfGroup[0].value && !options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
			//are not both dates
			if (!methods._isDateTime(options.firstOfGroup[0].value) || !methods._isDateTime(options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
			//are both dates but range is off
			if (!methods._dateCompare(options.firstOfGroup[0].value, options.secondOfGroup[0].value)) {
				return options.allrules[rules[i]].alertText + options.allrules[rules[i]].alertText2;
			}
		},
		/**
		* Max number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_maxCheckbox: function(form, field, rules, i, options) {

			var nbCheck = rules[i + 1];
			var groupname = field.attr("name");
			var groupSize = form.find("input[name='" + groupname + "']:checked").size();
			if (groupSize > nbCheck) {
				options.showArrow = false;
				if (options.allrules.maxCheckbox.alertText2)
					 return options.allrules.maxCheckbox.alertText + " " + nbCheck + " " + options.allrules.maxCheckbox.alertText2;
				return options.allrules.maxCheckbox.alertText;
			}
		},
		/**
		* Min number of checkbox selected
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_minCheckbox: function(form, field, rules, i, options) {

			var nbCheck = rules[i + 1];
			var groupname = field.attr("name");
			var groupSize = form.find("input[name='" + groupname + "']:checked").size();
			if (groupSize < nbCheck) {
				options.showArrow = false;
				return options.allrules.minCheckbox.alertText + " " + nbCheck + " " + options.allrules.minCheckbox.alertText2;
			}
		},
		/**
		* Checks that it is a valid credit card number according to the
		* Luhn checksum algorithm.
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_creditCard: function(field, rules, i, options) {
			//spaces and dashes may be valid characters, but must be stripped to calculate the checksum.
			var valid = false, cardNumber = field.val().replace(/ +/g, '').replace(/-+/g, '');

			var numDigits = cardNumber.length;
			if (numDigits >= 14 && numDigits <= 16 && parseInt(cardNumber) > 0) {

				var sum = 0, i = numDigits - 1, pos = 1, digit, luhn = new String();
				do {
					digit = parseInt(cardNumber.charAt(i));
					luhn += (pos++ % 2 == 0) ? digit * 2 : digit;
				} while (--i >= 0)

				for (i = 0; i < luhn.length; i++) {
					sum += parseInt(luhn.charAt(i));
				}
				valid = sum % 10 == 0;
			}
			if (!valid) return options.allrules.creditCard.alertText;
		},
		/*
		 * 檢核日期範圍
		 * PARAM sFieldName:欄位中文描述
		 * PARAM oBaseDate:基準日期，可為輸入框物件或日期物件或日期字串
		 * PARAM oStartDate:起始日輸入框物件
		 * PARAM oEndDate:終止日輸入框物件
		 * PARAM bCanOverBaseDate:起始日或終止日可否大於基準日
		 * PARAM iMonthAgo:以基準日往前推算之月份，無限制時給null
		 * PARAM iMonthScope:起始日與終止日之相距月份限制，無月份限制時給null
		 * return 
		 * validate[required,funcCall[validate_CheckDateScope['sFieldName', oBaseDate, oStartDate, oEndDate, bCanOverBaseDate, iMonthAgo, iMonthScope]]]
		 */
		_validate_CheckDateScope2: function(field, rules, i, options)
		{	
			console.log("_CheckDateScope");
			var sFieldName = rules[i + 1];
			console.log("sFieldName >>" + sFieldName);
			var oBaseDate = rules[i + 2];
			var oStartDate = rules[i + 3];
			var oEndDate = rules[i + 4];
			
			/**
			 * 因為用 validate 參數傳入為字串,必須轉型正確的型別
			 */
			
			// 判斷是不是true
			var bCanOverBaseDate = 'true'===rules[i + 5];
			//傳入為"null"字串 則回傳 null 不是則轉型 Number 
			var iMonthAgoStr = rules[i + 6];
			var	iMonthAgo = "null" === iMonthAgoStr ? null: Number(iMonthAgoStr);
			//傳入為"null"字串 則回傳 null 不是則轉型 Number 
			var iMonthScopeStr = rules[i + 7];
			var	iMonthScope = "null" === iMonthScopeStr ? null: Number(iMonthScopeStr);
			
			if  (typeof(sFieldName) != "string")
			{
				return "* CheckDateScope含有無效的參數sFieldName";
			}
			
				var oBaseDatevalue = $("#" + oBaseDate).val();
				//基準日
				var dBaseDate;
				if (oBaseDate instanceof Date)
				{//日期物件
					dBaseDate = oBaseDatevalue;
				}
				else if (typeof(oBaseDatevalue) == "string")
				{//日期字串，如2008/08/01
					if (!IsValidDate(oBaseDatevalue))
					{
						return "* 請使用正確的基準日參數，例如 2009/01/31";
					}
					dBaseDate = new Date(oBaseDatevalue);
				}
				else
				{//輸入框物件
					if (!IsValidDate(oBaseDatevalue))
					{
						return "* 請輸入正確的基準日，例如 2009/01/31";
					}
					dBaseDate = new Date(oBaseDatevalue);
				}
				
				var oBaseYear = dBaseDate.getFullYear().toString();
				var oBaseMonth = dBaseDate.getMonth() + 1;
				oBaseMonth = oBaseMonth < 10 ? "0" + oBaseMonth : oBaseMonth.toString();
				var oBaseDay = dBaseDate.getDate();
				oBaseDay = oBaseDay < 10 ? "0" + oBaseDay : oBaseDay.toString();
				var sBaseDate = oBaseYear + "/" + oBaseMonth + "/" + oBaseDay;
				
				//最小日
				var dMinDate = null;
				var sMinDate = null;
				if (iMonthAgo != null)
				{
				    var oMinMonth = null;
				    if (oBaseMonth > iMonthAgo)
				        oMinMonth = oBaseMonth - iMonthAgo - 1;
				    else
				        oMinMonth = -1 - (iMonthAgo - oBaseMonth);
				        
				    dMinDate = new Date(sBaseDate);
				    dMinDate.setMonth(oMinMonth);
				    dMinDate.setDate(1);
				    
				    oMinMonth = dMinDate.getMonth() + 1;
				    oMinMonth = oMinMonth < 10 ? "0" + oMinMonth : oMinMonth.toString();
				
					sMinDate = dMinDate.getFullYear() + "/" + oMinMonth + "/01";
				}
					
				var oStartDatevalue = $("#" + oStartDate).val();
//				//起始日
//				if (!IsValidDate(oStartDatevalue))
//				{
//					return "* 請輸入正確的起始日格式，例如 2009/01/31";
//				}
				var dStartDate = new Date(oStartDatevalue);
				var oStartYear = dStartDate.getFullYear().toString();
				var oStartMonth = dStartDate.getMonth() + 1;
				oStartMonth = oStartMonth < 10 ? "0" + oStartMonth : oStartMonth.toString();
				var oStartDay = dStartDate.getDate();
				var iStartDay = oStartDay;
				oStartDay = oStartDay < 10 ? "0" + oStartDay : oStartDay.toString();

				if (!bCanOverBaseDate && dStartDate > dBaseDate)
				{
					return options.allrules.timeScopeMsg.alertText1 + sBaseDate;
				}
				
				if (dMinDate != null && dStartDate < dMinDate)
				{
					return options.allrules.timeScopeMsg.alertText2 + sMinDate;
				}
				var oEndDatevalue = $("#" + oEndDate).val();
				//終止日
//				if (!IsValidDate(oEndDatevalue))
//				{
//					return "* 請輸入正確的終止日格式，例如 2009/01/31";
//				}
				var dEndDate = new Date(oEndDatevalue);
				var oEndYear = dEndDate.getFullYear().toString();
				var oEndMonth = dEndDate.getMonth() + 1;
				oEndMonth = oEndMonth < 10 ? "0" + oEndMonth : oEndMonth.toString();
				var oEndDay = dEndDate.getDate();
				oEndDay = oEndDay < 10 ? "0" + oEndDay : oEndDay.toString();
				
				//最大日
				var dMaxDate = null;
				var sMaxDate = null;
				if (iMonthScope != null)
				{
					if (iMonthScope == iMonthAgo)
					{
						dMaxDate = dBaseDate;
						sMaxDate = sBaseDate;
					}
					else
					{
						var oMaxMonth = dStartDate.getMonth() + 1 + iMonthScope;
						if (oMaxMonth > 12)
						{
							var i = parseInt(oMaxMonth / 12);
							oMaxMonth = oMaxMonth - 12 * i;
							if (oMaxMonth == 0)
							{
								oMaxMonth = 12;
								i = i - 1;
							}
							oMaxMonth = oMaxMonth < 10 ? "0" + oMaxMonth : oMaxMonth.toString();
							sMaxDate = (parseInt(oStartYear) + i) + "/" + oMaxMonth + "/"  //尚未加入day
						}else
						{
							oMaxMonth = oMaxMonth < 10 ? "0" + oMaxMonth : oMaxMonth.toString();
							sMaxDate = oStartYear + "/" + oMaxMonth + "/"    //尚未加入day
						}
						
						for (var i = parseInt(iStartDay); i > 0; i--)
						{//防止出現如2008/2/31之日期
							var oDay = i < 10 ? "0" + i.toString() : i.toString();
							var sDate = sMaxDate + oDay;
							if (IsValidDate(sDate))
							{
								sMaxDate = sDate;
								dMaxDate = new Date(sMaxDate);
								break;
							}
						}
					}
				}
				
				if (!bCanOverBaseDate && (dMaxDate == null || dMaxDate > dBaseDate))
				{//最大日不能超過基準日
					sMaxDate = sBaseDate;
					dMaxDate = dBaseDate;
				}

				if (dMaxDate != null && dEndDate > dMaxDate)
				{
					return options.allrules.timeScopeMsg.alertText3 + sMaxDate;
				}
				
				if (dEndDate < dStartDate)
				{
					return options.allrules.timeScopeMsg.alertText4 ;
				}
			},
		/**
		* Ajax field validation
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return nothing! the ajax validator handles the prompts itself
		*/
		 _ajax: function(field, rules, i, options) {

			 var errorSelector = rules[i + 1];
			 var rule = options.allrules[errorSelector];
			 var extraData = rule.extraData;
			 var extraDataDynamic = rule.extraDataDynamic;
			 var data = {
				"fieldId" : field.attr("id"),
				"fieldValue" : field.val()
			 };

			 if (typeof extraData === "object") {
				$.extend(data, extraData);
			 } else if (typeof extraData === "string") {
				var tempData = extraData.split("&");
				for(var i = 0; i < tempData.length; i++) {
					var values = tempData[i].split("=");
					if (values[0] && values[0]) {
						data[values[0]] = values[1];
					}
				}
			 }

			 if (extraDataDynamic) {
				 var tmpData = [];
				 var domIds = String(extraDataDynamic).split(",");
				 for (var i = 0; i < domIds.length; i++) {
					 var id = domIds[i];
					 if ($(id).length) {
						 var inputValue = field.closest("form, .validationEngineContainer").find(id).val();
						 var keyValue = id.replace('#', '') + '=' + escape(inputValue);
						 data[id.replace('#', '')] = inputValue;
					 }
				 }
			 }

			 // If a field change event triggered this we want to clear the cache for this ID
			 if (options.eventTrigger == "field") {
				delete(options.ajaxValidCache[field.attr("id")]);
			 }

			 // If there is an error or if the the field is already validated, do not re-execute AJAX
			 if (!options.isError && !methods._checkAjaxFieldStatus(field.attr("id"), options)) {
				 $.ajax({
					 type: options.ajaxFormValidationMethod,
					 url: rule.url,
					 cache: false,
					 dataType: "json",
					 data: data,
					 field: field,
					 rule: rule,
					 methods: methods,
					 options: options,
					 beforeSend: function() {},
					 error: function(data, transport) {
						if (options.onFailure) {
							options.onFailure(data, transport);
						} else {
							methods._ajaxError(data, transport);
						}
					 },
					 success: function(json) {

						 // asynchronously called on success, data is the json answer from the server
						 var errorFieldId = json[0];
						 //var errorField = $($("#" + errorFieldId)[0]);
						 var errorField = $("#"+ errorFieldId).eq(0);

						 // make sure we found the element
						 if (errorField.length == 1) {
							 var status = json[1];
							 // read the optional msg from the server
							 var msg = json[2];
							 if (!status) {
								 // Houston we got a problem - display an red prompt
								 options.ajaxValidCache[errorFieldId] = false;
								 options.isError = true;

								 // resolve the msg prompt
								 if(msg) {
									 if (options.allrules[msg]) {
										 var txt = options.allrules[msg].alertText;
										 if (txt) {
											msg = txt;
							}
									 }
								 }
								 else
									msg = rule.alertText;

								 if (options.showPrompts) methods._showPrompt(errorField, msg, "", true, options);
							 } else {
								 options.ajaxValidCache[errorFieldId] = true;

								 // resolves the msg prompt
								 if(msg) {
									 if (options.allrules[msg]) {
										 var txt = options.allrules[msg].alertTextOk;
										 if (txt) {
											msg = txt;
							}
									 }
								 }
								 else
								 msg = rule.alertTextOk;

								 if (options.showPrompts) {
									 // see if we should display a green prompt
									 if (msg){
										 console.log("showPrompt");
//										methods._showPrompt(errorField, msg, "pass", true, options);
									 }
									 else{
										 
										 methods._closePrompt(errorField);
									 }
								}

								 // If a submit form triggered this, we want to re-submit the form
								 if (options.eventTrigger == "submit")
									field.closest("form").submit();
							 }
						 }
						 errorField.trigger("jqv.field.result", [errorField, options.isError, msg]);
					 }
				 });

				 return rule.alertTextLoad;
			 }
		 },
		/**
		* Check group checkboxes
		*
		* @param {jqObject} field
		* @param {Array[String]} rules(group class)
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		 _groupCheckbox: function(field, rules, i, options){
			 var classGroup = "["+options.validateAttribute+"*=" +rules[i + 1] +"]";
			 var isValid = false;
			 // Check all fields from the group
			 field.closest("form, .validationEngineContainer").find(classGroup).each(function(){
				 if($(this).prop("checked") == true){
					 isValid = true;
					 return false;
				 }
			 });
			 if(!isValid) {
				 return options.allrules.groupCheckbox.alertText;
			 }
		 },
		/**
		* Check decimal value
		*
		* @param {jqObject} field
		* @param {Array[String]} rules(總位數,小數位數)
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		 _decimal: function(field, rules, i, options){
			 if(!field.val().match(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/)){
				 return options.allrules.number.alertText;
			 }
			 
			 var v=field.val(),t=rules[i+1],d=rules[i+2],f=t-d;
			 if(v.length!=0){
				 var a=options.allrules.decimal.alertText+"整數"+f+"位，小數"+d+"位";
				 if(v.indexOf(".")==-1){v=parseInt(v).toFixed(d);field.val(v);}
				 var fv=v.split(".")[0],dv=v.split(".")[1];
				 if(dv.length==0){field.val(parseInt(fv).toFixed(d));}
				 if(fv.indexOf("-")>-1){if(fv.indexOf("-")==0){fv=fv.substring(1);}else{return a;}}
				 if(!(((fv.length)<=f) && (dv.length<=d))){return a;}
			 }else{
				 field.val(parseInt("0").toFixed(d));
			 }
		 },
		/**
		* Check taiwan date
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_twDate: function(field, rules, i, options){
			var value = field.val();
			if(typeof(value) !== 'undefined' && value != null ){
				if(value.length == 8){
					if(value.match('[0-9]+')){
						var year = value.substring(0,4);
						if(year.substring(0,1) != "0"){
							return options.allrules.twDate.alertText;
						}
						year = parseInt(year) + 1911;
						if(!methods._isDate(year + "-" + value.substring(4,6) + "-" + value.substring(6,8))){
							return options.allrules.twDate.alertText2;
						}
					}else{
						return options.allrules.twDate.alertText3;
				    }
				}
			}
		},
		/**
		* Check taiwan year 
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_twYear: function(field, rules, i, options){
			var value = field.val();
			if(typeof(value) !== 'undefined' && value != null ){
				if(value.length == 4){
					if(value.match(/\d{4}$/)){
						if(value.substring(0,1) != "0"){
							return options.allrules.twYear.alertText;
						}
						value = parseInt(value) + 1911;
						if(!methods._isDate(value + "-01-01")){
							return options.allrules.twYear.alertText2;
						}
					}else{
						return options.allrules.twYear.alertText3;
				    }
				}
			}
		},
		/**
		* Check branch id exists
		*
		* @param {jqObject} field
		* @param {Array[String]} rules(url,component,method)
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_branchId: function(field, rules, i, options) {
			var uri = rules[i + 1];
			var component = rules[i + 2];
			var method = rules[i + 3];
        	//validate only if BRBK_ID is filled
        	if(field.val() != ''){
        		var rdata = {component:component, method:method, brbkId: field.val()};
        		var branch =  fstop.getServerDataExII(uri, rdata, false);
        		
        		var nameField = field.attr("id");
    			if(nameField.indexOf("_") > - 1){
    				nameField = nameField.substring(0, nameField.lastIndexOf("_")) + "_NAME";
        			if($("#" + nameField).length > 0){
        				if(branch == null){
        					$("#" + nameField).val("");
        				}else{
        					$("#" + nameField).val(branch.BRBK_NAME);
        				}
        			}
    			}
        		
        		if(branch == null){
        			return options.allrules.branchId.alertText;
        		}
        	}
		},
		/**
		 * 20151112 add by hugo req by UAT-20151027-02 改成如果查無分行也不檢核，單純查詢已存在的分行的中文名稱
		 * Check branch id exists
		 *
		 * @param {jqObject} field
		 * @param {Array[String]} rules(url,component,method)
		 * @param {int} i rules index
		 * @param {Map}
		 *            user options
		 * @return an error string if validation failed
		 */
		_branchId_II: function(field, rules, i, options) {
			var uri = rules[i + 1];
			var component = rules[i + 2];
			var method = rules[i + 3];
			//validate only if BRBK_ID is filled
			if(field.val() != ''){
				var rdata = {component:component, method:method, brbkId: field.val()};
				var branch =  fstop.getServerDataExII(uri, rdata, false);
				
				var nameField = field.attr("id");
				if(nameField.indexOf("_") > - 1){
					nameField = nameField.substring(0, nameField.lastIndexOf("_")) + "_NAME";
					if($("#" + nameField).length > 0){
						if(branch == null){
							$("#" + nameField).val("");
						}else{
							$("#" + nameField).val(branch.BRBK_NAME);
						}
					}
				}
				
//				if(branch == null){
//					return options.allrules.branchId.alertText;
//				}
			}
		},
		/**
		* Check not chinese character
		*
		* @param {jqObject} field
		* @param {Array[String]} rules(group class)
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		 _notChinese: function(field, rules, i, options){
			 var input = field.val();
			 if(input.match(/.*[^\u0000-\u007F]+.*/)){
				 return options.allrules.notChinese.alertText;
			 }
		 },
		 _twPast: function(form, field, rules, i, options) {
				var p=rules[i + 1];
				var fieldAlt = $(form.find("*[name='" + p.replace(/^#+/, '') + "']"));
				var pdate;
				
				if (p.toLowerCase() == "now") {
					pdate = new Date();
				} else if (undefined != fieldAlt.val()) {
					if (fieldAlt.is(":disabled")) return;
					pdate = methods._parseTwDate(fieldAlt.val());
				} else {
					pdate = methods._parseTwDate(p);
				}
				var vdate = methods._parseTwDate(field.val());

				if (fieldAlt.val() != '' && vdate > pdate) {
					var rule = options.allrules.past;
					if (rule.alertText2) return rule.alertText + methods._parseWestDate(methods._dateToString(pdate)) + rule.alertText2;
					return rule.alertText + methods._parseWestDate(methods._dateToString(pdate));
				}
		},
		_twFuture: function(form, field, rules, i, options) {
				var f=rules[i + 1];
				var fieldAlt = $(form.find("*[name='" + f.replace(/^#+/, '') + "']"));
				var fdate;
				
				if (f.toLowerCase() == "now") {
					fdate = new Date();
				} else if (undefined != fieldAlt.val()) {
					if (fieldAlt.is(":disabled")) return;
					fdate = methods._parseTwDate(fieldAlt.val());
				} else {
					fdate = methods._parseTwDate(f);
				}
				var vdate = methods._parseTwDate(field.val());
	
				if (fieldAlt.val() != '' && vdate < fdate ) {
					var rule = options.allrules.future;
					if (rule.alertText2) return rule.alertText + methods._parseWestDate(methods._dateToString(fdate)) + rule.alertText2;
					return rule.alertText + methods._parseWestDate(methods._dateToString(fdate));
				}
		},
		_mutilIpv4: function( field, rules, i, options) {
			if(window.console){console.log("ip4");}
			var f=rules[i+1];
			var ipv4s = field.val();
			var ipv4Ary = ipv4s.split(f);
			for(var index in ipv4Ary ){
				//add by hugo 加入網段驗證 req by 李建利  ex:10.60.5.200-10.60.5.220
				var ipv4AryII = ipv4Ary[index].split("-");
				for(var indexII in ipv4AryII  ){
					if(window.console){console.log("ipv4AryII>>"+ipv4AryII[indexII]);}
					if( ! ipv4AryII[indexII].match(/^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/)){
//					return options.allrules.ipv4.alertText;
//					return options.allrules.ipv4.alertText+"第"+(parseInt(index)+1)+"組";
						return options.allrules.ipv4.alertText+",ip="+ipv4Ary[index];
					}
				}
			}
		},
		_userId: function( field, rules, i, options) {
			if(window.console){console.log("_userId");}
			var f=rules[i+1];
			var userId = field.val();
			if(f==null || f==undefined ||f !="-" ){
				return options.allrules.userId.alertText+"網頁參數錯誤，缺少'-'";
			}
			if(userId.length<10){
//				讓minSize處理
				return;
			}
			if(userId.indexOf("-")<0){
				return options.allrules.userId.alertText+"用戶代號格式不符，缺少 '-' ，參考範例0100000-01";
			}
			var ary = userId.split(f);
			if(ary.length>=3 || ary.length ==0){
				return options.allrules.userId.alertText+"用戶代號格式不符，參考範例0100000-01";
			}
//			if(!ary[0].match(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/) || !ary[0].match(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/)){
//				return "用戶代號格式不符，'-'左右必須是數字，參考範例0100000-01"
//			}
//			if(ary[0].length>7){
//				return "用戶代號格式不符，'-'左方區塊長度不可超過7個字元，參考範例0100000-01"
//			}
//			if(ary[1].length>2){
//				return "用戶代號格式不符，'-'右方區塊長度不可超過2個字元，參考範例0100000-01"
//			}
			for(var index in ary ){
				if(!ary[index].match(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/) ){
					return options.allrules.userId.alertText+"用戶代號格式不符，'-'左右必須是數字，參考範例0100000-01";
				}
				if(index == 0){
					if(ary[index].length>7 || ary[index].length<7){
						return options.allrules.userId.alertText+"用戶代號格式不符，'-'左方區塊長度最多最少7個字元，目前字元數="+ary[index].length+"，參考範例0100000-01";
					}
				}
				if(index == 1){
					if(ary[index].length>2 || ary[index].length<2){
						return options.allrules.userId.alertText+"用戶代號格式不符，'-'右方區塊長度最多最少2個字元，目前字元數="+ary[index].length+"，參考範例0100000-01";
					}
				}
			}
		},
		
		/**
		* Check not TW IDNumber
		*
		* @param {jqObject} field
		* @param {Array[String]} rules(group class)
		* @param {int} i rules index
		* @param {Map}
		*            user options
		* @return an error string if validation failed
		*/
		_twIdCheck:function(field, rules, i, options)//value, element, param
		{
			var field = rules[i+1]
			var id = $('#'+field).val();
			id=id.toUpperCase();//英文字母轉大寫
			var tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
			var A1 = new Array (1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3 );
			var A2 = new Array (0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5 );
			var  Mx = new Array (9,8,7,6,5,4,3,2,1,1);
			
			 if ( id.length == 0 ) return options.allrules.twIDEasy.alertText1;
		     if ( id.length != 10 ) return options.allrules.twIDEasy.alertText;
		     var i = tab.indexOf( id.charAt(0) );
		     if ( i == -1 ) return options.allrules.twIDEasy.alertText;
		   
		   
		     var sum = A1[i] + A2[i]*9;

		     for ( i=1; i<10; i++ ) {
		    	 var  v = parseInt( id.charAt(i) );
		        if ( isNaN(v) )return options.allrules.twIDEasy.alertText;
		        sum = sum + v * Mx[i];
		     }
		   if ( sum % 10 != 0 ) return options.allrules.twIDEasy.alertText;
		}, 
		_CCtwIdCheck:function(field, rules, i, options)//value, element, param
		{
			var field = rules[i+1]
			var id = $('#'+field).val();
			id=id.toUpperCase();//英文字母轉大寫
			var tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
			var A1 = new Array (1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3 );
			var A2 = new Array (0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5 );
			var  Mx = new Array (9,8,7,6,5,4,3,2,1,1);
			
			 if ( id.length == 0 ) return options.allrules.twIDEasy.alertText1;
		     if ( id.length != 10 ) return options.allrules.twIDEasy.alertText2;
		     var i = tab.indexOf( id.charAt(0) );
		     if ( i == -1 ) return options.allrules.twIDEasy.alertText2;
		   
		   
		     var sum = A1[i] + A2[i]*9;

		     for ( i=1; i<10; i++ ) {
		    	 var  v = parseInt( id.charAt(i) );
		        if ( isNaN(v) )return options.allrules.twIDEasy.alertText2;
		        sum = sum + v * Mx[i];
		     }
		   if ( sum % 10 != 0 ) return options.allrules.twIDEasy.alertText2;
		}, 
		/**
		* Common method to handle ajax errors
		*
		* @param {Object} data
		* @param {Object} transport
		*/
		_ajaxError: function(data, transport) {
			if(data.status == 0 && transport == null)
				alert("The page is not served from a server! ajax call failed");
			else if(typeof console != "undefined")
				console.log("Ajax error: " + data.status + " " + transport);
		},
		/**
		* date -> string
		*
		* @param {Object} date
		*/
		_dateToString: function(date) {
			return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		},
		/**
		* Parses an Taiwan date to West Year
		* @param {String} d
		*/
		_parseTwDate: function(d) {
			var dateParts = d.split("-");
			if(dateParts==d)
				dateParts = d.split("/");
			if(dateParts==d)
				dateParts = d.split(".");
			if(dateParts==d){
				dateParts = [d.substring(0,4),d.substring(4,6),d.substring(6,8)];
				//20150109 西元年轉換成民國年
				if(parseInt(dateParts[0],10) < 1911){
					dateParts[0] = parseInt(dateParts[0],10) + 1911;
				}
				return new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
			}
			
			return new Date(dateParts[0], (dateParts[1] - 1) ,dateParts[2]);
		},
		/**
		* Parses an Taiwan date to West Year
		* @param {String} d
		*/
		_parseWestDate: function(d) {
			var dateParts = d.split("-");
			if(dateParts==d)
				dateParts = d.split("/");
			if(dateParts==d)
				dateParts = d.split(".");
			if(dateParts==d){
				dateParts = [d.substring(0,4),d.substring(4,6),d.substring(6,8)];
			}
			//20150109 民國年轉換成西元年
			if(parseInt(dateParts[0],10) >= 1911){
				dateParts[0] = "0" + parseInt(dateParts[0],10) - 1911;
			}
			return dateParts[0] + methods._paddingLeft(dateParts[1],"0",2) + methods._paddingLeft(dateParts[2],"0",2);
		},
		/**
		* Parses an ISO date
		* @param {String} d
		*/
		_parseDate: function(d) {

			var dateParts = d.split("-");
			if(dateParts==d)
				dateParts = d.split("/");
			if(dateParts==d) {
				dateParts = d.split(".");
				return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
			}
			
			return new Date(dateParts[0], (dateParts[1] - 1) ,dateParts[2]);
		},
		_paddingLeft: function(p,s,l) {
			var limit = l - p.length;
			for(var i = 0; i < limit; i++){
				p = s + p;
			}
			return p;
		},
		/**
		* Builds or updates a prompt with the given information
		*
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		 _showPrompt: function(field, promptText, type, ajaxed, options, ajaxform) {
		 	//Check if we need to adjust what element to show the prompt on
			if(field.data('jqv-prompt-at') instanceof jQuery ){
				field = field.data('jqv-prompt-at');
			} else if(field.data('jqv-prompt-at')) {
				field = $(field.data('jqv-prompt-at'));
			}

			 var prompt = methods._getPrompt(field);
			 // The ajax submit errors are not see has an error in the form,
			 // When the form errors are returned, the engine see 2 bubbles, but those are ebing closed by the engine at the same time
			 // Because no error was found befor submitting
			 if(ajaxform) prompt = false;
			 // Check that there is indded text
			 if($.trim(promptText)){
				 if (prompt)
					methods._updatePrompt(field, prompt, promptText, type, ajaxed, options);
				 else
					methods._buildPrompt(field, promptText, type, ajaxed, options);
			}
		 },
		/**
		* Builds and shades a prompt for the given field.
		*
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		_buildPrompt: function(field, promptText, type, ajaxed, options) {

			// create the prompt
			var prompt = $('<div>');
			prompt.addClass(methods._getClassName(field.attr("id")) + "formError");
			// add a class name to identify the parent form of the prompt
			prompt.addClass("parentForm"+methods._getClassName(field.closest('form, .validationEngineContainer').attr("id")));
			prompt.addClass("formError");

			switch (type) {
				case "pass":
					prompt.addClass("greenPopup");
					break;
				case "load":
					prompt.addClass("blackPopup");
					break;
				default:
					/* it has error  */
					//alert("unknown popup type:"+type);
			}
			if (ajaxed)
				prompt.addClass("ajaxed");

			// create the prompt content
			var promptContent = $('<div>').addClass("formErrorContent").html(promptText).appendTo(prompt);

			// determine position type
			var positionType=field.data("promptPosition") || options.promptPosition;

			// create the css arrow pointing at the field
			// note that there is no triangle on max-checkbox and radio
			if (options.showArrow) {
				var arrow = $('<div>').addClass("formErrorArrow");

				//prompt positioning adjustment support. Usage: positionType:Xshift,Yshift (for ex.: bottomLeft:+20 or bottomLeft:-20,+10)
				if (typeof(positionType)=='string')
				{
					var pos=positionType.indexOf(":");
					if(pos!=-1)
						positionType=positionType.substring(0,pos);
				}

				switch (positionType) {
					case "bottomLeft":
						console.log("bottomLeft no thing...");
						break;
					case "bottomRight":
						prompt.find(".formErrorContent").before(arrow);
						arrow.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
						break;
					case "topLeft":
					case "topRight":
						arrow.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
						prompt.append(arrow);
						break;
				}
			}
			// Add custom prompt class
			if (options.addPromptClass)
				prompt.addClass(options.addPromptClass);

            // Add custom prompt class defined in element
            var requiredOverride = field.attr('data-required-class');
            if(requiredOverride !== undefined) {
                prompt.addClass(requiredOverride);
            } else {
                if(options.prettySelect) {
                    if($('#' + field.attr('id')).next().is('select')) {
                        var prettyOverrideClass = $('#' + field.attr('id').substr(options.usePrefix.length).substring(options.useSuffix.length)).attr('data-required-class');
                        if(prettyOverrideClass !== undefined) {
                            prompt.addClass(prettyOverrideClass);
                        }
                    }
                }
            }

			prompt.css({
				"opacity": 0
			});
			if(positionType === 'inline') {
				prompt.addClass("inline");
				if(typeof field.attr('data-prompt-target') !== 'undefined' && $('#'+field.attr('data-prompt-target')).length > 0) {
					prompt.appendTo($('#'+field.attr('data-prompt-target')));
				} else {
					field.after(prompt);
				}
			} else {
				field.before(prompt);
			}

			var pos = methods._calculatePosition(field, prompt, options);
			prompt.css({
				'position': positionType === 'inline' ? 'relative' : 'absolute',
				"top": pos.callerTopPosition,
				"left": pos.callerleftPosition,
				"marginTop": pos.marginTopSize,
				"opacity": 0
			}).data("callerField", field);


			if (options.autoHidePrompt) {
				setTimeout(function(){
					prompt.animate({
						"opacity": 0
					},function(){
						prompt.closest('.formError').remove();
					});
				}, options.autoHideDelay);
			}
			return prompt.animate({
				"opacity": 0.87
			});
		},
		/**
		* Updates the prompt text field - the field for which the prompt
		* @param {jqObject} field
		* @param {String} promptText html text to display type
		* @param {String} type the type of bubble: 'pass' (green), 'load' (black) anything else (red)
		* @param {boolean} ajaxed - use to mark fields than being validated with ajax
		* @param {Map} options user options
		*/
		_updatePrompt: function(field, prompt, promptText, type, ajaxed, options, noAnimation) {

			if (prompt) {
				if (typeof type !== "undefined") {
					if (type == "pass")
						prompt.addClass("greenPopup");
					else
						prompt.removeClass("greenPopup");

					if (type == "load")
						prompt.addClass("blackPopup");
					else
						prompt.removeClass("blackPopup");
				}
				if (ajaxed)
					prompt.addClass("ajaxed");
				else
					prompt.removeClass("ajaxed");

				prompt.find(".formErrorContent").html(promptText);

				var pos = methods._calculatePosition(field, prompt, options);
				var css = {"top": pos.callerTopPosition,
				"left": pos.callerleftPosition,
				"marginTop": pos.marginTopSize,
				"opacity": 0.87};

				if (noAnimation)
					prompt.css(css);
				else
					prompt.animate(css);
			}
		},
		/**
		* Closes the prompt associated with the given field
		*
		* @param {jqObject}
		*            field
		*/
		 _closePrompt: function(field) {
			 var prompt = methods._getPrompt(field);
			 if (prompt)
				 prompt.fadeTo("fast", 0, function() {
					 prompt.closest('.formError').remove();
				 });
		 },
		 closePrompt: function(field) {
			 return methods._closePrompt(field);
		 },
		/**
		* Returns the error prompt matching the field if any
		*
		* @param {jqObject}
		*            field
		* @return undefined or the error prompt (jqObject)
		*/
		_getPrompt: function(field) {
				var formId = $(field).closest('form, .validationEngineContainer').attr('id');
			var className = methods._getClassName(field.attr("id")) + "formError";
				var match = $("." + methods._escapeExpression(className) + '.parentForm' + methods._getClassName(formId))[0];
			if (match)
			return $(match);
		},
		/**
		  * Returns the escapade classname
		  *
		  * @param {selector}
		  *            className
		  */
		  _escapeExpression: function (selector) {
			  return selector.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1");
		  },
		/**
		 * returns true if we are in a RTLed document
		 *
		 * @param {jqObject} field
		 */
		isRTL: function(field)
		{
			var $document = $(document);
			var $body = $('body');
			var rtl =
				(field && field.hasClass('rtl')) ||
				(field && (field.attr('dir') || '').toLowerCase()==='rtl') ||
				$document.hasClass('rtl') ||
				($document.attr('dir') || '').toLowerCase()==='rtl' ||
				$body.hasClass('rtl') ||
				($body.attr('dir') || '').toLowerCase()==='rtl';
			return Boolean(rtl);
		},
		/**
		* Calculates prompt position
		*
		* @param {jqObject}
		*            field
		* @param {jqObject}
		*            the prompt
		* @param {Map}
		*            options
		* @return positions
		*/
		_calculatePosition: function (field, promptElmt, options) {

			var promptTopPosition, promptleftPosition, marginTopSize;
			var fieldWidth 	= field.width();
			var fieldLeft 	= field.position().left;
			var fieldTop 	=  field.position().top;
			var fieldHeight 	=  field.height();
			var promptHeight = promptElmt.height();


			// is the form contained in an overflown container?
			promptTopPosition = promptleftPosition = 0;
			// compensation for the arrow
			marginTopSize = -promptHeight;


			//prompt positioning adjustment support
			//now you can adjust prompt position
			//usage: positionType:Xshift,Yshift
			//for example:
			//   bottomLeft:+20 means bottomLeft position shifted by 20 pixels right horizontally
			//   topRight:20, -15 means topRight position shifted by 20 pixels to right and 15 pixels to top
			//You can use +pixels, - pixels. If no sign is provided than + is default.
			var positionType=field.data("promptPosition") || options.promptPosition;
			var shift1="";
			var shift2="";
			var shiftX=0;
			var shiftY=0;
			if (typeof(positionType)=='string') {
				//do we have any position adjustments ?
				if (positionType.indexOf(":")!=-1) {
					shift1=positionType.substring(positionType.indexOf(":")+1);
					positionType=positionType.substring(0,positionType.indexOf(":"));

					//if any advanced positioning will be needed (percents or something else) - parser should be added here
					//for now we use simple parseInt()

					//do we have second parameter?
					if (shift1.indexOf(",") !=-1) {
						shift2=shift1.substring(shift1.indexOf(",") +1);
						shift1=shift1.substring(0,shift1.indexOf(","));
						shiftY=parseInt(shift2);
						if (isNaN(shiftY)) shiftY=0;
					};

					shiftX=parseInt(shift1);
					if (isNaN(shift1)) shift1=0;

				};
			};


			switch (positionType) {
				default:
				case "topRight":
					promptleftPosition +=  fieldLeft + fieldWidth - 27;
					promptTopPosition +=  fieldTop;
					break;

				case "topLeft":
					promptTopPosition +=  fieldTop;
					promptleftPosition += fieldLeft;
					break;

				case "centerRight":
					promptTopPosition = fieldTop+4;
					marginTopSize = 0;
					promptleftPosition= fieldLeft + field.outerWidth(true)+5;
					break;
				case "centerLeft":
					promptleftPosition = fieldLeft - (promptElmt.width() + 2);
					promptTopPosition = fieldTop+4;
					marginTopSize = 0;

					break;

				case "bottomLeft":
					promptTopPosition = fieldTop + field.height() + 5;
					marginTopSize = 0;
					promptleftPosition = fieldLeft;
					break;
				case "bottomRight":
					promptleftPosition = fieldLeft + fieldWidth - 27;
					promptTopPosition =  fieldTop +  field.height() + 5;
					marginTopSize = 0;
					break;
				case "inline":
					promptleftPosition = 0;
					promptTopPosition = 0;
					marginTopSize = 0;
			};



			//apply adjusments if any
			promptleftPosition += shiftX;
			promptTopPosition  += shiftY;

			return {
				"callerTopPosition": promptTopPosition + "px",
				"callerleftPosition": promptleftPosition + "px",
				"marginTopSize": marginTopSize + "px"
			};
		},
		/**
		* Saves the user options and variables in the form.data
		*
		* @param {jqObject}
		*            form - the form where the user option should be saved
		* @param {Map}
		*            options - the user options
		* @return the user options (extended from the defaults)
		*/
		 _saveOptions: function(form, options) {

			 // is there a language localisation ?
			 if ($.validationEngineLanguage)
			 var allRules = $.validationEngineLanguage.allRules;
			 else
			 $.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page");
			 // --- Internals DO NOT TOUCH or OVERLOAD ---
			 // validation rules and i18
			 $.validationEngine.defaults.allrules = allRules;

			 var userOptions = $.extend(true,{},$.validationEngine.defaults,options);

			 form.data('jqv', userOptions);
			 return userOptions;
		 },

		 /**
		 * Removes forbidden characters from class name
		 * @param {String} className
		 */
		 _getClassName: function(className) {
			 if(className)
				 return className.replace(/:/g, "_").replace(/\./g, "_");
					  },
		/**
		 * Escape special character for jQuery selector
		 * http://totaldev.com/content/escaping-characters-get-valid-jquery-id
		 * @param {String} selector
		 */
		 _jqSelector: function(str){
			return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
		},
		/**
		* Conditionally required field
		*
		* @param {jqObject} field
		* @param {Array[String]} rules
		* @param {int} i rules index
		* @param {Map}
		* user options
		* @return an error string if validation failed
		*/
		_condRequired: function(field, rules, i, options) {
			var idx, dependingField;

			for(idx = (i + 1); idx < rules.length; idx++) {
				dependingField = jQuery("#" + rules[idx]).first();

				/* Use _required for determining wether dependingField has a value.
				 * There is logic there for handling all field types, and default value; so we won't replicate that here
				 * Indicate this special use by setting the last parameter to true so we only validate the dependingField on chackboxes and radio buttons (#462)
				 */
				if (dependingField.length && methods._required(dependingField, ["required"], 0, options, true) == undefined) {
					/* We now know any of the depending fields has a value,
					 * so we can validate this field as per normal required code
					 */
					return methods._required(field, ["required"], 0, options);
				}
			}
		},

	    _submitButtonClick: function(event) {
	        var button = $(this);
	        var form = button.closest('form, .validationEngineContainer');
	        form.data("jqv_submitButton", button.attr("id"));
	    }
	 	 };
	 /**
	 * Plugin entry point.
	 * You may pass an action as a parameter or a list of options.
	 * if none, the init and attach methods are being called.
	 * Remember: if you pass options, the attached method is NOT called automatically
	 *
	 * @param {String}
	 *            method (optional) action
	 */
	 $.fn.validationEngine = function(method) {

		 var form = $(this);
		 if(!form[0]) return form;  // stop here if the form does not exist

		 if (typeof(method) == 'string' && method.charAt(0) != '_' && methods[method]) {

			 // make sure init is called once
			 if(method != "showPrompt" && method != "hide" && method != "hideAll")
			 methods.init.apply(form);

			 return methods[method].apply(form, Array.prototype.slice.call(arguments, 1));
		 } else if (typeof method == 'object' || !method) {

			 // default constructor with or without arguments
			 methods.init.apply(form, arguments);
			 return methods.attach.apply(form);
		 } else {
			 $.error('Method ' + method + ' does not exist in jQuery.validationEngine');
		 }
	};



	// LEAK GLOBAL OPTIONS
	$.validationEngine= {fieldIdCounter: 0,defaults:{

		// Name of the event triggering field validation
		validationEventTrigger: "blur",
		// Automatically scroll viewport to the first error
		scroll: true,
		// Focus on the first input
		focusFirstField:true,
		// Show prompts, set to false to disable prompts
		showPrompts: true,
		// Should we attempt to validate non-visible input fields contained in the form? (Useful in cases of tabbed containers, e.g. jQuery-UI tabs)
		validateNonVisibleFields: false,
		// ignore the validation for fields with this specific class (Useful in cases of tabbed containers AND hidden fields we don't want to validate)
		ignoreFieldsWithClass: 'ignoreMe',
		// Opening box position, possible locations are: topLeft,
		// topRight, bottomLeft, centerRight, bottomRight, inline
		// inline gets inserted after the validated field or into an element specified in data-prompt-target
		promptPosition: "topRight",
		bindMethod:"bind",
		// internal, automatically set to true when it parse a _ajax rule
		inlineAjax: false,
		// if set to true, the form data is sent asynchronously via ajax to the form.action url (get)
		ajaxFormValidation: false,
		// The url to send the submit ajax validation (default to action)
		ajaxFormValidationURL: false,
		// HTTP method used for ajax validation
		ajaxFormValidationMethod: 'get',
		// Ajax form validation callback method: boolean onComplete(form, status, errors, options)
		// retuns false if the form.submit event needs to be canceled.
		onAjaxFormComplete: $.noop,
		// called right before the ajax call, may return false to cancel
		onBeforeAjaxFormValidation: $.noop,
		// Stops form from submitting and execute function assiciated with it
		onValidationComplete: false,

		// Used when you have a form fields too close and the errors messages are on top of other disturbing viewing messages
		doNotShowAllErrosOnSubmit: false,
		// Object where you store custom messages to override the default error messages
		custom_error_messages:{},
		// true if you want to validate the input fields on blur event
		binded: true,
		// set to true if you want to validate the input fields on blur only if the field it's not empty
		notEmpty: false,
		// set to true, when the prompt arrow needs to be displayed
		showArrow: true,
		// set to false, determines if the prompt arrow should be displayed when validating
		// checkboxes and radio buttons
		showArrowOnRadioAndCheckbox: false,
		// did one of the validation fail ? kept global to stop further ajax validations
		isError: false,
		// Limit how many displayed errors a field can have
		maxErrorsPerField: false,

		// Caches field validation status, typically only bad status are created.
		// the array is used during ajax form validation to detect issues early and prevent an expensive submit
		ajaxValidCache: {},
		// Auto update prompt position after window resize
		autoPositionUpdate: false,

		InvalidFields: [],
		onFieldSuccess: false,
		onFieldFailure: false,
		onSuccess: false,
		onFailure: false,
		validateAttribute: "class",
		addSuccessCssClassToField: "",
		addFailureCssClassToField: "",

		// Auto-hide prompt
		autoHidePrompt: false,
		// Delay before auto-hide
		autoHideDelay: 10000,
		// Fade out duration while hiding the validations
		fadeDuration: 300,
	 // Use Prettify select library
	 prettySelect: false,
	 // Add css class on prompt
	 addPromptClass : "",
	 // Custom ID uses prefix
	 usePrefix: "",
	 // Custom ID uses suffix
	 useSuffix: "",
	 // Only show one message per error prompt
	 showOneMessage: false
	}};
	$(function(){$.validationEngine.defaults.promptPosition = methods.isRTL()?'topLeft':"topRight"});
})(jQuery);
