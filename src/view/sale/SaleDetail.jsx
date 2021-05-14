import React from 'react'
import SaleForm from './SaleForm'

export default class SaleDetail extends React.Component {
  render() {
    const salesId =
      this.props.salesId !== undefined
        ? this.props.salesId
        : this.props.match.params.salesId
    return (
      <SaleForm
        createFlag={this.props.createFlag}
        isDrawMode={this.props.isDrawMode}
        drawModeVisible={this.props.drawModeVisible}
        salesId={salesId}
        onClose={this.props.onClose}
      />
    )
  }
}
