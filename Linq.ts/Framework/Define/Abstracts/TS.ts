﻿namespace Internal {

    /**
     * The internal typescript symbol
    */
    export interface TypeScript {

        /**
         * 这个属性控制着这个框架的调试器的输出行为
         * 
         * + 如果这个参数为``debug``，则会在浏览器的console上面输出各种和调试相关的信息
         * + 如果这个参数为``production``，则不会在浏览器的console上面输出调试相关的信息，你会得到一个比较干净的console输出窗口
        */
        mode: Modes;

        <T extends HTMLElement>(nodes: NodeListOf<T>): DOMEnumerator<T>;
        <T extends HTMLElement & Node & ChildNode>(nodes: NodeListOf<T>): DOMEnumerator<T>;

        /**
         * Create a new node or query a node by its id.
         * (创建或者查询节点)
         * 
         * @param query + ``#xxxx`` query a node element by id
         *              + ``<xxx>`` create a new node element by a given tag name 
         *              + ``<svg:xx>`` create a svg node.
        */
        <T extends HTMLElement>(query: string, args?: TypeScriptArgument): IHTMLElement;

        /**
         * Query by class name or tag name
         * 
         * @param query A selector expression
        */
        select: IquerySelector;

        /**
         * @param div 应该是带有``#``的id查询表达式
        */
        appendTable<T extends {}>(
            rows: T[] | IEnumerator<T>,
            div: string,
            headers?: string[] | IEnumerator<string> | IEnumerator<MapTuple<string, string>> | MapTuple<string, string>[],
            attrs?: Internal.TypeScriptArgument
        ): void;

        /**
         * 将目标序列转换为一个表格HTML节点元素
        */
        evalHTML<T extends {}>(
            rows: T[] | IEnumerator<T>,
            headers?: string[] | IEnumerator<string> | IEnumerator<MapTuple<string, string>> | MapTuple<string, string>[],
            attrs?: Internal.TypeScriptArgument): HTMLTableElement;

        <T>(array: T[]): IEnumerator<T>;

        /**
         * query meta tag by name attribute value for its content.
         * 
         * @param meta The meta tag name, it should be start with a ``@`` symbol.
        */
        (meta: string): string;

        /**
         * Handles event on document load ready.
         * 
         * @param ready The handler of the target event.
        */
        (ready: () => void): void;

        /**
         * 动态的导入脚本
         * 
         * @param jsURL 需要进行动态导入的脚本的文件链接路径
         * @param onErrorResumeNext 当加载出错的时候，是否继续执行下一个脚本？如果为false，则出错之后会抛出错误停止执行
        */
        imports(jsURL: string | string[], callback?: () => void, onErrorResumeNext?: boolean, echo?: boolean): void;

        /**
         * 将函数注入给定id编号的iframe之中
         * 
         * @param iframe ``#xxx``编号查询表达式
         * @param fun 目标函数，请注意，这个函数应该是尽量不引用依赖其他对象的
        */
        inject(iframe: string, fun: (Delegate.Func<any> | string)[] | string | Delegate.Func<any>): void;

        /**
         * 动态加载脚本
         * 
         * @param script 脚本的文本内容
         * @param lzw_decompress 目标脚本内容是否是lzw压缩过后的内容，如果是的话，则这个函数会进行lzw解压缩
        */
        eval(script: string, lzw_decompress?: boolean, callback?: () => void): void;

        /**
         * @param id HTML元素的id，可以同时兼容编号和带``#``的编号
        */
        loadJSON(id: string): any;
        /**
         * @param id HTML元素的id，可以同时兼容编号和带``#``的编号
         * @param htmlText 主要是针对``<pre>``标签之中的VB.NET代码
        */
        text(id: string, htmlText?: boolean): string;

        /**
         * isNullOrUndefined
        */
        isNullOrEmpty(obj: any): boolean;
        /**
         * 判断目标集合是否为空
        */
        isNullOrEmpty<T>(list: T[] | IEnumerator<T>): boolean;
        /**
         * Linq函数链的起始
        */
        from<T>(seq: T[]): IEnumerator<T>;

        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
         * 
         * @param url 目标数据源，这个参数也支持meta标签的查询语法
        */
        post<T>(url: string, data: object | FormData,
            callback?: ((response: IMsg<T>) => void),
            options?: {
                sendContentType?: boolean
            }): void;
        /**
         * 请注意：这个函数只会接受来自后端的json返回，如果不是json格式，则可能会解析出错
         * 
         * @param url 目标数据源，这个参数也支持meta标签查询语法
        */
        get<T>(url: string, callback?: ((response: IMsg<T>) => void)): void;
        getText(url: string, callback: (text: string) => void): void;

        /**
         * File upload helper
         * 
         * @param url 目标数据源，这个参数也支持meta标签查询语法
        */
        upload<T>(url: string, file: File, callback?: ((response: IMsg<T>) => void)): void;

        /**
         * Get the url location of current window page.
         * (获取当前的页面的URL字符串解析模型，这个只读属性可以接受一个变量名参数来获取得到对应的GET参数值)
        */
        readonly location: IURL;

        /**
         * 解析一个给定的URL字符串
        */
        parseURL(url: string): TypeScript.URL;
        /**
         * 从当前页面跳转到给定的链接页面
         * 
         * @param url 链接，也支持meta查询表达式，如果是以``#``起始的文档节点id表达式，则会在文档内跳转到目标节点位置
         * @param currentFrame 如果当前页面为iframe的话，则只跳转iframe的显示，当这个参数为真的话；
         *      如果这个参数为false，则从父页面进行跳转
        */
        goto(url: string, opt?: GotoOptions): Delegate.Sub;

        /**
         * 针对csv数据序列的操作帮助对象
        */
        csv: IcsvHelperApi;

        /**
         * 解析的结果为``filename.ext``的完整文件名格式
         * 
         * @param path Full name
        */
        parseFileName(path: string): string;
        /**
         * 得到不带有拓展名的文件名部分的字符串
         * 
         * @param path Full name
        */
        baseName(path: string): string;
        /**
         * 得到不带小数点的文件拓展名字符串
         * 
         * @param path Full name
        */
        extensionName(path: string): string;

        /**
         * 注意：这个函数是大小写无关的
         * 
         * @param path 文件路径字符串 
         * @param ext 不带有小数点的文件拓展名字符串
        */
        withExtensionName(path: string, ext: string): boolean;
        doubleRange(x: number[] | IEnumerator<number>): data.NumericRange;
    }
}