// ==UserScript==
// @name                v2ex-ignore-topics.js
// @description         v2ex helper script to ignore topics
// @namespace           https://github.com/cyberved
// @version             0.1.0
// @match               *://www.v2ex.com
// @match               *://www.v2ex.com/recent
// @match               *://www.v2ex.com/recent?p=*
// @match               *://www.v2ex.com/?tab=*
// @match               *://www.v2ex.com/go/*
// ==/UserScript==

(function () {
    var items = document.getElementsByClassName('item');
    Array.prototype.forEach.call(items, function(item) {
	appendIgnoreButton(item);
    });
})();

function appendIgnoreButton (item)
{
    var spacer = document.createTextNode("  •  ");
    var ignoreBtn = document.createElement('span');
    ignoreBtn.innerHTML = '忽略';
    var small = item.querySelector('.small');

    small.appendChild(spacer);
    small.appendChild(ignoreBtn);

    ignoreBtn.style.cursor = 'pointer';
    ignoreBtn.onmouseover = function () {
        ignoreBtn.style.color = '#4d5256';
    };
    ignoreBtn.onmouseleave = function () {
        ignoreBtn.style.color = '';
    };

    ignoreBtn.onclick = function () {
        ignoreBtn.innerHTML = '正在忽略……';
	ignoreTopic(ignoreBtn, item);
    };
}

function appendRevertButton (item, topicURL)
{
    var spacer = document.createTextNode("  •  ");
    var revertBtn = document.createElement('span');
    revertBtn.innerHTML = '撤销';
    item.appendChild(spacer);
    item.appendChild(revertBtn);

    revertBtn.style.cursor = 'pointer';
    revertBtn.onmouseover = function () {
        revertBtn.style.color = '#000000';
    };
    revertBtn.onmouseleave = function () {
        revertBtn.style.color = '';
    };

    revertBtn.onclick = function () {
	revertBtn.innerHTML = '正在撤销对主题的忽略……';
	unignoreTopic(revertBtn, topicURL);
    };
}

function ignoreTopic (button, item)
{
    var topicURL = item.querySelector('.item_title a').getAttribute('href');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', topicURL, true);
    xhr.onreadystatechange = function () {
	if (xhr.readyState == 4) {
	    if (xhr.status == 200) {
		var topicId = topicURL.split(/[\/#]/, 3)[2];
		var re = /\/ignore\/topic\/\d+\?once=\d+/g;
		var ignoreURL = xhr.responseText.match(re)[0];

		var xhr2 = new XMLHttpRequest();
		xhr2.open('GET', ignoreURL, true);
		xhr2.onreadystatechange = function () {
		    var finishMsg = '已忽略<a href="' + topicURL + '">' + topicId + '</a>号主题';
		    if (xhr2.readyState == 4) {
			if (xhr2.status == 200) {
			    item.innerHTML = finishMsg;
			    item.className = 'message';
			    appendRevertButton(item, topicURL);
			} else {
			    button.parentNode.replaceChild(document.createTextNode('忽略失败'), button);
			}
		    }
		};
		xhr2.send();
	    } else {
		button.parentNode.replaceChild(document.createTextNode('忽略失败'), button);
	    }
	}
    };
    xhr.send();
}

function unignoreTopic (button, topicURL)
{
    var xhr3 = new XMLHttpRequest();
    xhr3.open('GET', topicURL, true);
    xhr3.onreadystatechange = function () {
	if (xhr3.readyState == 4) {
	    if (xhr3.status == 200) {
		var re = /\/unignore\/topic\/\d+\?once=\d+/g;
		var unignoreURL = xhr3.responseText.match(re)[0];

		var xhr4 = new XMLHttpRequest();
		xhr4.open('GET', unignoreURL, true);
		xhr4.onreadystatechange = function () {
		    if (xhr4.readyState == 4) {
			if(xhr4.status == 200) {
			    button.parentNode.replaceChild(document.createTextNode('成功撤销对主题的忽略！'), button);
			} else {
			    button.parentNode.replaceChild(document.createTextNode('失败，未能撤销对主题的忽略！'), button);
			}
		    }
		};
		xhr4.send();
	    }
	}
    };
    xhr3.send();
}
