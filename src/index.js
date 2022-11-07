const React = require("react");
const { render } = require("react-dom");
const d3 = require("./d3");

const PROJECT_NAME = "interactive-gay-rights-map";
const root = document.querySelector(`body`);

import { selectMounts } from "@abcnews/mount-utils";
import { whenOdysseyLoaded } from "@abcnews/env-utils";

const data = require("./data.json");

require("./styles.scss");

/**
 * Transforms PL mount points back into Phase 1 style anchor tags.
 * Useful for porting old stories to support rendering in PL.
 * eg. <div id="hashname"></div> ----> <a name="hashname"> </a>
 */
function backtransformMounts() {
  const mounts = selectMounts();

  mounts.forEach((mount) => {
    const anchorEl = document.createElement("a");
    anchorEl.name = mount.id;
    anchorEl.innerHTML = " ";

    // replace element
    mount.parentNode.replaceChild(anchorEl, mount);
  });
}

async function init() {
  await whenOdysseyLoaded;

  backtransformMounts();

  const scrollyteller =
    require("@abcnews/scrollyteller").loadOdysseyScrollyteller(
      "",
      "u-full",
      "mark"
    );

  console.log(scrollyteller);

  const App = require("./components/App");

  render(
    <App data={data} scrollyteller={scrollyteller} />,
    scrollyteller.mountNode
  );
}

init();

if (module.hot) {
  module.hot.accept("./components/App", () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require("./components/ErrorBox");
      render(<ErrorBox error={err} />, root);
    }
  });
}

if (process.env.NODE_ENV === "development") {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
