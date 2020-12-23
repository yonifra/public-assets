let pagesCounter = 0

const getProgressData = (progress) => {
	const progressUpdates = {
		init: () => ({totalPagesToMigrate: progress.maxValue }),
		done: () => ({ isDone: true }),
		'view-mode': () => ({ viewMode: progress.viewMode }),
		'page-migrated': () => ({pagesCounter: pagesCounter++})
	}

	return progressUpdates[progress.status] ? progressUpdates[progress.status]() : null
}

const onSuccess = () => {
	console.log('Mesh migration successfully done')
}

const onReject = (error) => {
	console.error('Mesh migration failed', error)
}

const updateMigrationProgressCallback = (progress = {}) => {
	if (_.isEmpty(progress)) {
		return
	}

	const progressData = getProgressData(progress)

	if (progressData) {
		console.log('migration in progress', progressData)

		if (progressData.pagesCounter > 100){
			documentServices.site.cancelSiteToMeshMigration()
		}
	}
}

const wait = async () => {
	await documentServices.SOQ.waitForChangesAppliedAsync()
}

try {
	window.autopilot.log('start script')

	window.autopilot.log('migrating site to mesh')

	documentServices.initAutosave({enabled: false})
	documentServices.site.migrateSiteToMesh(onSuccess, onReject, { isMigrationForced: false, updateCallback: updateMigrationProgressCallback })
	wait()

    window.autopilot.log('end script')

    window.autopilot.reportResult('Site was successfully migrated to MESH')
} catch (e) {
	window.autopilot.reportError(`Failed to migrate site to MESH ${e.message}`)
}