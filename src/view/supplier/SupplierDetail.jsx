import React from 'react'
import SupplierForm from './SupplierForm'

export default class SupplierDetail extends React.Component {
  render() {
    return (
      <SupplierForm
        createFlag={this.props.createFlag}
        vendorId={this.props.match.params.vendorId}
      />
    )
  }
}
