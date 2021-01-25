let {componentId} = window.autopilot.payload

const migrate = async () => {
    const pointer = { id: componentId, type: 'DESKTOP' }

    const data = documentServices.components.data.get(pointer).text
    const iterationNumber = parseInt(data[data.length - 6]);
    documentServices.components.data.update(pointer, {text: `<h3 class="font_5">${iterationNumber + 1}</h3>`})
}

migrate()
    .then(response => {
        const shouldReiterate = iterationNumber < 5
		window.autopilot.reportResult(`Site was successfully migrated to MESH (iteration #${iterationNumber})`, {reiterate: shouldReiterate})
	})
	.catch(e=> {
		window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
	})
