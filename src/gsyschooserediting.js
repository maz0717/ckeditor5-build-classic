import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import GsysChooserCommand from './gsyschoosercommand';

export default class GsysChooserEditing extends Plugin {
	/**
   * @inheritDoc
   */
	static get pluginName() {
		return 'GsysChooserEditing';
	}

	/**
   * @inheritDoc
   */
	init() {
		const editor = this.editor;
		console.log( 'maz1' );

		editor.commands.add( 'gsyschooser', new GsysChooserCommand( editor ) );
	}
}
