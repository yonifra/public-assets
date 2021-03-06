let pagesCounter = 0
let reiterate = false

// const getProgressData = (progress) => {
// 	const progressUpdates = {
// 		init: () => {},
// 		done: () => {},
// 		'view-mode': () => ({ viewMode: progress.viewMode }),
// 		'page-migrated': () => ({pagesCounter: pagesCounter++})
// 	};

// 	return progressUpdates[progress.status] ? progressUpdates[progress.status]() : null;
// };

// const updateMigrationProgressCallback = (progress = {}) => {
//   if (_.isEmpty(progress)) {
//     return;
//   }

//   const progressData = getProgressData(progress);
//   if (progressData) {
//     console.log('migration in progress', progressData)
//     if (progressData.pagesCounter > window.autopilot.payload.pagesToProccess){
//       documentServices.site.cancelSiteToMeshMigration()
//       // should call save
//       // should refresh the editor
//     }
//   }
// }

const migrate = async () => {
	console.log('before')
	documentServices.initAutosave({ enabled: false })
	await new Promise((resolve, reject) => {
		documentServices.site.migrateSiteToMesh(
			() => {
				// Migration succeeded
				resolve()
			},
			(e) => {
				// Migration failed
				reject(e.message)
			},
			{
				updateCallback: (progress = {}) => {
					if (_.isEmpty(progress)) {
						return
					}

					switch (progress.status) {
						case 'init':
							window.autopilot.log(`initializing migration with ${window.autopilot.payload.pagesToProccess} pages to process per iteration`)
							break
						case 'view-mode':
							break
						case 'page-migrated':
							pagesCounter++

							window.autopilot.log(`callback, migrated page ${pagesCounter}`)
							if (pagesCounter > window.autopilot.payload.pagesToProccess) {
								window.autopilot.log(`${pagesCounter} pages migrated, reiterating...`)
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
