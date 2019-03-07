import Command from '@ckeditor/ckeditor5-core/src/command';

export default class GsysChooserCommand extends Command {
	constructor( editor ) {
		super( editor );

		// Remove default document listener to lower its priority.
		this.stopListening( this.editor.model.document, 'change' );

		// Lower this command listener priority to be sure that refresh() will be called after link & image refresh.
		this.listenTo( this.editor.model.document, 'change', () => this.refresh(), { priority: 'low' } );
	}

	refresh() {
		const imageCommand = this.editor.commands.get( 'imageUpload' );
		const linkCommand = this.editor.commands.get( 'link' );

		// The command is enabled when one of image or link command is enabled.
		this.isEnabled = imageCommand && linkCommand && ( imageCommand.isEnabled || linkCommand.isEnabled );
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const editor = this.editor;
		const editorDoc = editor.sourceElement.ownerDocument;
		const editorWin = editorDoc.defaultView;
		const chooserUrl = editor.config.get( 'gsys.chooserUrl' );
		if ( !chooserUrl || !chooserUrl.length ) {
			return;
		}

		/*
         const feat = 'alwaysRaised=yes,dependent=yes,height=' + editorWin.screen.height + ',location=no,menubar=no,' +
           'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + editorWin.screen.width;
		*/
		const feat = 'alwaysRaised=yes,dependent=yes,minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no';
		const chooser = editorWin.open( chooserUrl, 'gsyschooser', feat );

		const fileListener = evt => {
			const files = evt.detail.files;

			// Insert links
			const links = files.filter( file => !file.isImage() );
			const images = files.filter( file => file.isImage() );

			for ( const linkFile of links ) {
				editor.execute( 'link', linkFile.getUrl() );
			}

			const imagesUrls = [];

			for ( const image of images ) {
				const url = image.getUrl();
				imagesUrls.push( url );
			}

			if ( imagesUrls.length ) {
				insertImages( editor, imagesUrls );
			}
			chooser.close();
			editorWin.removeEventListener( 'file:choose', fileListener );
		};
		editorWin.addEventListener( 'file:choose', fileListener, false );
	}
}

function insertImages( editor, urls ) {
	const imageCommand = editor.commands.get( 'imageUpload' );

	// Check if inserting an image is actually possible - it might be possible to only insert a link.
	if ( !imageCommand.isEnabled ) {
		const notification = editor.plugins.get( 'Notification' );
		const t = editor.locale.t;

		notification.showWarning( t( 'Could not insert image at the current position.' ), {
			title: t( 'Inserting image failed' ),
			namespace: 'gsyschooser'
		} );

		return;
	}

	editor.execute( 'imageInsert', { source: urls } );
}
