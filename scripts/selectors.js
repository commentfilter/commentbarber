window.commentBarber = window.commentBarber || {}
window.commentBarber.selectors = {
  'slashdot.org': {
    container: '.cw',
    attribution: '.details',
    name: '.by a:first',
    text: '.commentBody'
  },
  'news.ycombinator.com': {
    container: '.default',
    attribution: '.comhead',
    name: '.hnuser',
    text: '.comment'
  },
  'schneier.com': {
    container: '.comment',
    attribution: '.commentcredit',
    name: '.commenter',
    text: 'p:not(.commentcredit)'
  }
}
