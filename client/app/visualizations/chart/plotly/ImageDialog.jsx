import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/lib/modal';
import { wrap as wrapDialog, DialogPropType } from '@/components/DialogWrapper';

class ImageDialog extends React.Component {
  static propTypes = {
    dialog: DialogPropType.isRequired,
    src: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const { dialog, src } = this.props;

    return (
      <Modal {...dialog.props} title="Image (Right click to copy)" className="image">
        <img src={src} alt="" style={{ 'max-width': '100%' }} />
      </Modal>
    );
  }
}

export default wrapDialog(ImageDialog);
