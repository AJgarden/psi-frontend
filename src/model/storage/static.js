export default class StaticStorage {
  static roles = []
  static unitList = []
  static purchaseSearch = {}
  static saleSearch = {}

  setRoles = (roles) => (StaticStorage.roles = roles)
  setUnitList = (unitList) => (StaticStorage.unitList = unitList)
  setPurchaseSearch = (purchaseSearch) => (StaticStorage.purchaseSearch = purchaseSearch)
  setSaleSearch = (saleSearch) => (StaticStorage.saleSearch = saleSearch)
}
