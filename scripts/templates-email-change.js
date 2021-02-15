const migrate = async () => {
  documentServices.initAutosave({ enabled: false })

  const documentData = boltInstance.$model.data.document_data
  const originalEmail = 'info@my-domain.com'
  const newEmail = 'info@mysite.com'
  const nodes = _.filter(documentData, item => _.includes(item.text, originalEmail))
  const ids = _.map(nodes, item => ({id: item.id, originalItem: item}))
  const modifiedIds = _.map(ids, item => {
    const modifiedOriginalItem = Object.assign({}, item.originalItem)
    modifiedOriginalItem.text = _.replace(item.originalItem.text, originalEmail, newEmail)
    return {id: item.id, originalItem: modifiedOriginalItem}
  })
  const structure = boltInstance.$model.structure
  modifiedIds.forEach(itemToChange => {
    const component = _(structure).filter(possibleComponent => _.includes(possibleComponent.dataQuery, itemToChange.id)).head()
    documentServices.components.data.update({id: component.id, type:'DESKTOP'}, itemToChange.originalItem)
  })

  documentServices.initAutosave({ enabled: true })
}
migrate()
  .then((response) => {
    window.autopilot.reportResult('Emails was successfully changed')
  })
  .catch((e) => {
    window.autopilot.reportError('Failed to change emails '+e.message)
  })