(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.brushlib = {}));
    }
}(this, function (exports) {
"use strict";

var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}var fs,nodePath;if(typeof require==="function"){fs=require("fs");nodePath=require("path")}read_=(filename,binary)=>{filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="brushlib.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["e"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["n"];addOnInit(Module["asm"]["f"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}instantiateAsync().catch(readyPromiseReject);return{}}function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;abortOnCannotGrowMemory(requestedSize)}var printCharBuffers=[null,[],[]];function printChar(stream,curr){var buffer=printCharBuffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}}var SYSCALLS={varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret}};function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;for(var j=0;j<len;j++){printChar(fd,HEAPU8[ptr+j])}num+=len}HEAPU32[pnum>>2]=num;return 0}function uleb128Encode(n,target){if(n<128){target.push(n)}else{target.push(n%128|128,n>>7)}}function sigToWasmTypes(sig){var typeNames={"i":"i32","j":"i32","f":"f32","d":"f64","p":"i32"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]]);if(sig[i]==="j"){type.parameters.push("i32")}}return type}function generateFuncType(sig,target){var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={"i":127,"p":127,"j":126,"f":125,"d":124};target.push(96);uleb128Encode(sigParam.length,target);for(var i=0;i<sigParam.length;++i){target.push(typeCodes[sigParam[i]])}if(sigRet=="v"){target.push(0)}else{target.push(1,typeCodes[sigRet])}}function convertJsFunctionToWasm(func,sig){if(typeof WebAssembly.Function=="function"){return new WebAssembly.Function(sigToWasmTypes(sig),func)}var typeSectionBody=[1];generateFuncType(sig,typeSectionBody);var bytes=[0,97,115,109,1,0,0,0,1];uleb128Encode(typeSectionBody.length,bytes);bytes.push.apply(bytes,typeSectionBody);bytes.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var module=new WebAssembly.Module(new Uint8Array(bytes));var instance=new WebAssembly.Instance(module,{"e":{"f":func}});var wrappedFunc=instance.exports["f"];return wrappedFunc}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func}function updateTableMap(offset,count){if(functionsInTableMap){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}}var functionsInTableMap=undefined;var freeTableIndexes=[];function getEmptyTableSlot(){if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1}function setWasmTableEntry(idx,func){wasmTable.set(idx,func);wasmTableMirror[idx]=wasmTable.get(idx)}function addFunction(func,sig){if(!functionsInTableMap){functionsInTableMap=new WeakMap;updateTableMap(0,wasmTable.length)}if(functionsInTableMap.has(func)){return functionsInTableMap.get(func)}var ret=getEmptyTableSlot();try{setWasmTableEntry(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);setWasmTableEntry(ret,wrapped)}functionsInTableMap.set(func,ret);return ret}function getCFunc(ident){var func=Module["_"+ident];return func}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var asmLibraryArg={"a":___assert_fail,"d":_emscripten_memcpy_big,"c":_emscripten_resize_heap,"b":_fd_write};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["f"]).apply(null,arguments)};var _new_brush=Module["_new_brush"]=function(){return(_new_brush=Module["_new_brush"]=Module["asm"]["g"]).apply(null,arguments)};var _set_brush_base_value=Module["_set_brush_base_value"]=function(){return(_set_brush_base_value=Module["_set_brush_base_value"]=Module["asm"]["h"]).apply(null,arguments)};var _set_brush_mapping_n=Module["_set_brush_mapping_n"]=function(){return(_set_brush_mapping_n=Module["_set_brush_mapping_n"]=Module["asm"]["i"]).apply(null,arguments)};var _set_brush_mapping_point=Module["_set_brush_mapping_point"]=function(){return(_set_brush_mapping_point=Module["_set_brush_mapping_point"]=Module["asm"]["j"]).apply(null,arguments)};var _reset_brush=Module["_reset_brush"]=function(){return(_reset_brush=Module["_reset_brush"]=Module["asm"]["k"]).apply(null,arguments)};var _stroke_to=Module["_stroke_to"]=function(){return(_stroke_to=Module["_stroke_to"]=Module["asm"]["l"]).apply(null,arguments)};var _init=Module["_init"]=function(){return(_init=Module["_init"]=Module["asm"]["m"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["o"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["p"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return(stackAlloc=Module["stackAlloc"]=Module["asm"]["q"]).apply(null,arguments)};Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["addFunction"]=addFunction;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return Module.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;

// utils
function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

function isNumber(value) {
  return (typeof value === 'number')
}

function bind(func, ctx) {
  return function () { return func.apply(ctx, arguments) }
}

function forEachKeyIn(obj, iteratee) {
  Object.keys(obj || {}).forEach(function (key) { iteratee(key, obj[key]) })
}

function rgb2hsv() {
  let rr; let gg; let bb
  const r = arguments[0] / 255
  const g = arguments[1] / 255
  const b = arguments[2] / 255
  let h; let s
  const v = Math.max(r, g, b)
  const diff = v - Math.min(r, g, b)
  const diffc = function (c) {
    return (v - c) / 6 / diff + 1 / 2
  }

  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(r)
    gg = diffc(g)
    bb = diffc(b)

    if (r === v) {
      h = bb - gg
    } else if (g === v) {
      h = (1 / 3) + rr - bb
    } else if (b === v) {
      h = (2 / 3) + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return {
    h,
    s,
    v
  }
}


function create() {
  // Emscripten provides Module
  // eslint-disable-next-line no-undef
  return Module().then((Module) => {

    /**
     * Bindings
     */

    const createGetColorProxy = function (Module, getColor) {
      return function (x, y, radius, r_ptr, g_ptr, b_ptr, a_ptr) {
        const result = getColor(x, y, radius)

        Module.setValue(r_ptr, result[0], 'float')
        Module.setValue(g_ptr, result[1], 'float')
        Module.setValue(b_ptr, result[2], 'float')
        Module.setValue(a_ptr, result[3], 'float')
      }
    }

    const loadBrush = function (brush) {
      const bindings = this
      const settings = brush.settings

      bindings.new_brush()

      forEachKeyIn(settings, function (settingName, setting) {
        bindings.set_brush_base_value(settingName, (setting.base_value || 0.0))

        forEachKeyIn(setting.inputs, function (inputName, input) {
          bindings.set_brush_mapping_n(settingName, inputName, (input.length))

          input.forEach(function (point, index) {
            bindings.set_brush_mapping_point(settingName, inputName, index, point[0], point[1])
          })
        })
      })

      bindings.reset_brush()
    }

    const Bindings = function (drawDab, getColor) {

      const colorProxyPtr = Module.addFunction(createGetColorProxy(Module, getColor),
        // (x, y, radius, r_ptr, g_ptr, b_ptr, a_ptr)
        // f32 f32 f32  i32 i32 i32 i32
        'ifffiiii'
      )
      const drawDabProxyPtr = Module.addFunction(drawDab,
        // x,y,radius,r,g,b, a, hardness, alpha_eraser, aspect_ratio, angle, lock_alpha, colorize
        // f32 f32 f32 f32 f32  f32 f32 f32 f32 f32  f32 f32 f32
        'i' + ('f'.repeat(13))
      )

      Module.ccall('init', 'void', ['number', 'number'], [drawDabProxyPtr, colorProxyPtr])

      this.Module = Module
      // https://emscripten.org/docs/api_reference/preamble.js.html#cwrap
      this.stroke_to = Module.cwrap('stroke_to', 'void',
        ['number', 'number', 'number', 'number', 'number', 'number']
        // float x, float y, float pressure, float xtilt, float ytilt, double dtime
      )

      this.load_brush = bind(loadBrush, this)
      this.new_brush = Module.cwrap('new_brush')
      this.reset_brush = Module.cwrap('reset_brush')

      // Using the slower ccall() method, because cwrap() has a weird bug on FF when using strings :(
      this.set_brush_base_value = function (name, value) {
        Module.ccall('set_brush_base_value', 'void', ['string', 'number'], [name, value])
      }

      this.set_brush_mapping_n = function (name, mapping, n) {
        Module.ccall('set_brush_mapping_n', 'void', ['string', 'string', 'number'], [name, mapping, n])
      }

      this.set_brush_mapping_point = function (name, mapping, index, x, y) {
        Module.ccall('set_brush_mapping_point', 'void',
          ['string', 'string', 'number', 'number', 'number'], [name, mapping, index, x, y])
      }
    }


    /**
     * Painter
     */
    const canvasRenderer = {
      getColor: function (x, y, radius) {
        console.log('Get color', x, y, radius)
        const image = this.getImageData(x, y, 1, 1)
        const pixel = image.data

        pixel[0] /= 255
        pixel[1] /= 255
        pixel[2] /= 255
        pixel[3] /= 255

        return pixel
      },

      createFill: function (ctx, radius, hardness, r, g, b, a) {
        let fill

        if (hardness >= 1) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')' }

        fill = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
        fill.addColorStop(hardness, 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')')
        fill.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)')

        return fill
      },

      /* taken form https://github.com/yapcheahshen/brushlib.js by Yap Cheah Shen :)  */
      drawDab: function (
        x, y, radius,
        r, g, b, a,
        hardness, alpha_eraser, aspect_ratio, angle,
        lock_alpha, colorize
      ) {

        // console.log('drawDab', x, y, radius, r, g, b, a, hardness, alpha_eraser, aspect_ratio, angle, lock_alpha, colorize)

        if (a === 0) { return }

        r = Math.floor(r * 256)
        g = Math.floor(g * 256)
        b = Math.floor(b * 256)
        hardness = Math.max(hardness, 0)

        const height = (radius * 2 / aspect_ratio) / 2
        const width = (radius * 2 * 1.3) / 2
        const fill = canvasRenderer.createFill(this, radius, hardness, r, g, b, a)

        this.save()
        this.beginPath()


        // HACK: eraser hack
        if (alpha_eraser == 0) { this.globalCompositeOperation = 'destination-out' }

        this.translate(x, y)
        this.rotate(90 + angle)
        this.moveTo(0, -height)
        this.bezierCurveTo(width, -height, width, height, 0, height)
        this.bezierCurveTo(-width, height, -width, -height, 0, -height)
        this.fillStyle = fill
        this.fill()

        this.closePath()
        this.restore()
      }
    }

    const Painter = function (bindings) {
      this._bindings = bindings
    }

    // static
    Painter.fromCanvas = function (ctx) {
      ctx = isFunction(ctx.getContext) ? ctx.getContext('2d') : ctx
      return new Painter(new Bindings(bind(canvasRenderer.drawDab, ctx), bind(canvasRenderer.getColor, ctx)))
    }

    Painter.prototype.setBrush = function (brush) {
      this._bindings.load_brush(brush)
      return this
    }

    Painter.prototype.setColor = function (r, g, b) {
      const hsv = Array.isArray(r) ? rgb2hsv.apply(null, r) : rgb2hsv(r, g, b)

      this._bindings.set_brush_base_value('color_h', hsv.h)
      this._bindings.set_brush_base_value('color_s', hsv.s)
      this._bindings.set_brush_base_value('color_v', hsv.v)

      return this
    }

    Painter.prototype.newStroke = function (x, y) {
      this._bindings.reset_brush()
      return this.hover(x, y, 10)
    }

    Painter.prototype.stroke = function (x, y, dt, pressure, xtilt, ytilt) {
      pressure = isNumber(pressure) ? pressure : 0.5
      xtilt = (xtilt || 0.0)
      ytilt = (ytilt || 0.0)
      dt = (dt || 0.1)

      this._bindings.stroke_to(x, y, pressure, 0, ytilt, dt)
      return this
    }

    Painter.prototype.hover = function (x, y, dt) {
      return this.stroke(x, y, dt, 0, 0, 0)
    }

    return {
      Painter,
      Bindings
    }
  })
}

exports.create = create
}));