export const initData = {
  vendorId: '',
  name: '',
  shortName: '',
  principal: '',
  contactPerson: '',
  postCode: '',
  address: '',
  phone1: '',
  phone2: '',
  faxNumber: '',
  cellPhone: '',
  note1: '',
  note2: ''
}

export const formRules = [
  {
    key: 'vendorId',
    required: true,
    length: [0, 10]
  },
  {
    key: 'name',
    required: true,
    length: [0, 30]
  },
  {
    key: 'shortName',
    length: [2, 10]
  },
  {
    key: 'principal',
    length: [2, 10]
  },
  {
    key: 'contactPerson',
    length: [2, 10]
  },
  {
    key: 'address',
    required: true,
    length: [0, 100]
  },
  {
    key: 'phone1',
    required: true,
    length: [10]
  },
  {
    key: 'phone2',
    length: [10]
  },
  {
    key: 'faxNumber',
    length: [10]
  },
  {
    key: 'cellPhone',
    length: [10]
  },
  {
    key: 'note1',
    length: [255]
  },
  {
    key: 'note2',
    length: [255]
  }
]
