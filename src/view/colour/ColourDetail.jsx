import React from 'react'
import ColourForm from './ColourForm'

export default class ColourDetail extends React.Component {
  render() {
    return (
      <ColourForm
        createFlag={this.props.createFlag}
        colorId={this.props.match.params.colorId}
      />
    )
  }
}
