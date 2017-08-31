var CanvasLink = {
  /* options of the plugin */
  options: {},

  /* all of the needed locales */
  locales: {
    'de': {
      'copy-to-clipboard': 'In die Zwischenablage kopieren',
      'share-buttons-info': 'Beim Klick auf einen der Teilen-Buttons verlassen Sie diese Webseite.',
      'share-on-envelope': 'Per Mail teilen',
      'share-on-facebook': 'Auf Facebook teilen',
      'share-on-pinterest': 'Auf Pinterest teilen',
      'share-on-tumblr': 'Auf Tumblr teilen',
      'share-on-linkedin': 'Auf LinkedIn teilen',
      'share-on-twitter': 'Auf Twitter teilen',
      'share-on-whatsapp': 'Per Whatsapp teilen',
      'share-page': 'Linke auf diese Seite teilen'
    },
    'en': {
      'copy-to-clipboard': 'Copy to clipboard',
      'share-buttons-info': 'By clicking on one of the share buttons, you will leave this website.',
      'share-on-envelope': 'Share via mail',
      'share-on-facebook': 'Share on Facebook',
      'share-on-pinterest': 'Share on Pinterest',
      'share-on-tumblr': 'Share on Tumblr',
      'share-on-linkedin': 'Share on LinkedIn',
      'share-on-twitter': 'Share on Twitter',
      'share-on-whatsapp': 'Share via Whatsapp',
      'share-page': 'Share links to this page'
    }
  },
    /* the template for CSS styles */
    styleTemplate: Mirador.Handlebars.compile([
    '<style>',
    '.window-manifest-navigation > .mirador-btn.mirador-icon-canvas-cite-share { color: #929191; margin-right: 5px; }',
    '.window-manifest-navigation > .mirador-btn.mirador-icon-canvas-cite-share:hover { color: black; }',
    '.modal-header .close { color: #fff; font-weight: bold; opacity: 0.7; }',
    '.modal-header .close:hover { opacity: 1.0; }',
    '.modal-header { background-color: #449d44; color: #fff; }',
    '@media screen and (min-width: 800px) { #canvas-link-modal .modal-dialog { width: 700px; } }',
    '@media screen and (max-width: 799px) { #canvas-link-modal .modal-dialog { width: 90%; } }',
    '#canvas-link-modal .modal-dialog { width: 700px;   } }  @media screen and (max-width: 799px) {',
    '#canvas-link-modal .modal-dialog { width: 90%; } }',
    '#canvas-link-modal',
    '#canvas-link-modal #copy-to-clipboard { height: 40px; width: 40px; }',
    '#canvas-link-modal #share-buttons-info { color: #31708f; background-color: #d9edf7; border: 1px solid #bce8f1; border-radius: 4px; margin-bottom: 20px; padding: 15px; text-align: left; }',
    '#canvas-link-modal .share-button { color: white; }',
    '#canvas-link-modal #share-on-envelope .fa-circle { color: #7d7d7d; }',
    '#canvas-link-modal #share-on-facebook .fa-circle { color: #3B5998; }',
    '#canvas-link-modal #share-on-pinterest .fa-circle { color: #CB2027; }',
    '#canvas-link-modal #share-on-tumblr .fa-circle { color: #32506d; }',
    '#canvas-link-modal #share-on-linkedin .fa-circle { color: #0077b5; }',
    '#canvas-link-modal #share-on-twitter .fa-circle { color: #55acee; }',
    '#canvas-link-modal #share-on-whatsapp .fa-circle { color: #25d366; }',
    '#canvas-link { box-sizing: border-box; height: 33px; padding: 2px; max-width: 60%; }',
    '#iiif-link { box-sizing: border-box; height: 33px; padding: 2px; max-width: 60%; max-height: 110px; }',
    '#canvas-link-modal #copy-iiif-to-clipboard { height: 40px; width: 40px; }',
    '.iiif-thumbnail { padding: 1em; max-width: 100px; max-height: 110px; margin-top: 2em; padding: 2px; border:1px solid #708c98; }',
    '</style>'].join('')),

  linkTemplates: {
    'envelope': Mirador.Handlebars.compile(
      'mailto:?subject={{{label}}}{{#if attribution}} ({{attribution}}){{/if}}&body={{{label}}}{{#if attribution}} ({{{attribution}}}){{/if}}: {{link}}'
    ),
    'facebook': Mirador.Handlebars.compile(
      'https://www.facebook.com/sharer/sharer.php?title={{{label}}} {{#if attribution}} ({{attribution}}){{/if}}&u={{link}}'
    ),
    'pinterest': Mirador.Handlebars.compile(
      'http://pinterest.com/pin/create/bookmarklet/?url={{link}}&description={{{label}}}%20{{#if attribution}}%20({{attribution}}){{/if}}&media={{{thumbnailUrl}}}'
    ),
    'tumblr': Mirador.Handlebars.compile(
      'http://www.tumblr.com/share/link?url={{link}}&name={{{label}}} {{#if attribution}} ({{attribution}}){{/if}}&tags=iiif'
    ),
    'linkedin': Mirador.Handlebars.compile(
      'https://www.linkedin.com/shareArticle?mini=true&url={{link}}&title={{{label}}} {{#if attribution}} ({{attribution}}){{/if}}&source=UCDDigital'
    ),
    'twitter': Mirador.Handlebars.compile(
      'https://twitter.com/intent/tweet?text={{{truncate label attribution}}}&url={{link}}&hashtags=iiif'
    ),
    'whatsapp': Mirador.Handlebars.compile(
      'whatsapp://send?text={{{label}}} {{#if attribution}} ({{attribution}}){{/if}}: {{link}}'
    )
  },

  /* the template for the link button */
    buttonTemplate: Mirador.Handlebars.compile([
    '<a title="{{t "share-page"}}" class="mirador-btn mirador-icon-canvas-cite-share shareButtons" aria-label="{{t "share-page"}}" style="position: relative; padding-right:0px;">',
    '<i class="fa fa-lg fa-fw fa-share-alt" style="color:green;"></i>',
    '</a>'].join('')),

  /* the template for the modal containing the canvas link */
  modalTemplate: Mirador.Handlebars.compile([
    '<div id="canvas-link-modal" class="modal fade" tabindex="-1" role="dialog">',
    '<div class="modal-dialog" role="document">',
    '<div class="modal-content">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    '<h4 class="modal-title">{{t "share-page"}}</h4>',
    '</div>',
    '<div class="modal-body">',
    '<div class="pull-right">',
    '<img src="" class="iiif-thumbnail thumbnail" title="thumbnail image"></img>',
    '</div>',
    '<p>',
    '<div id="page-link">',
    '<strong>Copy link for this view</strong><br />',
    '<input id="canvas-link" type="text" style="min-width:70%;">',
    ' <button type="button" class="btn btn-default btn-sm" id="copy-to-clipboard" title="{{t "copy-to-clipboard"}}">',
    '<i class="fa fa-clipboard" aria-hidden="true"></i>',
    '</button>',
    '</div>',
    '</p>',
    '<p>',
    '<p>',
    '<strong>Copy IIIF manifest link</strong><br />',
    '<input id="iiif-link" type="text" style="min-width:70%;">',
    ' <button type="button" class="btn btn-default btn-sm" id="copy-iiif-to-clipboard" title="{{t "copy-iiif-to-clipboard"}}">',
    '<i class="fa fa-clipboard" aria-hidden="true"></i>',
    '</button>',
    '</p>',
    '</div>',
    '<div class="modal-footer">',
    '{{#if showShareButtons}}',
    '{{#if showShareButtonsInfo}}',
    '<div id="share-buttons-info" class="showShareButtonsInfo" role="alert">{{t "share-buttons-info"}}</div>',
    '{{/if}}',
    '{{#each shareButtons}}',
    '<a type="button" class="pull-left share-button showShareButtons" id="share-on-{{this}}" title="{{t (concat this)}}" target="_blank" data-target="{{this}}">',
    '<span class="fa-stack fa-lg">',
    '<i class="fa fa-circle fa-stack-2x"></i>',
    '<i class="fa fa-{{this}} fa-stack-1x" aria-hidden="true"></i>',
    '</span>',
    '</a>',
    '{{/each}}',
    '{{/if}}',
    '<button type="button" class="btn btn-default" data-dismiss="modal">{{t "close"}}</button>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'
  ].join('')),

  /* initializes the plugin */
  init: function(){
    Mirador.Handlebars.registerHelper('concat', function(target){
      return 'share-on-' + target;
    });
    Mirador.Handlebars.registerHelper('truncate', function(label, attribution){
      var text = label.concat(attribution ? ' (' + attribution + ')' : '');
      if(text.length > 60){
        text = text.substring(0, 60).concat('...');
      }
      return text;
    });
    i18next.on('initialized', function(){
      this.addLocalesToViewer();
    }.bind(this));
    this.injectStylesToDom();
    this.injectModalToDom();
    this.injectWorkspaceEventHandler();
    this.injectWindowEventHandler();
  },

  /* injects the button to the window menu */
  injectButtonToMenu: function(windowButtons){
    $(windowButtons).prepend(this.buttonTemplate());
    if (this.options.mapLink && this.options.mapLink == true) {
      $(windowButtons).prepend(this.mapTemplate());
    }
  },
  
  /* inject style template */
  injectStylesToDom: function(){
    var this_ = this;
    document.body.insertAdjacentHTML('beforeend', this_.styleTemplate());
  },

  /* injects the modal to the dom */
  injectModalToDom: function(){
    var this_ = this;
    var origFunc = Mirador.Viewer.prototype.setupViewer;
    Mirador.Viewer.prototype.setupViewer = function(){
      origFunc.apply(this);
      var windowSettings = this.state.currentConfig.windowSettings;
      var options = windowSettings.plugins.canvasLink;
      
      if($.isPlainObject(options)){
        this_.options = options;
      }
      var shareButtons = ['facebook', 'twitter', 'pinterest', 'tumblr', 'linkedin', 'envelope'];
      if('ontouchstart' in window || navigator.maxTouchPoints){
        shareButtons.push('whatsapp');
      }
      //console.log(this_.options.showShareButtons);
      document.body.insertAdjacentHTML('beforeend', this_.modalTemplate({
        'shareButtons': shareButtons,
        'showShareButtons': this_.options.showShareButtons || false,
        'showShareButtonsInfo': this_.options.showShareButtonsInfo || false
      }));
      //console.log(windowSettings);
    };
    this.addEventHandlers();
  },

  /* adds event handlers to the modal */
  addEventHandlers: function(){
    $(document.body).on('click', '#canvas-link-modal #copy-to-clipboard', function(){
      $('#canvas-link-modal #canvas-link').select();
      document.execCommand('copy');
    }.bind(this));
    $(document.body).on('click', '#canvas-link-modal #copy-iiif-to-clipboard', function(){
      $('#canvas-link-modal #iiif-link').select();
      document.execCommand('copy');
    }.bind(this));
  },

  /* injects the needed workspace event handler */
  injectWorkspaceEventHandler: function(){
    var this_ = this;
    var origFunc = Mirador.Workspace.prototype.bindEvents;
    Mirador.Workspace.prototype.bindEvents = function(){
      origFunc.apply(this);
      this.eventEmitter.subscribe('WINDOW_ELEMENT_UPDATED', function(event, data){
        var windowButtons = data.element.find('.window-manifest-navigation');
        this_.setSavedPreferences();
        this_.injectButtonToMenu(windowButtons);
      });
    };
  },

  /* injects the needed window event handler */
  injectWindowEventHandler: function(){
    var this_ = this;
    var origFunc = Mirador.Window.prototype.bindEvents;
    Mirador.Window.prototype.bindEvents = function(){
      origFunc.apply(this);
      
      var localDomain = document.location.origin;
      
      var service = this.manifest.jsonLd.service;
      
      this.element.find('.mirador-icon-canvas-cite-share').on('click', function(){
        var label = this.manifest.jsonLd.label;
        var manifestLink = this.manifest.uri;
        var attribution = this.manifest.jsonLd.attribution || false;
        //var canvasLink = this.canvasID + (this_.options.urlExtension || '/view');
        var canvasLink = this.canvasID;
        if (canvasLink.includes("data.ucd.ie/api/img/")) {
            canvasLink = localDomain + '/view-media/' + canvasLink.slice(canvasLink.indexOf('data.ucd.ie/api/img/') + 20);
        } else {
          $("#page-link").addClass("hidden");
        }
        var currentImage = this.imagesList[this.focusModules[this.viewType].currentImgIndex];
        var service = currentImage.images[0].resource.service || currentImage.images[0].resource.default.service;
        var thumbnailUrl = Mirador.Iiif.getImageUrl(currentImage).concat('/full/600,/0/').concat((
          Mirador.Iiif.getVersionFromContext(service['@context']) === '2.0' ? 'default.jpg' : 'native.jpg'
        ));
        var smallThumbnailUrl = Mirador.Iiif.getImageUrl(currentImage).concat('/full/120,/0/').concat((
          Mirador.Iiif.getVersionFromContext(service['@context']) === '2.0' ? 'default.jpg' : 'native.jpg'
        ));
        $('#canvas-link-modal #canvas-link').attr('value', canvasLink);
        $('#canvas-link-modal #iiif-link').attr('value', manifestLink);
        $('.iiif-thumbnail').attr("src",smallThumbnailUrl);
        if(this_.options.showShareButtons){ 
          $('#canvas-link-modal .share-button').attr('href', function(){
            return this_.linkTemplates[$(this).data('target')]({
              'label': label,
              'attribution': attribution,
              'link': canvasLink,
              'thumbnailUrl': thumbnailUrl
            });
          });
        }
        $('#canvas-link-modal').modal('show');
        $('#canvas-link-modal').on('shown.bs.modal', function(){
          $('#canvas-link-modal #canvas-link').select();
        });
      }.bind(this));
    };
  },
  
  /* update menu buttons from saved settings in local storage */
  setSavedPreferences: function (context) {    
    /* read saved settings from local storage, then update menu and buttons */
    var savedPreferences_buttons = localStorage.getItem('dl_settings_buttons');
    var savedPreferences_userButtons = localStorage.getItem('dl_settings_userButtons');
    //var savedPreferences_plugins = localStorage.getItem('dl_settings_plugins');

    if (savedPreferences_buttons) {
      updateSettings(savedPreferences_buttons);
    }
    if (savedPreferences_userButtons) {
      updateSettings(savedPreferences_userButtons);
    }
    
    function updateSettings(settings) {
      /* updates both menu settings and menu buttons */
      $.each(JSON.parse(settings), function (key, val) {
        var className = 'a.' + key;
        var mainMenuClasses = {
          'a.bookmark': 'a.bookmark-workspace', 'a.changeLayout': 'a.change-layout', 'a.fullScreen': 'a.fullscreen-viewer', 'a.canvasLink': 'a.shareButtons'
        };
        if (mainMenuClasses[className] && mainMenuClasses[className].length) {
          className = mainMenuClasses[className];
        }
        if ($.type(val) == 'boolean') {
          var counter = 0;
          var setLinks = setInterval(function () {
            if ($(className).length) {
              counter++
              if (val == true) {
                $(className).removeClass('noshow');
                $('.window-options-item[name=key]').attr('checked', '');
              } else {
                $(className).addClass('noshow');
                $('.mirador-container #window-options-panel .window-options-item[name="' + key + '"]').removeAttr('checked');
              }
              clearInterval(setLinks);
            } else {
              counter++;
              if (counter > 29) {
                clearInterval(setLinks);
              }
            }
          },
          100);
        } else if ($.type(val) == 'object') {
          var counter = 0;
          var irrelevantKeys =[ 'label', 'plugin'];
          $.each(val, function (objKey, objVal) {
            /* skip irrelevant keys */
            if ($.inArray(objKey, irrelevantKeys) !== -1) {
              return;
            }
            className = 'a.' + objKey;
            var setObjLinks = setInterval(function () {
              if ($(className).length) {
                if (objVal == false) {
                  $('a.shareButtons').addClass('noshow');
                  $('.mirador-container #window-options-panel .window-options-item[name="' + objKey + '"]').removeAttr('checked');
                } else {
                  $(className).removeClass('noshow');
                  $('.mirador-container #window-options-panel .window-options-item[name="' + objKey + '"]').attr('checked','');
                }
                clearInterval(setObjLinks);
              } else {
                counter++;
                if (counter > 80) {
                  clearInterval(setObjLinks);
                }
              }
            },
            100);
          });
        }
      });
    }
  },
  
  /* adds the locales to the internationalization module of the viewer */
  addLocalesToViewer: function(){
    for(var language in this.locales){
      i18next.addResources(
        language, 'translation',
        this.locales[language]
      );
    }
  },
};

$(document).ready(function(){
  CanvasLink.init();
});
