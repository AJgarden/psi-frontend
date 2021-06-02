import { restInstance, restUploadInstance } from '../runner/rest'

export default class ProductAPI {
  getProductList = (data) => {
    return restInstance('get', '/v1/products', data).then((response) => response.data)
  }

  getProductType = () => {
    return restInstance('get', '/v1/common/productTypes').then((response) => response.data)
  }

  getProductData = (seqNo) => {
    return restInstance('get', `/v1/products/${seqNo}`).then((response) => response.data)
  }

  addProductData = (data) => {
    return restInstance('post', '/v1/products/0', data).then((response) => response.data)
  }

  updateProductData = (data) => {
    return restInstance('patch', `/v1/products/${data.seqNo}`, data).then((response) => response.data)
  }

  getProductAdditionData = (seqNo) => {
    return restInstance('get', `/v1/products/additional/${seqNo}`).then((response) => response.data)
  }

  updateProductAdditionData = (seqNo, data) => {
    return restInstance('patch', `/v1/products/additional/${seqNo}`, data).then((response) => response.data)
  }

  uploadProductPic = (seqNo, picEnum, data) => {
    return restUploadInstance('patch', `/v1/products/additional/${seqNo}/${picEnum}`, data).then(
      (response) => response.data
    )
  }

  searchProductMapping = (realProduct, queryString) => {
    return restInstance('get', '/v1/products/smartQuery', { realProduct, queryString }).then(
      (response) => response.data
    )
  }

  queryProduct = (realProduct, queryString) => {
    return restInstance('get', '/v2/products/smartQuery', { realProduct, queryString }).then(
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
    return restInstance('get', '/v1/parts', data).then((response) => response.data)
  }

  getKindsList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      kindIdLike: ''
    }
    return restInstance('get', '/v1/kinds', data).then((response) => response.data)
  }

  getGradesList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      gradeId: ''
    }
    return restInstance('get', '/v1/grades', data).then((response) => response.data)
  }

  getColorsList = () => {
    const data = {
      pageNum: 1,
      pageSize: 9999,
      colorId: ''
    }
    return restInstance('get', '/v1/colors', data).then((response) => response.data)
  }
}
