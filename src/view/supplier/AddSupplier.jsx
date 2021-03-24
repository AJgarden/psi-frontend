import { Card, Col, Input, Row, Typography } from "antd";
import React from "react";
const FormItem = (props) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ marginRight: 8, width: 80, textAlign: "right" }}>
      {props.must && (
        <Typography.Text type="danger" style={{ marginRight: 5 }}>
          *
        </Typography.Text>
      )}
      {props.title}
    </div>
    <div style={{ width: "calc(100% - 80px)" }}>{props.content}</div>
  </div>
);
class AddSupplier extends React.Component {
  render() {
    const rowSetting = {
      gutter: [10, 10],
      type: "flex",
      align: "middle",
      style: { marginBottom: 10, marginTop: 10 },
    };
    const cloSetting = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 8,
    };
    return (
      <>
        <Card>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="廠商代號"
                content={<Input block id="vendorId" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="廠商名稱"
                content={<Input block id="name" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="廠商簡稱"
                content={<Input block id="shortName" />}
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="負責人"
                content={<Input block id="principal" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="聯絡人"
                content={<Input block id="contactPerson" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="傳真號碼"
                content={<Input block id="faxNumber" />}
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="電話1"
                content={<Input block id="phone1" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="電話2"
                content={<Input block id="phone2" />}
              />
            </Col>
            <Col {...cloSetting}>
              <FormItem
                must={false}
                title="行動電話"
                content={<Input block id="cellPhone" />}
              />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 15 }}>
          <Row {...rowSetting}>
            <Col span={24}>
              <FormItem
                must={false}
                title="地址"
                content={
                  <Row gutter={[10]}>
                    <Col span={4}>
                      <Input block id="pastCode" placeholder="郵遞區號" />
                    </Col>
                    <Col span={20}>
                      <Input block id="address" placeholder="地址" />
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
                must={false}
                title="備註1"
                content={<Input.TextArea block id="note1" />}
              />
            </Col>
          </Row>
          <Row {...rowSetting}>
            <Col span={24}>
              <FormItem
                must={false}
                title="備註1"
                content={<Input.TextArea block id="note1" />}
              />
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}
export default AddSupplier;
