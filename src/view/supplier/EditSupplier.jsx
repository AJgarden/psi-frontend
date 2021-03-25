import React from "react";
import SupplierForm from "./SupplierForm";
class EditSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    this.getSupplierData();
  }

  getSupplierData = () => {
    const data = {
      vendorId: "A00",
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
    };
    this.setState({ ...data });
  };

  render() {
    return <SupplierForm createFlag={false} formData={this.state} />;
  }
}
export default EditSupplier;
