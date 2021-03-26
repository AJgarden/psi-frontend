export const initData = {
  partId: '',
  name: ''
}

export const formRules = [
  {
    key: 'partId',
    required: true,
    length: [4]
  },
  {
    key: 'name',
    required: true,
    length: [10]
  }
]
