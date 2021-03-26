export default class StaticStorage {
  static roles = []

  setRoles = (roles) => (StaticStorage.roles = roles)
}
