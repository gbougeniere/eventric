_        = require 'underscore'
eventric = require 'eventric'

AggregateEntity           = eventric 'AggregateEntity'
AggregateEntityCollection = eventric 'AggregateEntityCollection'
MixinSnapshot             = eventric 'MixinSnapshot'
MixinSetGet               = eventric 'MixinSetGet'

class AggregateRoot extends AggregateEntity

  _.extend @prototype, MixinSnapshot::
  _.extend @prototype, MixinSetGet::

  constructor: ->
    @_domainEvents = []
    super

  generateDomainEvent: (eventName, params={}) ->

    params.includeAggregateChanges = true unless params.includeAggregateChanges is false

    event =
      name: eventName
      aggregate: @getMetaData()

    if params.includeAggregateChanges
      changes = @getChanges()
      if Object.keys(changes).length > 0
        event.aggregate.changed = changes

    # TODO return error if DomainEvent is empty (no changes, no payload)

    @_domainEvents.push event

  getDomainEvents: ->
    @_domainEvents


module.exports = AggregateRoot