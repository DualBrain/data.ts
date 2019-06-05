/**
 * HTML文档操作帮助函数
*/
namespace DOM {

    /**
     * Query meta tag content value by name
     * 
     * @param allowQueryParent 当当前的文档之中不存在目标meta标签的时候，
     *    如果当前文档为iframe文档，则是否允许继续往父节点的文档做查询？
     *    默认为False，即只在当前文档环境之中进行查询操作
     * @param Default 查询失败的时候所返回来的默认值
    */
    export function metaValue(name: string, Default: string = null, allowQueryParent: boolean = false): string {
        var selector: string = `meta[name~="${name}"]`;
        var meta: Element = document.querySelector(selector);
        var getContent = function () {
            if (meta) {
                var content: string = meta.getAttribute("content");
                return content ? content : Default;
            } else {
                if (TypeScript.logging.outputWarning) {
                    console.warn(`${selector} not found in current context!`);
                }

                return Default;
            }
        };

        if (!meta && allowQueryParent) {
            meta = parent.window
                .document
                .querySelector(selector);
        }

        return getContent();
    }

    /**
     * File download helper
     * 
     * @param name The file save name for download operation
     * @param uri The file object to download
    */
    export function download(name: string, uri: string): void {
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(DataExtensions.uriToBlob(uri), name);
        } else {
            downloadImpl(name, uri);
        }
    }

    function downloadImpl(name: string, uri: string): void {
        var saveLink: HTMLAnchorElement = <any>$ts('<a>');
        var downloadSupported = 'download' in saveLink;

        if (downloadSupported) {
            saveLink.download = name;
            saveLink.style.display = 'none';
            document.body.appendChild(saveLink);

            try {
                var blob = DataExtensions.uriToBlob(uri);
                var url = URL.createObjectURL(blob);

                saveLink.href = url;
                saveLink.onclick = function () {
                    requestAnimationFrame(function () {
                        URL.revokeObjectURL(url);
                    })
                };
            } catch (e) {
                if (TypeScript.logging.outputWarning) {
                    console.warn('This browser does not support object URLs. Falling back to string URL.');
                }

                saveLink.href = uri;
            }

            saveLink.click();
            document.body.removeChild(saveLink);
        } else {
            window.open(uri, '_temp', 'menubar=no,toolbar=no,status=no');
        }
    }

    /**
     * 尝试获取当前的浏览器的大小
    */
    export function clientSize(): number[] {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

        return [x, y];
    }

    /**
     * return array containing references to selected option elements
    */
    export function getSelectedOptions(sel: HTMLSelectElement) {
        var opts: HTMLOptionElement[] = []
        var opt: HTMLOptionElement;

        // loop through options in select list
        for (var i = 0, len = sel.options.length; i < len; i++) {
            opt = sel.options[i];

            // check if selected
            if (opt.selected) {
                // add to array of option elements to return from this function
                opts.push(opt);
            }
        }

        return opts;
    }

    /**
     * 向指定id编号的div添加select标签的组件
     * 
     * @param containerID 这个编号不带有``#``前缀，这个容器可以是一个空白的div或者目标``<select>``标签对象的编号，
     *                    如果目标容器是一个``<select>``标签的时候，则要求selectName和className都必须要是空值
     * @param items 这个数组应该是一个``[title => value]``的键值对列表
    */
    export function AddSelectOptions(
        items: MapTuple<string, string>[],
        containerID: string,
        selectName: string = null,
        className: string = null) {

        var options = From(items)
            .Select(item => `<option value="${item.value}">${item.key}</option>`)
            .JoinBy("\n");
        var html: string;

        if (isNullOrUndefined(selectName) && isNullOrUndefined(className)) {
            // 是一个<select>标签
            html = options;
        } else {
            html = `
                <select class="${className}" multiple name="${selectName}">
                    ${options}
                </select>`;
        }

        (<HTMLElement>$ts(`#${containerID}`)).innerHTML = html;
    }

    /**
     * @param headers 表格之中所显示的表头列表，也可以通过这个参数来对表格之中
     *   所需要进行显示的列进行筛选以及显示控制：
     *    + 如果这个参数为默认的空值，则说明显示所有的列数据
     *    + 如果这个参数不为空值，则会显示这个参数所指定的列出来
     *    + 可以通过``map [propertyName => display title]``来控制表头的标题输出
    */
    export function CreateHTMLTableNode<T extends {}>(
        rows: T[] | IEnumerator<T>,
        headers: string[] | IEnumerator<string> | IEnumerator<MapTuple<string, string>> | MapTuple<string, string>[] = null,
        attrs: Internal.TypeScriptArgument = null): HTMLTableElement {

        var thead: HTMLElement = $ts("<thead>");
        var tbody: HTMLElement = $ts("<tbody>");
        var fields: MapTuple<string, string>[];

        if (Array.isArray(rows)) {
            fields = headerMaps(headers || $ts(Object.keys(rows[0])));
        } else {
            fields = headerMaps(headers || $ts(Object.keys(rows.First)));
        }

        var rowHTML = function (r: object) {
            var tr: HTMLElement = $ts("<tr>");
            // 在这里将会控制列的显示
            fields.forEach(m => tr.appendChild($ts("<td>").display(r[m.key])));
            return tr;
        }

        if (Array.isArray(rows)) {
            rows.forEach(r => tbody.appendChild(rowHTML(r)));
        } else {
            rows.ForEach(r => tbody.appendChild(rowHTML(r)));
        }

        fields.forEach(r => thead.appendChild($ts("<th>").display(r.value)));

        return <HTMLTableElement>$ts("<table>", attrs)
            .asExtends
            .append(thead)
            .append(tbody)
            .HTMLElement;
    }

    /**
     * 向给定编号的div对象之中添加一个表格对象
     * 
     * @param headers 表头
     * @param div 新生成的table将会被添加在这个div之中，应该是一个带有``#``符号的节点id查询表达式
     * @param attrs ``<table>``的属性值，包括id，class等
    */
    export function AddHTMLTable<T extends {}>(
        rows: T[] | IEnumerator<T>,
        div: string,
        headers: string[] | IEnumerator<string> | IEnumerator<MapTuple<string, string>> | MapTuple<string, string>[] = null,
        attrs: Internal.TypeScriptArgument = null) {

        var id = `${div}-table`;

        if (attrs) {
            if (!attrs.id) { attrs.id = id; }
        } else {
            attrs = { id: id };
        }

        $ts(div).appendChild(CreateHTMLTableNode(rows, headers, attrs));
    }

    /**
     * @param headers ``[propertyName => displayTitle]``
    */
    function headerMaps(headers: string[] | IEnumerator<string> | IEnumerator<MapTuple<string, string>> | MapTuple<string, string>[]): MapTuple<string, string>[] {
        var type = TypeInfo.typeof(headers);

        if (type.IsArrayOf("string")) {
            return From(<string[]>headers)
                .Select(h => new MapTuple<string, string>(h, h))
                .ToArray();
        } else if (type.IsArrayOf(TypeExtensions.DictionaryMap)) {
            return <MapTuple<string, string>[]>headers;
        } else if (type.IsEnumerator && typeof (<IEnumerator<any>>headers).First == "string") {
            return (<IEnumerator<string>>headers)
                .Select(h => new MapTuple<string, string>(h, h))
                .ToArray();
        } else if (type.IsEnumerator && TypeInfo.getClass((<IEnumerator<any>>headers).First) == TypeExtensions.DictionaryMap) {
            return (<IEnumerator<MapTuple<string, string>>>headers).ToArray();
        } else {
            throw `Invalid sequence type: ${type.class}`;
        }
    }   
}