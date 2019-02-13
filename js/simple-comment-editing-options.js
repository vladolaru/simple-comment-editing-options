jQuery( document ).ready( function( $ ) {
	var simplecommenteditingoptions = $.simplecommenteditingoptions = $.fn.simplecommenteditingoptions = function() {
		var $this = this;
		return this.each( function() {
			var ajax_url = $( this ).find( 'a:first' ).attr( 'href' );
			var ajax_params = wpAjax.unserialize( ajax_url );
			var element = this;
			jQuery(element).on( 'sce.timer.countdown', function(e) {
				$( element ).find( '.sce-timer' ).append( '&nbsp;|&nbsp;<a href="#" class="sce-timer-cancel">' + sce_options.done_editing + '</a>');
				$( element ).siblings( '.sce-textarea' ).find( ' .sce-timer' ).append( '&nbsp;|&nbsp;<a href="#" class="sce-timer-cancel">' + sce_options.done_editing + '</a>' )
			} );
			jQuery( element ).on( 'click', '.sce-timer-cancel', function( e ) {
				e.preventDefault();
				cancel_timer( element );
			} );
			jQuery( element ).siblings( '.sce-textarea' ).find( '.sce-timer' ).on( 'click', '.sce-timer-cancel', function( e ) {
				e.preventDefault();
				cancel_timer( element );
			} );
			function cancel_timer( element ) {
				$( element ).siblings( '.sce-textarea' ).off();
				$( element ).off();

				//Remove elements
				$( element ).parent().remove();
			}
		} );

	};
	$( '.sce-edit-button' ).simplecommenteditingoptions();
} );