CKEDITOR.plugins.add('gallery', {
    init: function (editor) {
        var pluginName = 'gallery';

        /*
         div = document.getElementById("demo");
         
         if (div != null) {
         div.addEventListener("click", function () {
         div.innerHTML = "YOU CLICKED ME!";
         });
         }
         */

        /*
            var element = CKEDITOR.document.getById( 'myElement' );
            element.on( 'click', function( ev )
            {
                // The DOM event object is passed by the "data" property.
                var domEvent = ev.data;
                // Add a CSS class to the event target.
                domEvent.getTarget().addClass( 'clicked' );
            });
            
            */

        /* var element = CKEDITOR.document.getById('p');
         element.on('click', function (ev) {
             alert("dddd");
         });*/

        /*
         // The DOM event object is passed by the "data" property.
         var domEvent = ev.data;
         // Add a CSS class to the event target.
         domEvent.getTarget().addClass( 'clicked' );
         
         
         });
         
         
         /*
         editor.on('contentDom', function () {
         this.document.on('click', function (event) {
         console.log(event);
         alert('Click Event');
         });
         });
         */
        /*editor.on('contentDom', function () {
         var my_elements = $(editor.window.getFrame().$).contents().find('#demo'); // find by class
         
         my_elements.each(function (i) {
         alert("Ffff");
         
         });
         *
         });*/


        //<div id="demo">click</div>


        editor.addCommand('insertGallery',
            {
                exec: function (editor) {
                    var timestamp = new Date();
                    editor.insertHtml(timestamp.toString());
                }
            });


        editor.ui.addButton('Gallery',
            {
                label: 'Insert Gallery',
                command: 'insertGallery',
                icon: this.path + 'images/gallery.gif'
            });

        //alert("ok");
    }
});
