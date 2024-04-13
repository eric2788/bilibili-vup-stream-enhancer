

function invokeLivePlayer(name: string, ...args: any[]): any {
  const self = window as any
    if (!self.$P2PLivePlayer) {
        console.warn('P2PLivePlayer not found')
        return undefined
    }
    return self.$P2PLivePlayer[name](...args)
}


export default invokeLivePlayer