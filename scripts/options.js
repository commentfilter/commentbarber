var cb = window.commentBarber || {}
if (!cb.storage) throw 'missing storage'
if (!cb.selectors) throw 'missing default selectors'
/**
 * tabs
 */
$('.tabs').on('click', 'a', {}, function(event){
  event.preventDefault()
  $('.tabgroup > div').hide()
  $('.tabs a').removeClass('active')
  $($(this).attr('href')).show()
  $(this).addClass('active')
  cb.storage.save('tabSelection', '#' + $(this).attr('id'))
})
/**
 * editable list
 */
var last = ''
var domainCheck = /^[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3})$/
$('.selectable').on('dblclick', '.display', {}, function() {
  last = $(this).text()
  var val = $(this).closest('li').hasClass('new') ? '' : last
  $(this).hide().siblings('.edit').show().val(val).focus()
})
$('.selectable').on('focusout', '.edit', {}, function() {
  var val = $(this).val()
  if (domainCheck.test(val)) {
    $('.selected').attr('id', val)
    $('fieldset div').change()
    var temp = selectors[last]
    delete selectors[last]
    selectors[val] = temp || { 
      container: '',
      attribution: '',
      name: '',
      text: ''
    }
  } else {
    val = last
  }
  $(this).hide().siblings('.display').show().text(val)
})
$('.selectable').on('click', 'li', {}, function() {
  $('.selectable li').removeClass('selected')
  $(this).addClass('selected')
  if($(this).hasClass('new')) {
    $('fieldset input').val('')
  } else {
    var selected = selectors[$(this).attr('id')] || {}
    for (var id in selected) {
      $('input[name=' + id + ']').val(selected[id])
    }
  }
})
/**
 * selector fields
 */
$('fieldset div').on('change', 'input', function() {
  var selected = $('.selected').attr('id')
  selectors[selected] = selectors[selected] || {}
  var id = $(this).attr('name')
  selectors[selected][id] = $(this).val()
})
/**
 * convert list text to storage object
 */
function convertList(text) {
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
$('#save').on('click', function(event){
  var whitelist = convertList(document.getElementById('whitelist').value)
  var blacklist = convertList(document.getElementById('blacklist').value)
  cb.storage.save('lists', { whitelist: whitelist, blacklist: blacklist })
  cb.storage.save('selectors', selectors)
})
$('#reset').on('click', function(event){
  cb.storage.save('selectors', cb.selectors)
  location.reload()
})
/**
 * initial state for lists
 */
cb.storage.load('lists', function(lists) {
  lists = lists || { whitelist: {}, blacklist: {} }
  document.getElementById('whitelist').value = Object.keys(lists.whitelist).join('\n')
  document.getElementById('blacklist').value = Object.keys(lists.blacklist).join('\n')
})
/**
 * initial state for selectors
 */
selectors = {}
cb.storage.load('selectors', function(_selectors) {
  selectors = _selectors || cb.selectors
  for (var selector in selectors) {
    $('#domains')
      .append($('<li/>').attr('id', selector)
        .append($('<span/>').addClass('display').text(selector))
        .append($('<input type="text"/>').addClass('edit')))
  }
  $('#domains')
      .append($('<li/>').addClass('new')
        .append($('<span/>').addClass('display').text('(dblclick to add domain)'))
        .append($('<input type="text"/>').addClass('edit')))
  $('.selectable li:first-of-type').click()
})
/**
 * initial state for tabs
 */
cb.storage.load('tabSelection', function(tabSelection) {
  if (tabSelection) {
    $(tabSelection).click()
  } else {
    $('.tabs a:last-of-type').click()
  }
})
