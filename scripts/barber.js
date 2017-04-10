var cb = window.commentBarber || {}
if (!cb.storage) throw new Error('missing storage')
if (!cb.selectors) throw new Error('missing selectors')
/**
 * mute name
 */
function mute(event) {
  event.preventDefault()
  var comment = $(this).closest(selectors.container)
  var name = comment.find(selectors.name).text()
  var isMute = $(this).hasClass('barber_mute_collapse')
  if (isMute) { // add to blacklist
    blacklist(name)
    var comments = $("." + comment.data('id'))
    comments.find('.barber_mute').removeClass('barber_mute_collapse')
    comments.find('.barber_mute').addClass('barber_mute_expand')
    for (var i = 0; i < comments.length; i++) {
      var comment = $(comments[i])
      comment.find(selectors.text).hide()
      comment.find('.barber_star').addClass('barber_star_unfilled')
      comment.find('.barber_star').removeClass('barber_star_filled')
    }
  } else {
    $(this).addClass('barber_mute_collapse')
    $(this).removeClass('barber_mute_expand')
    comment.find(selectors.text).show()
  }
  setIcons()
}
/**
 * star name
 */
function star(event) {
  event.preventDefault()
  var comment = $(this).closest(selectors.container)
  var isFavorite = $(this).hasClass('barber_star_unfilled')
  var commentsBy = $("." + comment.data('id') + ' .barber_star')
  var name = comment.find(selectors.name).text()
  commentsBy.toggleClass('barber_star_unfilled')
  commentsBy.toggleClass('barber_star_filled')
  if (isFavorite) { // add to whitelist
    whitelist(name)
    var comments = $("." + comment.data('id'))
    for (var i = 0; i < comments.length; i++) {
      var comment = $(comments[i])
      comment.find(selectors.text).show()
      comment.find('.barber_mute').addClass('barber_mute_collapse')
      comment.find('.barber_mute').removeClass('barber_mute_expand')
    }
  } else {
    unwhitelist(name)
  }
  setIcons()
}
/**
 * store and update lists
 */
function whitelist(name) {
  operate(function(data) {
    data.whitelist[name] = true
    delete data.blacklist[name]
    return data
  })
}
function unwhitelist(name) {
  operate(function(data) {
    delete data.whitelist[name]
    return data
  })
}
function blacklist(name) {
  operate(function(data) {
    delete data.whitelist[name]
    data.blacklist[name] = true
    return data
  })
}
function operate(fn) {
  cb.storage.load('lists', function(data) {
    cb.storage.save('lists', fn(data))
  })
}
/**
 * assign IDs
 */
function assignIds() {
  var random = function() { 
    return Math.floor((1 + Math.random()) * 0x1000000000000).toString(16).substring(1)
  }
  var comments = $(selectors.container)
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i]
    var name = $(comment).find(selectors.name).text()
    if (!ids[name]) {
      ids[name] = random() + random() + random() + random()
    }
    var id = ids[name]
    $(comment).addClass(id)
    $(comment).data('id', id)
  }
}
/**
 * set initial state
 */
function setInitialState() {
  operate(function(data) {
    data = data || { whitelist: {}, blacklist: {} }
    for (var name in data.whitelist) {
      $('.' + ids[name]).first().find('.barber_star').click()
    }
    for (var name in data.blacklist) {
      $('.' + ids[name]).first().find('.barber_mute').click()
    }
    return data
  })
}
/**
 * cross browser icon support
 */
function setIcons() {
  var map = {
    'barber_star_unfilled': '/images/star.png',
    'barber_star_filled': '/images/star-filled.png',
    'barber_mute_expand': '/images/plus.png',
    'barber_mute_collapse': '/images/mute.png',
  }
  for (var key in map) {
    $('.' + key).css({
      'background-image': 'url(' + chrome.extension.getURL(map[key]) + ')'
    })
  }
}
/**
 * initialization
 */
function initialize() {
  var attributions = selectors.container + ' ' + selectors.attribution;
  $('<div/>')
    .addClass('barber_icon barber_mute barber_mute_collapse')
    .appendTo(attributions)
  $(selectors.container).on('click', '.barber_mute', {}, mute)
  $('<div/>')
    .addClass('barber_icon barber_star barber_star_unfilled')
    .appendTo(attributions)
  $(selectors.container).on('click', '.barber_star', {}, star)
  setIcons()
  assignIds()
  setInitialState()
}
/**
 * load selectors for the domain
 */
var ids = {}
var selectors = null
cb.storage.load('selectors', function(data) {
  data = data || cb.selectors
  for (var domain in data) {
    if (RegExp(domain, 'g').test(window.location.hostname)) {
      selectors = data[domain]
      initialize()
      return
    }
  }
})
