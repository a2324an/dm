import os from "os";
import fs from "fs";
import path from "path";
import logger from './logger';
import express, { Express, Request, Response, NextFunction } from 'express';



export default async function ConfigureServer() {


    const app:Express = express();
    const port = 8080;
    
    const HEAD = `<style>
    
    /* // https://github.com/jasonm23/markdown-css-themes */
    
    img {
        max-width: 100%;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th {
        color: gray;
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    table,
    th,
    td {
        padding: 5px;
        border: 1px solid rgba(0, 0, 0, 0.3);
    }
    
    tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    
    html {
        font-size: 62.5%;
    }
    
    html,
    body {
        height: 100%;
    }
    
    body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 150%;
        line-height: 1.3;
        color: #f6e6cc;
        width: 700px;
        margin: auto;
        background: #27221a;
        position: relative;
        padding: 0 30px;
    }
    
    p,
    ul,
    ol,
    dl,
    table,
    pre {
        margin-bottom: 1em;
    }
    
    ul {
        margin-left: 20px;
    }
    
    a {
        text-decoration: none;
        cursor: pointer;
        color: #ba832c;
        font-weight: bold;
    }
    
    a:focus {
        outline: 1px dotted;
    }
    
    a:visited {}
    
    a:hover,
    a:focus {
        color: #d3a459;
        text-decoration: none;
    }
    
    a *,
    button * {
        cursor: pointer;
    }
    
    hr {
        display: none;
    }
    
    small {
        font-size: 90%;
    }
    
    input,
    select,
    button,
    textarea,
    option {
        font-family: Arial, "Lucida Grande", "Lucida Sans Unicode", Arial, Verdana, sans-serif;
        font-size: 100%;
    }
    
    button,
    label,
    select,
    option,
    input[type=submit] {
        cursor: pointer;
    }
    
    .group:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    
    .group {
        display: inline-block;
    }
    
    /* Hides from IE-mac \*/
    * html .group {
        height: 1%;
    }
    
    .group {
        display: block;
    }
    
    /* End hide from IE-mac */
    sup {
        font-size: 80%;
        line-height: 1;
        vertical-align: super;
    }
    
    button::-moz-focus-inner {
        border: 0;
        padding: 1px;
    }
    
    span.amp {
        font-family: Baskerville, "Goudy Old Style", "Palatino", "Book Antiqua", serif;
        font-weight: normal;
        font-style: italic;
        font-size: 1.2em;
        line-height: 0.8;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
        font-family: Baskerville, "Goudy Old Style", "Palatino", "Book Antiqua", serif;
    }
    
    h2 {
        font-size: 22pt;
    }
    
    h3 {
        font-size: 20pt;
    }
    
    h4 {
        font-size: 18pt;
    }
    
    h5 {
        font-size: 16pt;
    }
    
    h6 {
        font-size: 14pt;
    }
    
    ::selection {
        background: #745626;
    }
    
    ::-moz-selection {
        background: #745626;
    }
    
    h1 {
        font-size: 420%;
        margin: 0 0 0.1em;
        font-family: Baskerville, "Goudy Old Style", "Palatino", "Book Antiqua", serif;
    }
    
    h1 a,
    h1 a:hover {
        color: #d7af72;
        font-weight: normal;
        text-decoration: none;
    }
    
    pre {
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        padding: 8px 10px;
        border-radius: 0.4em;
        -moz-border-radius: 0.4em;
        -webkit-border-radius: 0.4em;
        overflow-x: hidden;
    }
    
    pre code {
        font-size: 10pt;
    }
    
    .thumb {
        float: left;
        margin: 10px;
    }
    
    /* PrismJS 1.29.0
    https://prismjs.com/download.html#themes=prism-tomorrow&languages=clike+javascript+bash+json */
    code[class*=language-],pre[class*=language-]{color:#ccc;background:0 0;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#2d2d2d}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.block-comment,.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#999}.token.punctuation{color:#ccc}.token.attr-name,.token.deleted,.token.namespace,.token.tag{color:#e2777a}.token.function-name{color:#6196cc}.token.boolean,.token.function,.token.number{color:#f08d49}.token.class-name,.token.constant,.token.property,.token.symbol{color:#f8c555}.token.atrule,.token.builtin,.token.important,.token.keyword,.token.selector{color:#cc99cd}.token.attr-value,.token.char,.token.regex,.token.string,.token.variable{color:#7ec699}.token.entity,.token.operator,.token.url{color:#67cdcc}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.token.inserted{color:green}
    </style>
    `;
    
    const HIGHLIGHT_SCRIPT = "LyogUHJpc21KUyAxLjI5LjAKaHR0cHM6Ly9wcmlzbWpzLmNvbS9kb3dubG9hZC5odG1sI3RoZW1lcz1wcmlzbS1kYXJrJmxhbmd1YWdlcz1jbGlrZStqYXZhc2NyaXB0K2Jhc2granNvbiAqLwp2YXIgX3NlbGY9InVuZGVmaW5lZCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OiJ1bmRlZmluZWQiIT10eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUmJnNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZT9zZWxmOnt9LFByaXNtPWZ1bmN0aW9uKGUpe3ZhciBuPS8oPzpefFxzKWxhbmcoPzp1YWdlKT8tKFtcdy1dKykoPz1cc3wkKS9pLHQ9MCxyPXt9LGE9e21hbnVhbDplLlByaXNtJiZlLlByaXNtLm1hbnVhbCxkaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXI6ZS5QcmlzbSYmZS5QcmlzbS5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXIsdXRpbDp7ZW5jb2RlOmZ1bmN0aW9uIGUobil7cmV0dXJuIG4gaW5zdGFuY2VvZiBpP25ldyBpKG4udHlwZSxlKG4uY29udGVudCksbi5hbGlhcyk6QXJyYXkuaXNBcnJheShuKT9uLm1hcChlKTpuLnJlcGxhY2UoLyYvZywiJmFtcDsiKS5yZXBsYWNlKC88L2csIiZsdDsiKS5yZXBsYWNlKC9cdTAwYTAvZywiICIpfSx0eXBlOmZ1bmN0aW9uKGUpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkuc2xpY2UoOCwtMSl9LG9iaklkOmZ1bmN0aW9uKGUpe3JldHVybiBlLl9faWR8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCJfX2lkIix7dmFsdWU6Kyt0fSksZS5fX2lkfSxjbG9uZTpmdW5jdGlvbiBlKG4sdCl7dmFyIHIsaTtzd2l0Y2godD10fHx7fSxhLnV0aWwudHlwZShuKSl7Y2FzZSJPYmplY3QiOmlmKGk9YS51dGlsLm9iaklkKG4pLHRbaV0pcmV0dXJuIHRbaV07Zm9yKHZhciBsIGluIHI9e30sdFtpXT1yLG4pbi5oYXNPd25Qcm9wZXJ0eShsKSYmKHJbbF09ZShuW2xdLHQpKTtyZXR1cm4gcjtjYXNlIkFycmF5IjpyZXR1cm4gaT1hLnV0aWwub2JqSWQobiksdFtpXT90W2ldOihyPVtdLHRbaV09cixuLmZvckVhY2goKGZ1bmN0aW9uKG4sYSl7clthXT1lKG4sdCl9KSkscik7ZGVmYXVsdDpyZXR1cm4gbn19LGdldExhbmd1YWdlOmZ1bmN0aW9uKGUpe2Zvcig7ZTspe3ZhciB0PW4uZXhlYyhlLmNsYXNzTmFtZSk7aWYodClyZXR1cm4gdFsxXS50b0xvd2VyQ2FzZSgpO2U9ZS5wYXJlbnRFbGVtZW50fXJldHVybiJub25lIn0sc2V0TGFuZ3VhZ2U6ZnVuY3Rpb24oZSx0KXtlLmNsYXNzTmFtZT1lLmNsYXNzTmFtZS5yZXBsYWNlKFJlZ0V4cChuLCJnaSIpLCIiKSxlLmNsYXNzTGlzdC5hZGQoImxhbmd1YWdlLSIrdCl9LGN1cnJlbnRTY3JpcHQ6ZnVuY3Rpb24oKXtpZigidW5kZWZpbmVkIj09dHlwZW9mIGRvY3VtZW50KXJldHVybiBudWxsO2lmKCJjdXJyZW50U2NyaXB0ImluIGRvY3VtZW50KXJldHVybiBkb2N1bWVudC5jdXJyZW50U2NyaXB0O3RyeXt0aHJvdyBuZXcgRXJyb3J9Y2F0Y2gocil7dmFyIGU9KC9hdCBbXihcclxuXSpcKCguKik6W146XSs6W146XStcKSQvaS5leGVjKHIuc3RhY2spfHxbXSlbMV07aWYoZSl7dmFyIG49ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoInNjcmlwdCIpO2Zvcih2YXIgdCBpbiBuKWlmKG5bdF0uc3JjPT1lKXJldHVybiBuW3RdfXJldHVybiBudWxsfX0saXNBY3RpdmU6ZnVuY3Rpb24oZSxuLHQpe2Zvcih2YXIgcj0ibm8tIituO2U7KXt2YXIgYT1lLmNsYXNzTGlzdDtpZihhLmNvbnRhaW5zKG4pKXJldHVybiEwO2lmKGEuY29udGFpbnMocikpcmV0dXJuITE7ZT1lLnBhcmVudEVsZW1lbnR9cmV0dXJuISF0fX0sbGFuZ3VhZ2VzOntwbGFpbjpyLHBsYWludGV4dDpyLHRleHQ6cix0eHQ6cixleHRlbmQ6ZnVuY3Rpb24oZSxuKXt2YXIgdD1hLnV0aWwuY2xvbmUoYS5sYW5ndWFnZXNbZV0pO2Zvcih2YXIgciBpbiBuKXRbcl09bltyXTtyZXR1cm4gdH0saW5zZXJ0QmVmb3JlOmZ1bmN0aW9uKGUsbix0LHIpe3ZhciBpPShyPXJ8fGEubGFuZ3VhZ2VzKVtlXSxsPXt9O2Zvcih2YXIgbyBpbiBpKWlmKGkuaGFzT3duUHJvcGVydHkobykpe2lmKG89PW4pZm9yKHZhciBzIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShzKSYmKGxbc109dFtzXSk7dC5oYXNPd25Qcm9wZXJ0eShvKXx8KGxbb109aVtvXSl9dmFyIHU9cltlXTtyZXR1cm4gcltlXT1sLGEubGFuZ3VhZ2VzLkRGUyhhLmxhbmd1YWdlcywoZnVuY3Rpb24obix0KXt0PT09dSYmbiE9ZSYmKHRoaXNbbl09bCl9KSksbH0sREZTOmZ1bmN0aW9uIGUobix0LHIsaSl7aT1pfHx7fTt2YXIgbD1hLnV0aWwub2JqSWQ7Zm9yKHZhciBvIGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eShvKSl7dC5jYWxsKG4sbyxuW29dLHJ8fG8pO3ZhciBzPW5bb10sdT1hLnV0aWwudHlwZShzKTsiT2JqZWN0IiE9PXV8fGlbbChzKV0/IkFycmF5IiE9PXV8fGlbbChzKV18fChpW2wocyldPSEwLGUocyx0LG8saSkpOihpW2wocyldPSEwLGUocyx0LG51bGwsaSkpfX19LHBsdWdpbnM6e30saGlnaGxpZ2h0QWxsOmZ1bmN0aW9uKGUsbil7YS5oaWdobGlnaHRBbGxVbmRlcihkb2N1bWVudCxlLG4pfSxoaWdobGlnaHRBbGxVbmRlcjpmdW5jdGlvbihlLG4sdCl7dmFyIHI9e2NhbGxiYWNrOnQsY29udGFpbmVyOmUsc2VsZWN0b3I6J2NvZGVbY2xhc3MqPSJsYW5ndWFnZS0iXSwgW2NsYXNzKj0ibGFuZ3VhZ2UtIl0gY29kZSwgY29kZVtjbGFzcyo9ImxhbmctIl0sIFtjbGFzcyo9ImxhbmctIl0gY29kZSd9O2EuaG9va3MucnVuKCJiZWZvcmUtaGlnaGxpZ2h0YWxsIixyKSxyLmVsZW1lbnRzPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShyLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHIuc2VsZWN0b3IpKSxhLmhvb2tzLnJ1bigiYmVmb3JlLWFsbC1lbGVtZW50cy1oaWdobGlnaHQiLHIpO2Zvcih2YXIgaSxsPTA7aT1yLmVsZW1lbnRzW2wrK107KWEuaGlnaGxpZ2h0RWxlbWVudChpLCEwPT09bixyLmNhbGxiYWNrKX0saGlnaGxpZ2h0RWxlbWVudDpmdW5jdGlvbihuLHQscil7dmFyIGk9YS51dGlsLmdldExhbmd1YWdlKG4pLGw9YS5sYW5ndWFnZXNbaV07YS51dGlsLnNldExhbmd1YWdlKG4saSk7dmFyIG89bi5wYXJlbnRFbGVtZW50O28mJiJwcmUiPT09by5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpJiZhLnV0aWwuc2V0TGFuZ3VhZ2UobyxpKTt2YXIgcz17ZWxlbWVudDpuLGxhbmd1YWdlOmksZ3JhbW1hcjpsLGNvZGU6bi50ZXh0Q29udGVudH07ZnVuY3Rpb24gdShlKXtzLmhpZ2hsaWdodGVkQ29kZT1lLGEuaG9va3MucnVuKCJiZWZvcmUtaW5zZXJ0IixzKSxzLmVsZW1lbnQuaW5uZXJIVE1MPXMuaGlnaGxpZ2h0ZWRDb2RlLGEuaG9va3MucnVuKCJhZnRlci1oaWdobGlnaHQiLHMpLGEuaG9va3MucnVuKCJjb21wbGV0ZSIscyksciYmci5jYWxsKHMuZWxlbWVudCl9aWYoYS5ob29rcy5ydW4oImJlZm9yZS1zYW5pdHktY2hlY2siLHMpLChvPXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSYmInByZSI9PT1vLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJiFvLmhhc0F0dHJpYnV0ZSgidGFiaW5kZXgiKSYmby5zZXRBdHRyaWJ1dGUoInRhYmluZGV4IiwiMCIpLCFzLmNvZGUpcmV0dXJuIGEuaG9va3MucnVuKCJjb21wbGV0ZSIscyksdm9pZChyJiZyLmNhbGwocy5lbGVtZW50KSk7aWYoYS5ob29rcy5ydW4oImJlZm9yZS1oaWdobGlnaHQiLHMpLHMuZ3JhbW1hcilpZih0JiZlLldvcmtlcil7dmFyIGM9bmV3IFdvcmtlcihhLmZpbGVuYW1lKTtjLm9ubWVzc2FnZT1mdW5jdGlvbihlKXt1KGUuZGF0YSl9LGMucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoe2xhbmd1YWdlOnMubGFuZ3VhZ2UsY29kZTpzLmNvZGUsaW1tZWRpYXRlQ2xvc2U6ITB9KSl9ZWxzZSB1KGEuaGlnaGxpZ2h0KHMuY29kZSxzLmdyYW1tYXIscy5sYW5ndWFnZSkpO2Vsc2UgdShhLnV0aWwuZW5jb2RlKHMuY29kZSkpfSxoaWdobGlnaHQ6ZnVuY3Rpb24oZSxuLHQpe3ZhciByPXtjb2RlOmUsZ3JhbW1hcjpuLGxhbmd1YWdlOnR9O2lmKGEuaG9va3MucnVuKCJiZWZvcmUtdG9rZW5pemUiLHIpLCFyLmdyYW1tYXIpdGhyb3cgbmV3IEVycm9yKCdUaGUgbGFuZ3VhZ2UgIicrci5sYW5ndWFnZSsnIiBoYXMgbm8gZ3JhbW1hci4nKTtyZXR1cm4gci50b2tlbnM9YS50b2tlbml6ZShyLmNvZGUsci5ncmFtbWFyKSxhLmhvb2tzLnJ1bigiYWZ0ZXItdG9rZW5pemUiLHIpLGkuc3RyaW5naWZ5KGEudXRpbC5lbmNvZGUoci50b2tlbnMpLHIubGFuZ3VhZ2UpfSx0b2tlbml6ZTpmdW5jdGlvbihlLG4pe3ZhciB0PW4ucmVzdDtpZih0KXtmb3IodmFyIHIgaW4gdCluW3JdPXRbcl07ZGVsZXRlIG4ucmVzdH12YXIgYT1uZXcgcztyZXR1cm4gdShhLGEuaGVhZCxlKSxvKGUsYSxuLGEuaGVhZCwwKSxmdW5jdGlvbihlKXtmb3IodmFyIG49W10sdD1lLmhlYWQubmV4dDt0IT09ZS50YWlsOyluLnB1c2godC52YWx1ZSksdD10Lm5leHQ7cmV0dXJuIG59KGEpfSxob29rczp7YWxsOnt9LGFkZDpmdW5jdGlvbihlLG4pe3ZhciB0PWEuaG9va3MuYWxsO3RbZV09dFtlXXx8W10sdFtlXS5wdXNoKG4pfSxydW46ZnVuY3Rpb24oZSxuKXt2YXIgdD1hLmhvb2tzLmFsbFtlXTtpZih0JiZ0Lmxlbmd0aClmb3IodmFyIHIsaT0wO3I9dFtpKytdOylyKG4pfX0sVG9rZW46aX07ZnVuY3Rpb24gaShlLG4sdCxyKXt0aGlzLnR5cGU9ZSx0aGlzLmNvbnRlbnQ9bix0aGlzLmFsaWFzPXQsdGhpcy5sZW5ndGg9MHwocnx8IiIpLmxlbmd0aH1mdW5jdGlvbiBsKGUsbix0LHIpe2UubGFzdEluZGV4PW47dmFyIGE9ZS5leGVjKHQpO2lmKGEmJnImJmFbMV0pe3ZhciBpPWFbMV0ubGVuZ3RoO2EuaW5kZXgrPWksYVswXT1hWzBdLnNsaWNlKGkpfXJldHVybiBhfWZ1bmN0aW9uIG8oZSxuLHQscixzLGcpe2Zvcih2YXIgZiBpbiB0KWlmKHQuaGFzT3duUHJvcGVydHkoZikmJnRbZl0pe3ZhciBoPXRbZl07aD1BcnJheS5pc0FycmF5KGgpP2g6W2hdO2Zvcih2YXIgZD0wO2Q8aC5sZW5ndGg7KytkKXtpZihnJiZnLmNhdXNlPT1mKyIsIitkKXJldHVybjt2YXIgdj1oW2RdLHA9di5pbnNpZGUsbT0hIXYubG9va2JlaGluZCx5PSEhdi5ncmVlZHksaz12LmFsaWFzO2lmKHkmJiF2LnBhdHRlcm4uZ2xvYmFsKXt2YXIgeD12LnBhdHRlcm4udG9TdHJpbmcoKS5tYXRjaCgvW2ltc3V5XSokLylbMF07di5wYXR0ZXJuPVJlZ0V4cCh2LnBhdHRlcm4uc291cmNlLHgrImciKX1mb3IodmFyIGI9di5wYXR0ZXJufHx2LHc9ci5uZXh0LEE9czt3IT09bi50YWlsJiYhKGcmJkE+PWcucmVhY2gpO0ErPXcudmFsdWUubGVuZ3RoLHc9dy5uZXh0KXt2YXIgRT13LnZhbHVlO2lmKG4ubGVuZ3RoPmUubGVuZ3RoKXJldHVybjtpZighKEUgaW5zdGFuY2VvZiBpKSl7dmFyIFAsTD0xO2lmKHkpe2lmKCEoUD1sKGIsQSxlLG0pKXx8UC5pbmRleD49ZS5sZW5ndGgpYnJlYWs7dmFyIFM9UC5pbmRleCxPPVAuaW5kZXgrUFswXS5sZW5ndGgsaj1BO2ZvcihqKz13LnZhbHVlLmxlbmd0aDtTPj1qOylqKz0odz13Lm5leHQpLnZhbHVlLmxlbmd0aDtpZihBPWotPXcudmFsdWUubGVuZ3RoLHcudmFsdWUgaW5zdGFuY2VvZiBpKWNvbnRpbnVlO2Zvcih2YXIgQz13O0MhPT1uLnRhaWwmJihqPE98fCJzdHJpbmciPT10eXBlb2YgQy52YWx1ZSk7Qz1DLm5leHQpTCsrLGorPUMudmFsdWUubGVuZ3RoO0wtLSxFPWUuc2xpY2UoQSxqKSxQLmluZGV4LT1BfWVsc2UgaWYoIShQPWwoYiwwLEUsbSkpKWNvbnRpbnVlO1M9UC5pbmRleDt2YXIgTj1QWzBdLF89RS5zbGljZSgwLFMpLE09RS5zbGljZShTK04ubGVuZ3RoKSxXPUErRS5sZW5ndGg7ZyYmVz5nLnJlYWNoJiYoZy5yZWFjaD1XKTt2YXIgej13LnByZXY7aWYoXyYmKHo9dShuLHosXyksQSs9Xy5sZW5ndGgpLGMobix6LEwpLHc9dShuLHosbmV3IGkoZixwP2EudG9rZW5pemUoTixwKTpOLGssTikpLE0mJnUobix3LE0pLEw+MSl7dmFyIEk9e2NhdXNlOmYrIiwiK2QscmVhY2g6V307byhlLG4sdCx3LnByZXYsQSxJKSxnJiZJLnJlYWNoPmcucmVhY2gmJihnLnJlYWNoPUkucmVhY2gpfX19fX19ZnVuY3Rpb24gcygpe3ZhciBlPXt2YWx1ZTpudWxsLHByZXY6bnVsbCxuZXh0Om51bGx9LG49e3ZhbHVlOm51bGwscHJldjplLG5leHQ6bnVsbH07ZS5uZXh0PW4sdGhpcy5oZWFkPWUsdGhpcy50YWlsPW4sdGhpcy5sZW5ndGg9MH1mdW5jdGlvbiB1KGUsbix0KXt2YXIgcj1uLm5leHQsYT17dmFsdWU6dCxwcmV2Om4sbmV4dDpyfTtyZXR1cm4gbi5uZXh0PWEsci5wcmV2PWEsZS5sZW5ndGgrKyxhfWZ1bmN0aW9uIGMoZSxuLHQpe2Zvcih2YXIgcj1uLm5leHQsYT0wO2E8dCYmciE9PWUudGFpbDthKyspcj1yLm5leHQ7bi5uZXh0PXIsci5wcmV2PW4sZS5sZW5ndGgtPWF9aWYoZS5QcmlzbT1hLGkuc3RyaW5naWZ5PWZ1bmN0aW9uIGUobix0KXtpZigic3RyaW5nIj09dHlwZW9mIG4pcmV0dXJuIG47aWYoQXJyYXkuaXNBcnJheShuKSl7dmFyIHI9IiI7cmV0dXJuIG4uZm9yRWFjaCgoZnVuY3Rpb24obil7cis9ZShuLHQpfSkpLHJ9dmFyIGk9e3R5cGU6bi50eXBlLGNvbnRlbnQ6ZShuLmNvbnRlbnQsdCksdGFnOiJzcGFuIixjbGFzc2VzOlsidG9rZW4iLG4udHlwZV0sYXR0cmlidXRlczp7fSxsYW5ndWFnZTp0fSxsPW4uYWxpYXM7bCYmKEFycmF5LmlzQXJyYXkobCk/QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaS5jbGFzc2VzLGwpOmkuY2xhc3Nlcy5wdXNoKGwpKSxhLmhvb2tzLnJ1bigid3JhcCIsaSk7dmFyIG89IiI7Zm9yKHZhciBzIGluIGkuYXR0cmlidXRlcylvKz0iICIrcysnPSInKyhpLmF0dHJpYnV0ZXNbc118fCIiKS5yZXBsYWNlKC8iL2csIiZxdW90OyIpKyciJztyZXR1cm4iPCIraS50YWcrJyBjbGFzcz0iJytpLmNsYXNzZXMuam9pbigiICIpKyciJytvKyI+IitpLmNvbnRlbnQrIjwvIitpLnRhZysiPiJ9LCFlLmRvY3VtZW50KXJldHVybiBlLmFkZEV2ZW50TGlzdGVuZXI/KGEuZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyfHxlLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLChmdW5jdGlvbihuKXt2YXIgdD1KU09OLnBhcnNlKG4uZGF0YSkscj10Lmxhbmd1YWdlLGk9dC5jb2RlLGw9dC5pbW1lZGlhdGVDbG9zZTtlLnBvc3RNZXNzYWdlKGEuaGlnaGxpZ2h0KGksYS5sYW5ndWFnZXNbcl0scikpLGwmJmUuY2xvc2UoKX0pLCExKSxhKTphO3ZhciBnPWEudXRpbC5jdXJyZW50U2NyaXB0KCk7ZnVuY3Rpb24gZigpe2EubWFudWFsfHxhLmhpZ2hsaWdodEFsbCgpfWlmKGcmJihhLmZpbGVuYW1lPWcuc3JjLGcuaGFzQXR0cmlidXRlKCJkYXRhLW1hbnVhbCIpJiYoYS5tYW51YWw9ITApKSwhYS5tYW51YWwpe3ZhciBoPWRvY3VtZW50LnJlYWR5U3RhdGU7ImxvYWRpbmciPT09aHx8ImludGVyYWN0aXZlIj09PWgmJmcmJmcuZGVmZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigiRE9NQ29udGVudExvYWRlZCIsZik6d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZT93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGYpOndpbmRvdy5zZXRUaW1lb3V0KGYsMTYpfXJldHVybiBhfShfc2VsZik7InVuZGVmaW5lZCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9UHJpc20pLCJ1bmRlZmluZWQiIT10eXBlb2YgZ2xvYmFsJiYoZ2xvYmFsLlByaXNtPVByaXNtKTsKUHJpc20ubGFuZ3VhZ2VzLmNsaWtlPXtjb21tZW50Olt7cGF0dGVybjovKF58W15cXF0pXC9cKltcc1xTXSo/KD86XCpcL3wkKS8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LHtwYXR0ZXJuOi8oXnxbXlxcOl0pXC9cLy4qLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH1dLHN0cmluZzp7cGF0dGVybjovKFsiJ10pKD86XFwoPzpcclxufFtcc1xTXSl8KD8hXDEpW15cXFxyXG5dKSpcMS8sZ3JlZWR5OiEwfSwiY2xhc3MtbmFtZSI6e3BhdHRlcm46LyhcYig/OmNsYXNzfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfGludGVyZmFjZXxuZXd8dHJhaXQpXHMrfFxiY2F0Y2hccytcKClbXHcuXFxdKy9pLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntwdW5jdHVhdGlvbjovWy5cXF0vfX0sa2V5d29yZDovXGIoPzpicmVha3xjYXRjaHxjb250aW51ZXxkb3xlbHNlfGZpbmFsbHl8Zm9yfGZ1bmN0aW9ufGlmfGlufGluc3RhbmNlb2Z8bmV3fG51bGx8cmV0dXJufHRocm93fHRyeXx3aGlsZSlcYi8sYm9vbGVhbjovXGIoPzpmYWxzZXx0cnVlKVxiLyxmdW5jdGlvbjovXGJcdysoPz1cKCkvLG51bWJlcjovXGIweFtcZGEtZl0rXGJ8KD86XGJcZCsoPzpcLlxkKik/fFxCXC5cZCspKD86ZVsrLV0/XGQrKT8vaSxvcGVyYXRvcjovWzw+XT0/fFshPV09Pz0/fC0tP3xcK1wrP3wmJj98XHxcfD98Wz8qL35eJV0vLHB1bmN0dWF0aW9uOi9be31bXF07KCksLjpdL307ClByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0PVByaXNtLmxhbmd1YWdlcy5leHRlbmQoImNsaWtlIix7ImNsYXNzLW5hbWUiOltQcmlzbS5sYW5ndWFnZXMuY2xpa2VbImNsYXNzLW5hbWUiXSx7cGF0dGVybjovKF58W14kXHdceEEwLVx1RkZGRl0pKD8hXHMpW18kQS1aXHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqKD89XC4oPzpjb25zdHJ1Y3Rvcnxwcm90b3R5cGUpKS8sbG9va2JlaGluZDohMH1dLGtleXdvcmQ6W3twYXR0ZXJuOi8oKD86XnxcfSlccyopY2F0Y2hcYi8sbG9va2JlaGluZDohMH0se3BhdHRlcm46LyhefFteLl18XC5cLlwuXHMqKVxiKD86YXN8YXNzZXJ0KD89XHMqXHspfGFzeW5jKD89XHMqKD86ZnVuY3Rpb25cYnxcKHxbJFx3XHhBMC1cdUZGRkZdfCQpKXxhd2FpdHxicmVha3xjYXNlfGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZW51bXxleHBvcnR8ZXh0ZW5kc3xmaW5hbGx5KD89XHMqKD86XHt8JCkpfGZvcnxmcm9tKD89XHMqKD86WyciXXwkKSl8ZnVuY3Rpb258KD86Z2V0fHNldCkoPz1ccyooPzpbI1xbJFx3XHhBMC1cdUZGRkZdfCQpKXxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHVuZGVmaW5lZHx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKVxiLyxsb29rYmVoaW5kOiEwfV0sZnVuY3Rpb246LyM/KD8hXHMpW18kYS16QS1aXHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqKD89XHMqKD86XC5ccyooPzphcHBseXxiaW5kfGNhbGwpXHMqKT9cKCkvLG51bWJlcjp7cGF0dGVybjpSZWdFeHAoIihefFteXFx3JF0pKD86TmFOfEluZmluaXR5fDBbYkJdWzAxXSsoPzpfWzAxXSspKm4/fDBbb09dWzAtN10rKD86X1swLTddKykqbj98MFt4WF1bXFxkQS1GYS1mXSsoPzpfW1xcZEEtRmEtZl0rKSpuP3xcXGQrKD86X1xcZCspKm58KD86XFxkKyg/Ol9cXGQrKSooPzpcXC4oPzpcXGQrKD86X1xcZCspKik/KT98XFwuXFxkKyg/Ol9cXGQrKSopKD86W0VlXVsrLV0/XFxkKyg/Ol9cXGQrKSopPykoPyFbXFx3JF0pIiksbG9va2JlaGluZDohMH0sb3BlcmF0b3I6Ly0tfFwrXCt8XCpcKj0/fD0+fCYmPT98XHxcfD0/fFshPV09PXw8PD0/fD4+Pj89P3xbLSsqLyUmfF4hPTw+XT0/fFwuezN9fFw/XD89P3xcP1wuP3xbfjpdL30pLFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0WyJjbGFzcy1uYW1lIl1bMF0ucGF0dGVybj0vKFxiKD86Y2xhc3N8ZXh0ZW5kc3xpbXBsZW1lbnRzfGluc3RhbmNlb2Z8aW50ZXJmYWNlfG5ldylccyspW1x3LlxcXSsvLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImphdmFzY3JpcHQiLCJrZXl3b3JkIix7cmVnZXg6e3BhdHRlcm46UmVnRXhwKCIoKD86XnxbXiRcXHdcXHhBMC1cXHVGRkZGLlwiJ1xcXSlcXHNdfFxcYig/OnJldHVybnx5aWVsZCkpXFxzKikvKD86KD86XFxbKD86W15cXF1cXFxcXHJcbl18XFxcXC4pKlxcXXxcXFxcLnxbXi9cXFxcXFxbXHJcbl0pKy9bZGdpbXl1c117MCw3fXwoPzpcXFsoPzpbXltcXF1cXFxcXHJcbl18XFxcXC58XFxbKD86W15bXFxdXFxcXFxyXG5dfFxcXFwufFxcWyg/OlteW1xcXVxcXFxcclxuXXxcXFxcLikqXFxdKSpcXF0pKlxcXXxcXFxcLnxbXi9cXFxcXFxbXHJcbl0pKy9bZGdpbXl1c117MCw3fXZbZGdpbXl1c117MCw3fSkoPz0oPzpcXHN8L1xcKig/OlteKl18XFwqKD8hLykpKlxcKi8pKig/OiR8W1xyXG4sLjs6fSlcXF1dfC8vKSkiKSxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6eyJyZWdleC1zb3VyY2UiOntwYXR0ZXJuOi9eKFwvKVtcc1xTXSsoPz1cL1thLXpdKiQpLyxsb29rYmVoaW5kOiEwLGFsaWFzOiJsYW5ndWFnZS1yZWdleCIsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5yZWdleH0sInJlZ2V4LWRlbGltaXRlciI6L15cL3xcLyQvLCJyZWdleC1mbGFncyI6L15bYS16XSskL319LCJmdW5jdGlvbi12YXJpYWJsZSI6e3BhdHRlcm46LyM/KD8hXHMpW18kYS16QS1aXHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqKD89XHMqWz06XVxzKig/OmFzeW5jXHMqKT8oPzpcYmZ1bmN0aW9uXGJ8KD86XCgoPzpbXigpXXxcKFteKCldKlwpKSpcKXwoPyFccylbXyRhLXpBLVpceEEwLVx1RkZGRl0oPzooPyFccylbJFx3XHhBMC1cdUZGRkZdKSopXHMqPT4pKS8sYWxpYXM6ImZ1bmN0aW9uIn0scGFyYW1ldGVyOlt7cGF0dGVybjovKGZ1bmN0aW9uKD86XHMrKD8hXHMpW18kYS16QS1aXHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqKT9ccypcKFxzKikoPyFccykoPzpbXigpXHNdfFxzKyg/IVtccyldKXxcKFteKCldKlwpKSsoPz1ccypcKSkvLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fSx7cGF0dGVybjovKF58W14kXHdceEEwLVx1RkZGRl0pKD8hXHMpW18kYS16XHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqKD89XHMqPT4pL2ksbG9va2JlaGluZDohMCxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9LHtwYXR0ZXJuOi8oXChccyopKD8hXHMpKD86W14oKVxzXXxccysoPyFbXHMpXSl8XChbXigpXSpcKSkrKD89XHMqXClccyo9PikvLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fSx7cGF0dGVybjovKCg/OlxifFxzfF4pKD8hKD86YXN8YXN5bmN8YXdhaXR8YnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseXxmb3J8ZnJvbXxmdW5jdGlvbnxnZXR8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzZXR8c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dW5kZWZpbmVkfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpKD8hWyRcd1x4QTAtXHVGRkZGXSkpKD86KD8hXHMpW18kYS16QS1aXHhBMC1cdUZGRkZdKD86KD8hXHMpWyRcd1x4QTAtXHVGRkZGXSkqXHMqKVwoXHMqfFxdXHMqXChccyopKD8hXHMpKD86W14oKVxzXXxccysoPyFbXHMpXSl8XChbXigpXSpcKSkrKD89XHMqXClccypceykvLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fV0sY29uc3RhbnQ6L1xiW0EtWl0oPzpbQS1aX118XGR4PykqXGIvfSksUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgiamF2YXNjcmlwdCIsInN0cmluZyIse2hhc2hiYW5nOntwYXR0ZXJuOi9eIyEuKi8sZ3JlZWR5OiEwLGFsaWFzOiJjb21tZW50In0sInRlbXBsYXRlLXN0cmluZyI6e3BhdHRlcm46L2AoPzpcXFtcc1xTXXxcJFx7KD86W157fV18XHsoPzpbXnt9XXxce1tefV0qXH0pKlx9KStcfXwoPyFcJFx7KVteXFxgXSkqYC8sZ3JlZWR5OiEwLGluc2lkZTp7InRlbXBsYXRlLXB1bmN0dWF0aW9uIjp7cGF0dGVybjovXmB8YCQvLGFsaWFzOiJzdHJpbmcifSxpbnRlcnBvbGF0aW9uOntwYXR0ZXJuOi8oKD86XnxbXlxcXSkoPzpcXHsyfSkqKVwkXHsoPzpbXnt9XXxceyg/Oltee31dfFx7W159XSpcfSkqXH0pK1x9Lyxsb29rYmVoaW5kOiEwLGluc2lkZTp7ImludGVycG9sYXRpb24tcHVuY3R1YXRpb24iOntwYXR0ZXJuOi9eXCRce3xcfSQvLGFsaWFzOiJwdW5jdHVhdGlvbiJ9LHJlc3Q6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9fSxzdHJpbmc6L1tcc1xTXSsvfX0sInN0cmluZy1wcm9wZXJ0eSI6e3BhdHRlcm46LygoPzpefFsse10pWyBcdF0qKShbIiddKSg/OlxcKD86XHJcbnxbXHNcU10pfCg/IVwyKVteXFxcclxuXSkqXDIoPz1ccyo6KS9tLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwLGFsaWFzOiJwcm9wZXJ0eSJ9fSksUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgiamF2YXNjcmlwdCIsIm9wZXJhdG9yIix7ImxpdGVyYWwtcHJvcGVydHkiOntwYXR0ZXJuOi8oKD86XnxbLHtdKVsgXHRdKikoPyFccylbXyRhLXpBLVpceEEwLVx1RkZGRl0oPzooPyFccylbJFx3XHhBMC1cdUZGRkZdKSooPz1ccyo6KS9tLGxvb2tiZWhpbmQ6ITAsYWxpYXM6InByb3BlcnR5In19KSxQcmlzbS5sYW5ndWFnZXMubWFya3VwJiYoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuYWRkSW5saW5lZCgic2NyaXB0IiwiamF2YXNjcmlwdCIpLFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLmFkZEF0dHJpYnV0ZSgib24oPzphYm9ydHxibHVyfGNoYW5nZXxjbGlja3xjb21wb3NpdGlvbig/OmVuZHxzdGFydHx1cGRhdGUpfGRibGNsaWNrfGVycm9yfGZvY3VzKD86aW58b3V0KT98a2V5KD86ZG93bnx1cCl8bG9hZHxtb3VzZSg/OmRvd258ZW50ZXJ8bGVhdmV8bW92ZXxvdXR8b3Zlcnx1cCl8cmVzZXR8cmVzaXplfHNjcm9sbHxzZWxlY3R8c2xvdGNoYW5nZXxzdWJtaXR8dW5sb2FkfHdoZWVsKSIsImphdmFzY3JpcHQiKSksUHJpc20ubGFuZ3VhZ2VzLmpzPVByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0OwohZnVuY3Rpb24oZSl7dmFyIHQ9IlxcYig/OkJBU0h8QkFTSE9QVFN8QkFTSF9BTElBU0VTfEJBU0hfQVJHQ3xCQVNIX0FSR1Z8QkFTSF9DTURTfEJBU0hfQ09NUExFVElPTl9DT01QQVRfRElSfEJBU0hfTElORU5PfEJBU0hfUkVNQVRDSHxCQVNIX1NPVVJDRXxCQVNIX1ZFUlNJTkZPfEJBU0hfVkVSU0lPTnxDT0xPUlRFUk18Q09MVU1OU3xDT01QX1dPUkRCUkVBS1N8REJVU19TRVNTSU9OX0JVU19BRERSRVNTfERFRkFVTFRTX1BBVEh8REVTS1RPUF9TRVNTSU9OfERJUlNUQUNLfERJU1BMQVl8RVVJRHxHRE1TRVNTSU9OfEdETV9MQU5HfEdOT01FX0tFWVJJTkdfQ09OVFJPTHxHTk9NRV9LRVlSSU5HX1BJRHxHUEdfQUdFTlRfSU5GT3xHUk9VUFN8SElTVENPTlRST0x8SElTVEZJTEV8SElTVEZJTEVTSVpFfEhJU1RTSVpFfEhPTUV8SE9TVE5BTUV8SE9TVFRZUEV8SUZTfElOU1RBTkNFfEpPQnxMQU5HfExBTkdVQUdFfExDX0FERFJFU1N8TENfQUxMfExDX0lERU5USUZJQ0FUSU9OfExDX01FQVNVUkVNRU5UfExDX01PTkVUQVJZfExDX05BTUV8TENfTlVNRVJJQ3xMQ19QQVBFUnxMQ19URUxFUEhPTkV8TENfVElNRXxMRVNTQ0xPU0V8TEVTU09QRU58TElORVN8TE9HTkFNRXxMU19DT0xPUlN8TUFDSFRZUEV8TUFJTENIRUNLfE1BTkRBVE9SWV9QQVRIfE5PX0FUX0JSSURHRXxPTERQV0R8T1BURVJSfE9QVElORHxPUkJJVF9TT0NLRVRESVJ8T1NUWVBFfFBBUEVSU0laRXxQQVRIfFBJUEVTVEFUVVN8UFBJRHxQUzF8UFMyfFBTM3xQUzR8UFdEfFJBTkRPTXxSRVBMWXxTRUNPTkRTfFNFTElOVVhfSU5JVHxTRVNTSU9OfFNFU1NJT05UWVBFfFNFU1NJT05fTUFOQUdFUnxTSEVMTHxTSEVMTE9QVFN8U0hMVkx8U1NIX0FVVEhfU09DS3xURVJNfFVJRHxVUFNUQVJUX0VWRU5UU3xVUFNUQVJUX0lOU1RBTkNFfFVQU1RBUlRfSk9CfFVQU1RBUlRfU0VTU0lPTnxVU0VSfFdJTkRPV0lEfFhBVVRIT1JJVFl8WERHX0NPTkZJR19ESVJTfFhER19DVVJSRU5UX0RFU0tUT1B8WERHX0RBVEFfRElSU3xYREdfR1JFRVRFUl9EQVRBX0RJUnxYREdfTUVOVV9QUkVGSVh8WERHX1JVTlRJTUVfRElSfFhER19TRUFUfFhER19TRUFUX1BBVEh8WERHX1NFU1NJT05fREVTS1RPUHxYREdfU0VTU0lPTl9JRHxYREdfU0VTU0lPTl9QQVRIfFhER19TRVNTSU9OX1RZUEV8WERHX1ZUTlJ8WE1PRElGSUVSUylcXGIiLGE9e3BhdHRlcm46LyheKFsiJ10/KVx3K1wyKVsgXHRdK1xTLiovLGxvb2tiZWhpbmQ6ITAsYWxpYXM6InB1bmN0dWF0aW9uIixpbnNpZGU6bnVsbH0sbj17YmFzaDphLGVudmlyb25tZW50OntwYXR0ZXJuOlJlZ0V4cCgiXFwkIit0KSxhbGlhczoiY29uc3RhbnQifSx2YXJpYWJsZTpbe3BhdHRlcm46L1wkP1woXChbXHNcU10rP1wpXCkvLGdyZWVkeTohMCxpbnNpZGU6e3ZhcmlhYmxlOlt7cGF0dGVybjovKF5cJFwoXChbXHNcU10rKVwpXCkvLGxvb2tiZWhpbmQ6ITB9LC9eXCRcKFwoL10sbnVtYmVyOi9cYjB4W1xkQS1GYS1mXStcYnwoPzpcYlxkKyg/OlwuXGQqKT98XEJcLlxkKykoPzpbRWVdLT9cZCspPy8sb3BlcmF0b3I6Ly0tfFwrXCt8XCpcKj0/fDw8PT98Pj49P3wmJnxcfFx8fFs9IStcLSovJTw+XiZ8XT0/fFs/fjpdLyxwdW5jdHVhdGlvbjovXChcKD98XClcKT98LHw7L319LHtwYXR0ZXJuOi9cJFwoKD86XChbXildK1wpfFteKCldKStcKXxgW15gXStgLyxncmVlZHk6ITAsaW5zaWRlOnt2YXJpYWJsZTovXlwkXCh8XmB8XCkkfGAkL319LHtwYXR0ZXJuOi9cJFx7W159XStcfS8sZ3JlZWR5OiEwLGluc2lkZTp7b3BlcmF0b3I6LzpbLT0/K10/fFshXC9dfCMjP3wlJT98XF5cXj98LCw/LyxwdW5jdHVhdGlvbjovW1xbXF1dLyxlbnZpcm9ubWVudDp7cGF0dGVybjpSZWdFeHAoIihcXHspIit0KSxsb29rYmVoaW5kOiEwLGFsaWFzOiJjb25zdGFudCJ9fX0sL1wkKD86XHcrfFsjPyohQCRdKS9dLGVudGl0eTovXFwoPzpbYWJjZUVmbnJ0dlxcIl18Tz9bMC03XXsxLDN9fFVbMC05YS1mQS1GXXs4fXx1WzAtOWEtZkEtRl17NH18eFswLTlhLWZBLUZdezEsMn0pL307ZS5sYW5ndWFnZXMuYmFzaD17c2hlYmFuZzp7cGF0dGVybjovXiMhXHMqXC8uKi8sYWxpYXM6ImltcG9ydGFudCJ9LGNvbW1lbnQ6e3BhdHRlcm46LyhefFteIntcXCRdKSMuKi8sbG9va2JlaGluZDohMH0sImZ1bmN0aW9uLW5hbWUiOlt7cGF0dGVybjovKFxiZnVuY3Rpb25ccyspW1x3LV0rKD89KD86XHMqXCg/OlxzKlwpKT9ccypceykvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6ImZ1bmN0aW9uIn0se3BhdHRlcm46L1xiW1x3LV0rKD89XHMqXChccypcKVxzKlx7KS8sYWxpYXM6ImZ1bmN0aW9uIn1dLCJmb3Itb3Itc2VsZWN0Ijp7cGF0dGVybjovKFxiKD86Zm9yfHNlbGVjdClccyspXHcrKD89XHMraW5ccykvLGFsaWFzOiJ2YXJpYWJsZSIsbG9va2JlaGluZDohMH0sImFzc2lnbi1sZWZ0Ijp7cGF0dGVybjovKF58W1xzO3wmXXxbPD5dXCgpXHcrKD86XC5cdyspKig/PVwrPz0pLyxpbnNpZGU6e2Vudmlyb25tZW50OntwYXR0ZXJuOlJlZ0V4cCgiKF58W1xcczt8Jl18Wzw+XVxcKCkiK3QpLGxvb2tiZWhpbmQ6ITAsYWxpYXM6ImNvbnN0YW50In19LGFsaWFzOiJ2YXJpYWJsZSIsbG9va2JlaGluZDohMH0scGFyYW1ldGVyOntwYXR0ZXJuOi8oXnxccyktezEsMn0oPzpcdys6WystXT8pP1x3Kyg/OlwuXHcrKSooPz1bPVxzXXwkKS8sYWxpYXM6InZhcmlhYmxlIixsb29rYmVoaW5kOiEwfSxzdHJpbmc6W3twYXR0ZXJuOi8oKD86XnxbXjxdKTw8LT9ccyopKFx3Kylcc1tcc1xTXSo/KD86XHI/XG58XHIpXDIvLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwLGluc2lkZTpufSx7cGF0dGVybjovKCg/Ol58W148XSk8PC0/XHMqKShbIiddKShcdyspXDJcc1tcc1xTXSo/KD86XHI/XG58XHIpXDMvLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwLGluc2lkZTp7YmFzaDphfX0se3BhdHRlcm46LyhefFteXFxdKD86XFxcXCkqKSIoPzpcXFtcc1xTXXxcJFwoW14pXStcKXxcJCg/IVwoKXxgW15gXStgfFteIlxcYCRdKSoiLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6bn0se3BhdHRlcm46LyhefFteJFxcXSknW14nXSonLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0se3BhdHRlcm46L1wkJyg/OlteJ1xcXXxcXFtcc1xTXSkqJy8sZ3JlZWR5OiEwLGluc2lkZTp7ZW50aXR5Om4uZW50aXR5fX1dLGVudmlyb25tZW50OntwYXR0ZXJuOlJlZ0V4cCgiXFwkPyIrdCksYWxpYXM6ImNvbnN0YW50In0sdmFyaWFibGU6bi52YXJpYWJsZSxmdW5jdGlvbjp7cGF0dGVybjovKF58W1xzO3wmXXxbPD5dXCgpKD86YWRkfGFwcm9wb3N8YXB0fGFwdC1jYWNoZXxhcHQtZ2V0fGFwdGl0dWRlfGFzcGVsbHxhdXRvbXlzcWxiYWNrdXB8YXdrfGJhc2VuYW1lfGJhc2h8YmN8YmNvbnNvbGV8Ymd8YnppcDJ8Y2FsfGNhcmdvfGNhdHxjZmRpc2t8Y2hncnB8Y2hrY29uZmlnfGNobW9kfGNob3dufGNocm9vdHxja3N1bXxjbGVhcnxjbXB8Y29sdW1ufGNvbW18Y29tcG9zZXJ8Y3B8Y3Jvbnxjcm9udGFifGNzcGxpdHxjdXJsfGN1dHxkYXRlfGRjfGRkfGRkcmVzY3VlfGRlYm9vdHN0cmFwfGRmfGRpZmZ8ZGlmZjN8ZGlnfGRpcnxkaXJjb2xvcnN8ZGlybmFtZXxkaXJzfGRtZXNnfGRvY2tlcnxkb2NrZXItY29tcG9zZXxkdXxlZ3JlcHxlamVjdHxlbnZ8ZXRodG9vbHxleHBhbmR8ZXhwZWN0fGV4cHJ8ZmRmb3JtYXR8ZmRpc2t8Zmd8ZmdyZXB8ZmlsZXxmaW5kfGZtdHxmb2xkfGZvcm1hdHxmcmVlfGZzY2t8ZnRwfGZ1c2VyfGdhd2t8Z2l0fGdwYXJ0ZWR8Z3JlcHxncm91cGFkZHxncm91cGRlbHxncm91cG1vZHxncm91cHN8Z3J1Yi1ta2NvbmZpZ3xnemlwfGhhbHR8aGVhZHxoZ3xoaXN0b3J5fGhvc3R8aG9zdG5hbWV8aHRvcHxpY29udnxpZHxpZmNvbmZpZ3xpZmRvd258aWZ1cHxpbXBvcnR8aW5zdGFsbHxpcHxqYXZhfGpvYnN8am9pbnxraWxsfGtpbGxhbGx8bGVzc3xsaW5rfGxufGxvY2F0ZXxsb2duYW1lfGxvZ3JvdGF0ZXxsb29rfGxwY3xscHJ8bHByaW50fGxwcmludGR8bHByaW50cXxscHJtfGxzfGxzb2Z8bHlueHxtYWtlfG1hbnxtY3xtZGFkbXxta2NvbmZpZ3xta2Rpcnxta2UyZnN8bWtmaWZvfG1rZnN8bWtpc29mc3xta25vZHxta3N3YXB8bW12fG1vcmV8bW9zdHxtb3VudHxtdG9vbHN8bXRyfG11dHR8bXZ8bmFub3xuY3xuZXRzdGF0fG5pY2V8bmx8bm9kZXxub2h1cHxub3RpZnktc2VuZHxucG18bnNsb29rdXB8b3B8b3BlbnxwYXJ0ZWR8cGFzc3dkfHBhc3RlfHBhdGhjaGt8cGluZ3xwa2lsbHxwbnBtfHBvZG1hbnxwb2RtYW4tY29tcG9zZXxwb3BkfHByfHByaW50Y2FwfHByaW50ZW52fHBzfHB1c2hkfHB2fHF1b3RhfHF1b3RhY2hlY2t8cXVvdGFjdGx8cmFtfHJhcnxyY3B8cmVib290fHJlbXN5bmN8cmVuYW1lfHJlbmljZXxyZXZ8cm18cm1kaXJ8cnBtfHJzeW5jfHNjcHxzY3JlZW58c2RpZmZ8c2VkfHNlbmRtYWlsfHNlcXxzZXJ2aWNlfHNmdHB8c2h8c2hlbGxjaGVja3xzaHVmfHNodXRkb3dufHNsZWVwfHNsb2NhdGV8c29ydHxzcGxpdHxzc2h8c3RhdHxzdHJhY2V8c3V8c3Vkb3xzdW18c3VzcGVuZHxzd2Fwb258c3luY3xzeXNjdGx8dGFjfHRhaWx8dGFyfHRlZXx0aW1lfHRpbWVvdXR8dG9wfHRvdWNofHRyfHRyYWNlcm91dGV8dHNvcnR8dHR5fHVtb3VudHx1bmFtZXx1bmV4cGFuZHx1bmlxfHVuaXRzfHVucmFyfHVuc2hhcnx1bnppcHx1cGRhdGUtZ3J1Ynx1cHRpbWV8dXNlcmFkZHx1c2VyZGVsfHVzZXJtb2R8dXNlcnN8dXVkZWNvZGV8dXVlbmNvZGV8dnx2Y3BrZ3x2ZGlyfHZpfHZpbXx2aXJzaHx2bXN0YXR8d2FpdHx3YXRjaHx3Y3x3Z2V0fHdoZXJlaXN8d2hpY2h8d2hvfHdob2FtaXx3cml0ZXx4YXJnc3x4ZGctb3Blbnx5YXJufHllc3x6ZW5pdHl8emlwfHpzaHx6eXBwZXIpKD89JHxbKVxzO3wmXSkvLGxvb2tiZWhpbmQ6ITB9LGtleXdvcmQ6e3BhdHRlcm46LyhefFtcczt8Jl18Wzw+XVwoKSg/OmNhc2V8ZG98ZG9uZXxlbGlmfGVsc2V8ZXNhY3xmaXxmb3J8ZnVuY3Rpb258aWZ8aW58c2VsZWN0fHRoZW58dW50aWx8d2hpbGUpKD89JHxbKVxzO3wmXSkvLGxvb2tiZWhpbmQ6ITB9LGJ1aWx0aW46e3BhdHRlcm46LyhefFtcczt8Jl18Wzw+XVwoKSg/OlwufDp8YWxpYXN8YmluZHxicmVha3xidWlsdGlufGNhbGxlcnxjZHxjb21tYW5kfGNvbnRpbnVlfGRlY2xhcmV8ZWNob3xlbmFibGV8ZXZhbHxleGVjfGV4aXR8ZXhwb3J0fGdldG9wdHN8aGFzaHxoZWxwfGxldHxsb2NhbHxsb2dvdXR8bWFwZmlsZXxwcmludGZ8cHdkfHJlYWR8cmVhZGFycmF5fHJlYWRvbmx5fHJldHVybnxzZXR8c2hpZnR8c2hvcHR8c291cmNlfHRlc3R8dGltZXN8dHJhcHx0eXBlfHR5cGVzZXR8dWxpbWl0fHVtYXNrfHVuYWxpYXN8dW5zZXQpKD89JHxbKVxzO3wmXSkvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6ImNsYXNzLW5hbWUifSxib29sZWFuOntwYXR0ZXJuOi8oXnxbXHM7fCZdfFs8Pl1cKCkoPzpmYWxzZXx0cnVlKSg/PSR8Wylcczt8Jl0pLyxsb29rYmVoaW5kOiEwfSwiZmlsZS1kZXNjcmlwdG9yIjp7cGF0dGVybjovXEImXGRcYi8sYWxpYXM6ImltcG9ydGFudCJ9LG9wZXJhdG9yOntwYXR0ZXJuOi9cZD88Pnw+XHx8XCs9fD1bPX5dP3whPT98PDxbPC1dP3xbJlxkXT8+PnxcZFs8Pl0mP3xbPD5dWyY9XT98Jls+Jl0/fFx8WyZ8XT8vLGluc2lkZTp7ImZpbGUtZGVzY3JpcHRvciI6e3BhdHRlcm46L15cZC8sYWxpYXM6ImltcG9ydGFudCJ9fX0scHVuY3R1YXRpb246L1wkP1woXCg/fFwpXCk/fFwuXC58W3t9W1xdO1xcXS8sbnVtYmVyOntwYXR0ZXJuOi8oXnxccykoPzpbMS05XVxkKnwwKSg/OlsuLF1cZCspP1xiLyxsb29rYmVoaW5kOiEwfX0sYS5pbnNpZGU9ZS5sYW5ndWFnZXMuYmFzaDtmb3IodmFyIHM9WyJjb21tZW50IiwiZnVuY3Rpb24tbmFtZSIsImZvci1vci1zZWxlY3QiLCJhc3NpZ24tbGVmdCIsInBhcmFtZXRlciIsInN0cmluZyIsImVudmlyb25tZW50IiwiZnVuY3Rpb24iLCJrZXl3b3JkIiwiYnVpbHRpbiIsImJvb2xlYW4iLCJmaWxlLWRlc2NyaXB0b3IiLCJvcGVyYXRvciIsInB1bmN0dWF0aW9uIiwibnVtYmVyIl0sbz1uLnZhcmlhYmxlWzFdLmluc2lkZSxpPTA7aTxzLmxlbmd0aDtpKyspb1tzW2ldXT1lLmxhbmd1YWdlcy5iYXNoW3NbaV1dO2UubGFuZ3VhZ2VzLnNoPWUubGFuZ3VhZ2VzLmJhc2gsZS5sYW5ndWFnZXMuc2hlbGw9ZS5sYW5ndWFnZXMuYmFzaH0oUHJpc20pOwpQcmlzbS5sYW5ndWFnZXMuanNvbj17cHJvcGVydHk6e3BhdHRlcm46LyhefFteXFxdKSIoPzpcXC58W15cXCJcclxuXSkqIig/PVxzKjopLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0sc3RyaW5nOntwYXR0ZXJuOi8oXnxbXlxcXSkiKD86XFwufFteXFwiXHJcbl0pKiIoPyFccyo6KS8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LGNvbW1lbnQ6e3BhdHRlcm46L1wvXC8uKnxcL1wqW1xzXFNdKj8oPzpcKlwvfCQpLyxncmVlZHk6ITB9LG51bWJlcjovLT9cYlxkKyg/OlwuXGQrKT8oPzplWystXT9cZCspP1xiL2kscHVuY3R1YXRpb246L1t7fVtcXSxdLyxvcGVyYXRvcjovOi8sYm9vbGVhbjovXGIoPzpmYWxzZXx0cnVlKVxiLyxudWxsOntwYXR0ZXJuOi9cYm51bGxcYi8sYWxpYXM6ImtleXdvcmQifX0sUHJpc20ubGFuZ3VhZ2VzLndlYm1hbmlmZXN0PVByaXNtLmxhbmd1YWdlcy5qc29uOwo=";
    
    const DOCUMENT = `<!DOCTYPE html>
    <html>
        <title>Configure Server</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        ${HEAD}
        <script>${HIGHLIGHT_SCRIPT}</script>
        <body>
        TODO: Config setup page
        </body>
    </html>`;
    
    app.get('/', async (req: Request, res: Response) => {
      res.send(DOCUMENT);
    });

    // Only 127.0.0.1 can access this server.
    // Don't allow access from another host.
    app.listen(port, '127.0.0.1', () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Configure server : http://127.0.0.1:${port}/`);
    });
    
}