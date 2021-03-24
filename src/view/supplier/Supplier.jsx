import React from "react";
import { Button, Col, Input, message, Row, Select, Space, Table } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
class Supplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      search: {
        id: "",
        keyword: "",
      },
      supplierList: [],
      pagination: {
        total: 0,
        pageSize: 10,
        position: ["bottomLeft"],
      },
    };
  }

  componentDidMount() {
    this.getDataSource();
  }

  onSelectChange = (value) => {
    const { search } = this.state;
    search.id = value;
    this.setState({ search });
  };

  onInputChange = (e) => {
    const { search } = this.state;
    search.keyword = e.target.value;
    this.setState({ search });
  };

  handleSearch = () => {
    const { search } = this.state;
    if (search.id === "") {
      message.warning("請選擇搜尋欄位");
    } else if (search.keyword === "") {
      message.warning("請輸入搜尋內容");
    }

    this.setState({ loading: true }, () => {
      //TODO SEARCH API
      setTimeout(() => this.setState({ loading: false }), 1000);
    });
  };

  getDataSource = () => {
    const supplierList = [];
    const { pagination } = this.state;
    for (let i = 0; i < 20; i++) {
      supplierList.push({
        id: i,
        vendorId: "A" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
        name: "test",
        shortName: "test",
        principal: "test",
        contactPerson: "test",
        postCode: "test",
        address: "test",
        phone1: "test",
        phone2: "test",
        faxNumber: "test",
        cellPhone: "test",
        note1: "test",
        note2: "test",
      });
    }
    pagination.total = supplierList.length;
    this.setState({ pagination, supplierList });
  };

  getColumns = () => {
    return [
      {
        title: "執行",
        width: 50,
        render: () => (
          <Space>
            <Button type="primary" icon={<EditOutlined />} size="small" />
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Space>
        ),
      },
      {
        title: "序",
        width: 30,
        render: (a, b, i) => i + 1,
      },
      {
        title: "廠商代號",
        dataIndex: "vendorId",
      },
      {
        title: "廠商簡稱",
        dataIndex: "shortName",
      },
      {
        title: "聯絡人",
        dataIndex: "contactPerson",
      },
      {
        title: "地址",
        dataIndex: "address",
      },
      {
        title: "電話1",
        dataIndex: "phone1",
      },
      {
        title: "傳真號碼",
        dataIndex: "faxNumber",
      },
      {
        title: "行動電話",
        dataIndex: "cellPhone",
      },
    ];
  };

  render() {
    return (
      <>
        <div style={{ marginBottom: 10 }}>
          <Row type="flex" justify="space-between">
            <Col>
              <Button type="primary" icon={<PlusOutlined />}>
                新增
              </Button>
            </Col>
            <Col>
              <Space>
                <Select placeholder="搜尋欄位" onChange={this.onSelectChange}>
                  <Select.Option value="vendor_id">廠商代號</Select.Option>
                  <Select.Option value="name">廠商名稱</Select.Option>
                </Select>
                <Input placeholder="搜尋內容" onChange={this.onInputChange} />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={this.handleSearch}
                >
                  查詢
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
        <Table
          loading={this.state.loading}
          rowKey="id"
          columns={this.getColumns()}
          dataSource={this.state.supplierList}
          size="small"
          bordered
          pagination={{
            ...this.state.pagination,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total}`,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) =>
              this.setState({
                pagination: { ...this.state.pagination, pageSize },
              }),
          }}
        />
      </>
    );
  }
}

export default Supplier;
