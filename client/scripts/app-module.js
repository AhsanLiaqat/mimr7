(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngRoute',
        'ngAnimate',
        'ngCookies',
        // 'ngWebSocket',
        // 3rd Party Modules
        'angularModalService',
        'ngFileUpload',
        'ui.bootstrap',
        'easypiechart',
        'mdo-angular-cryptography',
        'ui.tree',
        'ngMap',
        'ngIdle',
        'ngTagsInput',
        'textAngular',
        'angular-loading-bar',
        'ui.calendar',
        'duScroll',
        '720kb.datepicker',
        'google.places',
        "kendo.directives",
        'ngCountries',
        'as.sortable',
        'monospaced.elastic',
        'ngTextareaEnter',
        "xeditable",
        "switcher",
        "rzModule",
        'froala',
        "ngSanitize",
        "chart.js",
        "timer",
        "ngVis",
        "angular-timeline",
        "com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controls",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.poster",
        //'ui.sortable',
        //'ui.dashboard',
        //'ngScrollbars',
        'checklist-model',
        'ui.tinymce',
        'angular-confirm',
        'colorpicker.module',
        'ngValidate',
        'smart-table',
        'localytics.directives',
        'pippTimelineDirectives',
        'angular.circular.datetimepicker',
        // Angular Custom Filters
        'stringFilters',
        // Custom modules
        'app.nav',
        'app.i18n',
        'app.chart',
        'app.ui',
        'app.ui.form',
        'app.ui.form.validation',
        'app.ui.map',
        'app.page',
        'app.table',
        'app.users',
        'app.task',
        'app.calendar'
    ]).
    value('froalaConfig', {
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
        imageUpload: true,
         colorsBackground: [
            '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
            '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
        ],
          colorsDefaultTab: 'text',
          colorsStep: 6,
          colorsText: [
            '#15E67F', '#E3DE8C', '#D8A076', '#D83762', '#76B6D8', 'REMOVE',
            '#1C7A90', '#249CB8', '#4ABED9', '#FBD75B', '#FBE571', '#FFFFFF'
        ],
        key: 'NikyA4H1qaA-21fE-13dplxI2C-21r==',
        imageUploadMethod: 'POST',
        imageUploadURL: "/users/editorImage",
         events: {
              'froalaEditor.initialized': function() {
                   console.log('initialized');
              },
             'froalaEditor.image.beforeUpload': function (e, editor, $img, response){
                 //Your code
                //  editor.selection.save();
                // editor.events.trigger('save.force');
             }
         }
    });

})();
