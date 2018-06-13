/**
 * 解析url参数
 * @param {*} id 商家id
 * @param {*} key
 * @param {*} value
 */
export function urlParse (id, key, value) {
  let url = window.location.search
  let obj = {}
  // ?id=123&a=b正则表达式匹配
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // ['?id=123','&a=b']
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let value = decodeURIComponent(tempArr[1])
      obj[key] = value
    })
  }
  return obj
}
