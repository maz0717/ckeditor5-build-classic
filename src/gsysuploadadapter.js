import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

/**
 * @extends module:core/plugin~Plugin
 */
export default class GsysUploadAdapter extends Plugin {
	static get requires() {
		return [ FileRepository ];
	}

	init() {
		const editor = this.editor;
		const url = this.editor.config.get( 'gsys.uploadUrl' );
		if ( !url ) {
			console.warn( 'gsys.uploadUrl is not configured' );
			return;
		}

		editor.plugins.get( FileRepository ).createUploadAdapter = loader => {
			return new Adapter( loader, url, this.editor.t );
		};
	}
}

class Adapter {
	constructor( loader, url, t ) {
		this.loader = loader;
		this.url = url;
		this.t = t;
	}

	upload() {
		return this.loader.file.then( file => {
			return new Promise( ( resolve, reject ) => {
				this._initRequest();
				this._initListeners( resolve, reject, file );
				this._sendRequest( file );
			} );
		} );
	}

	abort() {
		if ( this.xhr ) {
			this.xhr.abort();
		}
	}

	_initRequest() {
		const xhr = this.xhr = new XMLHttpRequest();
		xhr.open( 'POST', this.url, true );
		xhr.responseType = 'json';
	}

	_initListeners( resolve, reject, file ) {
		const xhr = this.xhr;
		const loader = this.loader;
		const t = this.t;
		const genericError = t( 'Cannot upload file: ' ) + ` ${ file.name }.`;

		xhr.addEventListener( 'error', () => reject( genericError ) );
		xhr.addEventListener( 'abort', () => reject() );
		xhr.addEventListener( 'load', () => {
			const response = xhr.response;

			if ( !response || !response.url ) {
				return reject( response && response.error && response.error.message ? response.error.message : genericError );
			}

			resolve( {
				default: response.url
			} );
		} );

		if ( xhr.upload ) {
			xhr.upload.addEventListener( 'progress', evt => {
				if ( evt.lengthComputable ) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			} );
		}
	}

	_sendRequest( file ) {
		const data = new FormData();
		data.append( 'file', file );

		this.xhr.send( data );
	}
}
