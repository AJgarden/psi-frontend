import React from 'react'
import { Link } from 'react-router-dom'
import { Spin, Row, Col, Card, Statistic } from 'antd'
import { createHashHistory } from 'history'

export default class Dashboard extends React.Component {
  history = createHashHistory()

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      productCount: null
    }
  }

  componentDidMount() {
    this.history.replace('/Dashboard')
  }

  render() {
    return (
      <div>Dashboard</div>
      // <Spin spinning={this.state.loading}>
      //   <Row gutter={36}>
      //     <Col xs={12} sm={12} md={12} lg={6}>
      //       <Card size='small' title='商品數量' extra={<Link to='/Products/List'>管理商品</Link>}>
      //         <Statistic value={this.state.productCount || '-'} />
      //       </Card>
      //     </Col>
      //   </Row>
      // </Spin>
    )
  }
}
