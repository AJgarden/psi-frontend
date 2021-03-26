import React from 'react'
import ComponentForm from './ComponentForm'

export default class ComponentDetail extends React.Component {
  render() {
    return (
      <ComponentForm
        createFlag={this.props.createFlag}
        partId={this.props.match.params.partId}
      />
    )
  }
}
