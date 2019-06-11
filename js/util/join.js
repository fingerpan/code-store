

export function join(joinFn, fn1, fn2) {
    return (...args) => joinFn(fn1(...args), fn2(...args))
}
