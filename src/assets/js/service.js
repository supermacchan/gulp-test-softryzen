import $ from 'jquery';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import validateLocales from '../../json/validateLocales.json';
import formMessageLocales from '../../json/formMessageLocales.json';

/**
 * It makes a request to Cloudflare's `cdn-cgi/trace` endpoint, parses the response, and returns an
 * object with the parsed data
 * @returns An object with the following properties:
 *   - colo
 *   - http_x_forwarded_for
 *   - ip
 *   - loc
 *   - org
 *   - query_status
 *   - ray
 *   - server_name
 *   - uag
 *   - uip
 *   - visid_incap_<id>
 *   - visid_inc
 */
async function getIpInfo() {
  try {
    const { data } = await axios.get('https://www.cloudflare.com/cdn-cgi/trace');

    return data
      .trim()
      .split('\n')
      .reduce(function (obj, pair) {
        pair = pair.split('=');
        return (obj[pair[0]] = pair[1]), obj;
      }, {});
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * It makes a request to a free API that returns the country code of the user's IP address
 * @returns The country code of the user's IP address.
 */
async function geoIpLookup(defaultCountry = 'ua') {
  if (window.ipData?.loc) {
    return window.ipData?.loc?.toLowerCase() || defaultCountry;
  } else {
    try {
      const { data } = await axios.get('https://ip.nf/me.json');

      return data?.ip?.country_code?.toLowerCase() || defaultCountry;
    } catch (error) {
      console.error(error);
      return defaultCountry;
    }
  }
}

/**
 * It returns a configuration object for the intl-tel-input library
 * @param preferredCountries - An array of country codes that you want to be at the top of the list.
 * @param excludeCountries - An array of country codes to exclude from the dropdown.
 * @returns An object with the following properties:
 * initialCountry: The country code of the country that the user is in.
 * preferredCountries: An array of country codes that will be displayed at the top of the dropdown.
 * excludeCountries: An array of country codes that will be excluded from the dropdown.
 * utilsScript: The path to the utils.js file.
 */
async function getItiConfig(preferredCountries, excludeCountries) {
  const country_code = window.itiInitialCountry || (await geoIpLookup());

  return {
    initialCountry: country_code,
    preferredCountries,
    excludeCountries,
    utilsScript: './assets/js/utils.js',
  };
}

/**
 * It takes a parameter name as a string, and returns the value of that parameter in the URL
 * @param sParam - The name of the parameter you want to get the value of.
 * @returns The value of the parameter in the URL.
 */
function getUrlParameter(sParam) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === 'undefined' ? true : sParameterName[1];
    }
  }
}

/**
 * It takes a key and a value, and updates the URL in the browser's address bar with the new key/value
 * pair
 * @param key - The key of the parameter you want to set.
 * @param value - The value to set the parameter to.
 */
function setUrlParameter(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, document.title, url);
}

/**
 * It's a function that send contact to intelza
 */
