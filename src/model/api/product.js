import { restInstance, restUploadInstance } from '../runner/rest'

export default class ProductAPI {
  getProductList = (data) => {
    return restInstance('get', '/products', data).then((response) => response.data)
  }

  getProductType = () => {
    return restInstance('get', '/common/productTypes').then((response) => response.data)
  }

  getProductData = (seqNo) => {
    return restInstance('get', `/products/${seqNo}`).then((response) => response.data)
  }

  addProductData = (data) => {
    return restInstance('post', '/products/0', data).then((response) => response.data)
  }

  updateProductData = (data) => {
    return restInstance('patch', `/products/${data.seqNo}`, data).then((response) => response.data)
  }

  getProductAdditionData = (seqNo) => {
    return restInstance('get', `/products/additional/${seqNo}`).then((response) => response.data)
  }

  uploadProductPic = (seqNo, picEnum, data) => {
    return restUploadInstance('patch', `/products/additional/${seqNo}/${picEnum}`, data).then(
      (response) => response.data
    )
  }

  searchProductMapping = (realProduct, queryString) => {
    return restInstance('get', '/products/smartQuery', { realProduct, queryString }).then(
      (response) => response.data
    )
  }

  getPartsList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      partId: '',
      name: ''
    }
    return restInstance('get', '/parts', data).then((response) => response.data)
  }

  getKindsList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      kindIdLike: ''
    }
    return restInstance('get', '/kinds', data).then((response) => response.data)
  }

  getGradesList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      gradeId: ''
    }
    return restInstance('get', '/grades', data).then((response) => response.data)
  }

  getColorsList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      colorId: ''
    }
    return restInstance('get', '/colors', data).then((response) => response.data)
  }
}
