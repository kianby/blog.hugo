// --------------------------------------------------------------------------
//  Common functions
// --------------------------------------------------------------------------

function show_hide(panel_id, button_id){
    if (document.getElementById(panel_id).style.display == 'none'){
        document.getElementById(panel_id).style.display = '';
        document.getElementById(button_id).style.display = 'none';
    } else {
        document.getElementById(panel_id).style.display = 'none';
    }
}

// --------------------------------------------------------------------------
//  Load and display page comments
// --------------------------------------------------------------------------

function initialize_comments() {
  stacosys_get_count(STACOSYS_PAGE, null, init_success, init_failure);
}

function init_success(article_url, context, data) {
  var response = JSON.parse(data);
  var count = response.count;
  if (count > 0) {
    if (count > 1) {
      document.getElementById('show-comment-label').innerHTML = 'Voir les ' + count + ' commentaires';
    }
    document.getElementById('show-comments-button').style.display = '';
  }
  console.log('initialization success');
}

function init_failure(error) {
  // NOP
  console.log('initialization failure');
}

function get_comments_count(url, context) {
  stacosys_get_count(url, context, count_success, count_failure);
}

function count_success(article_url, context, data) {
  var response = JSON.parse(data);
  var count = response.count;
  if (count > 0) {
    if (count > 1) {
      context.innerHTML = '<i class="fa fa-comment fa-md"></i> ' + count + ' commentaires';
    }
    else {
      context.innerHTML = '<i class="fa fa-comment fa-md"></i> ' + count + ' commentaire';
    }
    context.style.display = '';
  }
  else {
    context.innerHTML = '0'
  }
  console.log('initialization success');
}

function count_failure(error) {
  // NOP
  console.log('get comments count failure');
}

function show_comments() {
  stacosys_load_comments(STACOSYS_PAGE, loading_success, loading_failure);
}

function loading_success(article_url, context, data) {
  var response = JSON.parse(data);
  for (var i = 0, numTokens = response.data.length; i < numTokens; ++i) {
    response.data[i].mdcontent = markdown.toHTML(response.data[i].content);
  }
  show_hide('stacosys-comments', 'show-comments-button');
  var template = document.getElementById('stacosys-template').innerHTML;
  var parseTags = new Array();
  parseTags.push("[[");
  parseTags.push("]]");
  Mustache.parse(template,parseTags);
  var rendered = Mustache.render(template, response);
  document.getElementById('stacosys-comments').innerHTML = rendered;
}

function loading_failure(error) {
  // NOP
  console.log('loading failure');
}

// --------------------------------------------------------------------------
//  Submit a new comment
// --------------------------------------------------------------------------

function new_comment() {
  var author = document.getElementById('author').value;
  var email = document.getElementById('email').value;
  var site = document.getElementById('site').value;
  var captcha = document.getElementById('captcha').value;
  var subscribe = document.getElementById('subscribe').checked;
  var message = document.getElementById('message').value;

  if( author && message) {
    stacosys_new_comment(STACOSYS_PAGE, author, email, site, captcha, subscribe, message, submit_success, submit_failure);
  }
}

function submit_success(context, data) {
  console.log('submit ' + data);
  window.location="/2009/redirection";
}

function submit_failure(error) {
  console.log('submit failure');
  // TODO redirect to error page
}

// --------------------------------------------------------------------------
//  Markdown preview
// --------------------------------------------------------------------------

function preview_markdown() {
    if (document.getElementById('preview-container').style.display == 'none'){
        document.getElementById('preview-container').style.display = '';
    }
    var $ = function (id) { return document.getElementById(id); };
    new Editor($("message"), $("preview"));
}

function Editor(input, preview) {
    this.update = function () {
        preview.innerHTML = markdown.toHTML(input.value);
    };
    input.editor = this;
    this.update();
}
