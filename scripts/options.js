var cb = window.commentBarber || {}
if (!cb.storage) throw 'missing storage'
/**
 * convert text to storage object
 */
function convert(text) {
  var list = (text || '').split(/[\n\t,]+/)
  var obj = {}
  for (var i = 0; i < list.length; i++) {
    if (list[i]) {
      obj[list[i]] = true
    }
  }
  return obj
}
/**
 * save button
 */
document.getElementById('save').addEventListener('click', function(event) {
  var whitelist = convert(document.getElementById('whitelist').value)
  var blacklist = convert(document.getElementById('blacklist').value)
  cb.storage.save('lists', { whitelist: whitelist, blacklist: blacklist })
})
/**
 * initial state
 */
cb.storage.load('lists', function(data) {
  data = data || { whitelist: {}, blacklist: {} }
  document.getElementById('whitelist').value = Object.keys(data.whitelist).join('\n')
  document.getElementById('blacklist').value = Object.keys(data.blacklist).join('\n')
})
