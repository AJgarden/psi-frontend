import {
  Card,
  Col,
  Row,
  Input,
  Button,
  Space,
  Modal,
  Spin,
  message,
} from "antd";
import React from "react";
import FormItem from "../../component/FormItem";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { createHashHistory } from "history";
const history = createHashHistory();

class SupplierForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      required: ["vendorId"],
      formData: {
        vendorId: "",
        name: "",
        shortName: "",
        principal: "",
        contactPerson: "",
        postCode: "",
        address: "",
        phone1: "",
        phone2: "",
        faxNumber: "",
        cellPhone: "",
        note1: "",
        note2: "",
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.createFlag &&
      JSON.stringify(prevProps.formData) !== JSON.stringify(this.props.formData)
    ) {
      this.setState({ formData: this.props.formData });
    }
  }

  onInputChange = (e) => {
    const type = e.target.getAttribute("id");
    const text = e.target.value;
    const { formData } = this.state;
    formData[type] = text;
    this.setState({ formData });
  };

  createSupplier = () => {
    message.info("成功新增資料");
  };

  editSupplier = () => {
    message.info("成功更新資料");
  };

  handleSubmit = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        if (this.props.createFlag) {
          this.createSupplier();
        } else {
          this.editSupplier();
        }
        setTimeout(() => history.push("/Basic/Supplier"), 1000);
      }
    );
  };

  handleSubmitWithCreate = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        message.info("成功新增資料");
        setTimeout(() => {
          this.setState({
            loading: false,
            formData: {
              vendorId: "",
              name: "",
              shortName: "",
              principal: "",
              contactPerson: "",
              postCode: "",
              address: "",
              phone1: "",
              phone2: "",
              faxNumber: "",
              cellPhone: "",
              note1: "",
              note2: "",
            },
          });
        }, 1000);
      }
    );
  };

  handleCancel = () => {
    Modal.confirm({
      title: "變更尚未儲存，確定要離開嗎",
      icon: <ExclamationCircleOutlined />,
      okText: "確認",
      cancelText: "取消",
      onOk() {
        history.push("/Basic/Supplier");
      },
    });
  };

  render() {
    const rowSetting = {
      gutter: [10, 10],
      type: "flex",
      align: "middle",
      style: { marginBottom: 20, marginTop: 20 },
    };
    const cloSetting = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 8,
    };
    return (
      <Spin spinning={this.state.loading}>
        <Card>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                required={true}
                title="廠商代號"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.vendorId}
                    block
                    id="vendorId"
                    disabled={!this.props.createFlag}
                  />
                }
                message="請輸入廠商代號"
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="廠商名稱"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.name}
                    block
                    id="name"
                  />
                }
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="廠商簡稱"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.shortName}
                    block
                    id="shortName"
                  />
                }
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="負責人"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.principal}
                    block
                    id="principal"
                  />
                }
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="聯絡人"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.contactPerson}
                    block
                    id="contactPerson"
                  />
                }
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="傳真號碼"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.faxNumber}
                    block
                    id="faxNumber"
                  />
                }
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="電話1"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.phone1}
                    block
                    id="phone1"
                  />
                }
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="電話2"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.phone2}
                    block
                    id="phone2"
                  />
                }
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                required={false}
                title="行動電話"
                content={
                  <Input
                    onChange={this.onInputChange}
                    value={this.state.formData.cellPhone}
                    block
                    id="cellPhone"
                  />
                }
              />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 15 }}>
          <Row {...rowSetting}>
            <Col span={24}>
              <FormItem
                required={false}
                title="地址"
                content={
                  <Row gutter={[10]}>
                    <Col span={4}>
                      <Input
                        onChange={this.onInputChange}
                        value={this.state.formData.postCode}
                        block
                        id="postCode"
                        placeholder="郵遞區號"
                      />
                    </Col>
                    <Col span={20}>
                      <Input
                        onChange={this.onInputChange}
                        value={this.state.formData.address}
                        block
                        id="address"
                        placeholder="地址"
                      />
                    </Col>
                  </Row>
                }
              />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 15 }}>
          <Row {...rowSetting} align="top">
            <Col span={24}>
              <FormItem
                required={false}
                align="flex-start"
                title="備註1"
                content={
                  <Input.TextArea
                    onChange={this.onInputChange}
                    value={this.state.formData.note1}
                    block
                    id="note1"
                  />
                }
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col span={24}>
              <FormItem
                required={false}
                align="flex-start"
                title="備註1"
                content={
                  <Input.TextArea
                    onChange={this.onInputChange}
                    value={this.state.formData.note2}
                    block
                    id="note2"
                  />
                }
              />
            </Col>
          </Row>
        </Card>
        <div style={{ margin: "20px", textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={this.handleSubmit}
            >
              儲存
            </Button>
            {this.props.createFlag && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={this.handleSubmitWithCreate}
              >
                儲存並新增
              </Button>
            )}
            <Button danger icon={<CloseOutlined />} onClick={this.handleCancel}>
              取消
            </Button>
          </Space>
        </div>
      </Spin>
    );
  }
}

export default SupplierForm;
