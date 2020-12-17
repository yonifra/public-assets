
try {
    window.autopilot.log('start script')

    const isPublished = window.autopilot.isPublishedRevision

    window.autopilot.log('end script')

    window.autopilot.reportResult(`This was a simple ADI to Classic migration on the ${isPublished ? 'published' : 'last saved'} revision`)
} catch (e) {
    window.autopilot.reportError(e)
}
