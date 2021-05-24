import { mergeObject } from 'utils'
type TagsMap = (string)[] | (keyof HTMLElementDeprecatedTagNameMap | keyof HTMLElementTagNameMap)[]
export interface IHTMLSerializationOptions {
  /**
   * HTML encode tags, `<` `>` etc. will replace.
   */
  encodeTags: TagsMap
  // whitelist: boolean
  /**
  * Skip html tags, skiped tag will serializate nothing.
  */
  skipTags: TagsMap
  /**
   * encode `href` attr, eg. src="javascript:"
   */
  encodeAttr: boolean
}

export const HTMLSerializationDefaultOptions: IHTMLSerializationOptions = {
  encodeTags: ['script'],
  // whitelist: false,
  skipTags: [],
  encodeAttr: true
}
export function HTMLFilter(node: HTMLElement, options: Partial<IHTMLSerializationOptions> = HTMLSerializationDefaultOptions) {
  options = mergeObject(HTMLSerializationDefaultOptions, options)
  const { encodeTags, skipTags, encodeAttr } = options as IHTMLSerializationOptions

  // @ts-ignore
  const $node: typeof node = node.cloneNode(true)

  // handle encodeTags
  encodeTags.length && $node.querySelectorAll(encodeTags.join(',')).forEach(el => {
    const newEl = document.createTextNode(el.innerHTML)
    el.replaceWith(newEl)
  })

  // handle skipTags 
  skipTags.length && $node.querySelectorAll(skipTags.join(',')).forEach(el => {

    el.outerHTML = ''
  })


  encodeAttr && $node.querySelectorAll('[href]').forEach(el => {
    const href = el.getAttribute('href')
    if (href) {
      el.setAttribute('href', href.replace(/^javascript:/, ''))
    }
  })

  return $node
}

export function HTMLSerialization(node: HTMLElement, options: Partial<IHTMLSerializationOptions> = HTMLSerializationDefaultOptions) {
  return HTMLFilter(node, options).innerHTML
}

export interface IHTMLDeserializationOptions extends IHTMLSerializationOptions {

}

export const HTMLDeserializationDefaultOptions: IHTMLDeserializationOptions = {
  encodeAttr: true, encodeTags: ["script"], skipTags: []
}

export function HTMLStringFilter(htmlString: string, options: Partial<IHTMLDeserializationOptions> = HTMLDeserializationDefaultOptions) {
  options = mergeObject(HTMLDeserialization, options)

  const fg = HTMLDeserialization(htmlString, options)
  const root = document.createElement('div')
  root.append(fg)
  return root.innerHTML

}

export function HTMLDeserialization(htmlString: string, options: Partial<IHTMLDeserializationOptions> = HTMLDeserializationDefaultOptions) {
  options = mergeObject(HTMLDeserialization, options)

  const { ...rest } = options as IHTMLDeserializationOptions
  const domParser = new DOMParser()
  const node = domParser.parseFromString(htmlString, 'text/html')
  const newNode = HTMLFilter(node.body, rest)
  const root = document.createDocumentFragment()

  root.append(...newNode.childNodes)
  return root
}