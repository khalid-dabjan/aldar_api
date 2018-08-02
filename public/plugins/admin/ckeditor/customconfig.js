/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.toolbar = [
        {name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source']},

        {name: 'insert', items: ['Table', 'Image', 'Flash', 'HorizontalRule', 'PageBreak', 'Iframe']},
        '/',
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        },
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
        },
        {name: 'links', items: ['Link']},

        '/',
        {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},


    ];

    config.allowedContent = true;
    config.forcePasteAsPlainText = true;
    config.extraAllowedContent = 'shortcode(*)';
    //config.extraPlugins = "gallery";

};
