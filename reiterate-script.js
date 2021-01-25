let { componentId, maxIterations } = window.autopilot.payload
let iterationNumber

const migrate = async () => {
    const pointer = { id: componentId, type: 'DESKTOP' }

    const data = documentServices.components.data.get(pointer).text
    iterationNumber = parseInt(data[data.length - 6]);

    if (iterationNumber === maxIterations) {
        documentServices.components.data.update(pointer, {text: '<h3 class="font_5">0</h3>'})
    } else {
        documentServices.components.data.update(pointer, {text: `<h3 class="font_5">${iterationNumber + 1}</h3>`})
    }
}

migrate()
    .then(response => {
        const shouldReiterate = iterationNumber < maxIterations
		window.autopilot.reportResult(`Site was successfully migrated to MESH (iteration #${iterationNumber})`, {reiterate: shouldReiterate})
	})
	.catch(e=> {
		window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
	})
