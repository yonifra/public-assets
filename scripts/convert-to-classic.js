
try {
	window.autopilot.log('start script')
	window.autopilot.log('end script')
	window.autopilot.reportResult(`Site title is: ${window.rendererModel.siteInfo.siteTitleSEO}`)
} catch (e) {
	window.autopilot.reportError(e)
}
