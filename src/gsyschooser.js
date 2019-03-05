import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import GsysChooserUI from './gsyschooserui';
import GsysChooserEditing from './gsyschooserediting';
import GsysUploadAdapter from './gsysuploadadapter';

export default class GsysChooser extends Plugin {
	static get pluginName() {
		return 'GsysChooser';
	}

	static get requires() {
		return [ GsysChooserEditing, GsysChooserUI, GsysUploadAdapter ];
	}
}

