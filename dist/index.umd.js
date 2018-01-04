(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.appendHtml = factory());
}(this, (function () { 'use strict';

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a);}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d);}function d(e){c(e,1);}c();})}

const defaultEmbedScriptLoadTimeout = 2000;

function appendHtml(html, container, timeOut = defaultEmbedScriptLoadTimeout) {return __async(function*(){
  const htmlParts = html.split(/<script[\s\S]*?<\/script>/);
  for (const htmlPart of htmlParts) {
    yield appendEmbedPart(htmlPart, container, timeOut);
  }
}())}

function appendEmbedPart(embedPart, container, timeOut) {return __async(function*(){
  return isScript(embedPart) ? yield appendScript(embedPart, container, timeOut) : appendNonScriptHtml(embedPart, container);
}())}

function isScript(embedPart) {
  return /^<script/.test(embedPart);
}

function appendNonScriptHtml(text, container) {
  const elements = htmlStringToElements(text);
  for (const element of elements) {
    container.appendChild(element);
  }
}

function appendScript(scriptAsText, container, timeOut) {return __async(function*(){
  const scriptNode = getScriptNodeFromHtmlString(scriptAsText);
  container.appendChild(scriptNode);
  if (!scriptNode.async) {
    yield waitForScriptLoaded(scriptNode, timeOut);
  }
}())}

function waitForScriptLoaded(scriptNode, timeOut) {
  return new Promise(resolve => {
    const loadFailTimeout = window.setTimeout(() => resolve(), timeOut);
    scriptNode.onload = () => {
      window.clearTimeout(loadFailTimeout);
      resolve();
    };
  });
}

function getScriptNodeFromHtmlString(htmlString) {
  const nonExecutableScriptNode = htmlStringToElements(htmlString)[0];
  const executableScriptNode = document.createElement('script');
  for (const attr of nonExecutableScriptNode.attributes) {
    executableScriptNode.setAttribute(attr.name, attr.value);
  }
  return executableScriptNode;
}

function htmlStringToElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
}

return appendHtml;

})));