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
  name: '',
  mappingProductId: '',
  mappingProductSeqNo: null,
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

export const additionData = {
  width: null,
  height: null,
  weight: null,
  length: null,
  pic1GoogleBlobId: '',
  pic1Url: '',
  pic2GoogleBlobId: '',
  pic2Url: '',
  pic3GoogleBlobId: '',
  pic3Url: '',
  pic4GoogleBlobId: '',
  pic4Url: '',
  productSeqNo: null
}
