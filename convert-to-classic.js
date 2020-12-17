
try {
    window.autopilot.log('start script')

    const isPublished = window.autopilot.isPublishedRevision

    window.autopilot.log('end script')

    window.autopilot.reportResult(`This was a simple ADI to Classic migration on the ${isPublished ? 'published' : 'last saved'} revision`)
    window.autopilot.reportResult(`Site title is: ${rendererModel.siteInfo.siteTitleSEO}`)
} catch (e) {
    window.autopilot.reportError(e)
}