async function sendDataToIntelza(phoneNumber) {
  try {
    const { data } = await axios.post('./crm/elza.php', {
      phone: phoneNumber,
      product_name: window.productName,
      delay: 7,
    });

    return data.id ? data.id : null;
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * If the string is a number, return true, otherwise return false
 * @param str - The string to be tested.
 * @returns true or false
 */
function isNumeric(str) {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

/**
 * Setting the validation options for the form.
 */
const validationOptions = {
  errorFieldCssClass: 'is-invalid',
  errorFieldStyle: {
    border: '1px solid #ca381f',
  },
  errorLabelCssClass: 'is-label-invalid',
  errorLabelStyle: {
    color: '#ca381f',
    textDecoration: 'underlined',
  },
  focusInvalidField: true,
  lockForm: true,
};

/**
 * It takes a locale as an argument, and returns an array of objects with the locale key and the locale
 * dictionary
 * @param locale - The locale to get the validation messages for.
 * @returns An array of objects with a key and a dict property.
 */
function getValidationLocale(locale = window.locale) {
  return validateLocales.map(({ key, dict }) => {
    const localeDict = {};
    localeDict[locale] = dict[locale];

    if (!dict[locale]) {
      throw new Error(
        `No locale found for ${locale}. Please add it to the validateLocales.json file.`
      );
    }

    return { key, dict: localeDict };
  });
}

/**
 * It returns an array of validation rules for each field
 * @param input - The input element that is being validated.
 * @param allInputs - An array of all the inputs in the form.
 * @returns an array of objects.
 */
function getValidationFields(input, allInputs) {
  const { required } = input;
  const { field } = input.dataset;

  /* The above code is a JavaScript object that contains the validation rules for each field. */
  const fields = {
    name: [
      {
        rule: 'required',
        errorMessage: 'Name is required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'The field must contain a minimum of 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'The field must contain a maximum of 30 characters',
      },
      {
        rule: 'customRegexp',
        value: getNameRegex(),
        errorMessage: 'Name is invalid',
      },
    ],
    phone: [
      {
        rule: 'required',
        errorMessage: 'Phone number is required',
      },
    ],
    email: [
      {
        rule: 'required',
        errorMessage: 'Email is required',
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!',
      },
      {
        rule: 'customRegexp',
        value: getEmailRegex(),
        errorMessage: 'Email is invalid!',
      },
    ],
    promocode: [
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'The field must contain a minimum of 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'The field must contain a maximum of 30 characters',
      },
    ],
    checkbox: [
      {
        rule: 'required',
        errorMessage: 'The field is required',
      },
    ],
    radio: [
      {
        rule: 'required',
        errorMessage: 'The field is required',
      },
    ],
    // message: [
    //   {
    //     rule: 'minLength',
    //     value: 3,
    //     errorMessage: 'The field must contain a minimum of 3 characters',
    //   },
    //   {
    //     rule: 'maxLength',
    //     value: 1000,
    //     errorMessage: 'The field must contain a maximum of 1000 characters',
    //   },
    // ],
    // text: [
    //   {
    //     rule: 'minLength',
    //     value: 3,
    //     errorMessage: 'The field must contain a minimum of 3 characters',
    //   },
    //   {
    //     rule: 'maxLength',
    //     value: 100,
    //     errorMessage: 'The field must contain a maximum of 100 characters',
    //   },
    // ],
    // textarea: [
    //   {
    //     rule: 'minLength',
    //     value: 3,
    //     errorMessage: 'The field must contain a minimum of 3 characters',
    //   },
    //   {
    //     rule: 'maxLength',
    //     value: 500,
    //     errorMessage: 'The field must contain a maximum of 500 characters',
    //   },
    // ],
    // select: [
    //   {
    //     rule: 'required',
    //     errorMessage: 'The field is required',
    //   },
    // ],
    // file: [
    //   {
    //     rule: 'required',
    //     errorMessage: 'The field is required',
    //   },
    // ],
  };

  return fields[field]
    .filter(({ rule }) => rule !== 'required')
    .concat(required ? fields[field][0] : []);
}

/**
 * It takes a form and applies validation rules to each of its fields
 * @param validationForm - the form to validate
 * @returns A validation form
 */
function setFormValidation(validationForm) {
  const inputs = validationForm.form.elements;

  // apply rules to form fields
  Object.entries(inputs)
    .reduce((acc, [key, value]) => {
      if (isNumeric(key) && value.type !== 'submit') {
        acc.push(value);
      }
      return acc;
    }, [])
    .filter(input => input.dataset.field)
    .map((input, index, arr) => {
      const { id } = input;
      const validationOptionField = getValidationFields(input, arr);

      if (validationOptionField.length) {
        /* Adding an event listener to the input field. */
        $(input).on('input', () => {
          validationForm.revalidateField(`#${id}`);
        });

        validationForm.addField(`#${id}`, getValidationFields(input, arr));
      }
    });

  return validationForm;
}

/**
 * It takes a locale as an argument, and returns an array of objects with a key and a message
 * @param locale - The locale to get the messages for.
 * @returns An array of objects with the key and msg properties.
 */
function getFormMessageLocale(locale) {
  return formMessageLocales.map(({ key, dict }) => {
    if (!dict[locale]) {
      throw new Error(
        `No locale found for ${locale}. Please add it to the formMessageLocale.json file.`
      );
    }

    return { key, msg: dict[locale] };
  });
}

/**
 * It takes a locale and a key, and returns the message associated with that key in the given locale
 * @param key - The key of the message to be translated.
 * @param locale - The locale of the form message.
 * @returns The message for the key that matches the key passed in.
 */
function translate(key, locale = window.locale) {
  const message = getFormMessageLocale(locale).find(({ key: k }) => k === key)?.msg;

  if (!message) {
    throw new Error(`No message found for key ${key}`);
  }

  return message;
}

/**
 * It returns a regular expression that matches a name in the given locale
 * @param [locale] - The locale of the user.
 * @returns A regular expression that matches a string of characters that are allowed in a name.
 */
function getNameRegex(locale = window.locale) {
  switch (locale) {
    // Польша(pl)
    case 'pl':
      return /^.[a-zA-ZĄąĆćĘęŁłŃńÓóŚśŹźŻż 'ʼ`-]{1,}$/i;

    // Филиппины(en)
    case 'en':
      return /^.[a-zA-Z 'ʼ`-]{1,}$/gm;

    // Румыния(ro)
    case 'ro':
      return /^.[a-zA-ZĂăÂâÎîȘșȚț 'ʼ`-]{1,}$/gm;

    // Испания(es)
    case 'es':
      return /^.[a-zA-ZáéíÑñóúü 'ʼ`-]{1,}$/gm;

    // Украина(uk)
    default:
      return /^.[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ 'ʼ`-]{1,}$/gm;
  }
}

/**
 * It returns the Email regular expression
 */
function getEmailRegex() {
  return /^(?=^.{3,63}$)(^[A-Za-z0-9_+]+(([_\.\-\+](?=[A-Za-z0-9_+]))[a-zA-Z0-9_+]+([\-\.\+](?=[A-Za-z0-9_+]))*?)*@(\w+([\.\-](?=(\w|\d))))+[a-zA-Z]{2,6})$/;
}

/**
 * It takes a formData object and adds the values to the URL as query parameters
 * @param formData - the form data object
 */
function setParamsForLeeloo(formData) {
  let fields = {
    utm_source: 'utm_source',
    utm_medium: 'utm_medium',
    utm_term: 'utm_term',
    utm_campaign: 'utm_campaign',
    utm_content: 'utm_content',
    campaignId: 'campaignid',
    adsetId: 'adsetid',
    adId: 'adid',
    phone: 'phone',
    email: 'email',
    name: 'first_name',
    google_id: 'ga',
  };

  let keys = Object.keys(formData);
  let url = new URL(window.location);

  for (let i = 0; i < keys.length; i++) {
    if (formData[keys[i]] !== undefined && formData[keys[i]] !== null) {
      if (fields.hasOwnProperty(keys[i])) {
        if (formData[keys[i]].length > 0) {
          url.searchParams.set(fields[keys[i]], formData[keys[i]]);
        }
      }
    }
  }

  window.history.pushState({}, document.title, url);
}

/**
 * It creates a div with a class of leeloo and appends it to the form's parent element
 * @param form - The form you want to add Leeloo to.
 * @param [leelooHash] - This is the hash that you can find in the Leeloo init code.
 */
function initializeLeeloo(form, leelooHash = window.leelooHash) {
  const leeloo = $(`<div class='leeloo'><div class="wepster-hash-${leelooHash}"></div></div>`).css(
    'display',
    'none'
  );
  $(form).parent().append(leeloo);

  window.LEELOO = function () {
    window.LEELOO_INIT = { id: '5d0cb9cdaad9f4000e4b8e07' };
    var js = document.createElement('script');
    js.src = 'https://app.leeloo.ai/init.js';
    js.async = true;
    document.getElementsByTagName('head')[0].appendChild(js);
  };
  LEELOO();
  window.LEELOO_LEADGENTOOLS = (window.LEELOO_LEADGENTOOLS || []).concat(leelooHash);

  $('.leeloo').css('display', 'block');
}

/**
 * It sends a POST request to the mail.php file with the data object as the body of the request
 * @param data - The data object that will be sent to the server.
 * @returns The result of the axios.post request.
 */
async function sendEmail(data) {
  const result = await axios.post('./mail.php', data);
  return result.data;
}

/**
 * It takes an array of utm marks, checks if they exist in the URL, and if they do, it saves them to
 * cookies
 * @param array - an array of utm marks to save to cookies
 */
function saveParamsToCookies(array) {
  array.forEach(utmMark => {
    const utm = getUrlParameter(utmMark);
    if (utm) {
      Cookies.set(utmMark, utm);
    }
  });
}

/**
 * It creates a loading div with a progress bar and message, and then removes it when the loading is
 * complete
 */
class Loading {
  constructor(form, message = 'Loading...', closeModal = false) {
    this.form = form;
    this.message = message;
    this.closeModal = closeModal;
  }

  show() {
    const loadingDiv = `<div class="mt-12" data-${this.form.id}-loading><p>${this.message}</p><div class="progress-bar"><div class="color"></div></div></div>`;
    $(this.form).parent().append(loadingDiv);
  }

  hide() {
    $(`[data-${this.form.id}-loading]`).remove();
    if (this.closeModal) {
      closeModalItem();
    }
  }
}

/**
 * When the user clicks on the close button, the modal is hidden and the body is no longer
 * scroll-hidden
 */
function closeModalItem() {
  $('[data-modal]').addClass('is-hidden');
  $('body').removeClass('scroll-hidden');
}

/**
 * Selects button with type submit.
 */
const submitButton = $('button[type="submit"]');

/**
 * Adds "disabled" attribute to button with type submit.
 */
function addDisabledAttributeToSubmitBtn() {
  if (submitButton) {
    return submitButton.attr('disabled', true);
  }
}

/**
 * Removes "disabled" attribute from button with type submit.
 */
function removeDisabledAttributeFromSubmitBtn() {
  if (submitButton) {
    return submitButton.removeAttr('disabled');
  }
}

/**
 * It shows an error message to the user
 * @param errorMessage - The error message to display.
 * @param [autoClose=true] - If true, the alert will automatically close after 2 seconds.
 * @param [loading=null] - The loading object that you can pass to showLoading() to hide it.
 * @param [closeModal=false] - If the modal should be closed after the error is shown.
 */
function showError(errorMessage, autoClose = true, loading = null, closeModal = false) {
  if (loading) {
    loading.hide();
  }

  if (closeModal) {
    closeModalItem();
  }

  let timerInterval;

  const options = {
    titleText: translate('error'),
    text: errorMessage || translate('tryAgain'),
    icon: 'error',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn',
    },
  };

  if (autoClose) {
    options.timer = 2000;
    options.timerProgressBar = true;
    options.didOpen = () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {}, 100);
    };

    options.willClose = () => {
      clearInterval(timerInterval);
    };
  }

  removeDisabledAttributeFromSubmitBtn();

  Swal.fire(options);
}

/**
 * It shows a success message to the user
 * @param successMessage - The message to display in the alert.
 * @param [autoClose=true] - If true, the alert will close automatically after 2 seconds.
 * @param [loading=null] - The loading element that you want to hide.
 * @param [closeModal=false] - If you want to close the modal after the success message is shown, set
 * this to true.
 * @param [btnLink=null] - The link to open in a new tab
 * @param [btnText=null] - The text of the button.
 */
function showSuccess(
  successMessage,
  autoClose = true,
  loading = null,
  closeModal = false,
  btnLink = null,
  btnText = null
) {
  if (loading) {
    loading.hide();
  }

  if (closeModal) {
    closeModalItem();
  }

  let timerInterval;

  const options = {
    titleText: translate('thanks'),
    text: successMessage || translate('reply'),
    icon: 'success',
    iconColor: '#FF6C00',
    showCloseButton: true,
  };

  if (btnLink && btnText) {
    options.confirmButtonText = btnText;
    options.buttonsStyling = false;
    options.customClass = {
      confirmButton: 'btn',
    };
  }

  if (autoClose) {
    options.timer = 2000;
    options.timerProgressBar = true;
    options.didOpen = () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {}, 100);
    };

    options.willClose = () => {
      clearInterval(timerInterval);
    };
  }

  removeDisabledAttributeFromSubmitBtn();

  Swal.fire(options).then(result => {
    if (result.isConfirmed && btnLink) {
      window.open(btnLink, '_blank');
    }
  });
}

/**
 * Generate a random string of length 32, where each character is a hexadecimal digit.
 * @returns A string of random characters.
 */
function uid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * It sends an HTTP request to the server, and returns true if the server says the email is available,
 * and false if the server says the email is not available
 * @param email - The email address to check.
 * @returns A boolean value.
 */
async function checkEmailDomain(email) {
  try {
    const { data } = await axios.post('./check-email.php', { email });
    return data?.status === 'ok' ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * It takes a form and a step number, and toggles the active class on the current step and the next
 * step
 * @param form - the form element
 * @param nextStep - The next step to show.
 */
function changeFormStep(form, nextStep) {
  $('li').index($(`[data-${form.id}-steps] .active`).toggleClass('active'));
  $(`[data-${form.id}-steps] li:nth-child(${nextStep})`).toggleClass('active');
}

export default {
  addDisabledAttributeToSubmitBtn,
  changeFormStep,
  checkEmailDomain,
  geoIpLookup,
  getIpInfo,
  getItiConfig,
  getUrlParameter,
  getValidationLocale,
  initializeLeeloo,
  isNumeric,
  Loading,
  saveParamsToCookies,
  sendDataToIntelza,
  sendEmail,
  setFormValidation,
  setParamsForLeeloo,
  setUrlParameter,
  showError,
  showSuccess,
  translate,
  uid,
  validationOptions,
};
