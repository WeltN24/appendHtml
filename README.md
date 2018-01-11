# appendHTML()

This library exports a single function that takes an HTML string and a container and will append the HTML to 
(put the html at the end of) the container. It also executes `script`s appended, which may be useful when
working with embed codes.

## Why

Why is that special? Usually when you append HTML to a container, for instance using .innerHTML, any `script`
tags in your HTML will not be executed. I.e. doing this:

```js
const html = '<p>Hello</p><script>alert("world")</script>'; 
const container = document.getElementById('some-div');
container.innerHTML = html;
```

will never execute the JS and never alert "world". The same goes for script nodes with a `src` attribute.

What you would need to do is parse your HTML string and for each `<script>` tag create a script node with 
`document.createElement('script')`, copy its attributes and text contents and append it to the container.
You'd also have to make sure that when you have mixed (_regular_) HTML and script nodes they get appended
and executed in the right order and at the right time, accounting for inline scripts as well as scripts
with and without the `async` attribute.

This library does just that for you and provides you with **cjs**, **esm** and **umd** modules thanks to
rollup.js.

## Installation

```
yarn add appendhtml
```

and then either of

```js
import appendHtml from 'appendhtml';
const appendHtml = require('appendhtml');
// or <script src="node_modules/appendhtml/dist/index.umd.js"></script> which gives you a global function appendHtml
```

## Usage

`appendHtml` takes 3 arguments

| Argument | Description | Default Value |
| -------- | ----------- | ------------- |
| **html** | A string of HTML possibly containing script nodes | _none_ |
| **container** | A DOM node to append the HTML to | _none_ |
| **timeOut** (optional!) | A timeout in milliseconds to wait for scripts to load before resolving the returned Promise. Note that the Promise will never be rejected, it will be _resolved_ after the timeout because this is the behaviour of browsers. | 2000 |


The **return value** is a `Promise<void>` that resolves when all scripts have been loaded (or when scripts are `async` or the timeout is hit).

### Examples

**The first example, fixed**
```js
import appendHtml from 'appendhtml';
const html = '<p>Hello</p><script>alert("world")</script>'; 
const container = document.getElementById('some-div');
appendHtml(html, container); // alerts "world"
```

**Wait for script to load**
```js
import appendHtml from 'appendhtml';
const html = '<p>Hello</p><script src="some_js_file.js"></script>'; 
const container = document.getElementById('some-div');
await appendHtml(html, container);
// appendHtml returns a Promise, some_js_file.js is now loaded and executed (note the await)
```

**Fancy example**
```js
import appendHtml from 'appendhtml';
const response = await fetch('https://publish.twitter.com/oembed?url=https://twitter.com/luke_schmuke/status/766775290404233217');
const json = await response.json();
const container = document.getElementById('some-div');
await appendhtml(json.html, container);
// Hooray, we just embedded a tweet
```

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/LukasBombach">
          <img width="150" height="150" src="https://github.com/LukasBombach.png?v=3&s=150">
          </br>
          Lukas Bombach
        </a>
      </td>
    </tr>
  <tbody>
</table>


## License

The license is MIT

Copyright 2018 Lukas Bombach

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
