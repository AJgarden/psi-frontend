import React from 'react'
import EmployeeForm from './EmployeeForm'

export default class EmployeeDetail extends React.Component {
  render() {
    return (
      <EmployeeForm
        createFlag={this.props.createFlag}
        employeeId={this.props.match.params.employeeId}
      />
    )
  }
}
