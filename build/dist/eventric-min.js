!function(){"use strict";var t="undefined"==typeof window?global:window;if("function"!=typeof t.require){var e={},n={_load:function(t,r){var i=n._resolveFilename(t,r),s=e[i];if(!s)throw new Error('Cannot find module "'+i+'" from "'+r+'"');if(n._cache[i])return n._cache[i].exports;var u=o(i),a={id:i,exports:{}};return n._cache[i]=a,s.call(a.exports,a.exports,u,a),a.exports},_cache:{},_resolveFilename:function(t,n){var r=i(s(n),t);return e.hasOwnProperty(r)?r:(r=i(r,"./index"),e.hasOwnProperty(r)?r:t)}},r=function(t,e){return n._load(t,e)},i=function(){var t=/^\.\.?(\/|$)/;return function(e,n){var r,i,o=[];r=(t.test(n)?e+"/"+n:n).split("/");for(var s=0,u=r.length;u>s;s++)i=r[s],".."===i?o.pop():"."!==i&&""!==i&&o.push(i);return o.join("/")}}(),o=function(e){return function(n){return t.require(n,e)}},s=function(t){return t?t.split("/").slice(0,-1).join("/"):""};r.register=r.define=function(t,n){if("object"==typeof t)for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);else e[t]=n},r.list=function(){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t},t.require=r,r.define("module",function(t,e,r){r.exports=n})}}(),require.register("eventric/eventric",function(t,e,n){var r,i=function(t,e){return function(){return t.apply(e,arguments)}},o=[].slice;r=function(){function t(){this._handleRemoteRPCRequest=i(this._handleRemoteRPCRequest,this),this.PubSub=e("./pub_sub"),this.EventBus=e("./event_bus"),this.Remote=e("./remote"),this.Context=e("./context"),this.DomainEvent=e("./domain_event"),this.Aggregate=e("./aggregate"),this.Repository=e("./repository"),this.Projection=e("./projection"),this.Logger=e("./logger"),this.RemoteInMemory=e("./remote/inmemory"),this.StoreInMemory=e("./store/inmemory"),this.GlobalContext=e("./global_context"),this.log=this.Logger,this._contexts={},this._params={},this._domainEventHandlers={},this._domainEventHandlersAll=[],this._storeClasses={},this._remoteEndpoints=[],this._globalProjectionClasses=[],this._globalContext=new this.GlobalContext(this),this._projectionService=new this.Projection(this,this._globalContext),this.addRemoteEndpoint("inmemory",this.RemoteInMemory.endpoint),this.addStore("inmemory",this.StoreInMemory),this.set("default domain events store","inmemory")}return t.prototype.set=function(t,e){return this._params[t]=e},t.prototype.get=function(t){return t?this._params[t]:this._params},t.prototype.addStore=function(t,e,n){return null==n&&(n={}),this._storeClasses[t]={Class:e,options:n}},t.prototype.getStores=function(){return this._storeClasses},t.prototype.context=function(t){var e,n;if(!t)throw n="Contexts must have a name",this.log.error(n),new Error(n);return e=new this.Context(t,this),this._delegateAllDomainEventsToGlobalHandlers(e),this._delegateAllDomainEventsToRemoteEndpoints(e),this._contexts[t]=e,e},t.prototype.initializeGlobalProjections=function(){return Promise.all(this._globalProjectionClasses.map(function(t){return function(e){return t._projectionService.initializeInstance("",new e,{})}}(this)))},t.prototype.addGlobalProjection=function(t){return this._globalProjectionClasses.push(t)},t.prototype.getRegisteredContextNames=function(){return Object.keys(this._contexts)},t.prototype.getContext=function(t){return this._contexts[t]},t.prototype.remote=function(t){var e;if(!t)throw e="Missing context name",this.log.error(e),new Error(e);return new this.Remote(t,this)},t.prototype.addRemoteEndpoint=function(t,e){return this._remoteEndpoints.push(e),e.setRPCHandler(this._handleRemoteRPCRequest)},t.prototype._handleRemoteRPCRequest=function(t,e){var n,r;return n=this.getContext(t.contextName),n?-1===this.Remote.ALLOWED_RPC_OPERATIONS.indexOf(t.functionName)?(r="RPC operation '"+t.functionName+"' not allowed",this.log.error(r),e(r,null)):t.functionName in n?n[t.functionName].apply(n,t.args).then(function(t){return e(null,t)})["catch"](function(t){return e(t)}):(r="Remote RPC function "+t.functionName+" not found on Context "+t.contextName,this.log.error(r),e(r,null)):(r="Tried to handle Remote RPC with not registered context "+t.contextName,this.log.error(r),e(r,null))},t.prototype._delegateAllDomainEventsToGlobalHandlers=function(t){return t.subscribeToAllDomainEvents(function(e){return function(n){var r,i,o,s,u;for(i=e.getDomainEventHandlers(t.name,n.name),u=[],o=0,s=i.length;s>o;o++)r=i[o],u.push(r(n));return u}}(this))},t.prototype._delegateAllDomainEventsToRemoteEndpoints=function(t){return t.subscribeToAllDomainEvents(function(e){return function(n){return e._remoteEndpoints.forEach(function(e){return e.publish(t.name,n.name,n),n.aggregate?e.publish(t.name,n.name,n.aggregate.id,n):void 0})}}(this))},t.prototype.subscribeToDomainEvent=function(){var t,e,n,r,i,s,u;return r=2<=arguments.length?o.call(arguments,0,u=arguments.length-1):(u=0,[]),e=arguments[u++],t=r[0],n=r[1],null==t&&(t="all"),null==n&&(n="all"),"all"===t&&"all"===n?this._domainEventHandlersAll.push(e):(null==(i=this._domainEventHandlers)[t]&&(i[t]={}),null==(s=this._domainEventHandlers[t])[n]&&(s[n]=[]),this._domainEventHandlers[t][n].push(e))},t.prototype.getDomainEventHandlers=function(t,e){var n,r,i,o,s;return[].concat(null!=(n=null!=(r=this._domainEventHandlers[t])?r[e]:void 0)?n:[],null!=(i=null!=(o=this._domainEventHandlers[t])?o.all:void 0)?i:[],null!=(s=this._domainEventHandlersAll)?s:[])},t.prototype.generateUid=function(t){var e,n;return e=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},n=t||"-",e()+e()+n+e()+n+e()+n+e()+n+e()+e()+e()},t.prototype.defaults=function(t,e){var n,r,i,o;for(n=[].concat(Object.keys(t),Object.keys(e)),i=0,o=n.length;o>i;i++)r=n[i],!t[r]&&e[r]&&(t[r]=e[r]);return t},t.prototype.mixin=function(t,e){var n,r;r=[];for(n in e)r.push(t[n]=e[n]);return r},t}(),n.exports=r}),require.register("eventric/index",function(t,e,n){n.exports=new(e("./eventric"))}),require.register("eventric/aggregate/aggregate",function(t,e,n){var r,i=function(t,e){return function(){return t.apply(e,arguments)}};r=function(){function t(t,e,n,r){this._context=t,this._eventric=e,this._name=n,this.getDomainEvents=i(this.getDomainEvents,this),this.emitDomainEvent=i(this.emitDomainEvent,this),this._domainEvents=[],this.root=r?new r:{},this.root.$emitDomainEvent=this.emitDomainEvent}return t.prototype.emitDomainEvent=function(t,e){var n,r,i,o;if(n=this._context.getDomainEvent(t),!n)throw o="Tried to emitDomainEvent '"+t+"' which is not defined",this._eventric.log.error(o),new Error(o);return r={id:this.id,name:this._name},i=this._context.createDomainEvent(t,n,e,r),this._domainEvents.push(i),this._handleDomainEvent(t,i),this._eventric.log.debug("Created and Handled DomainEvent in Aggregate",i)},t.prototype._handleDomainEvent=function(t,e){return this.root["handle"+t]?this.root["handle"+t](e,function(){}):this._eventric.log.debug("Tried to handle the DomainEvent '"+t+"' without a matching handle method")},t.prototype.getDomainEvents=function(){return this._domainEvents},t.prototype.applyDomainEvents=function(t){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],i.push(this._applyDomainEvent(e));return i},t.prototype._applyDomainEvent=function(t){return this._handleDomainEvent(t.name,t)},t}(),n.exports=r}),require.register("eventric/aggregate/index",function(t,e,n){n.exports=e("./aggregate")}),require.register("eventric/context/context",function(t,e,n){var r,i=function(t,e){return function(){return t.apply(e,arguments)}},o=[].slice;r=function(){function t(t,e){this.name=t,this._eventric=e,this.clearProjectionStore=i(this.clearProjectionStore,this),this.getProjectionStore=i(this.getProjectionStore,this),this._getAggregateRepository=i(this._getAggregateRepository,this),this.emitDomainEvent=i(this.emitDomainEvent,this),this._initialized=!1,this._params=this._eventric.get(),this._di={},this._aggregateRootClasses={},this._commandHandlers={},this._queryHandlers={},this._domainEventClasses={},this._domainEventHandlers={},this._projectionClasses={},this._domainEventStreamClasses={},this._domainEventStreamInstances={},this._repositoryInstances={},this._storeClasses={},this._storeInstances={},this._eventBus=new this._eventric.EventBus(this._eventric),this.projectionService=new this._eventric.Projection(this._eventric,this),this.log=this._eventric.log}return t.prototype.set=function(t,e){return this._params[t]=e,this},t.prototype.get=function(t){return this._params[t]},t.prototype.emitDomainEvent=function(t,e){var n,r;if(n=this.getDomainEvent(t),!n)throw new Error("Tried to emitDomainEvent '"+t+"' which is not defined");return r=this.createDomainEvent(t,n,e),this.saveAndPublishDomainEvent(r).then(function(t){return function(){return t.log.debug("Created and Handled DomainEvent in Context",r)}}(this))},t.prototype.createDomainEvent=function(t,e,n,r){var i;return i={},e.apply(i,[n]),new this._eventric.DomainEvent({id:this._eventric.generateUid(),name:t,aggregate:r,context:this.name,payload:i})},t.prototype.addStore=function(t,e,n){return null==n&&(n={}),this._storeClasses[t]={Class:e,options:n},this},t.prototype.defineDomainEvent=function(t,e){return this._domainEventClasses[t]=e,this},t.prototype.defineDomainEvents=function(t){var e,n;for(n in t)e=t[n],this.defineDomainEvent(n,e);return this},t.prototype._getAggregateRepository=function(t,e){var n,r,i;return r||(r={}),r[t]||(n=this._aggregateRootClasses[t],i=new this._eventric.Repository({aggregateName:t,AggregateRoot:n,context:this,eventric:this._eventric}),r[t]=i),r[t].setCommand(e),r[t]},t.prototype.addCommandHandlers=function(t){var e,n;for(n in t)e=t[n],this._commandHandlers[n]=e;return this},t.prototype.addQueryHandlers=function(t){var e,n;for(n in t)e=t[n],this._queryHandlers[n]=e;return this},t.prototype.addAggregate=function(t,e){return this._aggregateRootClasses[t]=e,this},t.prototype.subscribeToDomainEvent=function(t,e){var n;return n=function(t){return function(){return e.apply(t._di,arguments)}}(this),this._eventBus.subscribeToDomainEvent(t,n)},t.prototype.subscribeToDomainEvents=function(t){var e,n,r;r=[];for(e in t)n=t[e],r.push(this.subscribeToDomainEvent(e,n));return r},t.prototype.subscribeToDomainEventWithAggregateId=function(t,e,n){var r;return r=function(t){return function(){return n.apply(t._di,arguments)}}(this),this._eventBus.subscribeToDomainEventWithAggregateId(t,e,r)},t.prototype.subscribeToAllDomainEvents=function(t){var e;return e=function(e){return function(){return t.apply(e._di,arguments)}}(this),this._eventBus.subscribeToAllDomainEvents(e)},t.prototype.addProjection=function(t,e){return this._projectionClasses[t]=e,this},t.prototype.addProjections=function(t){var e,n;for(n in t)e=t[n],this.addProjection(n,e);return this},t.prototype.getProjectionInstance=function(t){return this.projectionService.getInstance(t)},t.prototype.destroyProjectionInstance=function(t){return this.projectionService.destroyInstance(t,this)},t.prototype.initializeProjectionInstance=function(t,e){var n;return this._projectionClasses[t]?this.projectionService.initializeInstance(t,this._projectionClasses[t],e):(n="Given projection "+t+" not registered on context",this.log.error(n),n=new Error(n))},t.prototype.initialize=function(){return new Promise(function(t){return function(e,n){return t.log.debug("["+t.name+"] Initializing"),t.log.debug("["+t.name+"] Initializing Store"),t._initializeStores().then(function(){return t.log.debug("["+t.name+"] Finished initializing Store"),t._di={$query:function(){return t.query.apply(t,arguments)},$projectionStore:function(){return t.getProjectionStore.apply(t,arguments)},$emitDomainEvent:function(){return t.emitDomainEvent.apply(t,arguments)}}}).then(function(){return t.log.debug("["+t.name+"] Initializing Projections"),t._initializeProjections()}).then(function(){return t.log.debug("["+t.name+"] Finished initializing Projections"),t.log.debug("["+t.name+"] Finished initializing"),t._initialized=!0,e()})["catch"](function(t){return n(t)})}}(this))},t.prototype._initializeStores=function(){var t,e,n,r,i;r=[],i=this._eventric.defaults(this._storeClasses,this._eventric.getStores());for(n in i)e=i[n],r.push({name:n,Class:e.Class,options:e.options});return t=new Promise(function(t){return t()}),r.forEach(function(e){return function(n){return e.log.debug("["+e.name+"] Initializing Store "+n.name),e._storeInstances[n.name]=new n.Class,t=t.then(function(){return e._storeInstances[n.name].initialize(e,n.options)}).then(function(){return e.log.debug("["+e.name+"] Finished initializing Store "+n.name)})}}(this)),t},t.prototype._initializeProjections=function(){var t,e,n,r,i;r=new Promise(function(t){return t()}),n=[],i=this._projectionClasses;for(e in i)t=i[e],n.push({name:e,"class":t});return n.forEach(function(t){return function(e){var n;return n=null,t.log.debug("["+t.name+"] Initializing Projection "+e.name),r=r.then(function(){return t.projectionService.initializeInstance(e.name,e["class"],{})}).then(function(){return t.log.debug("["+t.name+"] Finished initializing Projection "+e.name)})}}(this)),r},t.prototype.getProjection=function(t){return this.projectionService.getInstance(t)},t.prototype.getDomainEvent=function(t){return this._domainEventClasses[t]},t.prototype.getDomainEventsStore=function(){var t;return t=this.get("default domain events store"),this._storeInstances[t]},t.prototype.saveAndPublishDomainEvent=function(t){return new Promise(function(e){return function(n,r){return e.getDomainEventsStore().saveDomainEvent(t).then(function(){return e.publishDomainEvent(t)}).then(function(e){return e?r(e):n(t)})}}(this))},t.prototype.findDomainEventsByName=function(){var t;return t=1<=arguments.length?o.call(arguments,0):[],new Promise(function(e){return function(n,r){var i;return(i=e.getDomainEventsStore()).findDomainEventsByName.apply(i,o.call(t).concat([function(t,e){return t?r(t):n(e)}]))}}(this))},t.prototype.findDomainEventsByNameAndAggregateId=function(){var t;return t=1<=arguments.length?o.call(arguments,0):[],new Promise(function(e){return function(n,r){var i;return(i=e.getDomainEventsStore()).findDomainEventsByNameAndAggregateId.apply(i,o.call(t).concat([function(t,e){return t?r(t):n(e)}]))}}(this))},t.prototype.getProjectionStore=function(t,e){return new Promise(function(n){return function(r,i){var o;return n._storeInstances[t]?n._storeInstances[t].getProjectionStore(e).then(function(t){return r(t)})["catch"](function(t){return i(t)}):(o="Requested Store with name "+t+" not found",n.log.error(o),i(o))}}(this))},t.prototype.clearProjectionStore=function(t,e){return new Promise(function(n){return function(r,i){var o;return n._storeInstances[t]?n._storeInstances[t].clearProjectionStore(e).then(function(){return r()})["catch"](function(t){return i(t)}):(o="Requested Store with name "+t+" not found",n.log.error(o),i(o))}}(this))},t.prototype.getEventBus=function(){return this._eventBus},t.prototype.command=function(t,e){return new Promise(function(n){return function(r,i){var s,u,a,c,l,h,p,m;if(s={id:n._eventric.generateUid(),name:t,params:e},n.log.debug("Got Command",s),n._verifyContextIsInitialized(t),!n._commandHandlers[t])return l="Given command "+t+" not registered on context",n.log.error(l),l=new Error(l),i(l);p={},m=n._di;for(c in m)a=m[c],p[c]=a;return p.$aggregate={create:function(){var t,e,r;return t=arguments[0],e=2<=arguments.length?o.call(arguments,1):[],r=n._getAggregateRepository(t,s),r.create.apply(r,e)},load:function(t,e){var r;return r=n._getAggregateRepository(t,s),r.findById(e)}},h=null,u=n._commandHandlers[t],h=u.apply(p,[e]),Promise.all([h]).then(function(e){var i;return i=e[0],n.log.debug("Completed Command",t),r(i)})["catch"](function(t){return i(t)})}}(this))},t.prototype.query=function(t,e){return new Promise(function(n){return function(r,i){var o,s;return n.log.debug("Got Query",t),n._verifyContextIsInitialized(t),n._queryHandlers[t]?(s=n._queryHandlers[t].apply(n._di,[e]),Promise.all([s]).then(function(e){var i;return i=e[0],n.log.debug("Completed Query "+t+" with Result "+i),r(i)})["catch"](function(t){return i(t)})):(o="Given query "+t+" not registered on context",n.log.error(o),o=new Error(o),i(o))}}(this))},t.prototype.destroy=function(){return this._eventBus.destroy().then(function(t){return function(){return t.command=void 0,t.emitDomainEvent=void 0}}(this))},t.prototype._verifyContextIsInitialized=function(t){var e;if(!this._initialized)throw e="Context "+this.name+" not initialized yet, cannot execute "+t,this.log.error(e),new Error(e)},t}(),n.exports=r}),require.register("eventric/context/index",function(t,e,n){n.exports=e("./context")}),require.register("eventric/domain_event/domain_event",function(t,e,n){var r;r=function(){function t(t){this.id=t.id,this.name=t.name,this.payload=t.payload,this.aggregate=t.aggregate,this.context=t.context,this.timestamp=(new Date).getTime()}return t}(),n.exports=r}),require.register("eventric/domain_event/index",function(t,e,n){n.exports=e("./domain_event")}),require.register("eventric/event_bus/event_bus",function(t,e,n){var r;r=function(){function t(t){this._eventric=t,this._pubSub=new this._eventric.PubSub,this._publishQueue=new Promise(function(t){return t()})}return t.prototype.subscribeToDomainEvent=function(t,e){return this._pubSub.subscribe(t,e)},t.prototype.subscribeToDomainEventWithAggregateId=function(t,e,n){return this.subscribeToDomainEvent(""+t+"/"+e,n)},t.prototype.subscribeToAllDomainEvents=function(t){return this.subscribeToDomainEvent("DomainEvent",t)},t.prototype.publishDomainEvent=function(t){return this._enqueuePublishing(function(e){return function(){return e._publishDomainEvent(t)}}(this))},t.prototype._enqueuePublishing=function(t){return this._publishQueue=this._publishQueue.then(t)},t.prototype._publishDomainEvent=function(t){var e,n,r;return n=[this._pubSub.publish("DomainEvent",t),this._pubSub.publish(t.name,t)],(null!=(r=t.aggregate)?r.id:void 0)&&(e=""+t.name+"/"+t.aggregate.id,n.push(this._pubSub.publish(e,t))),Promise.all(n)},t.prototype.destroy=function(){return this._pubSub.destroy().then(function(t){return function(){return t.publishDomainEvent=void 0}}(this))},t}(),n.exports=r}),require.register("eventric/event_bus/index",function(t,e,n){n.exports=e("./event_bus")}),require.register("eventric/global_context/global_context",function(t,e,n){var r,i=[].slice;r=function(){function t(t){this._eventric=t,this.name="Global"}return t.prototype.findDomainEventsByName=function(){var t,e;return t=1<=arguments.length?i.call(arguments,0):[],e=this._getAllContexts().map(function(e){return e.findDomainEventsByName.apply(e,t)}),Promise.all(e).then(function(t){return function(e){var n;return n=t._combineDomainEventsByContext(e),t._sortDomainEventsByTimestamp(n)}}(this))},t.prototype.subscribeToDomainEvent=function(t,e){var n;return n=this._getAllContexts().map(function(n){return n.subscribeToDomainEvent(t,e)}),Promise.all(n)},t.prototype._getAllContexts=function(){var t;return t=this._eventric.getRegisteredContextNames(),t.map(function(t){return function(e){return t._eventric.remote(e)}}(this))},t.prototype._combineDomainEventsByContext=function(t){return t.reduce(function(t,e){return t.concat(e)},[])},t.prototype._sortDomainEventsByTimestamp=function(t){return t.sort(function(t,e){return t.timestamp-e.timestamp})},t}(),n.exports=r}),require.register("eventric/global_context/index",function(t,e,n){n.exports=e("./global_context")}),require.register("eventric/logger/index",function(t,e,n){n.exports=e("./logger")}),require.register("eventric/logger/logger",function(t,e,n){n.exports={_logLevel:1,setLogLevel:function(t){return this._logLevel=function(){switch(t){case"debug":return 0;case"warn":return 1;case"info":return 2;case"error":return 3}}()},debug:function(){return this._logLevel>0?void 0:console.log.apply(console,arguments)},warn:function(){return this._logLevel>1?void 0:console.log.apply(console,arguments)},info:function(){return this._logLevel>2?void 0:console.log.apply(console,arguments)},error:function(){return this._logLevel>3?void 0:console.log.apply(console,arguments)}}}),require.register("eventric/projection/index",function(t,e,n){n.exports=e("./projection")}),require.register("eventric/projection/projection",function(t,e,n){var r,i=function(t,e){return function(){return t.apply(e,arguments)}};r=function(){function t(t,e){this._eventric=t,this._context=e,this._applyDomainEventToProjection=i(this._applyDomainEventToProjection,this),this.log=this._eventric.log,this._handlerFunctions={},this._projectionInstances={},this._domainEventsApplied={}}return t.prototype.initializeInstance=function(t,e,n){return new Promise(function(r){return function(i,o){var s,u,a,c,l,h,p;if(l="function"==typeof e?new e:e,r._context._di){p=r._context._di;for(a in p)u=p[a],l[a]=u}return h=r._eventric.generateUid(),s=null,l.$subscribeHandlersWithAggregateId=function(t){return s=t},r.log.debug("["+r._context.name+"] Clearing ProjectionStores "+l.stores+" of "+t),c=null,r._clearProjectionStores(l.stores,t).then(function(){return r.log.debug("["+r._context.name+"] Finished clearing ProjectionStores of "+t),r._injectStoresIntoProjection(t,l)}).then(function(){return r._callInitializeOnProjection(t,l,n)}).then(function(){return r.log.debug("["+r._context.name+"] Replaying DomainEvents against Projection "+t),r._parseEventNamesFromProjection(l)}).then(function(t){return c=t,r._applyDomainEventsFromStoreToProjection(h,l,c,s)}).then(function(){return r.log.debug("["+r._context.name+"] Finished Replaying DomainEvents against Projection "+t),r._subscribeProjectionToDomainEvents(h,t,l,c,s)}).then(function(){var t;return r._projectionInstances[h]=l,t={id:h,projection:l},i(h)})["catch"](function(t){return o(t)})}}(this))},t.prototype._callInitializeOnProjection=function(t,e,n){return new Promise(function(r){return function(i){return e.initialize?(r.log.debug("["+r._context.name+"] Calling initialize on Projection "+t),e.initialize(n,function(){return r.log.debug("["+r._context.name+"] Finished initialize call on Projection "+t),i(e)})):(r.log.debug("["+r._context.name+"] No initialize function on Projection "+t+" given, skipping"),i(e))}}(this))},t.prototype._injectStoresIntoProjection=function(t,e){var n,r;return n=new Promise(function(t){return t()}),e.stores?(null==e.$store&&(e.$store={}),null!=(r=e.stores)&&r.forEach(function(r){return function(i){return r.log.debug("["+r._context.name+"] Injecting ProjectionStore "+i+" into Projection "+t),n=n.then(function(){return r._context.getProjectionStore(i,t)}).then(function(n){return n?(e.$store[i]=n,r.log.debug("["+r._context.name+"] Finished Injecting ProjectionStore "+i+" into Projection "+t)):void 0})}}(this)),n):n},t.prototype._clearProjectionStores=function(t,e){var n;return n=new Promise(function(t){return t()}),t?(t.forEach(function(t){return function(r){return t.log.debug("["+t._context.name+"] Clearing ProjectionStore "+r+" for "+e),n=n.then(function(){return t._context.clearProjectionStore(r,e)}).then(function(){return t.log.debug("["+t._context.name+"] Finished clearing ProjectionStore "+r+" for "+e)})}}(this)),n):n},t.prototype._parseEventNamesFromProjection=function(t){return new Promise(function(e){var n,r,i,o;r=[];for(i in t)o=t[i],0===i.indexOf("handle")&&"function"==typeof o&&(n=i.replace(/^handle/,""),r.push(n));return e(r)})},t.prototype._applyDomainEventsFromStoreToProjection=function(t,e,n,r){var i;return this._domainEventsApplied[t]={},i=r?this._context.findDomainEventsByNameAndAggregateId(n,r):this._context.findDomainEventsByName(n),i.then(function(n){return function(r){var i;if(r&&0!==r.length)return i=new Promise(function(t){return t()}),r.forEach(function(r){return i=i.then(function(){return n._applyDomainEventToProjection(r,e)}).then(function(){return n._domainEventsApplied[t][r.id]=!0})}),i}}(this))},t.prototype._subscribeProjectionToDomainEvents=function(t,e,n,r,i){var o,s;return o=function(e){return function(r,i){return null==i&&(i=function(){}),e._domainEventsApplied[t][r.id]?i():e._applyDomainEventToProjection(r,n).then(function(){var o;return e._domainEventsApplied[t][r.id]=!0,o={id:t,projection:n,domainEvent:r},i()})["catch"](function(t){return i(t)})}}(this),s=new Promise(function(t){return t()}),r.forEach(function(e){return function(n){return s=s.then(function(){return i?e._context.subscribeToDomainEventWithAggregateId(n,i,o):e._context.subscribeToDomainEvent(n,o)}).then(function(n){var r;return null==(r=e._handlerFunctions)[t]&&(r[t]=[]),e._handlerFunctions[t].push(n)})}}(this)),s},t.prototype._applyDomainEventToProjection=function(t,e){return new Promise(function(n){return function(r){var i;return e["handle"+t.name]?(i=e["handle"+t.name](t),Promise.all([i]).then(function(t){var e;return e=t[0],r(e)})):(n.log.debug("Tried to apply DomainEvent '"+t.name+"' to Projection without a matching handle method"),void r())}}(this))},t.prototype.getInstance=function(t){return this._projectionInstances[t]},t.prototype.destroyInstance=function(t){var e,n,r,i,o;if(!this._handlerFunctions[t])return this.log.error("Missing attribute projectionId");for(n=[],o=this._handlerFunctions[t],r=0,i=o.length;i>r;r++)e=o[r],n.push(this._context.unsubscribeFromDomainEvent(e));return delete this._handlerFunctions[t],delete this._projectionInstances[t],Promise.all(n)},t}(),n.exports=r}),require.register("eventric/pub_sub/index",function(t,e,n){n.exports=e("./pub_sub")}),require.register("eventric/pub_sub/pub_sub",function(t,e,n){var r;r=function(){function t(){this._subscribers=[],this._subscriberId=0,this._pendingPublishOperations=[]}return t.prototype.subscribe=function(t,e){return new Promise(function(n){return function(r){var i;return i={eventName:t,subscriberFunction:e,subscriberId:n._getNextSubscriberId()},n._subscribers.push(i),r(i.subscriberId)}}(this))},t.prototype.publish=function(t,e){var n,r;return r=this._getRelevantSubscribers(t),n=Promise.all(r.map(function(t){return t.subscriberFunction(e)})),this._addPendingPublishOperation(n),n},t.prototype._getRelevantSubscribers=function(t){return t?this._subscribers.filter(function(e){return e.eventName===t}):this._subscribers},t.prototype._addPendingPublishOperation=function(t){return this._pendingPublishOperations.push(t),t.then(function(e){return function(){return e._pendingPublishOperations.splice(e._pendingPublishOperations.indexOf(t),1)}}(this))},t.prototype.unsubscribe=function(t){return new Promise(function(e){return function(n){return e._subscribers=e._subscribers.filter(function(e){return e.subscriberId!==t}),n()}}(this))},t.prototype._getNextSubscriberId=function(){return this._subscriberId++},t.prototype.destroy=function(){return Promise.all(this._pendingPublishOperations).then(function(t){return function(){return t.publish=void 0}}(this))},t}(),n.exports=r}),require.register("eventric/remote/index",function(t,e,n){n.exports=e("./remote")}),require.register("eventric/remote/remote",function(t,e,n){var r;r=function(){function t(t,n){this._contextName=t,this._eventric=n,this.name=this._contextName,this.InMemoryRemote=e("./inmemory"),this._params={},this._clients={},this._projectionClasses={},this._projectionInstances={},this._handlerFunctions={},this.projectionService=new this._eventric.Projection(this._eventric,this),this.addClient("inmemory",this.InMemoryRemote.client),this.set("default client","inmemory"),this._exposeRpcOperationsAsMemberFunctions()}return t.ALLOWED_RPC_OPERATIONS=["command","query","findDomainEventsByName","findDomainEventsByNameAndAggregateId"],t.prototype._exposeRpcOperationsAsMemberFunctions=function(){return t.ALLOWED_RPC_OPERATIONS.forEach(function(t){return function(e){return t[e]=function(){return t._rpc(e,arguments)}}}(this))},t.prototype.set=function(t,e){return this._params[t]=e,this},t.prototype.get=function(t){return this._params[t]},t.prototype.subscribeToAllDomainEvents=function(t){var e,n;return n=this.get("default client"),e=this.getClient(n),e.subscribe(this._contextName,t)},t.prototype.subscribeToDomainEvent=function(t,e){var n,r;return r=this.get("default client"),n=this.getClient(r),n.subscribe(this._contextName,t,e)},t.prototype.subscribeToDomainEventWithAggregateId=function(t,e,n){var r,i;return i=this.get("default client"),r=this.getClient(i),r.subscribe(this._contextName,t,e,n)},t.prototype.unsubscribeFromDomainEvent=function(t){var e,n;return n=this.get("default client"),e=this.getClient(n),e.unsubscribe(t)},t.prototype._rpc=function(t,e){var n,r;return r=this.get("default client"),n=this.getClient(r),n.rpc({contextName:this._contextName,functionName:t,args:Array.prototype.slice.call(e)})},t.prototype.addClient=function(t,e){return this._clients[t]=e,this},t.prototype.getClient=function(t){return this._clients[t]},t.prototype.addProjection=function(t,e){return this._projectionClasses[t]=e,this},t.prototype.initializeProjection=function(t,e){return this.projectionService.initializeInstance("",t,e)},t.prototype.initializeProjectionInstance=function(t,e){var n;return this._projectionClasses[t]?this.projectionService.initializeInstance(t,this._projectionClasses[t],e):(n="Given projection "+t+" not registered on remote",this._eventric.log.error(n),n=new Error(n))},t.prototype.getProjectionInstance=function(t){return this.projectionService.getInstance(t)},t.prototype.destroyProjectionInstance=function(t){return this.projectionService.destroyInstance(t,this)},t}(),n.exports=r}),require.register("eventric/repository/index",function(t,e,n){n.exports=e("./repository")}),require.register("eventric/repository/repository",function(t,e,n){var r,i=function(t,e){return function(){return t.apply(e,arguments)}};r=function(){function t(t,e){this._eventric=e,this.save=i(this.save,this),this.create=i(this.create,this),this.findById=i(this.findById,this),this._aggregateName=t.aggregateName,this._AggregateRoot=t.AggregateRoot,this._context=t.context,this._eventric=t.eventric,this._command={},this._aggregateInstances={},this._store=this._context.getDomainEventsStore()}return t.prototype.findById=function(t,e){return null==e&&(e=function(){}),new Promise(function(n){return function(r,i){return n._findDomainEventsForAggregate(t,function(o,s){var u,a,c,l;return o?(e(o,null),void i(o)):s.length?(u=new n._eventric.Aggregate(n._context,n._eventric,n._aggregateName,n._AggregateRoot),u.applyDomainEvents(s),u.id=t,u.root.$id=t,u.root.$save=function(){return n.save(u.id)},a=null!=(l=n._command.id)?l:"nocommand",null==(c=n._aggregateInstances)[a]&&(c[a]={}),n._aggregateInstances[a][t]=u,e(null,u.root),r(u.root)):(o="No domainEvents for "+n._aggregateName+" Aggregate with "+t+" available",n._eventric.log.error(o),e(o,null),void i(o))})}}(this))},t.prototype._findDomainEventsForAggregate=function(t,e){return this._store.findDomainEventsByAggregateId(t,function(t,n){return t?e(t,null):0===n.length?e(null,[]):e(null,n)})},t.prototype.create=function(t){return new Promise(function(e){return function(n,r){var i,o,s,u,a,c;return i=new e._eventric.Aggregate(e._context,e._eventric,e._aggregateName,e._AggregateRoot),i.id=e._eventric.generateUid(),"function"!=typeof i.root.create&&(u="No create function on aggregate",e._eventric.log.error(u),r(new Error(u))),i.root.$id=i.id,i.root.$save=function(){return e.save(i.id)},o=null!=(c=e._command.id)?c:"nocommand",null==(a=e._aggregateInstances)[o]&&(a[o]={}),e._aggregateInstances[o][i.id]=i,s=i.root.create(t),Promise.all([s]).then(function(){return n(i.root)})["catch"](function(t){var e;return e=t[0],r(e)})}}(this))},t.prototype.save=function(t){return new Promise(function(e){return function(n,r){var i,o,s,u,a,c;if(o=null!=(c=e._command.id)?c:"nocommand",i=e._aggregateInstances[o][t],!i)throw u="Tried to save unknown aggregate "+e._aggregateName,e._eventric.log.error(u),new Error(u);if(s=i.getDomainEvents(),s.length<1)throw u="Tried to save 0 DomainEvents from Aggregate "+e._aggregateName,e._eventric.log.debug(u,e._command),new Error(u);return e._eventric.log.debug("Going to Save and Publish "+s.length+" DomainEvents from Aggregate "+e._aggregateName),a=new Promise(function(t){return t()}),s.forEach(function(t){return a=a.then(function(){return e._store.saveDomainEvent(t)
}).then(function(){return e._eventric.log.debug("Saved DomainEvent",t)})}),a.then(function(){return s.forEach(function(t){return e._eventric.log.debug("Publishing DomainEvent",t),e._context.getEventBus().publishDomainEvent(t)["catch"](function(t){return e._eventric.log.error(t)})})}).then(function(){return n(i.id)})["catch"](r)}}(this))},t.prototype.setCommand=function(t){return this._command=t},t}(),n.exports=r}),require.register("eventric/remote/inmemory/index",function(t,e,n){n.exports=e("./remote_inmemory")}),require.register("eventric/remote/inmemory/remote_inmemory",function(t,e,n){var r,i,o,s,u,a,c=[].slice;o=e("../../pub_sub"),s=null,a=new o,i=function(){function t(){s=function(t){return function(e){return new Promise(function(n,r){return t._handleRPCRequest(e,function(t,e){return t?r(t):n(e)})})}}(this)}return t.prototype.setRPCHandler=function(t){this._handleRPCRequest=t},t.prototype.publish=function(){var t,e,n,r,i,o,s;return e=arguments[0],o=3<=arguments.length?c.call(arguments,1,s=arguments.length-1):(s=1,[]),i=arguments[s++],n=o[0],t=o[1],r=u(e,n,t),a.publish(r,i)},t}(),n.exports.endpoint=new i,r=function(){function t(){}return t.prototype.rpc=function(t){if(!s)throw new Error("No Remote Endpoint available for in memory client");return s(t)},t.prototype.subscribe=function(){var t,e,n,r,i,o,s;return e=arguments[0],o=3<=arguments.length?c.call(arguments,1,s=arguments.length-1):(s=1,[]),i=arguments[s++],n=o[0],t=o[1],r=u(e,n,t),a.subscribe(r,i)},t.prototype.unsubscribe=function(t){return a.unsubscribe(t)},t}(),n.exports.client=new r,u=function(t,e,n){var r;return r=t,e&&(r+="/"+e),n&&(r+="/"+n),r}}),require.register("eventric/store/inmemory/index",function(t,e,n){n.exports=e("./store_inmemory")}),require.register("eventric/store/inmemory/store_inmemory",function(t,e,n){var r,i,o=[].slice;i=["domain_events","projections"],r=function(){function t(){}return t.prototype._domainEvents={},t.prototype._projections={},t.prototype.initialize=function(){var t,e,n;return n=arguments[0],e=2<=arguments.length?o.call(arguments,1):[],this._context=n,t=e[0],new Promise(function(t){return function(e){return t._domainEventsCollectionName=""+t._context.name+".DomainEvents",t._projectionCollectionName=""+t._context.name+".Projections",t._domainEvents[t._domainEventsCollectionName]=[],e()}}(this))},t.prototype.saveDomainEvent=function(t){return new Promise(function(e){return function(n){return e._domainEvents[e._domainEventsCollectionName].push(t),n(t)}}(this))},t.prototype.findDomainEventsByName=function(t,e){var n,r;return n=t instanceof Array?function(e){return t.indexOf(e)>-1}:function(e){return e===t},r=this._domainEvents[this._domainEventsCollectionName].filter(function(t){return n(t.name)}),e(null,r)},t.prototype.findDomainEventsByNameAndAggregateId=function(t,e,n){var r,i,o;return i=t instanceof Array?function(e){return t.indexOf(e)>-1}:function(e){return e===t},r=e instanceof Array?function(t){return e.indexOf(t)>-1}:function(t){return t===e},o=this._domainEvents[this._domainEventsCollectionName].filter(function(t){var e;return i(t.name)&&r(null!=(e=t.aggregate)?e.id:void 0)}),n(null,o)},t.prototype.findDomainEventsByAggregateId=function(t,e){var n,r;return n=t instanceof Array?function(e){return t.indexOf(e)>-1}:function(e){return e===t},r=this._domainEvents[this._domainEventsCollectionName].filter(function(t){var e;return n(null!=(e=t.aggregate)?e.id:void 0)}),e(null,r)},t.prototype.getProjectionStore=function(t){return new Promise(function(e){return function(n){var r,i,o;return null==(r=e._projections)[o=e._projectionCollectionName]&&(r[o]={}),null==(i=e._projections[e._projectionCollectionName])[t]&&(i[t]={}),n(e._projections[e._projectionCollectionName][t])}}(this))},t.prototype.clearProjectionStore=function(t){return new Promise(function(e){return function(n){var r,i,o;return null==(r=e._projections)[o=e._projectionCollectionName]&&(r[o]={}),null==(i=e._projections[e._projectionCollectionName])[t]&&(i[t]={}),delete e._projections[e._projectionCollectionName][t],n()}}(this))},t.prototype.checkSupport=function(t){return i.indexOf(t)>-1},t}(),n.exports=r});