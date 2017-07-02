/**
 * Make a X-Domain request to url and callback.
 *
 * @param url {String}
 * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
 * @param data {String} request body
 * @param header {Dict} header options
 * @param callback {Function} to callback on completion
 * @param errback {Function} to callback on error
 */
function xdr(article_url, context, api_url, method, data, header, callback, errback) {
    var req;

    if(XMLHttpRequest) {
        req = new XMLHttpRequest();

        if('withCredentials' in req) {
            req.open(method, api_url, true);
            req.onerror = errback;
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status < 400) {
                        callback(article_url, context, req.responseText);
                    } else {
                        errback(new Error('Response returned with non-OK status'));
                    }
                }
            };
            for ( var h in header ) {
              req.setRequestHeader(h, header[h]);
            }
            req.send(data);
        }
    } else if(XDomainRequest) {
        req = new XDomainRequest();
        req.open(method, api_url);
        req.onerror = errback;
        req.onload = function() {
            callback(article_url, context, req.responseText);
        };
        for ( var h in header ) {
          req.setRequestHeader(h, header[h]);
        }
        req.send(data);
    } else {
        errback(new Error('CORS not supported'));
    }
}

function stacosys_get_count(article_url, context, callback, errback) {
  var api_url = STACOSYS_URL + '/comments/count?token=' + STACOSYS_TOKEN + '&url=' + article_url;
  xdr(article_url, context, api_url, 'GET', null, {}, callback, errback);
}

function stacosys_load_comments(article_url, callback, errback) {
  var api_url = STACOSYS_URL + '/comments?token=' + STACOSYS_TOKEN + '&url=' + article_url;
  xdr(article_url, null, api_url, 'GET', null, {}, callback, errback);
}

function stacosys_new_comment(article_url, author, email, site, captcha, subscribe, message, callback, errback) {
  var api_url = STACOSYS_URL + '/comments';
  var data = {
    'token': STACOSYS_TOKEN,
    'url': article_url,
    'author': author,
    'email': email,
    'site': site,
    'captcha': captcha,
    'subscribe': subscribe,
    'message': message
  };
  var header = {
    'Content-type': 'application/json'
  };
  var j = JSON.stringify(data);
  xdr(article_url, null, api_url, 'POST', JSON.stringify(data), header, callback, errback);
}
