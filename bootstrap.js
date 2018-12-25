'use strict';

const blacklist = [
    'fbclid',
    'gclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
];

/// Intercept web request
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    const qs_index = details.url.indexOf('?');
    // skip if no query string
    if (qs_index < 0) return {};

    let changed = false;
    let params = new URLSearchParams(details.url.substr(qs_index + 1));
    for (let key of blacklist) {
        if (params.has(key)) {
            params.delete(key);
            changed = true;
        }
    }
    if (changed) {
        let qs = "" + params;
        if (qs != "") { qs = "?" + qs; }
        const url = details.url.substr(0, qs_index) + qs;
        return {
            redirectUrl: url
        };
    }
    return {};
},
{urls: ["<all_urls>"]},
["blocking"]);
