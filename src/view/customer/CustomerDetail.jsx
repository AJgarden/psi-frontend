import React from 'react'
import CustomerForm from './CustomerForm'

export default class CustomerDetail extends React.Component {
  render() {
    return (
      <CustomerForm
        createFlag={this.props.createFlag}
        customerId={this.props.match.params.customerId}
      />
    )
  }
}
