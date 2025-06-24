export const removeParamFromUrl = (param: string) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(param)
    window.history.replaceState(window.history.state, "", url.toString())
}

export const removeFlowIdFromUrl = () => {
    removeParamFromUrl("flow")
}
