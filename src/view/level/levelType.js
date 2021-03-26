export const initData = {
  gradeId: '',
  name: ''
}

export const formRules = [
  {
    key: 'gradeId',
    required: true,
    length: [2]
  },
  {
    key: 'name',
    required: true,
    length: [10]
  }
]
