/*!
 * WordPress highlight
 * https://github.com/ineo6/wordpress-highlight
 */

importScripts('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/highlight.min.js');

onmessage = function (event) {
    var data = JSON.parse(event.data);

    var result = self.hljs.highlightAuto(data.code);

    postMessage(JSON.stringify({result: result.value, index: data.index}));
};
