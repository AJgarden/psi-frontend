export const initData = {
  kindId: '',
  name: '',
  shortName: '',
  factory: ''
}

export const formRules = [
  {
    key: 'kindId',
    required: true,
    length: [8]
  },
  {
    key: 'name',
    required: true,
    length: [20]
  },
  {
    key: 'shortName',
    required: true,
    length: [15]
  },
  {
    key: 'factory',
    length: [3]
  }
]
