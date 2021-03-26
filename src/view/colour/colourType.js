export const initData = {
  colorId: '',
  name: ''
}

export const formRules = [
  {
    key: 'colorId',
    required: true,
    length: [2]
  },
  {
    key: 'name',
    required: true,
    length: [10]
  }
]
