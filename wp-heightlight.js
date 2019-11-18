/*!
 * WordPress highlight
 * https://github.com/ineo6/wordpress-highlight
 */

(function ($) {
    function initHighlight() {
        function getLang(codeCls) {
            var result = codeCls.match(/language-(\w+)/);

            var lang = "plaintext";

            if (result && result.length) {
                lang = result[1];
            }

            if (lang === "text") {
                lang = "plaintext";
            }

            return lang;
        }

        function createBar(i) {
            var attributes = {
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false',
                'contenteditable': 'false',
            };
            var codeCls = $('pre:eq(' + i + ')')[0].children[0].className;

            $('pre:eq(' + i + ')').addClass('highlight-wrap');
            for (var t in attributes) {
                $('pre:eq(' + i + ')').attr(t, attributes[t]);
            }
            $('pre:eq(' + i + ') code').addClass('hljs').attr('data-rel', getLang(codeCls).toUpperCase()).attr({id: "highlight-code-" + i})
                .after('<a class="copy-code" data-clipboard-target="#highlight-code-' + i + '" title="拷贝代码">复制</a>');
        }

        // 使用 web worker
        function highlightWorker() {
            var codeBlocks = document.querySelectorAll('pre code');

            if (window.theme_url) {
                var worker = new Worker(window.theme_url + '/js/highlight-worker.js');
            } else {
                return false;
            }

            worker.onmessage = (event) => {
                var highlightData = JSON.parse(event.data);

                codeBlocks[highlightData.index].innerHTML = highlightData.result.value;
                createBar(highlightData.index);

                if (highlightData.index === codeBlocks.length - 1) {
                    // 结束关闭worker
                    worker.terminate();
                    hljs.initLineNumbersOnLoad({
                        singleLine: true
                    });
                }
            };

            codeBlocks.forEach(function (block, index) {
                worker.postMessage(JSON.stringify({
                    code: block.textContent,
                    lang: getLang(block.className),
                    index,
                    total: codeBlocks.length,
                }));
            })
        }

        function highlightNormal() {
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });

            for (var i = 0, len = $('pre').length; i < len; i++) {
                createBar(i);
            }

            // 代码行数
            hljs.initLineNumbersOnLoad({
                singleLine: true
            });
        }

        if (typeof (Worker) === undefined) {
            highlightNormal();
        } else {
            highlightWorker();
        }

        new ClipboardJS('.copy-code');
    }

    $(document).ready(function () {
        initHighlight();
    });
})(jQuery);
