class Memoize {
  private func: Function
  private size: number
  private cache: Map<string, any>
  private cacheOrder: string[]

  constructor(func: Function, size: number) {
    this.func = func
    this.size = size
    this.cache = new Map()
    this.cacheOrder = []
  }

  getKey(...args: any[]): string {
    return JSON.stringify(args)
  }

  updateCacheOrder(key: string) {
    const index = this.cacheOrder.indexOf(key)
    if (index !== -1) {
      this.cacheOrder.splice(index, 1)
    }
    this.cacheOrder.unshift(key)
  }

  getFunction() {
    return (...args: any[]) => {
      const key = this.getKey(args)

      if (this.cache.has(key)) {
        this.updateCacheOrder(key)
        const result = this.cache.get(key)
        console.log('cache exist', result, this.cache, this.cacheOrder)
        return result
      }

      const result = this.func(...args)

      this.cache.set(key, result)
      this.cacheOrder.unshift(key)

      if (this.cacheOrder.length > this.size) {
        const oldestCache = this.cacheOrder.pop()
        this.cache.delete(oldestCache as string)
      }

      console.log('cache not exist', result, this.cache, this.cacheOrder)
      return result
    }
  }

  isEntryInCache(...args: any[]) {
    const key = this.getKey(args)
    return this.cache.has(key)
  }

  getValueFromCache(...args: any[]) {
    const key = this.getKey(args)
    return this.cache.get(key)
  }
}

function sum(a: number, b: number) {
  return a + b
}

const obj = new Memoize(sum, 3)
const memSum = obj.getFunction()
memSum(2, 3)
memSum(1, 4)
memSum(3, 5)
memSum(2, 3)
memSum(4, 5)

