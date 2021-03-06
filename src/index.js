const defaultEmbedScriptLoadTimeout = 2000;

export default async function appendHtml(
  html,
  container,
  timeOut = defaultEmbedScriptLoadTimeout
) {
  const htmlParts = html
    .split(/(<script[\s\S]*?<\/script>)/)
    .filter(htmlPart => htmlPart !== "");
  for (const htmlPart of htmlParts) {
    await appendEmbedPart(htmlPart, container, timeOut);
  }
}

async function appendEmbedPart(embedPart, container, timeOut) {
  return isScript(embedPart)
    ? await appendScript(embedPart, container, timeOut)
    : appendNonScriptHtml(embedPart, container);
}

function isScript(embedPart) {
  return /^<script/.test(embedPart);
}

function appendNonScriptHtml(text, container) {
  const elements = htmlStringToElements(text);
  while (elements.length) {
    container.appendChild(elements[0]);
  }
}

async function appendScript(scriptAsText, container, timeOut) {
  const scriptNode = getScriptNodeFromHtmlString(scriptAsText);
  container.appendChild(scriptNode);
  if (scriptNode.hasAttribute("src") && !scriptNode.hasAttribute("async")) {
    await waitForScriptLoaded(scriptNode, timeOut);
  }
}

function waitForScriptLoaded(scriptNode, timeOut) {
  return new Promise((resolve, reject) => {
    const loadFailTimeout = window.setTimeout(
      () => reject(new Error("Timed out after " + timeOut + "ms")),
      timeOut
    );
    scriptNode.onload = () => {
      window.clearTimeout(loadFailTimeout);
      resolve();
    };
    scriptNode.onerror = error => {
      window.clearTimeout(loadFailTimeout);
      reject(error);
    };
  });
}

function getScriptNodeFromHtmlString(htmlString) {
  const nonExecutableScriptNode = htmlStringToElements(htmlString)[0];
  const executableScriptNode = document.createElement("script");
  for (const attr of nonExecutableScriptNode.attributes) {
    executableScriptNode.setAttribute(attr.name, attr.value);
  }
  executableScriptNode.text = nonExecutableScriptNode.text;
  return executableScriptNode;
}

function htmlStringToElements(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.childNodes;
}
