/*!
 * WordPress highlight
 * https://github.com/ineo6/wordpress-highlight
 */

importScripts('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/highlight.min.js');

onmessage = function (event) {
    var data = JSON.parse(event.data);

    try {
        var result = self.hljs.highlight(data.lang, data.code);
    } catch (e) {
        var result = self.hljs.highlightAuto(data.code);
    }

    postMessage(JSON.stringify({
        result: {
            value: result.value,
            language: result.language,
        }, index: data.index
    }));
};
