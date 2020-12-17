const dsIframe =
    document.getElementById('preview') ||
      document.getElementsByClassName('preview')[0] ||
      document.getElementsByName('preview-frame')[0] ||
      document.getElementsByTagName('iframe')[0];

const documentServices = window.documentServices || dsIframe.contentWindow.documentServices

let pagesCounter = 0

const getProgressData = (progress) => {
  const progressUpdates = {
    init: () => ({totalPagesToMigrate: progress.maxValue }),
    done: () => ({ isDone: true }),
    'view-mode': () => ({ viewMode: progress.viewMode }),
    'page-migrated': () => ({pagesCounter: pagesCounter++})
  };

  return progressUpdates[progress.status] ? progressUpdates[progress.status]() : null;
};

const onSuccess = () => {
    console.log('migration success')
    //need to publish the site
};

const onReject = (error) => {
    // the cancel will throw error as well
    console.error('migration failed', error)
    //need to return to the first revision before the migration
};

const updateMigrationProgressCallback = (progress = {}) => {
  if (_.isEmpty(progress)) {
    return;
  }

  const progressData = getProgressData(progress);

  if (progressData) {
      console.log('migration in progress', progressData)

    if (progressData.pagesCounter > 20){
      documentServices.site.cancelSiteToMeshMigration()
      // should call save
      // should refresh the editor
    }
  }
}

documentServices.site.migrateSiteToMesh(onSuccess, onReject, {updateCallback: updateMigrationProgressCallback})