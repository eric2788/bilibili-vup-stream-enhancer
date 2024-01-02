
import loadContextMenus from './context-menus'




Promise.all([
    loadContextMenus()
]).catch((error: Error) => {
    console.error('initialize error: ', error.message ?? error)
    console.error(error)
})