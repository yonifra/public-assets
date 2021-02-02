let pagesCounter = 0
let reiterate = false

const migrate = async () => {
	console.log('before')
	documentServices.initAutosave({ enabled: false })
	await new Promise((resolve, reject) => {
		documentServices.site.migrateSiteToMesh(
			() => {
				resolve()
			},
			() => {
				reject()
			},
			{
				updateCallback: (progress = {}) => {
					if (_.isEmpty(progress)) {
						return
					}

					switch (progress.status) {
						case 'init':
							break
						case 'view-mode':
							break
						case 'page-migrated':
							pagesCounter++

							if (pagesCounter > window.autopilot.payload.pagesToProccess) {
								documentServices.site.cancelSiteToMeshMigration()
								reiterate = true

								resolve() // todo: check if dont is not called
							}
							break
						case 'done':
							resolve()
							break
					}
				},
			}
		)
	})
	documentServices.initAutosave({ enabled: true })

	console.log('after')
}

migrate()
	.then((response) => {
		window.autopilot.reportResult(`Site was successfully migrated to MESH ${reiterate ? '(iteration)' : '(full migration)'}`, {reiterate})
	})
	.catch((e) => {
		window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
	})
