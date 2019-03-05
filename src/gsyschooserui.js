import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import browseFilesIcon from '../theme/icons/browse-files.svg';

export default class GsysChooserUI extends Plugin {
	/**
   * @inheritDoc
   */
	static get pluginName() {
		return 'GsysChooserUI';
	}

	/**
   * @inheritDoc
   */
	init() {
		const editor = this.editor;
		const componentFactory = editor.ui.componentFactory;
		const t = editor.t;

		componentFactory.add( 'gsyschooser', locale => {
			const command = editor.commands.get( 'gsyschooser' );

			const button = new ButtonView( locale );

			button.set( {
				label: t( 'Insert image or file' ),
				icon: browseFilesIcon,
				tooltip: true
			} );

			button.bind( 'isEnabled' ).to( command );

			button.on( 'execute', () => {
				editor.execute( 'gsyschooser' );
				editor.editing.view.focus();
			} );

			console.log( 'maz is here' );

			return button;
		} );
	}
}
