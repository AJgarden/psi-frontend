export const initData = {
  employeeId: '',
  identityCardNumber: '',
  name: '',
  birthday: null,
  address: '',
  cellPhone: '',
  phone: '',
  takeOfficeDay: null,
  education: '',
  experience: '',
  note: '',
  salary: null,
  extraBonus: null,
  fullAttendanceBonus: null
}

export const formRules = [
  {
    key: 'employeeId',
    required: true,
    length: [10]
  },
  {
    key: 'identityCardNumber',
    required: true,
    length: [10]
  },
  {
    key: 'name',
    required: true,
    length: [0, 30]
  },
  {
    key: 'address',
    required: true,
    length: [0, 100]
  },
  {
    key: 'cellPhone',
    required: true,
    length: [10]
  },
  {
    key: 'phone',
    length: [10]
  },
  {
    key: 'education',
    length: [10]
  },
  {
    key: 'experience',
    length: [10]
  },
  {
    key: 'note',
    length: [255]
  }
]