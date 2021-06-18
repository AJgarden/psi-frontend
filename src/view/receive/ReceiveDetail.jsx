import React from 'react'
import ReceiveForm from './ReceiveForm'

export default class ReceiveDetail extends React.Component {
  render() {
    const paymentReceiveId =
      this.props.paymentReceiveId !== undefined
        ? this.props.paymentReceiveId
        : this.props.match.params.paymentReceiveId
    return (
      <ReceiveForm
        createFlag={this.props.createFlag}
        isDrawMode={this.props.isDrawMode}
        drawModeVisible={this.props.drawModeVisible}
        paymentReceiveId={paymentReceiveId}
        onClose={this.props.onClose}
      />
    )
  }
}
