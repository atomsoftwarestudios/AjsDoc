/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajs.templating {

    "use strict";

    export class Template {

        protected _name: string;
        public get name(): string { return this._name; }

        protected _template: Document;
        public get template(): Document { return this._template; }

        protected _visualComponents: IVisualComponentCollection;
        public get visualComponents(): IVisualComponentCollection { return this._visualComponents; }

        public constructor(name: string, html: string) {
            this._name = name;
            this._template = document.implementation.createHTMLDocument(name);
            this._template.body.innerHTML = html;
            this._visualComponents = this._getVisualComponents();
        }

        protected _getVisualComponents(): IVisualComponentCollection {
            let components: IVisualComponentCollection = {};

            this._walkHTMLTree(this._template.body, (element: HTMLElement) => {

                if (element.nodeName === "COMPONENT" || element.hasAttribute("component")) {

                    let name: string;

                    if (element.nodeName === "COMPONENT" && element.hasAttribute("name")) {
                        name = element.getAttribute("name").toUpperCase();
                    } else {
                        if (element.hasAttribute("component")) {
                            name = element.getAttribute("component").toUpperCase();
                        } else {
                            throw new MissingVisualComponentNameException();
                        }
                    }

                    components[name] = {
                        component: element,
                        template: this,
                        templateName: this._name,
                        children: this._getChildrenComponents(element),
                        placeholders: this._getChildrenPlaceholders(element)
                    };
                }

            });

            return components;
        }

        protected _walkHTMLTree(root: HTMLElement, elementCallback: Function): void {
            if (root instanceof HTMLElement) {
                for (let i: number = 0; i < root.children.length; i++) {
                    if (root.children.item(i).nodeType === Node.ELEMENT_NODE) {
                        elementCallback(root.children.item(i));
                        this._walkHTMLTree(root.children.item(i) as HTMLElement, elementCallback);
                    }
                }
            }
        }

        protected _getChildrenComponents(element: HTMLElement, childrenComponents?: IVisualComponentChildren): IVisualComponentChildren {

            childrenComponents = childrenComponents || {};

            for (let i: number = 0; i < element.childNodes.length; i++) {
                let node: Node = element.childNodes.item(i);
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (ajs.utils.HTMLTags.indexOf(node.nodeName.toUpperCase()) === -1) {
                        let nameAttribute: string = null;
                        if (node.nodeName === "COMPONENT" && (node as HTMLElement).hasAttribute("name")) {
                            nameAttribute = (node as HTMLElement).getAttribute("name");
                        }
                        let id: string = null;
                        if ((node as HTMLElement).hasAttribute("id")) {
                            id = (node as HTMLElement).attributes.getNamedItem("id").nodeValue;
                        }
                        if (id !== null) {
                            childrenComponents[id] = {
                                tagName: node.nodeName.toUpperCase(),
                                nameAttribute: nameAttribute
                            }
                        }
                    } else
                        if ((node as HTMLElement).hasAttribute("component") && (node as HTMLElement).hasAttribute("id")) {
                            let id: string = (node as HTMLElement).getAttribute("id");
                            let cn: string = (node as HTMLElement).getAttribute("component");
                            childrenComponents[id] = {
                                tagName: cn,
                                nameAttribute: null
                            }
                        } else {
                            this._getChildrenComponents(node as HTMLElement, childrenComponents);
                        }
                }
            }

            return childrenComponents;

        }

        protected _isChildrenComponent() {

        }

        protected _getChildrenPlaceholders(
            element: HTMLElement,
            placeholders?: IVisualComponentPlaceholderCollection
        ): IVisualComponentPlaceholderCollection {

            placeholders = placeholders || {};

            for (let i: number = 0; i < element.childNodes.length; i++) {
                let node: Node = element.childNodes.item(i);
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if ((node as HTMLElement).hasAttribute("placeholder")) {
                        let id: string = (node as HTMLElement).attributes.getNamedItem("placeholder").nodeValue;
                        placeholders[id] = {
                            placeholder: node as HTMLElement
                        };
                        if (node.hasChildNodes()) {
                            throw new PlaceholdersCantHaveChildrenNodesException();
                        }
                    } else {
                        this._getChildrenPlaceholders(node as HTMLElement, placeholders);
                    }
                }
            }

            return placeholders;

        }


    }

}