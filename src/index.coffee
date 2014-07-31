# polyfill promises
require './helper/promise'

module.exports =
  _params: {}
  _domainEventHandlers: {}
  _domainEventHandlersAll: []
  _processManagerInstances: {}

  set: (key, value) ->
    @_params[key] = value


  get: (key) ->
    @_params[key]


  ###*
  *
  * @description Get a new context instance.
  *
  * @param {String} name Name of the context
  ###
  context: (name) ->
    if !name
      throw new Error 'Contexts must have a name'
    Context = require './context'
    context = new Context name

    @_delegateAllDomainEventsToGlobalHandlers context

    context


  _delegateAllDomainEventsToGlobalHandlers: (context) ->
    context.addDomainEventHandler 'DomainEvent', (domainEvent) =>
      eventHandlers = @getDomainEventHandlers context.name, domainEvent.name
      for eventHandler in eventHandlers
        eventHandler domainEvent


  ###*
  *
  * @description Global DomainEvent Handlers
  *
  * @param {String} contextName Name of the context or 'all'
  * @param {String} eventName Name of the Event or 'all'
  * @param {Function} eventHandler Function which handles the DomainEvent
  ###
  addDomainEventHandler: ([contextName, eventName]..., eventHandler) ->
    contextName ?= 'all'
    eventName ?= 'all'

    if contextName is 'all' and eventName is 'all'
      @_domainEventHandlersAll.push eventHandler
    else
      @_domainEventHandlers[contextName] ?= {}
      @_domainEventHandlers[contextName][eventName] ?= []
      @_domainEventHandlers[contextName][eventName].push eventHandler


  getDomainEventHandlers: (contextName, domainEventName) ->
    [].concat (@_domainEventHandlers[contextName]?[domainEventName] ? []),
              (@_domainEventHandlers[contextName]?.all ? []),
              (@_domainEventHandlersAll ? [])


  generateUid: (separator) ->
    # http://stackoverflow.com/a/12223573
    S4 = ->
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1
    delim = separator or "-"
    S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4()


  ###*
  *
  * @description Global Process Manager
  *
  * @param {String} processManagerName Name of the ProcessManager
  * @param {Object} processManagerObject Object containing `initializeWhen` and `class`
  ###
  addProcessManager: (processManagerName, processManagerObj) ->
    for contextName, domainEventNames of processManagerObj.initializeWhen
      for domainEventName in domainEventNames
        @addDomainEventHandler contextName, domainEventName, (domainEvent) =>
          # TODO: make sure we dont spawn twice
          @_spawnProcessManager processManagerName, processManagerObj.class, contextName, domainEvent


  _spawnProcessManager: (processManagerName, ProcessManagerClass, contextName, domainEvent) ->
    processManagerId = @generateUid()
    processManager = new ProcessManagerClass

    processManager.$endProcess = =>
      @_endProcessManager processManagerName, processManagerId

    handleContextDomainEventNames = []
    for key, value of processManager
      if (key.indexOf 'from') is 0 and (typeof value is 'function')
        handleContextDomainEventNames.push key

    @_subscribeProcessManagerToDomainEvents processManager, handleContextDomainEventNames

    processManager.initialize domainEvent

    @_processManagerInstances[processManagerName] ?= {}
    @_processManagerInstances[processManagerName][processManagerId] ?= {}
    @_processManagerInstances[processManagerName][processManagerId] = processManager


  _endProcessManager: (processManagerName, processManagerId) ->
    delete @_processManagerInstances[processManagerName][processManagerId]


  _subscribeProcessManagerToDomainEvents: (processManager, handleContextDomainEventNames) ->
    @addDomainEventHandler (domainEvent) =>
      for handleContextDomainEventName in handleContextDomainEventNames
        if "from#{domainEvent.context}_handle#{domainEvent.name}" == handleContextDomainEventName
          @_applyDomainEventToProcessManager handleContextDomainEventName, domainEvent, processManager


  _applyDomainEventToProcessManager: (handleContextDomainEventName, domainEvent, processManager) ->
    if !processManager[handleContextDomainEventName]
      err = new Error "Tried to apply DomainEvent '#{domainEventName}' to Projection without a matching handle method"

    else
      processManager[handleContextDomainEventName] domainEvent


  nextTick: (next) ->
    nextTick = process?.nextTick ? setTimeout
    nextTick ->
      next()
