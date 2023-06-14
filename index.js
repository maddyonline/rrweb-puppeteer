

import { chromium } from 'playwright';

var eventsJsonStr = '[{"type":3,"data":{"source":2,"type":1,"id":466,"x":494,"y":155},"timestamp":1686749610210,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":5,"id":466},"timestamp":1686749610211,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":0,"id":466,"x":494,"y":155},"timestamp":1686749610355,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":2,"id":466,"x":494,"y":155},"timestamp":1686749610362,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":6,"id":466},"timestamp":1686749610373,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":5,"id":-1},"timestamp":1686749610374,"selectQuery":""},{"type":3,"data":{"source":2,"type":1,"id":2420,"x":461,"y":242},"timestamp":1686749615705,"selectQuery":".uitk-button.uitk-button-medium.uitk-button-fullWidth.has-subtext.location-field-destination-result-item-button.result-item-button"},{"type":3,"data":{"source":2,"type":6,"id":1734},"timestamp":1686749615712,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":5,"id":2420},"timestamp":1686749615712,"selectQuery":".uitk-button.uitk-button-medium.uitk-button-fullWidth.has-subtext.location-field-destination-result-item-button.result-item-button"},{"type":3,"data":{"source":2,"type":0,"id":2420,"x":461,"y":242},"timestamp":1686749615793,"selectQuery":".uitk-button.uitk-button-medium.uitk-button-fullWidth.has-subtext.location-field-destination-result-item-button.result-item-button"},{"type":3,"data":{"source":2,"type":2,"id":2420,"x":461,"y":242},"timestamp":1686749615796,"selectQuery":".uitk-button.uitk-button-medium.uitk-button-fullWidth.has-subtext.location-field-destination-result-item-button.result-item-button"},{"type":3,"data":{"source":2,"type":6,"id":2420},"timestamp":1686749615803,"selectQuery":".uitk-button.uitk-button-medium.uitk-button-fullWidth.has-subtext.location-field-destination-result-item-button.result-item-button"},{"type":3,"data":{"source":2,"type":5,"id":1734},"timestamp":1686749615804,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":6,"id":1734},"timestamp":1686749615820,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":5,"id":466},"timestamp":1686749615821,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":6,"id":466},"timestamp":1686749615827,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":5,"id":1734},"timestamp":1686749615828,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":6,"id":1734},"timestamp":1686749615832,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":5,"id":466},"timestamp":1686749615833,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":6,"id":466},"timestamp":1686749615842,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":5,"id":1734},"timestamp":1686749615843,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":6,"id":1734},"timestamp":1686749615845,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":5,"id":466},"timestamp":1686749615846,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":6,"id":466},"timestamp":1686749615849,"selectQuery":".uitk-fake-input.uitk-form-field-trigger"},{"type":3,"data":{"source":2,"type":5,"id":1734},"timestamp":1686749615851,"selectQuery":"#location-field-destination"},{"type":3,"data":{"source":2,"type":6,"id":1734},"timestamp":1686749616345,"selectQuery":"#location-field-destination"}]';
var events = JSON.parse(eventsJsonStr);

async function getEventData() {
  return events;
}

async function run(page) {
  await page.goto('https://expedia.com');

  const eventData = await getEventData();

  for (let event of eventData) {
    if (event.selectQuery) {
      if (
        event.type === 3 &&
        (event.data.source === 2 || event.data.source === 3)
      ) {
        if (event.data.source === 2) {
          // Mouse event
          if (event.data.type === 6) {
            // Click event
            await page.click(event.selectQuery);
          }
        } else if (event.data.source === 3) {
          // Input event
          if (event.data.type === 3) {
            // Input type
            await page.fill(event.selectQuery, event.data.text);
          }
          if (event.data.type === 4 || event.data.type === 5) {
            // Change or Blur type
            await page.press(event.selectQuery, 'Enter');
          }
          if (event.data.type === 13) {
            // Select event
            await page.selectOption(event.selectQuery, { value: event.data.value });
          }
        }
      }
    }
  }

  await page.waitForTimeout(5000); // Wait for a few seconds to see the actions, then close the browser.
}

(async () => {
  const browser = await chromium.launch({
    slowMo: 100,
    headless: false,
  });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
    },
  });
  const page = await context.newPage();
  await run(page);

  await browser.close();
})();