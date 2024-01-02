export async function fetchSameOrigin<T = any>(url: string): Promise<T> {
    const res = await fetch(url, { credentials: 'same-origin' })
    if (!res.ok){
        throw new Error(res.statusText)
    }
    const data = await res.json()
    if (data.code != 0){
        throw new Error(`B站API请求错误: ${data.message}`)
    }
    return data as T
}

async function getPageVariable(name: string, tabId: number): Promise<any> {
    const [{result}] = await chrome.scripting.executeScript({
      func: name => window[name],
      args: [name],
      target: {
        tabId: tabId ??
          (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
      },
      world: 'MAIN',
    });
    return result;
  }

