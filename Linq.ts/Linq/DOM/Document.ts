﻿/**
 * HTML文档操作帮助函数
*/
namespace Linq.DOM {

    /**
     * 向指定id编号的div添加select标签的组件
    */
    export function AddSelectOptions(
        items: Map<string, string>[],
        div: string,
        selectName: string,
        className: string = "") {

        var options = From(items)
            .Select(item => `<option value="${item.value}">${item.key}</option>`)
            .JoinBy("\n");
        var html: string = `
            <select class="${className}" multiple name="${selectName}">
                ${options}
            </select>`;

        (<HTMLElement>$ts(`#${div}`)).innerHTML = html;
    }

    /**
     * 向给定编号的div对象之中添加一个表格对象
     * 
     * @param headers 表头
     * @param div 新生成的table将会被添加在这个div之中
     * @param attrs ``<table>``的属性值，包括id，class等
    */
    export function AddHTMLTable(
        rows: object[],
        headers: string[] | IEnumerator<string> | IEnumerator<Map<string, string>> | Map<string, string>[],
        div: string,
        attrs: node = null) {

        var thead: HTMLElement = $ts("<thead>");
        var tbody: HTMLElement = $ts("<tbody>");
        var table: HTMLElement = $ts("<table>");

        if (attrs) {
            if (attrs.id) {
                table.id = attrs.id;
            }
            if (!IsNullOrEmpty(attrs.classList)) {
                attrs.classList.forEach(c => table.classList.add(c));
            }
            if (!IsNullOrEmpty(attrs.attrs)) {
                From(attrs.attrs)
                    .Where(a => a.name != "id" && a.name != "class")
                    .ForEach(a => {
                        table.setAttribute(a.name, a.value);
                    });
            }
        }

        headers = headerMaps(headers);

        table.appendChild(thead);
        table.appendChild(tbody);

        (<HTMLDivElement>$ts(div)).appendChild(table);
    }

    function headerMaps(headers: string[] | IEnumerator<string> | IEnumerator<Map<string, string>> | Map<string, string>[]): Map<string, string>[] {
        var type = TypeInfo.typeof(headers);

        if (type.IsArrayOf("string")) {
            return From(<string[]>headers)
                .Select(h => new Map<string, string>(h, h))
                .ToArray();
        } else if (type.IsArrayOf("Map")) {
            return <Map<string, string>[]>headers;
        } else if (type.IsEnumerator && typeof headers[0] == "string") {
            return (<IEnumerator<string>>headers)
                .Select(h => new Map<string, string>(h, h))
                .ToArray();
        } else if (type.IsEnumerator && TypeInfo.typeof(headers[0]).class == "Map") {
            // return (IEnumerator<Map<string, string>>headers).ToArray();
            var maps: IEnumerator<Map<string, string>> = <any>headers;
            return maps.ToArray();
        } else {
            throw `Invalid sequence type: ${type.class}`;
        }
    }

    /**
     * Execute a given function when the document is ready.
     * 
     * @param fn A function that without any parameters
    */
    export function ready(fn: () => void) {
        if (typeof fn !== 'function') {
            // Sanity check
            return;
        }

        if (document.readyState === 'complete') {
            // If document is already loaded, run method
            return fn();
        } else {
            // Otherwise, wait until document is loaded
            document.addEventListener('DOMContentLoaded', fn, false);
        }
    }

    /**
     * 向一个给定的HTML元素或者HTML元素的集合之中的对象添加给定的事件
     * 
     * @param el HTML节点元素或者节点元素的集合
     * @param type 事件的名称字符串
     * @param fn 对事件名称所指定的事件进行处理的工作函数，这个工作函数应该具备有一个事件对象作为函数参数
    */
    export function addEvent(el: any, type: string, fn: (event: Event) => void): void {
        if (document.addEventListener) {
            if (el && (el.nodeName) || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        } else {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, () => {
                    return fn.call(el, window.event);
                });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            }
        }
    }
}