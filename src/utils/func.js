const strToFunc = (str, value) => {
    return new Function(value, `return ${str}`)();
}