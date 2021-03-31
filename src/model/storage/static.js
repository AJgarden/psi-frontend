export default class StaticStorage {
  static roles = []
  static unitList = []

  setRoles = (roles) => (StaticStorage.roles = roles)
  setUnitList = (unitList) => (StaticStorage.unitList = unitList)
}
