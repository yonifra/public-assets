let iteration = window.autopilot.payload.iterationNumber

const migrate = async () => {
	console.log('before')
	documentServices.initAutosave({ enabled: false })
	documentServices.initAutosave({ enabled: true })
    console.log('after')
}

migrate()
    .then(response => {
        const shouldReiterate = iterationNumber < 5
		window.autopilot.reportResult(`Site was successfully migrated to MESH (iteration #${iterationNumber})`, {reiterate: shouldReiterate})
	})
	.catch(e=> {
		window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
	})
