
EventBus = require 'eventric/event_bus'
Projection = require 'eventric/projection'
DomainEvent = require 'eventric/domain_event'
AggregateRepository = require 'eventric/aggregate_repository'
logger = require 'eventric/logger'

class Context

  constructor: (@name) ->
    @_eventric = require 'eventric'
    @_isInitialized = false
    @_isDestroyed = false
    @_params = @_eventric.get()
    @_di =
      $query: => @query.apply @, arguments
      $projectionStore: => @getProjectionStore.apply @, arguments
      $emitDomainEvent: => @emitDomainEvent.apply @, arguments
    @_aggregateClasses = {}
    @_commandHandlers = {}
    @_queryHandlers = {}
    @_domainEventClasses = {}
    @_domainEventHandlers = {}
    @_projectionClasses = {}
    @_repositoryInstances = {}
    @_storeClasses = {}
    @_storeInstances = {}
    @_pendingPromises = []
    @_eventBus         = new EventBus
    @projectionService = new Projection @


  set: (key, value) ->
    @_params[key] = value
    @


  get: (key) ->
    @_params[key]


  # TODO: Consider renaming. What store? event store? read model store?
  addStore: (storeName, StoreClass, storeOptions = {}) ->
    @_storeClasses[storeName] =
      Class: StoreClass
      options: storeOptions
    @


  defineDomainEvent: (domainEventName, DomainEventClass) ->
    @_domainEventClasses[domainEventName] = DomainEventClass
    @


  defineDomainEvents: (domainEventClassesObj) ->
    @defineDomainEvent domainEventName, DomainEventClass for domainEventName, DomainEventClass of domainEventClassesObj
    @


  addCommandHandlers: (commands) ->
    for commandHandlerName, commandFunction of commands
      @_commandHandlers[commandHandlerName] = commandFunction
    @


  addQueryHandlers: (queries) ->
    for queryHandlerName, queryFunction of queries
      @_queryHandlers[queryHandlerName] = queryFunction
    @


  addAggregate: (aggregateName, AggregateClass) ->
    @_aggregateClasses[aggregateName] = AggregateClass
    @


  subscribeToAllDomainEvents: (handlerFn) ->
    domainEventHandler = => handlerFn.apply @_di, arguments
    @_eventBus.subscribeToAllDomainEvents domainEventHandler


  subscribeToDomainEvent: (domainEventName, handlerFn) ->
    domainEventHandler = => handlerFn.apply @_di, arguments
    @_eventBus.subscribeToDomainEvent domainEventName, domainEventHandler


  subscribeToDomainEvents: (domainEventHandlersObj) ->
    @subscribeToDomainEvent domainEventName, handlerFn for domainEventName, handlerFn of domainEventHandlersObj


  # TODO: Remove this when stream subscriptions are implemented
  subscribeToDomainEventWithAggregateId: (domainEventName, aggregateId, handlerFn) ->
    domainEventHandler = => handlerFn.apply @_di, arguments
    @_eventBus.subscribeToDomainEventWithAggregateId domainEventName, aggregateId, domainEventHandler


  addProjection: (projectionName, ProjectionClass) ->
    @_projectionClasses[projectionName] = ProjectionClass
    @


  addProjections: (viewsObj) ->
    @addProjection projectionName, ProjectionClass for projectionName, ProjectionClass of viewsObj
    @


  getProjectionInstance: (projectionId) ->
    @projectionService.getInstance projectionId


  destroyProjectionInstance: (projectionId) ->
    @projectionService.destroyInstance projectionId, @


  initialize: ->
    logger.debug "[#{@name}] Initializing"
    logger.debug "[#{@name}] Initializing Store"
    @_initializeStores()
    .then =>
      logger.debug "[#{@name}] Finished initializing Store"
      logger.debug "[#{@name}] Initializing Projections"
      @_initializeProjections()
    .then =>
      logger.debug "[#{@name}] Finished initializing Projections"
      logger.debug "[#{@name}] Finished initializing"
      @_isInitialized = true


  _initializeStores: ->
    stores = []
    for storeName, store of (@_eventric.defaults @_storeClasses, @_eventric.getStores())
      stores.push
        name: storeName
        Class: store.Class
        options: store.options

    initializeStoresPromise = Promise.resolve()
    stores.forEach (store) =>
      logger.debug "[#{@name}] Initializing Store #{store.name}"
      @_storeInstances[store.name] = new store.Class

      initializeStoresPromise = initializeStoresPromise.then =>
        @_storeInstances[store.name].initialize @, store.options
      .then =>
        logger.debug "[#{@name}] Finished initializing Store #{store.name}"

    return initializeStoresPromise


  _initializeProjections: ->
    initializeProjectionsPromise = Promise.resolve()
    for projectionName, ProjectionClass of @_projectionClasses
      logger.debug "[#{@name}] Initializing Projection #{projectionName}"

      initializeProjectionsPromise = initializeProjectionsPromise.then =>
        @projectionService.initializeInstance projectionName, ProjectionClass, {}
      .then (projectionId) =>
        logger.debug "[#{@name}] Finished initializing Projection #{projectionName}"

    return initializeProjectionsPromise


  createDomainEvent: (domainEventName, DomainEventClass, domainEventPayload, aggregate) ->
    payload = {}
    DomainEventClass.apply payload, [domainEventPayload]

    new DomainEvent
      id: eventric.generateUid()
      name: domainEventName
      aggregate: aggregate
      context: @name
      payload: payload


  initializeProjectionInstance: (projectionName, params) ->
    if not @_projectionClasses[projectionName]
      return Promise.reject new Error "Given projection #{projectionName} not registered on context"

    @projectionService.initializeInstance projectionName, @_projectionClasses[projectionName], params


  getProjection: (projectionId) ->
    @projectionService.getInstance projectionId


  # TODO: Rename to getDomainEventClass
  getDomainEvent: (domainEventName) ->
    @_domainEventClasses[domainEventName]


  # TODO: DomainEventStore? - It is responsible for the projections too!
  getDomainEventsStore: ->
    storeName = @get 'default domain events store'
    @_storeInstances[storeName]


  getEventBus: ->
    @_eventBus


  # TODO: Remove this when stream subscriptions are implemented
  findDomainEventsByName: (findArguments...) ->
    new Promise (resolve, reject) =>
      @getDomainEventsStore().findDomainEventsByName findArguments..., (err, events) ->
        return reject err if err
        resolve events


  # TODO: Remove this when stream subscriptions are implemented
  findDomainEventsByNameAndAggregateId: (findArguments...) ->
    new Promise (resolve, reject) =>
      @getDomainEventsStore().findDomainEventsByNameAndAggregateId findArguments..., (err, events) ->
        return reject err if err
        resolve events


  getProjectionStore: (storeName, projectionName) =>
    if not @_storeInstances[storeName]
      return Promise.reject new Error "Requested Store with name #{storeName} not found"

    @_storeInstances[storeName].getProjectionStore projectionName


  clearProjectionStore: (storeName, projectionName) =>
    if not @_storeInstances[storeName]
      return Promise.reject new Error "Requested Store with name #{storeName} not found"

    @_storeInstances[storeName].clearProjectionStore projectionName


  command: (commandName, params) ->
    if @_isDestroyed
      Promise.reject new Error """
        Context #{@name} was destroyed, cannot execute command #{commandName} with arguments #{JSON.stringify(params)}
      """
      return

    executingCommand = new Promise (resolve, reject) =>
      @_verifyContextIsInitialized commandName

      if not @_commandHandlers[commandName]
        throw new Error "Given command #{commandName} not registered on context"

      commandServicesToInject = @_getCommandServicesToInject()

      Promise.resolve @_commandHandlers[commandName].apply commandServicesToInject, [params]
      .then (result) =>
        logger.debug 'Completed Command', commandName
        resolve result
      .catch reject

    @_addPendingPromise executingCommand

    return executingCommand


  _getCommandServicesToInject: ->
    servicesToInject = {}
    for diFnName, diFn of @_di
      servicesToInject[diFnName] = diFn

    servicesToInject.$aggregate =
      create: (aggregateName, aggregateParams...) =>
        aggregateRepository = @_getAggregateRepository aggregateName
        aggregateRepository.create aggregateParams...

      load: (aggregateName, aggregateId) =>
        aggregateRepository = @_getAggregateRepository aggregateName
        aggregateRepository.load aggregateId

    return servicesToInject


  _getAggregateRepository: (aggregateName) =>
    aggregateRepositoriesCache = {} if not aggregateRepositoriesCache
    if not aggregateRepositoriesCache[aggregateName]
      AggregateClass = @_aggregateClasses[aggregateName]
      aggregateRepository = new AggregateRepository
        aggregateName: aggregateName
        AggregateClass: AggregateClass
        context: @
      aggregateRepositoriesCache[aggregateName] = aggregateRepository

    aggregateRepositoriesCache[aggregateName]


  _addPendingPromise: (pendingPromise) ->
    alwaysResolvingPromise = pendingPromise.catch ->
    @_pendingPromises.push alwaysResolvingPromise
    alwaysResolvingPromise.then =>
      @_pendingPromises.splice @_pendingPromises.indexOf(alwaysResolvingPromise), 1


  query: (queryName, params) ->
    new Promise (resolve, reject) =>
      logger.debug 'Got Query', queryName

      @_verifyContextIsInitialized queryName

      if not @_queryHandlers[queryName]
        reject new Error "Given query #{queryName} not registered on context"
        return

      Promise.resolve @_queryHandlers[queryName].apply @_di, [params]
      .then (result) =>
        logger.debug "Completed Query #{queryName} with Result #{result}"
        resolve result
      .catch reject


  _verifyContextIsInitialized: (methodName) ->
    if not @_isInitialized
      throw new Error "Context #{@name} not initialized yet, cannot execute #{methodName}"


  destroy: ->
    Promise.all(@_pendingPromises).then =>
      @_eventBus.destroy().then =>
        @_isDestroyed = true


module.exports = Context
