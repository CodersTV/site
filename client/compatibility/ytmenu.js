/**
 * ytmenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var YTMenu = function() {

	function init() {
		
		[].slice.call( document.querySelectorAll( '.dr-menu' ) ).forEach( function( el, i ) {

			var trigger = el.querySelector( 'div.dr-trigger' ),
				icon = trigger.querySelector( 'span.dr-icon-menu' ),
				open = true;

			trigger.addEventListener( 'click', function( event ) {
				if( !open ) {
					el.className += ' dr-menu-open';
					open = true;
				}
				$('#left-menu').removeClass('span1').addClass('span3');
                $('#content').removeClass('span11').addClass('span9');
				$('.sidebar-nav').addClass('well');
			}, false );

			icon.addEventListener( 'click', function( event ) {
				if( open ) {
					event.stopPropagation();
					open = false;
					el.className = el.className.replace(/\bdr-menu-open\b/,'');
    				$('#left-menu').removeClass('span3').addClass('span1');
    				$('#content').removeClass('span9').addClass('span11');
                    $('.sidebar-nav').removeClass('well');
					return false;
				}
			}, false );

		} );

	}

	init();

}