export const storeData = async (key, value) => {
    try {
        await localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.log("error to store local storage ", e)
    }
}

export const getData = async (key) => {
    try {
        const value = await localStorage.getItem(key)
        if (value !== null) {
            return JSON.stringify(value)
        }
    } catch (e) {
        console.log("error get local storage ", e)
    }
}

export const removeData = async (key) => {
    try {
        await localStorage.removeItem(key)
    } catch (e) {
        console.log("error remove local storage ", e)
    }
}