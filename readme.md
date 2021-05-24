# HTML Serialization

测试库, XSS filter

```ts
const $app = document.getElementById('app')!
const template = `<div><script>document.write('xss')</script></div><a href="javascript:;" ></a>`
$app.innerHTML = template


$app.replaceWith(HTMLFilter($app, { skipTags: ['script'], encodeTags: [] }))

console.log(HTMLDeserialization(template))


console.log(HTMLStringFilter(template))
```