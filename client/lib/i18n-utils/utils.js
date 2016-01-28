/**
 * External dependencies
 */
import find from 'lodash/collection/find';

/**
 * Internal dependencies
 */
import config from 'config';

const localeRegex = /^[A-Z]{2}$/i;
const localeWithRegionRegex = /^[A-Z]{2}-[A-Z]{2}$/i;

const i18nUtils = {
	getLanguage: function( langSlug ) {
		let language;
		if ( localeRegex.test( langSlug ) || localeWithRegionRegex.test( langSlug ) ) {
			language = find( config( 'languages' ), { langSlug: langSlug } ) ||
				find( config( 'languages' ), { langSlug: langSlug.substring( 0, 2 ) } );
		}
		return language;
	},

	setUpLocale: function( parameters ) {
		if ( ! parameters.lang && parameters.stepSectionName && i18nUtils.getLanguage( parameters.stepSectionName ) ) {
			parameters.lang = parameters.stepSectionName;
			parameters.stepSectionName = undefined;
		} else if ( ! parameters.lang && parameters.stepName && i18nUtils.getLanguage( parameters.stepName ) ) {
			parameters.lang = parameters.stepName;
			parameters.flowName = undefined;
		} else if ( ! parameters.lang && parameters.flowName && i18nUtils.getLanguage( parameters.flowName ) ) {
			parameters.lang = parameters.flowName;
			parameters.flowName = undefined;
		}
		return parameters;
	},

	/**
	 * Removes the trailing locale slug from the path, if it is present.
	 * '/start/en' => '/start', '/start' => '/start', '/start/flow/fr' => '/start/flow', '/start/flow' => '/start/flow'
	 * @param {string} path - original path
	 * @returns {string} original path minus locale slug
	 */
	removeLocaleFromPath: function( path ) {
		// Remove trailing slash then split. If there is a trailing slash,
		// then the end of the array could contain an empty string.
		const parts = path.replace( /\/$/, '' ).split( '/' );
		const locale = parts.pop();

		if ( 'undefined' === typeof i18nUtils.getLanguage( locale ) ) {
			parts.push( locale );
		}

		return parts.join( '/' );
	}
};
export default i18nUtils;
