window.commentBarber = window.commentBarber || {}
window.commentBarber.storage = {
  save: function(key, value) {
    var data = value
    try {
      data = JSON.stringify(data)
    } catch (e) {
      //
    }
    return storageAPI.save('comment_barber_' + key, data)
  },
  load: function(key, callback) {
    var data = storageAPI.load('comment_barber_' + key, function(data) {
      try {
        data = JSON.parse(data) || data
      } catch(e) {
        //
      }
      callback(data)
    })
  }
}
/**
 * chrome storage API
 */
var chromeStorageAPI = {
  save: function (key, value) {
    var data = {}
    data[key] = value
    chrome.storage.sync.set(data)
  },
  load: function (key, callback) {
    chrome.storage.sync.get(key, function (value) {
        callback(value[key])
    })
  }
}
/**
 * local storage API
 */
var localStorageAPI = {
  save: function (key, value) {
    window.localStorage.setItem(key, value)
  },
  load: function (key, callback) {
    var data = window.localStorage.getItem(key)
    callback(data)
  }
}
/**
 * browser storage API
 */
var browserStorageAPI = {
  save: function (key, value) {
    var data = {}
    data[key] = value
    window.browser.storage.local.set(data)
  },
  load: function (key, callback) {
    window.browser.storage.local.get(key, function (value) {
        callback(value[key])
    })
  }
}
/**
 * assign the best supported storage API
 */
var storageAPI = null
if (typeof window.chrome !== 'undefined') {
  storageAPI = chromeStorageAPI
} else if (typeof window.localStorage !== 'undefined') {
  storageAPI = localStorageAPI
} else if (typeof window.browser !== 'undefined') {
  storageAPI = browserStorageAPI
} else {
  storageAPI = { save: function() {}, load: function(v, cb) { typeof cb === 'function' ? cb(v) : 0 } }
}
