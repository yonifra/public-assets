let { componentId, maxIterationsForLastSaved, maxIterationsForPublished } = window.autopilot.payload
let { iterationNumber, isPublishedRevision } = window.autopilot

const migrate = async () => {
    const pointer = { id: componentId, type: 'DESKTOP' }

    const data = documentServices.components.data.get(pointer).text
    iterationNumber = parseInt(data[data.length - 6])

    documentServices.components.data.update(pointer, { text: `<h3 class="font_5">${isPublishedRevision ? 'Published' : 'Last Saved'}: ${iterationNumber}</h3>` })
}

migrate()
    .then(response => {
        const shouldReiterate = isPublishedRevision ? iterationNumber < maxIterationsForPublished : iterationNumber < maxIterationsForLastSaved
		window.autopilot.reportResult(`Site was successfully migrated! (iteration #${iterationNumber})`, {reiterate: shouldReiterate})
	})
	.catch(e=> {
		window.autopilot.reportError(`Failed to run site with iterations, reason: ${e.message}`)
	})
