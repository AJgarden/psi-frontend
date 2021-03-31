import StatisStorage from '../../model/storage/static'

export const initData = {
  seqNo: 0,
  productId: '',
  productType: 'REAL',
  partId: null,
  customCode1: '',
  customCode2: '',
  customCode3: '',
  kindShortName: '',
  unit: StatisStorage.unitList.length > 0 ? StatisStorage.unitList[0].unit : '',
  price1: 0,
  price2: 0,
  price3: 0,
  norm: '',
  vendorProductId: '',
  safetyStock: 0,
  inventory: 0,
  storingPlace: '',
  note: ''
}

export const formRules = [
]
