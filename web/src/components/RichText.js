import PropTypes from 'prop-types';
import React, { Component } from 'react';
import tinymce from 'tinymce/tinymce';
import { Editor } from '@tinymce/tinymce-react';

// A theme is also required
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/link';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/spellchecker';

require.context(
  'file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
  true,
  /.*/
);

// Initialize the app
tinymce.init({
  browser_spellcheck: true,
  selector: '#tiny',
  plugins: ['link', 'paste', 'spellchecker']
});

class RichText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: props.content
    };
  }

  onEditorChange = newContent => {
    const { onSync } = this.props;
    this.setState({ content: newContent });
    onSync(newContent);
  };

  render() {
    const { content } = this.state;

    return (
      <Editor
        init={{
          browser_spellcheck: true,
          paste_data_images: true,
          plugins: ['image', 'imagetools', 'link', 'paste', 'spellchecker'],
          menubar: ''
        }}
        value={content}
        onEditorChange={this.onEditorChange}
      />
    );
  }
}

RichText.propTypes = {
  content: PropTypes.string,
  onSync: PropTypes.func
};

RichText.defaultProps = {
  content: '',
  onSync: () => {}
};

export default RichText;
