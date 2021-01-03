import { app, BrowserWindow, Notification, session } from 'electron'

const libraryUrl = 'https://app.pluralsight.com/library/'

let win: BrowserWindow

let createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })

    session.defaultSession.webRequest.onCompleted(
        { urls: ['.*/library/'] },
        (details) => {

        }
    )

    win.maximize()
    win.show()
    win.loadURL(libraryUrl)

}

let saveCookie = () => {
    console.log(win.webContents.session.cookies)
}

// let showNotification = () => {
//     const notification = {
//         title: 'Basic Notification',
//         body: 'Notification from the Main process'
//     }
//     new Notification(notification).show()
// }

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(createWindow)
