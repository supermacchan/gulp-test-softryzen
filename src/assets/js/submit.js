import axios from 'axios';

function generateData(crmParams) {
  const { origin, pathname } = window.location;
  const action_source = `${origin}${pathname}`;

  let data = {
    name: crmParams.userName,
    phone: crmParams.userPhone,
    email: crmParams.userEmail,
    promocode: crmParams.userPromocode,
    psWhoIs1: crmParams.userType,
    product_name: crmParams.productName,
    product_id: crmParams.productId,
    SiteURL: action_source,
    website: 'website',
    Projects: 'GoIT',
    Potential_Category: 'Course',
    Course: crmParams.productId,
    leadFBC: getCookie('_fbc'),
    leadFBP: getCookie('_fbp'),
    leadActionSource: action_source,
    leadFormat: window.leadFormat || 'marathon',
    leadIP: window.ipData.ip || '',
    leadUserAgent: window.navigator.userAgent,
    google_id: readCookie('_ga'),
  };
  return ensureUtmData(data);
}

async function submit(crmParams) {
  let data = generateData(crmParams);
  const response = await send(data);

  return response;
}

async function send(data) {
  return await axios({
    method: 'post',
    url: './crm/lead.php',
    data: data,
  });
}

function ensureUtmData(data) {
  data.utm_source = getCookie('utm_source');
  data.utm_medium = getCookie('utm_medium');
  data.utm_term = getCookie('utm_term');
  data.utm_campaign = getCookie('utm_campaign');
  data.utm_content = getCookie('utm_content');
  data.campaignId = getCookie('campaignId');
  data.adsetId = getCookie('adsetId');
  data.adId = getCookie('adId');

  return data;
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function readCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      let cidLong = c.substring(nameEQ.length, c.length);
      let tmp = cidLong.split('.');
      return tmp[2] + '.' + tmp[3];
    }
  }
  return null;
}

export default {
  generateData,
  submit,
};
