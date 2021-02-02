// if (typeof window.autopilot === 'undefined') {
// 	window.autopilot = {}
// 	window.autopilot.payload = {
// 		pagesToProccess: 100
// 	}
// 	window.autopilot.reportResult = (response) => {
// 		console.log('DONE, response is:', response)
// 	}
// 	window.autopilot.reportError = (error) => {
// 		console.error('FAILED', e)
// 	}
// }

let pagesCounter = 0

const migrate = async () => {
	console.log('before')
	documentServices.initAutosave({enabled: false})
	await new Promise((resolve, reject) => {
		documentServices.site.migrateSiteToMesh(() => {
			resolve()
		}, () => {
			reject()
		}, {
			updateCallback: (progress = {}) => {
				if (_.isEmpty(progress)) {
					return
				}

				switch (progress.status) {
					case 'init':

					break;
					case 'view-mode':

					break;
					case 'page-migrated':
						pagesCounter++

						if (pagesCounter > window.autopilot.payload.pagesToProccess) {
							documentServices.site.cancelSiteToMeshMigration()
							resolve() // todo: check if dont is not called
						}
					break;
					case 'done':
						resolve()
					break;
				}

				// const progressUpdates = {
				// 	init: () => ({totalPagesToMigrate: progress.maxValue }),
				// 	done: () => {
				// 		console.log('Done!')
				// 		resolve()
				// 	},
				// 	'view-mode': () => ({ viewMode: progress.viewMode }),
				// 	'page-migrated': () => ({pagesCounter: pagesCounter++})
				// }

				// return progressUpdates[progress.status] ? progressUpdates[progress.status]() : null

			}
		})
	})
	documentServices.initAutosave({ enabled: true })


	console.log('after')
}


migrate()
	.then(response => {
		window.autopilot.reportResult('Site was successfully migrated to MESH')
	})
	.catch(e=> {
		window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
	})
