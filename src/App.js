import React from 'react'
import { Layout, Button } from 'antd'
import axios from 'axios'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  getCustomerList = () => {
    axios
      .get('https://britz-psi-heroku.herokuapp.com/api/v1/customers?queryByEnum=CUSTOMER_ID')
      .then((response) => {
        this.setState({ data: response.data })
      })
  }

  render() {
    return (
      <Layout className='layout-wrapper'>
        <Layout.Sider>sider</Layout.Sider>
        <Layout>
          <Layout.Header>header</Layout.Header>
          <Layout.Content style={{ padding: 20 }}>
            <Button onClick={this.getCustomerList}>get customer list</Button>
            <br />
            {JSON.stringify(this.state.data)}
          </Layout.Content>
          <Layout.Footer>footer</Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}
