(function(define){var __define; typeof define === "function" && (__define=define,define=null);
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"kn5Vl":[function(require,module,exports) {
var __filename = "node_modules/.pnpm/@ffmpeg+core-mt@0.12.6/node_modules/@ffmpeg/core-mt/dist/umd/ffmpeg-core.js";
var process = require("1d806780e70f13b3");
var __dirname = "node_modules/.pnpm/@ffmpeg+core-mt@0.12.6/node_modules/@ffmpeg/core-mt/dist/umd";
var global = arguments[3];
var Buffer = require("40f9dbbda9c9a76c").Buffer;
self.createFFmpegCore = (()=>{
    var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
    return function(createFFmpegCore = {}) {
        var Module = typeof createFFmpegCore != "undefined" ? createFFmpegCore : {};
        var readyPromiseResolve, readyPromiseReject;
        Module["ready"] = new Promise((resolve, reject)=>{
            readyPromiseResolve = resolve;
            readyPromiseReject = reject;
        });
        const NULL = 0;
        const SIZE_I32 = Uint32Array.BYTES_PER_ELEMENT;
        const DEFAULT_ARGS = [
            "./ffmpeg",
            "-nostdin",
            "-y"
        ];
        Module["NULL"] = NULL;
        Module["SIZE_I32"] = SIZE_I32;
        Module["DEFAULT_ARGS"] = DEFAULT_ARGS;
        Module["ret"] = -1;
        Module["timeout"] = -1;
        Module["logger"] = ()=>{};
        Module["progress"] = ()=>{};
        function stringToPtr(str) {
            const len = Module["lengthBytesUTF8"](str) + 1;
            const ptr = Module["_malloc"](len);
            Module["stringToUTF8"](str, ptr, len);
            return ptr;
        }
        function stringsToPtr(strs) {
            const len = strs.length;
            const ptr = Module["_malloc"](len * SIZE_I32);
            for(let i = 0; i < len; i++)Module["setValue"](ptr + SIZE_I32 * i, stringToPtr(strs[i]), "i32");
            return ptr;
        }
        function print(message) {
            Module["logger"]({
                type: "stdout",
                message: message
            });
        }
        function printErr(message) {
            if (!message.startsWith("Aborted(native code called abort())")) Module["logger"]({
                type: "stderr",
                message: message
            });
        }
        function exec(..._args) {
            const args = [
                ...Module["DEFAULT_ARGS"],
                ..._args
            ];
            try {
                Module["_ffmpeg"](args.length, stringsToPtr(args));
            } catch (e) {
                if (!e.message.startsWith("Aborted")) throw e;
            }
            return Module["ret"];
        }
        function setLogger(logger) {
            Module["logger"] = logger;
        }
        function setTimeout(timeout) {
            Module["timeout"] = timeout;
        }
        function setProgress(handler) {
            Module["progress"] = handler;
        }
        function receiveProgress(progress, time) {
            Module["progress"]({
                progress: progress,
                time: time
            });
        }
        function reset() {
            Module["ret"] = -1;
            Module["timeout"] = -1;
        }
        function _locateFile(path, prefix) {
            const mainScriptUrlOrBlob = Module["mainScriptUrlOrBlob"];
            if (mainScriptUrlOrBlob) {
                const { wasmURL: wasmURL, workerURL: workerURL } = JSON.parse(atob(mainScriptUrlOrBlob.slice(mainScriptUrlOrBlob.lastIndexOf("#") + 1)));
                if (path.endsWith(".wasm")) return wasmURL;
                if (path.endsWith(".worker.js")) return workerURL;
            }
            return prefix + path;
        }
        Module["stringToPtr"] = stringToPtr;
        Module["stringsToPtr"] = stringsToPtr;
        Module["print"] = print;
        Module["printErr"] = printErr;
        Module["locateFile"] = _locateFile;
        Module["exec"] = exec;
        Module["setLogger"] = setLogger;
        Module["setTimeout"] = setTimeout;
        Module["setProgress"] = setProgress;
        Module["reset"] = reset;
        Module["receiveProgress"] = receiveProgress;
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow)=>{
            throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;
        var scriptDirectory = "";
        function locateFile(path) {
            if (Module["locateFile"]) return Module["locateFile"](path, scriptDirectory);
            return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        if (ENVIRONMENT_IS_NODE) {
            var fs = require("6e76a9b9ef8b9b6d");
            var nodePath = require("ed985e3e1462ddea");
            if (ENVIRONMENT_IS_WORKER) scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
            else scriptDirectory = __dirname + "/";
            read_ = (filename, binary)=>{
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                return fs.readFileSync(filename, binary ? undefined : "utf8");
            };
            readBinary = (filename)=>{
                var ret = read_(filename, true);
                if (!ret.buffer) ret = new Uint8Array(ret);
                return ret;
            };
            readAsync = (filename, onload, onerror, binary = true)=>{
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                fs.readFile(filename, binary ? undefined : "utf8", (err, data)=>{
                    if (err) onerror(err);
                    else onload(binary ? data.buffer : data);
                });
            };
            if (!Module["thisProgram"] && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
            arguments_ = process.argv.slice(2);
            quit_ = (status, toThrow)=>{
                process.exitCode = status;
                throw toThrow;
            };
            Module["inspect"] = ()=>"[Emscripten Module object]";
            let nodeWorkerThreads;
            try {
                nodeWorkerThreads = require("efd28b655b02b81e");
            } catch (e) {
                console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?');
                throw e;
            }
            global.Worker = nodeWorkerThreads.Worker;
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
            else if (typeof document != "undefined" && document.currentScript) scriptDirectory = document.currentScript.src;
            if (_scriptDir) scriptDirectory = _scriptDir;
            if (scriptDirectory.indexOf("blob:") !== 0) scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
            else scriptDirectory = "";
            if (!ENVIRONMENT_IS_NODE) {
                read_ = (url)=>{
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.send(null);
                    return xhr.responseText;
                };
                if (ENVIRONMENT_IS_WORKER) readBinary = (url)=>{
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response);
                };
                readAsync = (url, onload, onerror)=>{
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, true);
                    xhr.responseType = "arraybuffer";
                    xhr.onload = ()=>{
                        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                            onload(xhr.response);
                            return;
                        }
                        onerror();
                    };
                    xhr.onerror = onerror;
                    xhr.send(null);
                };
            }
            setWindowTitle = (title)=>document.title = title;
        }
        if (ENVIRONMENT_IS_NODE) {
            if (typeof performance == "undefined") global.performance = require("ee5d039605439b10").performance;
        }
        var defaultPrint = console.log.bind(console);
        var defaultPrintErr = console.error.bind(console);
        if (ENVIRONMENT_IS_NODE) {
            defaultPrint = (...args)=>fs.writeSync(1, args.join(" ") + "\n");
            defaultPrintErr = (...args)=>fs.writeSync(2, args.join(" ") + "\n");
        }
        var out = Module["print"] || defaultPrint;
        var err = Module["printErr"] || defaultPrintErr;
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        var noExitRuntime = Module["noExitRuntime"] || true;
        if (typeof WebAssembly != "object") abort("no native wasm support detected");
        var wasmMemory;
        var wasmModule;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
            if (!condition) abort(text);
        }
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        function updateMemoryViews() {
            var b = wasmMemory.buffer;
            Module["HEAP8"] = HEAP8 = new Int8Array(b);
            Module["HEAP16"] = HEAP16 = new Int16Array(b);
            Module["HEAP32"] = HEAP32 = new Int32Array(b);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
            Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
            Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
        }
        var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 1073741824;
        assert(INITIAL_MEMORY >= 65536, "INITIAL_MEMORY should be larger than STACK_SIZE, was " + INITIAL_MEMORY + "! (STACK_SIZE=" + 65536 + ")");
        if (ENVIRONMENT_IS_PTHREAD) wasmMemory = Module["wasmMemory"];
        else if (Module["wasmMemory"]) wasmMemory = Module["wasmMemory"];
        else {
            wasmMemory = new WebAssembly.Memory({
                "initial": INITIAL_MEMORY / 65536,
                "maximum": INITIAL_MEMORY / 65536,
                "shared": true
            });
            if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
                err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");
                if (ENVIRONMENT_IS_NODE) err("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)");
                throw Error("bad memory");
            }
        }
        updateMemoryViews();
        INITIAL_MEMORY = wasmMemory.buffer.byteLength;
        var wasmTable;
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeKeepaliveCounter = 0;
        function keepRuntimeAlive() {
            return noExitRuntime || runtimeKeepaliveCounter > 0;
        }
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [
                    Module["preRun"]
                ];
                while(Module["preRun"].length)addOnPreRun(Module["preRun"].shift());
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
            runtimeInitialized = true;
            if (ENVIRONMENT_IS_PTHREAD) return;
            if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
            FS.ignorePermissions = false;
            TTY.init();
            SOCKFS.root = FS.mount(SOCKFS, {}, null);
            callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
            if (ENVIRONMENT_IS_PTHREAD) return;
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [
                    Module["postRun"]
                ];
                while(Module["postRun"].length)addOnPostRun(Module["postRun"].shift());
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
            __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
            return id;
        }
        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
        }
        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                }
            }
        }
        function abort(what) {
            if (Module["onAbort"]) Module["onAbort"](what);
            what = "Aborted(" + what + ")";
            err(what);
            ABORT = true;
            EXITSTATUS = 1;
            what += ". Build with -sASSERTIONS for more info.";
            var e = new WebAssembly.RuntimeError(what);
            readyPromiseReject(e);
            throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
            return filename.startsWith(dataURIPrefix);
        }
        function isFileURI(filename) {
            return filename.startsWith("file://");
        }
        var wasmBinaryFile;
        wasmBinaryFile = "ffmpeg-core.wasm";
        if (!isDataURI(wasmBinaryFile)) wasmBinaryFile = locateFile(wasmBinaryFile);
        function getBinary(file) {
            try {
                if (file == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
                if (readBinary) return readBinary(file);
                throw "both async and sync fetching of the wasm failed";
            } catch (err) {
                abort(err);
            }
        }
        function getBinaryPromise(binaryFile) {
            if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                if (typeof fetch == "function" && !isFileURI(binaryFile)) return fetch(binaryFile, {
                    credentials: "same-origin"
                }).then((response)=>{
                    if (!response["ok"]) throw "failed to load wasm binary file at '" + binaryFile + "'";
                    return response["arrayBuffer"]();
                }).catch(()=>getBinary(binaryFile));
                else {
                    if (readAsync) return new Promise((resolve, reject)=>{
                        readAsync(binaryFile, (response)=>resolve(new Uint8Array(response)), reject);
                    });
                }
            }
            return Promise.resolve().then(()=>getBinary(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
            return getBinaryPromise(binaryFile).then((binary)=>{
                return WebAssembly.instantiate(binary, imports);
            }).then((instance)=>{
                return instance;
            }).then(receiver, (reason)=>{
                err("failed to asynchronously prepare wasm: " + reason);
                abort(reason);
            });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
            if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") return fetch(binaryFile, {
                credentials: "same-origin"
            }).then((response)=>{
                var result = WebAssembly.instantiateStreaming(response, imports);
                return result.then(callback, function(reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(binaryFile, imports, callback);
                });
            });
            else return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function createWasm() {
            var info = {
                "a": wasmImports
            };
            function receiveInstance(instance, module1) {
                var exports = instance.exports;
                Module["asm"] = exports;
                registerTLSInit(Module["asm"]["Na"]);
                wasmTable = Module["asm"]["Ia"];
                addOnInit(Module["asm"]["Ga"]);
                wasmModule = module1;
                removeRunDependency("wasm-instantiate");
                return exports;
            }
            addRunDependency("wasm-instantiate");
            function receiveInstantiationResult(result) {
                receiveInstance(result["instance"], result["module"]);
            }
            if (Module["instantiateWasm"]) try {
                return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
                err("Module.instantiateWasm callback failed with error: " + e);
                readyPromiseReject(e);
            }
            instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
            return {};
        }
        var ASM_CONSTS = {
            6065576: ($0)=>{
                Module.ret = $0;
            }
        };
        function send_progress(progress, time) {
            Module.receiveProgress(progress, time);
        }
        function is_timeout(diff) {
            if (Module.timeout === -1) return 0;
            else return Module.timeout <= diff;
        }
        function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = `Program terminated with exit(${status})`;
            this.status = status;
        }
        function terminateWorker(worker) {
            worker.terminate();
            worker.onmessage = (e)=>{};
        }
        function killThread(pthread_ptr) {
            var worker = PThread.pthreads[pthread_ptr];
            delete PThread.pthreads[pthread_ptr];
            terminateWorker(worker);
            __emscripten_thread_free_data(pthread_ptr);
            PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
            worker.pthread_ptr = 0;
        }
        function cancelThread(pthread_ptr) {
            var worker = PThread.pthreads[pthread_ptr];
            worker.postMessage({
                "cmd": "cancel"
            });
        }
        function cleanupThread(pthread_ptr) {
            var worker = PThread.pthreads[pthread_ptr];
            assert(worker);
            PThread.returnWorkerToPool(worker);
        }
        function zeroMemory(address, size) {
            HEAPU8.fill(0, address, address + size);
            return address;
        }
        function spawnThread(threadParams) {
            var worker = PThread.getNewWorker();
            if (!worker) return 6;
            PThread.runningWorkers.push(worker);
            PThread.pthreads[threadParams.pthread_ptr] = worker;
            worker.pthread_ptr = threadParams.pthread_ptr;
            var msg = {
                "cmd": "run",
                "start_routine": threadParams.startRoutine,
                "arg": threadParams.arg,
                "pthread_ptr": threadParams.pthread_ptr
            };
            if (ENVIRONMENT_IS_NODE) worker.unref();
            worker.postMessage(msg, threadParams.transferList);
            return 0;
        }
        var PATH = {
            isAbs: (path)=>path.charAt(0) === "/",
            splitPath: (filename)=>{
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: (parts, allowAboveRoot)=>{
                var up = 0;
                for(var i = parts.length - 1; i >= 0; i--){
                    var last = parts[i];
                    if (last === ".") parts.splice(i, 1);
                    else if (last === "..") {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }
                if (allowAboveRoot) for(; up; up--)parts.unshift("..");
                return parts;
            },
            normalize: (path)=>{
                var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(path.split("/").filter((p)=>!!p), !isAbsolute).join("/");
                if (!path && !isAbsolute) path = ".";
                if (path && trailingSlash) path += "/";
                return (isAbsolute ? "/" : "") + path;
            },
            dirname: (path)=>{
                var result = PATH.splitPath(path), root = result[0], dir = result[1];
                if (!root && !dir) return ".";
                if (dir) dir = dir.substr(0, dir.length - 1);
                return root + dir;
            },
            basename: (path)=>{
                if (path === "/") return "/";
                path = PATH.normalize(path);
                path = path.replace(/\/$/, "");
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1);
            },
            join: function() {
                var paths = Array.prototype.slice.call(arguments);
                return PATH.normalize(paths.join("/"));
            },
            join2: (l, r)=>{
                return PATH.normalize(l + "/" + r);
            }
        };
        function initRandomFill() {
            if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") return (view)=>(view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), view);
            else if (ENVIRONMENT_IS_NODE) try {
                var crypto_module = require("a68bb0f5f93de131");
                var randomFillSync = crypto_module["randomFillSync"];
                if (randomFillSync) return (view)=>crypto_module["randomFillSync"](view);
                var randomBytes = crypto_module["randomBytes"];
                return (view)=>(view.set(randomBytes(view.byteLength)), view);
            } catch (e) {}
            abort("initRandomDevice");
        }
        function randomFill(view) {
            return (randomFill = initRandomFill())(view);
        }
        var PATH_FS = {
            resolve: function() {
                var resolvedPath = "", resolvedAbsolute = false;
                for(var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--){
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path != "string") throw new TypeError("Arguments to path.resolve must be strings");
                    else if (!path) return "";
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = PATH.isAbs(path);
                }
                resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p)=>!!p), !resolvedAbsolute).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            },
            relative: (from, to)=>{
                from = PATH_FS.resolve(from).substr(1);
                to = PATH_FS.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for(; start < arr.length; start++){
                        if (arr[start] !== "") break;
                    }
                    var end = arr.length - 1;
                    for(; end >= 0; end--){
                        if (arr[end] !== "") break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for(var i = 0; i < length; i++)if (fromParts[i] !== toParts[i]) {
                    samePartsLength = i;
                    break;
                }
                var outputParts = [];
                for(var i = samePartsLength; i < fromParts.length; i++)outputParts.push("..");
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/");
            }
        };
        function lengthBytesUTF8(str) {
            var len = 0;
            for(var i = 0; i < str.length; ++i){
                var c = str.charCodeAt(i);
                if (c <= 127) len++;
                else if (c <= 2047) len += 2;
                else if (c >= 55296 && c <= 57343) {
                    len += 4;
                    ++i;
                } else len += 3;
            }
            return len;
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for(var i = 0; i < str.length; ++i){
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = 65536 + ((u & 1023) << 10) | u1 & 1023;
                }
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    heap[outIdx++] = u;
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    heap[outIdx++] = 192 | u >> 6;
                    heap[outIdx++] = 128 | u & 63;
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    heap[outIdx++] = 224 | u >> 12;
                    heap[outIdx++] = 128 | u >> 6 & 63;
                    heap[outIdx++] = 128 | u & 63;
                } else {
                    if (outIdx + 3 >= endIdx) break;
                    heap[outIdx++] = 240 | u >> 18;
                    heap[outIdx++] = 128 | u >> 12 & 63;
                    heap[outIdx++] = 128 | u >> 6 & 63;
                    heap[outIdx++] = 128 | u & 63;
                }
            }
            heap[outIdx] = 0;
            return outIdx - startIdx;
        }
        function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        }
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
        function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            while(heapOrArray[endPtr] && !(endPtr >= endIdx))++endPtr;
            if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.buffer instanceof SharedArrayBuffer ? heapOrArray.slice(idx, endPtr) : heapOrArray.subarray(idx, endPtr));
            var str = "";
            while(idx < endPtr){
                var u0 = heapOrArray[idx++];
                if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue;
                }
                var u1 = heapOrArray[idx++] & 63;
                if ((u0 & 224) == 192) {
                    str += String.fromCharCode((u0 & 31) << 6 | u1);
                    continue;
                }
                var u2 = heapOrArray[idx++] & 63;
                if ((u0 & 240) == 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
                else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
                if (u0 < 65536) str += String.fromCharCode(u0);
                else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
                }
            }
            return str;
        }
        var TTY = {
            ttys: [],
            init: function() {},
            shutdown: function() {},
            register: function(dev, ops) {
                TTY.ttys[dev] = {
                    input: [],
                    output: [],
                    ops: ops
                };
                FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
                open: function(stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) throw new FS.ErrnoError(43);
                    stream.tty = tty;
                    stream.seekable = false;
                },
                close: function(stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                fsync: function(stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                read: function(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) throw new FS.ErrnoError(60);
                    var bytesRead = 0;
                    for(var i = 0; i < length; i++){
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) throw new FS.ErrnoError(6);
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                    }
                    if (bytesRead) stream.node.timestamp = Date.now();
                    return bytesRead;
                },
                write: function(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) throw new FS.ErrnoError(60);
                    try {
                        for(var i = 0; i < length; i++)stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (length) stream.node.timestamp = Date.now();
                    return i;
                }
            },
            default_tty_ops: {
                get_char: function(tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            var BUFSIZE = 256;
                            var buf = Buffer.alloc(BUFSIZE);
                            var bytesRead = 0;
                            try {
                                bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
                            } catch (e) {
                                if (e.toString().includes("EOF")) bytesRead = 0;
                                else throw e;
                            }
                            if (bytesRead > 0) result = buf.slice(0, bytesRead).toString("utf-8");
                            else result = null;
                        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                            result = window.prompt("Input: ");
                            if (result !== null) result += "\n";
                        } else if (typeof readline == "function") {
                            result = readline();
                            if (result !== null) result += "\n";
                        }
                        if (!result) return null;
                        tty.input = intArrayFromString(result, true);
                    }
                    return tty.input.shift();
                },
                put_char: function(tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else if (val != 0) tty.output.push(val);
                },
                fsync: function(tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                }
            },
            default_tty1_ops: {
                put_char: function(tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else if (val != 0) tty.output.push(val);
                },
                fsync: function(tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                }
            }
        };
        function alignMemory(size, alignment) {
            return Math.ceil(size / alignment) * alignment;
        }
        function mmapAlloc(size) {
            size = alignMemory(size, 65536);
            var ptr = _emscripten_builtin_memalign(65536, size);
            if (!ptr) return 0;
            return zeroMemory(ptr, size);
        }
        var MEMFS = {
            ops_table: null,
            mount: function(mount) {
                return MEMFS.createNode(null, "/", 16895, 0);
            },
            createNode: function(parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) throw new FS.ErrnoError(63);
                if (!MEMFS.ops_table) MEMFS.ops_table = {
                    dir: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            lookup: MEMFS.node_ops.lookup,
                            mknod: MEMFS.node_ops.mknod,
                            rename: MEMFS.node_ops.rename,
                            unlink: MEMFS.node_ops.unlink,
                            rmdir: MEMFS.node_ops.rmdir,
                            readdir: MEMFS.node_ops.readdir,
                            symlink: MEMFS.node_ops.symlink
                        },
                        stream: {
                            llseek: MEMFS.stream_ops.llseek
                        }
                    },
                    file: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr
                        },
                        stream: {
                            llseek: MEMFS.stream_ops.llseek,
                            read: MEMFS.stream_ops.read,
                            write: MEMFS.stream_ops.write,
                            allocate: MEMFS.stream_ops.allocate,
                            mmap: MEMFS.stream_ops.mmap,
                            msync: MEMFS.stream_ops.msync
                        }
                    },
                    link: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            readlink: MEMFS.node_ops.readlink
                        },
                        stream: {}
                    },
                    chrdev: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr
                        },
                        stream: FS.chrdev_stream_ops
                    }
                };
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null;
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node;
                    parent.timestamp = node.timestamp;
                }
                return node;
            },
            getFileDataAsTypedArray: function(node) {
                if (!node.contents) return new Uint8Array(0);
                if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents);
            },
            expandFileStorage: function(node, newCapacity) {
                var prevCapacity = node.contents ? node.contents.length : 0;
                if (prevCapacity >= newCapacity) return;
                var CAPACITY_DOUBLING_MAX = 1048576;
                newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
                if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                var oldContents = node.contents;
                node.contents = new Uint8Array(newCapacity);
                if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
            },
            resizeFileStorage: function(node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                } else {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newSize);
                    if (oldContents) node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                    node.usedBytes = newSize;
                }
            },
            node_ops: {
                getattr: function(node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) attr.size = 4096;
                    else if (FS.isFile(node.mode)) attr.size = node.usedBytes;
                    else if (FS.isLink(node.mode)) attr.size = node.link.length;
                    else attr.size = 0;
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr: function(node, attr) {
                    if (attr.mode !== undefined) node.mode = attr.mode;
                    if (attr.timestamp !== undefined) node.timestamp = attr.timestamp;
                    if (attr.size !== undefined) MEMFS.resizeFileStorage(node, attr.size);
                },
                lookup: function(parent, name) {
                    throw FS.genericErrors[44];
                },
                mknod: function(parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                },
                rename: function(old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name);
                        } catch (e) {}
                        if (new_node) {
                            for(var i in new_node.contents)throw new FS.ErrnoError(55);
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.parent.timestamp = Date.now();
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    new_dir.timestamp = old_node.parent.timestamp;
                    old_node.parent = new_dir;
                },
                unlink: function(parent, name) {
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                rmdir: function(parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for(var i in node.contents)throw new FS.ErrnoError(55);
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                readdir: function(node) {
                    var entries = [
                        ".",
                        ".."
                    ];
                    for(var key in node.contents){
                        if (!node.contents.hasOwnProperty(key)) continue;
                        entries.push(key);
                    }
                    return entries;
                },
                symlink: function(parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 41471, 0);
                    node.link = oldpath;
                    return node;
                },
                readlink: function(node) {
                    if (!FS.isLink(node.mode)) throw new FS.ErrnoError(28);
                    return node.link;
                }
            },
            stream_ops: {
                read: function(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    if (size > 8 && contents.subarray) buffer.set(contents.subarray(position, position + size), offset);
                    else for(var i = 0; i < size; i++)buffer[offset + i] = contents[position + i];
                    return size;
                },
                write: function(stream, buffer, offset, length, position, canOwn) {
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = buffer.slice(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length;
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
                    else for(var i = 0; i < length; i++)node.contents[position + i] = buffer[offset + i];
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length;
                },
                llseek: function(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) position += stream.position;
                    else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) position += stream.node.usedBytes;
                    }
                    if (position < 0) throw new FS.ErrnoError(28);
                    return position;
                },
                allocate: function(stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                },
                mmap: function(stream, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                        allocated = false;
                        ptr = contents.byteOffset;
                    } else {
                        if (position > 0 || position + length < contents.length) {
                            if (contents.subarray) contents = contents.subarray(position, position + length);
                            else contents = Array.prototype.slice.call(contents, position, position + length);
                        }
                        allocated = true;
                        ptr = mmapAlloc(length);
                        if (!ptr) throw new FS.ErrnoError(48);
                        HEAP8.set(contents, ptr);
                    }
                    return {
                        ptr: ptr,
                        allocated: allocated
                    };
                },
                msync: function(stream, buffer, offset, length, mmapFlags) {
                    MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    return 0;
                }
            }
        };
        function asyncLoad(url, onload, onerror, noRunDep) {
            var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
            readAsync(url, (arrayBuffer)=>{
                assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
                onload(new Uint8Array(arrayBuffer));
                if (dep) removeRunDependency(dep);
            }, (event)=>{
                if (onerror) onerror();
                else throw `Loading data file "${url}" failed.`;
            });
            if (dep) addRunDependency(dep);
        }
        var preloadPlugins = Module["preloadPlugins"] || [];
        function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
            if (typeof Browser != "undefined") Browser.init();
            var handled = false;
            preloadPlugins.forEach(function(plugin) {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, onerror);
                    handled = true;
                }
            });
            return handled;
        }
        function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
            var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
            var dep = getUniqueRunDependency(`cp ${fullname}`);
            function processData(byteArray) {
                function finish(byteArray) {
                    if (preFinish) preFinish();
                    if (!dontCreateFile) FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                    if (onload) onload();
                    removeRunDependency(dep);
                }
                if (FS_handledByPreloadPlugin(byteArray, fullname, finish, ()=>{
                    if (onerror) onerror();
                    removeRunDependency(dep);
                })) return;
                finish(byteArray);
            }
            addRunDependency(dep);
            if (typeof url == "string") asyncLoad(url, (byteArray)=>processData(byteArray), onerror);
            else processData(url);
        }
        function FS_modeStringToFlags(str) {
            var flagModes = {
                "r": 0,
                "r+": 2,
                "w": 577,
                "w+": 578,
                "a": 1089,
                "a+": 1090
            };
            var flags = flagModes[str];
            if (typeof flags == "undefined") throw new Error(`Unknown file open mode: ${str}`);
            return flags;
        }
        function FS_getMode(canRead, canWrite) {
            var mode = 0;
            if (canRead) mode |= 365;
            if (canWrite) mode |= 146;
            return mode;
        }
        var WORKERFS = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            reader: null,
            mount: function(mount) {
                assert(ENVIRONMENT_IS_WORKER);
                if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
                var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
                var createdParents = {};
                function ensureParent(path) {
                    var parts = path.split("/");
                    var parent = root;
                    for(var i = 0; i < parts.length - 1; i++){
                        var curr = parts.slice(0, i + 1).join("/");
                        if (!createdParents[curr]) createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
                        parent = createdParents[curr];
                    }
                    return parent;
                }
                function base(path) {
                    var parts = path.split("/");
                    return parts[parts.length - 1];
                }
                Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
                    WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
                });
                (mount.opts["blobs"] || []).forEach(function(obj) {
                    WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
                });
                (mount.opts["packages"] || []).forEach(function(pack) {
                    pack["metadata"].files.forEach(function(file) {
                        var name = file.filename.substr(1);
                        WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end));
                    });
                });
                return root;
            },
            createNode: function(parent, name, mode, dev, contents, mtime) {
                var node = FS.createNode(parent, name, mode);
                node.mode = mode;
                node.node_ops = WORKERFS.node_ops;
                node.stream_ops = WORKERFS.stream_ops;
                node.timestamp = (mtime || new Date).getTime();
                assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
                if (mode === WORKERFS.FILE_MODE) {
                    node.size = contents.size;
                    node.contents = contents;
                } else {
                    node.size = 4096;
                    node.contents = {};
                }
                if (parent) parent.contents[name] = node;
                return node;
            },
            node_ops: {
                getattr: function(node) {
                    return {
                        dev: 1,
                        ino: node.id,
                        mode: node.mode,
                        nlink: 1,
                        uid: 0,
                        gid: 0,
                        rdev: undefined,
                        size: node.size,
                        atime: new Date(node.timestamp),
                        mtime: new Date(node.timestamp),
                        ctime: new Date(node.timestamp),
                        blksize: 4096,
                        blocks: Math.ceil(node.size / 4096)
                    };
                },
                setattr: function(node, attr) {
                    if (attr.mode !== undefined) node.mode = attr.mode;
                    if (attr.timestamp !== undefined) node.timestamp = attr.timestamp;
                },
                lookup: function(parent, name) {
                    throw new FS.ErrnoError(44);
                },
                mknod: function(parent, name, mode, dev) {
                    throw new FS.ErrnoError(63);
                },
                rename: function(oldNode, newDir, newName) {
                    throw new FS.ErrnoError(63);
                },
                unlink: function(parent, name) {
                    throw new FS.ErrnoError(63);
                },
                rmdir: function(parent, name) {
                    throw new FS.ErrnoError(63);
                },
                readdir: function(node) {
                    var entries = [
                        ".",
                        ".."
                    ];
                    for(var key in node.contents){
                        if (!node.contents.hasOwnProperty(key)) continue;
                        entries.push(key);
                    }
                    return entries;
                },
                symlink: function(parent, newName, oldPath) {
                    throw new FS.ErrnoError(63);
                }
            },
            stream_ops: {
                read: function(stream, buffer, offset, length, position) {
                    if (position >= stream.node.size) return 0;
                    var chunk = stream.node.contents.slice(position, position + length);
                    var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
                    buffer.set(new Uint8Array(ab), offset);
                    return chunk.size;
                },
                write: function(stream, buffer, offset, length, position) {
                    throw new FS.ErrnoError(29);
                },
                llseek: function(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) position += stream.position;
                    else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) position += stream.node.size;
                    }
                    if (position < 0) throw new FS.ErrnoError(28);
                    return position;
                }
            }
        };
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            lookupPath: (path, opts = {})=>{
                path = PATH_FS.resolve(path);
                if (!path) return {
                    path: "",
                    node: null
                };
                var defaults = {
                    follow_mount: true,
                    recurse_count: 0
                };
                opts = Object.assign(defaults, opts);
                if (opts.recurse_count > 8) throw new FS.ErrnoError(32);
                var parts = path.split("/").filter((p)=>!!p);
                var current = FS.root;
                var current_path = "/";
                for(var i = 0; i < parts.length; i++){
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) break;
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) current = current.mounted.root;
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while(FS.isLink(current.mode)){
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {
                                recurse_count: opts.recurse_count + 1
                            });
                            current = lookup.node;
                            if (count++ > 40) throw new FS.ErrnoError(32);
                        }
                    }
                }
                return {
                    path: current_path,
                    node: current
                };
            },
            getPath: (node)=>{
                var path;
                while(true){
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
                    }
                    path = path ? `${node.name}/${path}` : node.name;
                    node = node.parent;
                }
            },
            hashName: (parentid, name)=>{
                var hash = 0;
                for(var i = 0; i < name.length; i++)hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
                return (parentid + hash >>> 0) % FS.nameTable.length;
            },
            hashAddNode: (node)=>{
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node;
            },
            hashRemoveNode: (node)=>{
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) FS.nameTable[hash] = node.name_next;
                else {
                    var current = FS.nameTable[hash];
                    while(current){
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break;
                        }
                        current = current.name_next;
                    }
                }
            },
            lookupNode: (parent, name)=>{
                var errCode = FS.mayLookup(parent);
                if (errCode) throw new FS.ErrnoError(errCode, parent);
                var hash = FS.hashName(parent.id, name);
                for(var node = FS.nameTable[hash]; node; node = node.name_next){
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) return node;
                }
                return FS.lookup(parent, name);
            },
            createNode: (parent, name, mode, rdev)=>{
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node;
            },
            destroyNode: (node)=>{
                FS.hashRemoveNode(node);
            },
            isRoot: (node)=>{
                return node === node.parent;
            },
            isMountpoint: (node)=>{
                return !!node.mounted;
            },
            isFile: (mode)=>{
                return (mode & 61440) === 32768;
            },
            isDir: (mode)=>{
                return (mode & 61440) === 16384;
            },
            isLink: (mode)=>{
                return (mode & 61440) === 40960;
            },
            isChrdev: (mode)=>{
                return (mode & 61440) === 8192;
            },
            isBlkdev: (mode)=>{
                return (mode & 61440) === 24576;
            },
            isFIFO: (mode)=>{
                return (mode & 61440) === 4096;
            },
            isSocket: (mode)=>{
                return (mode & 49152) === 49152;
            },
            flagsToPermissionString: (flag)=>{
                var perms = [
                    "r",
                    "w",
                    "rw"
                ][flag & 3];
                if (flag & 512) perms += "w";
                return perms;
            },
            nodePermissions: (node, perms)=>{
                if (FS.ignorePermissions) return 0;
                if (perms.includes("r") && !(node.mode & 292)) return 2;
                else if (perms.includes("w") && !(node.mode & 146)) return 2;
                else if (perms.includes("x") && !(node.mode & 73)) return 2;
                return 0;
            },
            mayLookup: (dir)=>{
                var errCode = FS.nodePermissions(dir, "x");
                if (errCode) return errCode;
                if (!dir.node_ops.lookup) return 2;
                return 0;
            },
            mayCreate: (dir, name)=>{
                try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                } catch (e) {}
                return FS.nodePermissions(dir, "wx");
            },
            mayDelete: (dir, name, isdir)=>{
                var node;
                try {
                    node = FS.lookupNode(dir, name);
                } catch (e) {
                    return e.errno;
                }
                var errCode = FS.nodePermissions(dir, "wx");
                if (errCode) return errCode;
                if (isdir) {
                    if (!FS.isDir(node.mode)) return 54;
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) return 10;
                } else {
                    if (FS.isDir(node.mode)) return 31;
                }
                return 0;
            },
            mayOpen: (node, flags)=>{
                if (!node) return 44;
                if (FS.isLink(node.mode)) return 32;
                else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) return 31;
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
            },
            MAX_OPEN_FDS: 4096,
            nextfd: ()=>{
                for(var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++){
                    if (!FS.streams[fd]) return fd;
                }
                throw new FS.ErrnoError(33);
            },
            getStream: (fd)=>FS.streams[fd],
            createStream: (stream, fd = -1)=>{
                if (!FS.FSStream) {
                    FS.FSStream = function() {
                        this.shared = {};
                    };
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: function() {
                                return this.node;
                            },
                            set: function(val) {
                                this.node = val;
                            }
                        },
                        isRead: {
                            get: function() {
                                return (this.flags & 2097155) !== 1;
                            }
                        },
                        isWrite: {
                            get: function() {
                                return (this.flags & 2097155) !== 0;
                            }
                        },
                        isAppend: {
                            get: function() {
                                return this.flags & 1024;
                            }
                        },
                        flags: {
                            get: function() {
                                return this.shared.flags;
                            },
                            set: function(val) {
                                this.shared.flags = val;
                            }
                        },
                        position: {
                            get: function() {
                                return this.shared.position;
                            },
                            set: function(val) {
                                this.shared.position = val;
                            }
                        }
                    });
                }
                stream = Object.assign(new FS.FSStream, stream);
                if (fd == -1) fd = FS.nextfd();
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            },
            closeStream: (fd)=>{
                FS.streams[fd] = null;
            },
            chrdev_stream_ops: {
                open: (stream)=>{
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) stream.stream_ops.open(stream);
                },
                llseek: ()=>{
                    throw new FS.ErrnoError(70);
                }
            },
            major: (dev)=>dev >> 8,
            minor: (dev)=>dev & 255,
            makedev: (ma, mi)=>ma << 8 | mi,
            registerDevice: (dev, ops)=>{
                FS.devices[dev] = {
                    stream_ops: ops
                };
            },
            getDevice: (dev)=>FS.devices[dev],
            getMounts: (mount)=>{
                var mounts = [];
                var check = [
                    mount
                ];
                while(check.length){
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts);
                }
                return mounts;
            },
            syncfs: (populate, callback)=>{
                if (typeof populate == "function") {
                    callback = populate;
                    populate = false;
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function doCallback(errCode) {
                    FS.syncFSRequests--;
                    return callback(errCode);
                }
                function done(errCode) {
                    if (errCode) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(errCode);
                        }
                        return;
                    }
                    if (++completed >= mounts.length) doCallback(null);
                }
                mounts.forEach((mount)=>{
                    if (!mount.type.syncfs) return done(null);
                    mount.type.syncfs(mount, populate, done);
                });
            },
            mount: (type, opts, mountpoint)=>{
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) throw new FS.ErrnoError(10);
                else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {
                        follow_mount: false
                    });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                    if (!FS.isDir(node.mode)) throw new FS.ErrnoError(54);
                }
                var mount = {
                    type: type,
                    opts: opts,
                    mountpoint: mountpoint,
                    mounts: []
                };
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) FS.root = mountRoot;
                else if (node) {
                    node.mounted = mount;
                    if (node.mount) node.mount.mounts.push(mount);
                }
                return mountRoot;
            },
            unmount: (mountpoint)=>{
                var lookup = FS.lookupPath(mountpoint, {
                    follow_mount: false
                });
                if (!FS.isMountpoint(lookup.node)) throw new FS.ErrnoError(28);
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((hash)=>{
                    var current = FS.nameTable[hash];
                    while(current){
                        var next = current.name_next;
                        if (mounts.includes(current.mount)) FS.destroyNode(current);
                        current = next;
                    }
                });
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                node.mount.mounts.splice(idx, 1);
            },
            lookup: (parent, name)=>{
                return parent.node_ops.lookup(parent, name);
            },
            mknod: (path, mode, dev)=>{
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === "." || name === "..") throw new FS.ErrnoError(28);
                var errCode = FS.mayCreate(parent, name);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.mknod) throw new FS.ErrnoError(63);
                return parent.node_ops.mknod(parent, name, mode, dev);
            },
            create: (path, mode)=>{
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir: (path, mode)=>{
                mode = mode !== undefined ? mode : 511;
                mode &= 1023;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree: (path, mode)=>{
                var dirs = path.split("/");
                var d = "";
                for(var i = 0; i < dirs.length; ++i){
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                        FS.mkdir(d, mode);
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
                }
            },
            mkdev: (path, mode, dev)=>{
                if (typeof dev == "undefined") {
                    dev = mode;
                    mode = 438;
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev);
            },
            symlink: (oldpath, newpath)=>{
                if (!PATH_FS.resolve(oldpath)) throw new FS.ErrnoError(44);
                var lookup = FS.lookupPath(newpath, {
                    parent: true
                });
                var parent = lookup.node;
                if (!parent) throw new FS.ErrnoError(44);
                var newname = PATH.basename(newpath);
                var errCode = FS.mayCreate(parent, newname);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.symlink) throw new FS.ErrnoError(63);
                return parent.node_ops.symlink(parent, newname, oldpath);
            },
            rename: (old_path, new_path)=>{
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                lookup = FS.lookupPath(old_path, {
                    parent: true
                });
                old_dir = lookup.node;
                lookup = FS.lookupPath(new_path, {
                    parent: true
                });
                new_dir = lookup.node;
                if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                if (old_dir.mount !== new_dir.mount) throw new FS.ErrnoError(75);
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH_FS.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") throw new FS.ErrnoError(28);
                relative = PATH_FS.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") throw new FS.ErrnoError(55);
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (old_node === new_node) return;
                var isdir = FS.isDir(old_node.mode);
                var errCode = FS.mayDelete(old_dir, old_name, isdir);
                if (errCode) throw new FS.ErrnoError(errCode);
                errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!old_dir.node_ops.rename) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) throw new FS.ErrnoError(10);
                if (new_dir !== old_dir) {
                    errCode = FS.nodePermissions(old_dir, "w");
                    if (errCode) throw new FS.ErrnoError(errCode);
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                } catch (e) {
                    throw e;
                } finally{
                    FS.hashAddNode(old_node);
                }
            },
            rmdir: (path)=>{
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, true);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.rmdir) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
            },
            readdir: (path)=>{
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                if (!node.node_ops.readdir) throw new FS.ErrnoError(54);
                return node.node_ops.readdir(node);
            },
            unlink: (path)=>{
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                if (!parent) throw new FS.ErrnoError(44);
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, false);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.unlink) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
            },
            readlink: (path)=>{
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) throw new FS.ErrnoError(44);
                if (!link.node_ops.readlink) throw new FS.ErrnoError(28);
                return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
            },
            stat: (path, dontFollow)=>{
                var lookup = FS.lookupPath(path, {
                    follow: !dontFollow
                });
                var node = lookup.node;
                if (!node) throw new FS.ErrnoError(44);
                if (!node.node_ops.getattr) throw new FS.ErrnoError(63);
                return node.node_ops.getattr(node);
            },
            lstat: (path)=>{
                return FS.stat(path, true);
            },
            chmod: (path, mode, dontFollow)=>{
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                node.node_ops.setattr(node, {
                    mode: mode & 4095 | node.mode & -4096,
                    timestamp: Date.now()
                });
            },
            lchmod: (path, mode)=>{
                FS.chmod(path, mode, true);
            },
            fchmod: (fd, mode)=>{
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                FS.chmod(stream.node, mode);
            },
            chown: (path, uid, gid, dontFollow)=>{
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                node.node_ops.setattr(node, {
                    timestamp: Date.now()
                });
            },
            lchown: (path, uid, gid)=>{
                FS.chown(path, uid, gid, true);
            },
            fchown: (fd, uid, gid)=>{
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                FS.chown(stream.node, uid, gid);
            },
            truncate: (path, len)=>{
                if (len < 0) throw new FS.ErrnoError(28);
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: true
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                if (FS.isDir(node.mode)) throw new FS.ErrnoError(31);
                if (!FS.isFile(node.mode)) throw new FS.ErrnoError(28);
                var errCode = FS.nodePermissions(node, "w");
                if (errCode) throw new FS.ErrnoError(errCode);
                node.node_ops.setattr(node, {
                    size: len,
                    timestamp: Date.now()
                });
            },
            ftruncate: (fd, len)=>{
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(28);
                FS.truncate(stream.node, len);
            },
            utime: (path, atime, mtime)=>{
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                node.node_ops.setattr(node, {
                    timestamp: Math.max(atime, mtime)
                });
            },
            open: (path, flags, mode)=>{
                if (path === "") throw new FS.ErrnoError(44);
                flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                mode = typeof mode == "undefined" ? 438 : mode;
                if (flags & 64) mode = mode & 4095 | 32768;
                else mode = 0;
                var node;
                if (typeof path == "object") node = path;
                else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {
                            follow: !(flags & 131072)
                        });
                        node = lookup.node;
                    } catch (e) {}
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) throw new FS.ErrnoError(20);
                    } else {
                        node = FS.mknod(path, mode, 0);
                        created = true;
                    }
                }
                if (!node) throw new FS.ErrnoError(44);
                if (FS.isChrdev(node.mode)) flags &= -513;
                if (flags & 65536 && !FS.isDir(node.mode)) throw new FS.ErrnoError(54);
                if (!created) {
                    var errCode = FS.mayOpen(node, flags);
                    if (errCode) throw new FS.ErrnoError(errCode);
                }
                if (flags & 512 && !created) FS.truncate(node, 0);
                flags &= -131713;
                var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false
                });
                if (stream.stream_ops.open) stream.stream_ops.open(stream);
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) FS.readFiles[path] = 1;
                }
                return stream;
            },
            close: (stream)=>{
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (stream.getdents) stream.getdents = null;
                try {
                    if (stream.stream_ops.close) stream.stream_ops.close(stream);
                } catch (e) {
                    throw e;
                } finally{
                    FS.closeStream(stream.fd);
                }
                stream.fd = null;
            },
            isClosed: (stream)=>{
                return stream.fd === null;
            },
            llseek: (stream, offset, whence)=>{
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (!stream.seekable || !stream.stream_ops.llseek) throw new FS.ErrnoError(70);
                if (whence != 0 && whence != 1 && whence != 2) throw new FS.ErrnoError(28);
                stream.position = stream.stream_ops.llseek(stream, offset, whence);
                stream.ungotten = [];
                return stream.position;
            },
            read: (stream, buffer, offset, length, position)=>{
                if (length < 0 || position < 0) throw new FS.ErrnoError(28);
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(8);
                if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
                if (!stream.stream_ops.read) throw new FS.ErrnoError(28);
                var seeking = typeof position != "undefined";
                if (!seeking) position = stream.position;
                else if (!stream.seekable) throw new FS.ErrnoError(70);
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead;
            },
            write: (stream, buffer, offset, length, position, canOwn)=>{
                if (length < 0 || position < 0) throw new FS.ErrnoError(28);
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
                if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
                if (!stream.stream_ops.write) throw new FS.ErrnoError(28);
                if (stream.seekable && stream.flags & 1024) FS.llseek(stream, 0, 2);
                var seeking = typeof position != "undefined";
                if (!seeking) position = stream.position;
                else if (!stream.seekable) throw new FS.ErrnoError(70);
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking) stream.position += bytesWritten;
                return bytesWritten;
            },
            allocate: (stream, offset, length)=>{
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (offset < 0 || length <= 0) throw new FS.ErrnoError(28);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
                if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) throw new FS.ErrnoError(43);
                if (!stream.stream_ops.allocate) throw new FS.ErrnoError(138);
                stream.stream_ops.allocate(stream, offset, length);
            },
            mmap: (stream, length, position, prot, flags)=>{
                if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
                if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(2);
                if (!stream.stream_ops.mmap) throw new FS.ErrnoError(43);
                return stream.stream_ops.mmap(stream, length, position, prot, flags);
            },
            msync: (stream, buffer, offset, length, mmapFlags)=>{
                if (!stream.stream_ops.msync) return 0;
                return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
            },
            munmap: (stream)=>0,
            ioctl: (stream, cmd, arg)=>{
                if (!stream.stream_ops.ioctl) throw new FS.ErrnoError(59);
                return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile: (path, opts = {})=>{
                opts.flags = opts.flags || 0;
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") throw new Error(`Invalid encoding type "${opts.encoding}"`);
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") ret = UTF8ArrayToString(buf, 0);
                else if (opts.encoding === "binary") ret = buf;
                FS.close(stream);
                return ret;
            },
            writeFile: (path, data, opts = {})=>{
                opts.flags = opts.flags || 577;
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data == "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                } else if (ArrayBuffer.isView(data)) FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                else throw new Error("Unsupported data type");
                FS.close(stream);
            },
            cwd: ()=>FS.currentPath,
            chdir: (path)=>{
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                if (lookup.node === null) throw new FS.ErrnoError(44);
                if (!FS.isDir(lookup.node.mode)) throw new FS.ErrnoError(54);
                var errCode = FS.nodePermissions(lookup.node, "x");
                if (errCode) throw new FS.ErrnoError(errCode);
                FS.currentPath = lookup.path;
            },
            createDefaultDirectories: ()=>{
                FS.mkdir("/tmp");
                FS.mkdir("/home");
                FS.mkdir("/home/web_user");
            },
            createDefaultDevices: ()=>{
                FS.mkdir("/dev");
                FS.registerDevice(FS.makedev(1, 3), {
                    read: ()=>0,
                    write: (stream, buffer, offset, length, pos)=>length
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                var randomBuffer = new Uint8Array(1024), randomLeft = 0;
                var randomByte = ()=>{
                    if (randomLeft === 0) randomLeft = randomFill(randomBuffer).byteLength;
                    return randomBuffer[--randomLeft];
                };
                FS.createDevice("/dev", "random", randomByte);
                FS.createDevice("/dev", "urandom", randomByte);
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories: ()=>{
                FS.mkdir("/proc");
                var proc_self = FS.mkdir("/proc/self");
                FS.mkdir("/proc/self/fd");
                FS.mount({
                    mount: ()=>{
                        var node = FS.createNode(proc_self, "fd", 16895, 73);
                        node.node_ops = {
                            lookup: (parent, name)=>{
                                var fd = +name;
                                var stream = FS.getStream(fd);
                                if (!stream) throw new FS.ErrnoError(8);
                                var ret = {
                                    parent: null,
                                    mount: {
                                        mountpoint: "fake"
                                    },
                                    node_ops: {
                                        readlink: ()=>stream.path
                                    }
                                };
                                ret.parent = ret;
                                return ret;
                            }
                        };
                        return node;
                    }
                }, {}, "/proc/self/fd");
            },
            createStandardStreams: ()=>{
                if (Module["stdin"]) FS.createDevice("/dev", "stdin", Module["stdin"]);
                else FS.symlink("/dev/tty", "/dev/stdin");
                if (Module["stdout"]) FS.createDevice("/dev", "stdout", null, Module["stdout"]);
                else FS.symlink("/dev/tty", "/dev/stdout");
                if (Module["stderr"]) FS.createDevice("/dev", "stderr", null, Module["stderr"]);
                else FS.symlink("/dev/tty1", "/dev/stderr");
                var stdin = FS.open("/dev/stdin", 0);
                var stdout = FS.open("/dev/stdout", 1);
                var stderr = FS.open("/dev/stderr", 1);
            },
            ensureErrnoError: ()=>{
                if (FS.ErrnoError) return;
                FS.ErrnoError = function ErrnoError(errno, node) {
                    this.name = "ErrnoError";
                    this.node = node;
                    this.setErrno = function(errno) {
                        this.errno = errno;
                    };
                    this.setErrno(errno);
                    this.message = "FS error";
                };
                FS.ErrnoError.prototype = new Error;
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                [
                    44
                ].forEach((code)=>{
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>";
                });
            },
            staticInit: ()=>{
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices();
                FS.createSpecialDirectories();
                FS.filesystems = {
                    "MEMFS": MEMFS,
                    "WORKERFS": WORKERFS
                };
            },
            init: (input, output, error)=>{
                FS.init.initialized = true;
                FS.ensureErrnoError();
                Module["stdin"] = input || Module["stdin"];
                Module["stdout"] = output || Module["stdout"];
                Module["stderr"] = error || Module["stderr"];
                FS.createStandardStreams();
            },
            quit: ()=>{
                FS.init.initialized = false;
                for(var i = 0; i < FS.streams.length; i++){
                    var stream = FS.streams[i];
                    if (!stream) continue;
                    FS.close(stream);
                }
            },
            findObject: (path, dontResolveLastLink)=>{
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (!ret.exists) return null;
                return ret.object;
            },
            analyzePath: (path, dontResolveLastLink)=>{
                try {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink
                    });
                    path = lookup.path;
                } catch (e) {}
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null
                };
                try {
                    var lookup = FS.lookupPath(path, {
                        parent: true
                    });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink
                    });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/";
                } catch (e) {
                    ret.error = e.errno;
                }
                return ret;
            },
            createPath: (parent, path, canRead, canWrite)=>{
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while(parts.length){
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current);
                    } catch (e) {}
                    parent = current;
                }
                return current;
            },
            createFile: (parent, name, properties, canRead, canWrite)=>{
                var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                var mode = FS_getMode(canRead, canWrite);
                return FS.create(path, mode);
            },
            createDataFile: (parent, name, data, canRead, canWrite, canOwn)=>{
                var path = name;
                if (parent) {
                    parent = typeof parent == "string" ? parent : FS.getPath(parent);
                    path = name ? PATH.join2(parent, name) : parent;
                }
                var mode = FS_getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data == "string") {
                        var arr = new Array(data.length);
                        for(var i = 0, len = data.length; i < len; ++i)arr[i] = data.charCodeAt(i);
                        data = arr;
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, 577);
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                }
                return node;
            },
            createDevice: (parent, name, input, output)=>{
                var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                var mode = FS_getMode(!!input, !!output);
                if (!FS.createDevice.major) FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open: (stream)=>{
                        stream.seekable = false;
                    },
                    close: (stream)=>{
                        if (output && output.buffer && output.buffer.length) output(10);
                    },
                    read: (stream, buffer, offset, length, pos)=>{
                        var bytesRead = 0;
                        for(var i = 0; i < length; i++){
                            var result;
                            try {
                                result = input();
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                            if (result === undefined && bytesRead === 0) throw new FS.ErrnoError(6);
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result;
                        }
                        if (bytesRead) stream.node.timestamp = Date.now();
                        return bytesRead;
                    },
                    write: (stream, buffer, offset, length, pos)=>{
                        for(var i = 0; i < length; i++)try {
                            output(buffer[offset + i]);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (length) stream.node.timestamp = Date.now();
                        return i;
                    }
                });
                return FS.mkdev(path, mode, dev);
            },
            forceLoadFile: (obj)=>{
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                if (typeof XMLHttpRequest != "undefined") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                else if (read_) try {
                    obj.contents = intArrayFromString(read_(obj.url), true);
                    obj.usedBytes = obj.contents.length;
                } catch (e) {
                    throw new FS.ErrnoError(29);
                }
                else throw new Error("Cannot load without read() or XMLHttpRequest.");
            },
            createLazyFile: (parent, name, url, canRead, canWrite)=>{
                function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = [];
                }
                LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) return undefined;
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = idx / this.chunkSize | 0;
                    return this.getter(chunkNum)[chunkOffset];
                };
                LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter;
                };
                LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    var xhr = new XMLHttpRequest;
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                    var chunkSize = 1048576;
                    if (!hasByteServing) chunkSize = datalength;
                    var doXHR = (from, to)=>{
                        if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                        if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, false);
                        if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                        xhr.responseType = "arraybuffer";
                        if (xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        xhr.send(null);
                        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        if (xhr.response !== undefined) return new Uint8Array(xhr.response || []);
                        return intArrayFromString(xhr.responseText || "", true);
                    };
                    var lazyArray = this;
                    lazyArray.setDataGetter((chunkNum)=>{
                        var start = chunkNum * chunkSize;
                        var end = (chunkNum + 1) * chunkSize - 1;
                        end = Math.min(end, datalength - 1);
                        if (typeof lazyArray.chunks[chunkNum] == "undefined") lazyArray.chunks[chunkNum] = doXHR(start, end);
                        if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                        return lazyArray.chunks[chunkNum];
                    });
                    if (usesGzip || !datalength) {
                        chunkSize = datalength = 1;
                        datalength = this.getter(0).length;
                        chunkSize = datalength;
                        out("LazyFiles on gzip forces download of the whole file when length is accessed");
                    }
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true;
                };
                if (typeof XMLHttpRequest != "undefined") {
                    if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array;
                    Object.defineProperties(lazyArray, {
                        length: {
                            get: function() {
                                if (!this.lengthKnown) this.cacheLength();
                                return this._length;
                            }
                        },
                        chunkSize: {
                            get: function() {
                                if (!this.lengthKnown) this.cacheLength();
                                return this._chunkSize;
                            }
                        }
                    });
                    var properties = {
                        isDevice: false,
                        contents: lazyArray
                    };
                } else var properties = {
                    isDevice: false,
                    url: url
                };
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                if (properties.contents) node.contents = properties.contents;
                else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                }
                Object.defineProperties(node, {
                    usedBytes: {
                        get: function() {
                            return this.contents.length;
                        }
                    }
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((key)=>{
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        FS.forceLoadFile(node);
                        return fn.apply(null, arguments);
                    };
                });
                function writeChunks(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    if (contents.slice) for(var i = 0; i < size; i++)buffer[offset + i] = contents[position + i];
                    else for(var i = 0; i < size; i++)buffer[offset + i] = contents.get(position + i);
                    return size;
                }
                stream_ops.read = (stream, buffer, offset, length, position)=>{
                    FS.forceLoadFile(node);
                    return writeChunks(stream, buffer, offset, length, position);
                };
                stream_ops.mmap = (stream, length, position, prot, flags)=>{
                    FS.forceLoadFile(node);
                    var ptr = mmapAlloc(length);
                    if (!ptr) throw new FS.ErrnoError(48);
                    writeChunks(stream, HEAP8, ptr, length, position);
                    return {
                        ptr: ptr,
                        allocated: true
                    };
                };
                node.stream_ops = stream_ops;
                return node;
            }
        };
        function UTF8ToString(ptr, maxBytesToRead) {
            return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        var SYSCALLS = {
            DEFAULT_POLLMASK: 5,
            calculateAt: function(dirfd, path, allowEmpty) {
                if (PATH.isAbs(path)) return path;
                var dir;
                if (dirfd === -100) dir = FS.cwd();
                else {
                    var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                    dir = dirstream.path;
                }
                if (path.length == 0) {
                    if (!allowEmpty) throw new FS.ErrnoError(44);
                    return dir;
                }
                return PATH.join2(dir, path);
            },
            doStat: function(func, path, buf) {
                try {
                    var stat = func(path);
                } catch (e) {
                    if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) return -54;
                    throw e;
                }
                HEAP32[buf >> 2] = stat.dev;
                HEAP32[buf + 8 >> 2] = stat.ino;
                HEAP32[buf + 12 >> 2] = stat.mode;
                HEAPU32[buf + 16 >> 2] = stat.nlink;
                HEAP32[buf + 20 >> 2] = stat.uid;
                HEAP32[buf + 24 >> 2] = stat.gid;
                HEAP32[buf + 28 >> 2] = stat.rdev;
                HEAP64[buf + 40 >> 3] = BigInt(stat.size);
                HEAP32[buf + 48 >> 2] = 4096;
                HEAP32[buf + 52 >> 2] = stat.blocks;
                var atime = stat.atime.getTime();
                var mtime = stat.mtime.getTime();
                var ctime = stat.ctime.getTime();
                HEAP64[buf + 56 >> 3] = BigInt(Math.floor(atime / 1e3));
                HEAPU32[buf + 64 >> 2] = atime % 1e3 * 1e3;
                HEAP64[buf + 72 >> 3] = BigInt(Math.floor(mtime / 1e3));
                HEAPU32[buf + 80 >> 2] = mtime % 1e3 * 1e3;
                HEAP64[buf + 88 >> 3] = BigInt(Math.floor(ctime / 1e3));
                HEAPU32[buf + 96 >> 2] = ctime % 1e3 * 1e3;
                HEAP64[buf + 104 >> 3] = BigInt(stat.ino);
                return 0;
            },
            doMsync: function(addr, stream, len, flags, offset) {
                if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
                if (flags & 2) return 0;
                var buffer = HEAPU8.slice(addr, addr + len);
                FS.msync(stream, buffer, offset, len, flags);
            },
            varargs: undefined,
            get: function() {
                SYSCALLS.varargs += 4;
                var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
                return ret;
            },
            getStr: function(ptr) {
                var ret = UTF8ToString(ptr);
                return ret;
            },
            getStreamFromFD: function(fd) {
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                return stream;
            }
        };
        function _proc_exit(code) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 1, code);
            EXITSTATUS = code;
            if (!keepRuntimeAlive()) {
                PThread.terminateAllThreads();
                if (Module["onExit"]) Module["onExit"](code);
                ABORT = true;
            }
            quit_(code, new ExitStatus(code));
        }
        function exitJS(status, implicit) {
            EXITSTATUS = status;
            if (ENVIRONMENT_IS_PTHREAD) {
                exitOnMainThread(status);
                throw "unwind";
            }
            _proc_exit(status);
        }
        var _exit = exitJS;
        function handleException(e) {
            if (e instanceof ExitStatus || e == "unwind") return EXITSTATUS;
            quit_(1, e);
        }
        var PThread = {
            unusedWorkers: [],
            runningWorkers: [],
            tlsInitFunctions: [],
            pthreads: {},
            init: function() {
                if (ENVIRONMENT_IS_PTHREAD) PThread.initWorker();
                else PThread.initMainThread();
            },
            initMainThread: function() {
                var pthreadPoolSize = 32;
                while(pthreadPoolSize--)PThread.allocateUnusedWorker();
                addOnPreRun(()=>{
                    addRunDependency("loading-workers");
                    PThread.loadWasmModuleToAllWorkers(()=>removeRunDependency("loading-workers"));
                });
            },
            initWorker: function() {
                noExitRuntime = false;
            },
            setExitStatus: function(status) {
                EXITSTATUS = status;
            },
            terminateAllThreads__deps: [
                "$terminateWorker"
            ],
            terminateAllThreads: function() {
                for (var worker of PThread.runningWorkers)terminateWorker(worker);
                for (var worker of PThread.unusedWorkers)terminateWorker(worker);
                PThread.unusedWorkers = [];
                PThread.runningWorkers = [];
                PThread.pthreads = [];
            },
            returnWorkerToPool: function(worker) {
                var pthread_ptr = worker.pthread_ptr;
                delete PThread.pthreads[pthread_ptr];
                PThread.unusedWorkers.push(worker);
                PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
                worker.pthread_ptr = 0;
                __emscripten_thread_free_data(pthread_ptr);
            },
            receiveObjectTransfer: function(data) {},
            threadInitTLS: function() {
                PThread.tlsInitFunctions.forEach((f)=>f());
            },
            loadWasmModuleToWorker: (worker)=>new Promise((onFinishedLoading)=>{
                    worker.onmessage = (e)=>{
                        var d = e["data"];
                        var cmd = d["cmd"];
                        if (worker.pthread_ptr) PThread.currentProxiedOperationCallerThread = worker.pthread_ptr;
                        if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
                            var targetWorker = PThread.pthreads[d.targetThread];
                            if (targetWorker) targetWorker.postMessage(d, d["transferList"]);
                            else err('Internal error! Worker sent a message "' + cmd + '" to target pthread ' + d["targetThread"] + ", but that thread no longer exists!");
                            PThread.currentProxiedOperationCallerThread = undefined;
                            return;
                        }
                        if (cmd === "checkMailbox") checkMailbox();
                        else if (cmd === "spawnThread") spawnThread(d);
                        else if (cmd === "cleanupThread") cleanupThread(d["thread"]);
                        else if (cmd === "killThread") killThread(d["thread"]);
                        else if (cmd === "cancelThread") cancelThread(d["thread"]);
                        else if (cmd === "loaded") {
                            worker.loaded = true;
                            if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) worker.unref();
                            onFinishedLoading(worker);
                        } else if (cmd === "print") out("Thread " + d["threadId"] + ": " + d["text"]);
                        else if (cmd === "printErr") err("Thread " + d["threadId"] + ": " + d["text"]);
                        else if (cmd === "alert") alert("Thread " + d["threadId"] + ": " + d["text"]);
                        else if (d.target === "setimmediate") worker.postMessage(d);
                        else if (cmd === "callHandler") Module[d["handler"]](...d["args"]);
                        else if (cmd) err("worker sent an unknown command " + cmd);
                        PThread.currentProxiedOperationCallerThread = undefined;
                    };
                    worker.onerror = (e)=>{
                        var message = "worker sent an error!";
                        err(message + " " + e.filename + ":" + e.lineno + ": " + e.message);
                        throw e;
                    };
                    if (ENVIRONMENT_IS_NODE) {
                        worker.on("message", function(data) {
                            worker.onmessage({
                                data: data
                            });
                        });
                        worker.on("error", function(e) {
                            worker.onerror(e);
                        });
                    }
                    var handlers = [];
                    var knownHandlers = [
                        "onExit",
                        "onAbort",
                        "print",
                        "printErr"
                    ];
                    for (var handler of knownHandlers)if (Module.hasOwnProperty(handler)) handlers.push(handler);
                    worker.postMessage({
                        "cmd": "load",
                        "handlers": handlers,
                        "urlOrBlob": Module["mainScriptUrlOrBlob"] || _scriptDir,
                        "wasmMemory": wasmMemory,
                        "wasmModule": wasmModule
                    });
                }),
            loadWasmModuleToAllWorkers: function(onMaybeReady) {
                if (ENVIRONMENT_IS_PTHREAD) return onMaybeReady();
                let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
                pthreadPoolReady.then(onMaybeReady);
            },
            allocateUnusedWorker: function() {
                var worker;
                var pthreadMainJs = locateFile("ffmpeg-core.worker.js");
                worker = new Worker(pthreadMainJs);
                PThread.unusedWorkers.push(worker);
            },
            getNewWorker: function() {
                if (PThread.unusedWorkers.length == 0) {
                    PThread.allocateUnusedWorker();
                    PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
                }
                return PThread.unusedWorkers.pop();
            }
        };
        Module["PThread"] = PThread;
        function callRuntimeCallbacks(callbacks) {
            while(callbacks.length > 0)callbacks.shift()(Module);
        }
        var wasmTableMirror = [];
        function getWasmTableEntry(funcPtr) {
            var func = wasmTableMirror[funcPtr];
            if (!func) {
                if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
                wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
            }
            return func;
        }
        function establishStackSpace() {
            var pthread_ptr = _pthread_self();
            var stackHigh = HEAP32[pthread_ptr + 52 >> 2];
            var stackSize = HEAP32[pthread_ptr + 56 >> 2];
            var stackLow = stackHigh - stackSize;
            _emscripten_stack_set_limits(stackHigh, stackLow);
            stackRestore(stackHigh);
        }
        Module["establishStackSpace"] = establishStackSpace;
        function exitOnMainThread(returnCode) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, returnCode);
            _exit(returnCode);
        }
        function getValue(ptr, type = "i8") {
            if (type.endsWith("*")) type = "*";
            switch(type){
                case "i1":
                    return HEAP8[ptr >> 0];
                case "i8":
                    return HEAP8[ptr >> 0];
                case "i16":
                    return HEAP16[ptr >> 1];
                case "i32":
                    return HEAP32[ptr >> 2];
                case "i64":
                    return HEAP64[ptr >> 3];
                case "float":
                    return HEAPF32[ptr >> 2];
                case "double":
                    return HEAPF64[ptr >> 3];
                case "*":
                    return HEAPU32[ptr >> 2];
                default:
                    abort(`invalid type for getValue: ${type}`);
            }
        }
        function invokeEntryPoint(ptr, arg) {
            var result = getWasmTableEntry(ptr)(arg);
            if (keepRuntimeAlive()) PThread.setExitStatus(result);
            else __emscripten_thread_exit(result);
        }
        Module["invokeEntryPoint"] = invokeEntryPoint;
        function registerTLSInit(tlsInitFunc) {
            PThread.tlsInitFunctions.push(tlsInitFunc);
        }
        function setValue(ptr, value, type = "i8") {
            if (type.endsWith("*")) type = "*";
            switch(type){
                case "i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case "i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case "i64":
                    HEAP64[ptr >> 3] = BigInt(value);
                    break;
                case "float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case "double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                case "*":
                    HEAPU32[ptr >> 2] = value;
                    break;
                default:
                    abort(`invalid type for setValue: ${type}`);
            }
        }
        function ___assert_fail(condition, filename, line, func) {
            abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [
                filename ? UTF8ToString(filename) : "unknown filename",
                line,
                func ? UTF8ToString(func) : "unknown function"
            ]);
        }
        function ExceptionInfo(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
            this.set_type = function(type) {
                HEAPU32[this.ptr + 4 >> 2] = type;
            };
            this.get_type = function() {
                return HEAPU32[this.ptr + 4 >> 2];
            };
            this.set_destructor = function(destructor) {
                HEAPU32[this.ptr + 8 >> 2] = destructor;
            };
            this.get_destructor = function() {
                return HEAPU32[this.ptr + 8 >> 2];
            };
            this.set_caught = function(caught) {
                caught = caught ? 1 : 0;
                HEAP8[this.ptr + 12 >> 0] = caught;
            };
            this.get_caught = function() {
                return HEAP8[this.ptr + 12 >> 0] != 0;
            };
            this.set_rethrown = function(rethrown) {
                rethrown = rethrown ? 1 : 0;
                HEAP8[this.ptr + 13 >> 0] = rethrown;
            };
            this.get_rethrown = function() {
                return HEAP8[this.ptr + 13 >> 0] != 0;
            };
            this.init = function(type, destructor) {
                this.set_adjusted_ptr(0);
                this.set_type(type);
                this.set_destructor(destructor);
            };
            this.set_adjusted_ptr = function(adjustedPtr) {
                HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
            };
            this.get_adjusted_ptr = function() {
                return HEAPU32[this.ptr + 16 >> 2];
            };
            this.get_exception_ptr = function() {
                var isPointer = ___cxa_is_pointer_type(this.get_type());
                if (isPointer) return HEAPU32[this.excPtr >> 2];
                var adjusted = this.get_adjusted_ptr();
                if (adjusted !== 0) return adjusted;
                return this.excPtr;
            };
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        function ___cxa_throw(ptr, type, destructor) {
            var info = new ExceptionInfo(ptr);
            info.init(type, destructor);
            exceptionLast = ptr;
            uncaughtExceptionCount++;
            throw exceptionLast;
        }
        var dlopenMissingError = "To use dlopen, you need enable dynamic linking, see https://emscripten.org/docs/compiling/Dynamic-Linking.html";
        function ___dlsym(handle, symbol) {
            abort(dlopenMissingError);
        }
        function ___emscripten_init_main_thread_js(tb) {
            __emscripten_thread_init(tb, !ENVIRONMENT_IS_WORKER, 1, !ENVIRONMENT_IS_WEB, 65536);
            PThread.threadInitTLS();
        }
        function ___emscripten_thread_cleanup(thread) {
            if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
            else postMessage({
                "cmd": "cleanupThread",
                "thread": thread
            });
        }
        function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 1, pthread_ptr, attr, startRoutine, arg);
            return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
        }
        function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
            if (typeof SharedArrayBuffer == "undefined") {
                err("Current environment does not support SharedArrayBuffer, pthreads are not available!");
                return 6;
            }
            var transferList = [];
            var error = 0;
            if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
            if (error) return error;
            var threadParams = {
                startRoutine: startRoutine,
                pthread_ptr: pthread_ptr,
                arg: arg,
                transferList: transferList
            };
            if (ENVIRONMENT_IS_PTHREAD) {
                threadParams.cmd = "spawnThread";
                postMessage(threadParams, transferList);
                return 0;
            }
            return spawnThread(threadParams);
        }
        function ___pthread_kill_js(thread, signal) {
            if (signal === 33) {
                if (!ENVIRONMENT_IS_PTHREAD) cancelThread(thread);
                else postMessage({
                    "cmd": "cancelThread",
                    "thread": thread
                });
            } else if (!ENVIRONMENT_IS_PTHREAD) killThread(thread);
            else postMessage({
                "cmd": "killThread",
                "thread": thread
            });
            return 0;
        }
        function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 1, nfds, readfds, writefds, exceptfds, timeout);
            try {
                var total = 0;
                var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0, srcReadHigh = readfds ? HEAP32[readfds + 4 >> 2] : 0;
                var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0, srcWriteHigh = writefds ? HEAP32[writefds + 4 >> 2] : 0;
                var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0, srcExceptHigh = exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0;
                var dstReadLow = 0, dstReadHigh = 0;
                var dstWriteLow = 0, dstWriteHigh = 0;
                var dstExceptLow = 0, dstExceptHigh = 0;
                var allLow = (readfds ? HEAP32[readfds >> 2] : 0) | (writefds ? HEAP32[writefds >> 2] : 0) | (exceptfds ? HEAP32[exceptfds >> 2] : 0);
                var allHigh = (readfds ? HEAP32[readfds + 4 >> 2] : 0) | (writefds ? HEAP32[writefds + 4 >> 2] : 0) | (exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0);
                var check = function(fd, low, high, val) {
                    return fd < 32 ? low & val : high & val;
                };
                for(var fd = 0; fd < nfds; fd++){
                    var mask = 1 << fd % 32;
                    if (!check(fd, allLow, allHigh, mask)) continue;
                    var stream = SYSCALLS.getStreamFromFD(fd);
                    var flags = SYSCALLS.DEFAULT_POLLMASK;
                    if (stream.stream_ops.poll) flags = stream.stream_ops.poll(stream);
                    if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
                        fd < 32 ? dstReadLow = dstReadLow | mask : dstReadHigh = dstReadHigh | mask;
                        total++;
                    }
                    if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
                        fd < 32 ? dstWriteLow = dstWriteLow | mask : dstWriteHigh = dstWriteHigh | mask;
                        total++;
                    }
                    if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
                        fd < 32 ? dstExceptLow = dstExceptLow | mask : dstExceptHigh = dstExceptHigh | mask;
                        total++;
                    }
                }
                if (readfds) {
                    HEAP32[readfds >> 2] = dstReadLow;
                    HEAP32[readfds + 4 >> 2] = dstReadHigh;
                }
                if (writefds) {
                    HEAP32[writefds >> 2] = dstWriteLow;
                    HEAP32[writefds + 4 >> 2] = dstWriteHigh;
                }
                if (exceptfds) {
                    HEAP32[exceptfds >> 2] = dstExceptLow;
                    HEAP32[exceptfds + 4 >> 2] = dstExceptHigh;
                }
                return total;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        var SOCKFS = {
            mount: function(mount) {
                Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {};
                Module["websocket"]._callbacks = {};
                Module["websocket"]["on"] = function(event, callback) {
                    if ("function" === typeof callback) this._callbacks[event] = callback;
                    return this;
                };
                Module["websocket"].emit = function(event, param) {
                    if ("function" === typeof this._callbacks[event]) this._callbacks[event].call(this, param);
                };
                return FS.createNode(null, "/", 16895, 0);
            },
            createSocket: function(family, type, protocol) {
                type &= -526337;
                var streaming = type == 1;
                if (streaming && protocol && protocol != 6) throw new FS.ErrnoError(66);
                var sock = {
                    family: family,
                    type: type,
                    protocol: protocol,
                    server: null,
                    error: null,
                    peers: {},
                    pending: [],
                    recv_queue: [],
                    sock_ops: SOCKFS.websocket_sock_ops
                };
                var name = SOCKFS.nextname();
                var node = FS.createNode(SOCKFS.root, name, 49152, 0);
                node.sock = sock;
                var stream = FS.createStream({
                    path: name,
                    node: node,
                    flags: 2,
                    seekable: false,
                    stream_ops: SOCKFS.stream_ops
                });
                sock.stream = stream;
                return sock;
            },
            getSocket: function(fd) {
                var stream = FS.getStream(fd);
                if (!stream || !FS.isSocket(stream.node.mode)) return null;
                return stream.node.sock;
            },
            stream_ops: {
                poll: function(stream) {
                    var sock = stream.node.sock;
                    return sock.sock_ops.poll(sock);
                },
                ioctl: function(stream, request, varargs) {
                    var sock = stream.node.sock;
                    return sock.sock_ops.ioctl(sock, request, varargs);
                },
                read: function(stream, buffer, offset, length, position) {
                    var sock = stream.node.sock;
                    var msg = sock.sock_ops.recvmsg(sock, length);
                    if (!msg) return 0;
                    buffer.set(msg.buffer, offset);
                    return msg.buffer.length;
                },
                write: function(stream, buffer, offset, length, position) {
                    var sock = stream.node.sock;
                    return sock.sock_ops.sendmsg(sock, buffer, offset, length);
                },
                close: function(stream) {
                    var sock = stream.node.sock;
                    sock.sock_ops.close(sock);
                }
            },
            nextname: function() {
                if (!SOCKFS.nextname.current) SOCKFS.nextname.current = 0;
                return "socket[" + SOCKFS.nextname.current++ + "]";
            },
            websocket_sock_ops: {
                createPeer: function(sock, addr, port) {
                    var ws;
                    if (typeof addr == "object") {
                        ws = addr;
                        addr = null;
                        port = null;
                    }
                    if (ws) {
                        if (ws._socket) {
                            addr = ws._socket.remoteAddress;
                            port = ws._socket.remotePort;
                        } else {
                            var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                            if (!result) throw new Error("WebSocket URL must be in the format ws(s)://address:port");
                            addr = result[1];
                            port = parseInt(result[2], 10);
                        }
                    } else try {
                        var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
                        var url = "ws:#".replace("#", "//");
                        if (runtimeConfig) {
                            if ("string" === typeof Module["websocket"]["url"]) url = Module["websocket"]["url"];
                        }
                        if (url === "ws://" || url === "wss://") {
                            var parts = addr.split("/");
                            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
                        }
                        var subProtocols = "binary";
                        if (runtimeConfig) {
                            if ("string" === typeof Module["websocket"]["subprotocol"]) subProtocols = Module["websocket"]["subprotocol"];
                        }
                        var opts = undefined;
                        if (subProtocols !== "null") {
                            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                            opts = subProtocols;
                        }
                        if (runtimeConfig && null === Module["websocket"]["subprotocol"]) {
                            subProtocols = "null";
                            opts = undefined;
                        }
                        var WebSocketConstructor;
                        if (ENVIRONMENT_IS_NODE) WebSocketConstructor = require("76013608e3deb01d");
                        else WebSocketConstructor = WebSocket;
                        ws = new WebSocketConstructor(url, opts);
                        ws.binaryType = "arraybuffer";
                    } catch (e) {
                        throw new FS.ErrnoError(23);
                    }
                    var peer = {
                        addr: addr,
                        port: port,
                        socket: ws,
                        dgram_send_queue: []
                    };
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
                    if (sock.type === 2 && typeof sock.sport != "undefined") peer.dgram_send_queue.push(new Uint8Array([
                        255,
                        255,
                        255,
                        255,
                        "p".charCodeAt(0),
                        "o".charCodeAt(0),
                        "r".charCodeAt(0),
                        "t".charCodeAt(0),
                        (sock.sport & 65280) >> 8,
                        sock.sport & 255
                    ]));
                    return peer;
                },
                getPeer: function(sock, addr, port) {
                    return sock.peers[addr + ":" + port];
                },
                addPeer: function(sock, peer) {
                    sock.peers[peer.addr + ":" + peer.port] = peer;
                },
                removePeer: function(sock, peer) {
                    delete sock.peers[peer.addr + ":" + peer.port];
                },
                handlePeerEvents: function(sock, peer) {
                    var first = true;
                    var handleOpen = function() {
                        Module["websocket"].emit("open", sock.stream.fd);
                        try {
                            var queued = peer.dgram_send_queue.shift();
                            while(queued){
                                peer.socket.send(queued);
                                queued = peer.dgram_send_queue.shift();
                            }
                        } catch (e) {
                            peer.socket.close();
                        }
                    };
                    function handleMessage(data) {
                        if (typeof data == "string") {
                            var encoder = new TextEncoder;
                            data = encoder.encode(data);
                        } else {
                            assert(data.byteLength !== undefined);
                            if (data.byteLength == 0) return;
                            data = new Uint8Array(data);
                        }
                        var wasfirst = first;
                        first = false;
                        if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                            var newport = data[8] << 8 | data[9];
                            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                            peer.port = newport;
                            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                            return;
                        }
                        sock.recv_queue.push({
                            addr: peer.addr,
                            port: peer.port,
                            data: data
                        });
                        Module["websocket"].emit("message", sock.stream.fd);
                    }
                    if (ENVIRONMENT_IS_NODE) {
                        peer.socket.on("open", handleOpen);
                        peer.socket.on("message", function(data, isBinary) {
                            if (!isBinary) return;
                            handleMessage(new Uint8Array(data).buffer);
                        });
                        peer.socket.on("close", function() {
                            Module["websocket"].emit("close", sock.stream.fd);
                        });
                        peer.socket.on("error", function(error) {
                            sock.error = 14;
                            Module["websocket"].emit("error", [
                                sock.stream.fd,
                                sock.error,
                                "ECONNREFUSED: Connection refused"
                            ]);
                        });
                    } else {
                        peer.socket.onopen = handleOpen;
                        peer.socket.onclose = function() {
                            Module["websocket"].emit("close", sock.stream.fd);
                        };
                        peer.socket.onmessage = function peer_socket_onmessage(event) {
                            handleMessage(event.data);
                        };
                        peer.socket.onerror = function(error) {
                            sock.error = 14;
                            Module["websocket"].emit("error", [
                                sock.stream.fd,
                                sock.error,
                                "ECONNREFUSED: Connection refused"
                            ]);
                        };
                    }
                },
                poll: function(sock) {
                    if (sock.type === 1 && sock.server) return sock.pending.length ? 65 : 0;
                    var mask = 0;
                    var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
                    if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) mask |= 65;
                    if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) mask |= 4;
                    if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) mask |= 16;
                    return mask;
                },
                ioctl: function(sock, request, arg) {
                    switch(request){
                        case 21531:
                            var bytes = 0;
                            if (sock.recv_queue.length) bytes = sock.recv_queue[0].data.length;
                            HEAP32[arg >> 2] = bytes;
                            return 0;
                        default:
                            return 28;
                    }
                },
                close: function(sock) {
                    if (sock.server) {
                        try {
                            sock.server.close();
                        } catch (e) {}
                        sock.server = null;
                    }
                    var peers = Object.keys(sock.peers);
                    for(var i = 0; i < peers.length; i++){
                        var peer = sock.peers[peers[i]];
                        try {
                            peer.socket.close();
                        } catch (e) {}
                        SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    }
                    return 0;
                },
                bind: function(sock, addr, port) {
                    if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") throw new FS.ErrnoError(28);
                    sock.saddr = addr;
                    sock.sport = port;
                    if (sock.type === 2) {
                        if (sock.server) {
                            sock.server.close();
                            sock.server = null;
                        }
                        try {
                            sock.sock_ops.listen(sock, 0);
                        } catch (e) {
                            if (!(e.name === "ErrnoError")) throw e;
                            if (e.errno !== 138) throw e;
                        }
                    }
                },
                connect: function(sock, addr, port) {
                    if (sock.server) throw new FS.ErrnoError(138);
                    if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
                        var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                        if (dest) {
                            if (dest.socket.readyState === dest.socket.CONNECTING) throw new FS.ErrnoError(7);
                            else throw new FS.ErrnoError(30);
                        }
                    }
                    var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                    sock.daddr = peer.addr;
                    sock.dport = peer.port;
                    throw new FS.ErrnoError(26);
                },
                listen: function(sock, backlog) {
                    if (!ENVIRONMENT_IS_NODE) throw new FS.ErrnoError(138);
                    if (sock.server) throw new FS.ErrnoError(28);
                    var WebSocketServer = require("76013608e3deb01d").Server;
                    var host = sock.saddr;
                    sock.server = new WebSocketServer({
                        host: host,
                        port: sock.sport
                    });
                    Module["websocket"].emit("listen", sock.stream.fd);
                    sock.server.on("connection", function(ws) {
                        if (sock.type === 1) {
                            var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                            var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                            newsock.daddr = peer.addr;
                            newsock.dport = peer.port;
                            sock.pending.push(newsock);
                            Module["websocket"].emit("connection", newsock.stream.fd);
                        } else {
                            SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                            Module["websocket"].emit("connection", sock.stream.fd);
                        }
                    });
                    sock.server.on("close", function() {
                        Module["websocket"].emit("close", sock.stream.fd);
                        sock.server = null;
                    });
                    sock.server.on("error", function(error) {
                        sock.error = 23;
                        Module["websocket"].emit("error", [
                            sock.stream.fd,
                            sock.error,
                            "EHOSTUNREACH: Host is unreachable"
                        ]);
                    });
                },
                accept: function(listensock) {
                    if (!listensock.server || !listensock.pending.length) throw new FS.ErrnoError(28);
                    var newsock = listensock.pending.shift();
                    newsock.stream.flags = listensock.stream.flags;
                    return newsock;
                },
                getname: function(sock, peer) {
                    var addr, port;
                    if (peer) {
                        if (sock.daddr === undefined || sock.dport === undefined) throw new FS.ErrnoError(53);
                        addr = sock.daddr;
                        port = sock.dport;
                    } else {
                        addr = sock.saddr || 0;
                        port = sock.sport || 0;
                    }
                    return {
                        addr: addr,
                        port: port
                    };
                },
                sendmsg: function(sock, buffer, offset, length, addr, port) {
                    if (sock.type === 2) {
                        if (addr === undefined || port === undefined) {
                            addr = sock.daddr;
                            port = sock.dport;
                        }
                        if (addr === undefined || port === undefined) throw new FS.ErrnoError(17);
                    } else {
                        addr = sock.daddr;
                        port = sock.dport;
                    }
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
                    if (sock.type === 1) {
                        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) throw new FS.ErrnoError(53);
                        else if (dest.socket.readyState === dest.socket.CONNECTING) throw new FS.ErrnoError(6);
                    }
                    if (ArrayBuffer.isView(buffer)) {
                        offset += buffer.byteOffset;
                        buffer = buffer.buffer;
                    }
                    var data;
                    if (buffer instanceof SharedArrayBuffer) data = new Uint8Array(new Uint8Array(buffer.slice(offset, offset + length))).buffer;
                    else data = buffer.slice(offset, offset + length);
                    if (sock.type === 2) {
                        if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                            dest.dgram_send_queue.push(data);
                            return length;
                        }
                    }
                    try {
                        dest.socket.send(data);
                        return length;
                    } catch (e) {
                        throw new FS.ErrnoError(28);
                    }
                },
                recvmsg: function(sock, length) {
                    if (sock.type === 1 && sock.server) throw new FS.ErrnoError(53);
                    var queued = sock.recv_queue.shift();
                    if (!queued) {
                        if (sock.type === 1) {
                            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                            if (!dest) throw new FS.ErrnoError(53);
                            if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) return null;
                            throw new FS.ErrnoError(6);
                        }
                        throw new FS.ErrnoError(6);
                    }
                    var queuedLength = queued.data.byteLength || queued.data.length;
                    var queuedOffset = queued.data.byteOffset || 0;
                    var queuedBuffer = queued.data.buffer || queued.data;
                    var bytesRead = Math.min(length, queuedLength);
                    var res = {
                        buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
                        addr: queued.addr,
                        port: queued.port
                    };
                    if (sock.type === 1 && bytesRead < queuedLength) {
                        var bytesRemaining = queuedLength - bytesRead;
                        queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                        sock.recv_queue.unshift(queued);
                    }
                    return res;
                }
            }
        };
        function getSocketFromFD(fd) {
            var socket = SOCKFS.getSocket(fd);
            if (!socket) throw new FS.ErrnoError(8);
            return socket;
        }
        function setErrNo(value) {
            HEAP32[___errno_location() >> 2] = value;
            return value;
        }
        function inetPton4(str) {
            var b = str.split(".");
            for(var i = 0; i < 4; i++){
                var tmp = Number(b[i]);
                if (isNaN(tmp)) return null;
                b[i] = tmp;
            }
            return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0;
        }
        function jstoi_q(str) {
            return parseInt(str);
        }
        function inetPton6(str) {
            var words;
            var w, offset, z;
            var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
            var parts = [];
            if (!valid6regx.test(str)) return null;
            if (str === "::") return [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
            if (str.startsWith("::")) str = str.replace("::", "Z:");
            else str = str.replace("::", ":Z:");
            if (str.indexOf(".") > 0) {
                str = str.replace(new RegExp("[.]", "g"), ":");
                words = str.split(":");
                words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
                words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
                words = words.slice(0, words.length - 2);
            } else words = str.split(":");
            offset = 0;
            z = 0;
            for(w = 0; w < words.length; w++)if (typeof words[w] == "string") {
                if (words[w] === "Z") {
                    for(z = 0; z < 8 - words.length + 1; z++)parts[w + z] = 0;
                    offset = z - 1;
                } else parts[w + offset] = _htons(parseInt(words[w], 16));
            } else parts[w + offset] = words[w];
            return [
                parts[1] << 16 | parts[0],
                parts[3] << 16 | parts[2],
                parts[5] << 16 | parts[4],
                parts[7] << 16 | parts[6]
            ];
        }
        function writeSockaddr(sa, family, addr, port, addrlen) {
            switch(family){
                case 2:
                    addr = inetPton4(addr);
                    zeroMemory(sa, 16);
                    if (addrlen) HEAP32[addrlen >> 2] = 16;
                    HEAP16[sa >> 1] = family;
                    HEAP32[sa + 4 >> 2] = addr;
                    HEAP16[sa + 2 >> 1] = _htons(port);
                    break;
                case 10:
                    addr = inetPton6(addr);
                    zeroMemory(sa, 28);
                    if (addrlen) HEAP32[addrlen >> 2] = 28;
                    HEAP32[sa >> 2] = family;
                    HEAP32[sa + 8 >> 2] = addr[0];
                    HEAP32[sa + 12 >> 2] = addr[1];
                    HEAP32[sa + 16 >> 2] = addr[2];
                    HEAP32[sa + 20 >> 2] = addr[3];
                    HEAP16[sa + 2 >> 1] = _htons(port);
                    break;
                default:
                    return 5;
            }
            return 0;
        }
        var DNS = {
            address_map: {
                id: 1,
                addrs: {},
                names: {}
            },
            lookup_name: function(name) {
                var res = inetPton4(name);
                if (res !== null) return name;
                res = inetPton6(name);
                if (res !== null) return name;
                var addr;
                if (DNS.address_map.addrs[name]) addr = DNS.address_map.addrs[name];
                else {
                    var id = DNS.address_map.id++;
                    assert(id < 65535, "exceeded max address mappings of 65535");
                    addr = "172.29." + (id & 255) + "." + (id & 65280);
                    DNS.address_map.names[addr] = name;
                    DNS.address_map.addrs[name] = addr;
                }
                return addr;
            },
            lookup_addr: function(addr) {
                if (DNS.address_map.names[addr]) return DNS.address_map.names[addr];
                return null;
            }
        };
        function ___syscall_accept4(fd, addr, addrlen, flags, d1, d2) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 1, fd, addr, addrlen, flags, d1, d2);
            try {
                var sock = getSocketFromFD(fd);
                var newsock = sock.sock_ops.accept(sock);
                if (addr) var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen);
                return newsock.stream.fd;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function inetNtop4(addr) {
            return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);
        }
        function inetNtop6(ints) {
            var str = "";
            var word = 0;
            var longest = 0;
            var lastzero = 0;
            var zstart = 0;
            var len = 0;
            var i = 0;
            var parts = [
                ints[0] & 65535,
                ints[0] >> 16,
                ints[1] & 65535,
                ints[1] >> 16,
                ints[2] & 65535,
                ints[2] >> 16,
                ints[3] & 65535,
                ints[3] >> 16
            ];
            var hasipv4 = true;
            var v4part = "";
            for(i = 0; i < 5; i++)if (parts[i] !== 0) {
                hasipv4 = false;
                break;
            }
            if (hasipv4) {
                v4part = inetNtop4(parts[6] | parts[7] << 16);
                if (parts[5] === -1) {
                    str = "::ffff:";
                    str += v4part;
                    return str;
                }
                if (parts[5] === 0) {
                    str = "::";
                    if (v4part === "0.0.0.0") v4part = "";
                    if (v4part === "0.0.0.1") v4part = "1";
                    str += v4part;
                    return str;
                }
            }
            for(word = 0; word < 8; word++){
                if (parts[word] === 0) {
                    if (word - lastzero > 1) len = 0;
                    lastzero = word;
                    len++;
                }
                if (len > longest) {
                    longest = len;
                    zstart = word - longest + 1;
                }
            }
            for(word = 0; word < 8; word++){
                if (longest > 1) {
                    if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                        if (word === zstart) {
                            str += ":";
                            if (zstart === 0) str += ":";
                        }
                        continue;
                    }
                }
                str += Number(_ntohs(parts[word] & 65535)).toString(16);
                str += word < 7 ? ":" : "";
            }
            return str;
        }
        function readSockaddr(sa, salen) {
            var family = HEAP16[sa >> 1];
            var port = _ntohs(HEAPU16[sa + 2 >> 1]);
            var addr;
            switch(family){
                case 2:
                    if (salen !== 16) return {
                        errno: 28
                    };
                    addr = HEAP32[sa + 4 >> 2];
                    addr = inetNtop4(addr);
                    break;
                case 10:
                    if (salen !== 28) return {
                        errno: 28
                    };
                    addr = [
                        HEAP32[sa + 8 >> 2],
                        HEAP32[sa + 12 >> 2],
                        HEAP32[sa + 16 >> 2],
                        HEAP32[sa + 20 >> 2]
                    ];
                    addr = inetNtop6(addr);
                    break;
                default:
                    return {
                        errno: 5
                    };
            }
            return {
                family: family,
                addr: addr,
                port: port
            };
        }
        function getSocketAddress(addrp, addrlen, allowNull) {
            if (allowNull && addrp === 0) return null;
            var info = readSockaddr(addrp, addrlen);
            if (info.errno) throw new FS.ErrnoError(info.errno);
            info.addr = DNS.lookup_addr(info.addr) || info.addr;
            return info;
        }
        function ___syscall_bind(fd, addr, addrlen, d1, d2, d3) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 1, fd, addr, addrlen, d1, d2, d3);
            try {
                var sock = getSocketFromFD(fd);
                var info = getSocketAddress(addr, addrlen);
                sock.sock_ops.bind(sock, info.addr, info.port);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_connect(fd, addr, addrlen, d1, d2, d3) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 1, fd, addr, addrlen, d1, d2, d3);
            try {
                var sock = getSocketFromFD(fd);
                var info = getSocketAddress(addr, addrlen);
                sock.sock_ops.connect(sock, info.addr, info.port);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_faccessat(dirfd, path, amode, flags) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 1, dirfd, path, amode, flags);
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                if (amode & -8) return -28;
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                if (!node) return -44;
                var perms = "";
                if (amode & 4) perms += "r";
                if (amode & 2) perms += "w";
                if (amode & 1) perms += "x";
                if (perms && FS.nodePermissions(node, perms)) return -2;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 1, fd, cmd, varargs);
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch(cmd){
                    case 0:
                        var arg = SYSCALLS.get();
                        if (arg < 0) return -28;
                        var newStream;
                        newStream = FS.createStream(stream, arg);
                        return newStream.fd;
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                        return stream.flags;
                    case 4:
                        var arg = SYSCALLS.get();
                        stream.flags |= arg;
                        return 0;
                    case 5:
                        var arg = SYSCALLS.get();
                        var offset = 0;
                        HEAP16[arg + offset >> 1] = 2;
                        return 0;
                    case 6:
                    case 7:
                        return 0;
                    case 16:
                    case 8:
                        return -28;
                    case 9:
                        setErrNo(28);
                        return -1;
                    default:
                        return -28;
                }
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_fstat64(fd, buf) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 1, fd, buf);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                return SYSCALLS.doStat(FS.stat, stream.path, buf);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function ___syscall_getdents64(fd, dirp, count) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 1, fd, dirp, count);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                if (!stream.getdents) stream.getdents = FS.readdir(stream.path);
                var struct_size = 280;
                var pos = 0;
                var off = FS.llseek(stream, 0, 1);
                var idx = Math.floor(off / struct_size);
                while(idx < stream.getdents.length && pos + struct_size <= count){
                    var id;
                    var type;
                    var name = stream.getdents[idx];
                    if (name === ".") {
                        id = stream.node.id;
                        type = 4;
                    } else if (name === "..") {
                        var lookup = FS.lookupPath(stream.path, {
                            parent: true
                        });
                        id = lookup.node.id;
                        type = 4;
                    } else {
                        var child = FS.lookupNode(stream.node, name);
                        id = child.id;
                        type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
                    }
                    HEAP64[dirp + pos >> 3] = BigInt(id);
                    HEAP64[dirp + pos + 8 >> 3] = BigInt((idx + 1) * struct_size);
                    HEAP16[dirp + pos + 16 >> 1] = 280;
                    HEAP8[dirp + pos + 18 >> 0] = type;
                    stringToUTF8(name, dirp + pos + 19, 256);
                    pos += struct_size;
                    idx += 1;
                }
                FS.llseek(stream, idx * struct_size, 0);
                return pos;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_getpeername(fd, addr, addrlen, d1, d2, d3) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 1, fd, addr, addrlen, d1, d2, d3);
            try {
                var sock = getSocketFromFD(fd);
                if (!sock.daddr) return -53;
                var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport, addrlen);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_getsockname(fd, addr, addrlen, d1, d2, d3) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 1, fd, addr, addrlen, d1, d2, d3);
            try {
                var sock = getSocketFromFD(fd);
                var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport, addrlen);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_getsockopt(fd, level, optname, optval, optlen, d1) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 1, fd, level, optname, optval, optlen, d1);
            try {
                var sock = getSocketFromFD(fd);
                if (level === 1) {
                    if (optname === 4) {
                        HEAP32[optval >> 2] = sock.error;
                        HEAP32[optlen >> 2] = 4;
                        sock.error = null;
                        return 0;
                    }
                }
                return -50;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_ioctl(fd, op, varargs) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 1, fd, op, varargs);
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch(op){
                    case 21509:
                    case 21505:
                        if (!stream.tty) return -59;
                        return 0;
                    case 21510:
                    case 21511:
                    case 21512:
                    case 21506:
                    case 21507:
                    case 21508:
                        if (!stream.tty) return -59;
                        return 0;
                    case 21519:
                        if (!stream.tty) return -59;
                        var argp = SYSCALLS.get();
                        HEAP32[argp >> 2] = 0;
                        return 0;
                    case 21520:
                        if (!stream.tty) return -59;
                        return -28;
                    case 21531:
                        var argp = SYSCALLS.get();
                        return FS.ioctl(stream, op, argp);
                    case 21523:
                        if (!stream.tty) return -59;
                        return 0;
                    case 21524:
                        if (!stream.tty) return -59;
                        return 0;
                    default:
                        return -28;
                }
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_listen(fd, backlog) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 1, fd, backlog);
            try {
                var sock = getSocketFromFD(fd);
                sock.sock_ops.listen(sock, backlog);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_lstat64(path, buf) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 1, path, buf);
            try {
                path = SYSCALLS.getStr(path);
                return SYSCALLS.doStat(FS.lstat, path, buf);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 1, dirfd, path, mode);
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                path = PATH.normalize(path);
                if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
                FS.mkdir(path, mode, 0);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 1, dirfd, path, buf, flags);
            try {
                path = SYSCALLS.getStr(path);
                var nofollow = flags & 256;
                var allowEmpty = flags & 4096;
                flags = flags & -6401;
                path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
                return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 1, dirfd, path, flags, varargs);
            SYSCALLS.varargs = varargs;
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                var mode = varargs ? SYSCALLS.get() : 0;
                return FS.open(path, flags, mode).fd;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_poll(fds, nfds, timeout) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 1, fds, nfds, timeout);
            try {
                var nonzero = 0;
                for(var i = 0; i < nfds; i++){
                    var pollfd = fds + 8 * i;
                    var fd = HEAP32[pollfd >> 2];
                    var events = HEAP16[pollfd + 4 >> 1];
                    var mask = 32;
                    var stream = FS.getStream(fd);
                    if (stream) {
                        mask = SYSCALLS.DEFAULT_POLLMASK;
                        if (stream.stream_ops.poll) mask = stream.stream_ops.poll(stream);
                    }
                    mask &= events | 24;
                    if (mask) nonzero++;
                    HEAP16[pollfd + 6 >> 1] = mask;
                }
                return nonzero;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 1, fd, buf, len, flags, addr, addrlen);
            try {
                var sock = getSocketFromFD(fd);
                var msg = sock.sock_ops.recvmsg(sock, len);
                if (!msg) return 0;
                if (addr) var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
                HEAPU8.set(msg.buffer, buf);
                return msg.buffer.byteLength;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 1, olddirfd, oldpath, newdirfd, newpath);
            try {
                oldpath = SYSCALLS.getStr(oldpath);
                newpath = SYSCALLS.getStr(newpath);
                oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
                newpath = SYSCALLS.calculateAt(newdirfd, newpath);
                FS.rename(oldpath, newpath);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_rmdir(path) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 1, path);
            try {
                path = SYSCALLS.getStr(path);
                FS.rmdir(path);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 1, fd, message, length, flags, addr, addr_len);
            try {
                var sock = getSocketFromFD(fd);
                var dest = getSocketAddress(addr, addr_len, true);
                if (!dest) return FS.write(sock.stream, HEAP8, message, length);
                return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_socket(domain, type, protocol) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 1, domain, type, protocol);
            try {
                var sock = SOCKFS.createSocket(domain, type, protocol);
                return sock.stream.fd;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_stat64(path, buf) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 1, path, buf);
            try {
                path = SYSCALLS.getStr(path);
                return SYSCALLS.doStat(FS.stat, path, buf);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 1, dirfd, path, flags);
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                if (flags === 0) FS.unlink(path);
                else if (flags === 512) FS.rmdir(path);
                else abort("Invalid flags passed to unlinkat");
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        var nowIsMonotonic = true;
        function __emscripten_get_now_is_monotonic() {
            return nowIsMonotonic;
        }
        function maybeExit() {
            if (!keepRuntimeAlive()) try {
                if (ENVIRONMENT_IS_PTHREAD) __emscripten_thread_exit(EXITSTATUS);
                else _exit(EXITSTATUS);
            } catch (e) {
                handleException(e);
            }
        }
        function callUserCallback(func) {
            if (ABORT) return;
            try {
                func();
                maybeExit();
            } catch (e) {
                handleException(e);
            }
        }
        function __emscripten_thread_mailbox_await(pthread_ptr) {
            if (typeof Atomics.waitAsync === "function") {
                var wait = Atomics.waitAsync(HEAP32, pthread_ptr >> 2, pthread_ptr);
                wait.value.then(checkMailbox);
                var waitingAsync = pthread_ptr + 128;
                Atomics.store(HEAP32, waitingAsync >> 2, 1);
            }
        }
        Module["__emscripten_thread_mailbox_await"] = __emscripten_thread_mailbox_await;
        function checkMailbox() {
            var pthread_ptr = _pthread_self();
            if (pthread_ptr) {
                __emscripten_thread_mailbox_await(pthread_ptr);
                callUserCallback(()=>__emscripten_check_mailbox());
            }
        }
        Module["checkMailbox"] = checkMailbox;
        function __emscripten_notify_mailbox_postmessage(targetThreadId, currThreadId, mainThreadId) {
            if (targetThreadId == currThreadId) setTimeout(()=>checkMailbox());
            else if (ENVIRONMENT_IS_PTHREAD) postMessage({
                "targetThread": targetThreadId,
                "cmd": "checkMailbox"
            });
            else {
                var worker = PThread.pthreads[targetThreadId];
                if (!worker) return;
                worker.postMessage({
                    "cmd": "checkMailbox"
                });
            }
        }
        function __emscripten_set_offscreencanvas_size(target, width, height) {
            return -1;
        }
        function __emscripten_thread_set_strongref(thread) {
            if (ENVIRONMENT_IS_NODE) PThread.pthreads[thread].ref();
        }
        function __emscripten_throw_longjmp() {
            throw Infinity;
        }
        function readI53FromI64(ptr) {
            return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
        }
        function __gmtime_js(time, tmPtr) {
            var date = new Date(readI53FromI64(time) * 1e3);
            HEAP32[tmPtr >> 2] = date.getUTCSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
            HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
            HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
            HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
            var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
            var yday = (date.getTime() - start) / 86400000 | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
        }
        function isLeapYear(year) {
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        var MONTH_DAYS_LEAP_CUMULATIVE = [
            0,
            31,
            60,
            91,
            121,
            152,
            182,
            213,
            244,
            274,
            305,
            335
        ];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [
            0,
            31,
            59,
            90,
            120,
            151,
            181,
            212,
            243,
            273,
            304,
            334
        ];
        function ydayFromDate(date) {
            var leap = isLeapYear(date.getFullYear());
            var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
            var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
            return yday;
        }
        function __localtime_js(time, tmPtr) {
            var date = new Date(readI53FromI64(time) * 1e3);
            HEAP32[tmPtr >> 2] = date.getSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getHours();
            HEAP32[tmPtr + 12 >> 2] = date.getDate();
            HEAP32[tmPtr + 16 >> 2] = date.getMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
            HEAP32[tmPtr + 24 >> 2] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
            HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
            HEAP32[tmPtr + 32 >> 2] = dst;
        }
        function __mktime_js(tmPtr) {
            var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
            var dst = HEAP32[tmPtr + 32 >> 2];
            var guessedOffset = date.getTimezoneOffset();
            var start = new Date(date.getFullYear(), 0, 1);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dstOffset = Math.min(winterOffset, summerOffset);
            if (dst < 0) HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
            else if (dst > 0 != (dstOffset == guessedOffset)) {
                var nonDstOffset = Math.max(winterOffset, summerOffset);
                var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
                date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
            }
            HEAP32[tmPtr + 24 >> 2] = date.getDay();
            var yday = ydayFromDate(date) | 0;
            HEAP32[tmPtr + 28 >> 2] = yday;
            HEAP32[tmPtr >> 2] = date.getSeconds();
            HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
            HEAP32[tmPtr + 8 >> 2] = date.getHours();
            HEAP32[tmPtr + 12 >> 2] = date.getDate();
            HEAP32[tmPtr + 16 >> 2] = date.getMonth();
            HEAP32[tmPtr + 20 >> 2] = date.getYear();
            return date.getTime() / 1e3 | 0;
        }
        function __mmap_js(len, prot, flags, fd, off, allocated, addr) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 1, len, prot, flags, fd, off, allocated, addr);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var res = FS.mmap(stream, len, off, prot, flags);
                var ptr = res.ptr;
                HEAP32[allocated >> 2] = res.allocated;
                HEAPU32[addr >> 2] = ptr;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function __munmap_js(addr, len, prot, flags, fd, offset) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(30, 1, addr, len, prot, flags, fd, offset);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                if (prot & 2) SYSCALLS.doMsync(addr, stream, len, flags, offset);
                FS.munmap(stream);
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function stringToNewUTF8(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = _malloc(size);
            if (ret) stringToUTF8(str, ret, size);
            return ret;
        }
        function __tzset_js(timezone, daylight, tzname) {
            var currentYear = (new Date).getFullYear();
            var winter = new Date(currentYear, 0, 1);
            var summer = new Date(currentYear, 6, 1);
            var winterOffset = winter.getTimezoneOffset();
            var summerOffset = summer.getTimezoneOffset();
            var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
            HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
            HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
            function extractZone(date) {
                var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
                return match ? match[1] : "GMT";
            }
            var winterName = extractZone(winter);
            var summerName = extractZone(summer);
            var winterNamePtr = stringToNewUTF8(winterName);
            var summerNamePtr = stringToNewUTF8(summerName);
            if (summerOffset < winterOffset) {
                HEAPU32[tzname >> 2] = winterNamePtr;
                HEAPU32[tzname + 4 >> 2] = summerNamePtr;
            } else {
                HEAPU32[tzname >> 2] = summerNamePtr;
                HEAPU32[tzname + 4 >> 2] = winterNamePtr;
            }
        }
        function _abort() {
            abort("");
        }
        Module["_abort"] = _abort;
        function _dlopen(handle) {
            abort(dlopenMissingError);
        }
        var readEmAsmArgsArray = [];
        function readEmAsmArgs(sigPtr, buf) {
            readEmAsmArgsArray.length = 0;
            var ch;
            buf >>= 2;
            while(ch = HEAPU8[sigPtr++]){
                buf += ch != 105 & buf;
                readEmAsmArgsArray.push(ch == 105 ? HEAP32[buf] : (ch == 106 ? HEAP64 : HEAPF64)[buf++ >> 1]);
                ++buf;
            }
            return readEmAsmArgsArray;
        }
        function runEmAsmFunction(code, sigPtr, argbuf) {
            var args = readEmAsmArgs(sigPtr, argbuf);
            return ASM_CONSTS[code].apply(null, args);
        }
        function _emscripten_asm_const_int(code, sigPtr, argbuf) {
            return runEmAsmFunction(code, sigPtr, argbuf);
        }
        function _emscripten_check_blocking_allowed() {}
        function _emscripten_date_now() {
            return Date.now();
        }
        function runtimeKeepalivePush() {
            runtimeKeepaliveCounter += 1;
        }
        function _emscripten_exit_with_live_runtime() {
            runtimeKeepalivePush();
            throw "unwind";
        }
        function getHeapMax() {
            return HEAPU8.length;
        }
        function _emscripten_get_heap_max() {
            return getHeapMax();
        }
        var _emscripten_get_now;
        if (ENVIRONMENT_IS_NODE) global.performance = require("ee5d039605439b10").performance;
        _emscripten_get_now = ()=>performance.timeOrigin + performance.now();
        function _emscripten_num_logical_cores() {
            if (ENVIRONMENT_IS_NODE) return require("8cca2ec3dcdc3b4a").cpus().length;
            return navigator["hardwareConcurrency"];
        }
        function withStackSave(f) {
            var stack = stackSave();
            var ret = f();
            stackRestore(stack);
            return ret;
        }
        function proxyToMainThread(index, sync) {
            var numCallArgs = arguments.length - 2;
            var outerArgs = arguments;
            return withStackSave(()=>{
                var serializedNumCallArgs = numCallArgs * 2;
                var args = stackAlloc(serializedNumCallArgs * 8);
                var b = args >> 3;
                for(var i = 0; i < numCallArgs; i++){
                    var arg = outerArgs[2 + i];
                    if (typeof arg == "bigint") {
                        HEAP64[b + 2 * i] = 1n;
                        HEAP64[b + 2 * i + 1] = arg;
                    } else {
                        HEAP64[b + 2 * i] = 0n;
                        HEAPF64[b + 2 * i + 1] = arg;
                    }
                }
                return __emscripten_run_in_main_runtime_thread_js(index, serializedNumCallArgs, args, sync);
            });
        }
        var emscripten_receive_on_main_thread_js_callArgs = [];
        function _emscripten_receive_on_main_thread_js(index, numCallArgs, args) {
            numCallArgs /= 2;
            emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
            var b = args >> 3;
            for(var i = 0; i < numCallArgs; i++)if (HEAP64[b + 2 * i]) emscripten_receive_on_main_thread_js_callArgs[i] = HEAP64[b + 2 * i + 1];
            else emscripten_receive_on_main_thread_js_callArgs[i] = HEAPF64[b + 2 * i + 1];
            var isEmAsmConst = index < 0;
            var func = !isEmAsmConst ? proxiedFunctionTable[index] : ASM_CONSTS[-index - 1];
            return func.apply(null, emscripten_receive_on_main_thread_js_callArgs);
        }
        function abortOnCannotGrowMemory(requestedSize) {
            abort("OOM");
        }
        function _emscripten_resize_heap(requestedSize) {
            var oldSize = HEAPU8.length;
            requestedSize = requestedSize >>> 0;
            abortOnCannotGrowMemory(requestedSize);
        }
        function _emscripten_unwind_to_js_event_loop() {
            throw "unwind";
        }
        var ENV = {};
        function getExecutableName() {
            return thisProgram || "./this.program";
        }
        function getEnvStrings() {
            if (!getEnvStrings.strings) {
                var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
                var env = {
                    "USER": "web_user",
                    "LOGNAME": "web_user",
                    "PATH": "/",
                    "PWD": "/",
                    "HOME": "/home/web_user",
                    "LANG": lang,
                    "_": getExecutableName()
                };
                for(var x in ENV)if (ENV[x] === undefined) delete env[x];
                else env[x] = ENV[x];
                var strings = [];
                for(var x in env)strings.push(`${x}=${env[x]}`);
                getEnvStrings.strings = strings;
            }
            return getEnvStrings.strings;
        }
        function stringToAscii(str, buffer) {
            for(var i = 0; i < str.length; ++i)HEAP8[buffer++ >> 0] = str.charCodeAt(i);
            HEAP8[buffer >> 0] = 0;
        }
        function _environ_get(__environ, environ_buf) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(31, 1, __environ, environ_buf);
            var bufSize = 0;
            getEnvStrings().forEach(function(string, i) {
                var ptr = environ_buf + bufSize;
                HEAPU32[__environ + i * 4 >> 2] = ptr;
                stringToAscii(string, ptr);
                bufSize += string.length + 1;
            });
            return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(32, 1, penviron_count, penviron_buf_size);
            var strings = getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            strings.forEach(function(string) {
                bufSize += string.length + 1;
            });
            HEAPU32[penviron_buf_size >> 2] = bufSize;
            return 0;
        }
        function _fd_close(fd) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(33, 1, fd);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.close(stream);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        function _fd_fdstat_get(fd, pbuf) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(34, 1, fd, pbuf);
            try {
                var rightsBase = 0;
                var rightsInheriting = 0;
                var flags = 0;
                var stream = SYSCALLS.getStreamFromFD(fd);
                var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
                HEAP8[pbuf >> 0] = type;
                HEAP16[pbuf + 2 >> 1] = flags;
                HEAP64[pbuf + 8 >> 3] = BigInt(rightsBase);
                HEAP64[pbuf + 16 >> 3] = BigInt(rightsInheriting);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        function doReadv(stream, iov, iovcnt, offset) {
            var ret = 0;
            for(var i = 0; i < iovcnt; i++){
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[iov + 4 >> 2];
                iov += 8;
                var curr = FS.read(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (curr < len) break;
                if (typeof offset !== "undefined") offset += curr;
            }
            return ret;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(35, 1, fd, iov, iovcnt, pnum);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doReadv(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var MAX_INT53 = 9007199254740992;
        var MIN_INT53 = -9007199254740992;
        function bigintToI53Checked(num) {
            return num < MIN_INT53 || num > MAX_INT53 ? NaN : Number(num);
        }
        function _fd_seek(fd, offset, whence, newOffset) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(36, 1, fd, offset, whence, newOffset);
            try {
                offset = bigintToI53Checked(offset);
                if (isNaN(offset)) return 61;
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.llseek(stream, offset, whence);
                HEAP64[newOffset >> 3] = BigInt(stream.position);
                if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        function doWritev(stream, iov, iovcnt, offset) {
            var ret = 0;
            for(var i = 0; i < iovcnt; i++){
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[iov + 4 >> 2];
                iov += 8;
                var curr = FS.write(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (typeof offset !== "undefined") offset += curr;
            }
            return ret;
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(37, 1, fd, iov, iovcnt, pnum);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doWritev(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        function _getaddrinfo(node, service, hint, out) {
            if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(38, 1, node, service, hint, out);
            var addr = 0;
            var port = 0;
            var flags = 0;
            var family = 0;
            var type = 0;
            var proto = 0;
            var ai;
            function allocaddrinfo(family, type, proto, canon, addr, port) {
                var sa, salen, ai;
                var errno;
                salen = family === 10 ? 28 : 16;
                addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
                sa = _malloc(salen);
                errno = writeSockaddr(sa, family, addr, port);
                assert(!errno);
                ai = _malloc(32);
                HEAP32[ai + 4 >> 2] = family;
                HEAP32[ai + 8 >> 2] = type;
                HEAP32[ai + 12 >> 2] = proto;
                HEAPU32[ai + 24 >> 2] = canon;
                HEAPU32[ai + 20 >> 2] = sa;
                if (family === 10) HEAP32[ai + 16 >> 2] = 28;
                else HEAP32[ai + 16 >> 2] = 16;
                HEAP32[ai + 28 >> 2] = 0;
                return ai;
            }
            if (hint) {
                flags = HEAP32[hint >> 2];
                family = HEAP32[hint + 4 >> 2];
                type = HEAP32[hint + 8 >> 2];
                proto = HEAP32[hint + 12 >> 2];
            }
            if (type && !proto) proto = type === 2 ? 17 : 6;
            if (!type && proto) type = proto === 17 ? 2 : 1;
            if (proto === 0) proto = 6;
            if (type === 0) type = 1;
            if (!node && !service) return -2;
            if (flags & -1088) return -1;
            if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) return -1;
            if (flags & 32) return -2;
            if (type !== 0 && type !== 1 && type !== 2) return -7;
            if (family !== 0 && family !== 2 && family !== 10) return -6;
            if (service) {
                service = UTF8ToString(service);
                port = parseInt(service, 10);
                if (isNaN(port)) {
                    if (flags & 1024) return -2;
                    return -8;
                }
            }
            if (!node) {
                if (family === 0) family = 2;
                if ((flags & 1) === 0) {
                    if (family === 2) addr = _htonl(2130706433);
                    else addr = [
                        0,
                        0,
                        0,
                        1
                    ];
                }
                ai = allocaddrinfo(family, type, proto, null, addr, port);
                HEAPU32[out >> 2] = ai;
                return 0;
            }
            node = UTF8ToString(node);
            addr = inetPton4(node);
            if (addr !== null) {
                if (family === 0 || family === 2) family = 2;
                else if (family === 10 && flags & 8) {
                    addr = [
                        0,
                        0,
                        _htonl(65535),
                        addr
                    ];
                    family = 10;
                } else return -2;
            } else {
                addr = inetPton6(node);
                if (addr !== null) {
                    if (family === 0 || family === 10) family = 10;
                    else return -2;
                }
            }
            if (addr != null) {
                ai = allocaddrinfo(family, type, proto, node, addr, port);
                HEAPU32[out >> 2] = ai;
                return 0;
            }
            if (flags & 4) return -2;
            node = DNS.lookup_name(node);
            addr = inetPton4(node);
            if (family === 0) family = 2;
            else if (family === 10) addr = [
                0,
                0,
                _htonl(65535),
                addr
            ];
            ai = allocaddrinfo(family, type, proto, null, addr, port);
            HEAPU32[out >> 2] = ai;
            return 0;
        }
        function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
            var info = readSockaddr(sa, salen);
            if (info.errno) return -6;
            var port = info.port;
            var addr = info.addr;
            var overflowed = false;
            if (node && nodelen) {
                var lookup;
                if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
                    if (flags & 8) return -2;
                } else addr = lookup;
                var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
                if (numBytesWrittenExclNull + 1 >= nodelen) overflowed = true;
            }
            if (serv && servlen) {
                port = "" + port;
                var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
                if (numBytesWrittenExclNull + 1 >= servlen) overflowed = true;
            }
            if (overflowed) return -12;
            return 0;
        }
        function arraySum(array, index) {
            var sum = 0;
            for(var i = 0; i <= index; sum += array[i++]);
            return sum;
        }
        var MONTH_DAYS_LEAP = [
            31,
            29,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        var MONTH_DAYS_REGULAR = [
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        function addDays(date, days) {
            var newDate = new Date(date.getTime());
            while(days > 0){
                var leap = isLeapYear(newDate.getFullYear());
                var currentMonth = newDate.getMonth();
                var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
                if (days > daysInCurrentMonth - newDate.getDate()) {
                    days -= daysInCurrentMonth - newDate.getDate() + 1;
                    newDate.setDate(1);
                    if (currentMonth < 11) newDate.setMonth(currentMonth + 1);
                    else {
                        newDate.setMonth(0);
                        newDate.setFullYear(newDate.getFullYear() + 1);
                    }
                } else {
                    newDate.setDate(newDate.getDate() + days);
                    return newDate;
                }
            }
            return newDate;
        }
        function writeArrayToMemory(array, buffer) {
            HEAP8.set(array, buffer);
        }
        function _strftime(s, maxsize, format, tm) {
            var tm_zone = HEAP32[tm + 40 >> 2];
            var date = {
                tm_sec: HEAP32[tm >> 2],
                tm_min: HEAP32[tm + 4 >> 2],
                tm_hour: HEAP32[tm + 8 >> 2],
                tm_mday: HEAP32[tm + 12 >> 2],
                tm_mon: HEAP32[tm + 16 >> 2],
                tm_year: HEAP32[tm + 20 >> 2],
                tm_wday: HEAP32[tm + 24 >> 2],
                tm_yday: HEAP32[tm + 28 >> 2],
                tm_isdst: HEAP32[tm + 32 >> 2],
                tm_gmtoff: HEAP32[tm + 36 >> 2],
                tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
            };
            var pattern = UTF8ToString(format);
            var EXPANSION_RULES_1 = {
                "%c": "%a %b %d %H:%M:%S %Y",
                "%D": "%m/%d/%y",
                "%F": "%Y-%m-%d",
                "%h": "%b",
                "%r": "%I:%M:%S %p",
                "%R": "%H:%M",
                "%T": "%H:%M:%S",
                "%x": "%m/%d/%y",
                "%X": "%H:%M:%S",
                "%Ec": "%c",
                "%EC": "%C",
                "%Ex": "%m/%d/%y",
                "%EX": "%H:%M:%S",
                "%Ey": "%y",
                "%EY": "%Y",
                "%Od": "%d",
                "%Oe": "%e",
                "%OH": "%H",
                "%OI": "%I",
                "%Om": "%m",
                "%OM": "%M",
                "%OS": "%S",
                "%Ou": "%u",
                "%OU": "%U",
                "%OV": "%V",
                "%Ow": "%w",
                "%OW": "%W",
                "%Oy": "%y"
            };
            for(var rule in EXPANSION_RULES_1)pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
            var WEEKDAYS = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];
            var MONTHS = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            function leadingSomething(value, digits, character) {
                var str = typeof value == "number" ? value.toString() : value || "";
                while(str.length < digits)str = character[0] + str;
                return str;
            }
            function leadingNulls(value, digits) {
                return leadingSomething(value, digits, "0");
            }
            function compareByDay(date1, date2) {
                function sgn(value) {
                    return value < 0 ? -1 : value > 0 ? 1 : 0;
                }
                var compare;
                if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
                    if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) compare = sgn(date1.getDate() - date2.getDate());
                }
                return compare;
            }
            function getFirstWeekStartDate(janFourth) {
                switch(janFourth.getDay()){
                    case 0:
                        return new Date(janFourth.getFullYear() - 1, 11, 29);
                    case 1:
                        return janFourth;
                    case 2:
                        return new Date(janFourth.getFullYear(), 0, 3);
                    case 3:
                        return new Date(janFourth.getFullYear(), 0, 2);
                    case 4:
                        return new Date(janFourth.getFullYear(), 0, 1);
                    case 5:
                        return new Date(janFourth.getFullYear() - 1, 11, 31);
                    case 6:
                        return new Date(janFourth.getFullYear() - 1, 11, 30);
                }
            }
            function getWeekBasedYear(date) {
                var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
                var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
                var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
                var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
                var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
                if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                    if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) return thisDate.getFullYear() + 1;
                    return thisDate.getFullYear();
                }
                return thisDate.getFullYear() - 1;
            }
            var EXPANSION_RULES_2 = {
                "%a": function(date) {
                    return WEEKDAYS[date.tm_wday].substring(0, 3);
                },
                "%A": function(date) {
                    return WEEKDAYS[date.tm_wday];
                },
                "%b": function(date) {
                    return MONTHS[date.tm_mon].substring(0, 3);
                },
                "%B": function(date) {
                    return MONTHS[date.tm_mon];
                },
                "%C": function(date) {
                    var year = date.tm_year + 1900;
                    return leadingNulls(year / 100 | 0, 2);
                },
                "%d": function(date) {
                    return leadingNulls(date.tm_mday, 2);
                },
                "%e": function(date) {
                    return leadingSomething(date.tm_mday, 2, " ");
                },
                "%g": function(date) {
                    return getWeekBasedYear(date).toString().substring(2);
                },
                "%G": function(date) {
                    return getWeekBasedYear(date);
                },
                "%H": function(date) {
                    return leadingNulls(date.tm_hour, 2);
                },
                "%I": function(date) {
                    var twelveHour = date.tm_hour;
                    if (twelveHour == 0) twelveHour = 12;
                    else if (twelveHour > 12) twelveHour -= 12;
                    return leadingNulls(twelveHour, 2);
                },
                "%j": function(date) {
                    return leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
                },
                "%m": function(date) {
                    return leadingNulls(date.tm_mon + 1, 2);
                },
                "%M": function(date) {
                    return leadingNulls(date.tm_min, 2);
                },
                "%n": function() {
                    return "\n";
                },
                "%p": function(date) {
                    if (date.tm_hour >= 0 && date.tm_hour < 12) return "AM";
                    return "PM";
                },
                "%S": function(date) {
                    return leadingNulls(date.tm_sec, 2);
                },
                "%t": function() {
                    return "	";
                },
                "%u": function(date) {
                    return date.tm_wday || 7;
                },
                "%U": function(date) {
                    var days = date.tm_yday + 7 - date.tm_wday;
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                "%V": function(date) {
                    var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
                    if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) val++;
                    if (!val) {
                        val = 52;
                        var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
                        if (dec31 == 4 || dec31 == 5 && isLeapYear(date.tm_year % 400 - 1)) val++;
                    } else if (val == 53) {
                        var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
                        if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
                    }
                    return leadingNulls(val, 2);
                },
                "%w": function(date) {
                    return date.tm_wday;
                },
                "%W": function(date) {
                    var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                "%y": function(date) {
                    return (date.tm_year + 1900).toString().substring(2);
                },
                "%Y": function(date) {
                    return date.tm_year + 1900;
                },
                "%z": function(date) {
                    var off = date.tm_gmtoff;
                    var ahead = off >= 0;
                    off = Math.abs(off) / 60;
                    off = off / 60 * 100 + off % 60;
                    return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
                },
                "%Z": function(date) {
                    return date.tm_zone;
                },
                "%%": function() {
                    return "%";
                }
            };
            pattern = pattern.replace(/%%/g, "\x00\x00");
            for(var rule in EXPANSION_RULES_2)if (pattern.includes(rule)) pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            pattern = pattern.replace(/\0\0/g, "%");
            var bytes = intArrayFromString(pattern, false);
            if (bytes.length > maxsize) return 0;
            writeArrayToMemory(bytes, s);
            return bytes.length - 1;
        }
        PThread.init();
        var FSNode = function(parent, name, mode, rdev) {
            if (!parent) parent = this;
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
        };
        var readMode = 365;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, {
            read: {
                get: function() {
                    return (this.mode & readMode) === readMode;
                },
                set: function(val) {
                    val ? this.mode |= readMode : this.mode &= ~readMode;
                }
            },
            write: {
                get: function() {
                    return (this.mode & writeMode) === writeMode;
                },
                set: function(val) {
                    val ? this.mode |= writeMode : this.mode &= ~writeMode;
                }
            },
            isFolder: {
                get: function() {
                    return FS.isDir(this.mode);
                }
            },
            isDevice: {
                get: function() {
                    return FS.isChrdev(this.mode);
                }
            }
        });
        FS.FSNode = FSNode;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        var proxiedFunctionTable = [
            null,
            _proc_exit,
            exitOnMainThread,
            pthreadCreateProxied,
            ___syscall__newselect,
            ___syscall_accept4,
            ___syscall_bind,
            ___syscall_connect,
            ___syscall_faccessat,
            ___syscall_fcntl64,
            ___syscall_fstat64,
            ___syscall_getdents64,
            ___syscall_getpeername,
            ___syscall_getsockname,
            ___syscall_getsockopt,
            ___syscall_ioctl,
            ___syscall_listen,
            ___syscall_lstat64,
            ___syscall_mkdirat,
            ___syscall_newfstatat,
            ___syscall_openat,
            ___syscall_poll,
            ___syscall_recvfrom,
            ___syscall_renameat,
            ___syscall_rmdir,
            ___syscall_sendto,
            ___syscall_socket,
            ___syscall_stat64,
            ___syscall_unlinkat,
            __mmap_js,
            __munmap_js,
            _environ_get,
            _environ_sizes_get,
            _fd_close,
            _fd_fdstat_get,
            _fd_read,
            _fd_seek,
            _fd_write,
            _getaddrinfo
        ];
        var wasmImports = {
            "c": ___assert_fail,
            "h": ___cxa_throw,
            "Ba": ___dlsym,
            "oa": ___emscripten_init_main_thread_js,
            "A": ___emscripten_thread_cleanup,
            "ea": ___pthread_create_js,
            "ca": ___pthread_kill_js,
            "_": ___syscall__newselect,
            "R": ___syscall_accept4,
            "Q": ___syscall_bind,
            "P": ___syscall_connect,
            "Ca": ___syscall_faccessat,
            "k": ___syscall_fcntl64,
            "xa": ___syscall_fstat64,
            "ba": ___syscall_getdents64,
            "O": ___syscall_getpeername,
            "N": ___syscall_getsockname,
            "M": ___syscall_getsockopt,
            "E": ___syscall_ioctl,
            "L": ___syscall_listen,
            "ua": ___syscall_lstat64,
            "la": ___syscall_mkdirat,
            "va": ___syscall_newfstatat,
            "C": ___syscall_openat,
            "fa": ___syscall_poll,
            "K": ___syscall_recvfrom,
            "aa": ___syscall_renameat,
            "$": ___syscall_rmdir,
            "J": ___syscall_sendto,
            "y": ___syscall_socket,
            "wa": ___syscall_stat64,
            "U": ___syscall_unlinkat,
            "Aa": __emscripten_get_now_is_monotonic,
            "W": __emscripten_notify_mailbox_postmessage,
            "qa": __emscripten_set_offscreencanvas_size,
            "na": __emscripten_thread_mailbox_await,
            "za": __emscripten_thread_set_strongref,
            "S": __emscripten_throw_longjmp,
            "ia": __gmtime_js,
            "ja": __localtime_js,
            "ka": __mktime_js,
            "ga": __mmap_js,
            "ha": __munmap_js,
            "V": __tzset_js,
            "b": _abort,
            "x": _dlopen,
            "Fa": _emscripten_asm_const_int,
            "B": _emscripten_check_blocking_allowed,
            "q": _emscripten_date_now,
            "ya": _emscripten_exit_with_live_runtime,
            "Y": _emscripten_get_heap_max,
            "l": _emscripten_get_now,
            "Z": _emscripten_num_logical_cores,
            "pa": _emscripten_receive_on_main_thread_js,
            "T": _emscripten_resize_heap,
            "da": _emscripten_unwind_to_js_event_loop,
            "sa": _environ_get,
            "ta": _environ_sizes_get,
            "p": _exit,
            "r": _fd_close,
            "ra": _fd_fdstat_get,
            "D": _fd_read,
            "ma": _fd_seek,
            "t": _fd_write,
            "n": _getaddrinfo,
            "m": _getnameinfo,
            "H": invoke_i,
            "i": invoke_ii,
            "e": invoke_iii,
            "o": invoke_iiii,
            "w": invoke_iiiii,
            "F": invoke_iiiiii,
            "v": invoke_iiiiiiiii,
            "I": invoke_iiiijj,
            "Ea": invoke_iij,
            "f": invoke_vi,
            "j": invoke_vii,
            "s": invoke_viii,
            "d": invoke_viiii,
            "u": invoke_viiiii,
            "Da": invoke_viiiiii,
            "G": invoke_viiiiiiii,
            "X": is_timeout,
            "a": wasmMemory || Module["wasmMemory"],
            "z": send_progress,
            "g": _strftime
        };
        var asm = createWasm();
        var ___wasm_call_ctors = function() {
            return (___wasm_call_ctors = Module["asm"]["Ga"]).apply(null, arguments);
        };
        var _malloc = Module["_malloc"] = function() {
            return (_malloc = Module["_malloc"] = Module["asm"]["Ha"]).apply(null, arguments);
        };
        var ___errno_location = function() {
            return (___errno_location = Module["asm"]["Ja"]).apply(null, arguments);
        };
        var _ntohs = function() {
            return (_ntohs = Module["asm"]["Ka"]).apply(null, arguments);
        };
        var _htons = function() {
            return (_htons = Module["asm"]["La"]).apply(null, arguments);
        };
        var _ffmpeg = Module["_ffmpeg"] = function() {
            return (_ffmpeg = Module["_ffmpeg"] = Module["asm"]["Ma"]).apply(null, arguments);
        };
        var __emscripten_tls_init = Module["__emscripten_tls_init"] = function() {
            return (__emscripten_tls_init = Module["__emscripten_tls_init"] = Module["asm"]["Na"]).apply(null, arguments);
        };
        var _pthread_self = Module["_pthread_self"] = function() {
            return (_pthread_self = Module["_pthread_self"] = Module["asm"]["Oa"]).apply(null, arguments);
        };
        var _emscripten_builtin_memalign = function() {
            return (_emscripten_builtin_memalign = Module["asm"]["Pa"]).apply(null, arguments);
        };
        var __emscripten_thread_init = Module["__emscripten_thread_init"] = function() {
            return (__emscripten_thread_init = Module["__emscripten_thread_init"] = Module["asm"]["Qa"]).apply(null, arguments);
        };
        var __emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = function() {
            return (__emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = Module["asm"]["Ra"]).apply(null, arguments);
        };
        var _emscripten_main_thread_process_queued_calls = function() {
            return (_emscripten_main_thread_process_queued_calls = Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(null, arguments);
        };
        var _htonl = function() {
            return (_htonl = Module["asm"]["Sa"]).apply(null, arguments);
        };
        var _emscripten_main_runtime_thread_id = function() {
            return (_emscripten_main_runtime_thread_id = Module["asm"]["emscripten_main_runtime_thread_id"]).apply(null, arguments);
        };
        var __emscripten_run_in_main_runtime_thread_js = function() {
            return (__emscripten_run_in_main_runtime_thread_js = Module["asm"]["Ta"]).apply(null, arguments);
        };
        var _emscripten_dispatch_to_thread_ = function() {
            return (_emscripten_dispatch_to_thread_ = Module["asm"]["emscripten_dispatch_to_thread_"]).apply(null, arguments);
        };
        var __emscripten_thread_free_data = function() {
            return (__emscripten_thread_free_data = Module["asm"]["Ua"]).apply(null, arguments);
        };
        var __emscripten_thread_exit = Module["__emscripten_thread_exit"] = function() {
            return (__emscripten_thread_exit = Module["__emscripten_thread_exit"] = Module["asm"]["Va"]).apply(null, arguments);
        };
        var __emscripten_check_mailbox = Module["__emscripten_check_mailbox"] = function() {
            return (__emscripten_check_mailbox = Module["__emscripten_check_mailbox"] = Module["asm"]["Wa"]).apply(null, arguments);
        };
        var _setThrew = function() {
            return (_setThrew = Module["asm"]["Xa"]).apply(null, arguments);
        };
        var _emscripten_stack_set_limits = function() {
            return (_emscripten_stack_set_limits = Module["asm"]["Ya"]).apply(null, arguments);
        };
        var stackSave = function() {
            return (stackSave = Module["asm"]["Za"]).apply(null, arguments);
        };
        var stackRestore = function() {
            return (stackRestore = Module["asm"]["_a"]).apply(null, arguments);
        };
        var stackAlloc = function() {
            return (stackAlloc = Module["asm"]["$a"]).apply(null, arguments);
        };
        var ___cxa_is_pointer_type = function() {
            return (___cxa_is_pointer_type = Module["asm"]["ab"]).apply(null, arguments);
        };
        var _ff_h264_cabac_tables = Module["_ff_h264_cabac_tables"] = 1541772;
        var ___start_em_js = Module["___start_em_js"] = 6065597;
        var ___stop_em_js = Module["___stop_em_js"] = 6065774;
        function invoke_iiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vii(index, a1, a2) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iii(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiijj(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vi(index, a1) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ii(index, a1) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iij(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_i(index) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)();
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        Module["keepRuntimeAlive"] = keepRuntimeAlive;
        Module["wasmMemory"] = wasmMemory;
        Module["setValue"] = setValue;
        Module["getValue"] = getValue;
        Module["UTF8ToString"] = UTF8ToString;
        Module["stringToUTF8"] = stringToUTF8;
        Module["lengthBytesUTF8"] = lengthBytesUTF8;
        Module["ExitStatus"] = ExitStatus;
        Module["FS"] = FS;
        Module["PThread"] = PThread;
        var calledRun;
        dependenciesFulfilled = function runCaller() {
            if (!calledRun) run();
            if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run() {
            if (runDependencies > 0) return;
            if (ENVIRONMENT_IS_PTHREAD) {
                readyPromiseResolve(Module);
                initRuntime();
                startWorker(Module);
                return;
            }
            preRun();
            if (runDependencies > 0) return;
            function doRun() {
                if (calledRun) return;
                calledRun = true;
                Module["calledRun"] = true;
                if (ABORT) return;
                initRuntime();
                readyPromiseResolve(Module);
                if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                postRun();
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(function() {
                    setTimeout(function() {
                        Module["setStatus"]("");
                    }, 1);
                    doRun();
                }, 1);
            } else doRun();
        }
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [
                Module["preInit"]
            ];
            while(Module["preInit"].length > 0)Module["preInit"].pop()();
        }
        run();
        return createFFmpegCore.ready;
    };
})();
module.exports = createFFmpegCore;

},{"1d806780e70f13b3":"cjohZ","40f9dbbda9c9a76c":"eR5qz","6e76a9b9ef8b9b6d":"l03yQ","ed985e3e1462ddea":"443xK","efd28b655b02b81e":"l03yQ","ee5d039605439b10":"l03yQ","a68bb0f5f93de131":"lUVO2","76013608e3deb01d":"hfA3H","8cca2ec3dcdc3b4a":"2LTjU"}],"cjohZ":[function(require,module,exports) {
var q = Object.create;
var p = Object.defineProperty;
var A = Object.getOwnPropertyDescriptor;
var I = Object.getOwnPropertyNames;
var Q = Object.getPrototypeOf, S = Object.prototype.hasOwnProperty;
var N = (e, t)=>()=>(t || e((t = {
            exports: {}
        }).exports, t), t.exports), O = (e, t)=>{
    for(var n in t)p(e, n, {
        get: t[n],
        enumerable: !0
    });
}, m = (e, t, n, w)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let f of I(t))!S.call(e, f) && f !== n && p(e, f, {
        get: ()=>t[f],
        enumerable: !(w = A(t, f)) || w.enumerable
    });
    return e;
}, h = (e, t, n)=>(m(e, t, "default"), n && m(n, t, "default")), y = (e, t, n)=>(n = e != null ? q(Q(e)) : {}, m(t || !e || !e.__esModule ? p(n, "default", {
        value: e,
        enumerable: !0
    }) : n, e)), U = (e)=>m(p({}, "__esModule", {
        value: !0
    }), e);
var v = N((F, E)=>{
    var r = E.exports = {}, i, u;
    function T() {
        throw new Error("setTimeout has not been defined");
    }
    function g() {
        throw new Error("clearTimeout has not been defined");
    }
    (function() {
        try {
            typeof setTimeout == "function" ? i = setTimeout : i = T;
        } catch (e) {
            i = T;
        }
        try {
            typeof clearTimeout == "function" ? u = clearTimeout : u = g;
        } catch (e) {
            u = g;
        }
    })();
    function b(e) {
        if (i === setTimeout) return setTimeout(e, 0);
        if ((i === T || !i) && setTimeout) return i = setTimeout, setTimeout(e, 0);
        try {
            return i(e, 0);
        } catch (t) {
            try {
                return i.call(null, e, 0);
            } catch (n) {
                return i.call(this, e, 0);
            }
        }
    }
    function j(e) {
        if (u === clearTimeout) return clearTimeout(e);
        if ((u === g || !u) && clearTimeout) return u = clearTimeout, clearTimeout(e);
        try {
            return u(e);
        } catch (t) {
            try {
                return u.call(null, e);
            } catch (n) {
                return u.call(this, e);
            }
        }
    }
    var o = [], s = !1, a, d = -1;
    function z() {
        !s || !a || (s = !1, a.length ? o = a.concat(o) : d = -1, o.length && x());
    }
    function x() {
        if (!s) {
            var e = b(z);
            s = !0;
            for(var t = o.length; t;){
                for(a = o, o = []; ++d < t;)a && a[d].run();
                d = -1, t = o.length;
            }
            a = null, s = !1, j(e);
        }
    }
    r.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1) for(var n = 1; n < arguments.length; n++)t[n - 1] = arguments[n];
        o.push(new L(e, t)), o.length === 1 && !s && b(x);
    };
    function L(e, t) {
        this.fun = e, this.array = t;
    }
    L.prototype.run = function() {
        this.fun.apply(null, this.array);
    };
    r.title = "browser";
    r.browser = !0;
    r.env = {};
    r.argv = [];
    r.version = "";
    r.versions = {};
    function c() {}
    r.on = c;
    r.addListener = c;
    r.once = c;
    r.off = c;
    r.removeListener = c;
    r.removeAllListeners = c;
    r.emit = c;
    r.prependListener = c;
    r.prependOnceListener = c;
    r.listeners = function(e) {
        return [];
    };
    r.binding = function(e) {
        throw new Error("process.binding is not supported");
    };
    r.cwd = function() {
        return "/";
    };
    r.chdir = function(e) {
        throw new Error("process.chdir is not supported");
    };
    r.umask = function() {
        return 0;
    };
});
var l = {};
O(l, {
    default: ()=>B
});
module.exports = U(l);
var C = y(v());
h(l, y(v()), module.exports);
var B = C.default;

},{}],"eR5qz":[function(require,module,exports) {
var Er = Object.create;
var N = Object.defineProperty;
var dr = Object.getOwnPropertyDescriptor;
var gr = Object.getOwnPropertyNames;
var mr = Object.getPrototypeOf, Ir = Object.prototype.hasOwnProperty;
var $ = (i, r)=>()=>(r || i((r = {
            exports: {}
        }).exports, r), r.exports), Fr = (i, r)=>{
    for(var t in r)N(i, t, {
        get: r[t],
        enumerable: !0
    });
}, L = (i, r, t, n)=>{
    if (r && typeof r == "object" || typeof r == "function") for (let e of gr(r))!Ir.call(i, e) && e !== t && N(i, e, {
        get: ()=>r[e],
        enumerable: !(n = dr(r, e)) || n.enumerable
    });
    return i;
}, S = (i, r, t)=>(L(i, r, "default"), t && L(t, r, "default")), J = (i, r, t)=>(t = i != null ? Er(mr(i)) : {}, L(r || !i || !i.__esModule ? N(t, "default", {
        value: i,
        enumerable: !0
    }) : t, i)), Ar = (i)=>L(N({}, "__esModule", {
        value: !0
    }), i);
var Q = $((M)=>{
    "use strict";
    M.byteLength = Rr;
    M.toByteArray = Cr;
    M.fromByteArray = Lr;
    var B = [], w = [], Ur = typeof Uint8Array < "u" ? Uint8Array : Array, P = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(m = 0, K = P.length; m < K; ++m)B[m] = P[m], w[P.charCodeAt(m)] = m;
    var m, K;
    w["-".charCodeAt(0)] = 62;
    w["_".charCodeAt(0)] = 63;
    function Z(i) {
        var r = i.length;
        if (r % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var t = i.indexOf("=");
        t === -1 && (t = r);
        var n = t === r ? 0 : 4 - t % 4;
        return [
            t,
            n
        ];
    }
    function Rr(i) {
        var r = Z(i), t = r[0], n = r[1];
        return (t + n) * 3 / 4 - n;
    }
    function Tr(i, r, t) {
        return (r + t) * 3 / 4 - t;
    }
    function Cr(i) {
        var r, t = Z(i), n = t[0], e = t[1], o = new Ur(Tr(i, n, e)), u = 0, f = e > 0 ? n - 4 : n, c;
        for(c = 0; c < f; c += 4)r = w[i.charCodeAt(c)] << 18 | w[i.charCodeAt(c + 1)] << 12 | w[i.charCodeAt(c + 2)] << 6 | w[i.charCodeAt(c + 3)], o[u++] = r >> 16 & 255, o[u++] = r >> 8 & 255, o[u++] = r & 255;
        return e === 2 && (r = w[i.charCodeAt(c)] << 2 | w[i.charCodeAt(c + 1)] >> 4, o[u++] = r & 255), e === 1 && (r = w[i.charCodeAt(c)] << 10 | w[i.charCodeAt(c + 1)] << 4 | w[i.charCodeAt(c + 2)] >> 2, o[u++] = r >> 8 & 255, o[u++] = r & 255), o;
    }
    function Sr(i) {
        return B[i >> 18 & 63] + B[i >> 12 & 63] + B[i >> 6 & 63] + B[i & 63];
    }
    function _r(i, r, t) {
        for(var n, e = [], o = r; o < t; o += 3)n = (i[o] << 16 & 16711680) + (i[o + 1] << 8 & 65280) + (i[o + 2] & 255), e.push(Sr(n));
        return e.join("");
    }
    function Lr(i) {
        for(var r, t = i.length, n = t % 3, e = [], o = 16383, u = 0, f = t - n; u < f; u += o)e.push(_r(i, u, u + o > f ? f : u + o));
        return n === 1 ? (r = i[t - 1], e.push(B[r >> 2] + B[r << 4 & 63] + "==")) : n === 2 && (r = (i[t - 2] << 8) + i[t - 1], e.push(B[r >> 10] + B[r >> 4 & 63] + B[r << 2 & 63] + "=")), e.join("");
    }
});
var v = $((O)=>{
    O.read = function(i, r, t, n, e) {
        var o, u, f = e * 8 - n - 1, c = (1 << f) - 1, l = c >> 1, s = -7, p = t ? e - 1 : 0, F = t ? -1 : 1, x = i[r + p];
        for(p += F, o = x & (1 << -s) - 1, x >>= -s, s += f; s > 0; o = o * 256 + i[r + p], p += F, s -= 8);
        for(u = o & (1 << -s) - 1, o >>= -s, s += n; s > 0; u = u * 256 + i[r + p], p += F, s -= 8);
        if (o === 0) o = 1 - l;
        else {
            if (o === c) return u ? NaN : (x ? -1 : 1) * (1 / 0);
            u = u + Math.pow(2, n), o = o - l;
        }
        return (x ? -1 : 1) * u * Math.pow(2, o - n);
    };
    O.write = function(i, r, t, n, e, o) {
        var u, f, c, l = o * 8 - e - 1, s = (1 << l) - 1, p = s >> 1, F = e === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, x = n ? 0 : o - 1, b = n ? 1 : -1, Br = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
        for(r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (f = isNaN(r) ? 1 : 0, u = s) : (u = Math.floor(Math.log(r) / Math.LN2), r * (c = Math.pow(2, -u)) < 1 && (u--, c *= 2), u + p >= 1 ? r += F / c : r += F * Math.pow(2, 1 - p), r * c >= 2 && (u++, c /= 2), u + p >= s ? (f = 0, u = s) : u + p >= 1 ? (f = (r * c - 1) * Math.pow(2, e), u = u + p) : (f = r * Math.pow(2, p - 1) * Math.pow(2, e), u = 0)); e >= 8; i[t + x] = f & 255, x += b, f /= 256, e -= 8);
        for(u = u << e | f, l += e; l > 0; i[t + x] = u & 255, x += b, u /= 256, l -= 8);
        i[t + x - b] |= Br * 128;
    };
});
var z = $((T)=>{
    "use strict";
    var G = Q(), U = v(), rr = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    T.Buffer = h;
    T.SlowBuffer = $r;
    T.INSPECT_MAX_BYTES = 50;
    var k = 2147483647;
    T.kMaxLength = k;
    h.TYPED_ARRAY_SUPPORT = Nr();
    !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    function Nr() {
        try {
            let i = new Uint8Array(1), r = {
                foo: function() {
                    return 42;
                }
            };
            return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(i, r), i.foo() === 42;
        } catch (i) {
            return !1;
        }
    }
    Object.defineProperty(h.prototype, "parent", {
        enumerable: !0,
        get: function() {
            if (h.isBuffer(this)) return this.buffer;
        }
    });
    Object.defineProperty(h.prototype, "offset", {
        enumerable: !0,
        get: function() {
            if (h.isBuffer(this)) return this.byteOffset;
        }
    });
    function d(i) {
        if (i > k) throw new RangeError('The value "' + i + '" is invalid for option "size"');
        let r = new Uint8Array(i);
        return Object.setPrototypeOf(r, h.prototype), r;
    }
    function h(i, r, t) {
        if (typeof i == "number") {
            if (typeof r == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
            return j(i);
        }
        return er(i, r, t);
    }
    h.poolSize = 8192;
    function er(i, r, t) {
        if (typeof i == "string") return kr(i, r);
        if (ArrayBuffer.isView(i)) return Dr(i);
        if (i == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i);
        if (E(i, ArrayBuffer) || i && E(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (E(i, SharedArrayBuffer) || i && E(i.buffer, SharedArrayBuffer))) return q(i, r, t);
        if (typeof i == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        let n = i.valueOf && i.valueOf();
        if (n != null && n !== i) return h.from(n, r, t);
        let e = br(i);
        if (e) return e;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function") return h.from(i[Symbol.toPrimitive]("string"), r, t);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i);
    }
    h.from = function(i, r, t) {
        return er(i, r, t);
    };
    Object.setPrototypeOf(h.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(h, Uint8Array);
    function or(i) {
        if (typeof i != "number") throw new TypeError('"size" argument must be of type number');
        if (i < 0) throw new RangeError('The value "' + i + '" is invalid for option "size"');
    }
    function Mr(i, r, t) {
        return or(i), i <= 0 ? d(i) : r !== void 0 ? typeof t == "string" ? d(i).fill(r, t) : d(i).fill(r) : d(i);
    }
    h.alloc = function(i, r, t) {
        return Mr(i, r, t);
    };
    function j(i) {
        return or(i), d(i < 0 ? 0 : H(i) | 0);
    }
    h.allocUnsafe = function(i) {
        return j(i);
    };
    h.allocUnsafeSlow = function(i) {
        return j(i);
    };
    function kr(i, r) {
        if ((typeof r != "string" || r === "") && (r = "utf8"), !h.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
        let t = ur(i, r) | 0, n = d(t), e = n.write(i, r);
        return e !== t && (n = n.slice(0, e)), n;
    }
    function Y(i) {
        let r = i.length < 0 ? 0 : H(i.length) | 0, t = d(r);
        for(let n = 0; n < r; n += 1)t[n] = i[n] & 255;
        return t;
    }
    function Dr(i) {
        if (E(i, Uint8Array)) {
            let r = new Uint8Array(i);
            return q(r.buffer, r.byteOffset, r.byteLength);
        }
        return Y(i);
    }
    function q(i, r, t) {
        if (r < 0 || i.byteLength < r) throw new RangeError('"offset" is outside of buffer bounds');
        if (i.byteLength < r + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return r === void 0 && t === void 0 ? n = new Uint8Array(i) : t === void 0 ? n = new Uint8Array(i, r) : n = new Uint8Array(i, r, t), Object.setPrototypeOf(n, h.prototype), n;
    }
    function br(i) {
        if (h.isBuffer(i)) {
            let r = H(i.length) | 0, t = d(r);
            return t.length === 0 || i.copy(t, 0, 0, r), t;
        }
        if (i.length !== void 0) return typeof i.length != "number" || X(i.length) ? d(0) : Y(i);
        if (i.type === "Buffer" && Array.isArray(i.data)) return Y(i.data);
    }
    function H(i) {
        if (i >= k) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + k.toString(16) + " bytes");
        return i | 0;
    }
    function $r(i) {
        return +i != i && (i = 0), h.alloc(+i);
    }
    h.isBuffer = function(r) {
        return r != null && r._isBuffer === !0 && r !== h.prototype;
    };
    h.compare = function(r, t) {
        if (E(r, Uint8Array) && (r = h.from(r, r.offset, r.byteLength)), E(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(r) || !h.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (r === t) return 0;
        let n = r.length, e = t.length;
        for(let o = 0, u = Math.min(n, e); o < u; ++o)if (r[o] !== t[o]) {
            n = r[o], e = t[o];
            break;
        }
        return n < e ? -1 : e < n ? 1 : 0;
    };
    h.isEncoding = function(r) {
        switch(String(r).toLowerCase()){
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1;
        }
    };
    h.concat = function(r, t) {
        if (!Array.isArray(r)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (r.length === 0) return h.alloc(0);
        let n;
        if (t === void 0) for(t = 0, n = 0; n < r.length; ++n)t += r[n].length;
        let e = h.allocUnsafe(t), o = 0;
        for(n = 0; n < r.length; ++n){
            let u = r[n];
            if (E(u, Uint8Array)) o + u.length > e.length ? (h.isBuffer(u) || (u = h.from(u)), u.copy(e, o)) : Uint8Array.prototype.set.call(e, u, o);
            else if (h.isBuffer(u)) u.copy(e, o);
            else throw new TypeError('"list" argument must be an Array of Buffers');
            o += u.length;
        }
        return e;
    };
    function ur(i, r) {
        if (h.isBuffer(i)) return i.length;
        if (ArrayBuffer.isView(i) || E(i, ArrayBuffer)) return i.byteLength;
        if (typeof i != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i);
        let t = i.length, n = arguments.length > 2 && arguments[2] === !0;
        if (!n && t === 0) return 0;
        let e = !1;
        for(;;)switch(r){
            case "ascii":
            case "latin1":
            case "binary":
                return t;
            case "utf8":
            case "utf-8":
                return W(i).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return t * 2;
            case "hex":
                return t >>> 1;
            case "base64":
                return wr(i).length;
            default:
                if (e) return n ? -1 : W(i).length;
                r = ("" + r).toLowerCase(), e = !0;
        }
    }
    h.byteLength = ur;
    function Pr(i, r, t) {
        let n = !1;
        if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, r >>>= 0, t <= r)) return "";
        for(i || (i = "utf8");;)switch(i){
            case "hex":
                return zr(this, r, t);
            case "utf8":
            case "utf-8":
                return fr(this, r, t);
            case "ascii":
                return Vr(this, r, t);
            case "latin1":
            case "binary":
                return Xr(this, r, t);
            case "base64":
                return jr(this, r, t);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return Jr(this, r, t);
            default:
                if (n) throw new TypeError("Unknown encoding: " + i);
                i = (i + "").toLowerCase(), n = !0;
        }
    }
    h.prototype._isBuffer = !0;
    function I(i, r, t) {
        let n = i[r];
        i[r] = i[t], i[t] = n;
    }
    h.prototype.swap16 = function() {
        let r = this.length;
        if (r % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for(let t = 0; t < r; t += 2)I(this, t, t + 1);
        return this;
    };
    h.prototype.swap32 = function() {
        let r = this.length;
        if (r % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for(let t = 0; t < r; t += 4)I(this, t, t + 3), I(this, t + 1, t + 2);
        return this;
    };
    h.prototype.swap64 = function() {
        let r = this.length;
        if (r % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for(let t = 0; t < r; t += 8)I(this, t, t + 7), I(this, t + 1, t + 6), I(this, t + 2, t + 5), I(this, t + 3, t + 4);
        return this;
    };
    h.prototype.toString = function() {
        let r = this.length;
        return r === 0 ? "" : arguments.length === 0 ? fr(this, 0, r) : Pr.apply(this, arguments);
    };
    h.prototype.toLocaleString = h.prototype.toString;
    h.prototype.equals = function(r) {
        if (!h.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
        return this === r ? !0 : h.compare(this, r) === 0;
    };
    h.prototype.inspect = function() {
        let r = "", t = T.INSPECT_MAX_BYTES;
        return r = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (r += " ... "), "<Buffer " + r + ">";
    };
    rr && (h.prototype[rr] = h.prototype.inspect);
    h.prototype.compare = function(r, t, n, e, o) {
        if (E(r, Uint8Array) && (r = h.from(r, r.offset, r.byteLength)), !h.isBuffer(r)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r);
        if (t === void 0 && (t = 0), n === void 0 && (n = r ? r.length : 0), e === void 0 && (e = 0), o === void 0 && (o = this.length), t < 0 || n > r.length || e < 0 || o > this.length) throw new RangeError("out of range index");
        if (e >= o && t >= n) return 0;
        if (e >= o) return -1;
        if (t >= n) return 1;
        if (t >>>= 0, n >>>= 0, e >>>= 0, o >>>= 0, this === r) return 0;
        let u = o - e, f = n - t, c = Math.min(u, f), l = this.slice(e, o), s = r.slice(t, n);
        for(let p = 0; p < c; ++p)if (l[p] !== s[p]) {
            u = l[p], f = s[p];
            break;
        }
        return u < f ? -1 : f < u ? 1 : 0;
    };
    function hr(i, r, t, n, e) {
        if (i.length === 0) return -1;
        if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, X(t) && (t = e ? 0 : i.length - 1), t < 0 && (t = i.length + t), t >= i.length) {
            if (e) return -1;
            t = i.length - 1;
        } else if (t < 0) {
            if (e) t = 0;
            else return -1;
        }
        if (typeof r == "string" && (r = h.from(r, n)), h.isBuffer(r)) return r.length === 0 ? -1 : tr(i, r, t, n, e);
        if (typeof r == "number") return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? e ? Uint8Array.prototype.indexOf.call(i, r, t) : Uint8Array.prototype.lastIndexOf.call(i, r, t) : tr(i, [
            r
        ], t, n, e);
        throw new TypeError("val must be string, number or Buffer");
    }
    function tr(i, r, t, n, e) {
        let o = 1, u = i.length, f = r.length;
        if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
            if (i.length < 2 || r.length < 2) return -1;
            o = 2, u /= 2, f /= 2, t /= 2;
        }
        function c(s, p) {
            return o === 1 ? s[p] : s.readUInt16BE(p * o);
        }
        let l;
        if (e) {
            let s = -1;
            for(l = t; l < u; l++)if (c(i, l) === c(r, s === -1 ? 0 : l - s)) {
                if (s === -1 && (s = l), l - s + 1 === f) return s * o;
            } else s !== -1 && (l -= l - s), s = -1;
        } else for(t + f > u && (t = u - f), l = t; l >= 0; l--){
            let s = !0;
            for(let p = 0; p < f; p++)if (c(i, l + p) !== c(r, p)) {
                s = !1;
                break;
            }
            if (s) return l;
        }
        return -1;
    }
    h.prototype.includes = function(r, t, n) {
        return this.indexOf(r, t, n) !== -1;
    };
    h.prototype.indexOf = function(r, t, n) {
        return hr(this, r, t, n, !0);
    };
    h.prototype.lastIndexOf = function(r, t, n) {
        return hr(this, r, t, n, !1);
    };
    function Or(i, r, t, n) {
        t = Number(t) || 0;
        let e = i.length - t;
        n ? (n = Number(n), n > e && (n = e)) : n = e;
        let o = r.length;
        n > o / 2 && (n = o / 2);
        let u;
        for(u = 0; u < n; ++u){
            let f = parseInt(r.substr(u * 2, 2), 16);
            if (X(f)) return u;
            i[t + u] = f;
        }
        return u;
    }
    function Gr(i, r, t, n) {
        return D(W(r, i.length - t), i, t, n);
    }
    function Yr(i, r, t, n) {
        return D(vr(r), i, t, n);
    }
    function qr(i, r, t, n) {
        return D(wr(r), i, t, n);
    }
    function Wr(i, r, t, n) {
        return D(rt(r, i.length - t), i, t, n);
    }
    h.prototype.write = function(r, t, n, e) {
        if (t === void 0) e = "utf8", n = this.length, t = 0;
        else if (n === void 0 && typeof t == "string") e = t, n = this.length, t = 0;
        else if (isFinite(t)) t = t >>> 0, isFinite(n) ? (n = n >>> 0, e === void 0 && (e = "utf8")) : (e = n, n = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let o = this.length - t;
        if ((n === void 0 || n > o) && (n = o), r.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        e || (e = "utf8");
        let u = !1;
        for(;;)switch(e){
            case "hex":
                return Or(this, r, t, n);
            case "utf8":
            case "utf-8":
                return Gr(this, r, t, n);
            case "ascii":
            case "latin1":
            case "binary":
                return Yr(this, r, t, n);
            case "base64":
                return qr(this, r, t, n);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return Wr(this, r, t, n);
            default:
                if (u) throw new TypeError("Unknown encoding: " + e);
                e = ("" + e).toLowerCase(), u = !0;
        }
    };
    h.prototype.toJSON = function() {
        return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
        };
    };
    function jr(i, r, t) {
        return r === 0 && t === i.length ? G.fromByteArray(i) : G.fromByteArray(i.slice(r, t));
    }
    function fr(i, r, t) {
        t = Math.min(i.length, t);
        let n = [], e = r;
        for(; e < t;){
            let o = i[e], u = null, f = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
            if (e + f <= t) {
                let c, l, s, p;
                switch(f){
                    case 1:
                        o < 128 && (u = o);
                        break;
                    case 2:
                        c = i[e + 1], (c & 192) === 128 && (p = (o & 31) << 6 | c & 63, p > 127 && (u = p));
                        break;
                    case 3:
                        c = i[e + 1], l = i[e + 2], (c & 192) === 128 && (l & 192) === 128 && (p = (o & 15) << 12 | (c & 63) << 6 | l & 63, p > 2047 && (p < 55296 || p > 57343) && (u = p));
                        break;
                    case 4:
                        c = i[e + 1], l = i[e + 2], s = i[e + 3], (c & 192) === 128 && (l & 192) === 128 && (s & 192) === 128 && (p = (o & 15) << 18 | (c & 63) << 12 | (l & 63) << 6 | s & 63, p > 65535 && p < 1114112 && (u = p));
                }
            }
            u === null ? (u = 65533, f = 1) : u > 65535 && (u -= 65536, n.push(u >>> 10 & 1023 | 55296), u = 56320 | u & 1023), n.push(u), e += f;
        }
        return Hr(n);
    }
    var ir = 4096;
    function Hr(i) {
        let r = i.length;
        if (r <= ir) return String.fromCharCode.apply(String, i);
        let t = "", n = 0;
        for(; n < r;)t += String.fromCharCode.apply(String, i.slice(n, n += ir));
        return t;
    }
    function Vr(i, r, t) {
        let n = "";
        t = Math.min(i.length, t);
        for(let e = r; e < t; ++e)n += String.fromCharCode(i[e] & 127);
        return n;
    }
    function Xr(i, r, t) {
        let n = "";
        t = Math.min(i.length, t);
        for(let e = r; e < t; ++e)n += String.fromCharCode(i[e]);
        return n;
    }
    function zr(i, r, t) {
        let n = i.length;
        (!r || r < 0) && (r = 0), (!t || t < 0 || t > n) && (t = n);
        let e = "";
        for(let o = r; o < t; ++o)e += tt[i[o]];
        return e;
    }
    function Jr(i, r, t) {
        let n = i.slice(r, t), e = "";
        for(let o = 0; o < n.length - 1; o += 2)e += String.fromCharCode(n[o] + n[o + 1] * 256);
        return e;
    }
    h.prototype.slice = function(r, t) {
        let n = this.length;
        r = ~~r, t = t === void 0 ? n : ~~t, r < 0 ? (r += n, r < 0 && (r = 0)) : r > n && (r = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < r && (t = r);
        let e = this.subarray(r, t);
        return Object.setPrototypeOf(e, h.prototype), e;
    };
    function a(i, r, t) {
        if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
        if (i + r > t) throw new RangeError("Trying to access beyond buffer length");
    }
    h.prototype.readUintLE = h.prototype.readUIntLE = function(r, t, n) {
        r = r >>> 0, t = t >>> 0, n || a(r, t, this.length);
        let e = this[r], o = 1, u = 0;
        for(; ++u < t && (o *= 256);)e += this[r + u] * o;
        return e;
    };
    h.prototype.readUintBE = h.prototype.readUIntBE = function(r, t, n) {
        r = r >>> 0, t = t >>> 0, n || a(r, t, this.length);
        let e = this[r + --t], o = 1;
        for(; t > 0 && (o *= 256);)e += this[r + --t] * o;
        return e;
    };
    h.prototype.readUint8 = h.prototype.readUInt8 = function(r, t) {
        return r = r >>> 0, t || a(r, 1, this.length), this[r];
    };
    h.prototype.readUint16LE = h.prototype.readUInt16LE = function(r, t) {
        return r = r >>> 0, t || a(r, 2, this.length), this[r] | this[r + 1] << 8;
    };
    h.prototype.readUint16BE = h.prototype.readUInt16BE = function(r, t) {
        return r = r >>> 0, t || a(r, 2, this.length), this[r] << 8 | this[r + 1];
    };
    h.prototype.readUint32LE = h.prototype.readUInt32LE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
    };
    h.prototype.readUint32BE = h.prototype.readUInt32BE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
    };
    h.prototype.readBigUInt64LE = g(function(r) {
        r = r >>> 0, R(r, "offset");
        let t = this[r], n = this[r + 7];
        (t === void 0 || n === void 0) && _(r, this.length - 8);
        let e = t + this[++r] * 256 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, o = this[++r] + this[++r] * 256 + this[++r] * 2 ** 16 + n * 2 ** 24;
        return BigInt(e) + (BigInt(o) << BigInt(32));
    });
    h.prototype.readBigUInt64BE = g(function(r) {
        r = r >>> 0, R(r, "offset");
        let t = this[r], n = this[r + 7];
        (t === void 0 || n === void 0) && _(r, this.length - 8);
        let e = t * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 256 + this[++r], o = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 256 + n;
        return (BigInt(e) << BigInt(32)) + BigInt(o);
    });
    h.prototype.readIntLE = function(r, t, n) {
        r = r >>> 0, t = t >>> 0, n || a(r, t, this.length);
        let e = this[r], o = 1, u = 0;
        for(; ++u < t && (o *= 256);)e += this[r + u] * o;
        return o *= 128, e >= o && (e -= Math.pow(2, 8 * t)), e;
    };
    h.prototype.readIntBE = function(r, t, n) {
        r = r >>> 0, t = t >>> 0, n || a(r, t, this.length);
        let e = t, o = 1, u = this[r + --e];
        for(; e > 0 && (o *= 256);)u += this[r + --e] * o;
        return o *= 128, u >= o && (u -= Math.pow(2, 8 * t)), u;
    };
    h.prototype.readInt8 = function(r, t) {
        return r = r >>> 0, t || a(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
    };
    h.prototype.readInt16LE = function(r, t) {
        r = r >>> 0, t || a(r, 2, this.length);
        let n = this[r] | this[r + 1] << 8;
        return n & 32768 ? n | 4294901760 : n;
    };
    h.prototype.readInt16BE = function(r, t) {
        r = r >>> 0, t || a(r, 2, this.length);
        let n = this[r + 1] | this[r] << 8;
        return n & 32768 ? n | 4294901760 : n;
    };
    h.prototype.readInt32LE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
    };
    h.prototype.readInt32BE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
    };
    h.prototype.readBigInt64LE = g(function(r) {
        r = r >>> 0, R(r, "offset");
        let t = this[r], n = this[r + 7];
        (t === void 0 || n === void 0) && _(r, this.length - 8);
        let e = this[r + 4] + this[r + 5] * 256 + this[r + 6] * 2 ** 16 + (n << 24);
        return (BigInt(e) << BigInt(32)) + BigInt(t + this[++r] * 256 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
    });
    h.prototype.readBigInt64BE = g(function(r) {
        r = r >>> 0, R(r, "offset");
        let t = this[r], n = this[r + 7];
        (t === void 0 || n === void 0) && _(r, this.length - 8);
        let e = (t << 24) + this[++r] * 2 ** 16 + this[++r] * 256 + this[++r];
        return (BigInt(e) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 256 + n);
    });
    h.prototype.readFloatLE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), U.read(this, r, !0, 23, 4);
    };
    h.prototype.readFloatBE = function(r, t) {
        return r = r >>> 0, t || a(r, 4, this.length), U.read(this, r, !1, 23, 4);
    };
    h.prototype.readDoubleLE = function(r, t) {
        return r = r >>> 0, t || a(r, 8, this.length), U.read(this, r, !0, 52, 8);
    };
    h.prototype.readDoubleBE = function(r, t) {
        return r = r >>> 0, t || a(r, 8, this.length), U.read(this, r, !1, 52, 8);
    };
    function y(i, r, t, n, e, o) {
        if (!h.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (r > e || r < o) throw new RangeError('"value" argument is out of bounds');
        if (t + n > i.length) throw new RangeError("Index out of range");
    }
    h.prototype.writeUintLE = h.prototype.writeUIntLE = function(r, t, n, e) {
        if (r = +r, t = t >>> 0, n = n >>> 0, !e) {
            let f = Math.pow(2, 8 * n) - 1;
            y(this, r, t, n, f, 0);
        }
        let o = 1, u = 0;
        for(this[t] = r & 255; ++u < n && (o *= 256);)this[t + u] = r / o & 255;
        return t + n;
    };
    h.prototype.writeUintBE = h.prototype.writeUIntBE = function(r, t, n, e) {
        if (r = +r, t = t >>> 0, n = n >>> 0, !e) {
            let f = Math.pow(2, 8 * n) - 1;
            y(this, r, t, n, f, 0);
        }
        let o = n - 1, u = 1;
        for(this[t + o] = r & 255; --o >= 0 && (u *= 256);)this[t + o] = r / u & 255;
        return t + n;
    };
    h.prototype.writeUint8 = h.prototype.writeUInt8 = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 1, 255, 0), this[t] = r & 255, t + 1;
    };
    h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 2, 65535, 0), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
    };
    h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 2, 65535, 0), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
    };
    h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 4, 4294967295, 0), this[t + 3] = r >>> 24, this[t + 2] = r >>> 16, this[t + 1] = r >>> 8, this[t] = r & 255, t + 4;
    };
    h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 4, 4294967295, 0), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
    };
    function cr(i, r, t, n, e) {
        yr(r, n, e, i, t, 7);
        let o = Number(r & BigInt(4294967295));
        i[t++] = o, o = o >> 8, i[t++] = o, o = o >> 8, i[t++] = o, o = o >> 8, i[t++] = o;
        let u = Number(r >> BigInt(32) & BigInt(4294967295));
        return i[t++] = u, u = u >> 8, i[t++] = u, u = u >> 8, i[t++] = u, u = u >> 8, i[t++] = u, t;
    }
    function pr(i, r, t, n, e) {
        yr(r, n, e, i, t, 7);
        let o = Number(r & BigInt(4294967295));
        i[t + 7] = o, o = o >> 8, i[t + 6] = o, o = o >> 8, i[t + 5] = o, o = o >> 8, i[t + 4] = o;
        let u = Number(r >> BigInt(32) & BigInt(4294967295));
        return i[t + 3] = u, u = u >> 8, i[t + 2] = u, u = u >> 8, i[t + 1] = u, u = u >> 8, i[t] = u, t + 8;
    }
    h.prototype.writeBigUInt64LE = g(function(r, t = 0) {
        return cr(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    h.prototype.writeBigUInt64BE = g(function(r, t = 0) {
        return pr(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    h.prototype.writeIntLE = function(r, t, n, e) {
        if (r = +r, t = t >>> 0, !e) {
            let c = Math.pow(2, 8 * n - 1);
            y(this, r, t, n, c - 1, -c);
        }
        let o = 0, u = 1, f = 0;
        for(this[t] = r & 255; ++o < n && (u *= 256);)r < 0 && f === 0 && this[t + o - 1] !== 0 && (f = 1), this[t + o] = (r / u >> 0) - f & 255;
        return t + n;
    };
    h.prototype.writeIntBE = function(r, t, n, e) {
        if (r = +r, t = t >>> 0, !e) {
            let c = Math.pow(2, 8 * n - 1);
            y(this, r, t, n, c - 1, -c);
        }
        let o = n - 1, u = 1, f = 0;
        for(this[t + o] = r & 255; --o >= 0 && (u *= 256);)r < 0 && f === 0 && this[t + o + 1] !== 0 && (f = 1), this[t + o] = (r / u >> 0) - f & 255;
        return t + n;
    };
    h.prototype.writeInt8 = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[t] = r & 255, t + 1;
    };
    h.prototype.writeInt16LE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 2, 32767, -32768), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
    };
    h.prototype.writeInt16BE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 2, 32767, -32768), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
    };
    h.prototype.writeInt32LE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 4, 2147483647, -2147483648), this[t] = r & 255, this[t + 1] = r >>> 8, this[t + 2] = r >>> 16, this[t + 3] = r >>> 24, t + 4;
    };
    h.prototype.writeInt32BE = function(r, t, n) {
        return r = +r, t = t >>> 0, n || y(this, r, t, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
    };
    h.prototype.writeBigInt64LE = g(function(r, t = 0) {
        return cr(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    h.prototype.writeBigInt64BE = g(function(r, t = 0) {
        return pr(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function sr(i, r, t, n, e, o) {
        if (t + n > i.length) throw new RangeError("Index out of range");
        if (t < 0) throw new RangeError("Index out of range");
    }
    function lr(i, r, t, n, e) {
        return r = +r, t = t >>> 0, e || sr(i, r, t, 4, 34028234663852886e22, -340282346638528860000000000000000000000), U.write(i, r, t, n, 23, 4), t + 4;
    }
    h.prototype.writeFloatLE = function(r, t, n) {
        return lr(this, r, t, !0, n);
    };
    h.prototype.writeFloatBE = function(r, t, n) {
        return lr(this, r, t, !1, n);
    };
    function ar(i, r, t, n, e) {
        return r = +r, t = t >>> 0, e || sr(i, r, t, 8, 17976931348623157e292, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), U.write(i, r, t, n, 52, 8), t + 8;
    }
    h.prototype.writeDoubleLE = function(r, t, n) {
        return ar(this, r, t, !0, n);
    };
    h.prototype.writeDoubleBE = function(r, t, n) {
        return ar(this, r, t, !1, n);
    };
    h.prototype.copy = function(r, t, n, e) {
        if (!h.isBuffer(r)) throw new TypeError("argument should be a Buffer");
        if (n || (n = 0), !e && e !== 0 && (e = this.length), t >= r.length && (t = r.length), t || (t = 0), e > 0 && e < n && (e = n), e === n || r.length === 0 || this.length === 0) return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
        if (e < 0) throw new RangeError("sourceEnd out of bounds");
        e > this.length && (e = this.length), r.length - t < e - n && (e = r.length - t + n);
        let o = e - n;
        return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, e) : Uint8Array.prototype.set.call(r, this.subarray(n, e), t), o;
    };
    h.prototype.fill = function(r, t, n, e) {
        if (typeof r == "string") {
            if (typeof t == "string" ? (e = t, t = 0, n = this.length) : typeof n == "string" && (e = n, n = this.length), e !== void 0 && typeof e != "string") throw new TypeError("encoding must be a string");
            if (typeof e == "string" && !h.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
            if (r.length === 1) {
                let u = r.charCodeAt(0);
                (e === "utf8" && u < 128 || e === "latin1") && (r = u);
            }
        } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
        if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
        if (n <= t) return this;
        t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, r || (r = 0);
        let o;
        if (typeof r == "number") for(o = t; o < n; ++o)this[o] = r;
        else {
            let u = h.isBuffer(r) ? r : h.from(r, e), f = u.length;
            if (f === 0) throw new TypeError('The value "' + r + '" is invalid for argument "value"');
            for(o = 0; o < n - t; ++o)this[o + t] = u[o % f];
        }
        return this;
    };
    var A = {};
    function V(i, r, t) {
        A[i] = class extends t {
            constructor(){
                super(), Object.defineProperty(this, "message", {
                    value: r.apply(this, arguments),
                    writable: !0,
                    configurable: !0
                }), this.name = "".concat(this.name, " [").concat(i, "]"), this.stack, delete this.name;
            }
            get code() {
                return i;
            }
            set code(e) {
                Object.defineProperty(this, "code", {
                    configurable: !0,
                    enumerable: !0,
                    value: e,
                    writable: !0
                });
            }
            toString() {
                return "".concat(this.name, " [").concat(i, "]: ").concat(this.message);
            }
        };
    }
    V("ERR_BUFFER_OUT_OF_BOUNDS", function(i) {
        return i ? "".concat(i, " is outside of buffer bounds") : "Attempt to access memory outside buffer bounds";
    }, RangeError);
    V("ERR_INVALID_ARG_TYPE", function(i, r) {
        return 'The "'.concat(i, '" argument must be of type number. Received type ').concat(typeof r);
    }, TypeError);
    V("ERR_OUT_OF_RANGE", function(i, r, t) {
        let n = 'The value of "'.concat(i, '" is out of range.'), e = t;
        return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? e = nr(String(t)) : typeof t == "bigint" && (e = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (e = nr(e)), e += "n"), n += " It must be ".concat(r, ". Received ").concat(e), n;
    }, RangeError);
    function nr(i) {
        let r = "", t = i.length, n = i[0] === "-" ? 1 : 0;
        for(; t >= n + 4; t -= 3)r = "_".concat(i.slice(t - 3, t)).concat(r);
        return "".concat(i.slice(0, t)).concat(r);
    }
    function Kr(i, r, t) {
        R(r, "offset"), (i[r] === void 0 || i[r + t] === void 0) && _(r, i.length - (t + 1));
    }
    function yr(i, r, t, n, e, o) {
        if (i > t || i < r) {
            let u = typeof r == "bigint" ? "n" : "", f;
            throw o > 3 ? r === 0 || r === BigInt(0) ? f = ">= 0".concat(u, " and < 2").concat(u, " ** ").concat((o + 1) * 8).concat(u) : f = ">= -(2".concat(u, " ** ").concat((o + 1) * 8 - 1).concat(u, ") and < 2 ** ") + "".concat((o + 1) * 8 - 1).concat(u) : f = ">= ".concat(r).concat(u, " and <= ").concat(t).concat(u), new A.ERR_OUT_OF_RANGE("value", f, i);
        }
        Kr(n, e, o);
    }
    function R(i, r) {
        if (typeof i != "number") throw new A.ERR_INVALID_ARG_TYPE(r, "number", i);
    }
    function _(i, r, t) {
        throw Math.floor(i) !== i ? (R(i, t), new A.ERR_OUT_OF_RANGE(t || "offset", "an integer", i)) : r < 0 ? new A.ERR_BUFFER_OUT_OF_BOUNDS : new A.ERR_OUT_OF_RANGE(t || "offset", ">= ".concat(t ? 1 : 0, " and <= ").concat(r), i);
    }
    var Zr = /[^+/0-9A-Za-z-_]/g;
    function Qr(i) {
        if (i = i.split("=")[0], i = i.trim().replace(Zr, ""), i.length < 2) return "";
        for(; i.length % 4 !== 0;)i = i + "=";
        return i;
    }
    function W(i, r) {
        r = r || 1 / 0;
        let t, n = i.length, e = null, o = [];
        for(let u = 0; u < n; ++u){
            if (t = i.charCodeAt(u), t > 55295 && t < 57344) {
                if (!e) {
                    if (t > 56319) {
                        (r -= 3) > -1 && o.push(239, 191, 189);
                        continue;
                    } else if (u + 1 === n) {
                        (r -= 3) > -1 && o.push(239, 191, 189);
                        continue;
                    }
                    e = t;
                    continue;
                }
                if (t < 56320) {
                    (r -= 3) > -1 && o.push(239, 191, 189), e = t;
                    continue;
                }
                t = (e - 55296 << 10 | t - 56320) + 65536;
            } else e && (r -= 3) > -1 && o.push(239, 191, 189);
            if (e = null, t < 128) {
                if ((r -= 1) < 0) break;
                o.push(t);
            } else if (t < 2048) {
                if ((r -= 2) < 0) break;
                o.push(t >> 6 | 192, t & 63 | 128);
            } else if (t < 65536) {
                if ((r -= 3) < 0) break;
                o.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
            } else if (t < 1114112) {
                if ((r -= 4) < 0) break;
                o.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
            } else throw new Error("Invalid code point");
        }
        return o;
    }
    function vr(i) {
        let r = [];
        for(let t = 0; t < i.length; ++t)r.push(i.charCodeAt(t) & 255);
        return r;
    }
    function rt(i, r) {
        let t, n, e, o = [];
        for(let u = 0; u < i.length && !((r -= 2) < 0); ++u)t = i.charCodeAt(u), n = t >> 8, e = t % 256, o.push(e), o.push(n);
        return o;
    }
    function wr(i) {
        return G.toByteArray(Qr(i));
    }
    function D(i, r, t, n) {
        let e;
        for(e = 0; e < n && !(e + t >= r.length || e >= i.length); ++e)r[e + t] = i[e];
        return e;
    }
    function E(i, r) {
        return i instanceof r || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === r.name;
    }
    function X(i) {
        return i !== i;
    }
    var tt = function() {
        let i = "0123456789abcdef", r = new Array(256);
        for(let t = 0; t < 16; ++t){
            let n = t * 16;
            for(let e = 0; e < 16; ++e)r[n + e] = i[t] + i[e];
        }
        return r;
    }();
    function g(i) {
        return typeof BigInt > "u" ? it : i;
    }
    function it() {
        throw new Error("BigInt not supported");
    }
});
var C = {};
Fr(C, {
    default: ()=>nt
});
module.exports = Ar(C);
var xr = J(z());
S(C, J(z()), module.exports);
var nt = xr.default; /*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/ 

},{}],"l03yQ":[function(require,module,exports) {
"use strict";

},{}],"443xK":[function(require,module,exports) {
var process = require("e6abdd22e59f86f5");
var z = Object.create;
var b = Object.defineProperty;
var D = Object.getOwnPropertyDescriptor;
var T = Object.getOwnPropertyNames;
var R = Object.getPrototypeOf, _ = Object.prototype.hasOwnProperty;
var E = (t, e)=>()=>(e || t((e = {
            exports: {}
        }).exports, e), e.exports), J = (t, e)=>{
    for(var r in e)b(t, r, {
        get: e[r],
        enumerable: !0
    });
}, C = (t, e, r, l)=>{
    if (e && typeof e == "object" || typeof e == "function") for (let i of T(e))!_.call(t, i) && i !== r && b(t, i, {
        get: ()=>e[i],
        enumerable: !(l = D(e, i)) || l.enumerable
    });
    return t;
}, A = (t, e, r)=>(C(t, e, "default"), r && C(r, e, "default")), y = (t, e, r)=>(r = t != null ? z(R(t)) : {}, C(e || !t || !t.__esModule ? b(r, "default", {
        value: t,
        enumerable: !0
    }) : r, t)), q = (t)=>C(b({}, "__esModule", {
        value: !0
    }), t);
var h = E((H, S)=>{
    "use strict";
    function c(t) {
        if (typeof t != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(t));
    }
    function w(t, e) {
        for(var r = "", l = 0, i = -1, s = 0, n, f = 0; f <= t.length; ++f){
            if (f < t.length) n = t.charCodeAt(f);
            else {
                if (n === 47) break;
                n = 47;
            }
            if (n === 47) {
                if (!(i === f - 1 || s === 1)) {
                    if (i !== f - 1 && s === 2) {
                        if (r.length < 2 || l !== 2 || r.charCodeAt(r.length - 1) !== 46 || r.charCodeAt(r.length - 2) !== 46) {
                            if (r.length > 2) {
                                var a = r.lastIndexOf("/");
                                if (a !== r.length - 1) {
                                    a === -1 ? (r = "", l = 0) : (r = r.slice(0, a), l = r.length - 1 - r.lastIndexOf("/")), i = f, s = 0;
                                    continue;
                                }
                            } else if (r.length === 2 || r.length === 1) {
                                r = "", l = 0, i = f, s = 0;
                                continue;
                            }
                        }
                        e && (r.length > 0 ? r += "/.." : r = "..", l = 2);
                    } else r.length > 0 ? r += "/" + t.slice(i + 1, f) : r = t.slice(i + 1, f), l = f - i - 1;
                }
                i = f, s = 0;
            } else n === 46 && s !== -1 ? ++s : s = -1;
        }
        return r;
    }
    function B(t, e) {
        var r = e.dir || e.root, l = e.base || (e.name || "") + (e.ext || "");
        return r ? r === e.root ? r + l : r + t + l : l;
    }
    var g = {
        resolve: function() {
            for(var e = "", r = !1, l, i = arguments.length - 1; i >= -1 && !r; i--){
                var s;
                i >= 0 ? s = arguments[i] : (l === void 0 && (l = process.cwd()), s = l), c(s), s.length !== 0 && (e = s + "/" + e, r = s.charCodeAt(0) === 47);
            }
            return e = w(e, !r), r ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
        },
        normalize: function(e) {
            if (c(e), e.length === 0) return ".";
            var r = e.charCodeAt(0) === 47, l = e.charCodeAt(e.length - 1) === 47;
            return e = w(e, !r), e.length === 0 && !r && (e = "."), e.length > 0 && l && (e += "/"), r ? "/" + e : e;
        },
        isAbsolute: function(e) {
            return c(e), e.length > 0 && e.charCodeAt(0) === 47;
        },
        join: function() {
            if (arguments.length === 0) return ".";
            for(var e, r = 0; r < arguments.length; ++r){
                var l = arguments[r];
                c(l), l.length > 0 && (e === void 0 ? e = l : e += "/" + l);
            }
            return e === void 0 ? "." : g.normalize(e);
        },
        relative: function(e, r) {
            if (c(e), c(r), e === r || (e = g.resolve(e), r = g.resolve(r), e === r)) return "";
            for(var l = 1; l < e.length && e.charCodeAt(l) === 47; ++l);
            for(var i = e.length, s = i - l, n = 1; n < r.length && r.charCodeAt(n) === 47; ++n);
            for(var f = r.length, a = f - n, v = s < a ? s : a, u = -1, o = 0; o <= v; ++o){
                if (o === v) {
                    if (a > v) {
                        if (r.charCodeAt(n + o) === 47) return r.slice(n + o + 1);
                        if (o === 0) return r.slice(n + o);
                    } else s > v && (e.charCodeAt(l + o) === 47 ? u = o : o === 0 && (u = 0));
                    break;
                }
                var k = e.charCodeAt(l + o), L = r.charCodeAt(n + o);
                if (k !== L) break;
                k === 47 && (u = o);
            }
            var m = "";
            for(o = l + u + 1; o <= i; ++o)(o === i || e.charCodeAt(o) === 47) && (m.length === 0 ? m += ".." : m += "/..");
            return m.length > 0 ? m + r.slice(n + u) : (n += u, r.charCodeAt(n) === 47 && ++n, r.slice(n));
        },
        _makeLong: function(e) {
            return e;
        },
        dirname: function(e) {
            if (c(e), e.length === 0) return ".";
            for(var r = e.charCodeAt(0), l = r === 47, i = -1, s = !0, n = e.length - 1; n >= 1; --n)if (r = e.charCodeAt(n), r === 47) {
                if (!s) {
                    i = n;
                    break;
                }
            } else s = !1;
            return i === -1 ? l ? "/" : "." : l && i === 1 ? "//" : e.slice(0, i);
        },
        basename: function(e, r) {
            if (r !== void 0 && typeof r != "string") throw new TypeError('"ext" argument must be a string');
            c(e);
            var l = 0, i = -1, s = !0, n;
            if (r !== void 0 && r.length > 0 && r.length <= e.length) {
                if (r.length === e.length && r === e) return "";
                var f = r.length - 1, a = -1;
                for(n = e.length - 1; n >= 0; --n){
                    var v = e.charCodeAt(n);
                    if (v === 47) {
                        if (!s) {
                            l = n + 1;
                            break;
                        }
                    } else a === -1 && (s = !1, a = n + 1), f >= 0 && (v === r.charCodeAt(f) ? --f === -1 && (i = n) : (f = -1, i = a));
                }
                return l === i ? i = a : i === -1 && (i = e.length), e.slice(l, i);
            } else {
                for(n = e.length - 1; n >= 0; --n)if (e.charCodeAt(n) === 47) {
                    if (!s) {
                        l = n + 1;
                        break;
                    }
                } else i === -1 && (s = !1, i = n + 1);
                return i === -1 ? "" : e.slice(l, i);
            }
        },
        extname: function(e) {
            c(e);
            for(var r = -1, l = 0, i = -1, s = !0, n = 0, f = e.length - 1; f >= 0; --f){
                var a = e.charCodeAt(f);
                if (a === 47) {
                    if (!s) {
                        l = f + 1;
                        break;
                    }
                    continue;
                }
                i === -1 && (s = !1, i = f + 1), a === 46 ? r === -1 ? r = f : n !== 1 && (n = 1) : r !== -1 && (n = -1);
            }
            return r === -1 || i === -1 || n === 0 || n === 1 && r === i - 1 && r === l + 1 ? "" : e.slice(r, i);
        },
        format: function(e) {
            if (e === null || typeof e != "object") throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
            return B("/", e);
        },
        parse: function(e) {
            c(e);
            var r = {
                root: "",
                dir: "",
                base: "",
                ext: "",
                name: ""
            };
            if (e.length === 0) return r;
            var l = e.charCodeAt(0), i = l === 47, s;
            i ? (r.root = "/", s = 1) : s = 0;
            for(var n = -1, f = 0, a = -1, v = !0, u = e.length - 1, o = 0; u >= s; --u){
                if (l = e.charCodeAt(u), l === 47) {
                    if (!v) {
                        f = u + 1;
                        break;
                    }
                    continue;
                }
                a === -1 && (v = !1, a = u + 1), l === 46 ? n === -1 ? n = u : o !== 1 && (o = 1) : n !== -1 && (o = -1);
            }
            return n === -1 || a === -1 || o === 0 || o === 1 && n === a - 1 && n === f + 1 ? a !== -1 && (f === 0 && i ? r.base = r.name = e.slice(1, a) : r.base = r.name = e.slice(f, a)) : (f === 0 && i ? (r.name = e.slice(1, n), r.base = e.slice(1, a)) : (r.name = e.slice(f, n), r.base = e.slice(f, a)), r.ext = e.slice(n, a)), f > 0 ? r.dir = e.slice(0, f - 1) : i && (r.dir = "/"), r;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
    };
    g.posix = g;
    S.exports = g;
});
var d = {};
J(d, {
    default: ()=>F
});
module.exports = q(d);
var P = y(h());
A(d, y(h()), module.exports);
var F = P.default;

},{"e6abdd22e59f86f5":"cjohZ"}],"lUVO2":[function(require,module,exports) {
var global = arguments[3];
var process = require("f285af6632f81b54");
var Buffer = require("f9809d376a0552f8").Buffer;
var Fp = Object.create;
var bf = Object.defineProperty;
var Up = Object.getOwnPropertyDescriptor;
var zp = Object.getOwnPropertyNames;
var Hp = Object.getPrototypeOf, jp = Object.prototype.hasOwnProperty;
var q = (t, e)=>()=>(e || t((e = {
            exports: {}
        }).exports, e), e.exports), Kp = (t, e)=>{
    for(var r in e)bf(t, r, {
        get: e[r],
        enumerable: !0
    });
}, pf = (t, e, r, i)=>{
    if (e && typeof e == "object" || typeof e == "function") for (let n of zp(e))!jp.call(t, n) && n !== r && bf(t, n, {
        get: ()=>e[n],
        enumerable: !(i = Up(e, n)) || i.enumerable
    });
    return t;
}, En = (t, e, r)=>(pf(t, e, "default"), r && pf(r, e, "default")), ks = (t, e, r)=>(r = t != null ? Fp(Hp(t)) : {}, pf(e || !t || !t.__esModule ? bf(r, "default", {
        value: t,
        enumerable: !0
    }) : r, t)), Wp = (t)=>pf(bf({}, "__esModule", {
        value: !0
    }), t);
var Ps = q((vf)=>{
    "use strict";
    vf.byteLength = Gp;
    vf.toByteArray = Xp;
    vf.fromByteArray = $p;
    var jt = [], pt = [], Vp = typeof Uint8Array < "u" ? Uint8Array : Array, Qa = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(Gr = 0, Cs = Qa.length; Gr < Cs; ++Gr)jt[Gr] = Qa[Gr], pt[Qa.charCodeAt(Gr)] = Gr;
    var Gr, Cs;
    pt["-".charCodeAt(0)] = 62;
    pt["_".charCodeAt(0)] = 63;
    function Ts(t) {
        var e = t.length;
        if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var r = t.indexOf("=");
        r === -1 && (r = e);
        var i = r === e ? 0 : 4 - r % 4;
        return [
            r,
            i
        ];
    }
    function Gp(t) {
        var e = Ts(t), r = e[0], i = e[1];
        return (r + i) * 3 / 4 - i;
    }
    function Zp(t, e, r) {
        return (e + r) * 3 / 4 - r;
    }
    function Xp(t) {
        var e, r = Ts(t), i = r[0], n = r[1], f = new Vp(Zp(t, i, n)), o = 0, u = n > 0 ? i - 4 : i, v;
        for(v = 0; v < u; v += 4)e = pt[t.charCodeAt(v)] << 18 | pt[t.charCodeAt(v + 1)] << 12 | pt[t.charCodeAt(v + 2)] << 6 | pt[t.charCodeAt(v + 3)], f[o++] = e >> 16 & 255, f[o++] = e >> 8 & 255, f[o++] = e & 255;
        return n === 2 && (e = pt[t.charCodeAt(v)] << 2 | pt[t.charCodeAt(v + 1)] >> 4, f[o++] = e & 255), n === 1 && (e = pt[t.charCodeAt(v)] << 10 | pt[t.charCodeAt(v + 1)] << 4 | pt[t.charCodeAt(v + 2)] >> 2, f[o++] = e >> 8 & 255, f[o++] = e & 255), f;
    }
    function Yp(t) {
        return jt[t >> 18 & 63] + jt[t >> 12 & 63] + jt[t >> 6 & 63] + jt[t & 63];
    }
    function Jp(t, e, r) {
        for(var i, n = [], f = e; f < r; f += 3)i = (t[f] << 16 & 16711680) + (t[f + 1] << 8 & 65280) + (t[f + 2] & 255), n.push(Yp(i));
        return n.join("");
    }
    function $p(t) {
        for(var e, r = t.length, i = r % 3, n = [], f = 16383, o = 0, u = r - i; o < u; o += f)n.push(Jp(t, o, o + f > u ? u : o + f));
        return i === 1 ? (e = t[r - 1], n.push(jt[e >> 2] + jt[e << 4 & 63] + "==")) : i === 2 && (e = (t[r - 2] << 8) + t[r - 1], n.push(jt[e >> 10] + jt[e >> 4 & 63] + jt[e << 2 & 63] + "=")), n.join("");
    }
});
var Ds = q((e0)=>{
    e0.read = function(t, e, r, i, n) {
        var f, o, u = n * 8 - i - 1, v = (1 << u) - 1, _ = v >> 1, x = -7, S = r ? n - 1 : 0, A = r ? -1 : 1, B = t[e + S];
        for(S += A, f = B & (1 << -x) - 1, B >>= -x, x += u; x > 0; f = f * 256 + t[e + S], S += A, x -= 8);
        for(o = f & (1 << -x) - 1, f >>= -x, x += i; x > 0; o = o * 256 + t[e + S], S += A, x -= 8);
        if (f === 0) f = 1 - _;
        else {
            if (f === v) return o ? NaN : (B ? -1 : 1) * (1 / 0);
            o = o + Math.pow(2, i), f = f - _;
        }
        return (B ? -1 : 1) * o * Math.pow(2, f - i);
    };
    e0.write = function(t, e, r, i, n, f) {
        var o, u, v, _ = f * 8 - n - 1, x = (1 << _) - 1, S = x >> 1, A = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, B = i ? 0 : f - 1, I = i ? 1 : -1, P = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
        for(e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = x) : (o = Math.floor(Math.log(e) / Math.LN2), e * (v = Math.pow(2, -o)) < 1 && (o--, v *= 2), o + S >= 1 ? e += A / v : e += A * Math.pow(2, 1 - S), e * v >= 2 && (o++, v /= 2), o + S >= x ? (u = 0, o = x) : o + S >= 1 ? (u = (e * v - 1) * Math.pow(2, n), o = o + S) : (u = e * Math.pow(2, S - 1) * Math.pow(2, n), o = 0)); n >= 8; t[r + B] = u & 255, B += I, u /= 256, n -= 8);
        for(o = o << n | u, _ += n; _ > 0; t[r + B] = o & 255, B += I, o /= 256, _ -= 8);
        t[r + B - I] |= P * 128;
    };
});
var Xr = q((qi)=>{
    "use strict";
    var t0 = Ps(), Ai = Ds(), Ls = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    qi.Buffer = R;
    qi.SlowBuffer = n2;
    qi.INSPECT_MAX_BYTES = 50;
    var yf = 2147483647;
    qi.kMaxLength = yf;
    R.TYPED_ARRAY_SUPPORT = Qp();
    !R.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    function Qp() {
        try {
            let t = new Uint8Array(1), e = {
                foo: function() {
                    return 42;
                }
            };
            return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(t, e), t.foo() === 42;
        } catch (t) {
            return !1;
        }
    }
    Object.defineProperty(R.prototype, "parent", {
        enumerable: !0,
        get: function() {
            if (R.isBuffer(this)) return this.buffer;
        }
    });
    Object.defineProperty(R.prototype, "offset", {
        enumerable: !0,
        get: function() {
            if (R.isBuffer(this)) return this.byteOffset;
        }
    });
    function rr(t) {
        if (t > yf) throw new RangeError('The value "' + t + '" is invalid for option "size"');
        let e = new Uint8Array(t);
        return Object.setPrototypeOf(e, R.prototype), e;
    }
    function R(t, e, r) {
        if (typeof t == "number") {
            if (typeof e == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
            return f0(t);
        }
        return Us(t, e, r);
    }
    R.poolSize = 8192;
    function Us(t, e, r) {
        if (typeof t == "string") return t2(t, e);
        if (ArrayBuffer.isView(t)) return r2(t);
        if (t == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
        if (Kt(t, ArrayBuffer) || t && Kt(t.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Kt(t, SharedArrayBuffer) || t && Kt(t.buffer, SharedArrayBuffer))) return i0(t, e, r);
        if (typeof t == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        let i = t.valueOf && t.valueOf();
        if (i != null && i !== t) return R.from(i, e, r);
        let n = i2(t);
        if (n) return n;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof t[Symbol.toPrimitive] == "function") return R.from(t[Symbol.toPrimitive]("string"), e, r);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
    }
    R.from = function(t, e, r) {
        return Us(t, e, r);
    };
    Object.setPrototypeOf(R.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(R, Uint8Array);
    function zs(t) {
        if (typeof t != "number") throw new TypeError('"size" argument must be of type number');
        if (t < 0) throw new RangeError('The value "' + t + '" is invalid for option "size"');
    }
    function e2(t, e, r) {
        return zs(t), t <= 0 ? rr(t) : e !== void 0 ? typeof r == "string" ? rr(t).fill(e, r) : rr(t).fill(e) : rr(t);
    }
    R.alloc = function(t, e, r) {
        return e2(t, e, r);
    };
    function f0(t) {
        return zs(t), rr(t < 0 ? 0 : a0(t) | 0);
    }
    R.allocUnsafe = function(t) {
        return f0(t);
    };
    R.allocUnsafeSlow = function(t) {
        return f0(t);
    };
    function t2(t, e) {
        if ((typeof e != "string" || e === "") && (e = "utf8"), !R.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
        let r = Hs(t, e) | 0, i = rr(r), n = i.write(t, e);
        return n !== r && (i = i.slice(0, n)), i;
    }
    function r0(t) {
        let e = t.length < 0 ? 0 : a0(t.length) | 0, r = rr(e);
        for(let i = 0; i < e; i += 1)r[i] = t[i] & 255;
        return r;
    }
    function r2(t) {
        if (Kt(t, Uint8Array)) {
            let e = new Uint8Array(t);
            return i0(e.buffer, e.byteOffset, e.byteLength);
        }
        return r0(t);
    }
    function i0(t, e, r) {
        if (e < 0 || t.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
        if (t.byteLength < e + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let i;
        return e === void 0 && r === void 0 ? i = new Uint8Array(t) : r === void 0 ? i = new Uint8Array(t, e) : i = new Uint8Array(t, e, r), Object.setPrototypeOf(i, R.prototype), i;
    }
    function i2(t) {
        if (R.isBuffer(t)) {
            let e = a0(t.length) | 0, r = rr(e);
            return r.length === 0 || t.copy(r, 0, 0, e), r;
        }
        if (t.length !== void 0) return typeof t.length != "number" || s0(t.length) ? rr(0) : r0(t);
        if (t.type === "Buffer" && Array.isArray(t.data)) return r0(t.data);
    }
    function a0(t) {
        if (t >= yf) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + yf.toString(16) + " bytes");
        return t | 0;
    }
    function n2(t) {
        return +t != t && (t = 0), R.alloc(+t);
    }
    R.isBuffer = function(e) {
        return e != null && e._isBuffer === !0 && e !== R.prototype;
    };
    R.compare = function(e, r) {
        if (Kt(e, Uint8Array) && (e = R.from(e, e.offset, e.byteLength)), Kt(r, Uint8Array) && (r = R.from(r, r.offset, r.byteLength)), !R.isBuffer(e) || !R.isBuffer(r)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === r) return 0;
        let i = e.length, n = r.length;
        for(let f = 0, o = Math.min(i, n); f < o; ++f)if (e[f] !== r[f]) {
            i = e[f], n = r[f];
            break;
        }
        return i < n ? -1 : n < i ? 1 : 0;
    };
    R.isEncoding = function(e) {
        switch(String(e).toLowerCase()){
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1;
        }
    };
    R.concat = function(e, r) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0) return R.alloc(0);
        let i;
        if (r === void 0) for(r = 0, i = 0; i < e.length; ++i)r += e[i].length;
        let n = R.allocUnsafe(r), f = 0;
        for(i = 0; i < e.length; ++i){
            let o = e[i];
            if (Kt(o, Uint8Array)) f + o.length > n.length ? (R.isBuffer(o) || (o = R.from(o)), o.copy(n, f)) : Uint8Array.prototype.set.call(n, o, f);
            else if (R.isBuffer(o)) o.copy(n, f);
            else throw new TypeError('"list" argument must be an Array of Buffers');
            f += o.length;
        }
        return n;
    };
    function Hs(t, e) {
        if (R.isBuffer(t)) return t.length;
        if (ArrayBuffer.isView(t) || Kt(t, ArrayBuffer)) return t.byteLength;
        if (typeof t != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
        let r = t.length, i = arguments.length > 2 && arguments[2] === !0;
        if (!i && r === 0) return 0;
        let n = !1;
        for(;;)switch(e){
            case "ascii":
            case "latin1":
            case "binary":
                return r;
            case "utf8":
            case "utf-8":
                return n0(t).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return r * 2;
            case "hex":
                return r >>> 1;
            case "base64":
                return Js(t).length;
            default:
                if (n) return i ? -1 : n0(t).length;
                e = ("" + e).toLowerCase(), n = !0;
        }
    }
    R.byteLength = Hs;
    function f2(t, e, r) {
        let i = !1;
        if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, e >>>= 0, r <= e)) return "";
        for(t || (t = "utf8");;)switch(t){
            case "hex":
                return b2(this, e, r);
            case "utf8":
            case "utf-8":
                return Ks(this, e, r);
            case "ascii":
                return l2(this, e, r);
            case "latin1":
            case "binary":
                return p2(this, e, r);
            case "base64":
                return u2(this, e, r);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return v2(this, e, r);
            default:
                if (i) throw new TypeError("Unknown encoding: " + t);
                t = (t + "").toLowerCase(), i = !0;
        }
    }
    R.prototype._isBuffer = !0;
    function Zr(t, e, r) {
        let i = t[e];
        t[e] = t[r], t[r] = i;
    }
    R.prototype.swap16 = function() {
        let e = this.length;
        if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for(let r = 0; r < e; r += 2)Zr(this, r, r + 1);
        return this;
    };
    R.prototype.swap32 = function() {
        let e = this.length;
        if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for(let r = 0; r < e; r += 4)Zr(this, r, r + 3), Zr(this, r + 1, r + 2);
        return this;
    };
    R.prototype.swap64 = function() {
        let e = this.length;
        if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for(let r = 0; r < e; r += 8)Zr(this, r, r + 7), Zr(this, r + 1, r + 6), Zr(this, r + 2, r + 5), Zr(this, r + 3, r + 4);
        return this;
    };
    R.prototype.toString = function() {
        let e = this.length;
        return e === 0 ? "" : arguments.length === 0 ? Ks(this, 0, e) : f2.apply(this, arguments);
    };
    R.prototype.toLocaleString = R.prototype.toString;
    R.prototype.equals = function(e) {
        if (!R.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e ? !0 : R.compare(this, e) === 0;
    };
    R.prototype.inspect = function() {
        let e = "", r = qi.INSPECT_MAX_BYTES;
        return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">";
    };
    Ls && (R.prototype[Ls] = R.prototype.inspect);
    R.prototype.compare = function(e, r, i, n, f) {
        if (Kt(e, Uint8Array) && (e = R.from(e, e.offset, e.byteLength)), !R.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (r === void 0 && (r = 0), i === void 0 && (i = e ? e.length : 0), n === void 0 && (n = 0), f === void 0 && (f = this.length), r < 0 || i > e.length || n < 0 || f > this.length) throw new RangeError("out of range index");
        if (n >= f && r >= i) return 0;
        if (n >= f) return -1;
        if (r >= i) return 1;
        if (r >>>= 0, i >>>= 0, n >>>= 0, f >>>= 0, this === e) return 0;
        let o = f - n, u = i - r, v = Math.min(o, u), _ = this.slice(n, f), x = e.slice(r, i);
        for(let S = 0; S < v; ++S)if (_[S] !== x[S]) {
            o = _[S], u = x[S];
            break;
        }
        return o < u ? -1 : u < o ? 1 : 0;
    };
    function js(t, e, r, i, n) {
        if (t.length === 0) return -1;
        if (typeof r == "string" ? (i = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, s0(r) && (r = n ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
            if (n) return -1;
            r = t.length - 1;
        } else if (r < 0) {
            if (n) r = 0;
            else return -1;
        }
        if (typeof e == "string" && (e = R.from(e, i)), R.isBuffer(e)) return e.length === 0 ? -1 : Ns(t, e, r, i, n);
        if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? n ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : Ns(t, [
            e
        ], r, i, n);
        throw new TypeError("val must be string, number or Buffer");
    }
    function Ns(t, e, r, i, n) {
        let f = 1, o = t.length, u = e.length;
        if (i !== void 0 && (i = String(i).toLowerCase(), i === "ucs2" || i === "ucs-2" || i === "utf16le" || i === "utf-16le")) {
            if (t.length < 2 || e.length < 2) return -1;
            f = 2, o /= 2, u /= 2, r /= 2;
        }
        function v(x, S) {
            return f === 1 ? x[S] : x.readUInt16BE(S * f);
        }
        let _;
        if (n) {
            let x = -1;
            for(_ = r; _ < o; _++)if (v(t, _) === v(e, x === -1 ? 0 : _ - x)) {
                if (x === -1 && (x = _), _ - x + 1 === u) return x * f;
            } else x !== -1 && (_ -= _ - x), x = -1;
        } else for(r + u > o && (r = o - u), _ = r; _ >= 0; _--){
            let x = !0;
            for(let S = 0; S < u; S++)if (v(t, _ + S) !== v(e, S)) {
                x = !1;
                break;
            }
            if (x) return _;
        }
        return -1;
    }
    R.prototype.includes = function(e, r, i) {
        return this.indexOf(e, r, i) !== -1;
    };
    R.prototype.indexOf = function(e, r, i) {
        return js(this, e, r, i, !0);
    };
    R.prototype.lastIndexOf = function(e, r, i) {
        return js(this, e, r, i, !1);
    };
    function a2(t, e, r, i) {
        r = Number(r) || 0;
        let n = t.length - r;
        i ? (i = Number(i), i > n && (i = n)) : i = n;
        let f = e.length;
        i > f / 2 && (i = f / 2);
        let o;
        for(o = 0; o < i; ++o){
            let u = parseInt(e.substr(o * 2, 2), 16);
            if (s0(u)) return o;
            t[r + o] = u;
        }
        return o;
    }
    function o2(t, e, r, i) {
        return mf(n0(e, t.length - r), t, r, i);
    }
    function s2(t, e, r, i) {
        return mf(_2(e), t, r, i);
    }
    function h2(t, e, r, i) {
        return mf(Js(e), t, r, i);
    }
    function c2(t, e, r, i) {
        return mf(w2(e, t.length - r), t, r, i);
    }
    R.prototype.write = function(e, r, i, n) {
        if (r === void 0) n = "utf8", i = this.length, r = 0;
        else if (i === void 0 && typeof r == "string") n = r, i = this.length, r = 0;
        else if (isFinite(r)) r = r >>> 0, isFinite(i) ? (i = i >>> 0, n === void 0 && (n = "utf8")) : (n = i, i = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let f = this.length - r;
        if ((i === void 0 || i > f) && (i = f), e.length > 0 && (i < 0 || r < 0) || r > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");
        let o = !1;
        for(;;)switch(n){
            case "hex":
                return a2(this, e, r, i);
            case "utf8":
            case "utf-8":
                return o2(this, e, r, i);
            case "ascii":
            case "latin1":
            case "binary":
                return s2(this, e, r, i);
            case "base64":
                return h2(this, e, r, i);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return c2(this, e, r, i);
            default:
                if (o) throw new TypeError("Unknown encoding: " + n);
                n = ("" + n).toLowerCase(), o = !0;
        }
    };
    R.prototype.toJSON = function() {
        return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
        };
    };
    function u2(t, e, r) {
        return e === 0 && r === t.length ? t0.fromByteArray(t) : t0.fromByteArray(t.slice(e, r));
    }
    function Ks(t, e, r) {
        r = Math.min(t.length, r);
        let i = [], n = e;
        for(; n < r;){
            let f = t[n], o = null, u = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
            if (n + u <= r) {
                let v, _, x, S;
                switch(u){
                    case 1:
                        f < 128 && (o = f);
                        break;
                    case 2:
                        v = t[n + 1], (v & 192) === 128 && (S = (f & 31) << 6 | v & 63, S > 127 && (o = S));
                        break;
                    case 3:
                        v = t[n + 1], _ = t[n + 2], (v & 192) === 128 && (_ & 192) === 128 && (S = (f & 15) << 12 | (v & 63) << 6 | _ & 63, S > 2047 && (S < 55296 || S > 57343) && (o = S));
                        break;
                    case 4:
                        v = t[n + 1], _ = t[n + 2], x = t[n + 3], (v & 192) === 128 && (_ & 192) === 128 && (x & 192) === 128 && (S = (f & 15) << 18 | (v & 63) << 12 | (_ & 63) << 6 | x & 63, S > 65535 && S < 1114112 && (o = S));
                }
            }
            o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, i.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), i.push(o), n += u;
        }
        return d2(i);
    }
    var Os = 4096;
    function d2(t) {
        let e = t.length;
        if (e <= Os) return String.fromCharCode.apply(String, t);
        let r = "", i = 0;
        for(; i < e;)r += String.fromCharCode.apply(String, t.slice(i, i += Os));
        return r;
    }
    function l2(t, e, r) {
        let i = "";
        r = Math.min(t.length, r);
        for(let n = e; n < r; ++n)i += String.fromCharCode(t[n] & 127);
        return i;
    }
    function p2(t, e, r) {
        let i = "";
        r = Math.min(t.length, r);
        for(let n = e; n < r; ++n)i += String.fromCharCode(t[n]);
        return i;
    }
    function b2(t, e, r) {
        let i = t.length;
        (!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i);
        let n = "";
        for(let f = e; f < r; ++f)n += x2[t[f]];
        return n;
    }
    function v2(t, e, r) {
        let i = t.slice(e, r), n = "";
        for(let f = 0; f < i.length - 1; f += 2)n += String.fromCharCode(i[f] + i[f + 1] * 256);
        return n;
    }
    R.prototype.slice = function(e, r) {
        let i = this.length;
        e = ~~e, r = r === void 0 ? i : ~~r, e < 0 ? (e += i, e < 0 && (e = 0)) : e > i && (e = i), r < 0 ? (r += i, r < 0 && (r = 0)) : r > i && (r = i), r < e && (r = e);
        let n = this.subarray(e, r);
        return Object.setPrototypeOf(n, R.prototype), n;
    };
    function Ke(t, e, r) {
        if (t % 1 !== 0 || t < 0) throw new RangeError("offset is not uint");
        if (t + e > r) throw new RangeError("Trying to access beyond buffer length");
    }
    R.prototype.readUintLE = R.prototype.readUIntLE = function(e, r, i) {
        e = e >>> 0, r = r >>> 0, i || Ke(e, r, this.length);
        let n = this[e], f = 1, o = 0;
        for(; ++o < r && (f *= 256);)n += this[e + o] * f;
        return n;
    };
    R.prototype.readUintBE = R.prototype.readUIntBE = function(e, r, i) {
        e = e >>> 0, r = r >>> 0, i || Ke(e, r, this.length);
        let n = this[e + --r], f = 1;
        for(; r > 0 && (f *= 256);)n += this[e + --r] * f;
        return n;
    };
    R.prototype.readUint8 = R.prototype.readUInt8 = function(e, r) {
        return e = e >>> 0, r || Ke(e, 1, this.length), this[e];
    };
    R.prototype.readUint16LE = R.prototype.readUInt16LE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 2, this.length), this[e] | this[e + 1] << 8;
    };
    R.prototype.readUint16BE = R.prototype.readUInt16BE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 2, this.length), this[e] << 8 | this[e + 1];
    };
    R.prototype.readUint32LE = R.prototype.readUInt32LE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
    };
    R.prototype.readUint32BE = R.prototype.readUInt32BE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
    };
    R.prototype.readBigUInt64LE = vr(function(e) {
        e = e >>> 0, Bi(e, "offset");
        let r = this[e], i = this[e + 7];
        (r === void 0 || i === void 0) && An(e, this.length - 8);
        let n = r + this[++e] * 256 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, f = this[++e] + this[++e] * 256 + this[++e] * 2 ** 16 + i * 2 ** 24;
        return BigInt(n) + (BigInt(f) << BigInt(32));
    });
    R.prototype.readBigUInt64BE = vr(function(e) {
        e = e >>> 0, Bi(e, "offset");
        let r = this[e], i = this[e + 7];
        (r === void 0 || i === void 0) && An(e, this.length - 8);
        let n = r * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 256 + this[++e], f = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 256 + i;
        return (BigInt(n) << BigInt(32)) + BigInt(f);
    });
    R.prototype.readIntLE = function(e, r, i) {
        e = e >>> 0, r = r >>> 0, i || Ke(e, r, this.length);
        let n = this[e], f = 1, o = 0;
        for(; ++o < r && (f *= 256);)n += this[e + o] * f;
        return f *= 128, n >= f && (n -= Math.pow(2, 8 * r)), n;
    };
    R.prototype.readIntBE = function(e, r, i) {
        e = e >>> 0, r = r >>> 0, i || Ke(e, r, this.length);
        let n = r, f = 1, o = this[e + --n];
        for(; n > 0 && (f *= 256);)o += this[e + --n] * f;
        return f *= 128, o >= f && (o -= Math.pow(2, 8 * r)), o;
    };
    R.prototype.readInt8 = function(e, r) {
        return e = e >>> 0, r || Ke(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
    };
    R.prototype.readInt16LE = function(e, r) {
        e = e >>> 0, r || Ke(e, 2, this.length);
        let i = this[e] | this[e + 1] << 8;
        return i & 32768 ? i | 4294901760 : i;
    };
    R.prototype.readInt16BE = function(e, r) {
        e = e >>> 0, r || Ke(e, 2, this.length);
        let i = this[e + 1] | this[e] << 8;
        return i & 32768 ? i | 4294901760 : i;
    };
    R.prototype.readInt32LE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
    };
    R.prototype.readInt32BE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
    };
    R.prototype.readBigInt64LE = vr(function(e) {
        e = e >>> 0, Bi(e, "offset");
        let r = this[e], i = this[e + 7];
        (r === void 0 || i === void 0) && An(e, this.length - 8);
        let n = this[e + 4] + this[e + 5] * 256 + this[e + 6] * 2 ** 16 + (i << 24);
        return (BigInt(n) << BigInt(32)) + BigInt(r + this[++e] * 256 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
    });
    R.prototype.readBigInt64BE = vr(function(e) {
        e = e >>> 0, Bi(e, "offset");
        let r = this[e], i = this[e + 7];
        (r === void 0 || i === void 0) && An(e, this.length - 8);
        let n = (r << 24) + this[++e] * 2 ** 16 + this[++e] * 256 + this[++e];
        return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 256 + i);
    });
    R.prototype.readFloatLE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), Ai.read(this, e, !0, 23, 4);
    };
    R.prototype.readFloatBE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 4, this.length), Ai.read(this, e, !1, 23, 4);
    };
    R.prototype.readDoubleLE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 8, this.length), Ai.read(this, e, !0, 52, 8);
    };
    R.prototype.readDoubleBE = function(e, r) {
        return e = e >>> 0, r || Ke(e, 8, this.length), Ai.read(this, e, !1, 52, 8);
    };
    function ft(t, e, r, i, n, f) {
        if (!R.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (e > n || e < f) throw new RangeError('"value" argument is out of bounds');
        if (r + i > t.length) throw new RangeError("Index out of range");
    }
    R.prototype.writeUintLE = R.prototype.writeUIntLE = function(e, r, i, n) {
        if (e = +e, r = r >>> 0, i = i >>> 0, !n) {
            let u = Math.pow(2, 8 * i) - 1;
            ft(this, e, r, i, u, 0);
        }
        let f = 1, o = 0;
        for(this[r] = e & 255; ++o < i && (f *= 256);)this[r + o] = e / f & 255;
        return r + i;
    };
    R.prototype.writeUintBE = R.prototype.writeUIntBE = function(e, r, i, n) {
        if (e = +e, r = r >>> 0, i = i >>> 0, !n) {
            let u = Math.pow(2, 8 * i) - 1;
            ft(this, e, r, i, u, 0);
        }
        let f = i - 1, o = 1;
        for(this[r + f] = e & 255; --f >= 0 && (o *= 256);)this[r + f] = e / o & 255;
        return r + i;
    };
    R.prototype.writeUint8 = R.prototype.writeUInt8 = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 1, 255, 0), this[r] = e & 255, r + 1;
    };
    R.prototype.writeUint16LE = R.prototype.writeUInt16LE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 2, 65535, 0), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
    };
    R.prototype.writeUint16BE = R.prototype.writeUInt16BE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 2, 65535, 0), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
    };
    R.prototype.writeUint32LE = R.prototype.writeUInt32LE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 4, 4294967295, 0), this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = e & 255, r + 4;
    };
    R.prototype.writeUint32BE = R.prototype.writeUInt32BE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 4, 4294967295, 0), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
    };
    function Ws(t, e, r, i, n) {
        Ys(e, i, n, t, r, 7);
        let f = Number(e & BigInt(4294967295));
        t[r++] = f, f = f >> 8, t[r++] = f, f = f >> 8, t[r++] = f, f = f >> 8, t[r++] = f;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return t[r++] = o, o = o >> 8, t[r++] = o, o = o >> 8, t[r++] = o, o = o >> 8, t[r++] = o, r;
    }
    function Vs(t, e, r, i, n) {
        Ys(e, i, n, t, r, 7);
        let f = Number(e & BigInt(4294967295));
        t[r + 7] = f, f = f >> 8, t[r + 6] = f, f = f >> 8, t[r + 5] = f, f = f >> 8, t[r + 4] = f;
        let o = Number(e >> BigInt(32) & BigInt(4294967295));
        return t[r + 3] = o, o = o >> 8, t[r + 2] = o, o = o >> 8, t[r + 1] = o, o = o >> 8, t[r] = o, r + 8;
    }
    R.prototype.writeBigUInt64LE = vr(function(e, r = 0) {
        return Ws(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    R.prototype.writeBigUInt64BE = vr(function(e, r = 0) {
        return Vs(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    R.prototype.writeIntLE = function(e, r, i, n) {
        if (e = +e, r = r >>> 0, !n) {
            let v = Math.pow(2, 8 * i - 1);
            ft(this, e, r, i, v - 1, -v);
        }
        let f = 0, o = 1, u = 0;
        for(this[r] = e & 255; ++f < i && (o *= 256);)e < 0 && u === 0 && this[r + f - 1] !== 0 && (u = 1), this[r + f] = (e / o >> 0) - u & 255;
        return r + i;
    };
    R.prototype.writeIntBE = function(e, r, i, n) {
        if (e = +e, r = r >>> 0, !n) {
            let v = Math.pow(2, 8 * i - 1);
            ft(this, e, r, i, v - 1, -v);
        }
        let f = i - 1, o = 1, u = 0;
        for(this[r + f] = e & 255; --f >= 0 && (o *= 256);)e < 0 && u === 0 && this[r + f + 1] !== 0 && (u = 1), this[r + f] = (e / o >> 0) - u & 255;
        return r + i;
    };
    R.prototype.writeInt8 = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[r] = e & 255, r + 1;
    };
    R.prototype.writeInt16LE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 2, 32767, -32768), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
    };
    R.prototype.writeInt16BE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 2, 32767, -32768), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
    };
    R.prototype.writeInt32LE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 4, 2147483647, -2147483648), this[r] = e & 255, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24, r + 4;
    };
    R.prototype.writeInt32BE = function(e, r, i) {
        return e = +e, r = r >>> 0, i || ft(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
    };
    R.prototype.writeBigInt64LE = vr(function(e, r = 0) {
        return Ws(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    R.prototype.writeBigInt64BE = vr(function(e, r = 0) {
        return Vs(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function Gs(t, e, r, i, n, f) {
        if (r + i > t.length) throw new RangeError("Index out of range");
        if (r < 0) throw new RangeError("Index out of range");
    }
    function Zs(t, e, r, i, n) {
        return e = +e, r = r >>> 0, n || Gs(t, e, r, 4, 34028234663852886e22, -340282346638528860000000000000000000000), Ai.write(t, e, r, i, 23, 4), r + 4;
    }
    R.prototype.writeFloatLE = function(e, r, i) {
        return Zs(this, e, r, !0, i);
    };
    R.prototype.writeFloatBE = function(e, r, i) {
        return Zs(this, e, r, !1, i);
    };
    function Xs(t, e, r, i, n) {
        return e = +e, r = r >>> 0, n || Gs(t, e, r, 8, 17976931348623157e292, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), Ai.write(t, e, r, i, 52, 8), r + 8;
    }
    R.prototype.writeDoubleLE = function(e, r, i) {
        return Xs(this, e, r, !0, i);
    };
    R.prototype.writeDoubleBE = function(e, r, i) {
        return Xs(this, e, r, !1, i);
    };
    R.prototype.copy = function(e, r, i, n) {
        if (!R.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (i || (i = 0), !n && n !== 0 && (n = this.length), r >= e.length && (r = e.length), r || (r = 0), n > 0 && n < i && (n = i), n === i || e.length === 0 || this.length === 0) return 0;
        if (r < 0) throw new RangeError("targetStart out of bounds");
        if (i < 0 || i >= this.length) throw new RangeError("Index out of range");
        if (n < 0) throw new RangeError("sourceEnd out of bounds");
        n > this.length && (n = this.length), e.length - r < n - i && (n = e.length - r + i);
        let f = n - i;
        return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(r, i, n) : Uint8Array.prototype.set.call(e, this.subarray(i, n), r), f;
    };
    R.prototype.fill = function(e, r, i, n) {
        if (typeof e == "string") {
            if (typeof r == "string" ? (n = r, r = 0, i = this.length) : typeof i == "string" && (n = i, i = this.length), n !== void 0 && typeof n != "string") throw new TypeError("encoding must be a string");
            if (typeof n == "string" && !R.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
            if (e.length === 1) {
                let o = e.charCodeAt(0);
                (n === "utf8" && o < 128 || n === "latin1") && (e = o);
            }
        } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
        if (r < 0 || this.length < r || this.length < i) throw new RangeError("Out of range index");
        if (i <= r) return this;
        r = r >>> 0, i = i === void 0 ? this.length : i >>> 0, e || (e = 0);
        let f;
        if (typeof e == "number") for(f = r; f < i; ++f)this[f] = e;
        else {
            let o = R.isBuffer(e) ? e : R.from(e, n), u = o.length;
            if (u === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
            for(f = 0; f < i - r; ++f)this[f + r] = o[f % u];
        }
        return this;
    };
    var Ei = {};
    function o0(t, e, r) {
        Ei[t] = class extends r {
            constructor(){
                super(), Object.defineProperty(this, "message", {
                    value: e.apply(this, arguments),
                    writable: !0,
                    configurable: !0
                }), this.name = "".concat(this.name, " [").concat(t, "]"), this.stack, delete this.name;
            }
            get code() {
                return t;
            }
            set code(n) {
                Object.defineProperty(this, "code", {
                    configurable: !0,
                    enumerable: !0,
                    value: n,
                    writable: !0
                });
            }
            toString() {
                return "".concat(this.name, " [").concat(t, "]: ").concat(this.message);
            }
        };
    }
    o0("ERR_BUFFER_OUT_OF_BOUNDS", function(t) {
        return t ? "".concat(t, " is outside of buffer bounds") : "Attempt to access memory outside buffer bounds";
    }, RangeError);
    o0("ERR_INVALID_ARG_TYPE", function(t, e) {
        return 'The "'.concat(t, '" argument must be of type number. Received type ').concat(typeof e);
    }, TypeError);
    o0("ERR_OUT_OF_RANGE", function(t, e, r) {
        let i = 'The value of "'.concat(t, '" is out of range.'), n = r;
        return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? n = Fs(String(r)) : typeof r == "bigint" && (n = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (n = Fs(n)), n += "n"), i += " It must be ".concat(e, ". Received ").concat(n), i;
    }, RangeError);
    function Fs(t) {
        let e = "", r = t.length, i = t[0] === "-" ? 1 : 0;
        for(; r >= i + 4; r -= 3)e = "_".concat(t.slice(r - 3, r)).concat(e);
        return "".concat(t.slice(0, r)).concat(e);
    }
    function y2(t, e, r) {
        Bi(e, "offset"), (t[e] === void 0 || t[e + r] === void 0) && An(e, t.length - (r + 1));
    }
    function Ys(t, e, r, i, n, f) {
        if (t > r || t < e) {
            let o = typeof e == "bigint" ? "n" : "", u;
            throw f > 3 ? e === 0 || e === BigInt(0) ? u = ">= 0".concat(o, " and < 2").concat(o, " ** ").concat((f + 1) * 8).concat(o) : u = ">= -(2".concat(o, " ** ").concat((f + 1) * 8 - 1).concat(o, ") and < 2 ** ") + "".concat((f + 1) * 8 - 1).concat(o) : u = ">= ".concat(e).concat(o, " and <= ").concat(r).concat(o), new Ei.ERR_OUT_OF_RANGE("value", u, t);
        }
        y2(i, n, f);
    }
    function Bi(t, e) {
        if (typeof t != "number") throw new Ei.ERR_INVALID_ARG_TYPE(e, "number", t);
    }
    function An(t, e, r) {
        throw Math.floor(t) !== t ? (Bi(t, r), new Ei.ERR_OUT_OF_RANGE(r || "offset", "an integer", t)) : e < 0 ? new Ei.ERR_BUFFER_OUT_OF_BOUNDS : new Ei.ERR_OUT_OF_RANGE(r || "offset", ">= ".concat(r ? 1 : 0, " and <= ").concat(e), t);
    }
    var m2 = /[^+/0-9A-Za-z-_]/g;
    function g2(t) {
        if (t = t.split("=")[0], t = t.trim().replace(m2, ""), t.length < 2) return "";
        for(; t.length % 4 !== 0;)t = t + "=";
        return t;
    }
    function n0(t, e) {
        e = e || 1 / 0;
        let r, i = t.length, n = null, f = [];
        for(let o = 0; o < i; ++o){
            if (r = t.charCodeAt(o), r > 55295 && r < 57344) {
                if (!n) {
                    if (r > 56319) {
                        (e -= 3) > -1 && f.push(239, 191, 189);
                        continue;
                    } else if (o + 1 === i) {
                        (e -= 3) > -1 && f.push(239, 191, 189);
                        continue;
                    }
                    n = r;
                    continue;
                }
                if (r < 56320) {
                    (e -= 3) > -1 && f.push(239, 191, 189), n = r;
                    continue;
                }
                r = (n - 55296 << 10 | r - 56320) + 65536;
            } else n && (e -= 3) > -1 && f.push(239, 191, 189);
            if (n = null, r < 128) {
                if ((e -= 1) < 0) break;
                f.push(r);
            } else if (r < 2048) {
                if ((e -= 2) < 0) break;
                f.push(r >> 6 | 192, r & 63 | 128);
            } else if (r < 65536) {
                if ((e -= 3) < 0) break;
                f.push(r >> 12 | 224, r >> 6 & 63 | 128, r & 63 | 128);
            } else if (r < 1114112) {
                if ((e -= 4) < 0) break;
                f.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, r & 63 | 128);
            } else throw new Error("Invalid code point");
        }
        return f;
    }
    function _2(t) {
        let e = [];
        for(let r = 0; r < t.length; ++r)e.push(t.charCodeAt(r) & 255);
        return e;
    }
    function w2(t, e) {
        let r, i, n, f = [];
        for(let o = 0; o < t.length && !((e -= 2) < 0); ++o)r = t.charCodeAt(o), i = r >> 8, n = r % 256, f.push(n), f.push(i);
        return f;
    }
    function Js(t) {
        return t0.toByteArray(g2(t));
    }
    function mf(t, e, r, i) {
        let n;
        for(n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n)e[n + r] = t[n];
        return n;
    }
    function Kt(t, e) {
        return t instanceof e || t != null && t.constructor != null && t.constructor.name != null && t.constructor.name === e.name;
    }
    function s0(t) {
        return t !== t;
    }
    var x2 = function() {
        let t = "0123456789abcdef", e = new Array(256);
        for(let r = 0; r < 16; ++r){
            let i = r * 16;
            for(let n = 0; n < 16; ++n)e[i + n] = t[r] + t[n];
        }
        return e;
    }();
    function vr(t) {
        return typeof BigInt > "u" ? M2 : t;
    }
    function M2() {
        throw new Error("BigInt not supported");
    }
});
var we = q((h0, Qs)=>{
    var gf = Xr(), Wt = gf.Buffer;
    function $s(t, e) {
        for(var r in t)e[r] = t[r];
    }
    Wt.from && Wt.alloc && Wt.allocUnsafe && Wt.allocUnsafeSlow ? Qs.exports = gf : ($s(gf, h0), h0.Buffer = Yr);
    function Yr(t, e, r) {
        return Wt(t, e, r);
    }
    Yr.prototype = Object.create(Wt.prototype);
    $s(Wt, Yr);
    Yr.from = function(t, e, r) {
        if (typeof t == "number") throw new TypeError("Argument must not be a number");
        return Wt(t, e, r);
    };
    Yr.alloc = function(t, e, r) {
        if (typeof t != "number") throw new TypeError("Argument must be a number");
        var i = Wt(t);
        return e !== void 0 ? typeof r == "string" ? i.fill(e, r) : i.fill(e) : i.fill(0), i;
    };
    Yr.allocUnsafe = function(t) {
        if (typeof t != "number") throw new TypeError("Argument must be a number");
        return Wt(t);
    };
    Yr.allocUnsafeSlow = function(t) {
        if (typeof t != "number") throw new TypeError("Argument must be a number");
        return gf.SlowBuffer(t);
    };
});
var Jr = q((p9, u0)=>{
    "use strict";
    var c0 = 65536, S2 = 4294967295;
    function E2() {
        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
    }
    var A2 = we().Buffer, _f = global.crypto || global.msCrypto;
    _f && _f.getRandomValues ? u0.exports = B2 : u0.exports = E2;
    function B2(t, e) {
        if (t > S2) throw new RangeError("requested too many random bytes");
        var r = A2.allocUnsafe(t);
        if (t > 0) {
            if (t > c0) for(var i = 0; i < t; i += c0)_f.getRandomValues(r.slice(i, i + c0));
            else _f.getRandomValues(r);
        }
        return typeof e == "function" ? process.nextTick(function() {
            e(null, r);
        }) : r;
    }
});
var xe = q((b9, d0)=>{
    typeof Object.create == "function" ? d0.exports = function(e, r) {
        r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }));
    } : d0.exports = function(e, r) {
        if (r) {
            e.super_ = r;
            var i = function() {};
            i.prototype = r.prototype, e.prototype = new i, e.prototype.constructor = e;
        }
    };
});
var Mf = q((v9, l0)=>{
    "use strict";
    var Ri = typeof Reflect == "object" ? Reflect : null, eh = Ri && typeof Ri.apply == "function" ? Ri.apply : function(e, r, i) {
        return Function.prototype.apply.call(e, r, i);
    }, wf;
    Ri && typeof Ri.ownKeys == "function" ? wf = Ri.ownKeys : Object.getOwnPropertySymbols ? wf = function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : wf = function(e) {
        return Object.getOwnPropertyNames(e);
    };
    function q2(t) {
        console && console.warn && console.warn(t);
    }
    var rh = Number.isNaN || function(e) {
        return e !== e;
    };
    function Ie() {
        Ie.init.call(this);
    }
    l0.exports = Ie;
    l0.exports.once = C2;
    Ie.EventEmitter = Ie;
    Ie.prototype._events = void 0;
    Ie.prototype._eventsCount = 0;
    Ie.prototype._maxListeners = void 0;
    var th = 10;
    function xf(t) {
        if (typeof t != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
    }
    Object.defineProperty(Ie, "defaultMaxListeners", {
        enumerable: !0,
        get: function() {
            return th;
        },
        set: function(t) {
            if (typeof t != "number" || t < 0 || rh(t)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
            th = t;
        }
    });
    Ie.init = function() {
        (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    };
    Ie.prototype.setMaxListeners = function(e) {
        if (typeof e != "number" || e < 0 || rh(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
        return this._maxListeners = e, this;
    };
    function ih(t) {
        return t._maxListeners === void 0 ? Ie.defaultMaxListeners : t._maxListeners;
    }
    Ie.prototype.getMaxListeners = function() {
        return ih(this);
    };
    Ie.prototype.emit = function(e) {
        for(var r = [], i = 1; i < arguments.length; i++)r.push(arguments[i]);
        var n = e === "error", f = this._events;
        if (f !== void 0) n = n && f.error === void 0;
        else if (!n) return !1;
        if (n) {
            var o;
            if (r.length > 0 && (o = r[0]), o instanceof Error) throw o;
            var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
            throw u.context = o, u;
        }
        var v = f[e];
        if (v === void 0) return !1;
        if (typeof v == "function") eh(v, this, r);
        else for(var _ = v.length, x = sh(v, _), i = 0; i < _; ++i)eh(x[i], this, r);
        return !0;
    };
    function nh(t, e, r, i) {
        var n, f, o;
        if (xf(r), f = t._events, f === void 0 ? (f = t._events = Object.create(null), t._eventsCount = 0) : (f.newListener !== void 0 && (t.emit("newListener", e, r.listener ? r.listener : r), f = t._events), o = f[e]), o === void 0) o = f[e] = r, ++t._eventsCount;
        else if (typeof o == "function" ? o = f[e] = i ? [
            r,
            o
        ] : [
            o,
            r
        ] : i ? o.unshift(r) : o.push(r), n = ih(t), n > 0 && o.length > n && !o.warned) {
            o.warned = !0;
            var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            u.name = "MaxListenersExceededWarning", u.emitter = t, u.type = e, u.count = o.length, q2(u);
        }
        return t;
    }
    Ie.prototype.addListener = function(e, r) {
        return nh(this, e, r, !1);
    };
    Ie.prototype.on = Ie.prototype.addListener;
    Ie.prototype.prependListener = function(e, r) {
        return nh(this, e, r, !0);
    };
    function R2() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function fh(t, e, r) {
        var i = {
            fired: !1,
            wrapFn: void 0,
            target: t,
            type: e,
            listener: r
        }, n = R2.bind(i);
        return n.listener = r, i.wrapFn = n, n;
    }
    Ie.prototype.once = function(e, r) {
        return xf(r), this.on(e, fh(this, e, r)), this;
    };
    Ie.prototype.prependOnceListener = function(e, r) {
        return xf(r), this.prependListener(e, fh(this, e, r)), this;
    };
    Ie.prototype.removeListener = function(e, r) {
        var i, n, f, o, u;
        if (xf(r), n = this._events, n === void 0) return this;
        if (i = n[e], i === void 0) return this;
        if (i === r || i.listener === r) --this._eventsCount === 0 ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, i.listener || r));
        else if (typeof i != "function") {
            for(f = -1, o = i.length - 1; o >= 0; o--)if (i[o] === r || i[o].listener === r) {
                u = i[o].listener, f = o;
                break;
            }
            if (f < 0) return this;
            f === 0 ? i.shift() : I2(i, f), i.length === 1 && (n[e] = i[0]), n.removeListener !== void 0 && this.emit("removeListener", e, u || r);
        }
        return this;
    };
    Ie.prototype.off = Ie.prototype.removeListener;
    Ie.prototype.removeAllListeners = function(e) {
        var r, i, n;
        if (i = this._events, i === void 0) return this;
        if (i.removeListener === void 0) return arguments.length === 0 ? (this._events = Object.create(null), this._eventsCount = 0) : i[e] !== void 0 && (--this._eventsCount === 0 ? this._events = Object.create(null) : delete i[e]), this;
        if (arguments.length === 0) {
            var f = Object.keys(i), o;
            for(n = 0; n < f.length; ++n)o = f[n], o !== "removeListener" && this.removeAllListeners(o);
            return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
        }
        if (r = i[e], typeof r == "function") this.removeListener(e, r);
        else if (r !== void 0) for(n = r.length - 1; n >= 0; n--)this.removeListener(e, r[n]);
        return this;
    };
    function ah(t, e, r) {
        var i = t._events;
        if (i === void 0) return [];
        var n = i[e];
        return n === void 0 ? [] : typeof n == "function" ? r ? [
            n.listener || n
        ] : [
            n
        ] : r ? k2(n) : sh(n, n.length);
    }
    Ie.prototype.listeners = function(e) {
        return ah(this, e, !0);
    };
    Ie.prototype.rawListeners = function(e) {
        return ah(this, e, !1);
    };
    Ie.listenerCount = function(t, e) {
        return typeof t.listenerCount == "function" ? t.listenerCount(e) : oh.call(t, e);
    };
    Ie.prototype.listenerCount = oh;
    function oh(t) {
        var e = this._events;
        if (e !== void 0) {
            var r = e[t];
            if (typeof r == "function") return 1;
            if (r !== void 0) return r.length;
        }
        return 0;
    }
    Ie.prototype.eventNames = function() {
        return this._eventsCount > 0 ? wf(this._events) : [];
    };
    function sh(t, e) {
        for(var r = new Array(e), i = 0; i < e; ++i)r[i] = t[i];
        return r;
    }
    function I2(t, e) {
        for(; e + 1 < t.length; e++)t[e] = t[e + 1];
        t.pop();
    }
    function k2(t) {
        for(var e = new Array(t.length), r = 0; r < e.length; ++r)e[r] = t[r].listener || t[r];
        return e;
    }
    function C2(t, e) {
        return new Promise(function(r, i) {
            function n(o) {
                t.removeListener(e, f), i(o);
            }
            function f() {
                typeof t.removeListener == "function" && t.removeListener("error", n), r([].slice.call(arguments));
            }
            hh(t, e, f, {
                once: !0
            }), e !== "error" && T2(t, n, {
                once: !0
            });
        });
    }
    function T2(t, e, r) {
        typeof t.on == "function" && hh(t, "error", e, r);
    }
    function hh(t, e, r, i) {
        if (typeof t.on == "function") i.once ? t.once(e, r) : t.on(e, r);
        else if (typeof t.addEventListener == "function") t.addEventListener(e, function n(f) {
            i.once && t.removeEventListener(e, n), r(f);
        });
        else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
    }
});
var p0 = q((y9, ch)=>{
    ch.exports = Mf().EventEmitter;
});
var b0 = q(()=>{});
var vh = q((_9, bh)=>{
    "use strict";
    function uh(t, e) {
        var r = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(t);
            e && (i = i.filter(function(n) {
                return Object.getOwnPropertyDescriptor(t, n).enumerable;
            })), r.push.apply(r, i);
        }
        return r;
    }
    function dh(t) {
        for(var e = 1; e < arguments.length; e++){
            var r = arguments[e] != null ? arguments[e] : {};
            e % 2 ? uh(Object(r), !0).forEach(function(i) {
                P2(t, i, r[i]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : uh(Object(r)).forEach(function(i) {
                Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(r, i));
            });
        }
        return t;
    }
    function P2(t, e, r) {
        return e = ph(e), e in t ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = r, t;
    }
    function D2(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }
    function lh(t, e) {
        for(var r = 0; r < e.length; r++){
            var i = e[r];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, ph(i.key), i);
        }
    }
    function L2(t, e, r) {
        return e && lh(t.prototype, e), r && lh(t, r), Object.defineProperty(t, "prototype", {
            writable: !1
        }), t;
    }
    function ph(t) {
        var e = N2(t, "string");
        return typeof e == "symbol" ? e : String(e);
    }
    function N2(t, e) {
        if (typeof t != "object" || t === null) return t;
        var r = t[Symbol.toPrimitive];
        if (r !== void 0) {
            var i = r.call(t, e || "default");
            if (typeof i != "object") return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (e === "string" ? String : Number)(t);
    }
    var O2 = Xr(), Sf = O2.Buffer, F2 = b0(), v0 = F2.inspect, U2 = v0 && v0.custom || "inspect";
    function z2(t, e, r) {
        Sf.prototype.copy.call(t, e, r);
    }
    bh.exports = function() {
        function t() {
            D2(this, t), this.head = null, this.tail = null, this.length = 0;
        }
        return L2(t, [
            {
                key: "push",
                value: function(r) {
                    var i = {
                        data: r,
                        next: null
                    };
                    this.length > 0 ? this.tail.next = i : this.head = i, this.tail = i, ++this.length;
                }
            },
            {
                key: "unshift",
                value: function(r) {
                    var i = {
                        data: r,
                        next: this.head
                    };
                    this.length === 0 && (this.tail = i), this.head = i, ++this.length;
                }
            },
            {
                key: "shift",
                value: function() {
                    if (this.length !== 0) {
                        var r = this.head.data;
                        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, r;
                    }
                }
            },
            {
                key: "clear",
                value: function() {
                    this.head = this.tail = null, this.length = 0;
                }
            },
            {
                key: "join",
                value: function(r) {
                    if (this.length === 0) return "";
                    for(var i = this.head, n = "" + i.data; i = i.next;)n += r + i.data;
                    return n;
                }
            },
            {
                key: "concat",
                value: function(r) {
                    if (this.length === 0) return Sf.alloc(0);
                    for(var i = Sf.allocUnsafe(r >>> 0), n = this.head, f = 0; n;)z2(n.data, i, f), f += n.data.length, n = n.next;
                    return i;
                }
            },
            {
                key: "consume",
                value: function(r, i) {
                    var n;
                    return r < this.head.data.length ? (n = this.head.data.slice(0, r), this.head.data = this.head.data.slice(r)) : r === this.head.data.length ? n = this.shift() : n = i ? this._getString(r) : this._getBuffer(r), n;
                }
            },
            {
                key: "first",
                value: function() {
                    return this.head.data;
                }
            },
            {
                key: "_getString",
                value: function(r) {
                    var i = this.head, n = 1, f = i.data;
                    for(r -= f.length; i = i.next;){
                        var o = i.data, u = r > o.length ? o.length : r;
                        if (u === o.length ? f += o : f += o.slice(0, r), r -= u, r === 0) {
                            u === o.length ? (++n, i.next ? this.head = i.next : this.head = this.tail = null) : (this.head = i, i.data = o.slice(u));
                            break;
                        }
                        ++n;
                    }
                    return this.length -= n, f;
                }
            },
            {
                key: "_getBuffer",
                value: function(r) {
                    var i = Sf.allocUnsafe(r), n = this.head, f = 1;
                    for(n.data.copy(i), r -= n.data.length; n = n.next;){
                        var o = n.data, u = r > o.length ? o.length : r;
                        if (o.copy(i, i.length - r, 0, u), r -= u, r === 0) {
                            u === o.length ? (++f, n.next ? this.head = n.next : this.head = this.tail = null) : (this.head = n, n.data = o.slice(u));
                            break;
                        }
                        ++f;
                    }
                    return this.length -= f, i;
                }
            },
            {
                key: U2,
                value: function(r, i) {
                    return v0(this, dh(dh({}, i), {}, {
                        depth: 0,
                        customInspect: !1
                    }));
                }
            }
        ]), t;
    }();
});
var m0 = q((w9, mh)=>{
    "use strict";
    function H2(t, e) {
        var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
        return i || n ? (e ? e(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process.nextTick(y0, this, t)) : process.nextTick(y0, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function(f) {
            !e && f ? r._writableState ? r._writableState.errorEmitted ? process.nextTick(Ef, r) : (r._writableState.errorEmitted = !0, process.nextTick(yh, r, f)) : process.nextTick(yh, r, f) : e ? (process.nextTick(Ef, r), e(f)) : process.nextTick(Ef, r);
        }), this);
    }
    function yh(t, e) {
        y0(t, e), Ef(t);
    }
    function Ef(t) {
        t._writableState && !t._writableState.emitClose || t._readableState && !t._readableState.emitClose || t.emit("close");
    }
    function j2() {
        this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
    }
    function y0(t, e) {
        t.emit("error", e);
    }
    function K2(t, e) {
        var r = t._readableState, i = t._writableState;
        r && r.autoDestroy || i && i.autoDestroy ? t.destroy(e) : t.emit("error", e);
    }
    mh.exports = {
        destroy: H2,
        undestroy: j2,
        errorOrDestroy: K2
    };
});
var $r = q((x9, wh)=>{
    "use strict";
    function W2(t, e) {
        t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
    }
    var _h = {};
    function bt(t, e, r) {
        r || (r = Error);
        function i(f, o, u) {
            return typeof e == "string" ? e : e(f, o, u);
        }
        var n = function(f) {
            W2(o, f);
            function o(u, v, _) {
                return f.call(this, i(u, v, _)) || this;
            }
            return o;
        }(r);
        n.prototype.name = r.name, n.prototype.code = t, _h[t] = n;
    }
    function gh(t, e) {
        if (Array.isArray(t)) {
            var r = t.length;
            return t = t.map(function(i) {
                return String(i);
            }), r > 2 ? "one of ".concat(e, " ").concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1] : r === 2 ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0]);
        } else return "of ".concat(e, " ").concat(String(t));
    }
    function V2(t, e, r) {
        return t.substr(!r || r < 0 ? 0 : +r, e.length) === e;
    }
    function G2(t, e, r) {
        return (r === void 0 || r > t.length) && (r = t.length), t.substring(r - e.length, r) === e;
    }
    function Z2(t, e, r) {
        return typeof r != "number" && (r = 0), r + e.length > t.length ? !1 : t.indexOf(e, r) !== -1;
    }
    bt("ERR_INVALID_OPT_VALUE", function(t, e) {
        return 'The value "' + e + '" is invalid for option "' + t + '"';
    }, TypeError);
    bt("ERR_INVALID_ARG_TYPE", function(t, e, r) {
        var i;
        typeof e == "string" && V2(e, "not ") ? (i = "must not be", e = e.replace(/^not /, "")) : i = "must be";
        var n;
        if (G2(t, " argument")) n = "The ".concat(t, " ").concat(i, " ").concat(gh(e, "type"));
        else {
            var f = Z2(t, ".") ? "property" : "argument";
            n = 'The "'.concat(t, '" ').concat(f, " ").concat(i, " ").concat(gh(e, "type"));
        }
        return n += ". Received type ".concat(typeof r), n;
    }, TypeError);
    bt("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    bt("ERR_METHOD_NOT_IMPLEMENTED", function(t) {
        return "The " + t + " method is not implemented";
    });
    bt("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    bt("ERR_STREAM_DESTROYED", function(t) {
        return "Cannot call " + t + " after a stream was destroyed";
    });
    bt("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    bt("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    bt("ERR_STREAM_WRITE_AFTER_END", "write after end");
    bt("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    bt("ERR_UNKNOWN_ENCODING", function(t) {
        return "Unknown encoding: " + t;
    }, TypeError);
    bt("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    wh.exports.codes = _h;
});
var g0 = q((M9, xh)=>{
    "use strict";
    var X2 = $r().codes.ERR_INVALID_OPT_VALUE;
    function Y2(t, e, r) {
        return t.highWaterMark != null ? t.highWaterMark : e ? t[r] : null;
    }
    function J2(t, e, r, i) {
        var n = Y2(e, i, r);
        if (n != null) {
            if (!(isFinite(n) && Math.floor(n) === n) || n < 0) {
                var f = i ? r : "highWaterMark";
                throw new X2(f, n);
            }
            return Math.floor(n);
        }
        return t.objectMode ? 16 : 16384;
    }
    xh.exports = {
        getHighWaterMark: J2
    };
});
var Sh = q((S9, Mh)=>{
    Mh.exports = $2;
    function $2(t, e) {
        if (_0("noDeprecation")) return t;
        var r = !1;
        function i() {
            if (!r) {
                if (_0("throwDeprecation")) throw new Error(e);
                _0("traceDeprecation") ? console.trace(e) : console.warn(e), r = !0;
            }
            return t.apply(this, arguments);
        }
        return i;
    }
    function _0(t) {
        try {
            if (!global.localStorage) return !1;
        } catch (r) {
            return !1;
        }
        var e = global.localStorage[t];
        return e == null ? !1 : String(e).toLowerCase() === "true";
    }
});
var qf = q((E9, Ih)=>{
    "use strict";
    Ih.exports = Ne;
    function Ah(t) {
        var e = this;
        this.next = null, this.entry = null, this.finish = function() {
            Eb(e, t);
        };
    }
    var Ii;
    Ne.WritableState = qn;
    var Q2 = {
        deprecate: Sh()
    }, Bh = p0(), Bf = Xr().Buffer, eb = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {};
    function tb(t) {
        return Bf.from(t);
    }
    function rb(t) {
        return Bf.isBuffer(t) || t instanceof eb;
    }
    var x0 = m0(), ib = g0(), nb = ib.getHighWaterMark, yr = $r().codes, fb = yr.ERR_INVALID_ARG_TYPE, ab = yr.ERR_METHOD_NOT_IMPLEMENTED, ob = yr.ERR_MULTIPLE_CALLBACK, sb = yr.ERR_STREAM_CANNOT_PIPE, hb = yr.ERR_STREAM_DESTROYED, cb = yr.ERR_STREAM_NULL_VALUES, ub = yr.ERR_STREAM_WRITE_AFTER_END, db = yr.ERR_UNKNOWN_ENCODING, ki = x0.errorOrDestroy;
    xe()(Ne, Bh);
    function lb() {}
    function qn(t, e, r) {
        Ii = Ii || mr(), t = t || {}, typeof r != "boolean" && (r = e instanceof Ii), this.objectMode = !!t.objectMode, r && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = nb(this, t, "writableHighWaterMark", r), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
        var i = t.decodeStrings === !1;
        this.decodeStrings = !i, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(n) {
            _b(e, n);
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = t.emitClose !== !1, this.autoDestroy = !!t.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Ah(this);
    }
    qn.prototype.getBuffer = function() {
        for(var e = this.bufferedRequest, r = []; e;)r.push(e), e = e.next;
        return r;
    };
    (function() {
        try {
            Object.defineProperty(qn.prototype, "buffer", {
                get: Q2.deprecate(function() {
                    return this.getBuffer();
                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
            });
        } catch (t) {}
    })();
    var Af;
    typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (Af = Function.prototype[Symbol.hasInstance], Object.defineProperty(Ne, Symbol.hasInstance, {
        value: function(e) {
            return Af.call(this, e) ? !0 : this !== Ne ? !1 : e && e._writableState instanceof qn;
        }
    })) : Af = function(e) {
        return e instanceof this;
    };
    function Ne(t) {
        Ii = Ii || mr();
        var e = this instanceof Ii;
        if (!e && !Af.call(Ne, this)) return new Ne(t);
        this._writableState = new qn(t, this, e), this.writable = !0, t && (typeof t.write == "function" && (this._write = t.write), typeof t.writev == "function" && (this._writev = t.writev), typeof t.destroy == "function" && (this._destroy = t.destroy), typeof t.final == "function" && (this._final = t.final)), Bh.call(this);
    }
    Ne.prototype.pipe = function() {
        ki(this, new sb);
    };
    function pb(t, e) {
        var r = new ub;
        ki(t, r), process.nextTick(e, r);
    }
    function bb(t, e, r, i) {
        var n;
        return r === null ? n = new cb : typeof r != "string" && !e.objectMode && (n = new fb("chunk", [
            "string",
            "Buffer"
        ], r)), n ? (ki(t, n), process.nextTick(i, n), !1) : !0;
    }
    Ne.prototype.write = function(t, e, r) {
        var i = this._writableState, n = !1, f = !i.objectMode && rb(t);
        return f && !Bf.isBuffer(t) && (t = tb(t)), typeof e == "function" && (r = e, e = null), f ? e = "buffer" : e || (e = i.defaultEncoding), typeof r != "function" && (r = lb), i.ending ? pb(this, r) : (f || bb(this, i, t, r)) && (i.pendingcb++, n = yb(this, i, f, t, e, r)), n;
    };
    Ne.prototype.cork = function() {
        this._writableState.corked++;
    };
    Ne.prototype.uncork = function() {
        var t = this._writableState;
        t.corked && (t.corked--, !t.writing && !t.corked && !t.bufferProcessing && t.bufferedRequest && qh(this, t));
    };
    Ne.prototype.setDefaultEncoding = function(e) {
        if (typeof e == "string" && (e = e.toLowerCase()), !([
            "hex",
            "utf8",
            "utf-8",
            "ascii",
            "binary",
            "base64",
            "ucs2",
            "ucs-2",
            "utf16le",
            "utf-16le",
            "raw"
        ].indexOf((e + "").toLowerCase()) > -1)) throw new db(e);
        return this._writableState.defaultEncoding = e, this;
    };
    Object.defineProperty(Ne.prototype, "writableBuffer", {
        enumerable: !1,
        get: function() {
            return this._writableState && this._writableState.getBuffer();
        }
    });
    function vb(t, e, r) {
        return !t.objectMode && t.decodeStrings !== !1 && typeof e == "string" && (e = Bf.from(e, r)), e;
    }
    Object.defineProperty(Ne.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function() {
            return this._writableState.highWaterMark;
        }
    });
    function yb(t, e, r, i, n, f) {
        if (!r) {
            var o = vb(e, i, n);
            i !== o && (r = !0, n = "buffer", i = o);
        }
        var u = e.objectMode ? 1 : i.length;
        e.length += u;
        var v = e.length < e.highWaterMark;
        if (v || (e.needDrain = !0), e.writing || e.corked) {
            var _ = e.lastBufferedRequest;
            e.lastBufferedRequest = {
                chunk: i,
                encoding: n,
                isBuf: r,
                callback: f,
                next: null
            }, _ ? _.next = e.lastBufferedRequest : e.bufferedRequest = e.lastBufferedRequest, e.bufferedRequestCount += 1;
        } else w0(t, e, !1, u, i, n, f);
        return v;
    }
    function w0(t, e, r, i, n, f, o) {
        e.writelen = i, e.writecb = o, e.writing = !0, e.sync = !0, e.destroyed ? e.onwrite(new hb("write")) : r ? t._writev(n, e.onwrite) : t._write(n, f, e.onwrite), e.sync = !1;
    }
    function mb(t, e, r, i, n) {
        --e.pendingcb, r ? (process.nextTick(n, i), process.nextTick(Bn, t, e), t._writableState.errorEmitted = !0, ki(t, i)) : (n(i), t._writableState.errorEmitted = !0, ki(t, i), Bn(t, e));
    }
    function gb(t) {
        t.writing = !1, t.writecb = null, t.length -= t.writelen, t.writelen = 0;
    }
    function _b(t, e) {
        var r = t._writableState, i = r.sync, n = r.writecb;
        if (typeof n != "function") throw new ob;
        if (gb(r), e) mb(t, r, i, e, n);
        else {
            var f = Rh(r) || t.destroyed;
            !f && !r.corked && !r.bufferProcessing && r.bufferedRequest && qh(t, r), i ? process.nextTick(Eh, t, r, f, n) : Eh(t, r, f, n);
        }
    }
    function Eh(t, e, r, i) {
        r || wb(t, e), e.pendingcb--, i(), Bn(t, e);
    }
    function wb(t, e) {
        e.length === 0 && e.needDrain && (e.needDrain = !1, t.emit("drain"));
    }
    function qh(t, e) {
        e.bufferProcessing = !0;
        var r = e.bufferedRequest;
        if (t._writev && r && r.next) {
            var i = e.bufferedRequestCount, n = new Array(i), f = e.corkedRequestsFree;
            f.entry = r;
            for(var o = 0, u = !0; r;)n[o] = r, r.isBuf || (u = !1), r = r.next, o += 1;
            n.allBuffers = u, w0(t, e, !0, e.length, n, "", f.finish), e.pendingcb++, e.lastBufferedRequest = null, f.next ? (e.corkedRequestsFree = f.next, f.next = null) : e.corkedRequestsFree = new Ah(e), e.bufferedRequestCount = 0;
        } else {
            for(; r;){
                var v = r.chunk, _ = r.encoding, x = r.callback, S = e.objectMode ? 1 : v.length;
                if (w0(t, e, !1, S, v, _, x), r = r.next, e.bufferedRequestCount--, e.writing) break;
            }
            r === null && (e.lastBufferedRequest = null);
        }
        e.bufferedRequest = r, e.bufferProcessing = !1;
    }
    Ne.prototype._write = function(t, e, r) {
        r(new ab("_write()"));
    };
    Ne.prototype._writev = null;
    Ne.prototype.end = function(t, e, r) {
        var i = this._writableState;
        return typeof t == "function" ? (r = t, t = null, e = null) : typeof e == "function" && (r = e, e = null), t != null && this.write(t, e), i.corked && (i.corked = 1, this.uncork()), i.ending || Sb(this, i, r), this;
    };
    Object.defineProperty(Ne.prototype, "writableLength", {
        enumerable: !1,
        get: function() {
            return this._writableState.length;
        }
    });
    function Rh(t) {
        return t.ending && t.length === 0 && t.bufferedRequest === null && !t.finished && !t.writing;
    }
    function xb(t, e) {
        t._final(function(r) {
            e.pendingcb--, r && ki(t, r), e.prefinished = !0, t.emit("prefinish"), Bn(t, e);
        });
    }
    function Mb(t, e) {
        !e.prefinished && !e.finalCalled && (typeof t._final == "function" && !e.destroyed ? (e.pendingcb++, e.finalCalled = !0, process.nextTick(xb, t, e)) : (e.prefinished = !0, t.emit("prefinish")));
    }
    function Bn(t, e) {
        var r = Rh(e);
        if (r && (Mb(t, e), e.pendingcb === 0 && (e.finished = !0, t.emit("finish"), e.autoDestroy))) {
            var i = t._readableState;
            (!i || i.autoDestroy && i.endEmitted) && t.destroy();
        }
        return r;
    }
    function Sb(t, e, r) {
        e.ending = !0, Bn(t, e), r && (e.finished ? process.nextTick(r) : t.once("finish", r)), e.ended = !0, t.writable = !1;
    }
    function Eb(t, e, r) {
        var i = t.entry;
        for(t.entry = null; i;){
            var n = i.callback;
            e.pendingcb--, n(r), i = i.next;
        }
        e.corkedRequestsFree.next = t;
    }
    Object.defineProperty(Ne.prototype, "destroyed", {
        enumerable: !1,
        get: function() {
            return this._writableState === void 0 ? !1 : this._writableState.destroyed;
        },
        set: function(e) {
            this._writableState && (this._writableState.destroyed = e);
        }
    });
    Ne.prototype.destroy = x0.destroy;
    Ne.prototype._undestroy = x0.undestroy;
    Ne.prototype._destroy = function(t, e) {
        e(t);
    };
});
var mr = q((A9, Ch)=>{
    "use strict";
    var Ab = Object.keys || function(t) {
        var e = [];
        for(var r in t)e.push(r);
        return e;
    };
    Ch.exports = Vt;
    var kh = kf(), S0 = qf();
    xe()(Vt, kh);
    for(M0 = Ab(S0.prototype), Rf = 0; Rf < M0.length; Rf++)If = M0[Rf], Vt.prototype[If] || (Vt.prototype[If] = S0.prototype[If]);
    var M0, If, Rf;
    function Vt(t) {
        if (!(this instanceof Vt)) return new Vt(t);
        kh.call(this, t), S0.call(this, t), this.allowHalfOpen = !0, t && (t.readable === !1 && (this.readable = !1), t.writable === !1 && (this.writable = !1), t.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", Bb)));
    }
    Object.defineProperty(Vt.prototype, "writableHighWaterMark", {
        enumerable: !1,
        get: function() {
            return this._writableState.highWaterMark;
        }
    });
    Object.defineProperty(Vt.prototype, "writableBuffer", {
        enumerable: !1,
        get: function() {
            return this._writableState && this._writableState.getBuffer();
        }
    });
    Object.defineProperty(Vt.prototype, "writableLength", {
        enumerable: !1,
        get: function() {
            return this._writableState.length;
        }
    });
    function Bb() {
        this._writableState.ended || process.nextTick(qb, this);
    }
    function qb(t) {
        t.end();
    }
    Object.defineProperty(Vt.prototype, "destroyed", {
        enumerable: !1,
        get: function() {
            return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
        },
        set: function(e) {
            this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed = e);
        }
    });
});
var Cf = q((Ph)=>{
    "use strict";
    var A0 = we().Buffer, Th = A0.isEncoding || function(t) {
        switch(t = "" + t, t && t.toLowerCase()){
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
                return !0;
            default:
                return !1;
        }
    };
    function Rb(t) {
        if (!t) return "utf8";
        for(var e;;)switch(t){
            case "utf8":
            case "utf-8":
                return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return "utf16le";
            case "latin1":
            case "binary":
                return "latin1";
            case "base64":
            case "ascii":
            case "hex":
                return t;
            default:
                if (e) return;
                t = ("" + t).toLowerCase(), e = !0;
        }
    }
    function Ib(t) {
        var e = Rb(t);
        if (typeof e != "string" && (A0.isEncoding === Th || !Th(t))) throw new Error("Unknown encoding: " + t);
        return e || t;
    }
    Ph.StringDecoder = Rn;
    function Rn(t) {
        this.encoding = Ib(t);
        var e;
        switch(this.encoding){
            case "utf16le":
                this.text = Lb, this.end = Nb, e = 4;
                break;
            case "utf8":
                this.fillLast = Tb, e = 4;
                break;
            case "base64":
                this.text = Ob, this.end = Fb, e = 3;
                break;
            default:
                this.write = Ub, this.end = zb;
                return;
        }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = A0.allocUnsafe(e);
    }
    Rn.prototype.write = function(t) {
        if (t.length === 0) return "";
        var e, r;
        if (this.lastNeed) {
            if (e = this.fillLast(t), e === void 0) return "";
            r = this.lastNeed, this.lastNeed = 0;
        } else r = 0;
        return r < t.length ? e ? e + this.text(t, r) : this.text(t, r) : e || "";
    };
    Rn.prototype.end = Db;
    Rn.prototype.text = Pb;
    Rn.prototype.fillLast = function(t) {
        if (this.lastNeed <= t.length) return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
    };
    function E0(t) {
        return t <= 127 ? 0 : t >> 5 === 6 ? 2 : t >> 4 === 14 ? 3 : t >> 3 === 30 ? 4 : t >> 6 === 2 ? -1 : -2;
    }
    function kb(t, e, r) {
        var i = e.length - 1;
        if (i < r) return 0;
        var n = E0(e[i]);
        return n >= 0 ? (n > 0 && (t.lastNeed = n - 1), n) : --i < r || n === -2 ? 0 : (n = E0(e[i]), n >= 0 ? (n > 0 && (t.lastNeed = n - 2), n) : --i < r || n === -2 ? 0 : (n = E0(e[i]), n >= 0 ? (n > 0 && (n === 2 ? n = 0 : t.lastNeed = n - 3), n) : 0));
    }
    function Cb(t, e, r) {
        if ((e[0] & 192) !== 128) return t.lastNeed = 0, "\ufffd";
        if (t.lastNeed > 1 && e.length > 1) {
            if ((e[1] & 192) !== 128) return t.lastNeed = 1, "\ufffd";
            if (t.lastNeed > 2 && e.length > 2 && (e[2] & 192) !== 128) return t.lastNeed = 2, "\ufffd";
        }
    }
    function Tb(t) {
        var e = this.lastTotal - this.lastNeed, r = Cb(this, t, e);
        if (r !== void 0) return r;
        if (this.lastNeed <= t.length) return t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        t.copy(this.lastChar, e, 0, t.length), this.lastNeed -= t.length;
    }
    function Pb(t, e) {
        var r = kb(this, t, e);
        if (!this.lastNeed) return t.toString("utf8", e);
        this.lastTotal = r;
        var i = t.length - (r - this.lastNeed);
        return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
    }
    function Db(t) {
        var e = t && t.length ? this.write(t) : "";
        return this.lastNeed ? e + "\ufffd" : e;
    }
    function Lb(t, e) {
        if ((t.length - e) % 2 === 0) {
            var r = t.toString("utf16le", e);
            if (r) {
                var i = r.charCodeAt(r.length - 1);
                if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], r.slice(0, -1);
            }
            return r;
        }
        return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
    }
    function Nb(t) {
        var e = t && t.length ? this.write(t) : "";
        if (this.lastNeed) {
            var r = this.lastTotal - this.lastNeed;
            return e + this.lastChar.toString("utf16le", 0, r);
        }
        return e;
    }
    function Ob(t, e) {
        var r = (t.length - e) % 3;
        return r === 0 ? t.toString("base64", e) : (this.lastNeed = 3 - r, this.lastTotal = 3, r === 1 ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - r));
    }
    function Fb(t) {
        var e = t && t.length ? this.write(t) : "";
        return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
    }
    function Ub(t) {
        return t.toString(this.encoding);
    }
    function zb(t) {
        return t && t.length ? this.write(t) : "";
    }
});
var In = q((q9, Nh)=>{
    "use strict";
    var Dh = $r().codes.ERR_STREAM_PREMATURE_CLOSE;
    function Hb(t) {
        var e = !1;
        return function() {
            if (!e) {
                e = !0;
                for(var r = arguments.length, i = new Array(r), n = 0; n < r; n++)i[n] = arguments[n];
                t.apply(this, i);
            }
        };
    }
    function jb() {}
    function Kb(t) {
        return t.setHeader && typeof t.abort == "function";
    }
    function Lh(t, e, r) {
        if (typeof e == "function") return Lh(t, null, e);
        e || (e = {}), r = Hb(r || jb);
        var i = e.readable || e.readable !== !1 && t.readable, n = e.writable || e.writable !== !1 && t.writable, f = function() {
            t.writable || u();
        }, o = t._writableState && t._writableState.finished, u = function() {
            n = !1, o = !0, i || r.call(t);
        }, v = t._readableState && t._readableState.endEmitted, _ = function() {
            i = !1, v = !0, n || r.call(t);
        }, x = function(I) {
            r.call(t, I);
        }, S = function() {
            var I;
            if (i && !v) return (!t._readableState || !t._readableState.ended) && (I = new Dh), r.call(t, I);
            if (n && !o) return (!t._writableState || !t._writableState.ended) && (I = new Dh), r.call(t, I);
        }, A = function() {
            t.req.on("finish", u);
        };
        return Kb(t) ? (t.on("complete", u), t.on("abort", S), t.req ? A() : t.on("request", A)) : n && !t._writableState && (t.on("end", f), t.on("close", f)), t.on("end", _), t.on("finish", u), e.error !== !1 && t.on("error", x), t.on("close", S), function() {
            t.removeListener("complete", u), t.removeListener("abort", S), t.removeListener("request", A), t.req && t.req.removeListener("finish", u), t.removeListener("end", f), t.removeListener("close", f), t.removeListener("finish", u), t.removeListener("end", _), t.removeListener("error", x), t.removeListener("close", S);
        };
    }
    Nh.exports = Lh;
});
var Fh = q((R9, Oh)=>{
    "use strict";
    var Tf;
    function gr(t, e, r) {
        return e = Wb(e), e in t ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = r, t;
    }
    function Wb(t) {
        var e = Vb(t, "string");
        return typeof e == "symbol" ? e : String(e);
    }
    function Vb(t, e) {
        if (typeof t != "object" || t === null) return t;
        var r = t[Symbol.toPrimitive];
        if (r !== void 0) {
            var i = r.call(t, e || "default");
            if (typeof i != "object") return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (e === "string" ? String : Number)(t);
    }
    var Gb = In(), _r = Symbol("lastResolve"), Qr = Symbol("lastReject"), kn = Symbol("error"), Pf = Symbol("ended"), ei = Symbol("lastPromise"), B0 = Symbol("handlePromise"), ti = Symbol("stream");
    function wr(t, e) {
        return {
            value: t,
            done: e
        };
    }
    function Zb(t) {
        var e = t[_r];
        if (e !== null) {
            var r = t[ti].read();
            r !== null && (t[ei] = null, t[_r] = null, t[Qr] = null, e(wr(r, !1)));
        }
    }
    function Xb(t) {
        process.nextTick(Zb, t);
    }
    function Yb(t, e) {
        return function(r, i) {
            t.then(function() {
                if (e[Pf]) {
                    r(wr(void 0, !0));
                    return;
                }
                e[B0](r, i);
            }, i);
        };
    }
    var Jb = Object.getPrototypeOf(function() {}), $b = Object.setPrototypeOf((Tf = {
        get stream () {
            return this[ti];
        },
        next: function() {
            var e = this, r = this[kn];
            if (r !== null) return Promise.reject(r);
            if (this[Pf]) return Promise.resolve(wr(void 0, !0));
            if (this[ti].destroyed) return new Promise(function(o, u) {
                process.nextTick(function() {
                    e[kn] ? u(e[kn]) : o(wr(void 0, !0));
                });
            });
            var i = this[ei], n;
            if (i) n = new Promise(Yb(i, this));
            else {
                var f = this[ti].read();
                if (f !== null) return Promise.resolve(wr(f, !1));
                n = new Promise(this[B0]);
            }
            return this[ei] = n, n;
        }
    }, gr(Tf, Symbol.asyncIterator, function() {
        return this;
    }), gr(Tf, "return", function() {
        var e = this;
        return new Promise(function(r, i) {
            e[ti].destroy(null, function(n) {
                if (n) {
                    i(n);
                    return;
                }
                r(wr(void 0, !0));
            });
        });
    }), Tf), Jb), Qb = function(e) {
        var r, i = Object.create($b, (r = {}, gr(r, ti, {
            value: e,
            writable: !0
        }), gr(r, _r, {
            value: null,
            writable: !0
        }), gr(r, Qr, {
            value: null,
            writable: !0
        }), gr(r, kn, {
            value: null,
            writable: !0
        }), gr(r, Pf, {
            value: e._readableState.endEmitted,
            writable: !0
        }), gr(r, B0, {
            value: function(f, o) {
                var u = i[ti].read();
                u ? (i[ei] = null, i[_r] = null, i[Qr] = null, f(wr(u, !1))) : (i[_r] = f, i[Qr] = o);
            },
            writable: !0
        }), r));
        return i[ei] = null, Gb(e, function(n) {
            if (n && n.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                var f = i[Qr];
                f !== null && (i[ei] = null, i[_r] = null, i[Qr] = null, f(n)), i[kn] = n;
                return;
            }
            var o = i[_r];
            o !== null && (i[ei] = null, i[_r] = null, i[Qr] = null, o(wr(void 0, !0))), i[Pf] = !0;
        }), e.on("readable", Xb.bind(null, i)), i;
    };
    Oh.exports = Qb;
});
var zh = q((I9, Uh)=>{
    Uh.exports = function() {
        throw new Error("Readable.from is not available in the browser");
    };
});
var kf = q((C9, Jh)=>{
    "use strict";
    Jh.exports = Be;
    var Ci;
    Be.ReadableState = Wh;
    var k9 = Mf().EventEmitter, Kh = function(e, r) {
        return e.listeners(r).length;
    }, Tn = p0(), Df = Xr().Buffer, ev = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {};
    function tv(t) {
        return Df.from(t);
    }
    function rv(t) {
        return Df.isBuffer(t) || t instanceof ev;
    }
    var q0 = b0(), Se;
    q0 && q0.debuglog ? Se = q0.debuglog("stream") : Se = function() {};
    var iv = vh(), D0 = m0(), nv = g0(), fv = nv.getHighWaterMark, Lf = $r().codes, av = Lf.ERR_INVALID_ARG_TYPE, ov = Lf.ERR_STREAM_PUSH_AFTER_EOF, sv = Lf.ERR_METHOD_NOT_IMPLEMENTED, hv = Lf.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, Ti, R0, I0;
    xe()(Be, Tn);
    var Cn = D0.errorOrDestroy, k0 = [
        "error",
        "close",
        "destroy",
        "pause",
        "resume"
    ];
    function cv(t, e, r) {
        if (typeof t.prependListener == "function") return t.prependListener(e, r);
        !t._events || !t._events[e] ? t.on(e, r) : Array.isArray(t._events[e]) ? t._events[e].unshift(r) : t._events[e] = [
            r,
            t._events[e]
        ];
    }
    function Wh(t, e, r) {
        Ci = Ci || mr(), t = t || {}, typeof r != "boolean" && (r = e instanceof Ci), this.objectMode = !!t.objectMode, r && (this.objectMode = this.objectMode || !!t.readableObjectMode), this.highWaterMark = fv(this, t, "readableHighWaterMark", r), this.buffer = new iv, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = t.emitClose !== !1, this.autoDestroy = !!t.autoDestroy, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (Ti || (Ti = Cf().StringDecoder), this.decoder = new Ti(t.encoding), this.encoding = t.encoding);
    }
    function Be(t) {
        if (Ci = Ci || mr(), !(this instanceof Be)) return new Be(t);
        var e = this instanceof Ci;
        this._readableState = new Wh(t, this, e), this.readable = !0, t && (typeof t.read == "function" && (this._read = t.read), typeof t.destroy == "function" && (this._destroy = t.destroy)), Tn.call(this);
    }
    Object.defineProperty(Be.prototype, "destroyed", {
        enumerable: !1,
        get: function() {
            return this._readableState === void 0 ? !1 : this._readableState.destroyed;
        },
        set: function(e) {
            this._readableState && (this._readableState.destroyed = e);
        }
    });
    Be.prototype.destroy = D0.destroy;
    Be.prototype._undestroy = D0.undestroy;
    Be.prototype._destroy = function(t, e) {
        e(t);
    };
    Be.prototype.push = function(t, e) {
        var r = this._readableState, i;
        return r.objectMode ? i = !0 : typeof t == "string" && (e = e || r.defaultEncoding, e !== r.encoding && (t = Df.from(t, e), e = ""), i = !0), Vh(this, t, e, !1, i);
    };
    Be.prototype.unshift = function(t) {
        return Vh(this, t, null, !0, !1);
    };
    function Vh(t, e, r, i, n) {
        Se("readableAddChunk", e);
        var f = t._readableState;
        if (e === null) f.reading = !1, lv(t, f);
        else {
            var o;
            if (n || (o = uv(f, e)), o) Cn(t, o);
            else if (f.objectMode || e && e.length > 0) {
                if (typeof e != "string" && !f.objectMode && Object.getPrototypeOf(e) !== Df.prototype && (e = tv(e)), i) f.endEmitted ? Cn(t, new hv) : C0(t, f, e, !0);
                else if (f.ended) Cn(t, new ov);
                else {
                    if (f.destroyed) return !1;
                    f.reading = !1, f.decoder && !r ? (e = f.decoder.write(e), f.objectMode || e.length !== 0 ? C0(t, f, e, !1) : P0(t, f)) : C0(t, f, e, !1);
                }
            } else i || (f.reading = !1, P0(t, f));
        }
        return !f.ended && (f.length < f.highWaterMark || f.length === 0);
    }
    function C0(t, e, r, i) {
        e.flowing && e.length === 0 && !e.sync ? (e.awaitDrain = 0, t.emit("data", r)) : (e.length += e.objectMode ? 1 : r.length, i ? e.buffer.unshift(r) : e.buffer.push(r), e.needReadable && Nf(t)), P0(t, e);
    }
    function uv(t, e) {
        var r;
        return !rv(e) && typeof e != "string" && e !== void 0 && !t.objectMode && (r = new av("chunk", [
            "string",
            "Buffer",
            "Uint8Array"
        ], e)), r;
    }
    Be.prototype.isPaused = function() {
        return this._readableState.flowing === !1;
    };
    Be.prototype.setEncoding = function(t) {
        Ti || (Ti = Cf().StringDecoder);
        var e = new Ti(t);
        this._readableState.decoder = e, this._readableState.encoding = this._readableState.decoder.encoding;
        for(var r = this._readableState.buffer.head, i = ""; r !== null;)i += e.write(r.data), r = r.next;
        return this._readableState.buffer.clear(), i !== "" && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
    };
    var Hh = 1073741824;
    function dv(t) {
        return t >= Hh ? t = Hh : (t--, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t++), t;
    }
    function jh(t, e) {
        return t <= 0 || e.length === 0 && e.ended ? 0 : e.objectMode ? 1 : t !== t ? e.flowing && e.length ? e.buffer.head.data.length : e.length : (t > e.highWaterMark && (e.highWaterMark = dv(t)), t <= e.length ? t : e.ended ? e.length : (e.needReadable = !0, 0));
    }
    Be.prototype.read = function(t) {
        Se("read", t), t = parseInt(t, 10);
        var e = this._readableState, r = t;
        if (t !== 0 && (e.emittedReadable = !1), t === 0 && e.needReadable && ((e.highWaterMark !== 0 ? e.length >= e.highWaterMark : e.length > 0) || e.ended)) return Se("read: emitReadable", e.length, e.ended), e.length === 0 && e.ended ? T0(this) : Nf(this), null;
        if (t = jh(t, e), t === 0 && e.ended) return e.length === 0 && T0(this), null;
        var i = e.needReadable;
        Se("need readable", i), (e.length === 0 || e.length - t < e.highWaterMark) && (i = !0, Se("length less than watermark", i)), e.ended || e.reading ? (i = !1, Se("reading or ended", i)) : i && (Se("do read"), e.reading = !0, e.sync = !0, e.length === 0 && (e.needReadable = !0), this._read(e.highWaterMark), e.sync = !1, e.reading || (t = jh(r, e)));
        var n;
        return t > 0 ? n = Xh(t, e) : n = null, n === null ? (e.needReadable = e.length <= e.highWaterMark, t = 0) : (e.length -= t, e.awaitDrain = 0), e.length === 0 && (e.ended || (e.needReadable = !0), r !== t && e.ended && T0(this)), n !== null && this.emit("data", n), n;
    };
    function lv(t, e) {
        if (Se("onEofChunk"), !e.ended) {
            if (e.decoder) {
                var r = e.decoder.end();
                r && r.length && (e.buffer.push(r), e.length += e.objectMode ? 1 : r.length);
            }
            e.ended = !0, e.sync ? Nf(t) : (e.needReadable = !1, e.emittedReadable || (e.emittedReadable = !0, Gh(t)));
        }
    }
    function Nf(t) {
        var e = t._readableState;
        Se("emitReadable", e.needReadable, e.emittedReadable), e.needReadable = !1, e.emittedReadable || (Se("emitReadable", e.flowing), e.emittedReadable = !0, process.nextTick(Gh, t));
    }
    function Gh(t) {
        var e = t._readableState;
        Se("emitReadable_", e.destroyed, e.length, e.ended), !e.destroyed && (e.length || e.ended) && (t.emit("readable"), e.emittedReadable = !1), e.needReadable = !e.flowing && !e.ended && e.length <= e.highWaterMark, L0(t);
    }
    function P0(t, e) {
        e.readingMore || (e.readingMore = !0, process.nextTick(pv, t, e));
    }
    function pv(t, e) {
        for(; !e.reading && !e.ended && (e.length < e.highWaterMark || e.flowing && e.length === 0);){
            var r = e.length;
            if (Se("maybeReadMore read 0"), t.read(0), r === e.length) break;
        }
        e.readingMore = !1;
    }
    Be.prototype._read = function(t) {
        Cn(this, new sv("_read()"));
    };
    Be.prototype.pipe = function(t, e) {
        var r = this, i = this._readableState;
        switch(i.pipesCount){
            case 0:
                i.pipes = t;
                break;
            case 1:
                i.pipes = [
                    i.pipes,
                    t
                ];
                break;
            default:
                i.pipes.push(t);
                break;
        }
        i.pipesCount += 1, Se("pipe count=%d opts=%j", i.pipesCount, e);
        var n = (!e || e.end !== !1) && t !== process.stdout && t !== process.stderr, f = n ? u : P;
        i.endEmitted ? process.nextTick(f) : r.once("end", f), t.on("unpipe", o);
        function o(F, D) {
            Se("onunpipe"), F === r && D && D.hasUnpiped === !1 && (D.hasUnpiped = !0, x());
        }
        function u() {
            Se("onend"), t.end();
        }
        var v = bv(r);
        t.on("drain", v);
        var _ = !1;
        function x() {
            Se("cleanup"), t.removeListener("close", B), t.removeListener("finish", I), t.removeListener("drain", v), t.removeListener("error", A), t.removeListener("unpipe", o), r.removeListener("end", u), r.removeListener("end", P), r.removeListener("data", S), _ = !0, i.awaitDrain && (!t._writableState || t._writableState.needDrain) && v();
        }
        r.on("data", S);
        function S(F) {
            Se("ondata");
            var D = t.write(F);
            Se("dest.write", D), D === !1 && ((i.pipesCount === 1 && i.pipes === t || i.pipesCount > 1 && Yh(i.pipes, t) !== -1) && !_ && (Se("false write response, pause", i.awaitDrain), i.awaitDrain++), r.pause());
        }
        function A(F) {
            Se("onerror", F), P(), t.removeListener("error", A), Kh(t, "error") === 0 && Cn(t, F);
        }
        cv(t, "error", A);
        function B() {
            t.removeListener("finish", I), P();
        }
        t.once("close", B);
        function I() {
            Se("onfinish"), t.removeListener("close", B), P();
        }
        t.once("finish", I);
        function P() {
            Se("unpipe"), r.unpipe(t);
        }
        return t.emit("pipe", r), i.flowing || (Se("pipe resume"), r.resume()), t;
    };
    function bv(t) {
        return function() {
            var r = t._readableState;
            Se("pipeOnDrain", r.awaitDrain), r.awaitDrain && r.awaitDrain--, r.awaitDrain === 0 && Kh(t, "data") && (r.flowing = !0, L0(t));
        };
    }
    Be.prototype.unpipe = function(t) {
        var e = this._readableState, r = {
            hasUnpiped: !1
        };
        if (e.pipesCount === 0) return this;
        if (e.pipesCount === 1) return t && t !== e.pipes ? this : (t || (t = e.pipes), e.pipes = null, e.pipesCount = 0, e.flowing = !1, t && t.emit("unpipe", this, r), this);
        if (!t) {
            var i = e.pipes, n = e.pipesCount;
            e.pipes = null, e.pipesCount = 0, e.flowing = !1;
            for(var f = 0; f < n; f++)i[f].emit("unpipe", this, {
                hasUnpiped: !1
            });
            return this;
        }
        var o = Yh(e.pipes, t);
        return o === -1 ? this : (e.pipes.splice(o, 1), e.pipesCount -= 1, e.pipesCount === 1 && (e.pipes = e.pipes[0]), t.emit("unpipe", this, r), this);
    };
    Be.prototype.on = function(t, e) {
        var r = Tn.prototype.on.call(this, t, e), i = this._readableState;
        return t === "data" ? (i.readableListening = this.listenerCount("readable") > 0, i.flowing !== !1 && this.resume()) : t === "readable" && !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, Se("on readable", i.length, i.reading), i.length ? Nf(this) : i.reading || process.nextTick(vv, this)), r;
    };
    Be.prototype.addListener = Be.prototype.on;
    Be.prototype.removeListener = function(t, e) {
        var r = Tn.prototype.removeListener.call(this, t, e);
        return t === "readable" && process.nextTick(Zh, this), r;
    };
    Be.prototype.removeAllListeners = function(t) {
        var e = Tn.prototype.removeAllListeners.apply(this, arguments);
        return (t === "readable" || t === void 0) && process.nextTick(Zh, this), e;
    };
    function Zh(t) {
        var e = t._readableState;
        e.readableListening = t.listenerCount("readable") > 0, e.resumeScheduled && !e.paused ? e.flowing = !0 : t.listenerCount("data") > 0 && t.resume();
    }
    function vv(t) {
        Se("readable nexttick read 0"), t.read(0);
    }
    Be.prototype.resume = function() {
        var t = this._readableState;
        return t.flowing || (Se("resume"), t.flowing = !t.readableListening, yv(this, t)), t.paused = !1, this;
    };
    function yv(t, e) {
        e.resumeScheduled || (e.resumeScheduled = !0, process.nextTick(mv, t, e));
    }
    function mv(t, e) {
        Se("resume", e.reading), e.reading || t.read(0), e.resumeScheduled = !1, t.emit("resume"), L0(t), e.flowing && !e.reading && t.read(0);
    }
    Be.prototype.pause = function() {
        return Se("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (Se("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
    };
    function L0(t) {
        var e = t._readableState;
        for(Se("flow", e.flowing); e.flowing && t.read() !== null;);
    }
    Be.prototype.wrap = function(t) {
        var e = this, r = this._readableState, i = !1;
        t.on("end", function() {
            if (Se("wrapped end"), r.decoder && !r.ended) {
                var o = r.decoder.end();
                o && o.length && e.push(o);
            }
            e.push(null);
        }), t.on("data", function(o) {
            if (Se("wrapped data"), r.decoder && (o = r.decoder.write(o)), !(r.objectMode && o == null) && !(!r.objectMode && (!o || !o.length))) {
                var u = e.push(o);
                u || (i = !0, t.pause());
            }
        });
        for(var n in t)this[n] === void 0 && typeof t[n] == "function" && (this[n] = function(u) {
            return function() {
                return t[u].apply(t, arguments);
            };
        }(n));
        for(var f = 0; f < k0.length; f++)t.on(k0[f], this.emit.bind(this, k0[f]));
        return this._read = function(o) {
            Se("wrapped _read", o), i && (i = !1, t.resume());
        }, this;
    };
    typeof Symbol == "function" && (Be.prototype[Symbol.asyncIterator] = function() {
        return R0 === void 0 && (R0 = Fh()), R0(this);
    });
    Object.defineProperty(Be.prototype, "readableHighWaterMark", {
        enumerable: !1,
        get: function() {
            return this._readableState.highWaterMark;
        }
    });
    Object.defineProperty(Be.prototype, "readableBuffer", {
        enumerable: !1,
        get: function() {
            return this._readableState && this._readableState.buffer;
        }
    });
    Object.defineProperty(Be.prototype, "readableFlowing", {
        enumerable: !1,
        get: function() {
            return this._readableState.flowing;
        },
        set: function(e) {
            this._readableState && (this._readableState.flowing = e);
        }
    });
    Be._fromList = Xh;
    Object.defineProperty(Be.prototype, "readableLength", {
        enumerable: !1,
        get: function() {
            return this._readableState.length;
        }
    });
    function Xh(t, e) {
        if (e.length === 0) return null;
        var r;
        return e.objectMode ? r = e.buffer.shift() : !t || t >= e.length ? (e.decoder ? r = e.buffer.join("") : e.buffer.length === 1 ? r = e.buffer.first() : r = e.buffer.concat(e.length), e.buffer.clear()) : r = e.buffer.consume(t, e.decoder), r;
    }
    function T0(t) {
        var e = t._readableState;
        Se("endReadable", e.endEmitted), e.endEmitted || (e.ended = !0, process.nextTick(gv, e, t));
    }
    function gv(t, e) {
        if (Se("endReadableNT", t.endEmitted, t.length), !t.endEmitted && t.length === 0 && (t.endEmitted = !0, e.readable = !1, e.emit("end"), t.autoDestroy)) {
            var r = e._writableState;
            (!r || r.autoDestroy && r.finished) && e.destroy();
        }
    }
    typeof Symbol == "function" && (Be.from = function(t, e) {
        return I0 === void 0 && (I0 = zh()), I0(Be, t, e);
    });
    function Yh(t, e) {
        for(var r = 0, i = t.length; r < i; r++)if (t[r] === e) return r;
        return -1;
    }
});
var Uf = q((T9, Qh)=>{
    "use strict";
    Qh.exports = ir;
    var Of = $r().codes, _v = Of.ERR_METHOD_NOT_IMPLEMENTED, wv = Of.ERR_MULTIPLE_CALLBACK, xv = Of.ERR_TRANSFORM_ALREADY_TRANSFORMING, Mv = Of.ERR_TRANSFORM_WITH_LENGTH_0, Ff = mr();
    xe()(ir, Ff);
    function Sv(t, e) {
        var r = this._transformState;
        r.transforming = !1;
        var i = r.writecb;
        if (i === null) return this.emit("error", new wv);
        r.writechunk = null, r.writecb = null, e != null && this.push(e), i(t);
        var n = this._readableState;
        n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
    function ir(t) {
        if (!(this instanceof ir)) return new ir(t);
        Ff.call(this, t), this._transformState = {
            afterTransform: Sv.bind(this),
            needTransform: !1,
            transforming: !1,
            writecb: null,
            writechunk: null,
            writeencoding: null
        }, this._readableState.needReadable = !0, this._readableState.sync = !1, t && (typeof t.transform == "function" && (this._transform = t.transform), typeof t.flush == "function" && (this._flush = t.flush)), this.on("prefinish", Ev);
    }
    function Ev() {
        var t = this;
        typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(e, r) {
            $h(t, e, r);
        }) : $h(this, null, null);
    }
    ir.prototype.push = function(t, e) {
        return this._transformState.needTransform = !1, Ff.prototype.push.call(this, t, e);
    };
    ir.prototype._transform = function(t, e, r) {
        r(new _v("_transform()"));
    };
    ir.prototype._write = function(t, e, r) {
        var i = this._transformState;
        if (i.writecb = r, i.writechunk = t, i.writeencoding = e, !i.transforming) {
            var n = this._readableState;
            (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
        }
    };
    ir.prototype._read = function(t) {
        var e = this._transformState;
        e.writechunk !== null && !e.transforming ? (e.transforming = !0, this._transform(e.writechunk, e.writeencoding, e.afterTransform)) : e.needTransform = !0;
    };
    ir.prototype._destroy = function(t, e) {
        Ff.prototype._destroy.call(this, t, function(r) {
            e(r);
        });
    };
    function $h(t, e, r) {
        if (e) return t.emit("error", e);
        if (r != null && t.push(r), t._writableState.length) throw new Mv;
        if (t._transformState.transforming) throw new xv;
        return t.push(null);
    }
});
var N0 = q((P9, tc)=>{
    "use strict";
    tc.exports = Pn;
    var ec = Uf();
    xe()(Pn, ec);
    function Pn(t) {
        if (!(this instanceof Pn)) return new Pn(t);
        ec.call(this, t);
    }
    Pn.prototype._transform = function(t, e, r) {
        r(null, t);
    };
});
var F0 = q((D9, fc)=>{
    "use strict";
    var O0;
    function Av(t) {
        var e = !1;
        return function() {
            e || (e = !0, t.apply(void 0, arguments));
        };
    }
    var nc = $r().codes, Bv = nc.ERR_MISSING_ARGS, qv = nc.ERR_STREAM_DESTROYED;
    function rc(t) {
        if (t) throw t;
    }
    function Rv(t) {
        return t.setHeader && typeof t.abort == "function";
    }
    function Iv(t, e, r, i) {
        i = Av(i);
        var n = !1;
        t.on("close", function() {
            n = !0;
        }), O0 === void 0 && (O0 = In()), O0(t, {
            readable: e,
            writable: r
        }, function(o) {
            if (o) return i(o);
            n = !0, i();
        });
        var f = !1;
        return function(o) {
            if (!n && !f) {
                if (f = !0, Rv(t)) return t.abort();
                if (typeof t.destroy == "function") return t.destroy();
                i(o || new qv("pipe"));
            }
        };
    }
    function ic(t) {
        t();
    }
    function kv(t, e) {
        return t.pipe(e);
    }
    function Cv(t) {
        return !t.length || typeof t[t.length - 1] != "function" ? rc : t.pop();
    }
    function Tv() {
        for(var t = arguments.length, e = new Array(t), r = 0; r < t; r++)e[r] = arguments[r];
        var i = Cv(e);
        if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Bv("streams");
        var n, f = e.map(function(o, u) {
            var v = u < e.length - 1, _ = u > 0;
            return Iv(o, v, _, function(x) {
                n || (n = x), x && f.forEach(ic), !v && (f.forEach(ic), i(n));
            });
        });
        return e.reduce(kv);
    }
    fc.exports = Tv;
});
var U0 = q((vt, ac)=>{
    vt = ac.exports = kf();
    vt.Stream = vt;
    vt.Readable = vt;
    vt.Writable = qf();
    vt.Duplex = mr();
    vt.Transform = Uf();
    vt.PassThrough = N0();
    vt.finished = In();
    vt.pipeline = F0();
});
var z0 = q((L9, sc)=>{
    "use strict";
    var zf = we().Buffer, oc = U0().Transform, Pv = xe();
    function Dv(t, e) {
        if (!zf.isBuffer(t) && typeof t != "string") throw new TypeError(e + " must be a string or a buffer");
    }
    function xr(t) {
        oc.call(this), this._block = zf.allocUnsafe(t), this._blockSize = t, this._blockOffset = 0, this._length = [
            0,
            0,
            0,
            0
        ], this._finalized = !1;
    }
    Pv(xr, oc);
    xr.prototype._transform = function(t, e, r) {
        var i = null;
        try {
            this.update(t, e);
        } catch (n) {
            i = n;
        }
        r(i);
    };
    xr.prototype._flush = function(t) {
        var e = null;
        try {
            this.push(this.digest());
        } catch (r) {
            e = r;
        }
        t(e);
    };
    xr.prototype.update = function(t, e) {
        if (Dv(t, "Data"), this._finalized) throw new Error("Digest already called");
        zf.isBuffer(t) || (t = zf.from(t, e));
        for(var r = this._block, i = 0; this._blockOffset + t.length - i >= this._blockSize;){
            for(var n = this._blockOffset; n < this._blockSize;)r[n++] = t[i++];
            this._update(), this._blockOffset = 0;
        }
        for(; i < t.length;)r[this._blockOffset++] = t[i++];
        for(var f = 0, o = t.length * 8; o > 0; ++f)this._length[f] += o, o = this._length[f] / 4294967296 | 0, o > 0 && (this._length[f] -= 4294967296 * o);
        return this;
    };
    xr.prototype._update = function() {
        throw new Error("_update is not implemented");
    };
    xr.prototype.digest = function(t) {
        if (this._finalized) throw new Error("Digest already called");
        this._finalized = !0;
        var e = this._digest();
        t !== void 0 && (e = e.toString(t)), this._block.fill(0), this._blockOffset = 0;
        for(var r = 0; r < 4; ++r)this._length[r] = 0;
        return e;
    };
    xr.prototype._digest = function() {
        throw new Error("_digest is not implemented");
    };
    sc.exports = xr;
});
var Kf = q((N9, cc)=>{
    "use strict";
    var Lv = xe(), hc = z0(), Nv = we().Buffer, Ov = new Array(16);
    function Hf() {
        hc.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
    }
    Lv(Hf, hc);
    Hf.prototype._update = function() {
        for(var t = Ov, e = 0; e < 16; ++e)t[e] = this._block.readInt32LE(e * 4);
        var r = this._a, i = this._b, n = this._c, f = this._d;
        r = $e(r, i, n, f, t[0], 3614090360, 7), f = $e(f, r, i, n, t[1], 3905402710, 12), n = $e(n, f, r, i, t[2], 606105819, 17), i = $e(i, n, f, r, t[3], 3250441966, 22), r = $e(r, i, n, f, t[4], 4118548399, 7), f = $e(f, r, i, n, t[5], 1200080426, 12), n = $e(n, f, r, i, t[6], 2821735955, 17), i = $e(i, n, f, r, t[7], 4249261313, 22), r = $e(r, i, n, f, t[8], 1770035416, 7), f = $e(f, r, i, n, t[9], 2336552879, 12), n = $e(n, f, r, i, t[10], 4294925233, 17), i = $e(i, n, f, r, t[11], 2304563134, 22), r = $e(r, i, n, f, t[12], 1804603682, 7), f = $e(f, r, i, n, t[13], 4254626195, 12), n = $e(n, f, r, i, t[14], 2792965006, 17), i = $e(i, n, f, r, t[15], 1236535329, 22), r = Qe(r, i, n, f, t[1], 4129170786, 5), f = Qe(f, r, i, n, t[6], 3225465664, 9), n = Qe(n, f, r, i, t[11], 643717713, 14), i = Qe(i, n, f, r, t[0], 3921069994, 20), r = Qe(r, i, n, f, t[5], 3593408605, 5), f = Qe(f, r, i, n, t[10], 38016083, 9), n = Qe(n, f, r, i, t[15], 3634488961, 14), i = Qe(i, n, f, r, t[4], 3889429448, 20), r = Qe(r, i, n, f, t[9], 568446438, 5), f = Qe(f, r, i, n, t[14], 3275163606, 9), n = Qe(n, f, r, i, t[3], 4107603335, 14), i = Qe(i, n, f, r, t[8], 1163531501, 20), r = Qe(r, i, n, f, t[13], 2850285829, 5), f = Qe(f, r, i, n, t[2], 4243563512, 9), n = Qe(n, f, r, i, t[7], 1735328473, 14), i = Qe(i, n, f, r, t[12], 2368359562, 20), r = et(r, i, n, f, t[5], 4294588738, 4), f = et(f, r, i, n, t[8], 2272392833, 11), n = et(n, f, r, i, t[11], 1839030562, 16), i = et(i, n, f, r, t[14], 4259657740, 23), r = et(r, i, n, f, t[1], 2763975236, 4), f = et(f, r, i, n, t[4], 1272893353, 11), n = et(n, f, r, i, t[7], 4139469664, 16), i = et(i, n, f, r, t[10], 3200236656, 23), r = et(r, i, n, f, t[13], 681279174, 4), f = et(f, r, i, n, t[0], 3936430074, 11), n = et(n, f, r, i, t[3], 3572445317, 16), i = et(i, n, f, r, t[6], 76029189, 23), r = et(r, i, n, f, t[9], 3654602809, 4), f = et(f, r, i, n, t[12], 3873151461, 11), n = et(n, f, r, i, t[15], 530742520, 16), i = et(i, n, f, r, t[2], 3299628645, 23), r = tt(r, i, n, f, t[0], 4096336452, 6), f = tt(f, r, i, n, t[7], 1126891415, 10), n = tt(n, f, r, i, t[14], 2878612391, 15), i = tt(i, n, f, r, t[5], 4237533241, 21), r = tt(r, i, n, f, t[12], 1700485571, 6), f = tt(f, r, i, n, t[3], 2399980690, 10), n = tt(n, f, r, i, t[10], 4293915773, 15), i = tt(i, n, f, r, t[1], 2240044497, 21), r = tt(r, i, n, f, t[8], 1873313359, 6), f = tt(f, r, i, n, t[15], 4264355552, 10), n = tt(n, f, r, i, t[6], 2734768916, 15), i = tt(i, n, f, r, t[13], 1309151649, 21), r = tt(r, i, n, f, t[4], 4149444226, 6), f = tt(f, r, i, n, t[11], 3174756917, 10), n = tt(n, f, r, i, t[2], 718787259, 15), i = tt(i, n, f, r, t[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + i | 0, this._c = this._c + n | 0, this._d = this._d + f | 0;
    };
    Hf.prototype._digest = function() {
        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
        var t = Nv.allocUnsafe(16);
        return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t;
    };
    function jf(t, e) {
        return t << e | t >>> 32 - e;
    }
    function $e(t, e, r, i, n, f, o) {
        return jf(t + (e & r | ~e & i) + n + f | 0, o) + e | 0;
    }
    function Qe(t, e, r, i, n, f, o) {
        return jf(t + (e & i | r & ~i) + n + f | 0, o) + e | 0;
    }
    function et(t, e, r, i, n, f, o) {
        return jf(t + (e ^ r ^ i) + n + f | 0, o) + e | 0;
    }
    function tt(t, e, r, i, n, f, o) {
        return jf(t + (r ^ (e | ~i)) + n + f | 0, o) + e | 0;
    }
    cc.exports = Hf;
});
var Vf = q((O9, yc)=>{
    "use strict";
    var H0 = Xr().Buffer, Fv = xe(), vc = z0(), Uv = new Array(16), Dn = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        7,
        4,
        13,
        1,
        10,
        6,
        15,
        3,
        12,
        0,
        9,
        5,
        2,
        14,
        11,
        8,
        3,
        10,
        14,
        4,
        9,
        15,
        8,
        1,
        2,
        7,
        0,
        6,
        13,
        11,
        5,
        12,
        1,
        9,
        11,
        10,
        0,
        8,
        12,
        4,
        13,
        3,
        7,
        15,
        14,
        5,
        6,
        2,
        4,
        0,
        5,
        9,
        7,
        12,
        2,
        10,
        14,
        1,
        3,
        8,
        11,
        6,
        15,
        13
    ], Ln = [
        5,
        14,
        7,
        0,
        9,
        2,
        11,
        4,
        13,
        6,
        15,
        8,
        1,
        10,
        3,
        12,
        6,
        11,
        3,
        7,
        0,
        13,
        5,
        10,
        14,
        15,
        8,
        12,
        4,
        9,
        1,
        2,
        15,
        5,
        1,
        3,
        7,
        14,
        6,
        9,
        11,
        8,
        12,
        2,
        10,
        0,
        4,
        13,
        8,
        6,
        4,
        1,
        3,
        11,
        15,
        0,
        5,
        12,
        2,
        13,
        9,
        7,
        10,
        14,
        12,
        15,
        10,
        4,
        1,
        5,
        8,
        7,
        6,
        2,
        13,
        14,
        0,
        3,
        9,
        11
    ], Nn = [
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6
    ], On = [
        8,
        9,
        9,
        11,
        13,
        15,
        15,
        5,
        7,
        7,
        8,
        11,
        14,
        14,
        12,
        6,
        9,
        13,
        15,
        7,
        12,
        8,
        9,
        11,
        7,
        7,
        12,
        7,
        6,
        15,
        13,
        11,
        9,
        7,
        15,
        11,
        8,
        6,
        6,
        14,
        12,
        13,
        5,
        14,
        13,
        13,
        7,
        5,
        15,
        5,
        8,
        11,
        14,
        14,
        6,
        14,
        6,
        9,
        12,
        9,
        12,
        5,
        15,
        8,
        8,
        5,
        12,
        9,
        12,
        5,
        14,
        6,
        8,
        13,
        6,
        5,
        15,
        13,
        11,
        11
    ], Fn = [
        0,
        1518500249,
        1859775393,
        2400959708,
        2840853838
    ], Un = [
        1352829926,
        1548603684,
        1836072691,
        2053994217,
        0
    ];
    function Wf() {
        vc.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
    }
    Fv(Wf, vc);
    Wf.prototype._update = function() {
        for(var t = Uv, e = 0; e < 16; ++e)t[e] = this._block.readInt32LE(e * 4);
        for(var r = this._a | 0, i = this._b | 0, n = this._c | 0, f = this._d | 0, o = this._e | 0, u = this._a | 0, v = this._b | 0, _ = this._c | 0, x = this._d | 0, S = this._e | 0, A = 0; A < 80; A += 1){
            var B, I;
            A < 16 ? (B = uc(r, i, n, f, o, t[Dn[A]], Fn[0], Nn[A]), I = bc(u, v, _, x, S, t[Ln[A]], Un[0], On[A])) : A < 32 ? (B = dc(r, i, n, f, o, t[Dn[A]], Fn[1], Nn[A]), I = pc(u, v, _, x, S, t[Ln[A]], Un[1], On[A])) : A < 48 ? (B = lc(r, i, n, f, o, t[Dn[A]], Fn[2], Nn[A]), I = lc(u, v, _, x, S, t[Ln[A]], Un[2], On[A])) : A < 64 ? (B = pc(r, i, n, f, o, t[Dn[A]], Fn[3], Nn[A]), I = dc(u, v, _, x, S, t[Ln[A]], Un[3], On[A])) : (B = bc(r, i, n, f, o, t[Dn[A]], Fn[4], Nn[A]), I = uc(u, v, _, x, S, t[Ln[A]], Un[4], On[A])), r = o, o = f, f = ri(n, 10), n = i, i = B, u = S, S = x, x = ri(_, 10), _ = v, v = I;
        }
        var P = this._b + n + x | 0;
        this._b = this._c + f + S | 0, this._c = this._d + o + u | 0, this._d = this._e + r + v | 0, this._e = this._a + i + _ | 0, this._a = P;
    };
    Wf.prototype._digest = function() {
        this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
        var t = H0.alloc ? H0.alloc(20) : new H0(20);
        return t.writeInt32LE(this._a, 0), t.writeInt32LE(this._b, 4), t.writeInt32LE(this._c, 8), t.writeInt32LE(this._d, 12), t.writeInt32LE(this._e, 16), t;
    };
    function ri(t, e) {
        return t << e | t >>> 32 - e;
    }
    function uc(t, e, r, i, n, f, o, u) {
        return ri(t + (e ^ r ^ i) + f + o | 0, u) + n | 0;
    }
    function dc(t, e, r, i, n, f, o, u) {
        return ri(t + (e & r | ~e & i) + f + o | 0, u) + n | 0;
    }
    function lc(t, e, r, i, n, f, o, u) {
        return ri(t + ((e | ~r) ^ i) + f + o | 0, u) + n | 0;
    }
    function pc(t, e, r, i, n, f, o, u) {
        return ri(t + (e & i | r & ~i) + f + o | 0, u) + n | 0;
    }
    function bc(t, e, r, i, n, f, o, u) {
        return ri(t + (e ^ (r | ~i)) + f + o | 0, u) + n | 0;
    }
    yc.exports = Wf;
});
var ii = q((F9, gc)=>{
    var mc = we().Buffer;
    function Gf(t, e) {
        this._block = mc.alloc(t), this._finalSize = e, this._blockSize = t, this._len = 0;
    }
    Gf.prototype.update = function(t, e) {
        typeof t == "string" && (e = e || "utf8", t = mc.from(t, e));
        for(var r = this._block, i = this._blockSize, n = t.length, f = this._len, o = 0; o < n;){
            for(var u = f % i, v = Math.min(n - o, i - u), _ = 0; _ < v; _++)r[u + _] = t[o + _];
            f += v, o += v, f % i === 0 && this._update(r);
        }
        return this._len += n, this;
    };
    Gf.prototype.digest = function(t) {
        var e = this._len % this._blockSize;
        this._block[e] = 128, this._block.fill(0, e + 1), e >= this._finalSize && (this._update(this._block), this._block.fill(0));
        var r = this._len * 8;
        if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4);
        else {
            var i = (r & 4294967295) >>> 0, n = (r - i) / 4294967296;
            this._block.writeUInt32BE(n, this._blockSize - 8), this._block.writeUInt32BE(i, this._blockSize - 4);
        }
        this._update(this._block);
        var f = this._hash();
        return t ? f.toString(t) : f;
    };
    Gf.prototype._update = function() {
        throw new Error("_update must be implemented by subclass");
    };
    gc.exports = Gf;
});
var xc = q((U9, wc)=>{
    var zv = xe(), _c = ii(), Hv = we().Buffer, jv = [
        1518500249,
        1859775393,
        -1894007588,
        -899497514
    ], Kv = new Array(80);
    function zn() {
        this.init(), this._w = Kv, _c.call(this, 64, 56);
    }
    zv(zn, _c);
    zn.prototype.init = function() {
        return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    };
    function Wv(t) {
        return t << 5 | t >>> 27;
    }
    function Vv(t) {
        return t << 30 | t >>> 2;
    }
    function Gv(t, e, r, i) {
        return t === 0 ? e & r | ~e & i : t === 2 ? e & r | e & i | r & i : e ^ r ^ i;
    }
    zn.prototype._update = function(t) {
        for(var e = this._w, r = this._a | 0, i = this._b | 0, n = this._c | 0, f = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)e[u] = t.readInt32BE(u * 4);
        for(; u < 80; ++u)e[u] = e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16];
        for(var v = 0; v < 80; ++v){
            var _ = ~~(v / 20), x = Wv(r) + Gv(_, i, n, f) + o + e[v] + jv[_] | 0;
            o = f, f = n, n = Vv(i), i = r, r = x;
        }
        this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = n + this._c | 0, this._d = f + this._d | 0, this._e = o + this._e | 0;
    };
    zn.prototype._hash = function() {
        var t = Hv.allocUnsafe(20);
        return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
    };
    wc.exports = zn;
});
var Ec = q((z9, Sc)=>{
    var Zv = xe(), Mc = ii(), Xv = we().Buffer, Yv = [
        1518500249,
        1859775393,
        -1894007588,
        -899497514
    ], Jv = new Array(80);
    function Hn() {
        this.init(), this._w = Jv, Mc.call(this, 64, 56);
    }
    Zv(Hn, Mc);
    Hn.prototype.init = function() {
        return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
    };
    function $v(t) {
        return t << 1 | t >>> 31;
    }
    function Qv(t) {
        return t << 5 | t >>> 27;
    }
    function e6(t) {
        return t << 30 | t >>> 2;
    }
    function t6(t, e, r, i) {
        return t === 0 ? e & r | ~e & i : t === 2 ? e & r | e & i | r & i : e ^ r ^ i;
    }
    Hn.prototype._update = function(t) {
        for(var e = this._w, r = this._a | 0, i = this._b | 0, n = this._c | 0, f = this._d | 0, o = this._e | 0, u = 0; u < 16; ++u)e[u] = t.readInt32BE(u * 4);
        for(; u < 80; ++u)e[u] = $v(e[u - 3] ^ e[u - 8] ^ e[u - 14] ^ e[u - 16]);
        for(var v = 0; v < 80; ++v){
            var _ = ~~(v / 20), x = Qv(r) + t6(_, i, n, f) + o + e[v] + Yv[_] | 0;
            o = f, f = n, n = e6(i), i = r, r = x;
        }
        this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = n + this._c | 0, this._d = f + this._d | 0, this._e = o + this._e | 0;
    };
    Hn.prototype._hash = function() {
        var t = Xv.allocUnsafe(20);
        return t.writeInt32BE(this._a | 0, 0), t.writeInt32BE(this._b | 0, 4), t.writeInt32BE(this._c | 0, 8), t.writeInt32BE(this._d | 0, 12), t.writeInt32BE(this._e | 0, 16), t;
    };
    Sc.exports = Hn;
});
var j0 = q((H9, Bc)=>{
    var r6 = xe(), Ac = ii(), i6 = we().Buffer, n6 = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
    ], f6 = new Array(64);
    function jn() {
        this.init(), this._w = f6, Ac.call(this, 64, 56);
    }
    r6(jn, Ac);
    jn.prototype.init = function() {
        return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
    };
    function a6(t, e, r) {
        return r ^ t & (e ^ r);
    }
    function o6(t, e, r) {
        return t & e | r & (t | e);
    }
    function s6(t) {
        return (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10);
    }
    function h6(t) {
        return (t >>> 6 | t << 26) ^ (t >>> 11 | t << 21) ^ (t >>> 25 | t << 7);
    }
    function c6(t) {
        return (t >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3;
    }
    function u6(t) {
        return (t >>> 17 | t << 15) ^ (t >>> 19 | t << 13) ^ t >>> 10;
    }
    jn.prototype._update = function(t) {
        for(var e = this._w, r = this._a | 0, i = this._b | 0, n = this._c | 0, f = this._d | 0, o = this._e | 0, u = this._f | 0, v = this._g | 0, _ = this._h | 0, x = 0; x < 16; ++x)e[x] = t.readInt32BE(x * 4);
        for(; x < 64; ++x)e[x] = u6(e[x - 2]) + e[x - 7] + c6(e[x - 15]) + e[x - 16] | 0;
        for(var S = 0; S < 64; ++S){
            var A = _ + h6(o) + a6(o, u, v) + n6[S] + e[S] | 0, B = s6(r) + o6(r, i, n) | 0;
            _ = v, v = u, u = o, o = f + A | 0, f = n, n = i, i = r, r = A + B | 0;
        }
        this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = n + this._c | 0, this._d = f + this._d | 0, this._e = o + this._e | 0, this._f = u + this._f | 0, this._g = v + this._g | 0, this._h = _ + this._h | 0;
    };
    jn.prototype._hash = function() {
        var t = i6.allocUnsafe(32);
        return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t.writeInt32BE(this._h, 28), t;
    };
    Bc.exports = jn;
});
var Rc = q((j9, qc)=>{
    var d6 = xe(), l6 = j0(), p6 = ii(), b6 = we().Buffer, v6 = new Array(64);
    function Zf() {
        this.init(), this._w = v6, p6.call(this, 64, 56);
    }
    d6(Zf, l6);
    Zf.prototype.init = function() {
        return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
    };
    Zf.prototype._hash = function() {
        var t = b6.allocUnsafe(28);
        return t.writeInt32BE(this._a, 0), t.writeInt32BE(this._b, 4), t.writeInt32BE(this._c, 8), t.writeInt32BE(this._d, 12), t.writeInt32BE(this._e, 16), t.writeInt32BE(this._f, 20), t.writeInt32BE(this._g, 24), t;
    };
    qc.exports = Zf;
});
var K0 = q((K9, Lc)=>{
    var y6 = xe(), Dc = ii(), m6 = we().Buffer, Ic = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
    ], g6 = new Array(160);
    function Kn() {
        this.init(), this._w = g6, Dc.call(this, 128, 112);
    }
    y6(Kn, Dc);
    Kn.prototype.init = function() {
        return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
    };
    function kc(t, e, r) {
        return r ^ t & (e ^ r);
    }
    function Cc(t, e, r) {
        return t & e | r & (t | e);
    }
    function Tc(t, e) {
        return (t >>> 28 | e << 4) ^ (e >>> 2 | t << 30) ^ (e >>> 7 | t << 25);
    }
    function Pc(t, e) {
        return (t >>> 14 | e << 18) ^ (t >>> 18 | e << 14) ^ (e >>> 9 | t << 23);
    }
    function _6(t, e) {
        return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ t >>> 7;
    }
    function w6(t, e) {
        return (t >>> 1 | e << 31) ^ (t >>> 8 | e << 24) ^ (t >>> 7 | e << 25);
    }
    function x6(t, e) {
        return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ t >>> 6;
    }
    function M6(t, e) {
        return (t >>> 19 | e << 13) ^ (e >>> 29 | t << 3) ^ (t >>> 6 | e << 26);
    }
    function We(t, e) {
        return t >>> 0 < e >>> 0 ? 1 : 0;
    }
    Kn.prototype._update = function(t) {
        for(var e = this._w, r = this._ah | 0, i = this._bh | 0, n = this._ch | 0, f = this._dh | 0, o = this._eh | 0, u = this._fh | 0, v = this._gh | 0, _ = this._hh | 0, x = this._al | 0, S = this._bl | 0, A = this._cl | 0, B = this._dl | 0, I = this._el | 0, P = this._fl | 0, F = this._gl | 0, D = this._hl | 0, z = 0; z < 32; z += 2)e[z] = t.readInt32BE(z * 4), e[z + 1] = t.readInt32BE(z * 4 + 4);
        for(; z < 160; z += 2){
            var Ae = e[z - 30], qe = e[z - 30 + 1], Pe = _6(Ae, qe), Re = w6(qe, Ae);
            Ae = e[z - 4], qe = e[z - 4 + 1];
            var Ue = x6(Ae, qe), Ee = M6(qe, Ae), Fe = e[z - 14], E = e[z - 14 + 1], c = e[z - 32], m = e[z - 32 + 1], l = Re + E | 0, a = Pe + Fe + We(l, Re) | 0;
            l = l + Ee | 0, a = a + Ue + We(l, Ee) | 0, l = l + m | 0, a = a + c + We(l, m) | 0, e[z] = a, e[z + 1] = l;
        }
        for(var h = 0; h < 160; h += 2){
            a = e[h], l = e[h + 1];
            var p = Cc(r, i, n), y = Cc(x, S, A), b = Tc(r, x), s = Tc(x, r), g = Pc(o, I), w = Pc(I, o), d = Ic[h], M = Ic[h + 1], k = kc(o, u, v), T = kc(I, P, F), C = D + w | 0, N = _ + g + We(C, D) | 0;
            C = C + T | 0, N = N + k + We(C, T) | 0, C = C + M | 0, N = N + d + We(C, M) | 0, C = C + l | 0, N = N + a + We(C, l) | 0;
            var L = s + y | 0, O = b + p + We(L, s) | 0;
            _ = v, D = F, v = u, F = P, u = o, P = I, I = B + C | 0, o = f + N + We(I, B) | 0, f = n, B = A, n = i, A = S, i = r, S = x, x = C + L | 0, r = N + O + We(x, C) | 0;
        }
        this._al = this._al + x | 0, this._bl = this._bl + S | 0, this._cl = this._cl + A | 0, this._dl = this._dl + B | 0, this._el = this._el + I | 0, this._fl = this._fl + P | 0, this._gl = this._gl + F | 0, this._hl = this._hl + D | 0, this._ah = this._ah + r + We(this._al, x) | 0, this._bh = this._bh + i + We(this._bl, S) | 0, this._ch = this._ch + n + We(this._cl, A) | 0, this._dh = this._dh + f + We(this._dl, B) | 0, this._eh = this._eh + o + We(this._el, I) | 0, this._fh = this._fh + u + We(this._fl, P) | 0, this._gh = this._gh + v + We(this._gl, F) | 0, this._hh = this._hh + _ + We(this._hl, D) | 0;
    };
    Kn.prototype._hash = function() {
        var t = m6.allocUnsafe(64);
        function e(r, i, n) {
            t.writeInt32BE(r, n), t.writeInt32BE(i, n + 4);
        }
        return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), t;
    };
    Lc.exports = Kn;
});
var Oc = q((W9, Nc)=>{
    var S6 = xe(), E6 = K0(), A6 = ii(), B6 = we().Buffer, q6 = new Array(160);
    function Xf() {
        this.init(), this._w = q6, A6.call(this, 128, 112);
    }
    S6(Xf, E6);
    Xf.prototype.init = function() {
        return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
    };
    Xf.prototype._hash = function() {
        var t = B6.allocUnsafe(48);
        function e(r, i, n) {
            t.writeInt32BE(r, n), t.writeInt32BE(i, n + 4);
        }
        return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), t;
    };
    Nc.exports = Xf;
});
var Yf = q((nr, Fc)=>{
    var nr = Fc.exports = function(e) {
        e = e.toLowerCase();
        var r = nr[e];
        if (!r) throw new Error(e + " is not supported (we accept pull requests)");
        return new r;
    };
    nr.sha = xc();
    nr.sha1 = Ec();
    nr.sha224 = Rc();
    nr.sha256 = j0();
    nr.sha384 = Oc();
    nr.sha512 = K0();
});
var zc = q((V9, Uc)=>{
    Uc.exports = yt;
    var W0 = Mf().EventEmitter, R6 = xe();
    R6(yt, W0);
    yt.Readable = kf();
    yt.Writable = qf();
    yt.Duplex = mr();
    yt.Transform = Uf();
    yt.PassThrough = N0();
    yt.finished = In();
    yt.pipeline = F0();
    yt.Stream = yt;
    function yt() {
        W0.call(this);
    }
    yt.prototype.pipe = function(t, e) {
        var r = this;
        function i(x) {
            t.writable && t.write(x) === !1 && r.pause && r.pause();
        }
        r.on("data", i);
        function n() {
            r.readable && r.resume && r.resume();
        }
        t.on("drain", n), !t._isStdio && (!e || e.end !== !1) && (r.on("end", o), r.on("close", u));
        var f = !1;
        function o() {
            f || (f = !0, t.end());
        }
        function u() {
            f || (f = !0, typeof t.destroy == "function" && t.destroy());
        }
        function v(x) {
            if (_(), W0.listenerCount(this, "error") === 0) throw x;
        }
        r.on("error", v), t.on("error", v);
        function _() {
            r.removeListener("data", i), t.removeListener("drain", n), r.removeListener("end", o), r.removeListener("close", u), r.removeListener("error", v), t.removeListener("error", v), r.removeListener("end", _), r.removeListener("close", _), t.removeListener("close", _);
        }
        return r.on("end", _), r.on("close", _), t.on("close", _), t.emit("pipe", r), t;
    };
});
var fr = q((G9, Kc)=>{
    var Hc = we().Buffer, jc = zc().Transform, I6 = Cf().StringDecoder, k6 = xe();
    function kt(t) {
        jc.call(this), this.hashMode = typeof t == "string", this.hashMode ? this[t] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
    }
    k6(kt, jc);
    kt.prototype.update = function(t, e, r) {
        typeof t == "string" && (t = Hc.from(t, e));
        var i = this._update(t);
        return this.hashMode ? this : (r && (i = this._toString(i, r)), i);
    };
    kt.prototype.setAutoPadding = function() {};
    kt.prototype.getAuthTag = function() {
        throw new Error("trying to get auth tag in unsupported state");
    };
    kt.prototype.setAuthTag = function() {
        throw new Error("trying to set auth tag in unsupported state");
    };
    kt.prototype.setAAD = function() {
        throw new Error("trying to set aad in unsupported state");
    };
    kt.prototype._transform = function(t, e, r) {
        var i;
        try {
            this.hashMode ? this._update(t) : this.push(this._update(t));
        } catch (n) {
            i = n;
        } finally{
            r(i);
        }
    };
    kt.prototype._flush = function(t) {
        var e;
        try {
            this.push(this.__final());
        } catch (r) {
            e = r;
        }
        t(e);
    };
    kt.prototype._finalOrDigest = function(t) {
        var e = this.__final() || Hc.alloc(0);
        return t && (e = this._toString(e, t, !0)), e;
    };
    kt.prototype._toString = function(t, e, r) {
        if (this._decoder || (this._decoder = new I6(e), this._encoding = e), this._encoding !== e) throw new Error("can't switch encodings");
        var i = this._decoder.write(t);
        return r && (i += this._decoder.end()), i;
    };
    Kc.exports = kt;
});
var Pi = q((Z9, Vc)=>{
    "use strict";
    var C6 = xe(), T6 = Kf(), P6 = Vf(), D6 = Yf(), Wc = fr();
    function Jf(t) {
        Wc.call(this, "digest"), this._hash = t;
    }
    C6(Jf, Wc);
    Jf.prototype._update = function(t) {
        this._hash.update(t);
    };
    Jf.prototype._final = function() {
        return this._hash.digest();
    };
    Vc.exports = function(e) {
        return e = e.toLowerCase(), e === "md5" ? new T6 : e === "rmd160" || e === "ripemd160" ? new P6 : new Jf(D6(e));
    };
});
var Xc = q((X9, Zc)=>{
    "use strict";
    var L6 = xe(), ni = we().Buffer, Gc = fr(), N6 = ni.alloc(128), Di = 64;
    function $f(t, e) {
        Gc.call(this, "digest"), typeof e == "string" && (e = ni.from(e)), this._alg = t, this._key = e, e.length > Di ? e = t(e) : e.length < Di && (e = ni.concat([
            e,
            N6
        ], Di));
        for(var r = this._ipad = ni.allocUnsafe(Di), i = this._opad = ni.allocUnsafe(Di), n = 0; n < Di; n++)r[n] = e[n] ^ 54, i[n] = e[n] ^ 92;
        this._hash = [
            r
        ];
    }
    L6($f, Gc);
    $f.prototype._update = function(t) {
        this._hash.push(t);
    };
    $f.prototype._final = function() {
        var t = this._alg(ni.concat(this._hash));
        return this._alg(ni.concat([
            this._opad,
            t
        ]));
    };
    Zc.exports = $f;
});
var V0 = q((Y9, Yc)=>{
    var O6 = Kf();
    Yc.exports = function(t) {
        return new O6().update(t).digest();
    };
});
var X0 = q((J9, $c)=>{
    "use strict";
    var F6 = xe(), U6 = Xc(), Jc = fr(), Wn = we().Buffer, z6 = V0(), G0 = Vf(), Z0 = Yf(), H6 = Wn.alloc(128);
    function Vn(t, e) {
        Jc.call(this, "digest"), typeof e == "string" && (e = Wn.from(e));
        var r = t === "sha512" || t === "sha384" ? 128 : 64;
        if (this._alg = t, this._key = e, e.length > r) {
            var i = t === "rmd160" ? new G0 : Z0(t);
            e = i.update(e).digest();
        } else e.length < r && (e = Wn.concat([
            e,
            H6
        ], r));
        for(var n = this._ipad = Wn.allocUnsafe(r), f = this._opad = Wn.allocUnsafe(r), o = 0; o < r; o++)n[o] = e[o] ^ 54, f[o] = e[o] ^ 92;
        this._hash = t === "rmd160" ? new G0 : Z0(t), this._hash.update(n);
    }
    F6(Vn, Jc);
    Vn.prototype._update = function(t) {
        this._hash.update(t);
    };
    Vn.prototype._final = function() {
        var t = this._hash.digest(), e = this._alg === "rmd160" ? new G0 : Z0(this._alg);
        return e.update(this._opad).update(t).digest();
    };
    $c.exports = function(e, r) {
        return e = e.toLowerCase(), e === "rmd160" || e === "ripemd160" ? new Vn("rmd160", r) : e === "md5" ? new U6(z6, r) : new Vn(e, r);
    };
});
var Y0 = q(($9, j6)=>{
    j6.exports = {
        sha224WithRSAEncryption: {
            sign: "rsa",
            hash: "sha224",
            id: "302d300d06096086480165030402040500041c"
        },
        "RSA-SHA224": {
            sign: "ecdsa/rsa",
            hash: "sha224",
            id: "302d300d06096086480165030402040500041c"
        },
        sha256WithRSAEncryption: {
            sign: "rsa",
            hash: "sha256",
            id: "3031300d060960864801650304020105000420"
        },
        "RSA-SHA256": {
            sign: "ecdsa/rsa",
            hash: "sha256",
            id: "3031300d060960864801650304020105000420"
        },
        sha384WithRSAEncryption: {
            sign: "rsa",
            hash: "sha384",
            id: "3041300d060960864801650304020205000430"
        },
        "RSA-SHA384": {
            sign: "ecdsa/rsa",
            hash: "sha384",
            id: "3041300d060960864801650304020205000430"
        },
        sha512WithRSAEncryption: {
            sign: "rsa",
            hash: "sha512",
            id: "3051300d060960864801650304020305000440"
        },
        "RSA-SHA512": {
            sign: "ecdsa/rsa",
            hash: "sha512",
            id: "3051300d060960864801650304020305000440"
        },
        "RSA-SHA1": {
            sign: "rsa",
            hash: "sha1",
            id: "3021300906052b0e03021a05000414"
        },
        "ecdsa-with-SHA1": {
            sign: "ecdsa",
            hash: "sha1",
            id: ""
        },
        sha256: {
            sign: "ecdsa",
            hash: "sha256",
            id: ""
        },
        sha224: {
            sign: "ecdsa",
            hash: "sha224",
            id: ""
        },
        sha384: {
            sign: "ecdsa",
            hash: "sha384",
            id: ""
        },
        sha512: {
            sign: "ecdsa",
            hash: "sha512",
            id: ""
        },
        "DSA-SHA": {
            sign: "dsa",
            hash: "sha1",
            id: ""
        },
        "DSA-SHA1": {
            sign: "dsa",
            hash: "sha1",
            id: ""
        },
        DSA: {
            sign: "dsa",
            hash: "sha1",
            id: ""
        },
        "DSA-WITH-SHA224": {
            sign: "dsa",
            hash: "sha224",
            id: ""
        },
        "DSA-SHA224": {
            sign: "dsa",
            hash: "sha224",
            id: ""
        },
        "DSA-WITH-SHA256": {
            sign: "dsa",
            hash: "sha256",
            id: ""
        },
        "DSA-SHA256": {
            sign: "dsa",
            hash: "sha256",
            id: ""
        },
        "DSA-WITH-SHA384": {
            sign: "dsa",
            hash: "sha384",
            id: ""
        },
        "DSA-SHA384": {
            sign: "dsa",
            hash: "sha384",
            id: ""
        },
        "DSA-WITH-SHA512": {
            sign: "dsa",
            hash: "sha512",
            id: ""
        },
        "DSA-SHA512": {
            sign: "dsa",
            hash: "sha512",
            id: ""
        },
        "DSA-RIPEMD160": {
            sign: "dsa",
            hash: "rmd160",
            id: ""
        },
        ripemd160WithRSA: {
            sign: "rsa",
            hash: "rmd160",
            id: "3021300906052b2403020105000414"
        },
        "RSA-RIPEMD160": {
            sign: "rsa",
            hash: "rmd160",
            id: "3021300906052b2403020105000414"
        },
        md5WithRSAEncryption: {
            sign: "rsa",
            hash: "md5",
            id: "3020300c06082a864886f70d020505000410"
        },
        "RSA-MD5": {
            sign: "rsa",
            hash: "md5",
            id: "3020300c06082a864886f70d020505000410"
        }
    };
});
var eu = q((Q9, Qc)=>{
    Qc.exports = Y0();
});
var J0 = q((ey, tu)=>{
    var K6 = Math.pow(2, 30) - 1;
    tu.exports = function(t, e) {
        if (typeof t != "number") throw new TypeError("Iterations not a number");
        if (t < 0) throw new TypeError("Bad iterations");
        if (typeof e != "number") throw new TypeError("Key length not a number");
        if (e < 0 || e > K6 || e !== e) throw new TypeError("Bad key length");
    };
});
var $0 = q((ty, iu)=>{
    var Qf;
    global.process && global.process.browser ? Qf = "utf-8" : global.process && global.process.version ? (ru = parseInt(process.version.split(".")[0].slice(1), 10), Qf = ru >= 6 ? "utf-8" : "binary") : Qf = "utf-8";
    var ru;
    iu.exports = Qf;
});
var eo = q((ry, nu)=>{
    var Q0 = we().Buffer;
    nu.exports = function(t, e, r) {
        if (Q0.isBuffer(t)) return t;
        if (typeof t == "string") return Q0.from(t, e);
        if (ArrayBuffer.isView(t)) return Q0.from(t.buffer);
        throw new TypeError(r + " must be a string, a Buffer, a typed array or a DataView");
    };
});
var to = q((iy, su)=>{
    var W6 = V0(), V6 = Vf(), G6 = Yf(), fi = we().Buffer, Z6 = J0(), fu = $0(), au = eo(), X6 = fi.alloc(128), ea = {
        md5: 16,
        sha1: 20,
        sha224: 28,
        sha256: 32,
        sha384: 48,
        sha512: 64,
        rmd160: 20,
        ripemd160: 20
    };
    function ou(t, e, r) {
        var i = Y6(t), n = t === "sha512" || t === "sha384" ? 128 : 64;
        e.length > n ? e = i(e) : e.length < n && (e = fi.concat([
            e,
            X6
        ], n));
        for(var f = fi.allocUnsafe(n + ea[t]), o = fi.allocUnsafe(n + ea[t]), u = 0; u < n; u++)f[u] = e[u] ^ 54, o[u] = e[u] ^ 92;
        var v = fi.allocUnsafe(n + r + 4);
        f.copy(v, 0, 0, n), this.ipad1 = v, this.ipad2 = f, this.opad = o, this.alg = t, this.blocksize = n, this.hash = i, this.size = ea[t];
    }
    ou.prototype.run = function(t, e) {
        t.copy(e, this.blocksize);
        var r = this.hash(e);
        return r.copy(this.opad, this.blocksize), this.hash(this.opad);
    };
    function Y6(t) {
        function e(i) {
            return G6(t).update(i).digest();
        }
        function r(i) {
            return new V6().update(i).digest();
        }
        return t === "rmd160" || t === "ripemd160" ? r : t === "md5" ? W6 : e;
    }
    function J6(t, e, r, i, n) {
        Z6(r, i), t = au(t, fu, "Password"), e = au(e, fu, "Salt"), n = n || "sha1";
        var f = new ou(n, t, e.length), o = fi.allocUnsafe(i), u = fi.allocUnsafe(e.length + 4);
        e.copy(u, 0, 0, e.length);
        for(var v = 0, _ = ea[n], x = Math.ceil(i / _), S = 1; S <= x; S++){
            u.writeUInt32BE(S, e.length);
            for(var A = f.run(u, f.ipad1), B = A, I = 1; I < r; I++){
                B = f.run(B, f.ipad2);
                for(var P = 0; P < _; P++)A[P] ^= B[P];
            }
            A.copy(o, v), v += _;
        }
        return o;
    }
    su.exports = J6;
});
var bu = q((ny, pu)=>{
    var du = we().Buffer, $6 = J0(), hu = $0(), cu = to(), uu = eo(), ta, Gn = global.crypto && global.crypto.subtle, Q6 = {
        sha: "SHA-1",
        "sha-1": "SHA-1",
        sha1: "SHA-1",
        sha256: "SHA-256",
        "sha-256": "SHA-256",
        sha384: "SHA-384",
        "sha-384": "SHA-384",
        "sha-512": "SHA-512",
        sha512: "SHA-512"
    }, ro = [];
    function e3(t) {
        if (global.process && !global.process.browser || !Gn || !Gn.importKey || !Gn.deriveBits) return Promise.resolve(!1);
        if (ro[t] !== void 0) return ro[t];
        ta = ta || du.alloc(8);
        var e = lu(ta, ta, 10, 128, t).then(function() {
            return !0;
        }).catch(function() {
            return !1;
        });
        return ro[t] = e, e;
    }
    var ai;
    function io() {
        return ai || (global.process && global.process.nextTick ? ai = global.process.nextTick : global.queueMicrotask ? ai = global.queueMicrotask : global.setImmediate ? ai = global.setImmediate : ai = global.setTimeout, ai);
    }
    function lu(t, e, r, i, n) {
        return Gn.importKey("raw", t, {
            name: "PBKDF2"
        }, !1, [
            "deriveBits"
        ]).then(function(f) {
            return Gn.deriveBits({
                name: "PBKDF2",
                salt: e,
                iterations: r,
                hash: {
                    name: n
                }
            }, f, i << 3);
        }).then(function(f) {
            return du.from(f);
        });
    }
    function t3(t, e) {
        t.then(function(r) {
            io()(function() {
                e(null, r);
            });
        }, function(r) {
            io()(function() {
                e(r);
            });
        });
    }
    pu.exports = function(t, e, r, i, n, f) {
        typeof n == "function" && (f = n, n = void 0), n = n || "sha1";
        var o = Q6[n.toLowerCase()];
        if (!o || typeof global.Promise != "function") {
            io()(function() {
                var u;
                try {
                    u = cu(t, e, r, i, n);
                } catch (v) {
                    return f(v);
                }
                f(null, u);
            });
            return;
        }
        if ($6(r, i), t = uu(t, hu, "Password"), e = uu(e, hu, "Salt"), typeof f != "function") throw new Error("No callback provided to pbkdf2");
        t3(e3(o).then(function(u) {
            return u ? lu(t, e, r, i, o) : cu(t, e, r, i, n);
        }), f);
    };
});
var fo = q((no)=>{
    no.pbkdf2 = bu();
    no.pbkdf2Sync = to();
});
var ao = q((mt)=>{
    "use strict";
    mt.readUInt32BE = function(e, r) {
        var i = e[0 + r] << 24 | e[1 + r] << 16 | e[2 + r] << 8 | e[3 + r];
        return i >>> 0;
    };
    mt.writeUInt32BE = function(e, r, i) {
        e[0 + i] = r >>> 24, e[1 + i] = r >>> 16 & 255, e[2 + i] = r >>> 8 & 255, e[3 + i] = r & 255;
    };
    mt.ip = function(e, r, i, n) {
        for(var f = 0, o = 0, u = 6; u >= 0; u -= 2){
            for(var v = 0; v <= 24; v += 8)f <<= 1, f |= r >>> v + u & 1;
            for(var v = 0; v <= 24; v += 8)f <<= 1, f |= e >>> v + u & 1;
        }
        for(var u = 6; u >= 0; u -= 2){
            for(var v = 1; v <= 25; v += 8)o <<= 1, o |= r >>> v + u & 1;
            for(var v = 1; v <= 25; v += 8)o <<= 1, o |= e >>> v + u & 1;
        }
        i[n + 0] = f >>> 0, i[n + 1] = o >>> 0;
    };
    mt.rip = function(e, r, i, n) {
        for(var f = 0, o = 0, u = 0; u < 4; u++)for(var v = 24; v >= 0; v -= 8)f <<= 1, f |= r >>> v + u & 1, f <<= 1, f |= e >>> v + u & 1;
        for(var u = 4; u < 8; u++)for(var v = 24; v >= 0; v -= 8)o <<= 1, o |= r >>> v + u & 1, o <<= 1, o |= e >>> v + u & 1;
        i[n + 0] = f >>> 0, i[n + 1] = o >>> 0;
    };
    mt.pc1 = function(e, r, i, n) {
        for(var f = 0, o = 0, u = 7; u >= 5; u--){
            for(var v = 0; v <= 24; v += 8)f <<= 1, f |= r >> v + u & 1;
            for(var v = 0; v <= 24; v += 8)f <<= 1, f |= e >> v + u & 1;
        }
        for(var v = 0; v <= 24; v += 8)f <<= 1, f |= r >> v + u & 1;
        for(var u = 1; u <= 3; u++){
            for(var v = 0; v <= 24; v += 8)o <<= 1, o |= r >> v + u & 1;
            for(var v = 0; v <= 24; v += 8)o <<= 1, o |= e >> v + u & 1;
        }
        for(var v = 0; v <= 24; v += 8)o <<= 1, o |= e >> v + u & 1;
        i[n + 0] = f >>> 0, i[n + 1] = o >>> 0;
    };
    mt.r28shl = function(e, r) {
        return e << r & 268435455 | e >>> 28 - r;
    };
    var ra = [
        14,
        11,
        17,
        4,
        27,
        23,
        25,
        0,
        13,
        22,
        7,
        18,
        5,
        9,
        16,
        24,
        2,
        20,
        12,
        21,
        1,
        8,
        15,
        26,
        15,
        4,
        25,
        19,
        9,
        1,
        26,
        16,
        5,
        11,
        23,
        8,
        12,
        7,
        17,
        0,
        22,
        3,
        10,
        14,
        6,
        20,
        27,
        24
    ];
    mt.pc2 = function(e, r, i, n) {
        for(var f = 0, o = 0, u = ra.length >>> 1, v = 0; v < u; v++)f <<= 1, f |= e >>> ra[v] & 1;
        for(var v = u; v < ra.length; v++)o <<= 1, o |= r >>> ra[v] & 1;
        i[n + 0] = f >>> 0, i[n + 1] = o >>> 0;
    };
    mt.expand = function(e, r, i) {
        var n = 0, f = 0;
        n = (e & 1) << 5 | e >>> 27;
        for(var o = 23; o >= 15; o -= 4)n <<= 6, n |= e >>> o & 63;
        for(var o = 11; o >= 3; o -= 4)f |= e >>> o & 63, f <<= 6;
        f |= (e & 31) << 1 | e >>> 31, r[i + 0] = n >>> 0, r[i + 1] = f >>> 0;
    };
    var vu = [
        14,
        0,
        4,
        15,
        13,
        7,
        1,
        4,
        2,
        14,
        15,
        2,
        11,
        13,
        8,
        1,
        3,
        10,
        10,
        6,
        6,
        12,
        12,
        11,
        5,
        9,
        9,
        5,
        0,
        3,
        7,
        8,
        4,
        15,
        1,
        12,
        14,
        8,
        8,
        2,
        13,
        4,
        6,
        9,
        2,
        1,
        11,
        7,
        15,
        5,
        12,
        11,
        9,
        3,
        7,
        14,
        3,
        10,
        10,
        0,
        5,
        6,
        0,
        13,
        15,
        3,
        1,
        13,
        8,
        4,
        14,
        7,
        6,
        15,
        11,
        2,
        3,
        8,
        4,
        14,
        9,
        12,
        7,
        0,
        2,
        1,
        13,
        10,
        12,
        6,
        0,
        9,
        5,
        11,
        10,
        5,
        0,
        13,
        14,
        8,
        7,
        10,
        11,
        1,
        10,
        3,
        4,
        15,
        13,
        4,
        1,
        2,
        5,
        11,
        8,
        6,
        12,
        7,
        6,
        12,
        9,
        0,
        3,
        5,
        2,
        14,
        15,
        9,
        10,
        13,
        0,
        7,
        9,
        0,
        14,
        9,
        6,
        3,
        3,
        4,
        15,
        6,
        5,
        10,
        1,
        2,
        13,
        8,
        12,
        5,
        7,
        14,
        11,
        12,
        4,
        11,
        2,
        15,
        8,
        1,
        13,
        1,
        6,
        10,
        4,
        13,
        9,
        0,
        8,
        6,
        15,
        9,
        3,
        8,
        0,
        7,
        11,
        4,
        1,
        15,
        2,
        14,
        12,
        3,
        5,
        11,
        10,
        5,
        14,
        2,
        7,
        12,
        7,
        13,
        13,
        8,
        14,
        11,
        3,
        5,
        0,
        6,
        6,
        15,
        9,
        0,
        10,
        3,
        1,
        4,
        2,
        7,
        8,
        2,
        5,
        12,
        11,
        1,
        12,
        10,
        4,
        14,
        15,
        9,
        10,
        3,
        6,
        15,
        9,
        0,
        0,
        6,
        12,
        10,
        11,
        1,
        7,
        13,
        13,
        8,
        15,
        9,
        1,
        4,
        3,
        5,
        14,
        11,
        5,
        12,
        2,
        7,
        8,
        2,
        4,
        14,
        2,
        14,
        12,
        11,
        4,
        2,
        1,
        12,
        7,
        4,
        10,
        7,
        11,
        13,
        6,
        1,
        8,
        5,
        5,
        0,
        3,
        15,
        15,
        10,
        13,
        3,
        0,
        9,
        14,
        8,
        9,
        6,
        4,
        11,
        2,
        8,
        1,
        12,
        11,
        7,
        10,
        1,
        13,
        14,
        7,
        2,
        8,
        13,
        15,
        6,
        9,
        15,
        12,
        0,
        5,
        9,
        6,
        10,
        3,
        4,
        0,
        5,
        14,
        3,
        12,
        10,
        1,
        15,
        10,
        4,
        15,
        2,
        9,
        7,
        2,
        12,
        6,
        9,
        8,
        5,
        0,
        6,
        13,
        1,
        3,
        13,
        4,
        14,
        14,
        0,
        7,
        11,
        5,
        3,
        11,
        8,
        9,
        4,
        14,
        3,
        15,
        2,
        5,
        12,
        2,
        9,
        8,
        5,
        12,
        15,
        3,
        10,
        7,
        11,
        0,
        14,
        4,
        1,
        10,
        7,
        1,
        6,
        13,
        0,
        11,
        8,
        6,
        13,
        4,
        13,
        11,
        0,
        2,
        11,
        14,
        7,
        15,
        4,
        0,
        9,
        8,
        1,
        13,
        10,
        3,
        14,
        12,
        3,
        9,
        5,
        7,
        12,
        5,
        2,
        10,
        15,
        6,
        8,
        1,
        6,
        1,
        6,
        4,
        11,
        11,
        13,
        13,
        8,
        12,
        1,
        3,
        4,
        7,
        10,
        14,
        7,
        10,
        9,
        15,
        5,
        6,
        0,
        8,
        15,
        0,
        14,
        5,
        2,
        9,
        3,
        2,
        12,
        13,
        1,
        2,
        15,
        8,
        13,
        4,
        8,
        6,
        10,
        15,
        3,
        11,
        7,
        1,
        4,
        10,
        12,
        9,
        5,
        3,
        6,
        14,
        11,
        5,
        0,
        0,
        14,
        12,
        9,
        7,
        2,
        7,
        2,
        11,
        1,
        4,
        14,
        1,
        7,
        9,
        4,
        12,
        10,
        14,
        8,
        2,
        13,
        0,
        15,
        6,
        12,
        10,
        9,
        13,
        0,
        15,
        3,
        3,
        5,
        5,
        6,
        8,
        11
    ];
    mt.substitute = function(e, r) {
        for(var i = 0, n = 0; n < 4; n++){
            var f = e >>> 18 - n * 6 & 63, o = vu[n * 64 + f];
            i <<= 4, i |= o;
        }
        for(var n = 0; n < 4; n++){
            var f = r >>> 18 - n * 6 & 63, o = vu[256 + n * 64 + f];
            i <<= 4, i |= o;
        }
        return i >>> 0;
    };
    var yu = [
        16,
        25,
        12,
        11,
        3,
        20,
        4,
        15,
        31,
        17,
        9,
        6,
        27,
        14,
        1,
        22,
        30,
        24,
        8,
        18,
        0,
        5,
        29,
        23,
        13,
        19,
        2,
        26,
        10,
        21,
        28,
        7
    ];
    mt.permute = function(e) {
        for(var r = 0, i = 0; i < yu.length; i++)r <<= 1, r |= e >>> yu[i] & 1;
        return r >>> 0;
    };
    mt.padSplit = function(e, r, i) {
        for(var n = e.toString(2); n.length < r;)n = "0" + n;
        for(var f = [], o = 0; o < r; o += i)f.push(n.slice(o, o + i));
        return f.join(" ");
    };
});
var ct = q((oy, gu)=>{
    gu.exports = mu;
    function mu(t, e) {
        if (!t) throw new Error(e || "Assertion failed");
    }
    mu.equal = function(e, r, i) {
        if (e != r) throw new Error(i || "Assertion failed: " + e + " != " + r);
    };
});
var ia = q((sy, _u)=>{
    "use strict";
    var r3 = ct();
    function gt(t) {
        this.options = t, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0;
    }
    _u.exports = gt;
    gt.prototype._init = function() {};
    gt.prototype.update = function(e) {
        return e.length === 0 ? [] : this.type === "decrypt" ? this._updateDecrypt(e) : this._updateEncrypt(e);
    };
    gt.prototype._buffer = function(e, r) {
        for(var i = Math.min(this.buffer.length - this.bufferOff, e.length - r), n = 0; n < i; n++)this.buffer[this.bufferOff + n] = e[r + n];
        return this.bufferOff += i, i;
    };
    gt.prototype._flushBuffer = function(e, r) {
        return this._update(this.buffer, 0, e, r), this.bufferOff = 0, this.blockSize;
    };
    gt.prototype._updateEncrypt = function(e) {
        var r = 0, i = 0, n = (this.bufferOff + e.length) / this.blockSize | 0, f = new Array(n * this.blockSize);
        this.bufferOff !== 0 && (r += this._buffer(e, r), this.bufferOff === this.buffer.length && (i += this._flushBuffer(f, i)));
        for(var o = e.length - (e.length - r) % this.blockSize; r < o; r += this.blockSize)this._update(e, r, f, i), i += this.blockSize;
        for(; r < e.length; r++, this.bufferOff++)this.buffer[this.bufferOff] = e[r];
        return f;
    };
    gt.prototype._updateDecrypt = function(e) {
        for(var r = 0, i = 0, n = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, f = new Array(n * this.blockSize); n > 0; n--)r += this._buffer(e, r), i += this._flushBuffer(f, i);
        return r += this._buffer(e, r), f;
    };
    gt.prototype.final = function(e) {
        var r;
        e && (r = this.update(e));
        var i;
        return this.type === "encrypt" ? i = this._finalEncrypt() : i = this._finalDecrypt(), r ? r.concat(i) : i;
    };
    gt.prototype._pad = function(e, r) {
        if (r === 0) return !1;
        for(; r < e.length;)e[r++] = 0;
        return !0;
    };
    gt.prototype._finalEncrypt = function() {
        if (!this._pad(this.buffer, this.bufferOff)) return [];
        var e = new Array(this.blockSize);
        return this._update(this.buffer, 0, e, 0), e;
    };
    gt.prototype._unpad = function(e) {
        return e;
    };
    gt.prototype._finalDecrypt = function() {
        r3.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
        var e = new Array(this.blockSize);
        return this._flushBuffer(e, 0), this._unpad(e);
    };
});
var oo = q((hy, Mu)=>{
    "use strict";
    var wu = ct(), i3 = xe(), He = ao(), xu = ia();
    function n3() {
        this.tmp = new Array(2), this.keys = null;
    }
    function Gt(t) {
        xu.call(this, t);
        var e = new n3;
        this._desState = e, this.deriveKeys(e, t.key);
    }
    i3(Gt, xu);
    Mu.exports = Gt;
    Gt.create = function(e) {
        return new Gt(e);
    };
    var f3 = [
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        1
    ];
    Gt.prototype.deriveKeys = function(e, r) {
        e.keys = new Array(32), wu.equal(r.length, this.blockSize, "Invalid key length");
        var i = He.readUInt32BE(r, 0), n = He.readUInt32BE(r, 4);
        He.pc1(i, n, e.tmp, 0), i = e.tmp[0], n = e.tmp[1];
        for(var f = 0; f < e.keys.length; f += 2){
            var o = f3[f >>> 1];
            i = He.r28shl(i, o), n = He.r28shl(n, o), He.pc2(i, n, e.keys, f);
        }
    };
    Gt.prototype._update = function(e, r, i, n) {
        var f = this._desState, o = He.readUInt32BE(e, r), u = He.readUInt32BE(e, r + 4);
        He.ip(o, u, f.tmp, 0), o = f.tmp[0], u = f.tmp[1], this.type === "encrypt" ? this._encrypt(f, o, u, f.tmp, 0) : this._decrypt(f, o, u, f.tmp, 0), o = f.tmp[0], u = f.tmp[1], He.writeUInt32BE(i, o, n), He.writeUInt32BE(i, u, n + 4);
    };
    Gt.prototype._pad = function(e, r) {
        for(var i = e.length - r, n = r; n < e.length; n++)e[n] = i;
        return !0;
    };
    Gt.prototype._unpad = function(e) {
        for(var r = e[e.length - 1], i = e.length - r; i < e.length; i++)wu.equal(e[i], r);
        return e.slice(0, e.length - r);
    };
    Gt.prototype._encrypt = function(e, r, i, n, f) {
        for(var o = r, u = i, v = 0; v < e.keys.length; v += 2){
            var _ = e.keys[v], x = e.keys[v + 1];
            He.expand(u, e.tmp, 0), _ ^= e.tmp[0], x ^= e.tmp[1];
            var S = He.substitute(_, x), A = He.permute(S), B = u;
            u = (o ^ A) >>> 0, o = B;
        }
        He.rip(u, o, n, f);
    };
    Gt.prototype._decrypt = function(e, r, i, n, f) {
        for(var o = i, u = r, v = e.keys.length - 2; v >= 0; v -= 2){
            var _ = e.keys[v], x = e.keys[v + 1];
            He.expand(o, e.tmp, 0), _ ^= e.tmp[0], x ^= e.tmp[1];
            var S = He.substitute(_, x), A = He.permute(S), B = o;
            o = (u ^ A) >>> 0, u = B;
        }
        He.rip(o, u, n, f);
    };
});
var Eu = q((Su)=>{
    "use strict";
    var a3 = ct(), o3 = xe(), na = {};
    function s3(t) {
        a3.equal(t.length, 8, "Invalid IV length"), this.iv = new Array(8);
        for(var e = 0; e < this.iv.length; e++)this.iv[e] = t[e];
    }
    function h3(t) {
        function e(f) {
            t.call(this, f), this._cbcInit();
        }
        o3(e, t);
        for(var r = Object.keys(na), i = 0; i < r.length; i++){
            var n = r[i];
            e.prototype[n] = na[n];
        }
        return e.create = function(o) {
            return new e(o);
        }, e;
    }
    Su.instantiate = h3;
    na._cbcInit = function() {
        var e = new s3(this.options.iv);
        this._cbcState = e;
    };
    na._update = function(e, r, i, n) {
        var f = this._cbcState, o = this.constructor.super_.prototype, u = f.iv;
        if (this.type === "encrypt") {
            for(var v = 0; v < this.blockSize; v++)u[v] ^= e[r + v];
            o._update.call(this, u, 0, i, n);
            for(var v = 0; v < this.blockSize; v++)u[v] = i[n + v];
        } else {
            o._update.call(this, e, r, i, n);
            for(var v = 0; v < this.blockSize; v++)i[n + v] ^= u[v];
            for(var v = 0; v < this.blockSize; v++)u[v] = e[r + v];
        }
    };
});
var qu = q((uy, Bu)=>{
    "use strict";
    var c3 = ct(), u3 = xe(), Au = ia(), Mr = oo();
    function d3(t, e) {
        c3.equal(e.length, 24, "Invalid key length");
        var r = e.slice(0, 8), i = e.slice(8, 16), n = e.slice(16, 24);
        t === "encrypt" ? this.ciphers = [
            Mr.create({
                type: "encrypt",
                key: r
            }),
            Mr.create({
                type: "decrypt",
                key: i
            }),
            Mr.create({
                type: "encrypt",
                key: n
            })
        ] : this.ciphers = [
            Mr.create({
                type: "decrypt",
                key: n
            }),
            Mr.create({
                type: "encrypt",
                key: i
            }),
            Mr.create({
                type: "decrypt",
                key: r
            })
        ];
    }
    function oi(t) {
        Au.call(this, t);
        var e = new d3(this.type, this.options.key);
        this._edeState = e;
    }
    u3(oi, Au);
    Bu.exports = oi;
    oi.create = function(e) {
        return new oi(e);
    };
    oi.prototype._update = function(e, r, i, n) {
        var f = this._edeState;
        f.ciphers[0]._update(e, r, i, n), f.ciphers[1]._update(i, n, i, n), f.ciphers[2]._update(i, n, i, n);
    };
    oi.prototype._pad = Mr.prototype._pad;
    oi.prototype._unpad = Mr.prototype._unpad;
});
var Ru = q((Li)=>{
    "use strict";
    Li.utils = ao();
    Li.Cipher = ia();
    Li.DES = oo();
    Li.CBC = Eu();
    Li.EDE = qu();
});
var Cu = q((ly, ku)=>{
    var Iu = fr(), ar = Ru(), l3 = xe(), si = we().Buffer, Zn = {
        "des-ede3-cbc": ar.CBC.instantiate(ar.EDE),
        "des-ede3": ar.EDE,
        "des-ede-cbc": ar.CBC.instantiate(ar.EDE),
        "des-ede": ar.EDE,
        "des-cbc": ar.CBC.instantiate(ar.DES),
        "des-ecb": ar.DES
    };
    Zn.des = Zn["des-cbc"];
    Zn.des3 = Zn["des-ede3-cbc"];
    ku.exports = fa;
    l3(fa, Iu);
    function fa(t) {
        Iu.call(this);
        var e = t.mode.toLowerCase(), r = Zn[e], i;
        t.decrypt ? i = "decrypt" : i = "encrypt";
        var n = t.key;
        si.isBuffer(n) || (n = si.from(n)), (e === "des-ede" || e === "des-ede-cbc") && (n = si.concat([
            n,
            n.slice(0, 8)
        ]));
        var f = t.iv;
        si.isBuffer(f) || (f = si.from(f)), this._des = r.create({
            key: n,
            iv: f,
            type: i
        });
    }
    fa.prototype._update = function(t) {
        return si.from(this._des.update(t));
    };
    fa.prototype._final = function() {
        return si.from(this._des.final());
    };
});
var Tu = q((so)=>{
    so.encrypt = function(t, e) {
        return t._cipher.encryptBlock(e);
    };
    so.decrypt = function(t, e) {
        return t._cipher.decryptBlock(e);
    };
});
var Ni = q((by, Pu)=>{
    Pu.exports = function(e, r) {
        for(var i = Math.min(e.length, r.length), n = new Buffer(i), f = 0; f < i; ++f)n[f] = e[f] ^ r[f];
        return n;
    };
});
var Lu = q((ho)=>{
    var Du = Ni();
    ho.encrypt = function(t, e) {
        var r = Du(e, t._prev);
        return t._prev = t._cipher.encryptBlock(r), t._prev;
    };
    ho.decrypt = function(t, e) {
        var r = t._prev;
        t._prev = e;
        var i = t._cipher.decryptBlock(e);
        return Du(i, r);
    };
});
var Fu = q((Ou)=>{
    var Xn = we().Buffer, p3 = Ni();
    function Nu(t, e, r) {
        var i = e.length, n = p3(e, t._cache);
        return t._cache = t._cache.slice(i), t._prev = Xn.concat([
            t._prev,
            r ? e : n
        ]), n;
    }
    Ou.encrypt = function(t, e, r) {
        for(var i = Xn.allocUnsafe(0), n; e.length;)if (t._cache.length === 0 && (t._cache = t._cipher.encryptBlock(t._prev), t._prev = Xn.allocUnsafe(0)), t._cache.length <= e.length) n = t._cache.length, i = Xn.concat([
            i,
            Nu(t, e.slice(0, n), r)
        ]), e = e.slice(n);
        else {
            i = Xn.concat([
                i,
                Nu(t, e, r)
            ]);
            break;
        }
        return i;
    };
});
var zu = q((Uu)=>{
    var co = we().Buffer;
    function b3(t, e, r) {
        var i = t._cipher.encryptBlock(t._prev), n = i[0] ^ e;
        return t._prev = co.concat([
            t._prev.slice(1),
            co.from([
                r ? e : n
            ])
        ]), n;
    }
    Uu.encrypt = function(t, e, r) {
        for(var i = e.length, n = co.allocUnsafe(i), f = -1; ++f < i;)n[f] = b3(t, e[f], r);
        return n;
    };
});
var ju = q((Hu)=>{
    var aa = we().Buffer;
    function v3(t, e, r) {
        for(var i, n = -1, f = 8, o = 0, u, v; ++n < f;)i = t._cipher.encryptBlock(t._prev), u = e & 1 << 7 - n ? 128 : 0, v = i[0] ^ u, o += (v & 128) >> n % 8, t._prev = y3(t._prev, r ? u : v);
        return o;
    }
    function y3(t, e) {
        var r = t.length, i = -1, n = aa.allocUnsafe(t.length);
        for(t = aa.concat([
            t,
            aa.from([
                e
            ])
        ]); ++i < r;)n[i] = t[i] << 1 | t[i + 1] >> 7;
        return n;
    }
    Hu.encrypt = function(t, e, r) {
        for(var i = e.length, n = aa.allocUnsafe(i), f = -1; ++f < i;)n[f] = v3(t, e[f], r);
        return n;
    };
});
var Wu = q((Ku)=>{
    var m3 = Ni();
    function g3(t) {
        return t._prev = t._cipher.encryptBlock(t._prev), t._prev;
    }
    Ku.encrypt = function(t, e) {
        for(; t._cache.length < e.length;)t._cache = Buffer.concat([
            t._cache,
            g3(t)
        ]);
        var r = t._cache.slice(0, e.length);
        return t._cache = t._cache.slice(e.length), m3(e, r);
    };
});
var uo = q((wy, Vu)=>{
    function _3(t) {
        for(var e = t.length, r; e--;)if (r = t.readUInt8(e), r === 255) t.writeUInt8(0, e);
        else {
            r++, t.writeUInt8(r, e);
            break;
        }
    }
    Vu.exports = _3;
});
var po = q((Zu)=>{
    var w3 = Ni(), Gu = we().Buffer, x3 = uo();
    function M3(t) {
        var e = t._cipher.encryptBlockRaw(t._prev);
        return x3(t._prev), e;
    }
    var lo = 16;
    Zu.encrypt = function(t, e) {
        var r = Math.ceil(e.length / lo), i = t._cache.length;
        t._cache = Gu.concat([
            t._cache,
            Gu.allocUnsafe(r * lo)
        ]);
        for(var n = 0; n < r; n++){
            var f = M3(t), o = i + n * lo;
            t._cache.writeUInt32BE(f[0], o + 0), t._cache.writeUInt32BE(f[1], o + 4), t._cache.writeUInt32BE(f[2], o + 8), t._cache.writeUInt32BE(f[3], o + 12);
        }
        var u = t._cache.slice(0, e.length);
        return t._cache = t._cache.slice(e.length), w3(e, u);
    };
});
var bo = q((My, S3)=>{
    S3.exports = {
        "aes-128-ecb": {
            cipher: "AES",
            key: 128,
            iv: 0,
            mode: "ECB",
            type: "block"
        },
        "aes-192-ecb": {
            cipher: "AES",
            key: 192,
            iv: 0,
            mode: "ECB",
            type: "block"
        },
        "aes-256-ecb": {
            cipher: "AES",
            key: 256,
            iv: 0,
            mode: "ECB",
            type: "block"
        },
        "aes-128-cbc": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        "aes-192-cbc": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        "aes-256-cbc": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        aes128: {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        aes192: {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        aes256: {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CBC",
            type: "block"
        },
        "aes-128-cfb": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB",
            type: "stream"
        },
        "aes-192-cfb": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB",
            type: "stream"
        },
        "aes-256-cfb": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB",
            type: "stream"
        },
        "aes-128-cfb8": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        },
        "aes-192-cfb8": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        },
        "aes-256-cfb8": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB8",
            type: "stream"
        },
        "aes-128-cfb1": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        },
        "aes-192-cfb1": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        },
        "aes-256-cfb1": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB1",
            type: "stream"
        },
        "aes-128-ofb": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "OFB",
            type: "stream"
        },
        "aes-192-ofb": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "OFB",
            type: "stream"
        },
        "aes-256-ofb": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "OFB",
            type: "stream"
        },
        "aes-128-ctr": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CTR",
            type: "stream"
        },
        "aes-192-ctr": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CTR",
            type: "stream"
        },
        "aes-256-ctr": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CTR",
            type: "stream"
        },
        "aes-128-gcm": {
            cipher: "AES",
            key: 128,
            iv: 12,
            mode: "GCM",
            type: "auth"
        },
        "aes-192-gcm": {
            cipher: "AES",
            key: 192,
            iv: 12,
            mode: "GCM",
            type: "auth"
        },
        "aes-256-gcm": {
            cipher: "AES",
            key: 256,
            iv: 12,
            mode: "GCM",
            type: "auth"
        }
    };
});
var sa = q((Sy, Xu)=>{
    var E3 = {
        ECB: Tu(),
        CBC: Lu(),
        CFB: Fu(),
        CFB8: zu(),
        CFB1: ju(),
        OFB: Wu(),
        CTR: po(),
        GCM: po()
    }, oa = bo();
    for(vo in oa)oa[vo].module = E3[oa[vo].mode];
    var vo;
    Xu.exports = oa;
});
var Yn = q((Ey, Ju)=>{
    var ha = we().Buffer;
    function mo(t) {
        ha.isBuffer(t) || (t = ha.from(t));
        for(var e = t.length / 4 | 0, r = new Array(e), i = 0; i < e; i++)r[i] = t.readUInt32BE(i * 4);
        return r;
    }
    function yo(t) {
        for(var e = 0; e < t.length; t++)t[e] = 0;
    }
    function Yu(t, e, r, i, n) {
        for(var f = r[0], o = r[1], u = r[2], v = r[3], _ = t[0] ^ e[0], x = t[1] ^ e[1], S = t[2] ^ e[2], A = t[3] ^ e[3], B, I, P, F, D = 4, z = 1; z < n; z++)B = f[_ >>> 24] ^ o[x >>> 16 & 255] ^ u[S >>> 8 & 255] ^ v[A & 255] ^ e[D++], I = f[x >>> 24] ^ o[S >>> 16 & 255] ^ u[A >>> 8 & 255] ^ v[_ & 255] ^ e[D++], P = f[S >>> 24] ^ o[A >>> 16 & 255] ^ u[_ >>> 8 & 255] ^ v[x & 255] ^ e[D++], F = f[A >>> 24] ^ o[_ >>> 16 & 255] ^ u[x >>> 8 & 255] ^ v[S & 255] ^ e[D++], _ = B, x = I, S = P, A = F;
        return B = (i[_ >>> 24] << 24 | i[x >>> 16 & 255] << 16 | i[S >>> 8 & 255] << 8 | i[A & 255]) ^ e[D++], I = (i[x >>> 24] << 24 | i[S >>> 16 & 255] << 16 | i[A >>> 8 & 255] << 8 | i[_ & 255]) ^ e[D++], P = (i[S >>> 24] << 24 | i[A >>> 16 & 255] << 16 | i[_ >>> 8 & 255] << 8 | i[x & 255]) ^ e[D++], F = (i[A >>> 24] << 24 | i[_ >>> 16 & 255] << 16 | i[x >>> 8 & 255] << 8 | i[S & 255]) ^ e[D++], B = B >>> 0, I = I >>> 0, P = P >>> 0, F = F >>> 0, [
            B,
            I,
            P,
            F
        ];
    }
    var A3 = [
        0,
        1,
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        27,
        54
    ], ze = function() {
        for(var t = new Array(256), e = 0; e < 256; e++)e < 128 ? t[e] = e << 1 : t[e] = e << 1 ^ 283;
        for(var r = [], i = [], n = [
            [],
            [],
            [],
            []
        ], f = [
            [],
            [],
            [],
            []
        ], o = 0, u = 0, v = 0; v < 256; ++v){
            var _ = u ^ u << 1 ^ u << 2 ^ u << 3 ^ u << 4;
            _ = _ >>> 8 ^ _ & 255 ^ 99, r[o] = _, i[_] = o;
            var x = t[o], S = t[x], A = t[S], B = t[_] * 257 ^ _ * 16843008;
            n[0][o] = B << 24 | B >>> 8, n[1][o] = B << 16 | B >>> 16, n[2][o] = B << 8 | B >>> 24, n[3][o] = B, B = A * 16843009 ^ S * 65537 ^ x * 257 ^ o * 16843008, f[0][_] = B << 24 | B >>> 8, f[1][_] = B << 16 | B >>> 16, f[2][_] = B << 8 | B >>> 24, f[3][_] = B, o === 0 ? o = u = 1 : (o = x ^ t[t[t[A ^ x]]], u ^= t[t[u]]);
        }
        return {
            SBOX: r,
            INV_SBOX: i,
            SUB_MIX: n,
            INV_SUB_MIX: f
        };
    }();
    function _t(t) {
        this._key = mo(t), this._reset();
    }
    _t.blockSize = 16;
    _t.keySize = 32;
    _t.prototype.blockSize = _t.blockSize;
    _t.prototype.keySize = _t.keySize;
    _t.prototype._reset = function() {
        for(var t = this._key, e = t.length, r = e + 6, i = (r + 1) * 4, n = [], f = 0; f < e; f++)n[f] = t[f];
        for(f = e; f < i; f++){
            var o = n[f - 1];
            f % e === 0 ? (o = o << 8 | o >>> 24, o = ze.SBOX[o >>> 24] << 24 | ze.SBOX[o >>> 16 & 255] << 16 | ze.SBOX[o >>> 8 & 255] << 8 | ze.SBOX[o & 255], o ^= A3[f / e | 0] << 24) : e > 6 && f % e === 4 && (o = ze.SBOX[o >>> 24] << 24 | ze.SBOX[o >>> 16 & 255] << 16 | ze.SBOX[o >>> 8 & 255] << 8 | ze.SBOX[o & 255]), n[f] = n[f - e] ^ o;
        }
        for(var u = [], v = 0; v < i; v++){
            var _ = i - v, x = n[_ - (v % 4 ? 0 : 4)];
            v < 4 || _ <= 4 ? u[v] = x : u[v] = ze.INV_SUB_MIX[0][ze.SBOX[x >>> 24]] ^ ze.INV_SUB_MIX[1][ze.SBOX[x >>> 16 & 255]] ^ ze.INV_SUB_MIX[2][ze.SBOX[x >>> 8 & 255]] ^ ze.INV_SUB_MIX[3][ze.SBOX[x & 255]];
        }
        this._nRounds = r, this._keySchedule = n, this._invKeySchedule = u;
    };
    _t.prototype.encryptBlockRaw = function(t) {
        return t = mo(t), Yu(t, this._keySchedule, ze.SUB_MIX, ze.SBOX, this._nRounds);
    };
    _t.prototype.encryptBlock = function(t) {
        var e = this.encryptBlockRaw(t), r = ha.allocUnsafe(16);
        return r.writeUInt32BE(e[0], 0), r.writeUInt32BE(e[1], 4), r.writeUInt32BE(e[2], 8), r.writeUInt32BE(e[3], 12), r;
    };
    _t.prototype.decryptBlock = function(t) {
        t = mo(t);
        var e = t[1];
        t[1] = t[3], t[3] = e;
        var r = Yu(t, this._invKeySchedule, ze.INV_SUB_MIX, ze.INV_SBOX, this._nRounds), i = ha.allocUnsafe(16);
        return i.writeUInt32BE(r[0], 0), i.writeUInt32BE(r[3], 4), i.writeUInt32BE(r[2], 8), i.writeUInt32BE(r[1], 12), i;
    };
    _t.prototype.scrub = function() {
        yo(this._keySchedule), yo(this._invKeySchedule), yo(this._key);
    };
    Ju.exports.AES = _t;
});
var ed = q((Ay, Qu)=>{
    var Oi = we().Buffer, B3 = Oi.alloc(16, 0);
    function q3(t) {
        return [
            t.readUInt32BE(0),
            t.readUInt32BE(4),
            t.readUInt32BE(8),
            t.readUInt32BE(12)
        ];
    }
    function $u(t) {
        var e = Oi.allocUnsafe(16);
        return e.writeUInt32BE(t[0] >>> 0, 0), e.writeUInt32BE(t[1] >>> 0, 4), e.writeUInt32BE(t[2] >>> 0, 8), e.writeUInt32BE(t[3] >>> 0, 12), e;
    }
    function Jn(t) {
        this.h = t, this.state = Oi.alloc(16, 0), this.cache = Oi.allocUnsafe(0);
    }
    Jn.prototype.ghash = function(t) {
        for(var e = -1; ++e < t.length;)this.state[e] ^= t[e];
        this._multiply();
    };
    Jn.prototype._multiply = function() {
        for(var t = q3(this.h), e = [
            0,
            0,
            0,
            0
        ], r, i, n, f = -1; ++f < 128;){
            for(i = (this.state[~~(f / 8)] & 1 << 7 - f % 8) !== 0, i && (e[0] ^= t[0], e[1] ^= t[1], e[2] ^= t[2], e[3] ^= t[3]), n = (t[3] & 1) !== 0, r = 3; r > 0; r--)t[r] = t[r] >>> 1 | (t[r - 1] & 1) << 31;
            t[0] = t[0] >>> 1, n && (t[0] = t[0] ^ -520093696);
        }
        this.state = $u(e);
    };
    Jn.prototype.update = function(t) {
        this.cache = Oi.concat([
            this.cache,
            t
        ]);
        for(var e; this.cache.length >= 16;)e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(e);
    };
    Jn.prototype.final = function(t, e) {
        return this.cache.length && this.ghash(Oi.concat([
            this.cache,
            B3
        ], 16)), this.ghash($u([
            0,
            t,
            0,
            e
        ])), this.state;
    };
    Qu.exports = Jn;
});
var go = q((By, id)=>{
    var R3 = Yn(), at = we().Buffer, td = fr(), I3 = xe(), rd = ed(), k3 = Ni(), C3 = uo();
    function T3(t, e) {
        var r = 0;
        t.length !== e.length && r++;
        for(var i = Math.min(t.length, e.length), n = 0; n < i; ++n)r += t[n] ^ e[n];
        return r;
    }
    function P3(t, e, r) {
        if (e.length === 12) return t._finID = at.concat([
            e,
            at.from([
                0,
                0,
                0,
                1
            ])
        ]), at.concat([
            e,
            at.from([
                0,
                0,
                0,
                2
            ])
        ]);
        var i = new rd(r), n = e.length, f = n % 16;
        i.update(e), f && (f = 16 - f, i.update(at.alloc(f, 0))), i.update(at.alloc(8, 0));
        var o = n * 8, u = at.alloc(8);
        u.writeUIntBE(o, 0, 8), i.update(u), t._finID = i.state;
        var v = at.from(t._finID);
        return C3(v), v;
    }
    function hi(t, e, r, i) {
        td.call(this);
        var n = at.alloc(4, 0);
        this._cipher = new R3.AES(e);
        var f = this._cipher.encryptBlock(n);
        this._ghash = new rd(f), r = P3(this, r, f), this._prev = at.from(r), this._cache = at.allocUnsafe(0), this._secCache = at.allocUnsafe(0), this._decrypt = i, this._alen = 0, this._len = 0, this._mode = t, this._authTag = null, this._called = !1;
    }
    I3(hi, td);
    hi.prototype._update = function(t) {
        if (!this._called && this._alen) {
            var e = 16 - this._alen % 16;
            e < 16 && (e = at.alloc(e, 0), this._ghash.update(e));
        }
        this._called = !0;
        var r = this._mode.encrypt(this, t);
        return this._decrypt ? this._ghash.update(t) : this._ghash.update(r), this._len += t.length, r;
    };
    hi.prototype._final = function() {
        if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
        var t = k3(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID));
        if (this._decrypt && T3(t, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
        this._authTag = t, this._cipher.scrub();
    };
    hi.prototype.getAuthTag = function() {
        if (this._decrypt || !at.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
        return this._authTag;
    };
    hi.prototype.setAuthTag = function(e) {
        if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
        this._authTag = e;
    };
    hi.prototype.setAAD = function(e) {
        if (this._called) throw new Error("Attempting to set AAD in unsupported state");
        this._ghash.update(e), this._alen += e.length;
    };
    id.exports = hi;
});
var wo = q((qy, fd)=>{
    var D3 = Yn(), _o = we().Buffer, nd = fr(), L3 = xe();
    function ca(t, e, r, i) {
        nd.call(this), this._cipher = new D3.AES(e), this._prev = _o.from(r), this._cache = _o.allocUnsafe(0), this._secCache = _o.allocUnsafe(0), this._decrypt = i, this._mode = t;
    }
    L3(ca, nd);
    ca.prototype._update = function(t) {
        return this._mode.encrypt(this, t, this._decrypt);
    };
    ca.prototype._final = function() {
        this._cipher.scrub();
    };
    fd.exports = ca;
});
var $n = q((Ry, ad)=>{
    var ci = we().Buffer, N3 = Kf();
    function O3(t, e, r, i) {
        if (ci.isBuffer(t) || (t = ci.from(t, "binary")), e && (ci.isBuffer(e) || (e = ci.from(e, "binary")), e.length !== 8)) throw new RangeError("salt should be Buffer with 8 byte length");
        for(var n = r / 8, f = ci.alloc(n), o = ci.alloc(i || 0), u = ci.alloc(0); n > 0 || i > 0;){
            var v = new N3;
            v.update(u), v.update(t), e && v.update(e), u = v.digest();
            var _ = 0;
            if (n > 0) {
                var x = f.length - n;
                _ = Math.min(n, u.length), u.copy(f, x, 0, _), n -= _;
            }
            if (_ < u.length && i > 0) {
                var S = o.length - i, A = Math.min(i, u.length - _);
                u.copy(o, S, _, _ + A), i -= A;
            }
        }
        return u.fill(0), {
            key: f,
            iv: o
        };
    }
    ad.exports = O3;
});
var cd = q((xo)=>{
    var od = sa(), F3 = go(), or = we().Buffer, U3 = wo(), sd = fr(), z3 = Yn(), H3 = $n(), j3 = xe();
    function Qn(t, e, r) {
        sd.call(this), this._cache = new ua, this._cipher = new z3.AES(e), this._prev = or.from(r), this._mode = t, this._autopadding = !0;
    }
    j3(Qn, sd);
    Qn.prototype._update = function(t) {
        this._cache.add(t);
        for(var e, r, i = []; e = this._cache.get();)r = this._mode.encrypt(this, e), i.push(r);
        return or.concat(i);
    };
    var K3 = or.alloc(16, 16);
    Qn.prototype._final = function() {
        var t = this._cache.flush();
        if (this._autopadding) return t = this._mode.encrypt(this, t), this._cipher.scrub(), t;
        if (!t.equals(K3)) throw this._cipher.scrub(), new Error("data not multiple of block length");
    };
    Qn.prototype.setAutoPadding = function(t) {
        return this._autopadding = !!t, this;
    };
    function ua() {
        this.cache = or.allocUnsafe(0);
    }
    ua.prototype.add = function(t) {
        this.cache = or.concat([
            this.cache,
            t
        ]);
    };
    ua.prototype.get = function() {
        if (this.cache.length > 15) {
            var t = this.cache.slice(0, 16);
            return this.cache = this.cache.slice(16), t;
        }
        return null;
    };
    ua.prototype.flush = function() {
        for(var t = 16 - this.cache.length, e = or.allocUnsafe(t), r = -1; ++r < t;)e.writeUInt8(t, r);
        return or.concat([
            this.cache,
            e
        ]);
    };
    function hd(t, e, r) {
        var i = od[t.toLowerCase()];
        if (!i) throw new TypeError("invalid suite type");
        if (typeof e == "string" && (e = or.from(e)), e.length !== i.key / 8) throw new TypeError("invalid key length " + e.length);
        if (typeof r == "string" && (r = or.from(r)), i.mode !== "GCM" && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
        return i.type === "stream" ? new U3(i.module, e, r) : i.type === "auth" ? new F3(i.module, e, r) : new Qn(i.module, e, r);
    }
    function W3(t, e) {
        var r = od[t.toLowerCase()];
        if (!r) throw new TypeError("invalid suite type");
        var i = H3(e, !1, r.key, r.iv);
        return hd(t, i.key, i.iv);
    }
    xo.createCipheriv = hd;
    xo.createCipher = W3;
});
var pd = q((Mo)=>{
    var V3 = go(), Fi = we().Buffer, ud = sa(), G3 = wo(), dd = fr(), Z3 = Yn(), X3 = $n(), Y3 = xe();
    function ef(t, e, r) {
        dd.call(this), this._cache = new da, this._last = void 0, this._cipher = new Z3.AES(e), this._prev = Fi.from(r), this._mode = t, this._autopadding = !0;
    }
    Y3(ef, dd);
    ef.prototype._update = function(t) {
        this._cache.add(t);
        for(var e, r, i = []; e = this._cache.get(this._autopadding);)r = this._mode.decrypt(this, e), i.push(r);
        return Fi.concat(i);
    };
    ef.prototype._final = function() {
        var t = this._cache.flush();
        if (this._autopadding) return J3(this._mode.decrypt(this, t));
        if (t) throw new Error("data not multiple of block length");
    };
    ef.prototype.setAutoPadding = function(t) {
        return this._autopadding = !!t, this;
    };
    function da() {
        this.cache = Fi.allocUnsafe(0);
    }
    da.prototype.add = function(t) {
        this.cache = Fi.concat([
            this.cache,
            t
        ]);
    };
    da.prototype.get = function(t) {
        var e;
        if (t) {
            if (this.cache.length > 16) return e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), e;
        } else if (this.cache.length >= 16) return e = this.cache.slice(0, 16), this.cache = this.cache.slice(16), e;
        return null;
    };
    da.prototype.flush = function() {
        if (this.cache.length) return this.cache;
    };
    function J3(t) {
        var e = t[15];
        if (e < 1 || e > 16) throw new Error("unable to decrypt data");
        for(var r = -1; ++r < e;)if (t[r + (16 - e)] !== e) throw new Error("unable to decrypt data");
        if (e !== 16) return t.slice(0, 16 - e);
    }
    function ld(t, e, r) {
        var i = ud[t.toLowerCase()];
        if (!i) throw new TypeError("invalid suite type");
        if (typeof r == "string" && (r = Fi.from(r)), i.mode !== "GCM" && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
        if (typeof e == "string" && (e = Fi.from(e)), e.length !== i.key / 8) throw new TypeError("invalid key length " + e.length);
        return i.type === "stream" ? new G3(i.module, e, r, !0) : i.type === "auth" ? new V3(i.module, e, r, !0) : new ef(i.module, e, r);
    }
    function $3(t, e) {
        var r = ud[t.toLowerCase()];
        if (!r) throw new TypeError("invalid suite type");
        var i = X3(e, !1, r.key, r.iv);
        return ld(t, i.key, i.iv);
    }
    Mo.createDecipher = $3;
    Mo.createDecipheriv = ld;
});
var la = q((Ct)=>{
    var bd = cd(), vd = pd(), Q3 = bo();
    function e4() {
        return Object.keys(Q3);
    }
    Ct.createCipher = Ct.Cipher = bd.createCipher;
    Ct.createCipheriv = Ct.Cipheriv = bd.createCipheriv;
    Ct.createDecipher = Ct.Decipher = vd.createDecipher;
    Ct.createDecipheriv = Ct.Decipheriv = vd.createDecipheriv;
    Ct.listCiphers = Ct.getCiphers = e4;
});
var yd = q((sr)=>{
    sr["des-ecb"] = {
        key: 8,
        iv: 0
    };
    sr["des-cbc"] = sr.des = {
        key: 8,
        iv: 8
    };
    sr["des-ede3-cbc"] = sr.des3 = {
        key: 24,
        iv: 8
    };
    sr["des-ede3"] = {
        key: 24,
        iv: 0
    };
    sr["des-ede-cbc"] = {
        key: 16,
        iv: 8
    };
    sr["des-ede"] = {
        key: 16,
        iv: 0
    };
});
var xd = q((Tt)=>{
    var md = Cu(), So = la(), Sr = sa(), hr = yd(), gd = $n();
    function t4(t, e) {
        t = t.toLowerCase();
        var r, i;
        if (Sr[t]) r = Sr[t].key, i = Sr[t].iv;
        else if (hr[t]) r = hr[t].key * 8, i = hr[t].iv;
        else throw new TypeError("invalid suite type");
        var n = gd(e, !1, r, i);
        return _d(t, n.key, n.iv);
    }
    function r4(t, e) {
        t = t.toLowerCase();
        var r, i;
        if (Sr[t]) r = Sr[t].key, i = Sr[t].iv;
        else if (hr[t]) r = hr[t].key * 8, i = hr[t].iv;
        else throw new TypeError("invalid suite type");
        var n = gd(e, !1, r, i);
        return wd(t, n.key, n.iv);
    }
    function _d(t, e, r) {
        if (t = t.toLowerCase(), Sr[t]) return So.createCipheriv(t, e, r);
        if (hr[t]) return new md({
            key: e,
            iv: r,
            mode: t
        });
        throw new TypeError("invalid suite type");
    }
    function wd(t, e, r) {
        if (t = t.toLowerCase(), Sr[t]) return So.createDecipheriv(t, e, r);
        if (hr[t]) return new md({
            key: e,
            iv: r,
            mode: t,
            decrypt: !0
        });
        throw new TypeError("invalid suite type");
    }
    function i4() {
        return Object.keys(hr).concat(So.getCiphers());
    }
    Tt.createCipher = Tt.Cipher = t4;
    Tt.createCipheriv = Tt.Cipheriv = _d;
    Tt.createDecipher = Tt.Decipher = r4;
    Tt.createDecipheriv = Tt.Decipheriv = wd;
    Tt.listCiphers = Tt.getCiphers = i4;
});
var Eo = q(()=>{});
var je = q((Md, Ao)=>{
    (function(t, e) {
        "use strict";
        function r(E, c) {
            if (!E) throw new Error(c || "Assertion failed");
        }
        function i(E, c) {
            E.super_ = c;
            var m = function() {};
            m.prototype = c.prototype, E.prototype = new m, E.prototype.constructor = E;
        }
        function n(E, c, m) {
            if (n.isBN(E)) return E;
            this.negative = 0, this.words = null, this.length = 0, this.red = null, E !== null && ((c === "le" || c === "be") && (m = c, c = 10), this._init(E || 0, c || 10, m || "be"));
        }
        typeof t == "object" ? t.exports = n : e.BN = n, n.BN = n, n.wordSize = 26;
        var f;
        try {
            typeof window < "u" && typeof window.Buffer < "u" ? f = window.Buffer : f = Eo().Buffer;
        } catch (E) {}
        n.isBN = function(c) {
            return c instanceof n ? !0 : c !== null && typeof c == "object" && c.constructor.wordSize === n.wordSize && Array.isArray(c.words);
        }, n.max = function(c, m) {
            return c.cmp(m) > 0 ? c : m;
        }, n.min = function(c, m) {
            return c.cmp(m) < 0 ? c : m;
        }, n.prototype._init = function(c, m, l) {
            if (typeof c == "number") return this._initNumber(c, m, l);
            if (typeof c == "object") return this._initArray(c, m, l);
            m === "hex" && (m = 16), r(m === (m | 0) && m >= 2 && m <= 36), c = c.toString().replace(/\s+/g, "");
            var a = 0;
            c[0] === "-" && (a++, this.negative = 1), a < c.length && (m === 16 ? this._parseHex(c, a, l) : (this._parseBase(c, m, a), l === "le" && this._initArray(this.toArray(), m, l)));
        }, n.prototype._initNumber = function(c, m, l) {
            c < 0 && (this.negative = 1, c = -c), c < 67108864 ? (this.words = [
                c & 67108863
            ], this.length = 1) : c < 4503599627370496 ? (this.words = [
                c & 67108863,
                c / 67108864 & 67108863
            ], this.length = 2) : (r(c < 9007199254740992), this.words = [
                c & 67108863,
                c / 67108864 & 67108863,
                1
            ], this.length = 3), l === "le" && this._initArray(this.toArray(), m, l);
        }, n.prototype._initArray = function(c, m, l) {
            if (r(typeof c.length == "number"), c.length <= 0) return this.words = [
                0
            ], this.length = 1, this;
            this.length = Math.ceil(c.length / 3), this.words = new Array(this.length);
            for(var a = 0; a < this.length; a++)this.words[a] = 0;
            var h, p, y = 0;
            if (l === "be") for(a = c.length - 1, h = 0; a >= 0; a -= 3)p = c[a] | c[a - 1] << 8 | c[a - 2] << 16, this.words[h] |= p << y & 67108863, this.words[h + 1] = p >>> 26 - y & 67108863, y += 24, y >= 26 && (y -= 26, h++);
            else if (l === "le") for(a = 0, h = 0; a < c.length; a += 3)p = c[a] | c[a + 1] << 8 | c[a + 2] << 16, this.words[h] |= p << y & 67108863, this.words[h + 1] = p >>> 26 - y & 67108863, y += 24, y >= 26 && (y -= 26, h++);
            return this.strip();
        };
        function o(E, c) {
            var m = E.charCodeAt(c);
            return m >= 65 && m <= 70 ? m - 55 : m >= 97 && m <= 102 ? m - 87 : m - 48 & 15;
        }
        function u(E, c, m) {
            var l = o(E, m);
            return m - 1 >= c && (l |= o(E, m - 1) << 4), l;
        }
        n.prototype._parseHex = function(c, m, l) {
            this.length = Math.ceil((c.length - m) / 6), this.words = new Array(this.length);
            for(var a = 0; a < this.length; a++)this.words[a] = 0;
            var h = 0, p = 0, y;
            if (l === "be") for(a = c.length - 1; a >= m; a -= 2)y = u(c, m, a) << h, this.words[p] |= y & 67108863, h >= 18 ? (h -= 18, p += 1, this.words[p] |= y >>> 26) : h += 8;
            else {
                var b = c.length - m;
                for(a = b % 2 === 0 ? m + 1 : m; a < c.length; a += 2)y = u(c, m, a) << h, this.words[p] |= y & 67108863, h >= 18 ? (h -= 18, p += 1, this.words[p] |= y >>> 26) : h += 8;
            }
            this.strip();
        };
        function v(E, c, m, l) {
            for(var a = 0, h = Math.min(E.length, m), p = c; p < h; p++){
                var y = E.charCodeAt(p) - 48;
                a *= l, y >= 49 ? a += y - 49 + 10 : y >= 17 ? a += y - 17 + 10 : a += y;
            }
            return a;
        }
        n.prototype._parseBase = function(c, m, l) {
            this.words = [
                0
            ], this.length = 1;
            for(var a = 0, h = 1; h <= 67108863; h *= m)a++;
            a--, h = h / m | 0;
            for(var p = c.length - l, y = p % a, b = Math.min(p, p - y) + l, s = 0, g = l; g < b; g += a)s = v(c, g, g + a, m), this.imuln(h), this.words[0] + s < 67108864 ? this.words[0] += s : this._iaddn(s);
            if (y !== 0) {
                var w = 1;
                for(s = v(c, g, c.length, m), g = 0; g < y; g++)w *= m;
                this.imuln(w), this.words[0] + s < 67108864 ? this.words[0] += s : this._iaddn(s);
            }
            this.strip();
        }, n.prototype.copy = function(c) {
            c.words = new Array(this.length);
            for(var m = 0; m < this.length; m++)c.words[m] = this.words[m];
            c.length = this.length, c.negative = this.negative, c.red = this.red;
        }, n.prototype.clone = function() {
            var c = new n(null);
            return this.copy(c), c;
        }, n.prototype._expand = function(c) {
            for(; this.length < c;)this.words[this.length++] = 0;
            return this;
        }, n.prototype.strip = function() {
            for(; this.length > 1 && this.words[this.length - 1] === 0;)this.length--;
            return this._normSign();
        }, n.prototype._normSign = function() {
            return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
        }, n.prototype.inspect = function() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        };
        var _ = [
            "",
            "0",
            "00",
            "000",
            "0000",
            "00000",
            "000000",
            "0000000",
            "00000000",
            "000000000",
            "0000000000",
            "00000000000",
            "000000000000",
            "0000000000000",
            "00000000000000",
            "000000000000000",
            "0000000000000000",
            "00000000000000000",
            "000000000000000000",
            "0000000000000000000",
            "00000000000000000000",
            "000000000000000000000",
            "0000000000000000000000",
            "00000000000000000000000",
            "000000000000000000000000",
            "0000000000000000000000000"
        ], x = [
            0,
            0,
            25,
            16,
            12,
            11,
            10,
            9,
            8,
            8,
            7,
            7,
            7,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5
        ], S = [
            0,
            0,
            33554432,
            43046721,
            16777216,
            48828125,
            60466176,
            40353607,
            16777216,
            43046721,
            1e7,
            19487171,
            35831808,
            62748517,
            7529536,
            11390625,
            16777216,
            24137569,
            34012224,
            47045881,
            64e6,
            4084101,
            5153632,
            6436343,
            7962624,
            9765625,
            11881376,
            14348907,
            17210368,
            20511149,
            243e5,
            28629151,
            33554432,
            39135393,
            45435424,
            52521875,
            60466176
        ];
        n.prototype.toString = function(c, m) {
            c = c || 10, m = m | 0 || 1;
            var l;
            if (c === 16 || c === "hex") {
                l = "";
                for(var a = 0, h = 0, p = 0; p < this.length; p++){
                    var y = this.words[p], b = ((y << a | h) & 16777215).toString(16);
                    h = y >>> 24 - a & 16777215, h !== 0 || p !== this.length - 1 ? l = _[6 - b.length] + b + l : l = b + l, a += 2, a >= 26 && (a -= 26, p--);
                }
                for(h !== 0 && (l = h.toString(16) + l); l.length % m !== 0;)l = "0" + l;
                return this.negative !== 0 && (l = "-" + l), l;
            }
            if (c === (c | 0) && c >= 2 && c <= 36) {
                var s = x[c], g = S[c];
                l = "";
                var w = this.clone();
                for(w.negative = 0; !w.isZero();){
                    var d = w.modn(g).toString(c);
                    w = w.idivn(g), w.isZero() ? l = d + l : l = _[s - d.length] + d + l;
                }
                for(this.isZero() && (l = "0" + l); l.length % m !== 0;)l = "0" + l;
                return this.negative !== 0 && (l = "-" + l), l;
            }
            r(!1, "Base should be between 2 and 36");
        }, n.prototype.toNumber = function() {
            var c = this.words[0];
            return this.length === 2 ? c += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? c += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -c : c;
        }, n.prototype.toJSON = function() {
            return this.toString(16);
        }, n.prototype.toBuffer = function(c, m) {
            return r(typeof f < "u"), this.toArrayLike(f, c, m);
        }, n.prototype.toArray = function(c, m) {
            return this.toArrayLike(Array, c, m);
        }, n.prototype.toArrayLike = function(c, m, l) {
            var a = this.byteLength(), h = l || Math.max(1, a);
            r(a <= h, "byte array longer than desired length"), r(h > 0, "Requested array length <= 0"), this.strip();
            var p = m === "le", y = new c(h), b, s, g = this.clone();
            if (p) {
                for(s = 0; !g.isZero(); s++)b = g.andln(255), g.iushrn(8), y[s] = b;
                for(; s < h; s++)y[s] = 0;
            } else {
                for(s = 0; s < h - a; s++)y[s] = 0;
                for(s = 0; !g.isZero(); s++)b = g.andln(255), g.iushrn(8), y[h - s - 1] = b;
            }
            return y;
        }, Math.clz32 ? n.prototype._countBits = function(c) {
            return 32 - Math.clz32(c);
        } : n.prototype._countBits = function(c) {
            var m = c, l = 0;
            return m >= 4096 && (l += 13, m >>>= 13), m >= 64 && (l += 7, m >>>= 7), m >= 8 && (l += 4, m >>>= 4), m >= 2 && (l += 2, m >>>= 2), l + m;
        }, n.prototype._zeroBits = function(c) {
            if (c === 0) return 26;
            var m = c, l = 0;
            return m & 8191 || (l += 13, m >>>= 13), m & 127 || (l += 7, m >>>= 7), m & 15 || (l += 4, m >>>= 4), m & 3 || (l += 2, m >>>= 2), m & 1 || l++, l;
        }, n.prototype.bitLength = function() {
            var c = this.words[this.length - 1], m = this._countBits(c);
            return (this.length - 1) * 26 + m;
        };
        function A(E) {
            for(var c = new Array(E.bitLength()), m = 0; m < c.length; m++){
                var l = m / 26 | 0, a = m % 26;
                c[m] = (E.words[l] & 1 << a) >>> a;
            }
            return c;
        }
        n.prototype.zeroBits = function() {
            if (this.isZero()) return 0;
            for(var c = 0, m = 0; m < this.length; m++){
                var l = this._zeroBits(this.words[m]);
                if (c += l, l !== 26) break;
            }
            return c;
        }, n.prototype.byteLength = function() {
            return Math.ceil(this.bitLength() / 8);
        }, n.prototype.toTwos = function(c) {
            return this.negative !== 0 ? this.abs().inotn(c).iaddn(1) : this.clone();
        }, n.prototype.fromTwos = function(c) {
            return this.testn(c - 1) ? this.notn(c).iaddn(1).ineg() : this.clone();
        }, n.prototype.isNeg = function() {
            return this.negative !== 0;
        }, n.prototype.neg = function() {
            return this.clone().ineg();
        }, n.prototype.ineg = function() {
            return this.isZero() || (this.negative ^= 1), this;
        }, n.prototype.iuor = function(c) {
            for(; this.length < c.length;)this.words[this.length++] = 0;
            for(var m = 0; m < c.length; m++)this.words[m] = this.words[m] | c.words[m];
            return this.strip();
        }, n.prototype.ior = function(c) {
            return r((this.negative | c.negative) === 0), this.iuor(c);
        }, n.prototype.or = function(c) {
            return this.length > c.length ? this.clone().ior(c) : c.clone().ior(this);
        }, n.prototype.uor = function(c) {
            return this.length > c.length ? this.clone().iuor(c) : c.clone().iuor(this);
        }, n.prototype.iuand = function(c) {
            var m;
            this.length > c.length ? m = c : m = this;
            for(var l = 0; l < m.length; l++)this.words[l] = this.words[l] & c.words[l];
            return this.length = m.length, this.strip();
        }, n.prototype.iand = function(c) {
            return r((this.negative | c.negative) === 0), this.iuand(c);
        }, n.prototype.and = function(c) {
            return this.length > c.length ? this.clone().iand(c) : c.clone().iand(this);
        }, n.prototype.uand = function(c) {
            return this.length > c.length ? this.clone().iuand(c) : c.clone().iuand(this);
        }, n.prototype.iuxor = function(c) {
            var m, l;
            this.length > c.length ? (m = this, l = c) : (m = c, l = this);
            for(var a = 0; a < l.length; a++)this.words[a] = m.words[a] ^ l.words[a];
            if (this !== m) for(; a < m.length; a++)this.words[a] = m.words[a];
            return this.length = m.length, this.strip();
        }, n.prototype.ixor = function(c) {
            return r((this.negative | c.negative) === 0), this.iuxor(c);
        }, n.prototype.xor = function(c) {
            return this.length > c.length ? this.clone().ixor(c) : c.clone().ixor(this);
        }, n.prototype.uxor = function(c) {
            return this.length > c.length ? this.clone().iuxor(c) : c.clone().iuxor(this);
        }, n.prototype.inotn = function(c) {
            r(typeof c == "number" && c >= 0);
            var m = Math.ceil(c / 26) | 0, l = c % 26;
            this._expand(m), l > 0 && m--;
            for(var a = 0; a < m; a++)this.words[a] = ~this.words[a] & 67108863;
            return l > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - l), this.strip();
        }, n.prototype.notn = function(c) {
            return this.clone().inotn(c);
        }, n.prototype.setn = function(c, m) {
            r(typeof c == "number" && c >= 0);
            var l = c / 26 | 0, a = c % 26;
            return this._expand(l + 1), m ? this.words[l] = this.words[l] | 1 << a : this.words[l] = this.words[l] & ~(1 << a), this.strip();
        }, n.prototype.iadd = function(c) {
            var m;
            if (this.negative !== 0 && c.negative === 0) return this.negative = 0, m = this.isub(c), this.negative ^= 1, this._normSign();
            if (this.negative === 0 && c.negative !== 0) return c.negative = 0, m = this.isub(c), c.negative = 1, m._normSign();
            var l, a;
            this.length > c.length ? (l = this, a = c) : (l = c, a = this);
            for(var h = 0, p = 0; p < a.length; p++)m = (l.words[p] | 0) + (a.words[p] | 0) + h, this.words[p] = m & 67108863, h = m >>> 26;
            for(; h !== 0 && p < l.length; p++)m = (l.words[p] | 0) + h, this.words[p] = m & 67108863, h = m >>> 26;
            if (this.length = l.length, h !== 0) this.words[this.length] = h, this.length++;
            else if (l !== this) for(; p < l.length; p++)this.words[p] = l.words[p];
            return this;
        }, n.prototype.add = function(c) {
            var m;
            return c.negative !== 0 && this.negative === 0 ? (c.negative = 0, m = this.sub(c), c.negative ^= 1, m) : c.negative === 0 && this.negative !== 0 ? (this.negative = 0, m = c.sub(this), this.negative = 1, m) : this.length > c.length ? this.clone().iadd(c) : c.clone().iadd(this);
        }, n.prototype.isub = function(c) {
            if (c.negative !== 0) {
                c.negative = 0;
                var m = this.iadd(c);
                return c.negative = 1, m._normSign();
            } else if (this.negative !== 0) return this.negative = 0, this.iadd(c), this.negative = 1, this._normSign();
            var l = this.cmp(c);
            if (l === 0) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
            var a, h;
            l > 0 ? (a = this, h = c) : (a = c, h = this);
            for(var p = 0, y = 0; y < h.length; y++)m = (a.words[y] | 0) - (h.words[y] | 0) + p, p = m >> 26, this.words[y] = m & 67108863;
            for(; p !== 0 && y < a.length; y++)m = (a.words[y] | 0) + p, p = m >> 26, this.words[y] = m & 67108863;
            if (p === 0 && y < a.length && a !== this) for(; y < a.length; y++)this.words[y] = a.words[y];
            return this.length = Math.max(this.length, y), a !== this && (this.negative = 1), this.strip();
        }, n.prototype.sub = function(c) {
            return this.clone().isub(c);
        };
        function B(E, c, m) {
            m.negative = c.negative ^ E.negative;
            var l = E.length + c.length | 0;
            m.length = l, l = l - 1 | 0;
            var a = E.words[0] | 0, h = c.words[0] | 0, p = a * h, y = p & 67108863, b = p / 67108864 | 0;
            m.words[0] = y;
            for(var s = 1; s < l; s++){
                for(var g = b >>> 26, w = b & 67108863, d = Math.min(s, c.length - 1), M = Math.max(0, s - E.length + 1); M <= d; M++){
                    var k = s - M | 0;
                    a = E.words[k] | 0, h = c.words[M] | 0, p = a * h + w, g += p / 67108864 | 0, w = p & 67108863;
                }
                m.words[s] = w | 0, b = g | 0;
            }
            return b !== 0 ? m.words[s] = b | 0 : m.length--, m.strip();
        }
        var I = function(c, m, l) {
            var a = c.words, h = m.words, p = l.words, y = 0, b, s, g, w = a[0] | 0, d = w & 8191, M = w >>> 13, k = a[1] | 0, T = k & 8191, C = k >>> 13, N = a[2] | 0, L = N & 8191, O = N >>> 13, It = a[3] | 0, U = It & 8191, H = It >>> 13, hn = a[4] | 0, j = hn & 8191, K = hn >>> 13, cn = a[5] | 0, W = cn & 8191, V = cn >>> 13, un = a[6] | 0, G = un & 8191, Z = un >>> 13, dn = a[7] | 0, X = dn & 8191, Y = dn >>> 13, ln = a[8] | 0, J = ln & 8191, $ = ln >>> 13, pn = a[9] | 0, Q = pn & 8191, ee = pn >>> 13, bn = h[0] | 0, te = bn & 8191, re = bn >>> 13, vn = h[1] | 0, ie = vn & 8191, ne = vn >>> 13, yn = h[2] | 0, fe = yn & 8191, ae = yn >>> 13, mn = h[3] | 0, oe = mn & 8191, se = mn >>> 13, gn = h[4] | 0, he = gn & 8191, ce = gn >>> 13, _n = h[5] | 0, ue = _n & 8191, de = _n >>> 13, wn = h[6] | 0, le = wn & 8191, pe = wn >>> 13, xn = h[7] | 0, be = xn & 8191, ve = xn >>> 13, Mn = h[8] | 0, ye = Mn & 8191, me = Mn >>> 13, Sn = h[9] | 0, ge = Sn & 8191, _e = Sn >>> 13;
            l.negative = c.negative ^ m.negative, l.length = 19, b = Math.imul(d, te), s = Math.imul(d, re), s = s + Math.imul(M, te) | 0, g = Math.imul(M, re);
            var Si = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Si >>> 26) | 0, Si &= 67108863, b = Math.imul(T, te), s = Math.imul(T, re), s = s + Math.imul(C, te) | 0, g = Math.imul(C, re), b = b + Math.imul(d, ie) | 0, s = s + Math.imul(d, ne) | 0, s = s + Math.imul(M, ie) | 0, g = g + Math.imul(M, ne) | 0;
            var De = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863, b = Math.imul(L, te), s = Math.imul(L, re), s = s + Math.imul(O, te) | 0, g = Math.imul(O, re), b = b + Math.imul(T, ie) | 0, s = s + Math.imul(T, ne) | 0, s = s + Math.imul(C, ie) | 0, g = g + Math.imul(C, ne) | 0, b = b + Math.imul(d, fe) | 0, s = s + Math.imul(d, ae) | 0, s = s + Math.imul(M, fe) | 0, g = g + Math.imul(M, ae) | 0;
            var Le = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Le >>> 26) | 0, Le &= 67108863, b = Math.imul(U, te), s = Math.imul(U, re), s = s + Math.imul(H, te) | 0, g = Math.imul(H, re), b = b + Math.imul(L, ie) | 0, s = s + Math.imul(L, ne) | 0, s = s + Math.imul(O, ie) | 0, g = g + Math.imul(O, ne) | 0, b = b + Math.imul(T, fe) | 0, s = s + Math.imul(T, ae) | 0, s = s + Math.imul(C, fe) | 0, g = g + Math.imul(C, ae) | 0, b = b + Math.imul(d, oe) | 0, s = s + Math.imul(d, se) | 0, s = s + Math.imul(M, oe) | 0, g = g + Math.imul(M, se) | 0;
            var kr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (kr >>> 26) | 0, kr &= 67108863, b = Math.imul(j, te), s = Math.imul(j, re), s = s + Math.imul(K, te) | 0, g = Math.imul(K, re), b = b + Math.imul(U, ie) | 0, s = s + Math.imul(U, ne) | 0, s = s + Math.imul(H, ie) | 0, g = g + Math.imul(H, ne) | 0, b = b + Math.imul(L, fe) | 0, s = s + Math.imul(L, ae) | 0, s = s + Math.imul(O, fe) | 0, g = g + Math.imul(O, ae) | 0, b = b + Math.imul(T, oe) | 0, s = s + Math.imul(T, se) | 0, s = s + Math.imul(C, oe) | 0, g = g + Math.imul(C, se) | 0, b = b + Math.imul(d, he) | 0, s = s + Math.imul(d, ce) | 0, s = s + Math.imul(M, he) | 0, g = g + Math.imul(M, ce) | 0;
            var Cr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Cr >>> 26) | 0, Cr &= 67108863, b = Math.imul(W, te), s = Math.imul(W, re), s = s + Math.imul(V, te) | 0, g = Math.imul(V, re), b = b + Math.imul(j, ie) | 0, s = s + Math.imul(j, ne) | 0, s = s + Math.imul(K, ie) | 0, g = g + Math.imul(K, ne) | 0, b = b + Math.imul(U, fe) | 0, s = s + Math.imul(U, ae) | 0, s = s + Math.imul(H, fe) | 0, g = g + Math.imul(H, ae) | 0, b = b + Math.imul(L, oe) | 0, s = s + Math.imul(L, se) | 0, s = s + Math.imul(O, oe) | 0, g = g + Math.imul(O, se) | 0, b = b + Math.imul(T, he) | 0, s = s + Math.imul(T, ce) | 0, s = s + Math.imul(C, he) | 0, g = g + Math.imul(C, ce) | 0, b = b + Math.imul(d, ue) | 0, s = s + Math.imul(d, de) | 0, s = s + Math.imul(M, ue) | 0, g = g + Math.imul(M, de) | 0;
            var Tr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Tr >>> 26) | 0, Tr &= 67108863, b = Math.imul(G, te), s = Math.imul(G, re), s = s + Math.imul(Z, te) | 0, g = Math.imul(Z, re), b = b + Math.imul(W, ie) | 0, s = s + Math.imul(W, ne) | 0, s = s + Math.imul(V, ie) | 0, g = g + Math.imul(V, ne) | 0, b = b + Math.imul(j, fe) | 0, s = s + Math.imul(j, ae) | 0, s = s + Math.imul(K, fe) | 0, g = g + Math.imul(K, ae) | 0, b = b + Math.imul(U, oe) | 0, s = s + Math.imul(U, se) | 0, s = s + Math.imul(H, oe) | 0, g = g + Math.imul(H, se) | 0, b = b + Math.imul(L, he) | 0, s = s + Math.imul(L, ce) | 0, s = s + Math.imul(O, he) | 0, g = g + Math.imul(O, ce) | 0, b = b + Math.imul(T, ue) | 0, s = s + Math.imul(T, de) | 0, s = s + Math.imul(C, ue) | 0, g = g + Math.imul(C, de) | 0, b = b + Math.imul(d, le) | 0, s = s + Math.imul(d, pe) | 0, s = s + Math.imul(M, le) | 0, g = g + Math.imul(M, pe) | 0;
            var Pr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Pr >>> 26) | 0, Pr &= 67108863, b = Math.imul(X, te), s = Math.imul(X, re), s = s + Math.imul(Y, te) | 0, g = Math.imul(Y, re), b = b + Math.imul(G, ie) | 0, s = s + Math.imul(G, ne) | 0, s = s + Math.imul(Z, ie) | 0, g = g + Math.imul(Z, ne) | 0, b = b + Math.imul(W, fe) | 0, s = s + Math.imul(W, ae) | 0, s = s + Math.imul(V, fe) | 0, g = g + Math.imul(V, ae) | 0, b = b + Math.imul(j, oe) | 0, s = s + Math.imul(j, se) | 0, s = s + Math.imul(K, oe) | 0, g = g + Math.imul(K, se) | 0, b = b + Math.imul(U, he) | 0, s = s + Math.imul(U, ce) | 0, s = s + Math.imul(H, he) | 0, g = g + Math.imul(H, ce) | 0, b = b + Math.imul(L, ue) | 0, s = s + Math.imul(L, de) | 0, s = s + Math.imul(O, ue) | 0, g = g + Math.imul(O, de) | 0, b = b + Math.imul(T, le) | 0, s = s + Math.imul(T, pe) | 0, s = s + Math.imul(C, le) | 0, g = g + Math.imul(C, pe) | 0, b = b + Math.imul(d, be) | 0, s = s + Math.imul(d, ve) | 0, s = s + Math.imul(M, be) | 0, g = g + Math.imul(M, ve) | 0;
            var Dr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Dr >>> 26) | 0, Dr &= 67108863, b = Math.imul(J, te), s = Math.imul(J, re), s = s + Math.imul($, te) | 0, g = Math.imul($, re), b = b + Math.imul(X, ie) | 0, s = s + Math.imul(X, ne) | 0, s = s + Math.imul(Y, ie) | 0, g = g + Math.imul(Y, ne) | 0, b = b + Math.imul(G, fe) | 0, s = s + Math.imul(G, ae) | 0, s = s + Math.imul(Z, fe) | 0, g = g + Math.imul(Z, ae) | 0, b = b + Math.imul(W, oe) | 0, s = s + Math.imul(W, se) | 0, s = s + Math.imul(V, oe) | 0, g = g + Math.imul(V, se) | 0, b = b + Math.imul(j, he) | 0, s = s + Math.imul(j, ce) | 0, s = s + Math.imul(K, he) | 0, g = g + Math.imul(K, ce) | 0, b = b + Math.imul(U, ue) | 0, s = s + Math.imul(U, de) | 0, s = s + Math.imul(H, ue) | 0, g = g + Math.imul(H, de) | 0, b = b + Math.imul(L, le) | 0, s = s + Math.imul(L, pe) | 0, s = s + Math.imul(O, le) | 0, g = g + Math.imul(O, pe) | 0, b = b + Math.imul(T, be) | 0, s = s + Math.imul(T, ve) | 0, s = s + Math.imul(C, be) | 0, g = g + Math.imul(C, ve) | 0, b = b + Math.imul(d, ye) | 0, s = s + Math.imul(d, me) | 0, s = s + Math.imul(M, ye) | 0, g = g + Math.imul(M, me) | 0;
            var Lr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Lr >>> 26) | 0, Lr &= 67108863, b = Math.imul(Q, te), s = Math.imul(Q, re), s = s + Math.imul(ee, te) | 0, g = Math.imul(ee, re), b = b + Math.imul(J, ie) | 0, s = s + Math.imul(J, ne) | 0, s = s + Math.imul($, ie) | 0, g = g + Math.imul($, ne) | 0, b = b + Math.imul(X, fe) | 0, s = s + Math.imul(X, ae) | 0, s = s + Math.imul(Y, fe) | 0, g = g + Math.imul(Y, ae) | 0, b = b + Math.imul(G, oe) | 0, s = s + Math.imul(G, se) | 0, s = s + Math.imul(Z, oe) | 0, g = g + Math.imul(Z, se) | 0, b = b + Math.imul(W, he) | 0, s = s + Math.imul(W, ce) | 0, s = s + Math.imul(V, he) | 0, g = g + Math.imul(V, ce) | 0, b = b + Math.imul(j, ue) | 0, s = s + Math.imul(j, de) | 0, s = s + Math.imul(K, ue) | 0, g = g + Math.imul(K, de) | 0, b = b + Math.imul(U, le) | 0, s = s + Math.imul(U, pe) | 0, s = s + Math.imul(H, le) | 0, g = g + Math.imul(H, pe) | 0, b = b + Math.imul(L, be) | 0, s = s + Math.imul(L, ve) | 0, s = s + Math.imul(O, be) | 0, g = g + Math.imul(O, ve) | 0, b = b + Math.imul(T, ye) | 0, s = s + Math.imul(T, me) | 0, s = s + Math.imul(C, ye) | 0, g = g + Math.imul(C, me) | 0, b = b + Math.imul(d, ge) | 0, s = s + Math.imul(d, _e) | 0, s = s + Math.imul(M, ge) | 0, g = g + Math.imul(M, _e) | 0;
            var Nr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Nr >>> 26) | 0, Nr &= 67108863, b = Math.imul(Q, ie), s = Math.imul(Q, ne), s = s + Math.imul(ee, ie) | 0, g = Math.imul(ee, ne), b = b + Math.imul(J, fe) | 0, s = s + Math.imul(J, ae) | 0, s = s + Math.imul($, fe) | 0, g = g + Math.imul($, ae) | 0, b = b + Math.imul(X, oe) | 0, s = s + Math.imul(X, se) | 0, s = s + Math.imul(Y, oe) | 0, g = g + Math.imul(Y, se) | 0, b = b + Math.imul(G, he) | 0, s = s + Math.imul(G, ce) | 0, s = s + Math.imul(Z, he) | 0, g = g + Math.imul(Z, ce) | 0, b = b + Math.imul(W, ue) | 0, s = s + Math.imul(W, de) | 0, s = s + Math.imul(V, ue) | 0, g = g + Math.imul(V, de) | 0, b = b + Math.imul(j, le) | 0, s = s + Math.imul(j, pe) | 0, s = s + Math.imul(K, le) | 0, g = g + Math.imul(K, pe) | 0, b = b + Math.imul(U, be) | 0, s = s + Math.imul(U, ve) | 0, s = s + Math.imul(H, be) | 0, g = g + Math.imul(H, ve) | 0, b = b + Math.imul(L, ye) | 0, s = s + Math.imul(L, me) | 0, s = s + Math.imul(O, ye) | 0, g = g + Math.imul(O, me) | 0, b = b + Math.imul(T, ge) | 0, s = s + Math.imul(T, _e) | 0, s = s + Math.imul(C, ge) | 0, g = g + Math.imul(C, _e) | 0;
            var Or = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Or >>> 26) | 0, Or &= 67108863, b = Math.imul(Q, fe), s = Math.imul(Q, ae), s = s + Math.imul(ee, fe) | 0, g = Math.imul(ee, ae), b = b + Math.imul(J, oe) | 0, s = s + Math.imul(J, se) | 0, s = s + Math.imul($, oe) | 0, g = g + Math.imul($, se) | 0, b = b + Math.imul(X, he) | 0, s = s + Math.imul(X, ce) | 0, s = s + Math.imul(Y, he) | 0, g = g + Math.imul(Y, ce) | 0, b = b + Math.imul(G, ue) | 0, s = s + Math.imul(G, de) | 0, s = s + Math.imul(Z, ue) | 0, g = g + Math.imul(Z, de) | 0, b = b + Math.imul(W, le) | 0, s = s + Math.imul(W, pe) | 0, s = s + Math.imul(V, le) | 0, g = g + Math.imul(V, pe) | 0, b = b + Math.imul(j, be) | 0, s = s + Math.imul(j, ve) | 0, s = s + Math.imul(K, be) | 0, g = g + Math.imul(K, ve) | 0, b = b + Math.imul(U, ye) | 0, s = s + Math.imul(U, me) | 0, s = s + Math.imul(H, ye) | 0, g = g + Math.imul(H, me) | 0, b = b + Math.imul(L, ge) | 0, s = s + Math.imul(L, _e) | 0, s = s + Math.imul(O, ge) | 0, g = g + Math.imul(O, _e) | 0;
            var Fr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Fr >>> 26) | 0, Fr &= 67108863, b = Math.imul(Q, oe), s = Math.imul(Q, se), s = s + Math.imul(ee, oe) | 0, g = Math.imul(ee, se), b = b + Math.imul(J, he) | 0, s = s + Math.imul(J, ce) | 0, s = s + Math.imul($, he) | 0, g = g + Math.imul($, ce) | 0, b = b + Math.imul(X, ue) | 0, s = s + Math.imul(X, de) | 0, s = s + Math.imul(Y, ue) | 0, g = g + Math.imul(Y, de) | 0, b = b + Math.imul(G, le) | 0, s = s + Math.imul(G, pe) | 0, s = s + Math.imul(Z, le) | 0, g = g + Math.imul(Z, pe) | 0, b = b + Math.imul(W, be) | 0, s = s + Math.imul(W, ve) | 0, s = s + Math.imul(V, be) | 0, g = g + Math.imul(V, ve) | 0, b = b + Math.imul(j, ye) | 0, s = s + Math.imul(j, me) | 0, s = s + Math.imul(K, ye) | 0, g = g + Math.imul(K, me) | 0, b = b + Math.imul(U, ge) | 0, s = s + Math.imul(U, _e) | 0, s = s + Math.imul(H, ge) | 0, g = g + Math.imul(H, _e) | 0;
            var Ur = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Ur >>> 26) | 0, Ur &= 67108863, b = Math.imul(Q, he), s = Math.imul(Q, ce), s = s + Math.imul(ee, he) | 0, g = Math.imul(ee, ce), b = b + Math.imul(J, ue) | 0, s = s + Math.imul(J, de) | 0, s = s + Math.imul($, ue) | 0, g = g + Math.imul($, de) | 0, b = b + Math.imul(X, le) | 0, s = s + Math.imul(X, pe) | 0, s = s + Math.imul(Y, le) | 0, g = g + Math.imul(Y, pe) | 0, b = b + Math.imul(G, be) | 0, s = s + Math.imul(G, ve) | 0, s = s + Math.imul(Z, be) | 0, g = g + Math.imul(Z, ve) | 0, b = b + Math.imul(W, ye) | 0, s = s + Math.imul(W, me) | 0, s = s + Math.imul(V, ye) | 0, g = g + Math.imul(V, me) | 0, b = b + Math.imul(j, ge) | 0, s = s + Math.imul(j, _e) | 0, s = s + Math.imul(K, ge) | 0, g = g + Math.imul(K, _e) | 0;
            var zr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (zr >>> 26) | 0, zr &= 67108863, b = Math.imul(Q, ue), s = Math.imul(Q, de), s = s + Math.imul(ee, ue) | 0, g = Math.imul(ee, de), b = b + Math.imul(J, le) | 0, s = s + Math.imul(J, pe) | 0, s = s + Math.imul($, le) | 0, g = g + Math.imul($, pe) | 0, b = b + Math.imul(X, be) | 0, s = s + Math.imul(X, ve) | 0, s = s + Math.imul(Y, be) | 0, g = g + Math.imul(Y, ve) | 0, b = b + Math.imul(G, ye) | 0, s = s + Math.imul(G, me) | 0, s = s + Math.imul(Z, ye) | 0, g = g + Math.imul(Z, me) | 0, b = b + Math.imul(W, ge) | 0, s = s + Math.imul(W, _e) | 0, s = s + Math.imul(V, ge) | 0, g = g + Math.imul(V, _e) | 0;
            var Hr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Hr >>> 26) | 0, Hr &= 67108863, b = Math.imul(Q, le), s = Math.imul(Q, pe), s = s + Math.imul(ee, le) | 0, g = Math.imul(ee, pe), b = b + Math.imul(J, be) | 0, s = s + Math.imul(J, ve) | 0, s = s + Math.imul($, be) | 0, g = g + Math.imul($, ve) | 0, b = b + Math.imul(X, ye) | 0, s = s + Math.imul(X, me) | 0, s = s + Math.imul(Y, ye) | 0, g = g + Math.imul(Y, me) | 0, b = b + Math.imul(G, ge) | 0, s = s + Math.imul(G, _e) | 0, s = s + Math.imul(Z, ge) | 0, g = g + Math.imul(Z, _e) | 0;
            var jr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (jr >>> 26) | 0, jr &= 67108863, b = Math.imul(Q, be), s = Math.imul(Q, ve), s = s + Math.imul(ee, be) | 0, g = Math.imul(ee, ve), b = b + Math.imul(J, ye) | 0, s = s + Math.imul(J, me) | 0, s = s + Math.imul($, ye) | 0, g = g + Math.imul($, me) | 0, b = b + Math.imul(X, ge) | 0, s = s + Math.imul(X, _e) | 0, s = s + Math.imul(Y, ge) | 0, g = g + Math.imul(Y, _e) | 0;
            var Kr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Kr >>> 26) | 0, Kr &= 67108863, b = Math.imul(Q, ye), s = Math.imul(Q, me), s = s + Math.imul(ee, ye) | 0, g = Math.imul(ee, me), b = b + Math.imul(J, ge) | 0, s = s + Math.imul(J, _e) | 0, s = s + Math.imul($, ge) | 0, g = g + Math.imul($, _e) | 0;
            var Wr = (y + b | 0) + ((s & 8191) << 13) | 0;
            y = (g + (s >>> 13) | 0) + (Wr >>> 26) | 0, Wr &= 67108863, b = Math.imul(Q, ge), s = Math.imul(Q, _e), s = s + Math.imul(ee, ge) | 0, g = Math.imul(ee, _e);
            var Vr = (y + b | 0) + ((s & 8191) << 13) | 0;
            return y = (g + (s >>> 13) | 0) + (Vr >>> 26) | 0, Vr &= 67108863, p[0] = Si, p[1] = De, p[2] = Le, p[3] = kr, p[4] = Cr, p[5] = Tr, p[6] = Pr, p[7] = Dr, p[8] = Lr, p[9] = Nr, p[10] = Or, p[11] = Fr, p[12] = Ur, p[13] = zr, p[14] = Hr, p[15] = jr, p[16] = Kr, p[17] = Wr, p[18] = Vr, y !== 0 && (p[19] = y, l.length++), l;
        };
        Math.imul || (I = B);
        function P(E, c, m) {
            m.negative = c.negative ^ E.negative, m.length = E.length + c.length;
            for(var l = 0, a = 0, h = 0; h < m.length - 1; h++){
                var p = a;
                a = 0;
                for(var y = l & 67108863, b = Math.min(h, c.length - 1), s = Math.max(0, h - E.length + 1); s <= b; s++){
                    var g = h - s, w = E.words[g] | 0, d = c.words[s] | 0, M = w * d, k = M & 67108863;
                    p = p + (M / 67108864 | 0) | 0, k = k + y | 0, y = k & 67108863, p = p + (k >>> 26) | 0, a += p >>> 26, p &= 67108863;
                }
                m.words[h] = y, l = p, p = a;
            }
            return l !== 0 ? m.words[h] = l : m.length--, m.strip();
        }
        function F(E, c, m) {
            var l = new D;
            return l.mulp(E, c, m);
        }
        n.prototype.mulTo = function(c, m) {
            var l, a = this.length + c.length;
            return this.length === 10 && c.length === 10 ? l = I(this, c, m) : a < 63 ? l = B(this, c, m) : a < 1024 ? l = P(this, c, m) : l = F(this, c, m), l;
        };
        function D(E, c) {
            this.x = E, this.y = c;
        }
        D.prototype.makeRBT = function(c) {
            for(var m = new Array(c), l = n.prototype._countBits(c) - 1, a = 0; a < c; a++)m[a] = this.revBin(a, l, c);
            return m;
        }, D.prototype.revBin = function(c, m, l) {
            if (c === 0 || c === l - 1) return c;
            for(var a = 0, h = 0; h < m; h++)a |= (c & 1) << m - h - 1, c >>= 1;
            return a;
        }, D.prototype.permute = function(c, m, l, a, h, p) {
            for(var y = 0; y < p; y++)a[y] = m[c[y]], h[y] = l[c[y]];
        }, D.prototype.transform = function(c, m, l, a, h, p) {
            this.permute(p, c, m, l, a, h);
            for(var y = 1; y < h; y <<= 1)for(var b = y << 1, s = Math.cos(2 * Math.PI / b), g = Math.sin(2 * Math.PI / b), w = 0; w < h; w += b)for(var d = s, M = g, k = 0; k < y; k++){
                var T = l[w + k], C = a[w + k], N = l[w + k + y], L = a[w + k + y], O = d * N - M * L;
                L = d * L + M * N, N = O, l[w + k] = T + N, a[w + k] = C + L, l[w + k + y] = T - N, a[w + k + y] = C - L, k !== b && (O = s * d - g * M, M = s * M + g * d, d = O);
            }
        }, D.prototype.guessLen13b = function(c, m) {
            var l = Math.max(m, c) | 1, a = l & 1, h = 0;
            for(l = l / 2 | 0; l; l = l >>> 1)h++;
            return 1 << h + 1 + a;
        }, D.prototype.conjugate = function(c, m, l) {
            if (!(l <= 1)) for(var a = 0; a < l / 2; a++){
                var h = c[a];
                c[a] = c[l - a - 1], c[l - a - 1] = h, h = m[a], m[a] = -m[l - a - 1], m[l - a - 1] = -h;
            }
        }, D.prototype.normalize13b = function(c, m) {
            for(var l = 0, a = 0; a < m / 2; a++){
                var h = Math.round(c[2 * a + 1] / m) * 8192 + Math.round(c[2 * a] / m) + l;
                c[a] = h & 67108863, h < 67108864 ? l = 0 : l = h / 67108864 | 0;
            }
            return c;
        }, D.prototype.convert13b = function(c, m, l, a) {
            for(var h = 0, p = 0; p < m; p++)h = h + (c[p] | 0), l[2 * p] = h & 8191, h = h >>> 13, l[2 * p + 1] = h & 8191, h = h >>> 13;
            for(p = 2 * m; p < a; ++p)l[p] = 0;
            r(h === 0), r((h & -8192) === 0);
        }, D.prototype.stub = function(c) {
            for(var m = new Array(c), l = 0; l < c; l++)m[l] = 0;
            return m;
        }, D.prototype.mulp = function(c, m, l) {
            var a = 2 * this.guessLen13b(c.length, m.length), h = this.makeRBT(a), p = this.stub(a), y = new Array(a), b = new Array(a), s = new Array(a), g = new Array(a), w = new Array(a), d = new Array(a), M = l.words;
            M.length = a, this.convert13b(c.words, c.length, y, a), this.convert13b(m.words, m.length, g, a), this.transform(y, p, b, s, a, h), this.transform(g, p, w, d, a, h);
            for(var k = 0; k < a; k++){
                var T = b[k] * w[k] - s[k] * d[k];
                s[k] = b[k] * d[k] + s[k] * w[k], b[k] = T;
            }
            return this.conjugate(b, s, a), this.transform(b, s, M, p, a, h), this.conjugate(M, p, a), this.normalize13b(M, a), l.negative = c.negative ^ m.negative, l.length = c.length + m.length, l.strip();
        }, n.prototype.mul = function(c) {
            var m = new n(null);
            return m.words = new Array(this.length + c.length), this.mulTo(c, m);
        }, n.prototype.mulf = function(c) {
            var m = new n(null);
            return m.words = new Array(this.length + c.length), F(this, c, m);
        }, n.prototype.imul = function(c) {
            return this.clone().mulTo(c, this);
        }, n.prototype.imuln = function(c) {
            r(typeof c == "number"), r(c < 67108864);
            for(var m = 0, l = 0; l < this.length; l++){
                var a = (this.words[l] | 0) * c, h = (a & 67108863) + (m & 67108863);
                m >>= 26, m += a / 67108864 | 0, m += h >>> 26, this.words[l] = h & 67108863;
            }
            return m !== 0 && (this.words[l] = m, this.length++), this;
        }, n.prototype.muln = function(c) {
            return this.clone().imuln(c);
        }, n.prototype.sqr = function() {
            return this.mul(this);
        }, n.prototype.isqr = function() {
            return this.imul(this.clone());
        }, n.prototype.pow = function(c) {
            var m = A(c);
            if (m.length === 0) return new n(1);
            for(var l = this, a = 0; a < m.length && m[a] === 0; a++, l = l.sqr());
            if (++a < m.length) for(var h = l.sqr(); a < m.length; a++, h = h.sqr())m[a] !== 0 && (l = l.mul(h));
            return l;
        }, n.prototype.iushln = function(c) {
            r(typeof c == "number" && c >= 0);
            var m = c % 26, l = (c - m) / 26, a = 67108863 >>> 26 - m << 26 - m, h;
            if (m !== 0) {
                var p = 0;
                for(h = 0; h < this.length; h++){
                    var y = this.words[h] & a, b = (this.words[h] | 0) - y << m;
                    this.words[h] = b | p, p = y >>> 26 - m;
                }
                p && (this.words[h] = p, this.length++);
            }
            if (l !== 0) {
                for(h = this.length - 1; h >= 0; h--)this.words[h + l] = this.words[h];
                for(h = 0; h < l; h++)this.words[h] = 0;
                this.length += l;
            }
            return this.strip();
        }, n.prototype.ishln = function(c) {
            return r(this.negative === 0), this.iushln(c);
        }, n.prototype.iushrn = function(c, m, l) {
            r(typeof c == "number" && c >= 0);
            var a;
            m ? a = (m - m % 26) / 26 : a = 0;
            var h = c % 26, p = Math.min((c - h) / 26, this.length), y = 67108863 ^ 67108863 >>> h << h, b = l;
            if (a -= p, a = Math.max(0, a), b) {
                for(var s = 0; s < p; s++)b.words[s] = this.words[s];
                b.length = p;
            }
            if (p !== 0) {
                if (this.length > p) for(this.length -= p, s = 0; s < this.length; s++)this.words[s] = this.words[s + p];
                else this.words[0] = 0, this.length = 1;
            }
            var g = 0;
            for(s = this.length - 1; s >= 0 && (g !== 0 || s >= a); s--){
                var w = this.words[s] | 0;
                this.words[s] = g << 26 - h | w >>> h, g = w & y;
            }
            return b && g !== 0 && (b.words[b.length++] = g), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
        }, n.prototype.ishrn = function(c, m, l) {
            return r(this.negative === 0), this.iushrn(c, m, l);
        }, n.prototype.shln = function(c) {
            return this.clone().ishln(c);
        }, n.prototype.ushln = function(c) {
            return this.clone().iushln(c);
        }, n.prototype.shrn = function(c) {
            return this.clone().ishrn(c);
        }, n.prototype.ushrn = function(c) {
            return this.clone().iushrn(c);
        }, n.prototype.testn = function(c) {
            r(typeof c == "number" && c >= 0);
            var m = c % 26, l = (c - m) / 26, a = 1 << m;
            if (this.length <= l) return !1;
            var h = this.words[l];
            return !!(h & a);
        }, n.prototype.imaskn = function(c) {
            r(typeof c == "number" && c >= 0);
            var m = c % 26, l = (c - m) / 26;
            if (r(this.negative === 0, "imaskn works only with positive numbers"), this.length <= l) return this;
            if (m !== 0 && l++, this.length = Math.min(l, this.length), m !== 0) {
                var a = 67108863 ^ 67108863 >>> m << m;
                this.words[this.length - 1] &= a;
            }
            return this.strip();
        }, n.prototype.maskn = function(c) {
            return this.clone().imaskn(c);
        }, n.prototype.iaddn = function(c) {
            return r(typeof c == "number"), r(c < 67108864), c < 0 ? this.isubn(-c) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < c ? (this.words[0] = c - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(c), this.negative = 1, this) : this._iaddn(c);
        }, n.prototype._iaddn = function(c) {
            this.words[0] += c;
            for(var m = 0; m < this.length && this.words[m] >= 67108864; m++)this.words[m] -= 67108864, m === this.length - 1 ? this.words[m + 1] = 1 : this.words[m + 1]++;
            return this.length = Math.max(this.length, m + 1), this;
        }, n.prototype.isubn = function(c) {
            if (r(typeof c == "number"), r(c < 67108864), c < 0) return this.iaddn(-c);
            if (this.negative !== 0) return this.negative = 0, this.iaddn(c), this.negative = 1, this;
            if (this.words[0] -= c, this.length === 1 && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
            else for(var m = 0; m < this.length && this.words[m] < 0; m++)this.words[m] += 67108864, this.words[m + 1] -= 1;
            return this.strip();
        }, n.prototype.addn = function(c) {
            return this.clone().iaddn(c);
        }, n.prototype.subn = function(c) {
            return this.clone().isubn(c);
        }, n.prototype.iabs = function() {
            return this.negative = 0, this;
        }, n.prototype.abs = function() {
            return this.clone().iabs();
        }, n.prototype._ishlnsubmul = function(c, m, l) {
            var a = c.length + l, h;
            this._expand(a);
            var p, y = 0;
            for(h = 0; h < c.length; h++){
                p = (this.words[h + l] | 0) + y;
                var b = (c.words[h] | 0) * m;
                p -= b & 67108863, y = (p >> 26) - (b / 67108864 | 0), this.words[h + l] = p & 67108863;
            }
            for(; h < this.length - l; h++)p = (this.words[h + l] | 0) + y, y = p >> 26, this.words[h + l] = p & 67108863;
            if (y === 0) return this.strip();
            for(r(y === -1), y = 0, h = 0; h < this.length; h++)p = -(this.words[h] | 0) + y, y = p >> 26, this.words[h] = p & 67108863;
            return this.negative = 1, this.strip();
        }, n.prototype._wordDiv = function(c, m) {
            var l = this.length - c.length, a = this.clone(), h = c, p = h.words[h.length - 1] | 0, y = this._countBits(p);
            l = 26 - y, l !== 0 && (h = h.ushln(l), a.iushln(l), p = h.words[h.length - 1] | 0);
            var b = a.length - h.length, s;
            if (m !== "mod") {
                s = new n(null), s.length = b + 1, s.words = new Array(s.length);
                for(var g = 0; g < s.length; g++)s.words[g] = 0;
            }
            var w = a.clone()._ishlnsubmul(h, 1, b);
            w.negative === 0 && (a = w, s && (s.words[b] = 1));
            for(var d = b - 1; d >= 0; d--){
                var M = (a.words[h.length + d] | 0) * 67108864 + (a.words[h.length + d - 1] | 0);
                for(M = Math.min(M / p | 0, 67108863), a._ishlnsubmul(h, M, d); a.negative !== 0;)M--, a.negative = 0, a._ishlnsubmul(h, 1, d), a.isZero() || (a.negative ^= 1);
                s && (s.words[d] = M);
            }
            return s && s.strip(), a.strip(), m !== "div" && l !== 0 && a.iushrn(l), {
                div: s || null,
                mod: a
            };
        }, n.prototype.divmod = function(c, m, l) {
            if (r(!c.isZero()), this.isZero()) return {
                div: new n(0),
                mod: new n(0)
            };
            var a, h, p;
            return this.negative !== 0 && c.negative === 0 ? (p = this.neg().divmod(c, m), m !== "mod" && (a = p.div.neg()), m !== "div" && (h = p.mod.neg(), l && h.negative !== 0 && h.iadd(c)), {
                div: a,
                mod: h
            }) : this.negative === 0 && c.negative !== 0 ? (p = this.divmod(c.neg(), m), m !== "mod" && (a = p.div.neg()), {
                div: a,
                mod: p.mod
            }) : this.negative & c.negative ? (p = this.neg().divmod(c.neg(), m), m !== "div" && (h = p.mod.neg(), l && h.negative !== 0 && h.isub(c)), {
                div: p.div,
                mod: h
            }) : c.length > this.length || this.cmp(c) < 0 ? {
                div: new n(0),
                mod: this
            } : c.length === 1 ? m === "div" ? {
                div: this.divn(c.words[0]),
                mod: null
            } : m === "mod" ? {
                div: null,
                mod: new n(this.modn(c.words[0]))
            } : {
                div: this.divn(c.words[0]),
                mod: new n(this.modn(c.words[0]))
            } : this._wordDiv(c, m);
        }, n.prototype.div = function(c) {
            return this.divmod(c, "div", !1).div;
        }, n.prototype.mod = function(c) {
            return this.divmod(c, "mod", !1).mod;
        }, n.prototype.umod = function(c) {
            return this.divmod(c, "mod", !0).mod;
        }, n.prototype.divRound = function(c) {
            var m = this.divmod(c);
            if (m.mod.isZero()) return m.div;
            var l = m.div.negative !== 0 ? m.mod.isub(c) : m.mod, a = c.ushrn(1), h = c.andln(1), p = l.cmp(a);
            return p < 0 || h === 1 && p === 0 ? m.div : m.div.negative !== 0 ? m.div.isubn(1) : m.div.iaddn(1);
        }, n.prototype.modn = function(c) {
            r(c <= 67108863);
            for(var m = 67108864 % c, l = 0, a = this.length - 1; a >= 0; a--)l = (m * l + (this.words[a] | 0)) % c;
            return l;
        }, n.prototype.idivn = function(c) {
            r(c <= 67108863);
            for(var m = 0, l = this.length - 1; l >= 0; l--){
                var a = (this.words[l] | 0) + m * 67108864;
                this.words[l] = a / c | 0, m = a % c;
            }
            return this.strip();
        }, n.prototype.divn = function(c) {
            return this.clone().idivn(c);
        }, n.prototype.egcd = function(c) {
            r(c.negative === 0), r(!c.isZero());
            var m = this, l = c.clone();
            m.negative !== 0 ? m = m.umod(c) : m = m.clone();
            for(var a = new n(1), h = new n(0), p = new n(0), y = new n(1), b = 0; m.isEven() && l.isEven();)m.iushrn(1), l.iushrn(1), ++b;
            for(var s = l.clone(), g = m.clone(); !m.isZero();){
                for(var w = 0, d = 1; !(m.words[0] & d) && w < 26; ++w, d <<= 1);
                if (w > 0) for(m.iushrn(w); w-- > 0;)(a.isOdd() || h.isOdd()) && (a.iadd(s), h.isub(g)), a.iushrn(1), h.iushrn(1);
                for(var M = 0, k = 1; !(l.words[0] & k) && M < 26; ++M, k <<= 1);
                if (M > 0) for(l.iushrn(M); M-- > 0;)(p.isOdd() || y.isOdd()) && (p.iadd(s), y.isub(g)), p.iushrn(1), y.iushrn(1);
                m.cmp(l) >= 0 ? (m.isub(l), a.isub(p), h.isub(y)) : (l.isub(m), p.isub(a), y.isub(h));
            }
            return {
                a: p,
                b: y,
                gcd: l.iushln(b)
            };
        }, n.prototype._invmp = function(c) {
            r(c.negative === 0), r(!c.isZero());
            var m = this, l = c.clone();
            m.negative !== 0 ? m = m.umod(c) : m = m.clone();
            for(var a = new n(1), h = new n(0), p = l.clone(); m.cmpn(1) > 0 && l.cmpn(1) > 0;){
                for(var y = 0, b = 1; !(m.words[0] & b) && y < 26; ++y, b <<= 1);
                if (y > 0) for(m.iushrn(y); y-- > 0;)a.isOdd() && a.iadd(p), a.iushrn(1);
                for(var s = 0, g = 1; !(l.words[0] & g) && s < 26; ++s, g <<= 1);
                if (s > 0) for(l.iushrn(s); s-- > 0;)h.isOdd() && h.iadd(p), h.iushrn(1);
                m.cmp(l) >= 0 ? (m.isub(l), a.isub(h)) : (l.isub(m), h.isub(a));
            }
            var w;
            return m.cmpn(1) === 0 ? w = a : w = h, w.cmpn(0) < 0 && w.iadd(c), w;
        }, n.prototype.gcd = function(c) {
            if (this.isZero()) return c.abs();
            if (c.isZero()) return this.abs();
            var m = this.clone(), l = c.clone();
            m.negative = 0, l.negative = 0;
            for(var a = 0; m.isEven() && l.isEven(); a++)m.iushrn(1), l.iushrn(1);
            do {
                for(; m.isEven();)m.iushrn(1);
                for(; l.isEven();)l.iushrn(1);
                var h = m.cmp(l);
                if (h < 0) {
                    var p = m;
                    m = l, l = p;
                } else if (h === 0 || l.cmpn(1) === 0) break;
                m.isub(l);
            }while (!0);
            return l.iushln(a);
        }, n.prototype.invm = function(c) {
            return this.egcd(c).a.umod(c);
        }, n.prototype.isEven = function() {
            return (this.words[0] & 1) === 0;
        }, n.prototype.isOdd = function() {
            return (this.words[0] & 1) === 1;
        }, n.prototype.andln = function(c) {
            return this.words[0] & c;
        }, n.prototype.bincn = function(c) {
            r(typeof c == "number");
            var m = c % 26, l = (c - m) / 26, a = 1 << m;
            if (this.length <= l) return this._expand(l + 1), this.words[l] |= a, this;
            for(var h = a, p = l; h !== 0 && p < this.length; p++){
                var y = this.words[p] | 0;
                y += h, h = y >>> 26, y &= 67108863, this.words[p] = y;
            }
            return h !== 0 && (this.words[p] = h, this.length++), this;
        }, n.prototype.isZero = function() {
            return this.length === 1 && this.words[0] === 0;
        }, n.prototype.cmpn = function(c) {
            var m = c < 0;
            if (this.negative !== 0 && !m) return -1;
            if (this.negative === 0 && m) return 1;
            this.strip();
            var l;
            if (this.length > 1) l = 1;
            else {
                m && (c = -c), r(c <= 67108863, "Number is too big");
                var a = this.words[0] | 0;
                l = a === c ? 0 : a < c ? -1 : 1;
            }
            return this.negative !== 0 ? -l | 0 : l;
        }, n.prototype.cmp = function(c) {
            if (this.negative !== 0 && c.negative === 0) return -1;
            if (this.negative === 0 && c.negative !== 0) return 1;
            var m = this.ucmp(c);
            return this.negative !== 0 ? -m | 0 : m;
        }, n.prototype.ucmp = function(c) {
            if (this.length > c.length) return 1;
            if (this.length < c.length) return -1;
            for(var m = 0, l = this.length - 1; l >= 0; l--){
                var a = this.words[l] | 0, h = c.words[l] | 0;
                if (a !== h) {
                    a < h ? m = -1 : a > h && (m = 1);
                    break;
                }
            }
            return m;
        }, n.prototype.gtn = function(c) {
            return this.cmpn(c) === 1;
        }, n.prototype.gt = function(c) {
            return this.cmp(c) === 1;
        }, n.prototype.gten = function(c) {
            return this.cmpn(c) >= 0;
        }, n.prototype.gte = function(c) {
            return this.cmp(c) >= 0;
        }, n.prototype.ltn = function(c) {
            return this.cmpn(c) === -1;
        }, n.prototype.lt = function(c) {
            return this.cmp(c) === -1;
        }, n.prototype.lten = function(c) {
            return this.cmpn(c) <= 0;
        }, n.prototype.lte = function(c) {
            return this.cmp(c) <= 0;
        }, n.prototype.eqn = function(c) {
            return this.cmpn(c) === 0;
        }, n.prototype.eq = function(c) {
            return this.cmp(c) === 0;
        }, n.red = function(c) {
            return new Ee(c);
        }, n.prototype.toRed = function(c) {
            return r(!this.red, "Already a number in reduction context"), r(this.negative === 0, "red works only with positives"), c.convertTo(this)._forceRed(c);
        }, n.prototype.fromRed = function() {
            return r(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
        }, n.prototype._forceRed = function(c) {
            return this.red = c, this;
        }, n.prototype.forceRed = function(c) {
            return r(!this.red, "Already a number in reduction context"), this._forceRed(c);
        }, n.prototype.redAdd = function(c) {
            return r(this.red, "redAdd works only with red numbers"), this.red.add(this, c);
        }, n.prototype.redIAdd = function(c) {
            return r(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, c);
        }, n.prototype.redSub = function(c) {
            return r(this.red, "redSub works only with red numbers"), this.red.sub(this, c);
        }, n.prototype.redISub = function(c) {
            return r(this.red, "redISub works only with red numbers"), this.red.isub(this, c);
        }, n.prototype.redShl = function(c) {
            return r(this.red, "redShl works only with red numbers"), this.red.shl(this, c);
        }, n.prototype.redMul = function(c) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, c), this.red.mul(this, c);
        }, n.prototype.redIMul = function(c) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, c), this.red.imul(this, c);
        }, n.prototype.redSqr = function() {
            return r(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
        }, n.prototype.redISqr = function() {
            return r(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
        }, n.prototype.redSqrt = function() {
            return r(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
        }, n.prototype.redInvm = function() {
            return r(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
        }, n.prototype.redNeg = function() {
            return r(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
        }, n.prototype.redPow = function(c) {
            return r(this.red && !c.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, c);
        };
        var z = {
            k256: null,
            p224: null,
            p192: null,
            p25519: null
        };
        function Ae(E, c) {
            this.name = E, this.p = new n(c, 16), this.n = this.p.bitLength(), this.k = new n(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
        }
        Ae.prototype._tmp = function() {
            var c = new n(null);
            return c.words = new Array(Math.ceil(this.n / 13)), c;
        }, Ae.prototype.ireduce = function(c) {
            var m = c, l;
            do this.split(m, this.tmp), m = this.imulK(m), m = m.iadd(this.tmp), l = m.bitLength();
            while (l > this.n);
            var a = l < this.n ? -1 : m.ucmp(this.p);
            return a === 0 ? (m.words[0] = 0, m.length = 1) : a > 0 ? m.isub(this.p) : m.strip !== void 0 ? m.strip() : m._strip(), m;
        }, Ae.prototype.split = function(c, m) {
            c.iushrn(this.n, 0, m);
        }, Ae.prototype.imulK = function(c) {
            return c.imul(this.k);
        };
        function qe() {
            Ae.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
        }
        i(qe, Ae), qe.prototype.split = function(c, m) {
            for(var l = 4194303, a = Math.min(c.length, 9), h = 0; h < a; h++)m.words[h] = c.words[h];
            if (m.length = a, c.length <= 9) {
                c.words[0] = 0, c.length = 1;
                return;
            }
            var p = c.words[9];
            for(m.words[m.length++] = p & l, h = 10; h < c.length; h++){
                var y = c.words[h] | 0;
                c.words[h - 10] = (y & l) << 4 | p >>> 22, p = y;
            }
            p >>>= 22, c.words[h - 10] = p, p === 0 && c.length > 10 ? c.length -= 10 : c.length -= 9;
        }, qe.prototype.imulK = function(c) {
            c.words[c.length] = 0, c.words[c.length + 1] = 0, c.length += 2;
            for(var m = 0, l = 0; l < c.length; l++){
                var a = c.words[l] | 0;
                m += a * 977, c.words[l] = m & 67108863, m = a * 64 + (m / 67108864 | 0);
            }
            return c.words[c.length - 1] === 0 && (c.length--, c.words[c.length - 1] === 0 && c.length--), c;
        };
        function Pe() {
            Ae.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
        }
        i(Pe, Ae);
        function Re() {
            Ae.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
        }
        i(Re, Ae);
        function Ue() {
            Ae.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
        }
        i(Ue, Ae), Ue.prototype.imulK = function(c) {
            for(var m = 0, l = 0; l < c.length; l++){
                var a = (c.words[l] | 0) * 19 + m, h = a & 67108863;
                a >>>= 26, c.words[l] = h, m = a;
            }
            return m !== 0 && (c.words[c.length++] = m), c;
        }, n._prime = function(c) {
            if (z[c]) return z[c];
            var m;
            if (c === "k256") m = new qe;
            else if (c === "p224") m = new Pe;
            else if (c === "p192") m = new Re;
            else if (c === "p25519") m = new Ue;
            else throw new Error("Unknown prime " + c);
            return z[c] = m, m;
        };
        function Ee(E) {
            if (typeof E == "string") {
                var c = n._prime(E);
                this.m = c.p, this.prime = c;
            } else r(E.gtn(1), "modulus must be greater than 1"), this.m = E, this.prime = null;
        }
        Ee.prototype._verify1 = function(c) {
            r(c.negative === 0, "red works only with positives"), r(c.red, "red works only with red numbers");
        }, Ee.prototype._verify2 = function(c, m) {
            r((c.negative | m.negative) === 0, "red works only with positives"), r(c.red && c.red === m.red, "red works only with red numbers");
        }, Ee.prototype.imod = function(c) {
            return this.prime ? this.prime.ireduce(c)._forceRed(this) : c.umod(this.m)._forceRed(this);
        }, Ee.prototype.neg = function(c) {
            return c.isZero() ? c.clone() : this.m.sub(c)._forceRed(this);
        }, Ee.prototype.add = function(c, m) {
            this._verify2(c, m);
            var l = c.add(m);
            return l.cmp(this.m) >= 0 && l.isub(this.m), l._forceRed(this);
        }, Ee.prototype.iadd = function(c, m) {
            this._verify2(c, m);
            var l = c.iadd(m);
            return l.cmp(this.m) >= 0 && l.isub(this.m), l;
        }, Ee.prototype.sub = function(c, m) {
            this._verify2(c, m);
            var l = c.sub(m);
            return l.cmpn(0) < 0 && l.iadd(this.m), l._forceRed(this);
        }, Ee.prototype.isub = function(c, m) {
            this._verify2(c, m);
            var l = c.isub(m);
            return l.cmpn(0) < 0 && l.iadd(this.m), l;
        }, Ee.prototype.shl = function(c, m) {
            return this._verify1(c), this.imod(c.ushln(m));
        }, Ee.prototype.imul = function(c, m) {
            return this._verify2(c, m), this.imod(c.imul(m));
        }, Ee.prototype.mul = function(c, m) {
            return this._verify2(c, m), this.imod(c.mul(m));
        }, Ee.prototype.isqr = function(c) {
            return this.imul(c, c.clone());
        }, Ee.prototype.sqr = function(c) {
            return this.mul(c, c);
        }, Ee.prototype.sqrt = function(c) {
            if (c.isZero()) return c.clone();
            var m = this.m.andln(3);
            if (r(m % 2 === 1), m === 3) {
                var l = this.m.add(new n(1)).iushrn(2);
                return this.pow(c, l);
            }
            for(var a = this.m.subn(1), h = 0; !a.isZero() && a.andln(1) === 0;)h++, a.iushrn(1);
            r(!a.isZero());
            var p = new n(1).toRed(this), y = p.redNeg(), b = this.m.subn(1).iushrn(1), s = this.m.bitLength();
            for(s = new n(2 * s * s).toRed(this); this.pow(s, b).cmp(y) !== 0;)s.redIAdd(y);
            for(var g = this.pow(s, a), w = this.pow(c, a.addn(1).iushrn(1)), d = this.pow(c, a), M = h; d.cmp(p) !== 0;){
                for(var k = d, T = 0; k.cmp(p) !== 0; T++)k = k.redSqr();
                r(T < M);
                var C = this.pow(g, new n(1).iushln(M - T - 1));
                w = w.redMul(C), g = C.redSqr(), d = d.redMul(g), M = T;
            }
            return w;
        }, Ee.prototype.invm = function(c) {
            var m = c._invmp(this.m);
            return m.negative !== 0 ? (m.negative = 0, this.imod(m).redNeg()) : this.imod(m);
        }, Ee.prototype.pow = function(c, m) {
            if (m.isZero()) return new n(1).toRed(this);
            if (m.cmpn(1) === 0) return c.clone();
            var l = 4, a = new Array(1 << l);
            a[0] = new n(1).toRed(this), a[1] = c;
            for(var h = 2; h < a.length; h++)a[h] = this.mul(a[h - 1], c);
            var p = a[0], y = 0, b = 0, s = m.bitLength() % 26;
            for(s === 0 && (s = 26), h = m.length - 1; h >= 0; h--){
                for(var g = m.words[h], w = s - 1; w >= 0; w--){
                    var d = g >> w & 1;
                    if (p !== a[0] && (p = this.sqr(p)), d === 0 && y === 0) {
                        b = 0;
                        continue;
                    }
                    y <<= 1, y |= d, b++, !(b !== l && (h !== 0 || w !== 0)) && (p = this.mul(p, a[y]), b = 0, y = 0);
                }
                s = 26;
            }
            return p;
        }, Ee.prototype.convertTo = function(c) {
            var m = c.umod(this.m);
            return m === c ? m.clone() : m;
        }, Ee.prototype.convertFrom = function(c) {
            var m = c.clone();
            return m.red = null, m;
        }, n.mont = function(c) {
            return new Fe(c);
        };
        function Fe(E) {
            Ee.call(this, E), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new n(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
        }
        i(Fe, Ee), Fe.prototype.convertTo = function(c) {
            return this.imod(c.ushln(this.shift));
        }, Fe.prototype.convertFrom = function(c) {
            var m = this.imod(c.mul(this.rinv));
            return m.red = null, m;
        }, Fe.prototype.imul = function(c, m) {
            if (c.isZero() || m.isZero()) return c.words[0] = 0, c.length = 1, c;
            var l = c.imul(m), a = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), h = l.isub(a).iushrn(this.shift), p = h;
            return h.cmp(this.m) >= 0 ? p = h.isub(this.m) : h.cmpn(0) < 0 && (p = h.iadd(this.m)), p._forceRed(this);
        }, Fe.prototype.mul = function(c, m) {
            if (c.isZero() || m.isZero()) return new n(0)._forceRed(this);
            var l = c.mul(m), a = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), h = l.isub(a).iushrn(this.shift), p = h;
            return h.cmp(this.m) >= 0 ? p = h.isub(this.m) : h.cmpn(0) < 0 && (p = h.iadd(this.m)), p._forceRed(this);
        }, Fe.prototype.invm = function(c) {
            var m = this.imod(c._invmp(this.m).mul(this.r2));
            return m._forceRed(this);
        };
    })(typeof Ao > "u" || Ao, Md);
});
var Sd = q(()=>{});
var pa = q((Fy, Ro)=>{
    var Bo;
    Ro.exports = function(e) {
        return Bo || (Bo = new Er(null)), Bo.generate(e);
    };
    function Er(t) {
        this.rand = t;
    }
    Ro.exports.Rand = Er;
    Er.prototype.generate = function(e) {
        return this._rand(e);
    };
    Er.prototype._rand = function(e) {
        if (this.rand.getBytes) return this.rand.getBytes(e);
        for(var r = new Uint8Array(e), i = 0; i < r.length; i++)r[i] = this.rand.getByte();
        return r;
    };
    if (typeof self == "object") self.crypto && self.crypto.getRandomValues ? Er.prototype._rand = function(e) {
        var r = new Uint8Array(e);
        return self.crypto.getRandomValues(r), r;
    } : self.msCrypto && self.msCrypto.getRandomValues ? Er.prototype._rand = function(e) {
        var r = new Uint8Array(e);
        return self.msCrypto.getRandomValues(r), r;
    } : typeof window == "object" && (Er.prototype._rand = function() {
        throw new Error("Not implemented yet");
    });
    else try {
        if (qo = Sd(), typeof qo.randomBytes != "function") throw new Error("Not supported");
        Er.prototype._rand = function(e) {
            return qo.randomBytes(e);
        };
    } catch (t) {}
    var qo;
});
var Io = q((Uy, Ed)=>{
    var ui = je(), n4 = pa();
    function di(t) {
        this.rand = t || new n4.Rand;
    }
    Ed.exports = di;
    di.create = function(e) {
        return new di(e);
    };
    di.prototype._randbelow = function(e) {
        var r = e.bitLength(), i = Math.ceil(r / 8);
        do var n = new ui(this.rand.generate(i));
        while (n.cmp(e) >= 0);
        return n;
    };
    di.prototype._randrange = function(e, r) {
        var i = r.sub(e);
        return e.add(this._randbelow(i));
    };
    di.prototype.test = function(e, r, i) {
        var n = e.bitLength(), f = ui.mont(e), o = new ui(1).toRed(f);
        r || (r = Math.max(1, n / 48 | 0));
        for(var u = e.subn(1), v = 0; !u.testn(v); v++);
        for(var _ = e.shrn(v), x = u.toRed(f), S = !0; r > 0; r--){
            var A = this._randrange(new ui(2), u);
            i && i(A);
            var B = A.toRed(f).redPow(_);
            if (!(B.cmp(o) === 0 || B.cmp(x) === 0)) {
                for(var I = 1; I < v; I++){
                    if (B = B.redSqr(), B.cmp(o) === 0) return !1;
                    if (B.cmp(x) === 0) break;
                }
                if (I === v) return !1;
            }
        }
        return S;
    };
    di.prototype.getDivisor = function(e, r) {
        var i = e.bitLength(), n = ui.mont(e), f = new ui(1).toRed(n);
        r || (r = Math.max(1, i / 48 | 0));
        for(var o = e.subn(1), u = 0; !o.testn(u); u++);
        for(var v = e.shrn(u), _ = o.toRed(n); r > 0; r--){
            var x = this._randrange(new ui(2), o), S = e.gcd(x);
            if (S.cmpn(1) !== 0) return S;
            var A = x.toRed(n).redPow(v);
            if (!(A.cmp(f) === 0 || A.cmp(_) === 0)) {
                for(var B = 1; B < u; B++){
                    if (A = A.redSqr(), A.cmp(f) === 0) return A.fromRed().subn(1).gcd(e);
                    if (A.cmp(_) === 0) break;
                }
                if (B === u) return A = A.redSqr(), A.fromRed().subn(1).gcd(e);
            }
        }
        return !1;
    };
});
var Lo = q((Wy, qd)=>{
    var f4 = Jr();
    qd.exports = Do;
    Do.simpleSieve = To;
    Do.fermatTest = Po;
    var Xe = je(), a4 = new Xe(24), o4 = Io(), Ad = new o4, s4 = new Xe(1), Co = new Xe(2), h4 = new Xe(5), zy = new Xe(16), Hy = new Xe(8), c4 = new Xe(10), u4 = new Xe(3), jy = new Xe(7), d4 = new Xe(11), Bd = new Xe(4), Ky = new Xe(12), ko = null;
    function l4() {
        if (ko !== null) return ko;
        var t = 1048576, e = [];
        e[0] = 2;
        for(var r = 1, i = 3; i < t; i += 2){
            for(var n = Math.ceil(Math.sqrt(i)), f = 0; f < r && e[f] <= n && i % e[f] !== 0; f++);
            r !== f && e[f] <= n || (e[r++] = i);
        }
        return ko = e, e;
    }
    function To(t) {
        for(var e = l4(), r = 0; r < e.length; r++)if (t.modn(e[r]) === 0) return t.cmpn(e[r]) === 0;
        return !0;
    }
    function Po(t) {
        var e = Xe.mont(t);
        return Co.toRed(e).redPow(t.subn(1)).fromRed().cmpn(1) === 0;
    }
    function Do(t, e) {
        if (t < 16) return e === 2 || e === 5 ? new Xe([
            140,
            123
        ]) : new Xe([
            140,
            39
        ]);
        e = new Xe(e);
        for(var r, i;;){
            for(r = new Xe(f4(Math.ceil(t / 8))); r.bitLength() > t;)r.ishrn(1);
            if (r.isEven() && r.iadd(s4), r.testn(1) || r.iadd(Co), e.cmp(Co)) {
                if (!e.cmp(h4)) for(; r.mod(c4).cmp(u4);)r.iadd(Bd);
            } else for(; r.mod(a4).cmp(d4);)r.iadd(Bd);
            if (i = r.shrn(1), To(i) && To(r) && Po(i) && Po(r) && Ad.test(i) && Ad.test(r)) return r;
        }
    }
});
var Rd = q((Vy, p4)=>{
    p4.exports = {
        modp1: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
        },
        modp2: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
        },
        modp5: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
        },
        modp14: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
        },
        modp15: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
        },
        modp16: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
        },
        modp17: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
        },
        modp18: {
            gen: "02",
            prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
        }
    };
});
var Td = q((Gy, Cd)=>{
    var wt = je(), b4 = Io(), Id = new b4, v4 = new wt(24), y4 = new wt(11), m4 = new wt(10), g4 = new wt(3), _4 = new wt(7), kd = Lo(), w4 = Jr();
    Cd.exports = cr;
    function x4(t, e) {
        return e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e)), this._pub = new wt(t), this;
    }
    function M4(t, e) {
        return e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e)), this._priv = new wt(t), this;
    }
    var ba = {};
    function S4(t, e) {
        var r = e.toString("hex"), i = [
            r,
            t.toString(16)
        ].join("_");
        if (i in ba) return ba[i];
        var n = 0;
        if (t.isEven() || !kd.simpleSieve || !kd.fermatTest(t) || !Id.test(t)) return n += 1, r === "02" || r === "05" ? n += 8 : n += 4, ba[i] = n, n;
        Id.test(t.shrn(1)) || (n += 2);
        var f;
        switch(r){
            case "02":
                t.mod(v4).cmp(y4) && (n += 8);
                break;
            case "05":
                f = t.mod(m4), f.cmp(g4) && f.cmp(_4) && (n += 8);
                break;
            default:
                n += 4;
        }
        return ba[i] = n, n;
    }
    function cr(t, e, r) {
        this.setGenerator(e), this.__prime = new wt(t), this._prime = wt.mont(this.__prime), this._primeLen = t.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = x4, this.setPrivateKey = M4) : this._primeCode = 8;
    }
    Object.defineProperty(cr.prototype, "verifyError", {
        enumerable: !0,
        get: function() {
            return typeof this._primeCode != "number" && (this._primeCode = S4(this.__prime, this.__gen)), this._primeCode;
        }
    });
    cr.prototype.generateKeys = function() {
        return this._priv || (this._priv = new wt(w4(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
    };
    cr.prototype.computeSecret = function(t) {
        t = new wt(t), t = t.toRed(this._prime);
        var e = t.redPow(this._priv).fromRed(), r = new Buffer(e.toArray()), i = this.getPrime();
        if (r.length < i.length) {
            var n = new Buffer(i.length - r.length);
            n.fill(0), r = Buffer.concat([
                n,
                r
            ]);
        }
        return r;
    };
    cr.prototype.getPublicKey = function(e) {
        return va(this._pub, e);
    };
    cr.prototype.getPrivateKey = function(e) {
        return va(this._priv, e);
    };
    cr.prototype.getPrime = function(t) {
        return va(this.__prime, t);
    };
    cr.prototype.getGenerator = function(t) {
        return va(this._gen, t);
    };
    cr.prototype.setGenerator = function(t, e) {
        return e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e)), this.__gen = t, this._gen = new wt(t), this;
    };
    function va(t, e) {
        var r = new Buffer(t.toArray());
        return e ? r.toString(e) : r;
    }
});
var Ld = q((Ui)=>{
    var E4 = Lo(), Pd = Rd(), No = Td();
    function A4(t) {
        var e = new Buffer(Pd[t].prime, "hex"), r = new Buffer(Pd[t].gen, "hex");
        return new No(e, r);
    }
    var B4 = {
        binary: !0,
        hex: !0,
        base64: !0
    };
    function Dd(t, e, r, i) {
        return Buffer.isBuffer(e) || B4[e] === void 0 ? Dd(t, "binary", e, r) : (e = e || "binary", i = i || "binary", r = r || new Buffer([
            2
        ]), Buffer.isBuffer(r) || (r = new Buffer(r, i)), typeof t == "number" ? new No(E4(t, r), r, !0) : (Buffer.isBuffer(t) || (t = new Buffer(t, e)), new No(t, r, !0)));
    }
    Ui.DiffieHellmanGroup = Ui.createDiffieHellmanGroup = Ui.getDiffieHellman = A4;
    Ui.createDiffieHellman = Ui.DiffieHellman = Dd;
});
var ya = q((Nd, Oo)=>{
    (function(t, e) {
        "use strict";
        function r(l, a) {
            if (!l) throw new Error(a || "Assertion failed");
        }
        function i(l, a) {
            l.super_ = a;
            var h = function() {};
            h.prototype = a.prototype, l.prototype = new h, l.prototype.constructor = l;
        }
        function n(l, a, h) {
            if (n.isBN(l)) return l;
            this.negative = 0, this.words = null, this.length = 0, this.red = null, l !== null && ((a === "le" || a === "be") && (h = a, a = 10), this._init(l || 0, a || 10, h || "be"));
        }
        typeof t == "object" ? t.exports = n : e.BN = n, n.BN = n, n.wordSize = 26;
        var f;
        try {
            typeof window < "u" && typeof window.Buffer < "u" ? f = window.Buffer : f = Eo().Buffer;
        } catch (l) {}
        n.isBN = function(a) {
            return a instanceof n ? !0 : a !== null && typeof a == "object" && a.constructor.wordSize === n.wordSize && Array.isArray(a.words);
        }, n.max = function(a, h) {
            return a.cmp(h) > 0 ? a : h;
        }, n.min = function(a, h) {
            return a.cmp(h) < 0 ? a : h;
        }, n.prototype._init = function(a, h, p) {
            if (typeof a == "number") return this._initNumber(a, h, p);
            if (typeof a == "object") return this._initArray(a, h, p);
            h === "hex" && (h = 16), r(h === (h | 0) && h >= 2 && h <= 36), a = a.toString().replace(/\s+/g, "");
            var y = 0;
            a[0] === "-" && (y++, this.negative = 1), y < a.length && (h === 16 ? this._parseHex(a, y, p) : (this._parseBase(a, h, y), p === "le" && this._initArray(this.toArray(), h, p)));
        }, n.prototype._initNumber = function(a, h, p) {
            a < 0 && (this.negative = 1, a = -a), a < 67108864 ? (this.words = [
                a & 67108863
            ], this.length = 1) : a < 4503599627370496 ? (this.words = [
                a & 67108863,
                a / 67108864 & 67108863
            ], this.length = 2) : (r(a < 9007199254740992), this.words = [
                a & 67108863,
                a / 67108864 & 67108863,
                1
            ], this.length = 3), p === "le" && this._initArray(this.toArray(), h, p);
        }, n.prototype._initArray = function(a, h, p) {
            if (r(typeof a.length == "number"), a.length <= 0) return this.words = [
                0
            ], this.length = 1, this;
            this.length = Math.ceil(a.length / 3), this.words = new Array(this.length);
            for(var y = 0; y < this.length; y++)this.words[y] = 0;
            var b, s, g = 0;
            if (p === "be") for(y = a.length - 1, b = 0; y >= 0; y -= 3)s = a[y] | a[y - 1] << 8 | a[y - 2] << 16, this.words[b] |= s << g & 67108863, this.words[b + 1] = s >>> 26 - g & 67108863, g += 24, g >= 26 && (g -= 26, b++);
            else if (p === "le") for(y = 0, b = 0; y < a.length; y += 3)s = a[y] | a[y + 1] << 8 | a[y + 2] << 16, this.words[b] |= s << g & 67108863, this.words[b + 1] = s >>> 26 - g & 67108863, g += 24, g >= 26 && (g -= 26, b++);
            return this._strip();
        };
        function o(l, a) {
            var h = l.charCodeAt(a);
            if (h >= 48 && h <= 57) return h - 48;
            if (h >= 65 && h <= 70) return h - 55;
            if (h >= 97 && h <= 102) return h - 87;
            r(!1, "Invalid character in " + l);
        }
        function u(l, a, h) {
            var p = o(l, h);
            return h - 1 >= a && (p |= o(l, h - 1) << 4), p;
        }
        n.prototype._parseHex = function(a, h, p) {
            this.length = Math.ceil((a.length - h) / 6), this.words = new Array(this.length);
            for(var y = 0; y < this.length; y++)this.words[y] = 0;
            var b = 0, s = 0, g;
            if (p === "be") for(y = a.length - 1; y >= h; y -= 2)g = u(a, h, y) << b, this.words[s] |= g & 67108863, b >= 18 ? (b -= 18, s += 1, this.words[s] |= g >>> 26) : b += 8;
            else {
                var w = a.length - h;
                for(y = w % 2 === 0 ? h + 1 : h; y < a.length; y += 2)g = u(a, h, y) << b, this.words[s] |= g & 67108863, b >= 18 ? (b -= 18, s += 1, this.words[s] |= g >>> 26) : b += 8;
            }
            this._strip();
        };
        function v(l, a, h, p) {
            for(var y = 0, b = 0, s = Math.min(l.length, h), g = a; g < s; g++){
                var w = l.charCodeAt(g) - 48;
                y *= p, w >= 49 ? b = w - 49 + 10 : w >= 17 ? b = w - 17 + 10 : b = w, r(w >= 0 && b < p, "Invalid character"), y += b;
            }
            return y;
        }
        n.prototype._parseBase = function(a, h, p) {
            this.words = [
                0
            ], this.length = 1;
            for(var y = 0, b = 1; b <= 67108863; b *= h)y++;
            y--, b = b / h | 0;
            for(var s = a.length - p, g = s % y, w = Math.min(s, s - g) + p, d = 0, M = p; M < w; M += y)d = v(a, M, M + y, h), this.imuln(b), this.words[0] + d < 67108864 ? this.words[0] += d : this._iaddn(d);
            if (g !== 0) {
                var k = 1;
                for(d = v(a, M, a.length, h), M = 0; M < g; M++)k *= h;
                this.imuln(k), this.words[0] + d < 67108864 ? this.words[0] += d : this._iaddn(d);
            }
            this._strip();
        }, n.prototype.copy = function(a) {
            a.words = new Array(this.length);
            for(var h = 0; h < this.length; h++)a.words[h] = this.words[h];
            a.length = this.length, a.negative = this.negative, a.red = this.red;
        };
        function _(l, a) {
            l.words = a.words, l.length = a.length, l.negative = a.negative, l.red = a.red;
        }
        if (n.prototype._move = function(a) {
            _(a, this);
        }, n.prototype.clone = function() {
            var a = new n(null);
            return this.copy(a), a;
        }, n.prototype._expand = function(a) {
            for(; this.length < a;)this.words[this.length++] = 0;
            return this;
        }, n.prototype._strip = function() {
            for(; this.length > 1 && this.words[this.length - 1] === 0;)this.length--;
            return this._normSign();
        }, n.prototype._normSign = function() {
            return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
        }, typeof Symbol < "u" && typeof Symbol.for == "function") try {
            n.prototype[Symbol.for("nodejs.util.inspect.custom")] = x;
        } catch (l) {
            n.prototype.inspect = x;
        }
        else n.prototype.inspect = x;
        function x() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        }
        var S = [
            "",
            "0",
            "00",
            "000",
            "0000",
            "00000",
            "000000",
            "0000000",
            "00000000",
            "000000000",
            "0000000000",
            "00000000000",
            "000000000000",
            "0000000000000",
            "00000000000000",
            "000000000000000",
            "0000000000000000",
            "00000000000000000",
            "000000000000000000",
            "0000000000000000000",
            "00000000000000000000",
            "000000000000000000000",
            "0000000000000000000000",
            "00000000000000000000000",
            "000000000000000000000000",
            "0000000000000000000000000"
        ], A = [
            0,
            0,
            25,
            16,
            12,
            11,
            10,
            9,
            8,
            8,
            7,
            7,
            7,
            7,
            6,
            6,
            6,
            6,
            6,
            6,
            6,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5
        ], B = [
            0,
            0,
            33554432,
            43046721,
            16777216,
            48828125,
            60466176,
            40353607,
            16777216,
            43046721,
            1e7,
            19487171,
            35831808,
            62748517,
            7529536,
            11390625,
            16777216,
            24137569,
            34012224,
            47045881,
            64e6,
            4084101,
            5153632,
            6436343,
            7962624,
            9765625,
            11881376,
            14348907,
            17210368,
            20511149,
            243e5,
            28629151,
            33554432,
            39135393,
            45435424,
            52521875,
            60466176
        ];
        n.prototype.toString = function(a, h) {
            a = a || 10, h = h | 0 || 1;
            var p;
            if (a === 16 || a === "hex") {
                p = "";
                for(var y = 0, b = 0, s = 0; s < this.length; s++){
                    var g = this.words[s], w = ((g << y | b) & 16777215).toString(16);
                    b = g >>> 24 - y & 16777215, y += 2, y >= 26 && (y -= 26, s--), b !== 0 || s !== this.length - 1 ? p = S[6 - w.length] + w + p : p = w + p;
                }
                for(b !== 0 && (p = b.toString(16) + p); p.length % h !== 0;)p = "0" + p;
                return this.negative !== 0 && (p = "-" + p), p;
            }
            if (a === (a | 0) && a >= 2 && a <= 36) {
                var d = A[a], M = B[a];
                p = "";
                var k = this.clone();
                for(k.negative = 0; !k.isZero();){
                    var T = k.modrn(M).toString(a);
                    k = k.idivn(M), k.isZero() ? p = T + p : p = S[d - T.length] + T + p;
                }
                for(this.isZero() && (p = "0" + p); p.length % h !== 0;)p = "0" + p;
                return this.negative !== 0 && (p = "-" + p), p;
            }
            r(!1, "Base should be between 2 and 36");
        }, n.prototype.toNumber = function() {
            var a = this.words[0];
            return this.length === 2 ? a += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? a += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -a : a;
        }, n.prototype.toJSON = function() {
            return this.toString(16, 2);
        }, f && (n.prototype.toBuffer = function(a, h) {
            return this.toArrayLike(f, a, h);
        }), n.prototype.toArray = function(a, h) {
            return this.toArrayLike(Array, a, h);
        };
        var I = function(a, h) {
            return a.allocUnsafe ? a.allocUnsafe(h) : new a(h);
        };
        n.prototype.toArrayLike = function(a, h, p) {
            this._strip();
            var y = this.byteLength(), b = p || Math.max(1, y);
            r(y <= b, "byte array longer than desired length"), r(b > 0, "Requested array length <= 0");
            var s = I(a, b), g = h === "le" ? "LE" : "BE";
            return this["_toArrayLike" + g](s, y), s;
        }, n.prototype._toArrayLikeLE = function(a, h) {
            for(var p = 0, y = 0, b = 0, s = 0; b < this.length; b++){
                var g = this.words[b] << s | y;
                a[p++] = g & 255, p < a.length && (a[p++] = g >> 8 & 255), p < a.length && (a[p++] = g >> 16 & 255), s === 6 ? (p < a.length && (a[p++] = g >> 24 & 255), y = 0, s = 0) : (y = g >>> 24, s += 2);
            }
            if (p < a.length) for(a[p++] = y; p < a.length;)a[p++] = 0;
        }, n.prototype._toArrayLikeBE = function(a, h) {
            for(var p = a.length - 1, y = 0, b = 0, s = 0; b < this.length; b++){
                var g = this.words[b] << s | y;
                a[p--] = g & 255, p >= 0 && (a[p--] = g >> 8 & 255), p >= 0 && (a[p--] = g >> 16 & 255), s === 6 ? (p >= 0 && (a[p--] = g >> 24 & 255), y = 0, s = 0) : (y = g >>> 24, s += 2);
            }
            if (p >= 0) for(a[p--] = y; p >= 0;)a[p--] = 0;
        }, Math.clz32 ? n.prototype._countBits = function(a) {
            return 32 - Math.clz32(a);
        } : n.prototype._countBits = function(a) {
            var h = a, p = 0;
            return h >= 4096 && (p += 13, h >>>= 13), h >= 64 && (p += 7, h >>>= 7), h >= 8 && (p += 4, h >>>= 4), h >= 2 && (p += 2, h >>>= 2), p + h;
        }, n.prototype._zeroBits = function(a) {
            if (a === 0) return 26;
            var h = a, p = 0;
            return h & 8191 || (p += 13, h >>>= 13), h & 127 || (p += 7, h >>>= 7), h & 15 || (p += 4, h >>>= 4), h & 3 || (p += 2, h >>>= 2), h & 1 || p++, p;
        }, n.prototype.bitLength = function() {
            var a = this.words[this.length - 1], h = this._countBits(a);
            return (this.length - 1) * 26 + h;
        };
        function P(l) {
            for(var a = new Array(l.bitLength()), h = 0; h < a.length; h++){
                var p = h / 26 | 0, y = h % 26;
                a[h] = l.words[p] >>> y & 1;
            }
            return a;
        }
        n.prototype.zeroBits = function() {
            if (this.isZero()) return 0;
            for(var a = 0, h = 0; h < this.length; h++){
                var p = this._zeroBits(this.words[h]);
                if (a += p, p !== 26) break;
            }
            return a;
        }, n.prototype.byteLength = function() {
            return Math.ceil(this.bitLength() / 8);
        }, n.prototype.toTwos = function(a) {
            return this.negative !== 0 ? this.abs().inotn(a).iaddn(1) : this.clone();
        }, n.prototype.fromTwos = function(a) {
            return this.testn(a - 1) ? this.notn(a).iaddn(1).ineg() : this.clone();
        }, n.prototype.isNeg = function() {
            return this.negative !== 0;
        }, n.prototype.neg = function() {
            return this.clone().ineg();
        }, n.prototype.ineg = function() {
            return this.isZero() || (this.negative ^= 1), this;
        }, n.prototype.iuor = function(a) {
            for(; this.length < a.length;)this.words[this.length++] = 0;
            for(var h = 0; h < a.length; h++)this.words[h] = this.words[h] | a.words[h];
            return this._strip();
        }, n.prototype.ior = function(a) {
            return r((this.negative | a.negative) === 0), this.iuor(a);
        }, n.prototype.or = function(a) {
            return this.length > a.length ? this.clone().ior(a) : a.clone().ior(this);
        }, n.prototype.uor = function(a) {
            return this.length > a.length ? this.clone().iuor(a) : a.clone().iuor(this);
        }, n.prototype.iuand = function(a) {
            var h;
            this.length > a.length ? h = a : h = this;
            for(var p = 0; p < h.length; p++)this.words[p] = this.words[p] & a.words[p];
            return this.length = h.length, this._strip();
        }, n.prototype.iand = function(a) {
            return r((this.negative | a.negative) === 0), this.iuand(a);
        }, n.prototype.and = function(a) {
            return this.length > a.length ? this.clone().iand(a) : a.clone().iand(this);
        }, n.prototype.uand = function(a) {
            return this.length > a.length ? this.clone().iuand(a) : a.clone().iuand(this);
        }, n.prototype.iuxor = function(a) {
            var h, p;
            this.length > a.length ? (h = this, p = a) : (h = a, p = this);
            for(var y = 0; y < p.length; y++)this.words[y] = h.words[y] ^ p.words[y];
            if (this !== h) for(; y < h.length; y++)this.words[y] = h.words[y];
            return this.length = h.length, this._strip();
        }, n.prototype.ixor = function(a) {
            return r((this.negative | a.negative) === 0), this.iuxor(a);
        }, n.prototype.xor = function(a) {
            return this.length > a.length ? this.clone().ixor(a) : a.clone().ixor(this);
        }, n.prototype.uxor = function(a) {
            return this.length > a.length ? this.clone().iuxor(a) : a.clone().iuxor(this);
        }, n.prototype.inotn = function(a) {
            r(typeof a == "number" && a >= 0);
            var h = Math.ceil(a / 26) | 0, p = a % 26;
            this._expand(h), p > 0 && h--;
            for(var y = 0; y < h; y++)this.words[y] = ~this.words[y] & 67108863;
            return p > 0 && (this.words[y] = ~this.words[y] & 67108863 >> 26 - p), this._strip();
        }, n.prototype.notn = function(a) {
            return this.clone().inotn(a);
        }, n.prototype.setn = function(a, h) {
            r(typeof a == "number" && a >= 0);
            var p = a / 26 | 0, y = a % 26;
            return this._expand(p + 1), h ? this.words[p] = this.words[p] | 1 << y : this.words[p] = this.words[p] & ~(1 << y), this._strip();
        }, n.prototype.iadd = function(a) {
            var h;
            if (this.negative !== 0 && a.negative === 0) return this.negative = 0, h = this.isub(a), this.negative ^= 1, this._normSign();
            if (this.negative === 0 && a.negative !== 0) return a.negative = 0, h = this.isub(a), a.negative = 1, h._normSign();
            var p, y;
            this.length > a.length ? (p = this, y = a) : (p = a, y = this);
            for(var b = 0, s = 0; s < y.length; s++)h = (p.words[s] | 0) + (y.words[s] | 0) + b, this.words[s] = h & 67108863, b = h >>> 26;
            for(; b !== 0 && s < p.length; s++)h = (p.words[s] | 0) + b, this.words[s] = h & 67108863, b = h >>> 26;
            if (this.length = p.length, b !== 0) this.words[this.length] = b, this.length++;
            else if (p !== this) for(; s < p.length; s++)this.words[s] = p.words[s];
            return this;
        }, n.prototype.add = function(a) {
            var h;
            return a.negative !== 0 && this.negative === 0 ? (a.negative = 0, h = this.sub(a), a.negative ^= 1, h) : a.negative === 0 && this.negative !== 0 ? (this.negative = 0, h = a.sub(this), this.negative = 1, h) : this.length > a.length ? this.clone().iadd(a) : a.clone().iadd(this);
        }, n.prototype.isub = function(a) {
            if (a.negative !== 0) {
                a.negative = 0;
                var h = this.iadd(a);
                return a.negative = 1, h._normSign();
            } else if (this.negative !== 0) return this.negative = 0, this.iadd(a), this.negative = 1, this._normSign();
            var p = this.cmp(a);
            if (p === 0) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
            var y, b;
            p > 0 ? (y = this, b = a) : (y = a, b = this);
            for(var s = 0, g = 0; g < b.length; g++)h = (y.words[g] | 0) - (b.words[g] | 0) + s, s = h >> 26, this.words[g] = h & 67108863;
            for(; s !== 0 && g < y.length; g++)h = (y.words[g] | 0) + s, s = h >> 26, this.words[g] = h & 67108863;
            if (s === 0 && g < y.length && y !== this) for(; g < y.length; g++)this.words[g] = y.words[g];
            return this.length = Math.max(this.length, g), y !== this && (this.negative = 1), this._strip();
        }, n.prototype.sub = function(a) {
            return this.clone().isub(a);
        };
        function F(l, a, h) {
            h.negative = a.negative ^ l.negative;
            var p = l.length + a.length | 0;
            h.length = p, p = p - 1 | 0;
            var y = l.words[0] | 0, b = a.words[0] | 0, s = y * b, g = s & 67108863, w = s / 67108864 | 0;
            h.words[0] = g;
            for(var d = 1; d < p; d++){
                for(var M = w >>> 26, k = w & 67108863, T = Math.min(d, a.length - 1), C = Math.max(0, d - l.length + 1); C <= T; C++){
                    var N = d - C | 0;
                    y = l.words[N] | 0, b = a.words[C] | 0, s = y * b + k, M += s / 67108864 | 0, k = s & 67108863;
                }
                h.words[d] = k | 0, w = M | 0;
            }
            return w !== 0 ? h.words[d] = w | 0 : h.length--, h._strip();
        }
        var D = function(a, h, p) {
            var y = a.words, b = h.words, s = p.words, g = 0, w, d, M, k = y[0] | 0, T = k & 8191, C = k >>> 13, N = y[1] | 0, L = N & 8191, O = N >>> 13, It = y[2] | 0, U = It & 8191, H = It >>> 13, hn = y[3] | 0, j = hn & 8191, K = hn >>> 13, cn = y[4] | 0, W = cn & 8191, V = cn >>> 13, un = y[5] | 0, G = un & 8191, Z = un >>> 13, dn = y[6] | 0, X = dn & 8191, Y = dn >>> 13, ln = y[7] | 0, J = ln & 8191, $ = ln >>> 13, pn = y[8] | 0, Q = pn & 8191, ee = pn >>> 13, bn = y[9] | 0, te = bn & 8191, re = bn >>> 13, vn = b[0] | 0, ie = vn & 8191, ne = vn >>> 13, yn = b[1] | 0, fe = yn & 8191, ae = yn >>> 13, mn = b[2] | 0, oe = mn & 8191, se = mn >>> 13, gn = b[3] | 0, he = gn & 8191, ce = gn >>> 13, _n = b[4] | 0, ue = _n & 8191, de = _n >>> 13, wn = b[5] | 0, le = wn & 8191, pe = wn >>> 13, xn = b[6] | 0, be = xn & 8191, ve = xn >>> 13, Mn = b[7] | 0, ye = Mn & 8191, me = Mn >>> 13, Sn = b[8] | 0, ge = Sn & 8191, _e = Sn >>> 13, Si = b[9] | 0, De = Si & 8191, Le = Si >>> 13;
            p.negative = a.negative ^ h.negative, p.length = 19, w = Math.imul(T, ie), d = Math.imul(T, ne), d = d + Math.imul(C, ie) | 0, M = Math.imul(C, ne);
            var kr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (kr >>> 26) | 0, kr &= 67108863, w = Math.imul(L, ie), d = Math.imul(L, ne), d = d + Math.imul(O, ie) | 0, M = Math.imul(O, ne), w = w + Math.imul(T, fe) | 0, d = d + Math.imul(T, ae) | 0, d = d + Math.imul(C, fe) | 0, M = M + Math.imul(C, ae) | 0;
            var Cr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Cr >>> 26) | 0, Cr &= 67108863, w = Math.imul(U, ie), d = Math.imul(U, ne), d = d + Math.imul(H, ie) | 0, M = Math.imul(H, ne), w = w + Math.imul(L, fe) | 0, d = d + Math.imul(L, ae) | 0, d = d + Math.imul(O, fe) | 0, M = M + Math.imul(O, ae) | 0, w = w + Math.imul(T, oe) | 0, d = d + Math.imul(T, se) | 0, d = d + Math.imul(C, oe) | 0, M = M + Math.imul(C, se) | 0;
            var Tr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Tr >>> 26) | 0, Tr &= 67108863, w = Math.imul(j, ie), d = Math.imul(j, ne), d = d + Math.imul(K, ie) | 0, M = Math.imul(K, ne), w = w + Math.imul(U, fe) | 0, d = d + Math.imul(U, ae) | 0, d = d + Math.imul(H, fe) | 0, M = M + Math.imul(H, ae) | 0, w = w + Math.imul(L, oe) | 0, d = d + Math.imul(L, se) | 0, d = d + Math.imul(O, oe) | 0, M = M + Math.imul(O, se) | 0, w = w + Math.imul(T, he) | 0, d = d + Math.imul(T, ce) | 0, d = d + Math.imul(C, he) | 0, M = M + Math.imul(C, ce) | 0;
            var Pr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Pr >>> 26) | 0, Pr &= 67108863, w = Math.imul(W, ie), d = Math.imul(W, ne), d = d + Math.imul(V, ie) | 0, M = Math.imul(V, ne), w = w + Math.imul(j, fe) | 0, d = d + Math.imul(j, ae) | 0, d = d + Math.imul(K, fe) | 0, M = M + Math.imul(K, ae) | 0, w = w + Math.imul(U, oe) | 0, d = d + Math.imul(U, se) | 0, d = d + Math.imul(H, oe) | 0, M = M + Math.imul(H, se) | 0, w = w + Math.imul(L, he) | 0, d = d + Math.imul(L, ce) | 0, d = d + Math.imul(O, he) | 0, M = M + Math.imul(O, ce) | 0, w = w + Math.imul(T, ue) | 0, d = d + Math.imul(T, de) | 0, d = d + Math.imul(C, ue) | 0, M = M + Math.imul(C, de) | 0;
            var Dr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Dr >>> 26) | 0, Dr &= 67108863, w = Math.imul(G, ie), d = Math.imul(G, ne), d = d + Math.imul(Z, ie) | 0, M = Math.imul(Z, ne), w = w + Math.imul(W, fe) | 0, d = d + Math.imul(W, ae) | 0, d = d + Math.imul(V, fe) | 0, M = M + Math.imul(V, ae) | 0, w = w + Math.imul(j, oe) | 0, d = d + Math.imul(j, se) | 0, d = d + Math.imul(K, oe) | 0, M = M + Math.imul(K, se) | 0, w = w + Math.imul(U, he) | 0, d = d + Math.imul(U, ce) | 0, d = d + Math.imul(H, he) | 0, M = M + Math.imul(H, ce) | 0, w = w + Math.imul(L, ue) | 0, d = d + Math.imul(L, de) | 0, d = d + Math.imul(O, ue) | 0, M = M + Math.imul(O, de) | 0, w = w + Math.imul(T, le) | 0, d = d + Math.imul(T, pe) | 0, d = d + Math.imul(C, le) | 0, M = M + Math.imul(C, pe) | 0;
            var Lr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Lr >>> 26) | 0, Lr &= 67108863, w = Math.imul(X, ie), d = Math.imul(X, ne), d = d + Math.imul(Y, ie) | 0, M = Math.imul(Y, ne), w = w + Math.imul(G, fe) | 0, d = d + Math.imul(G, ae) | 0, d = d + Math.imul(Z, fe) | 0, M = M + Math.imul(Z, ae) | 0, w = w + Math.imul(W, oe) | 0, d = d + Math.imul(W, se) | 0, d = d + Math.imul(V, oe) | 0, M = M + Math.imul(V, se) | 0, w = w + Math.imul(j, he) | 0, d = d + Math.imul(j, ce) | 0, d = d + Math.imul(K, he) | 0, M = M + Math.imul(K, ce) | 0, w = w + Math.imul(U, ue) | 0, d = d + Math.imul(U, de) | 0, d = d + Math.imul(H, ue) | 0, M = M + Math.imul(H, de) | 0, w = w + Math.imul(L, le) | 0, d = d + Math.imul(L, pe) | 0, d = d + Math.imul(O, le) | 0, M = M + Math.imul(O, pe) | 0, w = w + Math.imul(T, be) | 0, d = d + Math.imul(T, ve) | 0, d = d + Math.imul(C, be) | 0, M = M + Math.imul(C, ve) | 0;
            var Nr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Nr >>> 26) | 0, Nr &= 67108863, w = Math.imul(J, ie), d = Math.imul(J, ne), d = d + Math.imul($, ie) | 0, M = Math.imul($, ne), w = w + Math.imul(X, fe) | 0, d = d + Math.imul(X, ae) | 0, d = d + Math.imul(Y, fe) | 0, M = M + Math.imul(Y, ae) | 0, w = w + Math.imul(G, oe) | 0, d = d + Math.imul(G, se) | 0, d = d + Math.imul(Z, oe) | 0, M = M + Math.imul(Z, se) | 0, w = w + Math.imul(W, he) | 0, d = d + Math.imul(W, ce) | 0, d = d + Math.imul(V, he) | 0, M = M + Math.imul(V, ce) | 0, w = w + Math.imul(j, ue) | 0, d = d + Math.imul(j, de) | 0, d = d + Math.imul(K, ue) | 0, M = M + Math.imul(K, de) | 0, w = w + Math.imul(U, le) | 0, d = d + Math.imul(U, pe) | 0, d = d + Math.imul(H, le) | 0, M = M + Math.imul(H, pe) | 0, w = w + Math.imul(L, be) | 0, d = d + Math.imul(L, ve) | 0, d = d + Math.imul(O, be) | 0, M = M + Math.imul(O, ve) | 0, w = w + Math.imul(T, ye) | 0, d = d + Math.imul(T, me) | 0, d = d + Math.imul(C, ye) | 0, M = M + Math.imul(C, me) | 0;
            var Or = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Or >>> 26) | 0, Or &= 67108863, w = Math.imul(Q, ie), d = Math.imul(Q, ne), d = d + Math.imul(ee, ie) | 0, M = Math.imul(ee, ne), w = w + Math.imul(J, fe) | 0, d = d + Math.imul(J, ae) | 0, d = d + Math.imul($, fe) | 0, M = M + Math.imul($, ae) | 0, w = w + Math.imul(X, oe) | 0, d = d + Math.imul(X, se) | 0, d = d + Math.imul(Y, oe) | 0, M = M + Math.imul(Y, se) | 0, w = w + Math.imul(G, he) | 0, d = d + Math.imul(G, ce) | 0, d = d + Math.imul(Z, he) | 0, M = M + Math.imul(Z, ce) | 0, w = w + Math.imul(W, ue) | 0, d = d + Math.imul(W, de) | 0, d = d + Math.imul(V, ue) | 0, M = M + Math.imul(V, de) | 0, w = w + Math.imul(j, le) | 0, d = d + Math.imul(j, pe) | 0, d = d + Math.imul(K, le) | 0, M = M + Math.imul(K, pe) | 0, w = w + Math.imul(U, be) | 0, d = d + Math.imul(U, ve) | 0, d = d + Math.imul(H, be) | 0, M = M + Math.imul(H, ve) | 0, w = w + Math.imul(L, ye) | 0, d = d + Math.imul(L, me) | 0, d = d + Math.imul(O, ye) | 0, M = M + Math.imul(O, me) | 0, w = w + Math.imul(T, ge) | 0, d = d + Math.imul(T, _e) | 0, d = d + Math.imul(C, ge) | 0, M = M + Math.imul(C, _e) | 0;
            var Fr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Fr >>> 26) | 0, Fr &= 67108863, w = Math.imul(te, ie), d = Math.imul(te, ne), d = d + Math.imul(re, ie) | 0, M = Math.imul(re, ne), w = w + Math.imul(Q, fe) | 0, d = d + Math.imul(Q, ae) | 0, d = d + Math.imul(ee, fe) | 0, M = M + Math.imul(ee, ae) | 0, w = w + Math.imul(J, oe) | 0, d = d + Math.imul(J, se) | 0, d = d + Math.imul($, oe) | 0, M = M + Math.imul($, se) | 0, w = w + Math.imul(X, he) | 0, d = d + Math.imul(X, ce) | 0, d = d + Math.imul(Y, he) | 0, M = M + Math.imul(Y, ce) | 0, w = w + Math.imul(G, ue) | 0, d = d + Math.imul(G, de) | 0, d = d + Math.imul(Z, ue) | 0, M = M + Math.imul(Z, de) | 0, w = w + Math.imul(W, le) | 0, d = d + Math.imul(W, pe) | 0, d = d + Math.imul(V, le) | 0, M = M + Math.imul(V, pe) | 0, w = w + Math.imul(j, be) | 0, d = d + Math.imul(j, ve) | 0, d = d + Math.imul(K, be) | 0, M = M + Math.imul(K, ve) | 0, w = w + Math.imul(U, ye) | 0, d = d + Math.imul(U, me) | 0, d = d + Math.imul(H, ye) | 0, M = M + Math.imul(H, me) | 0, w = w + Math.imul(L, ge) | 0, d = d + Math.imul(L, _e) | 0, d = d + Math.imul(O, ge) | 0, M = M + Math.imul(O, _e) | 0, w = w + Math.imul(T, De) | 0, d = d + Math.imul(T, Le) | 0, d = d + Math.imul(C, De) | 0, M = M + Math.imul(C, Le) | 0;
            var Ur = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Ur >>> 26) | 0, Ur &= 67108863, w = Math.imul(te, fe), d = Math.imul(te, ae), d = d + Math.imul(re, fe) | 0, M = Math.imul(re, ae), w = w + Math.imul(Q, oe) | 0, d = d + Math.imul(Q, se) | 0, d = d + Math.imul(ee, oe) | 0, M = M + Math.imul(ee, se) | 0, w = w + Math.imul(J, he) | 0, d = d + Math.imul(J, ce) | 0, d = d + Math.imul($, he) | 0, M = M + Math.imul($, ce) | 0, w = w + Math.imul(X, ue) | 0, d = d + Math.imul(X, de) | 0, d = d + Math.imul(Y, ue) | 0, M = M + Math.imul(Y, de) | 0, w = w + Math.imul(G, le) | 0, d = d + Math.imul(G, pe) | 0, d = d + Math.imul(Z, le) | 0, M = M + Math.imul(Z, pe) | 0, w = w + Math.imul(W, be) | 0, d = d + Math.imul(W, ve) | 0, d = d + Math.imul(V, be) | 0, M = M + Math.imul(V, ve) | 0, w = w + Math.imul(j, ye) | 0, d = d + Math.imul(j, me) | 0, d = d + Math.imul(K, ye) | 0, M = M + Math.imul(K, me) | 0, w = w + Math.imul(U, ge) | 0, d = d + Math.imul(U, _e) | 0, d = d + Math.imul(H, ge) | 0, M = M + Math.imul(H, _e) | 0, w = w + Math.imul(L, De) | 0, d = d + Math.imul(L, Le) | 0, d = d + Math.imul(O, De) | 0, M = M + Math.imul(O, Le) | 0;
            var zr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (zr >>> 26) | 0, zr &= 67108863, w = Math.imul(te, oe), d = Math.imul(te, se), d = d + Math.imul(re, oe) | 0, M = Math.imul(re, se), w = w + Math.imul(Q, he) | 0, d = d + Math.imul(Q, ce) | 0, d = d + Math.imul(ee, he) | 0, M = M + Math.imul(ee, ce) | 0, w = w + Math.imul(J, ue) | 0, d = d + Math.imul(J, de) | 0, d = d + Math.imul($, ue) | 0, M = M + Math.imul($, de) | 0, w = w + Math.imul(X, le) | 0, d = d + Math.imul(X, pe) | 0, d = d + Math.imul(Y, le) | 0, M = M + Math.imul(Y, pe) | 0, w = w + Math.imul(G, be) | 0, d = d + Math.imul(G, ve) | 0, d = d + Math.imul(Z, be) | 0, M = M + Math.imul(Z, ve) | 0, w = w + Math.imul(W, ye) | 0, d = d + Math.imul(W, me) | 0, d = d + Math.imul(V, ye) | 0, M = M + Math.imul(V, me) | 0, w = w + Math.imul(j, ge) | 0, d = d + Math.imul(j, _e) | 0, d = d + Math.imul(K, ge) | 0, M = M + Math.imul(K, _e) | 0, w = w + Math.imul(U, De) | 0, d = d + Math.imul(U, Le) | 0, d = d + Math.imul(H, De) | 0, M = M + Math.imul(H, Le) | 0;
            var Hr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Hr >>> 26) | 0, Hr &= 67108863, w = Math.imul(te, he), d = Math.imul(te, ce), d = d + Math.imul(re, he) | 0, M = Math.imul(re, ce), w = w + Math.imul(Q, ue) | 0, d = d + Math.imul(Q, de) | 0, d = d + Math.imul(ee, ue) | 0, M = M + Math.imul(ee, de) | 0, w = w + Math.imul(J, le) | 0, d = d + Math.imul(J, pe) | 0, d = d + Math.imul($, le) | 0, M = M + Math.imul($, pe) | 0, w = w + Math.imul(X, be) | 0, d = d + Math.imul(X, ve) | 0, d = d + Math.imul(Y, be) | 0, M = M + Math.imul(Y, ve) | 0, w = w + Math.imul(G, ye) | 0, d = d + Math.imul(G, me) | 0, d = d + Math.imul(Z, ye) | 0, M = M + Math.imul(Z, me) | 0, w = w + Math.imul(W, ge) | 0, d = d + Math.imul(W, _e) | 0, d = d + Math.imul(V, ge) | 0, M = M + Math.imul(V, _e) | 0, w = w + Math.imul(j, De) | 0, d = d + Math.imul(j, Le) | 0, d = d + Math.imul(K, De) | 0, M = M + Math.imul(K, Le) | 0;
            var jr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (jr >>> 26) | 0, jr &= 67108863, w = Math.imul(te, ue), d = Math.imul(te, de), d = d + Math.imul(re, ue) | 0, M = Math.imul(re, de), w = w + Math.imul(Q, le) | 0, d = d + Math.imul(Q, pe) | 0, d = d + Math.imul(ee, le) | 0, M = M + Math.imul(ee, pe) | 0, w = w + Math.imul(J, be) | 0, d = d + Math.imul(J, ve) | 0, d = d + Math.imul($, be) | 0, M = M + Math.imul($, ve) | 0, w = w + Math.imul(X, ye) | 0, d = d + Math.imul(X, me) | 0, d = d + Math.imul(Y, ye) | 0, M = M + Math.imul(Y, me) | 0, w = w + Math.imul(G, ge) | 0, d = d + Math.imul(G, _e) | 0, d = d + Math.imul(Z, ge) | 0, M = M + Math.imul(Z, _e) | 0, w = w + Math.imul(W, De) | 0, d = d + Math.imul(W, Le) | 0, d = d + Math.imul(V, De) | 0, M = M + Math.imul(V, Le) | 0;
            var Kr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Kr >>> 26) | 0, Kr &= 67108863, w = Math.imul(te, le), d = Math.imul(te, pe), d = d + Math.imul(re, le) | 0, M = Math.imul(re, pe), w = w + Math.imul(Q, be) | 0, d = d + Math.imul(Q, ve) | 0, d = d + Math.imul(ee, be) | 0, M = M + Math.imul(ee, ve) | 0, w = w + Math.imul(J, ye) | 0, d = d + Math.imul(J, me) | 0, d = d + Math.imul($, ye) | 0, M = M + Math.imul($, me) | 0, w = w + Math.imul(X, ge) | 0, d = d + Math.imul(X, _e) | 0, d = d + Math.imul(Y, ge) | 0, M = M + Math.imul(Y, _e) | 0, w = w + Math.imul(G, De) | 0, d = d + Math.imul(G, Le) | 0, d = d + Math.imul(Z, De) | 0, M = M + Math.imul(Z, Le) | 0;
            var Wr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Wr >>> 26) | 0, Wr &= 67108863, w = Math.imul(te, be), d = Math.imul(te, ve), d = d + Math.imul(re, be) | 0, M = Math.imul(re, ve), w = w + Math.imul(Q, ye) | 0, d = d + Math.imul(Q, me) | 0, d = d + Math.imul(ee, ye) | 0, M = M + Math.imul(ee, me) | 0, w = w + Math.imul(J, ge) | 0, d = d + Math.imul(J, _e) | 0, d = d + Math.imul($, ge) | 0, M = M + Math.imul($, _e) | 0, w = w + Math.imul(X, De) | 0, d = d + Math.imul(X, Le) | 0, d = d + Math.imul(Y, De) | 0, M = M + Math.imul(Y, Le) | 0;
            var Vr = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Vr >>> 26) | 0, Vr &= 67108863, w = Math.imul(te, ye), d = Math.imul(te, me), d = d + Math.imul(re, ye) | 0, M = Math.imul(re, me), w = w + Math.imul(Q, ge) | 0, d = d + Math.imul(Q, _e) | 0, d = d + Math.imul(ee, ge) | 0, M = M + Math.imul(ee, _e) | 0, w = w + Math.imul(J, De) | 0, d = d + Math.imul(J, Le) | 0, d = d + Math.imul($, De) | 0, M = M + Math.imul($, Le) | 0;
            var Ya = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Ya >>> 26) | 0, Ya &= 67108863, w = Math.imul(te, ge), d = Math.imul(te, _e), d = d + Math.imul(re, ge) | 0, M = Math.imul(re, _e), w = w + Math.imul(Q, De) | 0, d = d + Math.imul(Q, Le) | 0, d = d + Math.imul(ee, De) | 0, M = M + Math.imul(ee, Le) | 0;
            var Ja = (g + w | 0) + ((d & 8191) << 13) | 0;
            g = (M + (d >>> 13) | 0) + (Ja >>> 26) | 0, Ja &= 67108863, w = Math.imul(te, De), d = Math.imul(te, Le), d = d + Math.imul(re, De) | 0, M = Math.imul(re, Le);
            var $a = (g + w | 0) + ((d & 8191) << 13) | 0;
            return g = (M + (d >>> 13) | 0) + ($a >>> 26) | 0, $a &= 67108863, s[0] = kr, s[1] = Cr, s[2] = Tr, s[3] = Pr, s[4] = Dr, s[5] = Lr, s[6] = Nr, s[7] = Or, s[8] = Fr, s[9] = Ur, s[10] = zr, s[11] = Hr, s[12] = jr, s[13] = Kr, s[14] = Wr, s[15] = Vr, s[16] = Ya, s[17] = Ja, s[18] = $a, g !== 0 && (s[19] = g, p.length++), p;
        };
        Math.imul || (D = F);
        function z(l, a, h) {
            h.negative = a.negative ^ l.negative, h.length = l.length + a.length;
            for(var p = 0, y = 0, b = 0; b < h.length - 1; b++){
                var s = y;
                y = 0;
                for(var g = p & 67108863, w = Math.min(b, a.length - 1), d = Math.max(0, b - l.length + 1); d <= w; d++){
                    var M = b - d, k = l.words[M] | 0, T = a.words[d] | 0, C = k * T, N = C & 67108863;
                    s = s + (C / 67108864 | 0) | 0, N = N + g | 0, g = N & 67108863, s = s + (N >>> 26) | 0, y += s >>> 26, s &= 67108863;
                }
                h.words[b] = g, p = s, s = y;
            }
            return p !== 0 ? h.words[b] = p : h.length--, h._strip();
        }
        function Ae(l, a, h) {
            return z(l, a, h);
        }
        n.prototype.mulTo = function(a, h) {
            var p, y = this.length + a.length;
            return this.length === 10 && a.length === 10 ? p = D(this, a, h) : y < 63 ? p = F(this, a, h) : y < 1024 ? p = z(this, a, h) : p = Ae(this, a, h), p;
        };
        function qe(l, a) {
            this.x = l, this.y = a;
        }
        qe.prototype.makeRBT = function(a) {
            for(var h = new Array(a), p = n.prototype._countBits(a) - 1, y = 0; y < a; y++)h[y] = this.revBin(y, p, a);
            return h;
        }, qe.prototype.revBin = function(a, h, p) {
            if (a === 0 || a === p - 1) return a;
            for(var y = 0, b = 0; b < h; b++)y |= (a & 1) << h - b - 1, a >>= 1;
            return y;
        }, qe.prototype.permute = function(a, h, p, y, b, s) {
            for(var g = 0; g < s; g++)y[g] = h[a[g]], b[g] = p[a[g]];
        }, qe.prototype.transform = function(a, h, p, y, b, s) {
            this.permute(s, a, h, p, y, b);
            for(var g = 1; g < b; g <<= 1)for(var w = g << 1, d = Math.cos(2 * Math.PI / w), M = Math.sin(2 * Math.PI / w), k = 0; k < b; k += w)for(var T = d, C = M, N = 0; N < g; N++){
                var L = p[k + N], O = y[k + N], It = p[k + N + g], U = y[k + N + g], H = T * It - C * U;
                U = T * U + C * It, It = H, p[k + N] = L + It, y[k + N] = O + U, p[k + N + g] = L - It, y[k + N + g] = O - U, N !== w && (H = d * T - M * C, C = d * C + M * T, T = H);
            }
        }, qe.prototype.guessLen13b = function(a, h) {
            var p = Math.max(h, a) | 1, y = p & 1, b = 0;
            for(p = p / 2 | 0; p; p = p >>> 1)b++;
            return 1 << b + 1 + y;
        }, qe.prototype.conjugate = function(a, h, p) {
            if (!(p <= 1)) for(var y = 0; y < p / 2; y++){
                var b = a[y];
                a[y] = a[p - y - 1], a[p - y - 1] = b, b = h[y], h[y] = -h[p - y - 1], h[p - y - 1] = -b;
            }
        }, qe.prototype.normalize13b = function(a, h) {
            for(var p = 0, y = 0; y < h / 2; y++){
                var b = Math.round(a[2 * y + 1] / h) * 8192 + Math.round(a[2 * y] / h) + p;
                a[y] = b & 67108863, b < 67108864 ? p = 0 : p = b / 67108864 | 0;
            }
            return a;
        }, qe.prototype.convert13b = function(a, h, p, y) {
            for(var b = 0, s = 0; s < h; s++)b = b + (a[s] | 0), p[2 * s] = b & 8191, b = b >>> 13, p[2 * s + 1] = b & 8191, b = b >>> 13;
            for(s = 2 * h; s < y; ++s)p[s] = 0;
            r(b === 0), r((b & -8192) === 0);
        }, qe.prototype.stub = function(a) {
            for(var h = new Array(a), p = 0; p < a; p++)h[p] = 0;
            return h;
        }, qe.prototype.mulp = function(a, h, p) {
            var y = 2 * this.guessLen13b(a.length, h.length), b = this.makeRBT(y), s = this.stub(y), g = new Array(y), w = new Array(y), d = new Array(y), M = new Array(y), k = new Array(y), T = new Array(y), C = p.words;
            C.length = y, this.convert13b(a.words, a.length, g, y), this.convert13b(h.words, h.length, M, y), this.transform(g, s, w, d, y, b), this.transform(M, s, k, T, y, b);
            for(var N = 0; N < y; N++){
                var L = w[N] * k[N] - d[N] * T[N];
                d[N] = w[N] * T[N] + d[N] * k[N], w[N] = L;
            }
            return this.conjugate(w, d, y), this.transform(w, d, C, s, y, b), this.conjugate(C, s, y), this.normalize13b(C, y), p.negative = a.negative ^ h.negative, p.length = a.length + h.length, p._strip();
        }, n.prototype.mul = function(a) {
            var h = new n(null);
            return h.words = new Array(this.length + a.length), this.mulTo(a, h);
        }, n.prototype.mulf = function(a) {
            var h = new n(null);
            return h.words = new Array(this.length + a.length), Ae(this, a, h);
        }, n.prototype.imul = function(a) {
            return this.clone().mulTo(a, this);
        }, n.prototype.imuln = function(a) {
            var h = a < 0;
            h && (a = -a), r(typeof a == "number"), r(a < 67108864);
            for(var p = 0, y = 0; y < this.length; y++){
                var b = (this.words[y] | 0) * a, s = (b & 67108863) + (p & 67108863);
                p >>= 26, p += b / 67108864 | 0, p += s >>> 26, this.words[y] = s & 67108863;
            }
            return p !== 0 && (this.words[y] = p, this.length++), h ? this.ineg() : this;
        }, n.prototype.muln = function(a) {
            return this.clone().imuln(a);
        }, n.prototype.sqr = function() {
            return this.mul(this);
        }, n.prototype.isqr = function() {
            return this.imul(this.clone());
        }, n.prototype.pow = function(a) {
            var h = P(a);
            if (h.length === 0) return new n(1);
            for(var p = this, y = 0; y < h.length && h[y] === 0; y++, p = p.sqr());
            if (++y < h.length) for(var b = p.sqr(); y < h.length; y++, b = b.sqr())h[y] !== 0 && (p = p.mul(b));
            return p;
        }, n.prototype.iushln = function(a) {
            r(typeof a == "number" && a >= 0);
            var h = a % 26, p = (a - h) / 26, y = 67108863 >>> 26 - h << 26 - h, b;
            if (h !== 0) {
                var s = 0;
                for(b = 0; b < this.length; b++){
                    var g = this.words[b] & y, w = (this.words[b] | 0) - g << h;
                    this.words[b] = w | s, s = g >>> 26 - h;
                }
                s && (this.words[b] = s, this.length++);
            }
            if (p !== 0) {
                for(b = this.length - 1; b >= 0; b--)this.words[b + p] = this.words[b];
                for(b = 0; b < p; b++)this.words[b] = 0;
                this.length += p;
            }
            return this._strip();
        }, n.prototype.ishln = function(a) {
            return r(this.negative === 0), this.iushln(a);
        }, n.prototype.iushrn = function(a, h, p) {
            r(typeof a == "number" && a >= 0);
            var y;
            h ? y = (h - h % 26) / 26 : y = 0;
            var b = a % 26, s = Math.min((a - b) / 26, this.length), g = 67108863 ^ 67108863 >>> b << b, w = p;
            if (y -= s, y = Math.max(0, y), w) {
                for(var d = 0; d < s; d++)w.words[d] = this.words[d];
                w.length = s;
            }
            if (s !== 0) {
                if (this.length > s) for(this.length -= s, d = 0; d < this.length; d++)this.words[d] = this.words[d + s];
                else this.words[0] = 0, this.length = 1;
            }
            var M = 0;
            for(d = this.length - 1; d >= 0 && (M !== 0 || d >= y); d--){
                var k = this.words[d] | 0;
                this.words[d] = M << 26 - b | k >>> b, M = k & g;
            }
            return w && M !== 0 && (w.words[w.length++] = M), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
        }, n.prototype.ishrn = function(a, h, p) {
            return r(this.negative === 0), this.iushrn(a, h, p);
        }, n.prototype.shln = function(a) {
            return this.clone().ishln(a);
        }, n.prototype.ushln = function(a) {
            return this.clone().iushln(a);
        }, n.prototype.shrn = function(a) {
            return this.clone().ishrn(a);
        }, n.prototype.ushrn = function(a) {
            return this.clone().iushrn(a);
        }, n.prototype.testn = function(a) {
            r(typeof a == "number" && a >= 0);
            var h = a % 26, p = (a - h) / 26, y = 1 << h;
            if (this.length <= p) return !1;
            var b = this.words[p];
            return !!(b & y);
        }, n.prototype.imaskn = function(a) {
            r(typeof a == "number" && a >= 0);
            var h = a % 26, p = (a - h) / 26;
            if (r(this.negative === 0, "imaskn works only with positive numbers"), this.length <= p) return this;
            if (h !== 0 && p++, this.length = Math.min(p, this.length), h !== 0) {
                var y = 67108863 ^ 67108863 >>> h << h;
                this.words[this.length - 1] &= y;
            }
            return this._strip();
        }, n.prototype.maskn = function(a) {
            return this.clone().imaskn(a);
        }, n.prototype.iaddn = function(a) {
            return r(typeof a == "number"), r(a < 67108864), a < 0 ? this.isubn(-a) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= a ? (this.words[0] = a - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(a), this.negative = 1, this) : this._iaddn(a);
        }, n.prototype._iaddn = function(a) {
            this.words[0] += a;
            for(var h = 0; h < this.length && this.words[h] >= 67108864; h++)this.words[h] -= 67108864, h === this.length - 1 ? this.words[h + 1] = 1 : this.words[h + 1]++;
            return this.length = Math.max(this.length, h + 1), this;
        }, n.prototype.isubn = function(a) {
            if (r(typeof a == "number"), r(a < 67108864), a < 0) return this.iaddn(-a);
            if (this.negative !== 0) return this.negative = 0, this.iaddn(a), this.negative = 1, this;
            if (this.words[0] -= a, this.length === 1 && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
            else for(var h = 0; h < this.length && this.words[h] < 0; h++)this.words[h] += 67108864, this.words[h + 1] -= 1;
            return this._strip();
        }, n.prototype.addn = function(a) {
            return this.clone().iaddn(a);
        }, n.prototype.subn = function(a) {
            return this.clone().isubn(a);
        }, n.prototype.iabs = function() {
            return this.negative = 0, this;
        }, n.prototype.abs = function() {
            return this.clone().iabs();
        }, n.prototype._ishlnsubmul = function(a, h, p) {
            var y = a.length + p, b;
            this._expand(y);
            var s, g = 0;
            for(b = 0; b < a.length; b++){
                s = (this.words[b + p] | 0) + g;
                var w = (a.words[b] | 0) * h;
                s -= w & 67108863, g = (s >> 26) - (w / 67108864 | 0), this.words[b + p] = s & 67108863;
            }
            for(; b < this.length - p; b++)s = (this.words[b + p] | 0) + g, g = s >> 26, this.words[b + p] = s & 67108863;
            if (g === 0) return this._strip();
            for(r(g === -1), g = 0, b = 0; b < this.length; b++)s = -(this.words[b] | 0) + g, g = s >> 26, this.words[b] = s & 67108863;
            return this.negative = 1, this._strip();
        }, n.prototype._wordDiv = function(a, h) {
            var p = this.length - a.length, y = this.clone(), b = a, s = b.words[b.length - 1] | 0, g = this._countBits(s);
            p = 26 - g, p !== 0 && (b = b.ushln(p), y.iushln(p), s = b.words[b.length - 1] | 0);
            var w = y.length - b.length, d;
            if (h !== "mod") {
                d = new n(null), d.length = w + 1, d.words = new Array(d.length);
                for(var M = 0; M < d.length; M++)d.words[M] = 0;
            }
            var k = y.clone()._ishlnsubmul(b, 1, w);
            k.negative === 0 && (y = k, d && (d.words[w] = 1));
            for(var T = w - 1; T >= 0; T--){
                var C = (y.words[b.length + T] | 0) * 67108864 + (y.words[b.length + T - 1] | 0);
                for(C = Math.min(C / s | 0, 67108863), y._ishlnsubmul(b, C, T); y.negative !== 0;)C--, y.negative = 0, y._ishlnsubmul(b, 1, T), y.isZero() || (y.negative ^= 1);
                d && (d.words[T] = C);
            }
            return d && d._strip(), y._strip(), h !== "div" && p !== 0 && y.iushrn(p), {
                div: d || null,
                mod: y
            };
        }, n.prototype.divmod = function(a, h, p) {
            if (r(!a.isZero()), this.isZero()) return {
                div: new n(0),
                mod: new n(0)
            };
            var y, b, s;
            return this.negative !== 0 && a.negative === 0 ? (s = this.neg().divmod(a, h), h !== "mod" && (y = s.div.neg()), h !== "div" && (b = s.mod.neg(), p && b.negative !== 0 && b.iadd(a)), {
                div: y,
                mod: b
            }) : this.negative === 0 && a.negative !== 0 ? (s = this.divmod(a.neg(), h), h !== "mod" && (y = s.div.neg()), {
                div: y,
                mod: s.mod
            }) : this.negative & a.negative ? (s = this.neg().divmod(a.neg(), h), h !== "div" && (b = s.mod.neg(), p && b.negative !== 0 && b.isub(a)), {
                div: s.div,
                mod: b
            }) : a.length > this.length || this.cmp(a) < 0 ? {
                div: new n(0),
                mod: this
            } : a.length === 1 ? h === "div" ? {
                div: this.divn(a.words[0]),
                mod: null
            } : h === "mod" ? {
                div: null,
                mod: new n(this.modrn(a.words[0]))
            } : {
                div: this.divn(a.words[0]),
                mod: new n(this.modrn(a.words[0]))
            } : this._wordDiv(a, h);
        }, n.prototype.div = function(a) {
            return this.divmod(a, "div", !1).div;
        }, n.prototype.mod = function(a) {
            return this.divmod(a, "mod", !1).mod;
        }, n.prototype.umod = function(a) {
            return this.divmod(a, "mod", !0).mod;
        }, n.prototype.divRound = function(a) {
            var h = this.divmod(a);
            if (h.mod.isZero()) return h.div;
            var p = h.div.negative !== 0 ? h.mod.isub(a) : h.mod, y = a.ushrn(1), b = a.andln(1), s = p.cmp(y);
            return s < 0 || b === 1 && s === 0 ? h.div : h.div.negative !== 0 ? h.div.isubn(1) : h.div.iaddn(1);
        }, n.prototype.modrn = function(a) {
            var h = a < 0;
            h && (a = -a), r(a <= 67108863);
            for(var p = 67108864 % a, y = 0, b = this.length - 1; b >= 0; b--)y = (p * y + (this.words[b] | 0)) % a;
            return h ? -y : y;
        }, n.prototype.modn = function(a) {
            return this.modrn(a);
        }, n.prototype.idivn = function(a) {
            var h = a < 0;
            h && (a = -a), r(a <= 67108863);
            for(var p = 0, y = this.length - 1; y >= 0; y--){
                var b = (this.words[y] | 0) + p * 67108864;
                this.words[y] = b / a | 0, p = b % a;
            }
            return this._strip(), h ? this.ineg() : this;
        }, n.prototype.divn = function(a) {
            return this.clone().idivn(a);
        }, n.prototype.egcd = function(a) {
            r(a.negative === 0), r(!a.isZero());
            var h = this, p = a.clone();
            h.negative !== 0 ? h = h.umod(a) : h = h.clone();
            for(var y = new n(1), b = new n(0), s = new n(0), g = new n(1), w = 0; h.isEven() && p.isEven();)h.iushrn(1), p.iushrn(1), ++w;
            for(var d = p.clone(), M = h.clone(); !h.isZero();){
                for(var k = 0, T = 1; !(h.words[0] & T) && k < 26; ++k, T <<= 1);
                if (k > 0) for(h.iushrn(k); k-- > 0;)(y.isOdd() || b.isOdd()) && (y.iadd(d), b.isub(M)), y.iushrn(1), b.iushrn(1);
                for(var C = 0, N = 1; !(p.words[0] & N) && C < 26; ++C, N <<= 1);
                if (C > 0) for(p.iushrn(C); C-- > 0;)(s.isOdd() || g.isOdd()) && (s.iadd(d), g.isub(M)), s.iushrn(1), g.iushrn(1);
                h.cmp(p) >= 0 ? (h.isub(p), y.isub(s), b.isub(g)) : (p.isub(h), s.isub(y), g.isub(b));
            }
            return {
                a: s,
                b: g,
                gcd: p.iushln(w)
            };
        }, n.prototype._invmp = function(a) {
            r(a.negative === 0), r(!a.isZero());
            var h = this, p = a.clone();
            h.negative !== 0 ? h = h.umod(a) : h = h.clone();
            for(var y = new n(1), b = new n(0), s = p.clone(); h.cmpn(1) > 0 && p.cmpn(1) > 0;){
                for(var g = 0, w = 1; !(h.words[0] & w) && g < 26; ++g, w <<= 1);
                if (g > 0) for(h.iushrn(g); g-- > 0;)y.isOdd() && y.iadd(s), y.iushrn(1);
                for(var d = 0, M = 1; !(p.words[0] & M) && d < 26; ++d, M <<= 1);
                if (d > 0) for(p.iushrn(d); d-- > 0;)b.isOdd() && b.iadd(s), b.iushrn(1);
                h.cmp(p) >= 0 ? (h.isub(p), y.isub(b)) : (p.isub(h), b.isub(y));
            }
            var k;
            return h.cmpn(1) === 0 ? k = y : k = b, k.cmpn(0) < 0 && k.iadd(a), k;
        }, n.prototype.gcd = function(a) {
            if (this.isZero()) return a.abs();
            if (a.isZero()) return this.abs();
            var h = this.clone(), p = a.clone();
            h.negative = 0, p.negative = 0;
            for(var y = 0; h.isEven() && p.isEven(); y++)h.iushrn(1), p.iushrn(1);
            do {
                for(; h.isEven();)h.iushrn(1);
                for(; p.isEven();)p.iushrn(1);
                var b = h.cmp(p);
                if (b < 0) {
                    var s = h;
                    h = p, p = s;
                } else if (b === 0 || p.cmpn(1) === 0) break;
                h.isub(p);
            }while (!0);
            return p.iushln(y);
        }, n.prototype.invm = function(a) {
            return this.egcd(a).a.umod(a);
        }, n.prototype.isEven = function() {
            return (this.words[0] & 1) === 0;
        }, n.prototype.isOdd = function() {
            return (this.words[0] & 1) === 1;
        }, n.prototype.andln = function(a) {
            return this.words[0] & a;
        }, n.prototype.bincn = function(a) {
            r(typeof a == "number");
            var h = a % 26, p = (a - h) / 26, y = 1 << h;
            if (this.length <= p) return this._expand(p + 1), this.words[p] |= y, this;
            for(var b = y, s = p; b !== 0 && s < this.length; s++){
                var g = this.words[s] | 0;
                g += b, b = g >>> 26, g &= 67108863, this.words[s] = g;
            }
            return b !== 0 && (this.words[s] = b, this.length++), this;
        }, n.prototype.isZero = function() {
            return this.length === 1 && this.words[0] === 0;
        }, n.prototype.cmpn = function(a) {
            var h = a < 0;
            if (this.negative !== 0 && !h) return -1;
            if (this.negative === 0 && h) return 1;
            this._strip();
            var p;
            if (this.length > 1) p = 1;
            else {
                h && (a = -a), r(a <= 67108863, "Number is too big");
                var y = this.words[0] | 0;
                p = y === a ? 0 : y < a ? -1 : 1;
            }
            return this.negative !== 0 ? -p | 0 : p;
        }, n.prototype.cmp = function(a) {
            if (this.negative !== 0 && a.negative === 0) return -1;
            if (this.negative === 0 && a.negative !== 0) return 1;
            var h = this.ucmp(a);
            return this.negative !== 0 ? -h | 0 : h;
        }, n.prototype.ucmp = function(a) {
            if (this.length > a.length) return 1;
            if (this.length < a.length) return -1;
            for(var h = 0, p = this.length - 1; p >= 0; p--){
                var y = this.words[p] | 0, b = a.words[p] | 0;
                if (y !== b) {
                    y < b ? h = -1 : y > b && (h = 1);
                    break;
                }
            }
            return h;
        }, n.prototype.gtn = function(a) {
            return this.cmpn(a) === 1;
        }, n.prototype.gt = function(a) {
            return this.cmp(a) === 1;
        }, n.prototype.gten = function(a) {
            return this.cmpn(a) >= 0;
        }, n.prototype.gte = function(a) {
            return this.cmp(a) >= 0;
        }, n.prototype.ltn = function(a) {
            return this.cmpn(a) === -1;
        }, n.prototype.lt = function(a) {
            return this.cmp(a) === -1;
        }, n.prototype.lten = function(a) {
            return this.cmpn(a) <= 0;
        }, n.prototype.lte = function(a) {
            return this.cmp(a) <= 0;
        }, n.prototype.eqn = function(a) {
            return this.cmpn(a) === 0;
        }, n.prototype.eq = function(a) {
            return this.cmp(a) === 0;
        }, n.red = function(a) {
            return new c(a);
        }, n.prototype.toRed = function(a) {
            return r(!this.red, "Already a number in reduction context"), r(this.negative === 0, "red works only with positives"), a.convertTo(this)._forceRed(a);
        }, n.prototype.fromRed = function() {
            return r(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
        }, n.prototype._forceRed = function(a) {
            return this.red = a, this;
        }, n.prototype.forceRed = function(a) {
            return r(!this.red, "Already a number in reduction context"), this._forceRed(a);
        }, n.prototype.redAdd = function(a) {
            return r(this.red, "redAdd works only with red numbers"), this.red.add(this, a);
        }, n.prototype.redIAdd = function(a) {
            return r(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, a);
        }, n.prototype.redSub = function(a) {
            return r(this.red, "redSub works only with red numbers"), this.red.sub(this, a);
        }, n.prototype.redISub = function(a) {
            return r(this.red, "redISub works only with red numbers"), this.red.isub(this, a);
        }, n.prototype.redShl = function(a) {
            return r(this.red, "redShl works only with red numbers"), this.red.shl(this, a);
        }, n.prototype.redMul = function(a) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.mul(this, a);
        }, n.prototype.redIMul = function(a) {
            return r(this.red, "redMul works only with red numbers"), this.red._verify2(this, a), this.red.imul(this, a);
        }, n.prototype.redSqr = function() {
            return r(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
        }, n.prototype.redISqr = function() {
            return r(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
        }, n.prototype.redSqrt = function() {
            return r(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
        }, n.prototype.redInvm = function() {
            return r(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
        }, n.prototype.redNeg = function() {
            return r(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
        }, n.prototype.redPow = function(a) {
            return r(this.red && !a.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, a);
        };
        var Pe = {
            k256: null,
            p224: null,
            p192: null,
            p25519: null
        };
        function Re(l, a) {
            this.name = l, this.p = new n(a, 16), this.n = this.p.bitLength(), this.k = new n(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
        }
        Re.prototype._tmp = function() {
            var a = new n(null);
            return a.words = new Array(Math.ceil(this.n / 13)), a;
        }, Re.prototype.ireduce = function(a) {
            var h = a, p;
            do this.split(h, this.tmp), h = this.imulK(h), h = h.iadd(this.tmp), p = h.bitLength();
            while (p > this.n);
            var y = p < this.n ? -1 : h.ucmp(this.p);
            return y === 0 ? (h.words[0] = 0, h.length = 1) : y > 0 ? h.isub(this.p) : h.strip !== void 0 ? h.strip() : h._strip(), h;
        }, Re.prototype.split = function(a, h) {
            a.iushrn(this.n, 0, h);
        }, Re.prototype.imulK = function(a) {
            return a.imul(this.k);
        };
        function Ue() {
            Re.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
        }
        i(Ue, Re), Ue.prototype.split = function(a, h) {
            for(var p = 4194303, y = Math.min(a.length, 9), b = 0; b < y; b++)h.words[b] = a.words[b];
            if (h.length = y, a.length <= 9) {
                a.words[0] = 0, a.length = 1;
                return;
            }
            var s = a.words[9];
            for(h.words[h.length++] = s & p, b = 10; b < a.length; b++){
                var g = a.words[b] | 0;
                a.words[b - 10] = (g & p) << 4 | s >>> 22, s = g;
            }
            s >>>= 22, a.words[b - 10] = s, s === 0 && a.length > 10 ? a.length -= 10 : a.length -= 9;
        }, Ue.prototype.imulK = function(a) {
            a.words[a.length] = 0, a.words[a.length + 1] = 0, a.length += 2;
            for(var h = 0, p = 0; p < a.length; p++){
                var y = a.words[p] | 0;
                h += y * 977, a.words[p] = h & 67108863, h = y * 64 + (h / 67108864 | 0);
            }
            return a.words[a.length - 1] === 0 && (a.length--, a.words[a.length - 1] === 0 && a.length--), a;
        };
        function Ee() {
            Re.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
        }
        i(Ee, Re);
        function Fe() {
            Re.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
        }
        i(Fe, Re);
        function E() {
            Re.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
        }
        i(E, Re), E.prototype.imulK = function(a) {
            for(var h = 0, p = 0; p < a.length; p++){
                var y = (a.words[p] | 0) * 19 + h, b = y & 67108863;
                y >>>= 26, a.words[p] = b, h = y;
            }
            return h !== 0 && (a.words[a.length++] = h), a;
        }, n._prime = function(a) {
            if (Pe[a]) return Pe[a];
            var h;
            if (a === "k256") h = new Ue;
            else if (a === "p224") h = new Ee;
            else if (a === "p192") h = new Fe;
            else if (a === "p25519") h = new E;
            else throw new Error("Unknown prime " + a);
            return Pe[a] = h, h;
        };
        function c(l) {
            if (typeof l == "string") {
                var a = n._prime(l);
                this.m = a.p, this.prime = a;
            } else r(l.gtn(1), "modulus must be greater than 1"), this.m = l, this.prime = null;
        }
        c.prototype._verify1 = function(a) {
            r(a.negative === 0, "red works only with positives"), r(a.red, "red works only with red numbers");
        }, c.prototype._verify2 = function(a, h) {
            r((a.negative | h.negative) === 0, "red works only with positives"), r(a.red && a.red === h.red, "red works only with red numbers");
        }, c.prototype.imod = function(a) {
            return this.prime ? this.prime.ireduce(a)._forceRed(this) : (_(a, a.umod(this.m)._forceRed(this)), a);
        }, c.prototype.neg = function(a) {
            return a.isZero() ? a.clone() : this.m.sub(a)._forceRed(this);
        }, c.prototype.add = function(a, h) {
            this._verify2(a, h);
            var p = a.add(h);
            return p.cmp(this.m) >= 0 && p.isub(this.m), p._forceRed(this);
        }, c.prototype.iadd = function(a, h) {
            this._verify2(a, h);
            var p = a.iadd(h);
            return p.cmp(this.m) >= 0 && p.isub(this.m), p;
        }, c.prototype.sub = function(a, h) {
            this._verify2(a, h);
            var p = a.sub(h);
            return p.cmpn(0) < 0 && p.iadd(this.m), p._forceRed(this);
        }, c.prototype.isub = function(a, h) {
            this._verify2(a, h);
            var p = a.isub(h);
            return p.cmpn(0) < 0 && p.iadd(this.m), p;
        }, c.prototype.shl = function(a, h) {
            return this._verify1(a), this.imod(a.ushln(h));
        }, c.prototype.imul = function(a, h) {
            return this._verify2(a, h), this.imod(a.imul(h));
        }, c.prototype.mul = function(a, h) {
            return this._verify2(a, h), this.imod(a.mul(h));
        }, c.prototype.isqr = function(a) {
            return this.imul(a, a.clone());
        }, c.prototype.sqr = function(a) {
            return this.mul(a, a);
        }, c.prototype.sqrt = function(a) {
            if (a.isZero()) return a.clone();
            var h = this.m.andln(3);
            if (r(h % 2 === 1), h === 3) {
                var p = this.m.add(new n(1)).iushrn(2);
                return this.pow(a, p);
            }
            for(var y = this.m.subn(1), b = 0; !y.isZero() && y.andln(1) === 0;)b++, y.iushrn(1);
            r(!y.isZero());
            var s = new n(1).toRed(this), g = s.redNeg(), w = this.m.subn(1).iushrn(1), d = this.m.bitLength();
            for(d = new n(2 * d * d).toRed(this); this.pow(d, w).cmp(g) !== 0;)d.redIAdd(g);
            for(var M = this.pow(d, y), k = this.pow(a, y.addn(1).iushrn(1)), T = this.pow(a, y), C = b; T.cmp(s) !== 0;){
                for(var N = T, L = 0; N.cmp(s) !== 0; L++)N = N.redSqr();
                r(L < C);
                var O = this.pow(M, new n(1).iushln(C - L - 1));
                k = k.redMul(O), M = O.redSqr(), T = T.redMul(M), C = L;
            }
            return k;
        }, c.prototype.invm = function(a) {
            var h = a._invmp(this.m);
            return h.negative !== 0 ? (h.negative = 0, this.imod(h).redNeg()) : this.imod(h);
        }, c.prototype.pow = function(a, h) {
            if (h.isZero()) return new n(1).toRed(this);
            if (h.cmpn(1) === 0) return a.clone();
            var p = 4, y = new Array(1 << p);
            y[0] = new n(1).toRed(this), y[1] = a;
            for(var b = 2; b < y.length; b++)y[b] = this.mul(y[b - 1], a);
            var s = y[0], g = 0, w = 0, d = h.bitLength() % 26;
            for(d === 0 && (d = 26), b = h.length - 1; b >= 0; b--){
                for(var M = h.words[b], k = d - 1; k >= 0; k--){
                    var T = M >> k & 1;
                    if (s !== y[0] && (s = this.sqr(s)), T === 0 && g === 0) {
                        w = 0;
                        continue;
                    }
                    g <<= 1, g |= T, w++, !(w !== p && (b !== 0 || k !== 0)) && (s = this.mul(s, y[g]), w = 0, g = 0);
                }
                d = 26;
            }
            return s;
        }, c.prototype.convertTo = function(a) {
            var h = a.umod(this.m);
            return h === a ? h.clone() : h;
        }, c.prototype.convertFrom = function(a) {
            var h = a.clone();
            return h.red = null, h;
        }, n.mont = function(a) {
            return new m(a);
        };
        function m(l) {
            c.call(this, l), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new n(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
        }
        i(m, c), m.prototype.convertTo = function(a) {
            return this.imod(a.ushln(this.shift));
        }, m.prototype.convertFrom = function(a) {
            var h = this.imod(a.mul(this.rinv));
            return h.red = null, h;
        }, m.prototype.imul = function(a, h) {
            if (a.isZero() || h.isZero()) return a.words[0] = 0, a.length = 1, a;
            var p = a.imul(h), y = p.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), b = p.isub(y).iushrn(this.shift), s = b;
            return b.cmp(this.m) >= 0 ? s = b.isub(this.m) : b.cmpn(0) < 0 && (s = b.iadd(this.m)), s._forceRed(this);
        }, m.prototype.mul = function(a, h) {
            if (a.isZero() || h.isZero()) return new n(0)._forceRed(this);
            var p = a.mul(h), y = p.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), b = p.isub(y).iushrn(this.shift), s = b;
            return b.cmp(this.m) >= 0 ? s = b.isub(this.m) : b.cmpn(0) < 0 && (s = b.iadd(this.m)), s._forceRed(this);
        }, m.prototype.invm = function(a) {
            var h = this.imod(a._invmp(this.m).mul(this.r2));
            return h._forceRed(this);
        };
    })(typeof Oo > "u" || Oo, Nd);
});
var ma = q((Xy, Ud)=>{
    var zi = ya(), q4 = Jr();
    function R4(t) {
        var e = Od(t), r = e.toRed(zi.mont(t.modulus)).redPow(new zi(t.publicExponent)).fromRed();
        return {
            blinder: r,
            unblinder: e.invm(t.modulus)
        };
    }
    function Od(t) {
        var e = t.modulus.byteLength(), r;
        do r = new zi(q4(e));
        while (r.cmp(t.modulus) >= 0 || !r.umod(t.prime1) || !r.umod(t.prime2));
        return r;
    }
    function Fd(t, e) {
        var r = R4(e), i = e.modulus.byteLength(), n = new zi(t).mul(r.blinder).umod(e.modulus), f = n.toRed(zi.mont(e.prime1)), o = n.toRed(zi.mont(e.prime2)), u = e.coefficient, v = e.prime1, _ = e.prime2, x = f.redPow(e.exponent1).fromRed(), S = o.redPow(e.exponent2).fromRed(), A = x.isub(S).imul(u).umod(v).imul(_);
        return S.iadd(A).imul(r.unblinder).umod(e.modulus).toArrayLike(Buffer, "be", i);
    }
    Fd.getr = Od;
    Ud.exports = Fd;
});
var zd = q((Yy, I4)=>{
    I4.exports = {
        name: "elliptic",
        version: "6.5.4",
        description: "EC cryptography",
        main: "lib/elliptic.js",
        files: [
            "lib"
        ],
        scripts: {
            lint: "eslint lib test",
            "lint:fix": "npm run lint -- --fix",
            unit: "istanbul test _mocha --reporter=spec test/index.js",
            test: "npm run lint && npm run unit",
            version: "grunt dist && git add dist/"
        },
        repository: {
            type: "git",
            url: "git@github.com:indutny/elliptic"
        },
        keywords: [
            "EC",
            "Elliptic",
            "curve",
            "Cryptography"
        ],
        author: "Fedor Indutny <fedor@indutny.com>",
        license: "MIT",
        bugs: {
            url: "https://github.com/indutny/elliptic/issues"
        },
        homepage: "https://github.com/indutny/elliptic",
        devDependencies: {
            brfs: "^2.0.2",
            coveralls: "^3.1.0",
            eslint: "^7.6.0",
            grunt: "^1.2.1",
            "grunt-browserify": "^5.3.0",
            "grunt-cli": "^1.3.2",
            "grunt-contrib-connect": "^3.0.0",
            "grunt-contrib-copy": "^1.0.0",
            "grunt-contrib-uglify": "^5.0.0",
            "grunt-mocha-istanbul": "^5.0.2",
            "grunt-saucelabs": "^9.0.1",
            istanbul: "^0.4.5",
            mocha: "^8.0.1"
        },
        dependencies: {
            "bn.js": "^4.11.9",
            brorand: "^1.1.0",
            "hash.js": "^1.0.0",
            "hmac-drbg": "^1.0.1",
            inherits: "^2.0.4",
            "minimalistic-assert": "^1.0.1",
            "minimalistic-crypto-utils": "^1.0.1"
        }
    };
});
var Fo = q((Kd)=>{
    "use strict";
    var ga = Kd;
    function k4(t, e) {
        if (Array.isArray(t)) return t.slice();
        if (!t) return [];
        var r = [];
        if (typeof t != "string") {
            for(var i = 0; i < t.length; i++)r[i] = t[i] | 0;
            return r;
        }
        if (e === "hex") {
            t = t.replace(/[^a-z0-9]+/ig, ""), t.length % 2 !== 0 && (t = "0" + t);
            for(var i = 0; i < t.length; i += 2)r.push(parseInt(t[i] + t[i + 1], 16));
        } else for(var i = 0; i < t.length; i++){
            var n = t.charCodeAt(i), f = n >> 8, o = n & 255;
            f ? r.push(f, o) : r.push(o);
        }
        return r;
    }
    ga.toArray = k4;
    function Hd(t) {
        return t.length === 1 ? "0" + t : t;
    }
    ga.zero2 = Hd;
    function jd(t) {
        for(var e = "", r = 0; r < t.length; r++)e += Hd(t[r].toString(16));
        return e;
    }
    ga.toHex = jd;
    ga.encode = function(e, r) {
        return r === "hex" ? jd(e) : e;
    };
});
var ut = q((Wd)=>{
    "use strict";
    var Pt = Wd, C4 = je(), T4 = ct(), _a = Fo();
    Pt.assert = T4;
    Pt.toArray = _a.toArray;
    Pt.zero2 = _a.zero2;
    Pt.toHex = _a.toHex;
    Pt.encode = _a.encode;
    function P4(t, e, r) {
        var i = new Array(Math.max(t.bitLength(), r) + 1);
        i.fill(0);
        for(var n = 1 << e + 1, f = t.clone(), o = 0; o < i.length; o++){
            var u, v = f.andln(n - 1);
            f.isOdd() ? (v > (n >> 1) - 1 ? u = (n >> 1) - v : u = v, f.isubn(u)) : u = 0, i[o] = u, f.iushrn(1);
        }
        return i;
    }
    Pt.getNAF = P4;
    function D4(t, e) {
        var r = [
            [],
            []
        ];
        t = t.clone(), e = e.clone();
        for(var i = 0, n = 0, f; t.cmpn(-i) > 0 || e.cmpn(-n) > 0;){
            var o = t.andln(3) + i & 3, u = e.andln(3) + n & 3;
            o === 3 && (o = -1), u === 3 && (u = -1);
            var v;
            o & 1 ? (f = t.andln(7) + i & 7, (f === 3 || f === 5) && u === 2 ? v = -o : v = o) : v = 0, r[0].push(v);
            var _;
            u & 1 ? (f = e.andln(7) + n & 7, (f === 3 || f === 5) && o === 2 ? _ = -u : _ = u) : _ = 0, r[1].push(_), 2 * i === v + 1 && (i = 1 - i), 2 * n === _ + 1 && (n = 1 - n), t.iushrn(1), e.iushrn(1);
        }
        return r;
    }
    Pt.getJSF = D4;
    function L4(t, e, r) {
        var i = "_" + e;
        t.prototype[e] = function() {
            return this[i] !== void 0 ? this[i] : this[i] = r.call(this);
        };
    }
    Pt.cachedProperty = L4;
    function N4(t) {
        return typeof t == "string" ? Pt.toArray(t, "hex") : t;
    }
    Pt.parseBytes = N4;
    function O4(t) {
        return new C4(t, "hex", "le");
    }
    Pt.intFromLE = O4;
});
var rf = q((Qy, Vd)=>{
    "use strict";
    var li = je(), tf = ut(), wa = tf.getNAF, F4 = tf.getJSF, xa = tf.assert;
    function Ar(t, e) {
        this.type = t, this.p = new li(e.p, 16), this.red = e.prime ? li.red(e.prime) : li.mont(this.p), this.zero = new li(0).toRed(this.red), this.one = new li(1).toRed(this.red), this.two = new li(2).toRed(this.red), this.n = e.n && new li(e.n, 16), this.g = e.g && this.pointFromJSON(e.g, e.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
        var r = this.n && this.p.div(this.n);
        !r || r.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
    }
    Vd.exports = Ar;
    Ar.prototype.point = function() {
        throw new Error("Not implemented");
    };
    Ar.prototype.validate = function() {
        throw new Error("Not implemented");
    };
    Ar.prototype._fixedNafMul = function(e, r) {
        xa(e.precomputed);
        var i = e._getDoubles(), n = wa(r, 1, this._bitLength), f = (1 << i.step + 1) - (i.step % 2 === 0 ? 2 : 1);
        f /= 3;
        var o = [], u, v;
        for(u = 0; u < n.length; u += i.step){
            v = 0;
            for(var _ = u + i.step - 1; _ >= u; _--)v = (v << 1) + n[_];
            o.push(v);
        }
        for(var x = this.jpoint(null, null, null), S = this.jpoint(null, null, null), A = f; A > 0; A--){
            for(u = 0; u < o.length; u++)v = o[u], v === A ? S = S.mixedAdd(i.points[u]) : v === -A && (S = S.mixedAdd(i.points[u].neg()));
            x = x.add(S);
        }
        return x.toP();
    };
    Ar.prototype._wnafMul = function(e, r) {
        var i = 4, n = e._getNAFPoints(i);
        i = n.wnd;
        for(var f = n.points, o = wa(r, i, this._bitLength), u = this.jpoint(null, null, null), v = o.length - 1; v >= 0; v--){
            for(var _ = 0; v >= 0 && o[v] === 0; v--)_++;
            if (v >= 0 && _++, u = u.dblp(_), v < 0) break;
            var x = o[v];
            xa(x !== 0), e.type === "affine" ? x > 0 ? u = u.mixedAdd(f[x - 1 >> 1]) : u = u.mixedAdd(f[-x - 1 >> 1].neg()) : x > 0 ? u = u.add(f[x - 1 >> 1]) : u = u.add(f[-x - 1 >> 1].neg());
        }
        return e.type === "affine" ? u.toP() : u;
    };
    Ar.prototype._wnafMulAdd = function(e, r, i, n, f) {
        var o = this._wnafT1, u = this._wnafT2, v = this._wnafT3, _ = 0, x, S, A;
        for(x = 0; x < n; x++){
            A = r[x];
            var B = A._getNAFPoints(e);
            o[x] = B.wnd, u[x] = B.points;
        }
        for(x = n - 1; x >= 1; x -= 2){
            var I = x - 1, P = x;
            if (o[I] !== 1 || o[P] !== 1) {
                v[I] = wa(i[I], o[I], this._bitLength), v[P] = wa(i[P], o[P], this._bitLength), _ = Math.max(v[I].length, _), _ = Math.max(v[P].length, _);
                continue;
            }
            var F = [
                r[I],
                null,
                null,
                r[P]
            ];
            r[I].y.cmp(r[P].y) === 0 ? (F[1] = r[I].add(r[P]), F[2] = r[I].toJ().mixedAdd(r[P].neg())) : r[I].y.cmp(r[P].y.redNeg()) === 0 ? (F[1] = r[I].toJ().mixedAdd(r[P]), F[2] = r[I].add(r[P].neg())) : (F[1] = r[I].toJ().mixedAdd(r[P]), F[2] = r[I].toJ().mixedAdd(r[P].neg()));
            var D = [
                -3,
                -1,
                -5,
                -7,
                0,
                7,
                5,
                1,
                3
            ], z = F4(i[I], i[P]);
            for(_ = Math.max(z[0].length, _), v[I] = new Array(_), v[P] = new Array(_), S = 0; S < _; S++){
                var Ae = z[0][S] | 0, qe = z[1][S] | 0;
                v[I][S] = D[(Ae + 1) * 3 + (qe + 1)], v[P][S] = 0, u[I] = F;
            }
        }
        var Pe = this.jpoint(null, null, null), Re = this._wnafT4;
        for(x = _; x >= 0; x--){
            for(var Ue = 0; x >= 0;){
                var Ee = !0;
                for(S = 0; S < n; S++)Re[S] = v[S][x] | 0, Re[S] !== 0 && (Ee = !1);
                if (!Ee) break;
                Ue++, x--;
            }
            if (x >= 0 && Ue++, Pe = Pe.dblp(Ue), x < 0) break;
            for(S = 0; S < n; S++){
                var Fe = Re[S];
                Fe !== 0 && (Fe > 0 ? A = u[S][Fe - 1 >> 1] : Fe < 0 && (A = u[S][-Fe - 1 >> 1].neg()), A.type === "affine" ? Pe = Pe.mixedAdd(A) : Pe = Pe.add(A));
            }
        }
        for(x = 0; x < n; x++)u[x] = null;
        return f ? Pe : Pe.toP();
    };
    function xt(t, e) {
        this.curve = t, this.type = e, this.precomputed = null;
    }
    Ar.BasePoint = xt;
    xt.prototype.eq = function() {
        throw new Error("Not implemented");
    };
    xt.prototype.validate = function() {
        return this.curve.validate(this);
    };
    Ar.prototype.decodePoint = function(e, r) {
        e = tf.toArray(e, r);
        var i = this.p.byteLength();
        if ((e[0] === 4 || e[0] === 6 || e[0] === 7) && e.length - 1 === 2 * i) {
            e[0] === 6 ? xa(e[e.length - 1] % 2 === 0) : e[0] === 7 && xa(e[e.length - 1] % 2 === 1);
            var n = this.point(e.slice(1, 1 + i), e.slice(1 + i, 1 + 2 * i));
            return n;
        } else if ((e[0] === 2 || e[0] === 3) && e.length - 1 === i) return this.pointFromX(e.slice(1, 1 + i), e[0] === 3);
        throw new Error("Unknown point format");
    };
    xt.prototype.encodeCompressed = function(e) {
        return this.encode(e, !0);
    };
    xt.prototype._encode = function(e) {
        var r = this.curve.p.byteLength(), i = this.getX().toArray("be", r);
        return e ? [
            this.getY().isEven() ? 2 : 3
        ].concat(i) : [
            4
        ].concat(i, this.getY().toArray("be", r));
    };
    xt.prototype.encode = function(e, r) {
        return tf.encode(this._encode(r), e);
    };
    xt.prototype.precompute = function(e) {
        if (this.precomputed) return this;
        var r = {
            doubles: null,
            naf: null,
            beta: null
        };
        return r.naf = this._getNAFPoints(8), r.doubles = this._getDoubles(4, e), r.beta = this._getBeta(), this.precomputed = r, this;
    };
    xt.prototype._hasDoubles = function(e) {
        if (!this.precomputed) return !1;
        var r = this.precomputed.doubles;
        return r ? r.points.length >= Math.ceil((e.bitLength() + 1) / r.step) : !1;
    };
    xt.prototype._getDoubles = function(e, r) {
        if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
        for(var i = [
            this
        ], n = this, f = 0; f < r; f += e){
            for(var o = 0; o < e; o++)n = n.dbl();
            i.push(n);
        }
        return {
            step: e,
            points: i
        };
    };
    xt.prototype._getNAFPoints = function(e) {
        if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
        for(var r = [
            this
        ], i = (1 << e) - 1, n = i === 1 ? null : this.dbl(), f = 1; f < i; f++)r[f] = r[f - 1].add(n);
        return {
            wnd: e,
            points: r
        };
    };
    xt.prototype._getBeta = function() {
        return null;
    };
    xt.prototype.dblp = function(e) {
        for(var r = this, i = 0; i < e; i++)r = r.dbl();
        return r;
    };
});
var Zd = q((em, Gd)=>{
    "use strict";
    var U4 = ut(), Oe = je(), Uo = xe(), Hi = rf(), z4 = U4.assert;
    function Mt(t) {
        Hi.call(this, "short", t), this.a = new Oe(t.a, 16).toRed(this.red), this.b = new Oe(t.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(t), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
    }
    Uo(Mt, Hi);
    Gd.exports = Mt;
    Mt.prototype._getEndomorphism = function(e) {
        if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
            var r, i;
            if (e.beta) r = new Oe(e.beta, 16).toRed(this.red);
            else {
                var n = this._getEndoRoots(this.p);
                r = n[0].cmp(n[1]) < 0 ? n[0] : n[1], r = r.toRed(this.red);
            }
            if (e.lambda) i = new Oe(e.lambda, 16);
            else {
                var f = this._getEndoRoots(this.n);
                this.g.mul(f[0]).x.cmp(this.g.x.redMul(r)) === 0 ? i = f[0] : (i = f[1], z4(this.g.mul(i).x.cmp(this.g.x.redMul(r)) === 0));
            }
            var o;
            return e.basis ? o = e.basis.map(function(u) {
                return {
                    a: new Oe(u.a, 16),
                    b: new Oe(u.b, 16)
                };
            }) : o = this._getEndoBasis(i), {
                beta: r,
                lambda: i,
                basis: o
            };
        }
    };
    Mt.prototype._getEndoRoots = function(e) {
        var r = e === this.p ? this.red : Oe.mont(e), i = new Oe(2).toRed(r).redInvm(), n = i.redNeg(), f = new Oe(3).toRed(r).redNeg().redSqrt().redMul(i), o = n.redAdd(f).fromRed(), u = n.redSub(f).fromRed();
        return [
            o,
            u
        ];
    };
    Mt.prototype._getEndoBasis = function(e) {
        for(var r = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), i = e, n = this.n.clone(), f = new Oe(1), o = new Oe(0), u = new Oe(0), v = new Oe(1), _, x, S, A, B, I, P, F = 0, D, z; i.cmpn(0) !== 0;){
            var Ae = n.div(i);
            D = n.sub(Ae.mul(i)), z = u.sub(Ae.mul(f));
            var qe = v.sub(Ae.mul(o));
            if (!S && D.cmp(r) < 0) _ = P.neg(), x = f, S = D.neg(), A = z;
            else if (S && ++F === 2) break;
            P = D, n = i, i = D, u = f, f = z, v = o, o = qe;
        }
        B = D.neg(), I = z;
        var Pe = S.sqr().add(A.sqr()), Re = B.sqr().add(I.sqr());
        return Re.cmp(Pe) >= 0 && (B = _, I = x), S.negative && (S = S.neg(), A = A.neg()), B.negative && (B = B.neg(), I = I.neg()), [
            {
                a: S,
                b: A
            },
            {
                a: B,
                b: I
            }
        ];
    };
    Mt.prototype._endoSplit = function(e) {
        var r = this.endo.basis, i = r[0], n = r[1], f = n.b.mul(e).divRound(this.n), o = i.b.neg().mul(e).divRound(this.n), u = f.mul(i.a), v = o.mul(n.a), _ = f.mul(i.b), x = o.mul(n.b), S = e.sub(u).sub(v), A = _.add(x).neg();
        return {
            k1: S,
            k2: A
        };
    };
    Mt.prototype.pointFromX = function(e, r) {
        e = new Oe(e, 16), e.red || (e = e.toRed(this.red));
        var i = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), n = i.redSqrt();
        if (n.redSqr().redSub(i).cmp(this.zero) !== 0) throw new Error("invalid point");
        var f = n.fromRed().isOdd();
        return (r && !f || !r && f) && (n = n.redNeg()), this.point(e, n);
    };
    Mt.prototype.validate = function(e) {
        if (e.inf) return !0;
        var r = e.x, i = e.y, n = this.a.redMul(r), f = r.redSqr().redMul(r).redIAdd(n).redIAdd(this.b);
        return i.redSqr().redISub(f).cmpn(0) === 0;
    };
    Mt.prototype._endoWnafMulAdd = function(e, r, i) {
        for(var n = this._endoWnafT1, f = this._endoWnafT2, o = 0; o < e.length; o++){
            var u = this._endoSplit(r[o]), v = e[o], _ = v._getBeta();
            u.k1.negative && (u.k1.ineg(), v = v.neg(!0)), u.k2.negative && (u.k2.ineg(), _ = _.neg(!0)), n[o * 2] = v, n[o * 2 + 1] = _, f[o * 2] = u.k1, f[o * 2 + 1] = u.k2;
        }
        for(var x = this._wnafMulAdd(1, n, f, o * 2, i), S = 0; S < o * 2; S++)n[S] = null, f[S] = null;
        return x;
    };
    function Ve(t, e, r, i) {
        Hi.BasePoint.call(this, t, "affine"), e === null && r === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new Oe(e, 16), this.y = new Oe(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
    }
    Uo(Ve, Hi.BasePoint);
    Mt.prototype.point = function(e, r, i) {
        return new Ve(this, e, r, i);
    };
    Mt.prototype.pointFromJSON = function(e, r) {
        return Ve.fromJSON(this, e, r);
    };
    Ve.prototype._getBeta = function() {
        if (this.curve.endo) {
            var e = this.precomputed;
            if (e && e.beta) return e.beta;
            var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
            if (e) {
                var i = this.curve, n = function(f) {
                    return i.point(f.x.redMul(i.endo.beta), f.y);
                };
                e.beta = r, r.precomputed = {
                    beta: null,
                    naf: e.naf && {
                        wnd: e.naf.wnd,
                        points: e.naf.points.map(n)
                    },
                    doubles: e.doubles && {
                        step: e.doubles.step,
                        points: e.doubles.points.map(n)
                    }
                };
            }
            return r;
        }
    };
    Ve.prototype.toJSON = function() {
        return this.precomputed ? [
            this.x,
            this.y,
            this.precomputed && {
                doubles: this.precomputed.doubles && {
                    step: this.precomputed.doubles.step,
                    points: this.precomputed.doubles.points.slice(1)
                },
                naf: this.precomputed.naf && {
                    wnd: this.precomputed.naf.wnd,
                    points: this.precomputed.naf.points.slice(1)
                }
            }
        ] : [
            this.x,
            this.y
        ];
    };
    Ve.fromJSON = function(e, r, i) {
        typeof r == "string" && (r = JSON.parse(r));
        var n = e.point(r[0], r[1], i);
        if (!r[2]) return n;
        function f(u) {
            return e.point(u[0], u[1], i);
        }
        var o = r[2];
        return n.precomputed = {
            beta: null,
            doubles: o.doubles && {
                step: o.doubles.step,
                points: [
                    n
                ].concat(o.doubles.points.map(f))
            },
            naf: o.naf && {
                wnd: o.naf.wnd,
                points: [
                    n
                ].concat(o.naf.points.map(f))
            }
        }, n;
    };
    Ve.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    };
    Ve.prototype.isInfinity = function() {
        return this.inf;
    };
    Ve.prototype.add = function(e) {
        if (this.inf) return e;
        if (e.inf) return this;
        if (this.eq(e)) return this.dbl();
        if (this.neg().eq(e)) return this.curve.point(null, null);
        if (this.x.cmp(e.x) === 0) return this.curve.point(null, null);
        var r = this.y.redSub(e.y);
        r.cmpn(0) !== 0 && (r = r.redMul(this.x.redSub(e.x).redInvm()));
        var i = r.redSqr().redISub(this.x).redISub(e.x), n = r.redMul(this.x.redSub(i)).redISub(this.y);
        return this.curve.point(i, n);
    };
    Ve.prototype.dbl = function() {
        if (this.inf) return this;
        var e = this.y.redAdd(this.y);
        if (e.cmpn(0) === 0) return this.curve.point(null, null);
        var r = this.curve.a, i = this.x.redSqr(), n = e.redInvm(), f = i.redAdd(i).redIAdd(i).redIAdd(r).redMul(n), o = f.redSqr().redISub(this.x.redAdd(this.x)), u = f.redMul(this.x.redSub(o)).redISub(this.y);
        return this.curve.point(o, u);
    };
    Ve.prototype.getX = function() {
        return this.x.fromRed();
    };
    Ve.prototype.getY = function() {
        return this.y.fromRed();
    };
    Ve.prototype.mul = function(e) {
        return e = new Oe(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([
            this
        ], [
            e
        ]) : this.curve._wnafMul(this, e);
    };
    Ve.prototype.mulAdd = function(e, r, i) {
        var n = [
            this,
            r
        ], f = [
            e,
            i
        ];
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, f) : this.curve._wnafMulAdd(1, n, f, 2);
    };
    Ve.prototype.jmulAdd = function(e, r, i) {
        var n = [
            this,
            r
        ], f = [
            e,
            i
        ];
        return this.curve.endo ? this.curve._endoWnafMulAdd(n, f, !0) : this.curve._wnafMulAdd(1, n, f, 2, !0);
    };
    Ve.prototype.eq = function(e) {
        return this === e || this.inf === e.inf && (this.inf || this.x.cmp(e.x) === 0 && this.y.cmp(e.y) === 0);
    };
    Ve.prototype.neg = function(e) {
        if (this.inf) return this;
        var r = this.curve.point(this.x, this.y.redNeg());
        if (e && this.precomputed) {
            var i = this.precomputed, n = function(f) {
                return f.neg();
            };
            r.precomputed = {
                naf: i.naf && {
                    wnd: i.naf.wnd,
                    points: i.naf.points.map(n)
                },
                doubles: i.doubles && {
                    step: i.doubles.step,
                    points: i.doubles.points.map(n)
                }
            };
        }
        return r;
    };
    Ve.prototype.toJ = function() {
        if (this.inf) return this.curve.jpoint(null, null, null);
        var e = this.curve.jpoint(this.x, this.y, this.curve.one);
        return e;
    };
    function Ye(t, e, r, i) {
        Hi.BasePoint.call(this, t, "jacobian"), e === null && r === null && i === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new Oe(0)) : (this.x = new Oe(e, 16), this.y = new Oe(r, 16), this.z = new Oe(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
    }
    Uo(Ye, Hi.BasePoint);
    Mt.prototype.jpoint = function(e, r, i) {
        return new Ye(this, e, r, i);
    };
    Ye.prototype.toP = function() {
        if (this.isInfinity()) return this.curve.point(null, null);
        var e = this.z.redInvm(), r = e.redSqr(), i = this.x.redMul(r), n = this.y.redMul(r).redMul(e);
        return this.curve.point(i, n);
    };
    Ye.prototype.neg = function() {
        return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    };
    Ye.prototype.add = function(e) {
        if (this.isInfinity()) return e;
        if (e.isInfinity()) return this;
        var r = e.z.redSqr(), i = this.z.redSqr(), n = this.x.redMul(r), f = e.x.redMul(i), o = this.y.redMul(r.redMul(e.z)), u = e.y.redMul(i.redMul(this.z)), v = n.redSub(f), _ = o.redSub(u);
        if (v.cmpn(0) === 0) return _.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
        var x = v.redSqr(), S = x.redMul(v), A = n.redMul(x), B = _.redSqr().redIAdd(S).redISub(A).redISub(A), I = _.redMul(A.redISub(B)).redISub(o.redMul(S)), P = this.z.redMul(e.z).redMul(v);
        return this.curve.jpoint(B, I, P);
    };
    Ye.prototype.mixedAdd = function(e) {
        if (this.isInfinity()) return e.toJ();
        if (e.isInfinity()) return this;
        var r = this.z.redSqr(), i = this.x, n = e.x.redMul(r), f = this.y, o = e.y.redMul(r).redMul(this.z), u = i.redSub(n), v = f.redSub(o);
        if (u.cmpn(0) === 0) return v.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
        var _ = u.redSqr(), x = _.redMul(u), S = i.redMul(_), A = v.redSqr().redIAdd(x).redISub(S).redISub(S), B = v.redMul(S.redISub(A)).redISub(f.redMul(x)), I = this.z.redMul(u);
        return this.curve.jpoint(A, B, I);
    };
    Ye.prototype.dblp = function(e) {
        if (e === 0) return this;
        if (this.isInfinity()) return this;
        if (!e) return this.dbl();
        var r;
        if (this.curve.zeroA || this.curve.threeA) {
            var i = this;
            for(r = 0; r < e; r++)i = i.dbl();
            return i;
        }
        var n = this.curve.a, f = this.curve.tinv, o = this.x, u = this.y, v = this.z, _ = v.redSqr().redSqr(), x = u.redAdd(u);
        for(r = 0; r < e; r++){
            var S = o.redSqr(), A = x.redSqr(), B = A.redSqr(), I = S.redAdd(S).redIAdd(S).redIAdd(n.redMul(_)), P = o.redMul(A), F = I.redSqr().redISub(P.redAdd(P)), D = P.redISub(F), z = I.redMul(D);
            z = z.redIAdd(z).redISub(B);
            var Ae = x.redMul(v);
            r + 1 < e && (_ = _.redMul(B)), o = F, v = Ae, x = z;
        }
        return this.curve.jpoint(o, x.redMul(f), v);
    };
    Ye.prototype.dbl = function() {
        return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
    };
    Ye.prototype._zeroDbl = function() {
        var e, r, i;
        if (this.zOne) {
            var n = this.x.redSqr(), f = this.y.redSqr(), o = f.redSqr(), u = this.x.redAdd(f).redSqr().redISub(n).redISub(o);
            u = u.redIAdd(u);
            var v = n.redAdd(n).redIAdd(n), _ = v.redSqr().redISub(u).redISub(u), x = o.redIAdd(o);
            x = x.redIAdd(x), x = x.redIAdd(x), e = _, r = v.redMul(u.redISub(_)).redISub(x), i = this.y.redAdd(this.y);
        } else {
            var S = this.x.redSqr(), A = this.y.redSqr(), B = A.redSqr(), I = this.x.redAdd(A).redSqr().redISub(S).redISub(B);
            I = I.redIAdd(I);
            var P = S.redAdd(S).redIAdd(S), F = P.redSqr(), D = B.redIAdd(B);
            D = D.redIAdd(D), D = D.redIAdd(D), e = F.redISub(I).redISub(I), r = P.redMul(I.redISub(e)).redISub(D), i = this.y.redMul(this.z), i = i.redIAdd(i);
        }
        return this.curve.jpoint(e, r, i);
    };
    Ye.prototype._threeDbl = function() {
        var e, r, i;
        if (this.zOne) {
            var n = this.x.redSqr(), f = this.y.redSqr(), o = f.redSqr(), u = this.x.redAdd(f).redSqr().redISub(n).redISub(o);
            u = u.redIAdd(u);
            var v = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a), _ = v.redSqr().redISub(u).redISub(u);
            e = _;
            var x = o.redIAdd(o);
            x = x.redIAdd(x), x = x.redIAdd(x), r = v.redMul(u.redISub(_)).redISub(x), i = this.y.redAdd(this.y);
        } else {
            var S = this.z.redSqr(), A = this.y.redSqr(), B = this.x.redMul(A), I = this.x.redSub(S).redMul(this.x.redAdd(S));
            I = I.redAdd(I).redIAdd(I);
            var P = B.redIAdd(B);
            P = P.redIAdd(P);
            var F = P.redAdd(P);
            e = I.redSqr().redISub(F), i = this.y.redAdd(this.z).redSqr().redISub(A).redISub(S);
            var D = A.redSqr();
            D = D.redIAdd(D), D = D.redIAdd(D), D = D.redIAdd(D), r = I.redMul(P.redISub(e)).redISub(D);
        }
        return this.curve.jpoint(e, r, i);
    };
    Ye.prototype._dbl = function() {
        var e = this.curve.a, r = this.x, i = this.y, n = this.z, f = n.redSqr().redSqr(), o = r.redSqr(), u = i.redSqr(), v = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(f)), _ = r.redAdd(r);
        _ = _.redIAdd(_);
        var x = _.redMul(u), S = v.redSqr().redISub(x.redAdd(x)), A = x.redISub(S), B = u.redSqr();
        B = B.redIAdd(B), B = B.redIAdd(B), B = B.redIAdd(B);
        var I = v.redMul(A).redISub(B), P = i.redAdd(i).redMul(n);
        return this.curve.jpoint(S, I, P);
    };
    Ye.prototype.trpl = function() {
        if (!this.curve.zeroA) return this.dbl().add(this);
        var e = this.x.redSqr(), r = this.y.redSqr(), i = this.z.redSqr(), n = r.redSqr(), f = e.redAdd(e).redIAdd(e), o = f.redSqr(), u = this.x.redAdd(r).redSqr().redISub(e).redISub(n);
        u = u.redIAdd(u), u = u.redAdd(u).redIAdd(u), u = u.redISub(o);
        var v = u.redSqr(), _ = n.redIAdd(n);
        _ = _.redIAdd(_), _ = _.redIAdd(_), _ = _.redIAdd(_);
        var x = f.redIAdd(u).redSqr().redISub(o).redISub(v).redISub(_), S = r.redMul(x);
        S = S.redIAdd(S), S = S.redIAdd(S);
        var A = this.x.redMul(v).redISub(S);
        A = A.redIAdd(A), A = A.redIAdd(A);
        var B = this.y.redMul(x.redMul(_.redISub(x)).redISub(u.redMul(v)));
        B = B.redIAdd(B), B = B.redIAdd(B), B = B.redIAdd(B);
        var I = this.z.redAdd(u).redSqr().redISub(i).redISub(v);
        return this.curve.jpoint(A, B, I);
    };
    Ye.prototype.mul = function(e, r) {
        return e = new Oe(e, r), this.curve._wnafMul(this, e);
    };
    Ye.prototype.eq = function(e) {
        if (e.type === "affine") return this.eq(e.toJ());
        if (this === e) return !0;
        var r = this.z.redSqr(), i = e.z.redSqr();
        if (this.x.redMul(i).redISub(e.x.redMul(r)).cmpn(0) !== 0) return !1;
        var n = r.redMul(this.z), f = i.redMul(e.z);
        return this.y.redMul(f).redISub(e.y.redMul(n)).cmpn(0) === 0;
    };
    Ye.prototype.eqXToP = function(e) {
        var r = this.z.redSqr(), i = e.toRed(this.curve.red).redMul(r);
        if (this.x.cmp(i) === 0) return !0;
        for(var n = e.clone(), f = this.curve.redN.redMul(r);;){
            if (n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0) return !1;
            if (i.redIAdd(f), this.x.cmp(i) === 0) return !0;
        }
    };
    Ye.prototype.inspect = function() {
        return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    };
    Ye.prototype.isInfinity = function() {
        return this.z.cmpn(0) === 0;
    };
});
var Jd = q((tm, Yd)=>{
    "use strict";
    var ji = je(), Xd = xe(), Ma = rf(), H4 = ut();
    function Ki(t) {
        Ma.call(this, "mont", t), this.a = new ji(t.a, 16).toRed(this.red), this.b = new ji(t.b, 16).toRed(this.red), this.i4 = new ji(4).toRed(this.red).redInvm(), this.two = new ji(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    Xd(Ki, Ma);
    Yd.exports = Ki;
    Ki.prototype.validate = function(e) {
        var r = e.normalize().x, i = r.redSqr(), n = i.redMul(r).redAdd(i.redMul(this.a)).redAdd(r), f = n.redSqrt();
        return f.redSqr().cmp(n) === 0;
    };
    function Ge(t, e, r) {
        Ma.BasePoint.call(this, t, "projective"), e === null && r === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new ji(e, 16), this.z = new ji(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
    }
    Xd(Ge, Ma.BasePoint);
    Ki.prototype.decodePoint = function(e, r) {
        return this.point(H4.toArray(e, r), 1);
    };
    Ki.prototype.point = function(e, r) {
        return new Ge(this, e, r);
    };
    Ki.prototype.pointFromJSON = function(e) {
        return Ge.fromJSON(this, e);
    };
    Ge.prototype.precompute = function() {};
    Ge.prototype._encode = function() {
        return this.getX().toArray("be", this.curve.p.byteLength());
    };
    Ge.fromJSON = function(e, r) {
        return new Ge(e, r[0], r[1] || e.one);
    };
    Ge.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Ge.prototype.isInfinity = function() {
        return this.z.cmpn(0) === 0;
    };
    Ge.prototype.dbl = function() {
        var e = this.x.redAdd(this.z), r = e.redSqr(), i = this.x.redSub(this.z), n = i.redSqr(), f = r.redSub(n), o = r.redMul(n), u = f.redMul(n.redAdd(this.curve.a24.redMul(f)));
        return this.curve.point(o, u);
    };
    Ge.prototype.add = function() {
        throw new Error("Not supported on Montgomery curve");
    };
    Ge.prototype.diffAdd = function(e, r) {
        var i = this.x.redAdd(this.z), n = this.x.redSub(this.z), f = e.x.redAdd(e.z), o = e.x.redSub(e.z), u = o.redMul(i), v = f.redMul(n), _ = r.z.redMul(u.redAdd(v).redSqr()), x = r.x.redMul(u.redISub(v).redSqr());
        return this.curve.point(_, x);
    };
    Ge.prototype.mul = function(e) {
        for(var r = e.clone(), i = this, n = this.curve.point(null, null), f = this, o = []; r.cmpn(0) !== 0; r.iushrn(1))o.push(r.andln(1));
        for(var u = o.length - 1; u >= 0; u--)o[u] === 0 ? (i = i.diffAdd(n, f), n = n.dbl()) : (n = i.diffAdd(n, f), i = i.dbl());
        return n;
    };
    Ge.prototype.mulAdd = function() {
        throw new Error("Not supported on Montgomery curve");
    };
    Ge.prototype.jumlAdd = function() {
        throw new Error("Not supported on Montgomery curve");
    };
    Ge.prototype.eq = function(e) {
        return this.getX().cmp(e.getX()) === 0;
    };
    Ge.prototype.normalize = function() {
        return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
    };
    Ge.prototype.getX = function() {
        return this.normalize(), this.x.fromRed();
    };
});
var el = q((rm, Qd)=>{
    "use strict";
    var j4 = ut(), ur = je(), $d = xe(), Sa = rf(), K4 = j4.assert;
    function Zt(t) {
        this.twisted = (t.a | 0) !== 1, this.mOneA = this.twisted && (t.a | 0) === -1, this.extended = this.mOneA, Sa.call(this, "edwards", t), this.a = new ur(t.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new ur(t.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new ur(t.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), K4(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (t.c | 0) === 1;
    }
    $d(Zt, Sa);
    Qd.exports = Zt;
    Zt.prototype._mulA = function(e) {
        return this.mOneA ? e.redNeg() : this.a.redMul(e);
    };
    Zt.prototype._mulC = function(e) {
        return this.oneC ? e : this.c.redMul(e);
    };
    Zt.prototype.jpoint = function(e, r, i, n) {
        return this.point(e, r, i, n);
    };
    Zt.prototype.pointFromX = function(e, r) {
        e = new ur(e, 16), e.red || (e = e.toRed(this.red));
        var i = e.redSqr(), n = this.c2.redSub(this.a.redMul(i)), f = this.one.redSub(this.c2.redMul(this.d).redMul(i)), o = n.redMul(f.redInvm()), u = o.redSqrt();
        if (u.redSqr().redSub(o).cmp(this.zero) !== 0) throw new Error("invalid point");
        var v = u.fromRed().isOdd();
        return (r && !v || !r && v) && (u = u.redNeg()), this.point(e, u);
    };
    Zt.prototype.pointFromY = function(e, r) {
        e = new ur(e, 16), e.red || (e = e.toRed(this.red));
        var i = e.redSqr(), n = i.redSub(this.c2), f = i.redMul(this.d).redMul(this.c2).redSub(this.a), o = n.redMul(f.redInvm());
        if (o.cmp(this.zero) === 0) {
            if (r) throw new Error("invalid point");
            return this.point(this.zero, e);
        }
        var u = o.redSqrt();
        if (u.redSqr().redSub(o).cmp(this.zero) !== 0) throw new Error("invalid point");
        return u.fromRed().isOdd() !== r && (u = u.redNeg()), this.point(u, e);
    };
    Zt.prototype.validate = function(e) {
        if (e.isInfinity()) return !0;
        e.normalize();
        var r = e.x.redSqr(), i = e.y.redSqr(), n = r.redMul(this.a).redAdd(i), f = this.c2.redMul(this.one.redAdd(this.d.redMul(r).redMul(i)));
        return n.cmp(f) === 0;
    };
    function Te(t, e, r, i, n) {
        Sa.BasePoint.call(this, t, "projective"), e === null && r === null && i === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new ur(e, 16), this.y = new ur(r, 16), this.z = i ? new ur(i, 16) : this.curve.one, this.t = n && new ur(n, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
    }
    $d(Te, Sa.BasePoint);
    Zt.prototype.pointFromJSON = function(e) {
        return Te.fromJSON(this, e);
    };
    Zt.prototype.point = function(e, r, i, n) {
        return new Te(this, e, r, i, n);
    };
    Te.fromJSON = function(e, r) {
        return new Te(e, r[0], r[1], r[2]);
    };
    Te.prototype.inspect = function() {
        return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Te.prototype.isInfinity = function() {
        return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
    };
    Te.prototype._extDbl = function() {
        var e = this.x.redSqr(), r = this.y.redSqr(), i = this.z.redSqr();
        i = i.redIAdd(i);
        var n = this.curve._mulA(e), f = this.x.redAdd(this.y).redSqr().redISub(e).redISub(r), o = n.redAdd(r), u = o.redSub(i), v = n.redSub(r), _ = f.redMul(u), x = o.redMul(v), S = f.redMul(v), A = u.redMul(o);
        return this.curve.point(_, x, A, S);
    };
    Te.prototype._projDbl = function() {
        var e = this.x.redAdd(this.y).redSqr(), r = this.x.redSqr(), i = this.y.redSqr(), n, f, o, u, v, _;
        if (this.curve.twisted) {
            u = this.curve._mulA(r);
            var x = u.redAdd(i);
            this.zOne ? (n = e.redSub(r).redSub(i).redMul(x.redSub(this.curve.two)), f = x.redMul(u.redSub(i)), o = x.redSqr().redSub(x).redSub(x)) : (v = this.z.redSqr(), _ = x.redSub(v).redISub(v), n = e.redSub(r).redISub(i).redMul(_), f = x.redMul(u.redSub(i)), o = x.redMul(_));
        } else u = r.redAdd(i), v = this.curve._mulC(this.z).redSqr(), _ = u.redSub(v).redSub(v), n = this.curve._mulC(e.redISub(u)).redMul(_), f = this.curve._mulC(u).redMul(r.redISub(i)), o = u.redMul(_);
        return this.curve.point(n, f, o);
    };
    Te.prototype.dbl = function() {
        return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
    };
    Te.prototype._extAdd = function(e) {
        var r = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), i = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), n = this.t.redMul(this.curve.dd).redMul(e.t), f = this.z.redMul(e.z.redAdd(e.z)), o = i.redSub(r), u = f.redSub(n), v = f.redAdd(n), _ = i.redAdd(r), x = o.redMul(u), S = v.redMul(_), A = o.redMul(_), B = u.redMul(v);
        return this.curve.point(x, S, B, A);
    };
    Te.prototype._projAdd = function(e) {
        var r = this.z.redMul(e.z), i = r.redSqr(), n = this.x.redMul(e.x), f = this.y.redMul(e.y), o = this.curve.d.redMul(n).redMul(f), u = i.redSub(o), v = i.redAdd(o), _ = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(n).redISub(f), x = r.redMul(u).redMul(_), S, A;
        return this.curve.twisted ? (S = r.redMul(v).redMul(f.redSub(this.curve._mulA(n))), A = u.redMul(v)) : (S = r.redMul(v).redMul(f.redSub(n)), A = this.curve._mulC(u).redMul(v)), this.curve.point(x, S, A);
    };
    Te.prototype.add = function(e) {
        return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
    };
    Te.prototype.mul = function(e) {
        return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
    };
    Te.prototype.mulAdd = function(e, r, i) {
        return this.curve._wnafMulAdd(1, [
            this,
            r
        ], [
            e,
            i
        ], 2, !1);
    };
    Te.prototype.jmulAdd = function(e, r, i) {
        return this.curve._wnafMulAdd(1, [
            this,
            r
        ], [
            e,
            i
        ], 2, !0);
    };
    Te.prototype.normalize = function() {
        if (this.zOne) return this;
        var e = this.z.redInvm();
        return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this;
    };
    Te.prototype.neg = function() {
        return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
    };
    Te.prototype.getX = function() {
        return this.normalize(), this.x.fromRed();
    };
    Te.prototype.getY = function() {
        return this.normalize(), this.y.fromRed();
    };
    Te.prototype.eq = function(e) {
        return this === e || this.getX().cmp(e.getX()) === 0 && this.getY().cmp(e.getY()) === 0;
    };
    Te.prototype.eqXToP = function(e) {
        var r = e.toRed(this.curve.red).redMul(this.z);
        if (this.x.cmp(r) === 0) return !0;
        for(var i = e.clone(), n = this.curve.redN.redMul(this.z);;){
            if (i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0) return !1;
            if (r.redIAdd(n), this.x.cmp(r) === 0) return !0;
        }
    };
    Te.prototype.toP = Te.prototype.normalize;
    Te.prototype.mixedAdd = Te.prototype.add;
});
var zo = q((tl)=>{
    "use strict";
    var Ea = tl;
    Ea.base = rf();
    Ea.short = Zd();
    Ea.mont = Jd();
    Ea.edwards = el();
});
var Dt = q((Ce)=>{
    "use strict";
    var W4 = ct(), V4 = xe();
    Ce.inherits = V4;
    function G4(t, e) {
        return (t.charCodeAt(e) & 64512) !== 55296 || e < 0 || e + 1 >= t.length ? !1 : (t.charCodeAt(e + 1) & 64512) === 56320;
    }
    function Z4(t, e) {
        if (Array.isArray(t)) return t.slice();
        if (!t) return [];
        var r = [];
        if (typeof t == "string") {
            if (e) {
                if (e === "hex") for(t = t.replace(/[^a-z0-9]+/ig, ""), t.length % 2 !== 0 && (t = "0" + t), n = 0; n < t.length; n += 2)r.push(parseInt(t[n] + t[n + 1], 16));
            } else for(var i = 0, n = 0; n < t.length; n++){
                var f = t.charCodeAt(n);
                f < 128 ? r[i++] = f : f < 2048 ? (r[i++] = f >> 6 | 192, r[i++] = f & 63 | 128) : G4(t, n) ? (f = 65536 + ((f & 1023) << 10) + (t.charCodeAt(++n) & 1023), r[i++] = f >> 18 | 240, r[i++] = f >> 12 & 63 | 128, r[i++] = f >> 6 & 63 | 128, r[i++] = f & 63 | 128) : (r[i++] = f >> 12 | 224, r[i++] = f >> 6 & 63 | 128, r[i++] = f & 63 | 128);
            }
        } else for(n = 0; n < t.length; n++)r[n] = t[n] | 0;
        return r;
    }
    Ce.toArray = Z4;
    function X4(t) {
        for(var e = "", r = 0; r < t.length; r++)e += il(t[r].toString(16));
        return e;
    }
    Ce.toHex = X4;
    function rl(t) {
        var e = t >>> 24 | t >>> 8 & 65280 | t << 8 & 16711680 | (t & 255) << 24;
        return e >>> 0;
    }
    Ce.htonl = rl;
    function Y4(t, e) {
        for(var r = "", i = 0; i < t.length; i++){
            var n = t[i];
            e === "little" && (n = rl(n)), r += nl(n.toString(16));
        }
        return r;
    }
    Ce.toHex32 = Y4;
    function il(t) {
        return t.length === 1 ? "0" + t : t;
    }
    Ce.zero2 = il;
    function nl(t) {
        return t.length === 7 ? "0" + t : t.length === 6 ? "00" + t : t.length === 5 ? "000" + t : t.length === 4 ? "0000" + t : t.length === 3 ? "00000" + t : t.length === 2 ? "000000" + t : t.length === 1 ? "0000000" + t : t;
    }
    Ce.zero8 = nl;
    function J4(t, e, r, i) {
        var n = r - e;
        W4(n % 4 === 0);
        for(var f = new Array(n / 4), o = 0, u = e; o < f.length; o++, u += 4){
            var v;
            i === "big" ? v = t[u] << 24 | t[u + 1] << 16 | t[u + 2] << 8 | t[u + 3] : v = t[u + 3] << 24 | t[u + 2] << 16 | t[u + 1] << 8 | t[u], f[o] = v >>> 0;
        }
        return f;
    }
    Ce.join32 = J4;
    function $4(t, e) {
        for(var r = new Array(t.length * 4), i = 0, n = 0; i < t.length; i++, n += 4){
            var f = t[i];
            e === "big" ? (r[n] = f >>> 24, r[n + 1] = f >>> 16 & 255, r[n + 2] = f >>> 8 & 255, r[n + 3] = f & 255) : (r[n + 3] = f >>> 24, r[n + 2] = f >>> 16 & 255, r[n + 1] = f >>> 8 & 255, r[n] = f & 255);
        }
        return r;
    }
    Ce.split32 = $4;
    function Q4(t, e) {
        return t >>> e | t << 32 - e;
    }
    Ce.rotr32 = Q4;
    function e8(t, e) {
        return t << e | t >>> 32 - e;
    }
    Ce.rotl32 = e8;
    function t8(t, e) {
        return t + e >>> 0;
    }
    Ce.sum32 = t8;
    function r8(t, e, r) {
        return t + e + r >>> 0;
    }
    Ce.sum32_3 = r8;
    function i8(t, e, r, i) {
        return t + e + r + i >>> 0;
    }
    Ce.sum32_4 = i8;
    function n8(t, e, r, i, n) {
        return t + e + r + i + n >>> 0;
    }
    Ce.sum32_5 = n8;
    function f8(t, e, r, i) {
        var n = t[e], f = t[e + 1], o = i + f >>> 0, u = (o < i ? 1 : 0) + r + n;
        t[e] = u >>> 0, t[e + 1] = o;
    }
    Ce.sum64 = f8;
    function a8(t, e, r, i) {
        var n = e + i >>> 0, f = (n < e ? 1 : 0) + t + r;
        return f >>> 0;
    }
    Ce.sum64_hi = a8;
    function o8(t, e, r, i) {
        var n = e + i;
        return n >>> 0;
    }
    Ce.sum64_lo = o8;
    function s8(t, e, r, i, n, f, o, u) {
        var v = 0, _ = e;
        _ = _ + i >>> 0, v += _ < e ? 1 : 0, _ = _ + f >>> 0, v += _ < f ? 1 : 0, _ = _ + u >>> 0, v += _ < u ? 1 : 0;
        var x = t + r + n + o + v;
        return x >>> 0;
    }
    Ce.sum64_4_hi = s8;
    function h8(t, e, r, i, n, f, o, u) {
        var v = e + i + f + u;
        return v >>> 0;
    }
    Ce.sum64_4_lo = h8;
    function c8(t, e, r, i, n, f, o, u, v, _) {
        var x = 0, S = e;
        S = S + i >>> 0, x += S < e ? 1 : 0, S = S + f >>> 0, x += S < f ? 1 : 0, S = S + u >>> 0, x += S < u ? 1 : 0, S = S + _ >>> 0, x += S < _ ? 1 : 0;
        var A = t + r + n + o + v + x;
        return A >>> 0;
    }
    Ce.sum64_5_hi = c8;
    function u8(t, e, r, i, n, f, o, u, v, _) {
        var x = e + i + f + u + _;
        return x >>> 0;
    }
    Ce.sum64_5_lo = u8;
    function d8(t, e, r) {
        var i = e << 32 - r | t >>> r;
        return i >>> 0;
    }
    Ce.rotr64_hi = d8;
    function l8(t, e, r) {
        var i = t << 32 - r | e >>> r;
        return i >>> 0;
    }
    Ce.rotr64_lo = l8;
    function p8(t, e, r) {
        return t >>> r;
    }
    Ce.shr64_hi = p8;
    function b8(t, e, r) {
        var i = t << 32 - r | e >>> r;
        return i >>> 0;
    }
    Ce.shr64_lo = b8;
});
var Wi = q((al)=>{
    "use strict";
    var fl = Dt(), v8 = ct();
    function Aa() {
        this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
    }
    al.BlockHash = Aa;
    Aa.prototype.update = function(e, r) {
        if (e = fl.toArray(e, r), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
            e = this.pending;
            var i = e.length % this._delta8;
            this.pending = e.slice(e.length - i, e.length), this.pending.length === 0 && (this.pending = null), e = fl.join32(e, 0, e.length - i, this.endian);
            for(var n = 0; n < e.length; n += this._delta32)this._update(e, n, n + this._delta32);
        }
        return this;
    };
    Aa.prototype.digest = function(e) {
        return this.update(this._pad()), v8(this.pending === null), this._digest(e);
    };
    Aa.prototype._pad = function() {
        var e = this.pendingTotal, r = this._delta8, i = r - (e + this.padLength) % r, n = new Array(i + this.padLength);
        n[0] = 128;
        for(var f = 1; f < i; f++)n[f] = 0;
        if (e <<= 3, this.endian === "big") {
            for(var o = 8; o < this.padLength; o++)n[f++] = 0;
            n[f++] = 0, n[f++] = 0, n[f++] = 0, n[f++] = 0, n[f++] = e >>> 24 & 255, n[f++] = e >>> 16 & 255, n[f++] = e >>> 8 & 255, n[f++] = e & 255;
        } else for(n[f++] = e & 255, n[f++] = e >>> 8 & 255, n[f++] = e >>> 16 & 255, n[f++] = e >>> 24 & 255, n[f++] = 0, n[f++] = 0, n[f++] = 0, n[f++] = 0, o = 8; o < this.padLength; o++)n[f++] = 0;
        return n;
    };
});
var Ho = q((dr)=>{
    "use strict";
    var y8 = Dt(), Xt = y8.rotr32;
    function m8(t, e, r, i) {
        if (t === 0) return ol(e, r, i);
        if (t === 1 || t === 3) return hl(e, r, i);
        if (t === 2) return sl(e, r, i);
    }
    dr.ft_1 = m8;
    function ol(t, e, r) {
        return t & e ^ ~t & r;
    }
    dr.ch32 = ol;
    function sl(t, e, r) {
        return t & e ^ t & r ^ e & r;
    }
    dr.maj32 = sl;
    function hl(t, e, r) {
        return t ^ e ^ r;
    }
    dr.p32 = hl;
    function g8(t) {
        return Xt(t, 2) ^ Xt(t, 13) ^ Xt(t, 22);
    }
    dr.s0_256 = g8;
    function _8(t) {
        return Xt(t, 6) ^ Xt(t, 11) ^ Xt(t, 25);
    }
    dr.s1_256 = _8;
    function w8(t) {
        return Xt(t, 7) ^ Xt(t, 18) ^ t >>> 3;
    }
    dr.g0_256 = w8;
    function x8(t) {
        return Xt(t, 17) ^ Xt(t, 19) ^ t >>> 10;
    }
    dr.g1_256 = x8;
});
var dl = q((om, ul)=>{
    "use strict";
    var Vi = Dt(), M8 = Wi(), S8 = Ho(), jo = Vi.rotl32, nf = Vi.sum32, E8 = Vi.sum32_5, A8 = S8.ft_1, cl = M8.BlockHash, B8 = [
        1518500249,
        1859775393,
        2400959708,
        3395469782
    ];
    function Yt() {
        if (!(this instanceof Yt)) return new Yt;
        cl.call(this), this.h = [
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520
        ], this.W = new Array(80);
    }
    Vi.inherits(Yt, cl);
    ul.exports = Yt;
    Yt.blockSize = 512;
    Yt.outSize = 160;
    Yt.hmacStrength = 80;
    Yt.padLength = 64;
    Yt.prototype._update = function(e, r) {
        for(var i = this.W, n = 0; n < 16; n++)i[n] = e[r + n];
        for(; n < i.length; n++)i[n] = jo(i[n - 3] ^ i[n - 8] ^ i[n - 14] ^ i[n - 16], 1);
        var f = this.h[0], o = this.h[1], u = this.h[2], v = this.h[3], _ = this.h[4];
        for(n = 0; n < i.length; n++){
            var x = ~~(n / 20), S = E8(jo(f, 5), A8(x, o, u, v), _, i[n], B8[x]);
            _ = v, v = u, u = jo(o, 30), o = f, f = S;
        }
        this.h[0] = nf(this.h[0], f), this.h[1] = nf(this.h[1], o), this.h[2] = nf(this.h[2], u), this.h[3] = nf(this.h[3], v), this.h[4] = nf(this.h[4], _);
    };
    Yt.prototype._digest = function(e) {
        return e === "hex" ? Vi.toHex32(this.h, "big") : Vi.split32(this.h, "big");
    };
});
var Ko = q((sm, pl)=>{
    "use strict";
    var Gi = Dt(), q8 = Wi(), Zi = Ho(), R8 = ct(), Lt = Gi.sum32, I8 = Gi.sum32_4, k8 = Gi.sum32_5, C8 = Zi.ch32, T8 = Zi.maj32, P8 = Zi.s0_256, D8 = Zi.s1_256, L8 = Zi.g0_256, N8 = Zi.g1_256, ll = q8.BlockHash, O8 = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
    ];
    function Jt() {
        if (!(this instanceof Jt)) return new Jt;
        ll.call(this), this.h = [
            1779033703,
            3144134277,
            1013904242,
            2773480762,
            1359893119,
            2600822924,
            528734635,
            1541459225
        ], this.k = O8, this.W = new Array(64);
    }
    Gi.inherits(Jt, ll);
    pl.exports = Jt;
    Jt.blockSize = 512;
    Jt.outSize = 256;
    Jt.hmacStrength = 192;
    Jt.padLength = 64;
    Jt.prototype._update = function(e, r) {
        for(var i = this.W, n = 0; n < 16; n++)i[n] = e[r + n];
        for(; n < i.length; n++)i[n] = I8(N8(i[n - 2]), i[n - 7], L8(i[n - 15]), i[n - 16]);
        var f = this.h[0], o = this.h[1], u = this.h[2], v = this.h[3], _ = this.h[4], x = this.h[5], S = this.h[6], A = this.h[7];
        for(R8(this.k.length === i.length), n = 0; n < i.length; n++){
            var B = k8(A, D8(_), C8(_, x, S), this.k[n], i[n]), I = Lt(P8(f), T8(f, o, u));
            A = S, S = x, x = _, _ = Lt(v, B), v = u, u = o, o = f, f = Lt(B, I);
        }
        this.h[0] = Lt(this.h[0], f), this.h[1] = Lt(this.h[1], o), this.h[2] = Lt(this.h[2], u), this.h[3] = Lt(this.h[3], v), this.h[4] = Lt(this.h[4], _), this.h[5] = Lt(this.h[5], x), this.h[6] = Lt(this.h[6], S), this.h[7] = Lt(this.h[7], A);
    };
    Jt.prototype._digest = function(e) {
        return e === "hex" ? Gi.toHex32(this.h, "big") : Gi.split32(this.h, "big");
    };
});
var yl = q((hm, vl)=>{
    "use strict";
    var Wo = Dt(), bl = Ko();
    function lr() {
        if (!(this instanceof lr)) return new lr;
        bl.call(this), this.h = [
            3238371032,
            914150663,
            812702999,
            4144912697,
            4290775857,
            1750603025,
            1694076839,
            3204075428
        ];
    }
    Wo.inherits(lr, bl);
    vl.exports = lr;
    lr.blockSize = 512;
    lr.outSize = 224;
    lr.hmacStrength = 192;
    lr.padLength = 64;
    lr.prototype._digest = function(e) {
        return e === "hex" ? Wo.toHex32(this.h.slice(0, 7), "big") : Wo.split32(this.h.slice(0, 7), "big");
    };
});
var Zo = q((cm, wl)=>{
    "use strict";
    var ot = Dt(), F8 = Wi(), U8 = ct(), $t = ot.rotr64_hi, Qt = ot.rotr64_lo, ml = ot.shr64_hi, gl = ot.shr64_lo, Br = ot.sum64, Vo = ot.sum64_hi, Go = ot.sum64_lo, z8 = ot.sum64_4_hi, H8 = ot.sum64_4_lo, j8 = ot.sum64_5_hi, K8 = ot.sum64_5_lo, _l = F8.BlockHash, W8 = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
    ];
    function Nt() {
        if (!(this instanceof Nt)) return new Nt;
        _l.call(this), this.h = [
            1779033703,
            4089235720,
            3144134277,
            2227873595,
            1013904242,
            4271175723,
            2773480762,
            1595750129,
            1359893119,
            2917565137,
            2600822924,
            725511199,
            528734635,
            4215389547,
            1541459225,
            327033209
        ], this.k = W8, this.W = new Array(160);
    }
    ot.inherits(Nt, _l);
    wl.exports = Nt;
    Nt.blockSize = 1024;
    Nt.outSize = 512;
    Nt.hmacStrength = 192;
    Nt.padLength = 128;
    Nt.prototype._prepareBlock = function(e, r) {
        for(var i = this.W, n = 0; n < 32; n++)i[n] = e[r + n];
        for(; n < i.length; n += 2){
            var f = r5(i[n - 4], i[n - 3]), o = i5(i[n - 4], i[n - 3]), u = i[n - 14], v = i[n - 13], _ = e5(i[n - 30], i[n - 29]), x = t5(i[n - 30], i[n - 29]), S = i[n - 32], A = i[n - 31];
            i[n] = z8(f, o, u, v, _, x, S, A), i[n + 1] = H8(f, o, u, v, _, x, S, A);
        }
    };
    Nt.prototype._update = function(e, r) {
        this._prepareBlock(e, r);
        var i = this.W, n = this.h[0], f = this.h[1], o = this.h[2], u = this.h[3], v = this.h[4], _ = this.h[5], x = this.h[6], S = this.h[7], A = this.h[8], B = this.h[9], I = this.h[10], P = this.h[11], F = this.h[12], D = this.h[13], z = this.h[14], Ae = this.h[15];
        U8(this.k.length === i.length);
        for(var qe = 0; qe < i.length; qe += 2){
            var Pe = z, Re = Ae, Ue = $8(A, B), Ee = Q8(A, B), Fe = V8(A, B, I, P, F, D), E = G8(A, B, I, P, F, D), c = this.k[qe], m = this.k[qe + 1], l = i[qe], a = i[qe + 1], h = j8(Pe, Re, Ue, Ee, Fe, E, c, m, l, a), p = K8(Pe, Re, Ue, Ee, Fe, E, c, m, l, a);
            Pe = Y8(n, f), Re = J8(n, f), Ue = Z8(n, f, o, u, v, _), Ee = X8(n, f, o, u, v, _);
            var y = Vo(Pe, Re, Ue, Ee), b = Go(Pe, Re, Ue, Ee);
            z = F, Ae = D, F = I, D = P, I = A, P = B, A = Vo(x, S, h, p), B = Go(S, S, h, p), x = v, S = _, v = o, _ = u, o = n, u = f, n = Vo(h, p, y, b), f = Go(h, p, y, b);
        }
        Br(this.h, 0, n, f), Br(this.h, 2, o, u), Br(this.h, 4, v, _), Br(this.h, 6, x, S), Br(this.h, 8, A, B), Br(this.h, 10, I, P), Br(this.h, 12, F, D), Br(this.h, 14, z, Ae);
    };
    Nt.prototype._digest = function(e) {
        return e === "hex" ? ot.toHex32(this.h, "big") : ot.split32(this.h, "big");
    };
    function V8(t, e, r, i, n) {
        var f = t & r ^ ~t & n;
        return f < 0 && (f += 4294967296), f;
    }
    function G8(t, e, r, i, n, f) {
        var o = e & i ^ ~e & f;
        return o < 0 && (o += 4294967296), o;
    }
    function Z8(t, e, r, i, n) {
        var f = t & r ^ t & n ^ r & n;
        return f < 0 && (f += 4294967296), f;
    }
    function X8(t, e, r, i, n, f) {
        var o = e & i ^ e & f ^ i & f;
        return o < 0 && (o += 4294967296), o;
    }
    function Y8(t, e) {
        var r = $t(t, e, 28), i = $t(e, t, 2), n = $t(e, t, 7), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function J8(t, e) {
        var r = Qt(t, e, 28), i = Qt(e, t, 2), n = Qt(e, t, 7), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function $8(t, e) {
        var r = $t(t, e, 14), i = $t(t, e, 18), n = $t(e, t, 9), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function Q8(t, e) {
        var r = Qt(t, e, 14), i = Qt(t, e, 18), n = Qt(e, t, 9), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function e5(t, e) {
        var r = $t(t, e, 1), i = $t(t, e, 8), n = ml(t, e, 7), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function t5(t, e) {
        var r = Qt(t, e, 1), i = Qt(t, e, 8), n = gl(t, e, 7), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function r5(t, e) {
        var r = $t(t, e, 19), i = $t(e, t, 29), n = ml(t, e, 6), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
    function i5(t, e) {
        var r = Qt(t, e, 19), i = Qt(e, t, 29), n = gl(t, e, 6), f = r ^ i ^ n;
        return f < 0 && (f += 4294967296), f;
    }
});
var Sl = q((um, Ml)=>{
    "use strict";
    var Xo = Dt(), xl = Zo();
    function pr() {
        if (!(this instanceof pr)) return new pr;
        xl.call(this), this.h = [
            3418070365,
            3238371032,
            1654270250,
            914150663,
            2438529370,
            812702999,
            355462360,
            4144912697,
            1731405415,
            4290775857,
            2394180231,
            1750603025,
            3675008525,
            1694076839,
            1203062813,
            3204075428
        ];
    }
    Xo.inherits(pr, xl);
    Ml.exports = pr;
    pr.blockSize = 1024;
    pr.outSize = 384;
    pr.hmacStrength = 192;
    pr.padLength = 128;
    pr.prototype._digest = function(e) {
        return e === "hex" ? Xo.toHex32(this.h.slice(0, 12), "big") : Xo.split32(this.h.slice(0, 12), "big");
    };
});
var El = q((Xi)=>{
    "use strict";
    Xi.sha1 = dl();
    Xi.sha224 = yl();
    Xi.sha256 = Ko();
    Xi.sha384 = Sl();
    Xi.sha512 = Zo();
});
var kl = q((Il)=>{
    "use strict";
    var pi = Dt(), n5 = Wi(), Ba = pi.rotl32, Al = pi.sum32, ff = pi.sum32_3, Bl = pi.sum32_4, Rl = n5.BlockHash;
    function er() {
        if (!(this instanceof er)) return new er;
        Rl.call(this), this.h = [
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520
        ], this.endian = "little";
    }
    pi.inherits(er, Rl);
    Il.ripemd160 = er;
    er.blockSize = 512;
    er.outSize = 160;
    er.hmacStrength = 192;
    er.padLength = 64;
    er.prototype._update = function(e, r) {
        for(var i = this.h[0], n = this.h[1], f = this.h[2], o = this.h[3], u = this.h[4], v = i, _ = n, x = f, S = o, A = u, B = 0; B < 80; B++){
            var I = Al(Ba(Bl(i, ql(B, n, f, o), e[o5[B] + r], f5(B)), h5[B]), u);
            i = u, u = o, o = Ba(f, 10), f = n, n = I, I = Al(Ba(Bl(v, ql(79 - B, _, x, S), e[s5[B] + r], a5(B)), c5[B]), A), v = A, A = S, S = Ba(x, 10), x = _, _ = I;
        }
        I = ff(this.h[1], f, S), this.h[1] = ff(this.h[2], o, A), this.h[2] = ff(this.h[3], u, v), this.h[3] = ff(this.h[4], i, _), this.h[4] = ff(this.h[0], n, x), this.h[0] = I;
    };
    er.prototype._digest = function(e) {
        return e === "hex" ? pi.toHex32(this.h, "little") : pi.split32(this.h, "little");
    };
    function ql(t, e, r, i) {
        return t <= 15 ? e ^ r ^ i : t <= 31 ? e & r | ~e & i : t <= 47 ? (e | ~r) ^ i : t <= 63 ? e & i | r & ~i : e ^ (r | ~i);
    }
    function f5(t) {
        return t <= 15 ? 0 : t <= 31 ? 1518500249 : t <= 47 ? 1859775393 : t <= 63 ? 2400959708 : 2840853838;
    }
    function a5(t) {
        return t <= 15 ? 1352829926 : t <= 31 ? 1548603684 : t <= 47 ? 1836072691 : t <= 63 ? 2053994217 : 0;
    }
    var o5 = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        7,
        4,
        13,
        1,
        10,
        6,
        15,
        3,
        12,
        0,
        9,
        5,
        2,
        14,
        11,
        8,
        3,
        10,
        14,
        4,
        9,
        15,
        8,
        1,
        2,
        7,
        0,
        6,
        13,
        11,
        5,
        12,
        1,
        9,
        11,
        10,
        0,
        8,
        12,
        4,
        13,
        3,
        7,
        15,
        14,
        5,
        6,
        2,
        4,
        0,
        5,
        9,
        7,
        12,
        2,
        10,
        14,
        1,
        3,
        8,
        11,
        6,
        15,
        13
    ], s5 = [
        5,
        14,
        7,
        0,
        9,
        2,
        11,
        4,
        13,
        6,
        15,
        8,
        1,
        10,
        3,
        12,
        6,
        11,
        3,
        7,
        0,
        13,
        5,
        10,
        14,
        15,
        8,
        12,
        4,
        9,
        1,
        2,
        15,
        5,
        1,
        3,
        7,
        14,
        6,
        9,
        11,
        8,
        12,
        2,
        10,
        0,
        4,
        13,
        8,
        6,
        4,
        1,
        3,
        11,
        15,
        0,
        5,
        12,
        2,
        13,
        9,
        7,
        10,
        14,
        12,
        15,
        10,
        4,
        1,
        5,
        8,
        7,
        6,
        2,
        13,
        14,
        0,
        3,
        9,
        11
    ], h5 = [
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6
    ], c5 = [
        8,
        9,
        9,
        11,
        13,
        15,
        15,
        5,
        7,
        7,
        8,
        11,
        14,
        14,
        12,
        6,
        9,
        13,
        15,
        7,
        12,
        8,
        9,
        11,
        7,
        7,
        12,
        7,
        6,
        15,
        13,
        11,
        9,
        7,
        15,
        11,
        8,
        6,
        6,
        14,
        12,
        13,
        5,
        14,
        13,
        13,
        7,
        5,
        15,
        5,
        8,
        11,
        14,
        14,
        6,
        14,
        6,
        9,
        12,
        9,
        12,
        5,
        15,
        8,
        8,
        5,
        12,
        9,
        12,
        5,
        14,
        6,
        8,
        13,
        6,
        5,
        15,
        13,
        11,
        11
    ];
});
var Tl = q((pm, Cl)=>{
    "use strict";
    var u5 = Dt(), d5 = ct();
    function Yi(t, e, r) {
        if (!(this instanceof Yi)) return new Yi(t, e, r);
        this.Hash = t, this.blockSize = t.blockSize / 8, this.outSize = t.outSize / 8, this.inner = null, this.outer = null, this._init(u5.toArray(e, r));
    }
    Cl.exports = Yi;
    Yi.prototype._init = function(e) {
        e.length > this.blockSize && (e = new this.Hash().update(e).digest()), d5(e.length <= this.blockSize);
        for(var r = e.length; r < this.blockSize; r++)e.push(0);
        for(r = 0; r < e.length; r++)e[r] ^= 54;
        for(this.inner = new this.Hash().update(e), r = 0; r < e.length; r++)e[r] ^= 106;
        this.outer = new this.Hash().update(e);
    };
    Yi.prototype.update = function(e, r) {
        return this.inner.update(e, r), this;
    };
    Yi.prototype.digest = function(e) {
        return this.outer.update(this.inner.digest()), this.outer.digest(e);
    };
});
var qa = q((Pl)=>{
    var Je = Pl;
    Je.utils = Dt();
    Je.common = Wi();
    Je.sha = El();
    Je.ripemd = kl();
    Je.hmac = Tl();
    Je.sha1 = Je.sha.sha1;
    Je.sha256 = Je.sha.sha256;
    Je.sha224 = Je.sha.sha224;
    Je.sha384 = Je.sha.sha384;
    Je.sha512 = Je.sha.sha512;
    Je.ripemd160 = Je.ripemd.ripemd160;
});
var Ll = q((vm, Dl)=>{
    Dl.exports = {
        doubles: {
            step: 4,
            points: [
                [
                    "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
                    "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
                ],
                [
                    "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
                    "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
                ],
                [
                    "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
                    "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
                ],
                [
                    "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
                    "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
                ],
                [
                    "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
                    "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
                ],
                [
                    "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
                    "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
                ],
                [
                    "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
                    "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
                ],
                [
                    "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
                    "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
                ],
                [
                    "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
                    "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
                ],
                [
                    "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
                    "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
                ],
                [
                    "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
                    "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
                ],
                [
                    "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
                    "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
                ],
                [
                    "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
                    "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
                ],
                [
                    "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
                    "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
                ],
                [
                    "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
                    "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
                ],
                [
                    "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
                    "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
                ],
                [
                    "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
                    "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
                ],
                [
                    "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
                    "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
                ],
                [
                    "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
                    "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
                ],
                [
                    "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
                    "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
                ],
                [
                    "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
                    "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
                ],
                [
                    "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
                    "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
                ],
                [
                    "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
                    "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
                ],
                [
                    "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
                    "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
                ],
                [
                    "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
                    "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
                ],
                [
                    "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
                    "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
                ],
                [
                    "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
                    "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
                ],
                [
                    "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
                    "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
                ],
                [
                    "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
                    "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
                ],
                [
                    "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
                    "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
                ],
                [
                    "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
                    "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
                ],
                [
                    "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
                    "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
                ],
                [
                    "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
                    "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
                ],
                [
                    "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
                    "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
                ],
                [
                    "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
                    "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
                ],
                [
                    "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
                    "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
                ],
                [
                    "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
                    "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
                ],
                [
                    "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
                    "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
                ],
                [
                    "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
                    "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
                ],
                [
                    "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
                    "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
                ],
                [
                    "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
                    "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
                ],
                [
                    "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
                    "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
                ],
                [
                    "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
                    "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
                ],
                [
                    "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
                    "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
                ],
                [
                    "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
                    "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
                ],
                [
                    "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
                    "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
                ],
                [
                    "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
                    "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
                ],
                [
                    "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
                    "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
                ],
                [
                    "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
                    "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
                ],
                [
                    "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
                    "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
                ],
                [
                    "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
                    "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
                ],
                [
                    "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
                    "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
                ],
                [
                    "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
                    "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
                ],
                [
                    "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
                    "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
                ],
                [
                    "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
                    "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
                ],
                [
                    "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
                    "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
                ],
                [
                    "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
                    "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
                ],
                [
                    "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
                    "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
                ],
                [
                    "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
                    "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
                ],
                [
                    "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
                    "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
                ],
                [
                    "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
                    "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
                ],
                [
                    "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
                    "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
                ],
                [
                    "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
                    "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
                ],
                [
                    "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
                    "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
                ],
                [
                    "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
                    "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
                ]
            ]
        },
        naf: {
            wnd: 7,
            points: [
                [
                    "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
                    "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
                ],
                [
                    "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
                    "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
                ],
                [
                    "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
                    "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
                ],
                [
                    "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
                    "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
                ],
                [
                    "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
                    "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
                ],
                [
                    "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
                    "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
                ],
                [
                    "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
                    "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
                ],
                [
                    "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
                    "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
                ],
                [
                    "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
                    "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
                ],
                [
                    "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
                    "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
                ],
                [
                    "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
                    "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
                ],
                [
                    "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
                    "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
                ],
                [
                    "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
                    "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
                ],
                [
                    "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
                    "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
                ],
                [
                    "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
                    "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
                ],
                [
                    "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
                    "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
                ],
                [
                    "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
                    "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
                ],
                [
                    "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
                    "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
                ],
                [
                    "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
                    "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
                ],
                [
                    "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
                    "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
                ],
                [
                    "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
                    "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
                ],
                [
                    "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
                    "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
                ],
                [
                    "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
                    "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
                ],
                [
                    "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
                    "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
                ],
                [
                    "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
                    "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
                ],
                [
                    "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
                    "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
                ],
                [
                    "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
                    "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
                ],
                [
                    "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
                    "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
                ],
                [
                    "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
                    "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
                ],
                [
                    "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
                    "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
                ],
                [
                    "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
                    "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
                ],
                [
                    "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
                    "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
                ],
                [
                    "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
                    "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
                ],
                [
                    "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
                    "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
                ],
                [
                    "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
                    "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
                ],
                [
                    "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
                    "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
                ],
                [
                    "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
                    "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
                ],
                [
                    "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
                    "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
                ],
                [
                    "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
                    "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
                ],
                [
                    "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
                    "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
                ],
                [
                    "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
                    "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
                ],
                [
                    "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
                    "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
                ],
                [
                    "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
                    "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
                ],
                [
                    "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
                    "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
                ],
                [
                    "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
                    "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
                ],
                [
                    "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
                    "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
                ],
                [
                    "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
                    "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
                ],
                [
                    "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
                    "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
                ],
                [
                    "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
                    "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
                ],
                [
                    "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
                    "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
                ],
                [
                    "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
                    "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
                ],
                [
                    "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
                    "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
                ],
                [
                    "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
                    "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
                ],
                [
                    "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
                    "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
                ],
                [
                    "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
                    "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
                ],
                [
                    "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
                    "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
                ],
                [
                    "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
                    "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
                ],
                [
                    "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
                    "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
                ],
                [
                    "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
                    "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
                ],
                [
                    "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
                    "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
                ],
                [
                    "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
                    "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
                ],
                [
                    "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
                    "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
                ],
                [
                    "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
                    "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
                ],
                [
                    "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
                    "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
                ],
                [
                    "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
                    "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
                ],
                [
                    "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
                    "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
                ],
                [
                    "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
                    "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
                ],
                [
                    "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
                    "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
                ],
                [
                    "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
                    "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
                ],
                [
                    "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
                    "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
                ],
                [
                    "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
                    "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
                ],
                [
                    "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
                    "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
                ],
                [
                    "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
                    "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
                ],
                [
                    "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
                    "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
                ],
                [
                    "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
                    "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
                ],
                [
                    "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
                    "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
                ],
                [
                    "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
                    "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
                ],
                [
                    "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
                    "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
                ],
                [
                    "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
                    "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
                ],
                [
                    "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
                    "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
                ],
                [
                    "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
                    "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
                ],
                [
                    "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
                    "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
                ],
                [
                    "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
                    "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
                ],
                [
                    "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
                    "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
                ],
                [
                    "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
                    "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
                ],
                [
                    "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
                    "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
                ],
                [
                    "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
                    "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
                ],
                [
                    "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
                    "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
                ],
                [
                    "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
                    "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
                ],
                [
                    "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
                    "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
                ],
                [
                    "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
                    "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
                ],
                [
                    "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
                    "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
                ],
                [
                    "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
                    "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
                ],
                [
                    "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
                    "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
                ],
                [
                    "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
                    "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
                ],
                [
                    "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
                    "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
                ],
                [
                    "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
                    "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
                ],
                [
                    "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
                    "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
                ],
                [
                    "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
                    "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
                ],
                [
                    "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
                    "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
                ],
                [
                    "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
                    "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
                ],
                [
                    "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
                    "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
                ],
                [
                    "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
                    "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
                ],
                [
                    "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
                    "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
                ],
                [
                    "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
                    "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
                ],
                [
                    "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
                    "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
                ],
                [
                    "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
                    "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
                ],
                [
                    "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
                    "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
                ],
                [
                    "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
                    "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
                ],
                [
                    "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
                    "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
                ],
                [
                    "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
                    "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
                ],
                [
                    "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
                    "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
                ],
                [
                    "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
                    "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
                ],
                [
                    "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
                    "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
                ],
                [
                    "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
                    "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
                ],
                [
                    "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
                    "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
                ],
                [
                    "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
                    "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
                ],
                [
                    "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
                    "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
                ],
                [
                    "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
                    "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
                ],
                [
                    "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
                    "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
                ],
                [
                    "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
                    "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
                ],
                [
                    "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
                    "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
                ],
                [
                    "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
                    "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
                ],
                [
                    "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
                    "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
                ],
                [
                    "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
                    "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
                ],
                [
                    "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
                    "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
                ],
                [
                    "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
                    "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
                ]
            ]
        }
    };
});
var Ra = q((Fl)=>{
    "use strict";
    var Jo = Fl, qr = qa(), Yo = zo(), l5 = ut(), Nl = l5.assert;
    function Ol(t) {
        t.type === "short" ? this.curve = new Yo.short(t) : t.type === "edwards" ? this.curve = new Yo.edwards(t) : this.curve = new Yo.mont(t), this.g = this.curve.g, this.n = this.curve.n, this.hash = t.hash, Nl(this.g.validate(), "Invalid curve"), Nl(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    Jo.PresetCurve = Ol;
    function Rr(t, e) {
        Object.defineProperty(Jo, t, {
            configurable: !0,
            enumerable: !0,
            get: function() {
                var r = new Ol(e);
                return Object.defineProperty(Jo, t, {
                    configurable: !0,
                    enumerable: !0,
                    value: r
                }), r;
            }
        });
    }
    Rr("p192", {
        type: "short",
        prime: "p192",
        p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
        b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
        n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
        hash: qr.sha256,
        gRed: !1,
        g: [
            "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
            "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
        ]
    });
    Rr("p224", {
        type: "short",
        prime: "p224",
        p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
        b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
        n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
        hash: qr.sha256,
        gRed: !1,
        g: [
            "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
            "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
        ]
    });
    Rr("p256", {
        type: "short",
        prime: null,
        p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
        a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
        b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
        n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
        hash: qr.sha256,
        gRed: !1,
        g: [
            "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
            "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
        ]
    });
    Rr("p384", {
        type: "short",
        prime: null,
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
        a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
        b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
        n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
        hash: qr.sha384,
        gRed: !1,
        g: [
            "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
            "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
        ]
    });
    Rr("p521", {
        type: "short",
        prime: null,
        p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
        a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
        b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
        n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
        hash: qr.sha512,
        gRed: !1,
        g: [
            "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
            "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
        ]
    });
    Rr("curve25519", {
        type: "mont",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "76d06",
        b: "1",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: qr.sha256,
        gRed: !1,
        g: [
            "9"
        ]
    });
    Rr("ed25519", {
        type: "edwards",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "-1",
        c: "1",
        d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: qr.sha256,
        gRed: !1,
        g: [
            "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
            "6666666666666666666666666666666666666666666666666666666666666658"
        ]
    });
    var $o;
    try {
        $o = Ll();
    } catch (t) {
        $o = void 0;
    }
    Rr("secp256k1", {
        type: "short",
        prime: "k256",
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
        a: "0",
        b: "7",
        n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
        h: "1",
        hash: qr.sha256,
        beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
        lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
        basis: [
            {
                a: "3086d221a7d46bcde86c90e49284eb15",
                b: "-e4437ed6010e88286f547fa90abfe4c3"
            },
            {
                a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                b: "3086d221a7d46bcde86c90e49284eb15"
            }
        ],
        gRed: !1,
        g: [
            "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
            "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
            $o
        ]
    });
});
var Hl = q((mm, zl)=>{
    "use strict";
    var p5 = qa(), bi = Fo(), Ul = ct();
    function Ir(t) {
        if (!(this instanceof Ir)) return new Ir(t);
        this.hash = t.hash, this.predResist = !!t.predResist, this.outLen = this.hash.outSize, this.minEntropy = t.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
        var e = bi.toArray(t.entropy, t.entropyEnc || "hex"), r = bi.toArray(t.nonce, t.nonceEnc || "hex"), i = bi.toArray(t.pers, t.persEnc || "hex");
        Ul(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(e, r, i);
    }
    zl.exports = Ir;
    Ir.prototype._init = function(e, r, i) {
        var n = e.concat(r).concat(i);
        this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
        for(var f = 0; f < this.V.length; f++)this.K[f] = 0, this.V[f] = 1;
        this._update(n), this._reseed = 1, this.reseedInterval = 281474976710656;
    };
    Ir.prototype._hmac = function() {
        return new p5.hmac(this.hash, this.K);
    };
    Ir.prototype._update = function(e) {
        var r = this._hmac().update(this.V).update([
            0
        ]);
        e && (r = r.update(e)), this.K = r.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([
            1
        ]).update(e).digest(), this.V = this._hmac().update(this.V).digest());
    };
    Ir.prototype.reseed = function(e, r, i, n) {
        typeof r != "string" && (n = i, i = r, r = null), e = bi.toArray(e, r), i = bi.toArray(i, n), Ul(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(i || [])), this._reseed = 1;
    };
    Ir.prototype.generate = function(e, r, i, n) {
        if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
        typeof r != "string" && (n = i, i = r, r = null), i && (i = bi.toArray(i, n || "hex"), this._update(i));
        for(var f = []; f.length < e;)this.V = this._hmac().update(this.V).digest(), f = f.concat(this.V);
        var o = f.slice(0, e);
        return this._update(i), this._reseed++, bi.encode(o, r);
    };
});
var Kl = q((gm, jl)=>{
    "use strict";
    var b5 = je(), v5 = ut(), Qo = v5.assert;
    function rt(t, e) {
        this.ec = t, this.priv = null, this.pub = null, e.priv && this._importPrivate(e.priv, e.privEnc), e.pub && this._importPublic(e.pub, e.pubEnc);
    }
    jl.exports = rt;
    rt.fromPublic = function(e, r, i) {
        return r instanceof rt ? r : new rt(e, {
            pub: r,
            pubEnc: i
        });
    };
    rt.fromPrivate = function(e, r, i) {
        return r instanceof rt ? r : new rt(e, {
            priv: r,
            privEnc: i
        });
    };
    rt.prototype.validate = function() {
        var e = this.getPublic();
        return e.isInfinity() ? {
            result: !1,
            reason: "Invalid public key"
        } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
            result: !0,
            reason: null
        } : {
            result: !1,
            reason: "Public key * N != O"
        } : {
            result: !1,
            reason: "Public key is not a point"
        };
    };
    rt.prototype.getPublic = function(e, r) {
        return typeof e == "string" && (r = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), r ? this.pub.encode(r, e) : this.pub;
    };
    rt.prototype.getPrivate = function(e) {
        return e === "hex" ? this.priv.toString(16, 2) : this.priv;
    };
    rt.prototype._importPrivate = function(e, r) {
        this.priv = new b5(e, r || 16), this.priv = this.priv.umod(this.ec.curve.n);
    };
    rt.prototype._importPublic = function(e, r) {
        if (e.x || e.y) {
            this.ec.curve.type === "mont" ? Qo(e.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && Qo(e.x && e.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(e.x, e.y);
            return;
        }
        this.pub = this.ec.curve.decodePoint(e, r);
    };
    rt.prototype.derive = function(e) {
        return e.validate() || Qo(e.validate(), "public point not validated"), e.mul(this.priv).getX();
    };
    rt.prototype.sign = function(e, r, i) {
        return this.ec.sign(e, this, r, i);
    };
    rt.prototype.verify = function(e, r) {
        return this.ec.verify(e, r, this);
    };
    rt.prototype.inspect = function() {
        return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
});
var Gl = q((_m, Vl)=>{
    "use strict";
    var Ia = je(), rs = ut(), y5 = rs.assert;
    function ka(t, e) {
        if (t instanceof ka) return t;
        this._importDER(t, e) || (y5(t.r && t.s, "Signature without r or s"), this.r = new Ia(t.r, 16), this.s = new Ia(t.s, 16), t.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = t.recoveryParam);
    }
    Vl.exports = ka;
    function m5() {
        this.place = 0;
    }
    function es(t, e) {
        var r = t[e.place++];
        if (!(r & 128)) return r;
        var i = r & 15;
        if (i === 0 || i > 4) return !1;
        for(var n = 0, f = 0, o = e.place; f < i; f++, o++)n <<= 8, n |= t[o], n >>>= 0;
        return n <= 127 ? !1 : (e.place = o, n);
    }
    function Wl(t) {
        for(var e = 0, r = t.length - 1; !t[e] && !(t[e + 1] & 128) && e < r;)e++;
        return e === 0 ? t : t.slice(e);
    }
    ka.prototype._importDER = function(e, r) {
        e = rs.toArray(e, r);
        var i = new m5;
        if (e[i.place++] !== 48) return !1;
        var n = es(e, i);
        if (n === !1 || n + i.place !== e.length || e[i.place++] !== 2) return !1;
        var f = es(e, i);
        if (f === !1) return !1;
        var o = e.slice(i.place, f + i.place);
        if (i.place += f, e[i.place++] !== 2) return !1;
        var u = es(e, i);
        if (u === !1 || e.length !== u + i.place) return !1;
        var v = e.slice(i.place, u + i.place);
        if (o[0] === 0) {
            if (o[1] & 128) o = o.slice(1);
            else return !1;
        }
        if (v[0] === 0) {
            if (v[1] & 128) v = v.slice(1);
            else return !1;
        }
        return this.r = new Ia(o), this.s = new Ia(v), this.recoveryParam = null, !0;
    };
    function ts(t, e) {
        if (e < 128) {
            t.push(e);
            return;
        }
        var r = 1 + (Math.log(e) / Math.LN2 >>> 3);
        for(t.push(r | 128); --r;)t.push(e >>> (r << 3) & 255);
        t.push(e);
    }
    ka.prototype.toDER = function(e) {
        var r = this.r.toArray(), i = this.s.toArray();
        for(r[0] & 128 && (r = [
            0
        ].concat(r)), i[0] & 128 && (i = [
            0
        ].concat(i)), r = Wl(r), i = Wl(i); !i[0] && !(i[1] & 128);)i = i.slice(1);
        var n = [
            2
        ];
        ts(n, r.length), n = n.concat(r), n.push(2), ts(n, i.length);
        var f = n.concat(i), o = [
            48
        ];
        return ts(o, f.length), o = o.concat(f), rs.encode(o, e);
    };
});
var Jl = q((wm, Yl)=>{
    "use strict";
    var vi = je(), Zl = Hl(), g5 = ut(), is = Ra(), _5 = pa(), Xl = g5.assert, ns = Kl(), Ca = Gl();
    function St(t) {
        if (!(this instanceof St)) return new St(t);
        typeof t == "string" && (Xl(Object.prototype.hasOwnProperty.call(is, t), "Unknown curve " + t), t = is[t]), t instanceof is.PresetCurve && (t = {
            curve: t
        }), this.curve = t.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = t.curve.g, this.g.precompute(t.curve.n.bitLength() + 1), this.hash = t.hash || t.curve.hash;
    }
    Yl.exports = St;
    St.prototype.keyPair = function(e) {
        return new ns(this, e);
    };
    St.prototype.keyFromPrivate = function(e, r) {
        return ns.fromPrivate(this, e, r);
    };
    St.prototype.keyFromPublic = function(e, r) {
        return ns.fromPublic(this, e, r);
    };
    St.prototype.genKeyPair = function(e) {
        e || (e = {});
        for(var r = new Zl({
            hash: this.hash,
            pers: e.pers,
            persEnc: e.persEnc || "utf8",
            entropy: e.entropy || _5(this.hash.hmacStrength),
            entropyEnc: e.entropy && e.entropyEnc || "utf8",
            nonce: this.n.toArray()
        }), i = this.n.byteLength(), n = this.n.sub(new vi(2));;){
            var f = new vi(r.generate(i));
            if (!(f.cmp(n) > 0)) return f.iaddn(1), this.keyFromPrivate(f);
        }
    };
    St.prototype._truncateToN = function(e, r) {
        var i = e.byteLength() * 8 - this.n.bitLength();
        return i > 0 && (e = e.ushrn(i)), !r && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
    };
    St.prototype.sign = function(e, r, i, n) {
        typeof i == "object" && (n = i, i = null), n || (n = {}), r = this.keyFromPrivate(r, i), e = this._truncateToN(new vi(e, 16));
        for(var f = this.n.byteLength(), o = r.getPrivate().toArray("be", f), u = e.toArray("be", f), v = new Zl({
            hash: this.hash,
            entropy: o,
            nonce: u,
            pers: n.pers,
            persEnc: n.persEnc || "utf8"
        }), _ = this.n.sub(new vi(1)), x = 0;; x++){
            var S = n.k ? n.k(x) : new vi(v.generate(this.n.byteLength()));
            if (S = this._truncateToN(S, !0), !(S.cmpn(1) <= 0 || S.cmp(_) >= 0)) {
                var A = this.g.mul(S);
                if (!A.isInfinity()) {
                    var B = A.getX(), I = B.umod(this.n);
                    if (I.cmpn(0) !== 0) {
                        var P = S.invm(this.n).mul(I.mul(r.getPrivate()).iadd(e));
                        if (P = P.umod(this.n), P.cmpn(0) !== 0) {
                            var F = (A.getY().isOdd() ? 1 : 0) | (B.cmp(I) !== 0 ? 2 : 0);
                            return n.canonical && P.cmp(this.nh) > 0 && (P = this.n.sub(P), F ^= 1), new Ca({
                                r: I,
                                s: P,
                                recoveryParam: F
                            });
                        }
                    }
                }
            }
        }
    };
    St.prototype.verify = function(e, r, i, n) {
        e = this._truncateToN(new vi(e, 16)), i = this.keyFromPublic(i, n), r = new Ca(r, "hex");
        var f = r.r, o = r.s;
        if (f.cmpn(1) < 0 || f.cmp(this.n) >= 0 || o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
        var u = o.invm(this.n), v = u.mul(e).umod(this.n), _ = u.mul(f).umod(this.n), x;
        return this.curve._maxwellTrick ? (x = this.g.jmulAdd(v, i.getPublic(), _), x.isInfinity() ? !1 : x.eqXToP(f)) : (x = this.g.mulAdd(v, i.getPublic(), _), x.isInfinity() ? !1 : x.getX().umod(this.n).cmp(f) === 0);
    };
    St.prototype.recoverPubKey = function(t, e, r, i) {
        Xl((3 & r) === r, "The recovery param is more than two bits"), e = new Ca(e, i);
        var n = this.n, f = new vi(t), o = e.r, u = e.s, v = r & 1, _ = r >> 1;
        if (o.cmp(this.curve.p.umod(this.curve.n)) >= 0 && _) throw new Error("Unable to find sencond key candinate");
        _ ? o = this.curve.pointFromX(o.add(this.curve.n), v) : o = this.curve.pointFromX(o, v);
        var x = e.r.invm(n), S = n.sub(f).mul(x).umod(n), A = u.mul(x).umod(n);
        return this.g.mulAdd(S, o, A);
    };
    St.prototype.getKeyRecoveryParam = function(t, e, r, i) {
        if (e = new Ca(e, i), e.recoveryParam !== null) return e.recoveryParam;
        for(var n = 0; n < 4; n++){
            var f;
            try {
                f = this.recoverPubKey(t, e, n);
            } catch (o) {
                continue;
            }
            if (f.eq(r)) return n;
        }
        throw new Error("Unable to find valid recovery factor");
    };
});
var t1 = q((xm, e1)=>{
    "use strict";
    var af = ut(), Ql = af.assert, $l = af.parseBytes, Ji = af.cachedProperty;
    function Ze(t, e) {
        this.eddsa = t, this._secret = $l(e.secret), t.isPoint(e.pub) ? this._pub = e.pub : this._pubBytes = $l(e.pub);
    }
    Ze.fromPublic = function(e, r) {
        return r instanceof Ze ? r : new Ze(e, {
            pub: r
        });
    };
    Ze.fromSecret = function(e, r) {
        return r instanceof Ze ? r : new Ze(e, {
            secret: r
        });
    };
    Ze.prototype.secret = function() {
        return this._secret;
    };
    Ji(Ze, "pubBytes", function() {
        return this.eddsa.encodePoint(this.pub());
    });
    Ji(Ze, "pub", function() {
        return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
    });
    Ji(Ze, "privBytes", function() {
        var e = this.eddsa, r = this.hash(), i = e.encodingLength - 1, n = r.slice(0, e.encodingLength);
        return n[0] &= 248, n[i] &= 127, n[i] |= 64, n;
    });
    Ji(Ze, "priv", function() {
        return this.eddsa.decodeInt(this.privBytes());
    });
    Ji(Ze, "hash", function() {
        return this.eddsa.hash().update(this.secret()).digest();
    });
    Ji(Ze, "messagePrefix", function() {
        return this.hash().slice(this.eddsa.encodingLength);
    });
    Ze.prototype.sign = function(e) {
        return Ql(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this);
    };
    Ze.prototype.verify = function(e, r) {
        return this.eddsa.verify(e, r, this);
    };
    Ze.prototype.getSecret = function(e) {
        return Ql(this._secret, "KeyPair is public only"), af.encode(this.secret(), e);
    };
    Ze.prototype.getPublic = function(e) {
        return af.encode(this.pubBytes(), e);
    };
    e1.exports = Ze;
});
var i1 = q((Mm, r1)=>{
    "use strict";
    var w5 = je(), Ta = ut(), x5 = Ta.assert, Pa = Ta.cachedProperty, M5 = Ta.parseBytes;
    function yi(t, e) {
        this.eddsa = t, typeof e != "object" && (e = M5(e)), Array.isArray(e) && (e = {
            R: e.slice(0, t.encodingLength),
            S: e.slice(t.encodingLength)
        }), x5(e.R && e.S, "Signature without R or S"), t.isPoint(e.R) && (this._R = e.R), e.S instanceof w5 && (this._S = e.S), this._Rencoded = Array.isArray(e.R) ? e.R : e.Rencoded, this._Sencoded = Array.isArray(e.S) ? e.S : e.Sencoded;
    }
    Pa(yi, "S", function() {
        return this.eddsa.decodeInt(this.Sencoded());
    });
    Pa(yi, "R", function() {
        return this.eddsa.decodePoint(this.Rencoded());
    });
    Pa(yi, "Rencoded", function() {
        return this.eddsa.encodePoint(this.R());
    });
    Pa(yi, "Sencoded", function() {
        return this.eddsa.encodeInt(this.S());
    });
    yi.prototype.toBytes = function() {
        return this.Rencoded().concat(this.Sencoded());
    };
    yi.prototype.toHex = function() {
        return Ta.encode(this.toBytes(), "hex").toUpperCase();
    };
    r1.exports = yi;
});
var s1 = q((Sm, o1)=>{
    "use strict";
    var S5 = qa(), E5 = Ra(), $i = ut(), A5 = $i.assert, f1 = $i.parseBytes, a1 = t1(), n1 = i1();
    function st(t) {
        if (A5(t === "ed25519", "only tested with ed25519 so far"), !(this instanceof st)) return new st(t);
        t = E5[t].curve, this.curve = t, this.g = t.g, this.g.precompute(t.n.bitLength() + 1), this.pointClass = t.point().constructor, this.encodingLength = Math.ceil(t.n.bitLength() / 8), this.hash = S5.sha512;
    }
    o1.exports = st;
    st.prototype.sign = function(e, r) {
        e = f1(e);
        var i = this.keyFromSecret(r), n = this.hashInt(i.messagePrefix(), e), f = this.g.mul(n), o = this.encodePoint(f), u = this.hashInt(o, i.pubBytes(), e).mul(i.priv()), v = n.add(u).umod(this.curve.n);
        return this.makeSignature({
            R: f,
            S: v,
            Rencoded: o
        });
    };
    st.prototype.verify = function(e, r, i) {
        e = f1(e), r = this.makeSignature(r);
        var n = this.keyFromPublic(i), f = this.hashInt(r.Rencoded(), n.pubBytes(), e), o = this.g.mul(r.S()), u = r.R().add(n.pub().mul(f));
        return u.eq(o);
    };
    st.prototype.hashInt = function() {
        for(var e = this.hash(), r = 0; r < arguments.length; r++)e.update(arguments[r]);
        return $i.intFromLE(e.digest()).umod(this.curve.n);
    };
    st.prototype.keyFromPublic = function(e) {
        return a1.fromPublic(this, e);
    };
    st.prototype.keyFromSecret = function(e) {
        return a1.fromSecret(this, e);
    };
    st.prototype.makeSignature = function(e) {
        return e instanceof n1 ? e : new n1(this, e);
    };
    st.prototype.encodePoint = function(e) {
        var r = e.getY().toArray("le", this.encodingLength);
        return r[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, r;
    };
    st.prototype.decodePoint = function(e) {
        e = $i.parseBytes(e);
        var r = e.length - 1, i = e.slice(0, r).concat(e[r] & -129), n = (e[r] & 128) !== 0, f = $i.intFromLE(i);
        return this.curve.pointFromY(f, n);
    };
    st.prototype.encodeInt = function(e) {
        return e.toArray("le", this.encodingLength);
    };
    st.prototype.decodeInt = function(e) {
        return $i.intFromLE(e);
    };
    st.prototype.isPoint = function(e) {
        return e instanceof this.pointClass;
    };
});
var Da = q((h1)=>{
    "use strict";
    var mi = h1;
    mi.version = zd().version;
    mi.utils = ut();
    mi.rand = pa();
    mi.curve = zo();
    mi.curves = Ra();
    mi.ec = Jl();
    mi.eddsa = s1();
});
var Na = q((Am, c1)=>{
    "use strict";
    var La = Xr(), Qi = La.Buffer, Et = {}, At;
    for(At in La)La.hasOwnProperty(At) && (At === "SlowBuffer" || At === "Buffer" || (Et[At] = La[At]));
    var en = Et.Buffer = {};
    for(At in Qi)Qi.hasOwnProperty(At) && (At === "allocUnsafe" || At === "allocUnsafeSlow" || (en[At] = Qi[At]));
    Et.Buffer.prototype = Qi.prototype;
    (!en.from || en.from === Uint8Array.from) && (en.from = function(t, e, r) {
        if (typeof t == "number") throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof t);
        if (t && typeof t.length > "u") throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
        return Qi(t, e, r);
    });
    en.alloc || (en.alloc = function(t, e, r) {
        if (typeof t != "number") throw new TypeError('The "size" argument must be of type number. Received type ' + typeof t);
        if (t < 0 || t >= 2 * 1073741824) throw new RangeError('The value "' + t + '" is invalid for option "size"');
        var i = Qi(t);
        return !e || e.length === 0 ? i.fill(0) : typeof r == "string" ? i.fill(e, r) : i.fill(e), i;
    });
    if (!Et.kStringMaxLength) try {
        Et.kStringMaxLength = process.binding("buffer").kStringMaxLength;
    } catch (t) {}
    Et.constants || (Et.constants = {
        MAX_LENGTH: Et.kMaxLength
    }, Et.kStringMaxLength && (Et.constants.MAX_STRING_LENGTH = Et.kStringMaxLength));
    c1.exports = Et;
});
var Oa = q((u1)=>{
    "use strict";
    var B5 = xe();
    function Bt(t) {
        this._reporterState = {
            obj: null,
            path: [],
            options: t || {},
            errors: []
        };
    }
    u1.Reporter = Bt;
    Bt.prototype.isError = function(e) {
        return e instanceof tn;
    };
    Bt.prototype.save = function() {
        let e = this._reporterState;
        return {
            obj: e.obj,
            pathLen: e.path.length
        };
    };
    Bt.prototype.restore = function(e) {
        let r = this._reporterState;
        r.obj = e.obj, r.path = r.path.slice(0, e.pathLen);
    };
    Bt.prototype.enterKey = function(e) {
        return this._reporterState.path.push(e);
    };
    Bt.prototype.exitKey = function(e) {
        let r = this._reporterState;
        r.path = r.path.slice(0, e - 1);
    };
    Bt.prototype.leaveKey = function(e, r, i) {
        let n = this._reporterState;
        this.exitKey(e), n.obj !== null && (n.obj[r] = i);
    };
    Bt.prototype.path = function() {
        return this._reporterState.path.join("/");
    };
    Bt.prototype.enterObject = function() {
        let e = this._reporterState, r = e.obj;
        return e.obj = {}, r;
    };
    Bt.prototype.leaveObject = function(e) {
        let r = this._reporterState, i = r.obj;
        return r.obj = e, i;
    };
    Bt.prototype.error = function(e) {
        let r, i = this._reporterState, n = e instanceof tn;
        if (n ? r = e : r = new tn(i.path.map(function(f) {
            return "[" + JSON.stringify(f) + "]";
        }).join(""), e.message || e, e.stack), !i.options.partial) throw r;
        return n || i.errors.push(r), r;
    };
    Bt.prototype.wrapResult = function(e) {
        let r = this._reporterState;
        return r.options.partial ? {
            result: this.isError(e) ? null : e,
            errors: r.errors
        } : e;
    };
    function tn(t, e) {
        this.path = t, this.rethrow(e);
    }
    B5(tn, Error);
    tn.prototype.rethrow = function(e) {
        if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, tn), !this.stack) try {
            throw new Error(this.message);
        } catch (r) {
            this.stack = r.stack;
        }
        return this;
    };
});
var fn = q((fs)=>{
    "use strict";
    var q5 = xe(), Fa = Oa().Reporter, rn = Na().Buffer;
    function qt(t, e) {
        if (Fa.call(this, e), !rn.isBuffer(t)) {
            this.error("Input not Buffer");
            return;
        }
        this.base = t, this.offset = 0, this.length = t.length;
    }
    q5(qt, Fa);
    fs.DecoderBuffer = qt;
    qt.isDecoderBuffer = function(e) {
        return e instanceof qt ? !0 : typeof e == "object" && rn.isBuffer(e.base) && e.constructor.name === "DecoderBuffer" && typeof e.offset == "number" && typeof e.length == "number" && typeof e.save == "function" && typeof e.restore == "function" && typeof e.isEmpty == "function" && typeof e.readUInt8 == "function" && typeof e.skip == "function" && typeof e.raw == "function";
    };
    qt.prototype.save = function() {
        return {
            offset: this.offset,
            reporter: Fa.prototype.save.call(this)
        };
    };
    qt.prototype.restore = function(e) {
        let r = new qt(this.base);
        return r.offset = e.offset, r.length = this.offset, this.offset = e.offset, Fa.prototype.restore.call(this, e.reporter), r;
    };
    qt.prototype.isEmpty = function() {
        return this.offset === this.length;
    };
    qt.prototype.readUInt8 = function(e) {
        return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
    };
    qt.prototype.skip = function(e, r) {
        if (!(this.offset + e <= this.length)) return this.error(r || "DecoderBuffer overrun");
        let i = new qt(this.base);
        return i._reporterState = this._reporterState, i.offset = this.offset, i.length = this.offset + e, this.offset += e, i;
    };
    qt.prototype.raw = function(e) {
        return this.base.slice(e ? e.offset : this.offset, this.length);
    };
    function nn(t, e) {
        if (Array.isArray(t)) this.length = 0, this.value = t.map(function(r) {
            return nn.isEncoderBuffer(r) || (r = new nn(r, e)), this.length += r.length, r;
        }, this);
        else if (typeof t == "number") {
            if (!(0 <= t && t <= 255)) return e.error("non-byte EncoderBuffer value");
            this.value = t, this.length = 1;
        } else if (typeof t == "string") this.value = t, this.length = rn.byteLength(t);
        else if (rn.isBuffer(t)) this.value = t, this.length = t.length;
        else return e.error("Unsupported type: " + typeof t);
    }
    fs.EncoderBuffer = nn;
    nn.isEncoderBuffer = function(e) {
        return e instanceof nn ? !0 : typeof e == "object" && e.constructor.name === "EncoderBuffer" && typeof e.length == "number" && typeof e.join == "function";
    };
    nn.prototype.join = function(e, r) {
        return e || (e = rn.alloc(this.length)), r || (r = 0), this.length === 0 || (Array.isArray(this.value) ? this.value.forEach(function(i) {
            i.join(e, r), r += i.length;
        }) : (typeof this.value == "number" ? e[r] = this.value : typeof this.value == "string" ? e.write(this.value, r) : rn.isBuffer(this.value) && this.value.copy(e, r), r += this.length)), e;
    };
});
var Ua = q((Rm, l1)=>{
    "use strict";
    var R5 = Oa().Reporter, I5 = fn().EncoderBuffer, k5 = fn().DecoderBuffer, nt = ct(), d1 = [
        "seq",
        "seqof",
        "set",
        "setof",
        "objid",
        "bool",
        "gentime",
        "utctime",
        "null_",
        "enum",
        "int",
        "objDesc",
        "bitstr",
        "bmpstr",
        "charstr",
        "genstr",
        "graphstr",
        "ia5str",
        "iso646str",
        "numstr",
        "octstr",
        "printstr",
        "t61str",
        "unistr",
        "utf8str",
        "videostr"
    ], C5 = [
        "key",
        "obj",
        "use",
        "optional",
        "explicit",
        "implicit",
        "def",
        "choice",
        "any",
        "contains"
    ].concat(d1), T5 = [
        "_peekTag",
        "_decodeTag",
        "_use",
        "_decodeStr",
        "_decodeObjid",
        "_decodeTime",
        "_decodeNull",
        "_decodeInt",
        "_decodeBool",
        "_decodeList",
        "_encodeComposite",
        "_encodeStr",
        "_encodeObjid",
        "_encodeTime",
        "_encodeNull",
        "_encodeInt",
        "_encodeBool"
    ];
    function ke(t, e, r) {
        let i = {};
        this._baseState = i, i.name = r, i.enc = t, i.parent = e || null, i.children = null, i.tag = null, i.args = null, i.reverseArgs = null, i.choice = null, i.optional = !1, i.any = !1, i.obj = !1, i.use = null, i.useDecoder = null, i.key = null, i.default = null, i.explicit = null, i.implicit = null, i.contains = null, i.parent || (i.children = [], this._wrap());
    }
    l1.exports = ke;
    var P5 = [
        "enc",
        "parent",
        "children",
        "tag",
        "args",
        "reverseArgs",
        "choice",
        "optional",
        "any",
        "obj",
        "use",
        "alteredUse",
        "key",
        "default",
        "explicit",
        "implicit",
        "contains"
    ];
    ke.prototype.clone = function() {
        let e = this._baseState, r = {};
        P5.forEach(function(n) {
            r[n] = e[n];
        });
        let i = new this.constructor(r.parent);
        return i._baseState = r, i;
    };
    ke.prototype._wrap = function() {
        let e = this._baseState;
        C5.forEach(function(r) {
            this[r] = function() {
                let n = new this.constructor(this);
                return e.children.push(n), n[r].apply(n, arguments);
            };
        }, this);
    };
    ke.prototype._init = function(e) {
        let r = this._baseState;
        nt(r.parent === null), e.call(this), r.children = r.children.filter(function(i) {
            return i._baseState.parent === this;
        }, this), nt.equal(r.children.length, 1, "Root node can have only one child");
    };
    ke.prototype._useArgs = function(e) {
        let r = this._baseState, i = e.filter(function(n) {
            return n instanceof this.constructor;
        }, this);
        e = e.filter(function(n) {
            return !(n instanceof this.constructor);
        }, this), i.length !== 0 && (nt(r.children === null), r.children = i, i.forEach(function(n) {
            n._baseState.parent = this;
        }, this)), e.length !== 0 && (nt(r.args === null), r.args = e, r.reverseArgs = e.map(function(n) {
            if (typeof n != "object" || n.constructor !== Object) return n;
            let f = {};
            return Object.keys(n).forEach(function(o) {
                o == (o | 0) && (o |= 0);
                let u = n[o];
                f[u] = o;
            }), f;
        }));
    };
    T5.forEach(function(t) {
        ke.prototype[t] = function() {
            let r = this._baseState;
            throw new Error(t + " not implemented for encoding: " + r.enc);
        };
    });
    d1.forEach(function(t) {
        ke.prototype[t] = function() {
            let r = this._baseState, i = Array.prototype.slice.call(arguments);
            return nt(r.tag === null), r.tag = t, this._useArgs(i), this;
        };
    });
    ke.prototype.use = function(e) {
        nt(e);
        let r = this._baseState;
        return nt(r.use === null), r.use = e, this;
    };
    ke.prototype.optional = function() {
        let e = this._baseState;
        return e.optional = !0, this;
    };
    ke.prototype.def = function(e) {
        let r = this._baseState;
        return nt(r.default === null), r.default = e, r.optional = !0, this;
    };
    ke.prototype.explicit = function(e) {
        let r = this._baseState;
        return nt(r.explicit === null && r.implicit === null), r.explicit = e, this;
    };
    ke.prototype.implicit = function(e) {
        let r = this._baseState;
        return nt(r.explicit === null && r.implicit === null), r.implicit = e, this;
    };
    ke.prototype.obj = function() {
        let e = this._baseState, r = Array.prototype.slice.call(arguments);
        return e.obj = !0, r.length !== 0 && this._useArgs(r), this;
    };
    ke.prototype.key = function(e) {
        let r = this._baseState;
        return nt(r.key === null), r.key = e, this;
    };
    ke.prototype.any = function() {
        let e = this._baseState;
        return e.any = !0, this;
    };
    ke.prototype.choice = function(e) {
        let r = this._baseState;
        return nt(r.choice === null), r.choice = e, this._useArgs(Object.keys(e).map(function(i) {
            return e[i];
        })), this;
    };
    ke.prototype.contains = function(e) {
        let r = this._baseState;
        return nt(r.use === null), r.contains = e, this;
    };
    ke.prototype._decode = function(e, r) {
        let i = this._baseState;
        if (i.parent === null) return e.wrapResult(i.children[0]._decode(e, r));
        let n = i.default, f = !0, o = null;
        if (i.key !== null && (o = e.enterKey(i.key)), i.optional) {
            let v = null;
            if (i.explicit !== null ? v = i.explicit : i.implicit !== null ? v = i.implicit : i.tag !== null && (v = i.tag), v === null && !i.any) {
                let _ = e.save();
                try {
                    i.choice === null ? this._decodeGeneric(i.tag, e, r) : this._decodeChoice(e, r), f = !0;
                } catch (x) {
                    f = !1;
                }
                e.restore(_);
            } else if (f = this._peekTag(e, v, i.any), e.isError(f)) return f;
        }
        let u;
        if (i.obj && f && (u = e.enterObject()), f) {
            if (i.explicit !== null) {
                let _ = this._decodeTag(e, i.explicit);
                if (e.isError(_)) return _;
                e = _;
            }
            let v = e.offset;
            if (i.use === null && i.choice === null) {
                let _;
                i.any && (_ = e.save());
                let x = this._decodeTag(e, i.implicit !== null ? i.implicit : i.tag, i.any);
                if (e.isError(x)) return x;
                i.any ? n = e.raw(_) : e = x;
            }
            if (r && r.track && i.tag !== null && r.track(e.path(), v, e.length, "tagged"), r && r.track && i.tag !== null && r.track(e.path(), e.offset, e.length, "content"), i.any || (i.choice === null ? n = this._decodeGeneric(i.tag, e, r) : n = this._decodeChoice(e, r)), e.isError(n)) return n;
            if (!i.any && i.choice === null && i.children !== null && i.children.forEach(function(x) {
                x._decode(e, r);
            }), i.contains && (i.tag === "octstr" || i.tag === "bitstr")) {
                let _ = new k5(n);
                n = this._getUse(i.contains, e._reporterState.obj)._decode(_, r);
            }
        }
        return i.obj && f && (n = e.leaveObject(u)), i.key !== null && (n !== null || f === !0) ? e.leaveKey(o, i.key, n) : o !== null && e.exitKey(o), n;
    };
    ke.prototype._decodeGeneric = function(e, r, i) {
        let n = this._baseState;
        return e === "seq" || e === "set" ? null : e === "seqof" || e === "setof" ? this._decodeList(r, e, n.args[0], i) : /str$/.test(e) ? this._decodeStr(r, e, i) : e === "objid" && n.args ? this._decodeObjid(r, n.args[0], n.args[1], i) : e === "objid" ? this._decodeObjid(r, null, null, i) : e === "gentime" || e === "utctime" ? this._decodeTime(r, e, i) : e === "null_" ? this._decodeNull(r, i) : e === "bool" ? this._decodeBool(r, i) : e === "objDesc" ? this._decodeStr(r, e, i) : e === "int" || e === "enum" ? this._decodeInt(r, n.args && n.args[0], i) : n.use !== null ? this._getUse(n.use, r._reporterState.obj)._decode(r, i) : r.error("unknown tag: " + e);
    };
    ke.prototype._getUse = function(e, r) {
        let i = this._baseState;
        return i.useDecoder = this._use(e, r), nt(i.useDecoder._baseState.parent === null), i.useDecoder = i.useDecoder._baseState.children[0], i.implicit !== i.useDecoder._baseState.implicit && (i.useDecoder = i.useDecoder.clone(), i.useDecoder._baseState.implicit = i.implicit), i.useDecoder;
    };
    ke.prototype._decodeChoice = function(e, r) {
        let i = this._baseState, n = null, f = !1;
        return Object.keys(i.choice).some(function(o) {
            let u = e.save(), v = i.choice[o];
            try {
                let _ = v._decode(e, r);
                if (e.isError(_)) return !1;
                n = {
                    type: o,
                    value: _
                }, f = !0;
            } catch (_) {
                return e.restore(u), !1;
            }
            return !0;
        }, this), f ? n : e.error("Choice not matched");
    };
    ke.prototype._createEncoderBuffer = function(e) {
        return new I5(e, this.reporter);
    };
    ke.prototype._encode = function(e, r, i) {
        let n = this._baseState;
        if (n.default !== null && n.default === e) return;
        let f = this._encodeValue(e, r, i);
        if (f !== void 0 && !this._skipDefault(f, r, i)) return f;
    };
    ke.prototype._encodeValue = function(e, r, i) {
        let n = this._baseState;
        if (n.parent === null) return n.children[0]._encode(e, r || new R5);
        let f = null;
        if (this.reporter = r, n.optional && e === void 0) {
            if (n.default !== null) e = n.default;
            else return;
        }
        let o = null, u = !1;
        if (n.any) f = this._createEncoderBuffer(e);
        else if (n.choice) f = this._encodeChoice(e, r);
        else if (n.contains) o = this._getUse(n.contains, i)._encode(e, r), u = !0;
        else if (n.children) o = n.children.map(function(v) {
            if (v._baseState.tag === "null_") return v._encode(null, r, e);
            if (v._baseState.key === null) return r.error("Child should have a key");
            let _ = r.enterKey(v._baseState.key);
            if (typeof e != "object") return r.error("Child expected, but input is not object");
            let x = v._encode(e[v._baseState.key], r, e);
            return r.leaveKey(_), x;
        }, this).filter(function(v) {
            return v;
        }), o = this._createEncoderBuffer(o);
        else if (n.tag === "seqof" || n.tag === "setof") {
            if (!(n.args && n.args.length === 1)) return r.error("Too many args for : " + n.tag);
            if (!Array.isArray(e)) return r.error("seqof/setof, but data is not Array");
            let v = this.clone();
            v._baseState.implicit = null, o = this._createEncoderBuffer(e.map(function(_) {
                let x = this._baseState;
                return this._getUse(x.args[0], e)._encode(_, r);
            }, v));
        } else n.use !== null ? f = this._getUse(n.use, i)._encode(e, r) : (o = this._encodePrimitive(n.tag, e), u = !0);
        if (!n.any && n.choice === null) {
            let v = n.implicit !== null ? n.implicit : n.tag, _ = n.implicit === null ? "universal" : "context";
            v === null ? n.use === null && r.error("Tag could be omitted only for .use()") : n.use === null && (f = this._encodeComposite(v, u, _, o));
        }
        return n.explicit !== null && (f = this._encodeComposite(n.explicit, !1, "context", f)), f;
    };
    ke.prototype._encodeChoice = function(e, r) {
        let i = this._baseState, n = i.choice[e.type];
        return n || nt(!1, e.type + " not found in " + JSON.stringify(Object.keys(i.choice))), n._encode(e.value, r);
    };
    ke.prototype._encodePrimitive = function(e, r) {
        let i = this._baseState;
        if (/str$/.test(e)) return this._encodeStr(r, e);
        if (e === "objid" && i.args) return this._encodeObjid(r, i.reverseArgs[0], i.args[1]);
        if (e === "objid") return this._encodeObjid(r, null, null);
        if (e === "gentime" || e === "utctime") return this._encodeTime(r, e);
        if (e === "null_") return this._encodeNull();
        if (e === "int" || e === "enum") return this._encodeInt(r, i.args && i.reverseArgs[0]);
        if (e === "bool") return this._encodeBool(r);
        if (e === "objDesc") return this._encodeStr(r, e);
        throw new Error("Unsupported tag: " + e);
    };
    ke.prototype._isNumstr = function(e) {
        return /^[0-9 ]*$/.test(e);
    };
    ke.prototype._isPrintstr = function(e) {
        return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(e);
    };
});
var za = q((gi)=>{
    "use strict";
    function p1(t) {
        let e = {};
        return Object.keys(t).forEach(function(r) {
            (r | 0) == r && (r = r | 0);
            let i = t[r];
            e[i] = r;
        }), e;
    }
    gi.tagClass = {
        0: "universal",
        1: "application",
        2: "context",
        3: "private"
    };
    gi.tagClassByName = p1(gi.tagClass);
    gi.tag = {
        0: "end",
        1: "bool",
        2: "int",
        3: "bitstr",
        4: "octstr",
        5: "null_",
        6: "objid",
        7: "objDesc",
        8: "external",
        9: "real",
        10: "enum",
        11: "embed",
        12: "utf8str",
        13: "relativeOid",
        16: "seq",
        17: "set",
        18: "numstr",
        19: "printstr",
        20: "t61str",
        21: "videostr",
        22: "ia5str",
        23: "utctime",
        24: "gentime",
        25: "graphstr",
        26: "iso646str",
        27: "genstr",
        28: "unistr",
        29: "charstr",
        30: "bmpstr"
    };
    gi.tagByName = p1(gi.tag);
});
var os = q((km, y1)=>{
    "use strict";
    var D5 = xe(), br = Na().Buffer, b1 = Ua(), as = za();
    function v1(t) {
        this.enc = "der", this.name = t.name, this.entity = t, this.tree = new Ot, this.tree._init(t.body);
    }
    y1.exports = v1;
    v1.prototype.encode = function(e, r) {
        return this.tree._encode(e, r).join();
    };
    function Ot(t) {
        b1.call(this, "der", t);
    }
    D5(Ot, b1);
    Ot.prototype._encodeComposite = function(e, r, i, n) {
        let f = L5(e, r, i, this.reporter);
        if (n.length < 128) {
            let v = br.alloc(2);
            return v[0] = f, v[1] = n.length, this._createEncoderBuffer([
                v,
                n
            ]);
        }
        let o = 1;
        for(let v = n.length; v >= 256; v >>= 8)o++;
        let u = br.alloc(2 + o);
        u[0] = f, u[1] = 128 | o;
        for(let v = 1 + o, _ = n.length; _ > 0; v--, _ >>= 8)u[v] = _ & 255;
        return this._createEncoderBuffer([
            u,
            n
        ]);
    };
    Ot.prototype._encodeStr = function(e, r) {
        if (r === "bitstr") return this._createEncoderBuffer([
            e.unused | 0,
            e.data
        ]);
        if (r === "bmpstr") {
            let i = br.alloc(e.length * 2);
            for(let n = 0; n < e.length; n++)i.writeUInt16BE(e.charCodeAt(n), n * 2);
            return this._createEncoderBuffer(i);
        } else return r === "numstr" ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : r === "printstr" ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(r) ? this._createEncoderBuffer(e) : r === "objDesc" ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + r + " unsupported");
    };
    Ot.prototype._encodeObjid = function(e, r, i) {
        if (typeof e == "string") {
            if (!r) return this.reporter.error("string objid given, but no values map found");
            if (!r.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
            e = r[e].split(/[\s.]+/g);
            for(let u = 0; u < e.length; u++)e[u] |= 0;
        } else if (Array.isArray(e)) {
            e = e.slice();
            for(let u = 0; u < e.length; u++)e[u] |= 0;
        }
        if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
        if (!i) {
            if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
            e.splice(0, 2, e[0] * 40 + e[1]);
        }
        let n = 0;
        for(let u = 0; u < e.length; u++){
            let v = e[u];
            for(n++; v >= 128; v >>= 7)n++;
        }
        let f = br.alloc(n), o = f.length - 1;
        for(let u = e.length - 1; u >= 0; u--){
            let v = e[u];
            for(f[o--] = v & 127; (v >>= 7) > 0;)f[o--] = 128 | v & 127;
        }
        return this._createEncoderBuffer(f);
    };
    function Rt(t) {
        return t < 10 ? "0" + t : t;
    }
    Ot.prototype._encodeTime = function(e, r) {
        let i, n = new Date(e);
        return r === "gentime" ? i = [
            Rt(n.getUTCFullYear()),
            Rt(n.getUTCMonth() + 1),
            Rt(n.getUTCDate()),
            Rt(n.getUTCHours()),
            Rt(n.getUTCMinutes()),
            Rt(n.getUTCSeconds()),
            "Z"
        ].join("") : r === "utctime" ? i = [
            Rt(n.getUTCFullYear() % 100),
            Rt(n.getUTCMonth() + 1),
            Rt(n.getUTCDate()),
            Rt(n.getUTCHours()),
            Rt(n.getUTCMinutes()),
            Rt(n.getUTCSeconds()),
            "Z"
        ].join("") : this.reporter.error("Encoding " + r + " time is not supported yet"), this._encodeStr(i, "octstr");
    };
    Ot.prototype._encodeNull = function() {
        return this._createEncoderBuffer("");
    };
    Ot.prototype._encodeInt = function(e, r) {
        if (typeof e == "string") {
            if (!r) return this.reporter.error("String int or enum given, but no values map");
            if (!r.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
            e = r[e];
        }
        if (typeof e != "number" && !br.isBuffer(e)) {
            let f = e.toArray();
            !e.sign && f[0] & 128 && f.unshift(0), e = br.from(f);
        }
        if (br.isBuffer(e)) {
            let f = e.length;
            e.length === 0 && f++;
            let o = br.alloc(f);
            return e.copy(o), e.length === 0 && (o[0] = 0), this._createEncoderBuffer(o);
        }
        if (e < 128) return this._createEncoderBuffer(e);
        if (e < 256) return this._createEncoderBuffer([
            0,
            e
        ]);
        let i = 1;
        for(let f = e; f >= 256; f >>= 8)i++;
        let n = new Array(i);
        for(let f = n.length - 1; f >= 0; f--)n[f] = e & 255, e >>= 8;
        return n[0] & 128 && n.unshift(0), this._createEncoderBuffer(br.from(n));
    };
    Ot.prototype._encodeBool = function(e) {
        return this._createEncoderBuffer(e ? 255 : 0);
    };
    Ot.prototype._use = function(e, r) {
        return typeof e == "function" && (e = e(r)), e._getEncoder("der").tree;
    };
    Ot.prototype._skipDefault = function(e, r, i) {
        let n = this._baseState, f;
        if (n.default === null) return !1;
        let o = e.join();
        if (n.defaultBuffer === void 0 && (n.defaultBuffer = this._encodeValue(n.default, r, i).join()), o.length !== n.defaultBuffer.length) return !1;
        for(f = 0; f < o.length; f++)if (o[f] !== n.defaultBuffer[f]) return !1;
        return !0;
    };
    function L5(t, e, r, i) {
        let n;
        if (t === "seqof" ? t = "seq" : t === "setof" && (t = "set"), as.tagByName.hasOwnProperty(t)) n = as.tagByName[t];
        else if (typeof t == "number" && (t | 0) === t) n = t;
        else return i.error("Unknown tag: " + t);
        return n >= 31 ? i.error("Multi-octet tag encoding unsupported") : (e || (n |= 32), n |= as.tagClassByName[r || "universal"] << 6, n);
    }
});
var g1 = q((Cm, m1)=>{
    "use strict";
    var N5 = xe(), ss = os();
    function hs(t) {
        ss.call(this, t), this.enc = "pem";
    }
    N5(hs, ss);
    m1.exports = hs;
    hs.prototype.encode = function(e, r) {
        let n = ss.prototype.encode.call(this, e).toString("base64"), f = [
            "-----BEGIN " + r.label + "-----"
        ];
        for(let o = 0; o < n.length; o += 64)f.push(n.slice(o, o + 64));
        return f.push("-----END " + r.label + "-----"), f.join("\n");
    };
});
var cs = q((w1)=>{
    "use strict";
    var _1 = w1;
    _1.der = os();
    _1.pem = g1();
});
var ds = q((Pm, B1)=>{
    "use strict";
    var O5 = xe(), F5 = je(), x1 = fn().DecoderBuffer, S1 = Ua(), M1 = za();
    function E1(t) {
        this.enc = "der", this.name = t.name, this.entity = t, this.tree = new dt, this.tree._init(t.body);
    }
    B1.exports = E1;
    E1.prototype.decode = function(e, r) {
        return x1.isDecoderBuffer(e) || (e = new x1(e, r)), this.tree._decode(e, r);
    };
    function dt(t) {
        S1.call(this, "der", t);
    }
    O5(dt, S1);
    dt.prototype._peekTag = function(e, r, i) {
        if (e.isEmpty()) return !1;
        let n = e.save(), f = us(e, 'Failed to peek tag: "' + r + '"');
        return e.isError(f) ? f : (e.restore(n), f.tag === r || f.tagStr === r || f.tagStr + "of" === r || i);
    };
    dt.prototype._decodeTag = function(e, r, i) {
        let n = us(e, 'Failed to decode tag of "' + r + '"');
        if (e.isError(n)) return n;
        let f = A1(e, n.primitive, 'Failed to get length of "' + r + '"');
        if (e.isError(f)) return f;
        if (!i && n.tag !== r && n.tagStr !== r && n.tagStr + "of" !== r) return e.error('Failed to match tag: "' + r + '"');
        if (n.primitive || f !== null) return e.skip(f, 'Failed to match body of: "' + r + '"');
        let o = e.save(), u = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
        return e.isError(u) ? u : (f = e.offset - o.offset, e.restore(o), e.skip(f, 'Failed to match body of: "' + r + '"'));
    };
    dt.prototype._skipUntilEnd = function(e, r) {
        for(;;){
            let i = us(e, r);
            if (e.isError(i)) return i;
            let n = A1(e, i.primitive, r);
            if (e.isError(n)) return n;
            let f;
            if (i.primitive || n !== null ? f = e.skip(n) : f = this._skipUntilEnd(e, r), e.isError(f)) return f;
            if (i.tagStr === "end") break;
        }
    };
    dt.prototype._decodeList = function(e, r, i, n) {
        let f = [];
        for(; !e.isEmpty();){
            let o = this._peekTag(e, "end");
            if (e.isError(o)) return o;
            let u = i.decode(e, "der", n);
            if (e.isError(u) && o) break;
            f.push(u);
        }
        return f;
    };
    dt.prototype._decodeStr = function(e, r) {
        if (r === "bitstr") {
            let i = e.readUInt8();
            return e.isError(i) ? i : {
                unused: i,
                data: e.raw()
            };
        } else if (r === "bmpstr") {
            let i = e.raw();
            if (i.length % 2 === 1) return e.error("Decoding of string type: bmpstr length mismatch");
            let n = "";
            for(let f = 0; f < i.length / 2; f++)n += String.fromCharCode(i.readUInt16BE(f * 2));
            return n;
        } else if (r === "numstr") {
            let i = e.raw().toString("ascii");
            return this._isNumstr(i) ? i : e.error("Decoding of string type: numstr unsupported characters");
        } else {
            if (r === "octstr") return e.raw();
            if (r === "objDesc") return e.raw();
            if (r === "printstr") {
                let i = e.raw().toString("ascii");
                return this._isPrintstr(i) ? i : e.error("Decoding of string type: printstr unsupported characters");
            } else return /str$/.test(r) ? e.raw().toString() : e.error("Decoding of string type: " + r + " unsupported");
        }
    };
    dt.prototype._decodeObjid = function(e, r, i) {
        let n, f = [], o = 0, u = 0;
        for(; !e.isEmpty();)u = e.readUInt8(), o <<= 7, o |= u & 127, u & 128 || (f.push(o), o = 0);
        u & 128 && f.push(o);
        let v = f[0] / 40 | 0, _ = f[0] % 40;
        if (i ? n = f : n = [
            v,
            _
        ].concat(f.slice(1)), r) {
            let x = r[n.join(" ")];
            x === void 0 && (x = r[n.join(".")]), x !== void 0 && (n = x);
        }
        return n;
    };
    dt.prototype._decodeTime = function(e, r) {
        let i = e.raw().toString(), n, f, o, u, v, _;
        if (r === "gentime") n = i.slice(0, 4) | 0, f = i.slice(4, 6) | 0, o = i.slice(6, 8) | 0, u = i.slice(8, 10) | 0, v = i.slice(10, 12) | 0, _ = i.slice(12, 14) | 0;
        else if (r === "utctime") n = i.slice(0, 2) | 0, f = i.slice(2, 4) | 0, o = i.slice(4, 6) | 0, u = i.slice(6, 8) | 0, v = i.slice(8, 10) | 0, _ = i.slice(10, 12) | 0, n < 70 ? n = 2e3 + n : n = 1900 + n;
        else return e.error("Decoding " + r + " time is not supported yet");
        return Date.UTC(n, f - 1, o, u, v, _, 0);
    };
    dt.prototype._decodeNull = function() {
        return null;
    };
    dt.prototype._decodeBool = function(e) {
        let r = e.readUInt8();
        return e.isError(r) ? r : r !== 0;
    };
    dt.prototype._decodeInt = function(e, r) {
        let i = e.raw(), n = new F5(i);
        return r && (n = r[n.toString(10)] || n), n;
    };
    dt.prototype._use = function(e, r) {
        return typeof e == "function" && (e = e(r)), e._getDecoder("der").tree;
    };
    function us(t, e) {
        let r = t.readUInt8(e);
        if (t.isError(r)) return r;
        let i = M1.tagClass[r >> 6], n = (r & 32) === 0;
        if ((r & 31) === 31) {
            let o = r;
            for(r = 0; (o & 128) === 128;){
                if (o = t.readUInt8(e), t.isError(o)) return o;
                r <<= 7, r |= o & 127;
            }
        } else r &= 31;
        let f = M1.tag[r];
        return {
            cls: i,
            primitive: n,
            tag: r,
            tagStr: f
        };
    }
    function A1(t, e, r) {
        let i = t.readUInt8(r);
        if (t.isError(i)) return i;
        if (!e && i === 128) return null;
        if (!(i & 128)) return i;
        let n = i & 127;
        if (n > 4) return t.error("length octect is too long");
        i = 0;
        for(let f = 0; f < n; f++){
            i <<= 8;
            let o = t.readUInt8(r);
            if (t.isError(o)) return o;
            i |= o;
        }
        return i;
    }
});
var R1 = q((Dm, q1)=>{
    "use strict";
    var U5 = xe(), z5 = Na().Buffer, ls = ds();
    function ps(t) {
        ls.call(this, t), this.enc = "pem";
    }
    U5(ps, ls);
    q1.exports = ps;
    ps.prototype.decode = function(e, r) {
        let i = e.toString().split(/[\r\n]+/g), n = r.label.toUpperCase(), f = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, u = -1;
        for(let x = 0; x < i.length; x++){
            let S = i[x].match(f);
            if (S !== null && S[2] === n) {
                if (o === -1) {
                    if (S[1] !== "BEGIN") break;
                    o = x;
                } else {
                    if (S[1] !== "END") break;
                    u = x;
                    break;
                }
            }
        }
        if (o === -1 || u === -1) throw new Error("PEM section not found for: " + n);
        let v = i.slice(o + 1, u).join("");
        v.replace(/[^a-z0-9+/=]+/gi, "");
        let _ = z5.from(v, "base64");
        return ls.prototype.decode.call(this, _, r);
    };
});
var bs = q((k1)=>{
    "use strict";
    var I1 = k1;
    I1.der = ds();
    I1.pem = R1();
});
var T1 = q((C1)=>{
    "use strict";
    var H5 = cs(), j5 = bs(), K5 = xe(), W5 = C1;
    W5.define = function(e, r) {
        return new an(e, r);
    };
    function an(t, e) {
        this.name = t, this.body = e, this.decoders = {}, this.encoders = {};
    }
    an.prototype._createNamed = function(e) {
        let r = this.name;
        function i(n) {
            this._initNamed(n, r);
        }
        return K5(i, e), i.prototype._initNamed = function(f, o) {
            e.call(this, f, o);
        }, new i(this);
    };
    an.prototype._getDecoder = function(e) {
        return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(j5[e])), this.decoders[e];
    };
    an.prototype.decode = function(e, r, i) {
        return this._getDecoder(r).decode(e, i);
    };
    an.prototype._getEncoder = function(e) {
        return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(H5[e])), this.encoders[e];
    };
    an.prototype.encode = function(e, r, i) {
        return this._getEncoder(r).encode(e, i);
    };
});
var D1 = q((P1)=>{
    "use strict";
    var Ha = P1;
    Ha.Reporter = Oa().Reporter;
    Ha.DecoderBuffer = fn().DecoderBuffer;
    Ha.EncoderBuffer = fn().EncoderBuffer;
    Ha.Node = Ua();
});
var O1 = q((N1)=>{
    "use strict";
    var L1 = N1;
    L1._reverse = function(e) {
        let r = {};
        return Object.keys(e).forEach(function(i) {
            (i | 0) == i && (i = i | 0);
            let n = e[i];
            r[n] = i;
        }), r;
    };
    L1.der = za();
});
var vs = q((F1)=>{
    "use strict";
    var on = F1;
    on.bignum = je();
    on.define = T1().define;
    on.base = D1();
    on.constants = O1();
    on.decoders = bs();
    on.encoders = cs();
});
var j1 = q((zm, H1)=>{
    "use strict";
    var Ft = vs(), U1 = Ft.define("Time", function() {
        this.choice({
            utcTime: this.utctime(),
            generalTime: this.gentime()
        });
    }), V5 = Ft.define("AttributeTypeValue", function() {
        this.seq().obj(this.key("type").objid(), this.key("value").any());
    }), ys = Ft.define("AlgorithmIdentifier", function() {
        this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional());
    }), G5 = Ft.define("SubjectPublicKeyInfo", function() {
        this.seq().obj(this.key("algorithm").use(ys), this.key("subjectPublicKey").bitstr());
    }), Z5 = Ft.define("RelativeDistinguishedName", function() {
        this.setof(V5);
    }), X5 = Ft.define("RDNSequence", function() {
        this.seqof(Z5);
    }), z1 = Ft.define("Name", function() {
        this.choice({
            rdnSequence: this.use(X5)
        });
    }), Y5 = Ft.define("Validity", function() {
        this.seq().obj(this.key("notBefore").use(U1), this.key("notAfter").use(U1));
    }), J5 = Ft.define("Extension", function() {
        this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
    }), $5 = Ft.define("TBSCertificate", function() {
        this.seq().obj(this.key("version").explicit(0).int().optional(), this.key("serialNumber").int(), this.key("signature").use(ys), this.key("issuer").use(z1), this.key("validity").use(Y5), this.key("subject").use(z1), this.key("subjectPublicKeyInfo").use(G5), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(J5).optional());
    }), Q5 = Ft.define("X509Certificate", function() {
        this.seq().obj(this.key("tbsCertificate").use($5), this.key("signatureAlgorithm").use(ys), this.key("signatureValue").bitstr());
    });
    H1.exports = Q5;
});
var W1 = q((zt)=>{
    "use strict";
    var Ut = vs();
    zt.certificate = j1();
    var e7 = Ut.define("RSAPrivateKey", function() {
        this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
    });
    zt.RSAPrivateKey = e7;
    var t7 = Ut.define("RSAPublicKey", function() {
        this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
    });
    zt.RSAPublicKey = t7;
    var r7 = Ut.define("SubjectPublicKeyInfo", function() {
        this.seq().obj(this.key("algorithm").use(K1), this.key("subjectPublicKey").bitstr());
    });
    zt.PublicKey = r7;
    var K1 = Ut.define("AlgorithmIdentifier", function() {
        this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
    }), i7 = Ut.define("PrivateKeyInfo", function() {
        this.seq().obj(this.key("version").int(), this.key("algorithm").use(K1), this.key("subjectPrivateKey").octstr());
    });
    zt.PrivateKey = i7;
    var n7 = Ut.define("EncryptedPrivateKeyInfo", function() {
        this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
    });
    zt.EncryptedPrivateKey = n7;
    var f7 = Ut.define("DSAPrivateKey", function() {
        this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
    });
    zt.DSAPrivateKey = f7;
    zt.DSAparam = Ut.define("DSAparam", function() {
        this.int();
    });
    var a7 = Ut.define("ECPrivateKey", function() {
        this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(o7), this.key("publicKey").optional().explicit(1).bitstr());
    });
    zt.ECPrivateKey = a7;
    var o7 = Ut.define("ECParameters", function() {
        this.choice({
            namedCurve: this.objid()
        });
    });
    zt.signature = Ut.define("signature", function() {
        this.seq().obj(this.key("r").int(), this.key("s").int());
    });
});
var V1 = q((jm, s7)=>{
    s7.exports = {
        "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
        "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
        "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
        "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
        "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
        "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
        "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
        "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
        "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
        "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
        "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
        "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
    };
});
var Z1 = q((Km, G1)=>{
    var h7 = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m, c7 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, u7 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, d7 = $n(), l7 = la(), ja = we().Buffer;
    G1.exports = function(t, e) {
        var r = t.toString(), i = r.match(h7), n;
        if (i) {
            var o = "aes" + i[1], u = ja.from(i[2], "hex"), v = ja.from(i[3].replace(/[\r\n]/g, ""), "base64"), _ = d7(e, u.slice(0, 8), parseInt(i[1], 10)).key, x = [], S = l7.createDecipheriv(o, _, u);
            x.push(S.update(v)), x.push(S.final()), n = ja.concat(x);
        } else {
            var f = r.match(u7);
            n = ja.from(f[2].replace(/[\r\n]/g, ""), "base64");
        }
        var A = r.match(c7)[1];
        return {
            tag: A,
            data: n
        };
    };
});
var of = q((Wm, Y1)=>{
    var ht = W1(), p7 = V1(), b7 = Z1(), v7 = la(), y7 = fo(), ms = we().Buffer;
    Y1.exports = X1;
    function X1(t) {
        var e;
        typeof t == "object" && !ms.isBuffer(t) && (e = t.passphrase, t = t.key), typeof t == "string" && (t = ms.from(t));
        var r = b7(t, e), i = r.tag, n = r.data, f, o;
        switch(i){
            case "CERTIFICATE":
                o = ht.certificate.decode(n, "der").tbsCertificate.subjectPublicKeyInfo;
            case "PUBLIC KEY":
                switch(o || (o = ht.PublicKey.decode(n, "der")), f = o.algorithm.algorithm.join("."), f){
                    case "1.2.840.113549.1.1.1":
                        return ht.RSAPublicKey.decode(o.subjectPublicKey.data, "der");
                    case "1.2.840.10045.2.1":
                        return o.subjectPrivateKey = o.subjectPublicKey, {
                            type: "ec",
                            data: o
                        };
                    case "1.2.840.10040.4.1":
                        return o.algorithm.params.pub_key = ht.DSAparam.decode(o.subjectPublicKey.data, "der"), {
                            type: "dsa",
                            data: o.algorithm.params
                        };
                    default:
                        throw new Error("unknown key id " + f);
                }
            case "ENCRYPTED PRIVATE KEY":
                n = ht.EncryptedPrivateKey.decode(n, "der"), n = m7(n, e);
            case "PRIVATE KEY":
                switch(o = ht.PrivateKey.decode(n, "der"), f = o.algorithm.algorithm.join("."), f){
                    case "1.2.840.113549.1.1.1":
                        return ht.RSAPrivateKey.decode(o.subjectPrivateKey, "der");
                    case "1.2.840.10045.2.1":
                        return {
                            curve: o.algorithm.curve,
                            privateKey: ht.ECPrivateKey.decode(o.subjectPrivateKey, "der").privateKey
                        };
                    case "1.2.840.10040.4.1":
                        return o.algorithm.params.priv_key = ht.DSAparam.decode(o.subjectPrivateKey, "der"), {
                            type: "dsa",
                            params: o.algorithm.params
                        };
                    default:
                        throw new Error("unknown key id " + f);
                }
            case "RSA PUBLIC KEY":
                return ht.RSAPublicKey.decode(n, "der");
            case "RSA PRIVATE KEY":
                return ht.RSAPrivateKey.decode(n, "der");
            case "DSA PRIVATE KEY":
                return {
                    type: "dsa",
                    params: ht.DSAPrivateKey.decode(n, "der")
                };
            case "EC PRIVATE KEY":
                return n = ht.ECPrivateKey.decode(n, "der"), {
                    curve: n.parameters.value,
                    privateKey: n.privateKey
                };
            default:
                throw new Error("unknown key type " + i);
        }
    }
    X1.signature = ht.signature;
    function m7(t, e) {
        var r = t.algorithm.decrypt.kde.kdeparams.salt, i = parseInt(t.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), n = p7[t.algorithm.decrypt.cipher.algo.join(".")], f = t.algorithm.decrypt.cipher.iv, o = t.subjectPrivateKey, u = parseInt(n.split("-")[1], 10) / 8, v = y7.pbkdf2Sync(e, r, i, u, "sha1"), _ = v7.createDecipheriv(n, v, f), x = [];
        return x.push(_.update(o)), x.push(_.final()), ms.concat(x);
    }
});
var gs = q((Vm, g7)=>{
    g7.exports = {
        "1.3.132.0.10": "secp256k1",
        "1.3.132.0.33": "p224",
        "1.2.840.10045.3.1.1": "p192",
        "1.2.840.10045.3.1.7": "p256",
        "1.3.132.0.34": "p384",
        "1.3.132.0.35": "p521"
    };
});
var Q1 = q((Gm, Wa)=>{
    var it = we().Buffer, _i = X0(), _7 = ma(), w7 = Da().ec, Ka = ya(), x7 = of(), M7 = gs();
    function S7(t, e, r, i, n) {
        var f = x7(e);
        if (f.curve) {
            if (i !== "ecdsa" && i !== "ecdsa/rsa") throw new Error("wrong private key type");
            return E7(t, f);
        } else if (f.type === "dsa") {
            if (i !== "dsa") throw new Error("wrong private key type");
            return A7(t, f, r);
        } else if (i !== "rsa" && i !== "ecdsa/rsa") throw new Error("wrong private key type");
        t = it.concat([
            n,
            t
        ]);
        for(var o = f.modulus.byteLength(), u = [
            0,
            1
        ]; t.length + u.length + 1 < o;)u.push(255);
        u.push(0);
        for(var v = -1; ++v < t.length;)u.push(t[v]);
        var _ = _7(u, f);
        return _;
    }
    function E7(t, e) {
        var r = M7[e.curve.join(".")];
        if (!r) throw new Error("unknown curve " + e.curve.join("."));
        var i = new w7(r), n = i.keyFromPrivate(e.privateKey), f = n.sign(t);
        return it.from(f.toDER());
    }
    function A7(t, e, r) {
        for(var i = e.params.priv_key, n = e.params.p, f = e.params.q, o = e.params.g, u = new Ka(0), v, _ = _s(t, f).mod(f), x = !1, S = J1(i, f, t, r); x === !1;)v = $1(f, S, r), u = R7(o, v, n, f), x = v.invm(f).imul(_.add(i.mul(u))).mod(f), x.cmpn(0) === 0 && (x = !1, u = new Ka(0));
        return B7(u, x);
    }
    function B7(t, e) {
        t = t.toArray(), e = e.toArray(), t[0] & 128 && (t = [
            0
        ].concat(t)), e[0] & 128 && (e = [
            0
        ].concat(e));
        var r = t.length + e.length + 4, i = [
            48,
            r,
            2,
            t.length
        ];
        return i = i.concat(t, [
            2,
            e.length
        ], e), it.from(i);
    }
    function J1(t, e, r, i) {
        if (t = it.from(t.toArray()), t.length < e.byteLength()) {
            var n = it.alloc(e.byteLength() - t.length);
            t = it.concat([
                n,
                t
            ]);
        }
        var f = r.length, o = q7(r, e), u = it.alloc(f);
        u.fill(1);
        var v = it.alloc(f);
        return v = _i(i, v).update(u).update(it.from([
            0
        ])).update(t).update(o).digest(), u = _i(i, v).update(u).digest(), v = _i(i, v).update(u).update(it.from([
            1
        ])).update(t).update(o).digest(), u = _i(i, v).update(u).digest(), {
            k: v,
            v: u
        };
    }
    function _s(t, e) {
        var r = new Ka(t), i = (t.length << 3) - e.bitLength();
        return i > 0 && r.ishrn(i), r;
    }
    function q7(t, e) {
        t = _s(t, e), t = t.mod(e);
        var r = it.from(t.toArray());
        if (r.length < e.byteLength()) {
            var i = it.alloc(e.byteLength() - r.length);
            r = it.concat([
                i,
                r
            ]);
        }
        return r;
    }
    function $1(t, e, r) {
        var i, n;
        do {
            for(i = it.alloc(0); i.length * 8 < t.bitLength();)e.v = _i(r, e.k).update(e.v).digest(), i = it.concat([
                i,
                e.v
            ]);
            n = _s(i, t), e.k = _i(r, e.k).update(e.v).update(it.from([
                0
            ])).digest(), e.v = _i(r, e.k).update(e.v).digest();
        }while (n.cmp(t) !== -1);
        return n;
    }
    function R7(t, e, r, i) {
        return t.toRed(Ka.mont(r)).redPow(e).fromRed().mod(i);
    }
    Wa.exports = S7;
    Wa.exports.getKey = J1;
    Wa.exports.makeKey = $1;
});
var ip = q((Zm, rp)=>{
    var ws = we().Buffer, sf = ya(), I7 = Da().ec, tp = of(), k7 = gs();
    function C7(t, e, r, i, n) {
        var f = tp(r);
        if (f.type === "ec") {
            if (i !== "ecdsa" && i !== "ecdsa/rsa") throw new Error("wrong public key type");
            return T7(t, e, f);
        } else if (f.type === "dsa") {
            if (i !== "dsa") throw new Error("wrong public key type");
            return P7(t, e, f);
        } else if (i !== "rsa" && i !== "ecdsa/rsa") throw new Error("wrong public key type");
        e = ws.concat([
            n,
            e
        ]);
        for(var o = f.modulus.byteLength(), u = [
            1
        ], v = 0; e.length + u.length + 2 < o;)u.push(255), v++;
        u.push(0);
        for(var _ = -1; ++_ < e.length;)u.push(e[_]);
        u = ws.from(u);
        var x = sf.mont(f.modulus);
        t = new sf(t).toRed(x), t = t.redPow(new sf(f.publicExponent)), t = ws.from(t.fromRed().toArray());
        var S = v < 8 ? 1 : 0;
        for(o = Math.min(t.length, u.length), t.length !== u.length && (S = 1), _ = -1; ++_ < o;)S |= t[_] ^ u[_];
        return S === 0;
    }
    function T7(t, e, r) {
        var i = k7[r.data.algorithm.curve.join(".")];
        if (!i) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
        var n = new I7(i), f = r.data.subjectPrivateKey.data;
        return n.verify(e, t, f);
    }
    function P7(t, e, r) {
        var i = r.data.p, n = r.data.q, f = r.data.g, o = r.data.pub_key, u = tp.signature.decode(t, "der"), v = u.s, _ = u.r;
        ep(v, n), ep(_, n);
        var x = sf.mont(i), S = v.invm(n), A = f.toRed(x).redPow(new sf(e).mul(S).mod(n)).fromRed().mul(o.toRed(x).redPow(_.mul(S).mod(n)).fromRed()).mod(i).mod(n);
        return A.cmp(_) === 0;
    }
    function ep(t, e) {
        if (t.cmpn(0) <= 0) throw new Error("invalid sig");
        if (t.cmp(e) >= e) throw new Error("invalid sig");
    }
    rp.exports = C7;
});
var hp = q((Xm, sp)=>{
    var Va = we().Buffer, ap = Pi(), Ga = U0(), op = xe(), D7 = Q1(), L7 = ip(), wi = Y0();
    Object.keys(wi).forEach(function(t) {
        wi[t].id = Va.from(wi[t].id, "hex"), wi[t.toLowerCase()] = wi[t];
    });
    function hf(t) {
        Ga.Writable.call(this);
        var e = wi[t];
        if (!e) throw new Error("Unknown message digest");
        this._hashType = e.hash, this._hash = ap(e.hash), this._tag = e.id, this._signType = e.sign;
    }
    op(hf, Ga.Writable);
    hf.prototype._write = function(e, r, i) {
        this._hash.update(e), i();
    };
    hf.prototype.update = function(e, r) {
        return typeof e == "string" && (e = Va.from(e, r)), this._hash.update(e), this;
    };
    hf.prototype.sign = function(e, r) {
        this.end();
        var i = this._hash.digest(), n = D7(i, e, this._hashType, this._signType, this._tag);
        return r ? n.toString(r) : n;
    };
    function cf(t) {
        Ga.Writable.call(this);
        var e = wi[t];
        if (!e) throw new Error("Unknown message digest");
        this._hash = ap(e.hash), this._tag = e.id, this._signType = e.sign;
    }
    op(cf, Ga.Writable);
    cf.prototype._write = function(e, r, i) {
        this._hash.update(e), i();
    };
    cf.prototype.update = function(e, r) {
        return typeof e == "string" && (e = Va.from(e, r)), this._hash.update(e), this;
    };
    cf.prototype.verify = function(e, r, i) {
        typeof r == "string" && (r = Va.from(r, i)), this.end();
        var n = this._hash.digest();
        return L7(r, n, e, this._signType, this._tag);
    };
    function np(t) {
        return new hf(t);
    }
    function fp(t) {
        return new cf(t);
    }
    sp.exports = {
        Sign: np,
        Verify: fp,
        createSign: np,
        createVerify: fp
    };
});
var up = q((Ym, cp)=>{
    var N7 = Da(), O7 = je();
    cp.exports = function(e) {
        return new xi(e);
    };
    var lt = {
        secp256k1: {
            name: "secp256k1",
            byteLength: 32
        },
        secp224r1: {
            name: "p224",
            byteLength: 28
        },
        prime256v1: {
            name: "p256",
            byteLength: 32
        },
        prime192v1: {
            name: "p192",
            byteLength: 24
        },
        ed25519: {
            name: "ed25519",
            byteLength: 32
        },
        secp384r1: {
            name: "p384",
            byteLength: 48
        },
        secp521r1: {
            name: "p521",
            byteLength: 66
        }
    };
    lt.p224 = lt.secp224r1;
    lt.p256 = lt.secp256r1 = lt.prime256v1;
    lt.p192 = lt.secp192r1 = lt.prime192v1;
    lt.p384 = lt.secp384r1;
    lt.p521 = lt.secp521r1;
    function xi(t) {
        this.curveType = lt[t], this.curveType || (this.curveType = {
            name: t
        }), this.curve = new N7.ec(this.curveType.name), this.keys = void 0;
    }
    xi.prototype.generateKeys = function(t, e) {
        return this.keys = this.curve.genKeyPair(), this.getPublicKey(t, e);
    };
    xi.prototype.computeSecret = function(t, e, r) {
        e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e));
        var i = this.curve.keyFromPublic(t).getPublic(), n = i.mul(this.keys.getPrivate()).getX();
        return xs(n, r, this.curveType.byteLength);
    };
    xi.prototype.getPublicKey = function(t, e) {
        var r = this.keys.getPublic(e === "compressed", !0);
        return e === "hybrid" && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), xs(r, t);
    };
    xi.prototype.getPrivateKey = function(t) {
        return xs(this.keys.getPrivate(), t);
    };
    xi.prototype.setPublicKey = function(t, e) {
        return e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e)), this.keys._importPublic(t), this;
    };
    xi.prototype.setPrivateKey = function(t, e) {
        e = e || "utf8", Buffer.isBuffer(t) || (t = new Buffer(t, e));
        var r = new O7(t);
        return r = r.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(r), this;
    };
    function xs(t, e, r) {
        Array.isArray(t) || (t = t.toArray());
        var i = new Buffer(t);
        if (r && i.length < r) {
            var n = new Buffer(r - i.length);
            n.fill(0), i = Buffer.concat([
                n,
                i
            ]);
        }
        return e ? i.toString(e) : i;
    }
});
var Ss = q((Jm, dp)=>{
    var F7 = Pi(), Ms = we().Buffer;
    dp.exports = function(t, e) {
        for(var r = Ms.alloc(0), i = 0, n; r.length < e;)n = U7(i++), r = Ms.concat([
            r,
            F7("sha1").update(t).update(n).digest()
        ]);
        return r.slice(0, e);
    };
    function U7(t) {
        var e = Ms.allocUnsafe(4);
        return e.writeUInt32BE(t, 0), e;
    }
});
var Es = q(($m, lp)=>{
    lp.exports = function(e, r) {
        for(var i = e.length, n = -1; ++n < i;)e[n] ^= r[n];
        return e;
    };
});
var As = q((Qm, bp)=>{
    var pp = je(), z7 = we().Buffer;
    function H7(t, e) {
        return z7.from(t.toRed(pp.mont(e.modulus)).redPow(new pp(e.publicExponent)).fromRed().toArray());
    }
    bp.exports = H7;
});
var gp = q((eg, mp)=>{
    var j7 = of(), Bs = Jr(), K7 = Pi(), vp = Ss(), yp = Es(), qs = je(), W7 = As(), V7 = ma(), Ht = we().Buffer;
    mp.exports = function(e, r, i) {
        var n;
        e.padding ? n = e.padding : i ? n = 1 : n = 4;
        var f = j7(e), o;
        if (n === 4) o = G7(f, r);
        else if (n === 1) o = Z7(f, r, i);
        else if (n === 3) {
            if (o = new qs(r), o.cmp(f.modulus) >= 0) throw new Error("data too long for modulus");
        } else throw new Error("unknown padding");
        return i ? V7(o, f) : W7(o, f);
    };
    function G7(t, e) {
        var r = t.modulus.byteLength(), i = e.length, n = K7("sha1").update(Ht.alloc(0)).digest(), f = n.length, o = 2 * f;
        if (i > r - o - 2) throw new Error("message too long");
        var u = Ht.alloc(r - i - o - 2), v = r - f - 1, _ = Bs(f), x = yp(Ht.concat([
            n,
            u,
            Ht.alloc(1, 1),
            e
        ], v), vp(_, v)), S = yp(_, vp(x, f));
        return new qs(Ht.concat([
            Ht.alloc(1),
            S,
            x
        ], r));
    }
    function Z7(t, e, r) {
        var i = e.length, n = t.modulus.byteLength();
        if (i > n - 11) throw new Error("message too long");
        var f;
        return r ? f = Ht.alloc(n - i - 3, 255) : f = X7(n - i - 3), new qs(Ht.concat([
            Ht.from([
                0,
                r ? 1 : 2
            ]),
            f,
            Ht.alloc(1),
            e
        ], n));
    }
    function X7(t) {
        for(var e = Ht.allocUnsafe(t), r = 0, i = Bs(t * 2), n = 0, f; r < t;)n === i.length && (i = Bs(t * 2), n = 0), f = i[n++], f && (e[r++] = f);
        return e;
    }
});
var Sp = q((tg, Mp)=>{
    var Y7 = of(), _p = Ss(), wp = Es(), xp = je(), J7 = ma(), $7 = Pi(), Q7 = As(), uf = we().Buffer;
    Mp.exports = function(e, r, i) {
        var n;
        e.padding ? n = e.padding : i ? n = 1 : n = 4;
        var f = Y7(e), o = f.modulus.byteLength();
        if (r.length > o || new xp(r).cmp(f.modulus) >= 0) throw new Error("decryption error");
        var u;
        i ? u = Q7(new xp(r), f) : u = J7(r, f);
        var v = uf.alloc(o - u.length);
        if (u = uf.concat([
            v,
            u
        ], o), n === 4) return e9(f, u);
        if (n === 1) return t9(f, u, i);
        if (n === 3) return u;
        throw new Error("unknown padding");
    };
    function e9(t, e) {
        var r = t.modulus.byteLength(), i = $7("sha1").update(uf.alloc(0)).digest(), n = i.length;
        if (e[0] !== 0) throw new Error("decryption error");
        var f = e.slice(1, n + 1), o = e.slice(n + 1), u = wp(f, _p(o, n)), v = wp(o, _p(u, r - n - 1));
        if (r9(i, v.slice(0, n))) throw new Error("decryption error");
        for(var _ = n; v[_] === 0;)_++;
        if (v[_++] !== 1) throw new Error("decryption error");
        return v.slice(_);
    }
    function t9(t, e, r) {
        for(var i = e.slice(0, 2), n = 2, f = 0; e[n++] !== 0;)if (n >= e.length) {
            f++;
            break;
        }
        var o = e.slice(2, n - 1);
        if ((i.toString("hex") !== "0002" && !r || i.toString("hex") !== "0001" && r) && f++, o.length < 8 && f++, f) throw new Error("decryption error");
        return e.slice(n);
    }
    function r9(t, e) {
        t = uf.from(t), e = uf.from(e);
        var r = 0, i = t.length;
        t.length !== e.length && (r++, i = Math.min(t.length, e.length));
        for(var n = -1; ++n < i;)r += t[n] ^ e[n];
        return r;
    }
});
var Ep = q((Mi)=>{
    Mi.publicEncrypt = gp();
    Mi.privateDecrypt = Sp();
    Mi.privateEncrypt = function(e, r) {
        return Mi.publicEncrypt(e, r, !0);
    };
    Mi.publicDecrypt = function(e, r) {
        return Mi.privateDecrypt(e, r, !0);
    };
});
var Dp = q((df)=>{
    "use strict";
    function Ap() {
        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
    }
    var qp = we(), Bp = Jr(), Rp = qp.Buffer, Ip = qp.kMaxLength, Rs = global.crypto || global.msCrypto, kp = Math.pow(2, 32) - 1;
    function Cp(t, e) {
        if (typeof t != "number" || t !== t) throw new TypeError("offset must be a number");
        if (t > kp || t < 0) throw new TypeError("offset must be a uint32");
        if (t > Ip || t > e) throw new RangeError("offset out of range");
    }
    function Tp(t, e, r) {
        if (typeof t != "number" || t !== t) throw new TypeError("size must be a number");
        if (t > kp || t < 0) throw new TypeError("size must be a uint32");
        if (t + e > r || t > Ip) throw new RangeError("buffer too small");
    }
    Rs && Rs.getRandomValues || false ? (df.randomFill = i9, df.randomFillSync = n9) : (df.randomFill = Ap, df.randomFillSync = Ap);
    function i9(t, e, r, i) {
        if (!Rp.isBuffer(t) && !(t instanceof global.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        if (typeof e == "function") i = e, e = 0, r = t.length;
        else if (typeof r == "function") i = r, r = t.length - e;
        else if (typeof i != "function") throw new TypeError('"cb" argument must be a function');
        return Cp(e, t.length), Tp(r, e, t.length), Pp(t, e, r, i);
    }
    function Pp(t, e, r, i) {
        var n = t.buffer, f = new Uint8Array(n, e, r);
        if (Rs.getRandomValues(f), i) {
            process.nextTick(function() {
                i(null, t);
            });
            return;
        }
        return t;
        if (i) {
            Bp(r, function(u, v) {
                if (u) return i(u);
                v.copy(t, e), i(null, t);
            });
            return;
        }
        var o = Bp(r);
        return o.copy(t, e), t;
    }
    function n9(t, e, r) {
        if (typeof e > "u" && (e = 0), !Rp.isBuffer(t) && !(t instanceof global.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        return Cp(e, t.length), r === void 0 && (r = t.length - e), Tp(r, e, t.length), Pp(t, e, r);
    }
});
var Is = q((Me)=>{
    "use strict";
    Me.randomBytes = Me.rng = Me.pseudoRandomBytes = Me.prng = Jr();
    Me.createHash = Me.Hash = Pi();
    Me.createHmac = Me.Hmac = X0();
    var f9 = eu(), a9 = Object.keys(f9), o9 = [
        "sha1",
        "sha224",
        "sha256",
        "sha384",
        "sha512",
        "md5",
        "rmd160"
    ].concat(a9);
    Me.getHashes = function() {
        return o9;
    };
    var Lp = fo();
    Me.pbkdf2 = Lp.pbkdf2;
    Me.pbkdf2Sync = Lp.pbkdf2Sync;
    var tr = xd();
    Me.Cipher = tr.Cipher;
    Me.createCipher = tr.createCipher;
    Me.Cipheriv = tr.Cipheriv;
    Me.createCipheriv = tr.createCipheriv;
    Me.Decipher = tr.Decipher;
    Me.createDecipher = tr.createDecipher;
    Me.Decipheriv = tr.Decipheriv;
    Me.createDecipheriv = tr.createDecipheriv;
    Me.getCiphers = tr.getCiphers;
    Me.listCiphers = tr.listCiphers;
    var lf = Ld();
    Me.DiffieHellmanGroup = lf.DiffieHellmanGroup;
    Me.createDiffieHellmanGroup = lf.createDiffieHellmanGroup;
    Me.getDiffieHellman = lf.getDiffieHellman;
    Me.createDiffieHellman = lf.createDiffieHellman;
    Me.DiffieHellman = lf.DiffieHellman;
    var Za = hp();
    Me.createSign = Za.createSign;
    Me.Sign = Za.Sign;
    Me.createVerify = Za.createVerify;
    Me.Verify = Za.Verify;
    Me.createECDH = up();
    var Xa = Ep();
    Me.publicEncrypt = Xa.publicEncrypt;
    Me.privateEncrypt = Xa.privateEncrypt;
    Me.publicDecrypt = Xa.publicDecrypt;
    Me.privateDecrypt = Xa.privateDecrypt;
    var Np = Dp();
    Me.randomFill = Np.randomFill;
    Me.randomFillSync = Np.randomFillSync;
    Me.createCredentials = function() {
        throw new Error([
            "sorry, createCredentials is not implemented yet",
            "we accept pull requests",
            "https://github.com/crypto-browserify/crypto-browserify"
        ].join("\n"));
    };
    Me.constants = {
        DH_CHECK_P_NOT_SAFE_PRIME: 2,
        DH_CHECK_P_NOT_PRIME: 1,
        DH_UNABLE_TO_CHECK_GENERATOR: 4,
        DH_NOT_SUITABLE_GENERATOR: 8,
        NPN_ENABLED: 1,
        ALPN_ENABLED: 1,
        RSA_PKCS1_PADDING: 1,
        RSA_SSLV23_PADDING: 2,
        RSA_NO_PADDING: 3,
        RSA_PKCS1_OAEP_PADDING: 4,
        RSA_X931_PADDING: 5,
        RSA_PKCS1_PSS_PADDING: 6,
        POINT_CONVERSION_COMPRESSED: 2,
        POINT_CONVERSION_UNCOMPRESSED: 4,
        POINT_CONVERSION_HYBRID: 6
    };
});
var sn = {};
Kp(sn, {
    default: ()=>s9
});
module.exports = Wp(sn);
var Op = ks(Is());
En(sn, ks(Is()), module.exports);
var s9 = Op.default; /*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/ 

},{"f285af6632f81b54":"cjohZ","f9809d376a0552f8":"eR5qz"}],"hfA3H":[function(require,module,exports) {
"use strict";
module.exports = function() {
    throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
};

},{}],"2LTjU":[function(require,module,exports) {
var d = Object.create;
var a = Object.defineProperty;
var l = Object.getOwnPropertyDescriptor;
var g = Object.getOwnPropertyNames;
var h = Object.getPrototypeOf, v = Object.prototype.hasOwnProperty;
var w = (r, n)=>()=>(n || r((n = {
            exports: {}
        }).exports, n), n.exports), A = (r, n)=>{
    for(var e in n)a(r, e, {
        get: n[e],
        enumerable: !0
    });
}, f = (r, n, e, m)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let u of g(n))!v.call(r, u) && u !== e && a(r, u, {
        get: ()=>n[u],
        enumerable: !(m = l(n, u)) || m.enumerable
    });
    return r;
}, i = (r, n, e)=>(f(r, n, "default"), e && f(e, n, "default")), p = (r, n, e)=>(e = r != null ? d(h(r)) : {}, f(n || !r || !r.__esModule ? a(e, "default", {
        value: r,
        enumerable: !0
    }) : e, r)), E = (r)=>f(a({}, "__esModule", {
        value: !0
    }), r);
var c = w((t)=>{
    t.endianness = function() {
        return "LE";
    };
    t.hostname = function() {
        return typeof location < "u" ? location.hostname : "";
    };
    t.loadavg = function() {
        return [];
    };
    t.uptime = function() {
        return 0;
    };
    t.freemem = function() {
        return Number.MAX_VALUE;
    };
    t.totalmem = function() {
        return Number.MAX_VALUE;
    };
    t.cpus = function() {
        return [];
    };
    t.type = function() {
        return "Browser";
    };
    t.release = function() {
        return typeof navigator < "u" ? navigator.appVersion : "";
    };
    t.networkInterfaces = t.getNetworkInterfaces = function() {
        return {};
    };
    t.arch = function() {
        return "javascript";
    };
    t.platform = function() {
        return "browser";
    };
    t.tmpdir = t.tmpDir = function() {
        return "/tmp";
    };
    t.EOL = "\n";
    t.homedir = function() {
        return "/";
    };
});
var o = {};
A(o, {
    default: ()=>L
});
module.exports = E(o);
var s = p(c());
i(o, p(c()), module.exports);
var L = s.default;

},{}]},["kn5Vl"], "kn5Vl", "parcelRequire272a")

 globalThis.define=__define;  })(globalThis.define);