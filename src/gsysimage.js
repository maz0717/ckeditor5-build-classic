import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import GsysUploadAdapter from './gsysuploadadapter';

/**
 * @extends module:core/plugin~Plugin
 */
export default class Gsys extends Plugin {
	static get requires() {
		return [
			GsysUploadAdapter,
			// Image,
			ImageUpload
		];
	}

	static get pluginName() {
		return 'Gsys';
	}

	/*
  init() {
  }
  */
}

