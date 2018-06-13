export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__sleller__
  if (!seller) {
    seller = {}
    seller[id] = {}
    // 此时seller是object
  } else {
    // 转换为对象
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // console.log(seller[id][key])
  // 转换为字符串
  localStorage.__sleller__ = JSON.stringify(seller)
}
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__sleller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  return seller[key] || def
}
