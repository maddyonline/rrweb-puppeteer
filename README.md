Run this script in Google chrome console after visiting website (like expedia.com).

```javascript
// Load rrwebRecord using script tag
var myEvents = [];
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js';
script.onload = function() {
  initiateRecording();
};
document.head.appendChild(script);

function initiateRecording() {
  // Helper function to get the selection query of an element
  function getDomSelector(element) {
    if (!element) return '';

    let selector;
    if (element.id) {
      selector = `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      selector = '.' + element.className.trim().replace(/\s+/g, '.');
    } else {
      selector = element.tagName.toLowerCase();
    }

    return selector;
  }

  function getDomElement(id) {
    if (!id) return null;
    const mirror = rrwebRecord.mirror;
    if (typeof mirror === 'object' && typeof mirror.getNode === 'function') {
      return mirror.getNode(id);
    }
    return null;
  }
	
  // Modify emit function in rrwebRecord
  rrwebRecord({
    emit(event) {
      // Only process Click and Input events
      if (
        event.type === 3 &&
        (event.data.source === 2 || event.data.source === 3)
      ) {
				console.log("target", event.target)
        // Get the DOM element and add the selector to the event
        const domElement = getDomElement(event.data.id);
        event.selectQuery = getDomSelector(domElement);

        // Emit the filtered and enhanced event
        console.log(event);
				myEvents.push(event);
      }
    },
  });
}
```

Then copy `myEvents` as a JSON string and then run it as puppeteer. See an example in `videos/`.

Run puppeteer script: `npm install && npm start`.