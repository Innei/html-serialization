import { HTMLFilter, HTMLDeserialization, HTMLStringFilter } from '~'

const $app = document.getElementById('app')!
const template = `<div><script>document.write('xss')</script></div><a href="javascript:;" ></a>`
$app.innerHTML = template


$app.replaceWith(HTMLFilter($app, { skipTags: ['script'], encodeTags: [] }))

console.log(HTMLDeserialization(template))


console.log(HTMLStringFilter(template))