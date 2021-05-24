export const mergeObject = (o1: object, ...o: object[]) => {
  const newObj = { ...o1 }
  return o.reduce((obj, cur) => {

    return { ...newObj, ...cur }
  }, newObj)

}