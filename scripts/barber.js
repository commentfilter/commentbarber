var cb = window.commentBarber || {}
if (!cb.storage) throw new Error('missing storage')
var attributions = cb.selectors.commentContainer + ' ' + cb.selectors.attribution;
if (cb.selectors) {
  /**
   * mute commenter
   */
  $('<div class="barber_icon barber_mute barber_mute_collapse"></div>').appendTo(attributions)
  $(cb.selectors.commentContainer).on('click', '.barber_mute', {}, function(event) {
    event.preventDefault()
    var comment = $(this).closest(cb.selectors.commentContainer)
    var name = comment.find(cb.selectors.commenter).text()
    var isMute = $(this).hasClass('barber_mute_collapse')
    if (isMute) { // add to blacklist
      blacklist(name)
      var comments = $("." + comment.data('id'))
      comments.find('.barber_mute').removeClass('barber_mute_collapse')
      comments.find('.barber_mute').addClass('barber_mute_expand')
      for (var i = 0; i < comments.length; i++) {
        var comment = $(comments[i])
        comment.find(cb.selectors.commentText).hide()
        comment.find('.barber_star').addClass('barber_star_unfilled')
        comment.find('.barber_star').removeClass('barber_star_filled')
      }
    } else {
      $(this).addClass('barber_mute_collapse')
      $(this).removeClass('barber_mute_expand')
      comment.find(cb.selectors.commentText).show()
    }
  })
  /**
   * star commenter
   */
  $('<div class="barber_icon barber_star barber_star_unfilled"></div>').appendTo(attributions)
  $(cb.selectors.commentContainer).on('click', '.barber_star', {}, function(event) {
    event.preventDefault()
    var comment = $(this).closest(cb.selectors.commentContainer)
    var isFavorite = $(this).hasClass('barber_star_unfilled')
    var commentsBy = $("." + comment.data('id') + ' .barber_star')
    var name = comment.find(cb.selectors.commenter).text()
    commentsBy.toggleClass('barber_star_unfilled')
    commentsBy.toggleClass('barber_star_filled')
    if (isFavorite) { // add to whitelist
      whitelist(name)
      var comments = $("." + comment.data('id'))
      for (var i = 0; i < comments.length; i++) {
        var comment = $(comments[i])
        comment.find(cb.selectors.commentText).show()
        comment.find('.barber_mute').addClass('barber_mute_collapse')
        comment.find('.barber_mute').removeClass('barber_mute_expand')
      }
    } else {
      unwhitelist(name)
    }
  })
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
  var random = function() { 
    return Math.floor((1 + Math.random()) * 0x1000000000000).toString(16).substring(1)
  }
  var comments = $(cb.selectors.commentContainer)
  var map = {}
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i]
    var name = $(comment).find(cb.selectors.commenter).text()
    if (!map[name]) {
      map[name] = random() + random() + random() + random()
    }
    var id = map[name]
    $(comment).addClass(id)
    $(comment).data('id', id)
  }
  /**
   * set initial state
   */
  operate(function(data) {
    data = data || { whitelist: {}, blacklist: {} }
    for (var name in data.whitelist) {
      $('.' + map[name]).first().find('.barber_star').click()
    }
    for (var name in data.blacklist) {
      $('.' + map[name]).first().find('.barber_mute').click()
    }
    return data
  })
}
