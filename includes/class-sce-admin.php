<?php
/**
 * Register the admin menu and settings.
 *
 * @package SCEOptions
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'No direct access.' );
}

/**
 * Admin class for SCE Options.
 */
class SCE_Admin {

	/**
	 * Holds the slug to the admin panel page
	 *
	 * @since 5.0.0
	 * @static
	 * @var string $slug
	 */
	private static $slug = 'sce';

	/**
	 * Holds the URL to the admin panel page
	 *
	 * @since 1.0.0
	 * @static
	 * @var string $url
	 */
	private static $url = '';

	/**
	 * Main constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Initializes admin menus, plugin settings links, tables, etc.
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 */
	public function init() {

		// Add settings link.
		$prefix = SCE_Options::is_multisite() ? 'network_admin_' : '';
		add_action( $prefix . 'plugin_action_links_' . SCE_OPTIONS_SLUG, array( $this, 'plugin_settings_link' ) );
		// Init admin menu.
		if ( SCE_Options::is_multisite() ) {
			add_action( 'network_admin_menu', array( $this, 'register_sub_menu' ) );
		} else {
			add_action( 'admin_menu', array( $this, 'register_sub_menu' ) );
		}
	}

	/**
	 * Initializes admin menus
	 *
	 * @since 1.0.0
	 * @access public
	 * @see init
	 */
	public function register_sub_menu() {
		$hook = '';
		if ( SCE_Options::is_multisite() ) {
			$hook = add_submenu_page(
				'settings.php',
				__( 'Simple Comment Editing', 'simple-comment-editing-options' ),
				__( 'Simple Comment Editing', 'simple-comment-editing-options' ),
				'manage_network',
				'sce',
				array( $this, 'sce_admin_page' )
			);
		} else {
			$hook = add_submenu_page(
				'options-general.php',
				__( 'Simple Comment Editing', 'simple-comment-editing-options' ),
				__( 'Simple Comment Editing', 'simple-comment-editing-options' ),
				'manage_options',
				'sce',
				array( $this, 'sce_admin_page' )
			);
		}
	}

	/**
	 * Output admin menu
	 *
	 * @since 1.0.0
	 * @access public
	 * @see register_sub_menu
	 */
	public function sce_admin_page() {
		include SCE_Options::get_instance()->get_plugin_dir( '/includes/class-sce-admin-menu-output.php' );
		new SCE_Admin_Menu_Output();
	}

	/**
	 * Adds plugin settings page link to plugin links in WordPress Dashboard Plugins Page
	 *
	 * @since 1.0.0
	 * @access public
	 * @see __construct
	 * @param array $settings Uses $prefix . "plugin_action_links_$plugin_file" action.
	 * @return array Array of settings
	 */
	public function plugin_settings_link( $settings ) {
		$admin_anchor = sprintf( '<a href="%s">%s</a>', esc_url( $this->get_url() ), esc_html__( 'Settings', 'stops-core-theme-and-plugin-updates' ) );
		if ( ! is_array( $settings ) ) {
			return array( $admin_anchor );
		} else {
			return array_merge( array( $admin_anchor ), $settings );
		}
	}

	/**
	 * Return the URL to the admin panel page.
	 *
	 * Return the URL to the admin panel page.
	 *
	 * @since 5.0.0
	 * @access static
	 *
	 * @return string URL to the admin panel page.
	 */
	public static function get_url() {
		$url = self::$url;
		if ( empty( $url ) ) {
			if ( SCE_Options::is_multisite() ) {
				$url = add_query_arg( array( 'page' => self::$slug ), network_admin_url( 'settings.php' ) );
			} else {
				$url = add_query_arg( array( 'page' => self::$slug ), admin_url( 'options-general.php' ) );
			}
			self::$url = $url;
		}
		return $url;
	}
}
