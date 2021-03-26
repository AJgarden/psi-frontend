import React from 'react'
import LevelForm from './LevelForm'

export default class LevelDetail extends React.Component {
  render() {
    return (
      <LevelForm
        createFlag={this.props.createFlag}
        gradeId={this.props.match.params.gradeId}
      />
    )
  }
}
