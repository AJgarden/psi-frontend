import React from 'react'
import PurchaseForm from './PurchaseForm'

export default class PurchaseDetail extends React.Component {
  render() {
    const purchaseId =
      this.props.purchaseId !== undefined
        ? this.props.purchaseId
        : this.props.match.params.purchaseId
    return (
      <PurchaseForm
        createFlag={this.props.createFlag}
        isDrawMode={this.props.isDrawMode}
        drawModeVisible={this.props.drawModeVisible}
        purchaseId={purchaseId}
        onClose={this.props.onClose}
      />
    )
  }
}
