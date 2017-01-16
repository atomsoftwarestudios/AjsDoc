var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ajs;
(function (ajs) {
    var loader;
    (function (loader) {
        "use strict";
        /** Fired if web workers technology is not supported by the browser */
        var WebWorkersNotSupportedException = (function (_super) {
            __extends(WebWorkersNotSupportedException, _super);
            function WebWorkersNotSupportedException() {
                _super.apply(this, arguments);
            }
            return WebWorkersNotSupportedException;
        }(Error));
        loader.WebWorkersNotSupportedException = WebWorkersNotSupportedException;
        /** Fired if web workers technology is not supported by the browser */
        var LocalStorageNotSupportedException = (function (_super) {
            __extends(LocalStorageNotSupportedException, _super);
            function LocalStorageNotSupportedException() {
                _super.apply(this, arguments);
            }
            return LocalStorageNotSupportedException;
        }(Error));
        loader.LocalStorageNotSupportedException = LocalStorageNotSupportedException;
        /** Item key prefix to be used when storing resources in the local storage */
        var ajsLoaderPrefix = "AJSLOADER.";
        /** Worker instance */
        var worker;
        /** Resources managed by the loader */
        var resources = [
            "/index.html",
            "/js/ajs.boot.config.js",
            "/js/ajs.js",
            "/favicon.ico"
        ];
        // *************************************************************************************************
        // worker functions
        // *************************************************************************************************
        /**
         * Parse the JSONified string to Date
         * @param key
         * @param value
         */
        function resourceInfoJSONReviver(key, value) {
            if (key === "lastModified") {
                return new Date(value);
            }
            return value;
        }
        loader.resourceInfoJSONReviver = resourceInfoJSONReviver;
        /** Worker message processing */
        onmessage = function (e) {
            console.log(e.data);
            if (e.data.hasOwnProperty("msg")) {
                switch (e.data.msg) {
                    default:
                }
            }
        };
        // *************************************************************************************************
        // not-in-worker functions
        // *************************************************************************************************
        /**
         * Worker message processing
         * @param e Message received from worker
         */
        function onWorkerMessage(e) {
            if (e.data.hasOwnProperty("msg")) {
                switch (e.data.msg) {
                    case "addScript":
                        var script = document.createElement("script");
                        script.setAttribute("type", "text/javascript");
                        script.textContent = e.data.data;
                        document.head.appendChild(script);
                        break;
                    case "getCachedResource":
                        break;
                    case "setCachedResource":
                        break;
                }
            }
        }
        loader.onWorkerMessage = onWorkerMessage;
        ;
        /** Create worker and bind message processing to it */
        function initWorker() {
            try {
                if (Worker) {
                    // throw exception if local storage is not supported
                    if (localStorage === undefined) {
                        throw new LocalStorageNotSupportedException();
                    }
                    // create worker
                    worker = new Worker("/ajsloader.js");
                    // bind worker event listener
                    worker.onmessage = onWorkerMessage;
                    // pre-cache all resources if necessary
                    for (var i = 0; i < resources.length; i++) {
                        worker.postMessage({ msg: "loadResource", data: resources[i] });
                    }
                }
                else {
                    throw new WebWorkersNotSupportedException();
                }
            }
            catch (e) {
                document.write("You are using old, unsupported browser or required features are disabled!");
                console.log(e);
            }
        }
        loader.initWorker = initWorker;
        ;
        // *************************************************************************************************
        // worker checker (check if we are window or worker)
        // *************************************************************************************************
        // if we are not in worker, init worker and precache resources
        try {
            if (Window) {
                ajs.loader.initWorker();
            }
        }
        catch (e) {
            ;
        }
    })(loader = ajs.loader || (ajs.loader = {}));
})(ajs || (ajs = {}));
//# sourceMappingURL=ajsloader.js.map