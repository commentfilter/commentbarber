# Comment Barber <img align="left" src="https://raw.githubusercontent.com/commentfilter/commentbarber/master/images/barbershop.png">
**This add-on makes it easier to focus on the topics you care about in comment threads.**

There are two main features:

1) Add a star to comments from names on a whitelist.
2) Mute/hide comments from names on a blacklist. Once a commenter is muted individual posts can still be expanded but they will be hidden by default.

## How it works

Javascript is injected into supported pages. If jQuery selectors for the page are available the star and mute buttons are added and any comments from names on the whitelist or blacklist are muted or starred accordingly.

## Contributing

The project is organized into three layers.

1) scripts/selectors/*.js defines a set of selectors for each supported domain.
2) scripts/storage.js abstracts browser specific storage APIs and allows settings to be persisted between domains.
3) scripts/barber.js loads your settings and uses the selectors to hide/show/star comments and commenters.

To add support for a new website.
* Follow the naming convention and create a new file under scripts/selectors/*.js  
`[subdomain].[domain].[tld].js`
* Define selectors in this file for the following elements:
  * `commentContainer:` this selector should match the HTML that fully comprises an individual comment.
  * `attribution:` this selector should match the attribution section of the comment which usually contains the commenter name and date of posting.
  * `commenter:` this selector should match the element that contains the name of the commenter in plain text.
  * `commentText:` this selector should match the body of the comment.
* Add a new matcher to the content_scripts section of `manifest.json` before the final block that imports `barber.js`.   
  ```json
  "content_scripts": [{
    "matches": ["*://*.slashdot.org/*"],
    "js": [
      "scripts/selectors/slashdot.org.js"
    ]
  }]
  ```
