import React from 'react'
import VehicleForm from './VehicleForm'

export default class VehicleDetail extends React.Component {
  render() {
    return (
      <VehicleForm
        createFlag={this.props.createFlag}
        kindId={this.props.match.params.kindId}
      />
    )
  }
}
