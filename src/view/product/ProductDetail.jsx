import React from 'react'
import ProductForm from './ProductForm'

export default class ProductDetail extends React.Component {
  render() {
    const seqNo = this.props.seqNo !== undefined ? this.props.seqNo : this.props.match.params.seqNo
    return (
      <ProductForm
        createFlag={this.props.createFlag}
        isDrawMode={this.props.isDrawMode}
        drawModeVisible={this.props.drawModeVisible}
        seqNo={seqNo}
        onClose={this.props.onClose}
      />
    )
  }
}
