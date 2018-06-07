import React from 'react'
import article from '../../blogs/1.md'

const TAGS = {
  h: Symbol('h'),
  ul: Symbol('ul'),
  ol: Symbol('ol'),
  quote: Symbol('quote'),
  nest: Symbol('nest'),
  thinLine: Symbol('thinLine'),
  thickLine: Symbol('thickLine'),
  codeBlockQuote: Symbol('codeBlockQuote'),
  codeBlockTab: Symbol('codeBlockTab'),
  p: Symbol('p'),
  empty: Symbol('empty'),
}

const hRegex = /^ {0,3}(#+)\s+/
const ulRegex = /^( *)- (.*)/
const olRegex = /^( *)\d\. (.*)/
const quoteRegex = /^( *)(>+)(.*)/
const nestBlockRegex = /^ *((- )|(\d\. )|>)/
const codeBlockQuoteRegex = /^ *`{3,}\s*$/
const codeBlockTabRegex = /^ {4,}/
const thinLineRegex = /^ {0,3}-{3,}\s*$/
const thickLineRegex = /^ {0,3}\*{3,}\s?$/
const pRegex = /^ {0,3}[^\s]+/

function devideIntoBlocks(md) {
  let lastTag = null
  const blocks = []

  function mergeBlock(line, curTag) {
    if (lastTag === curTag) {
      blocks[blocks.length - 1].content.push(line)
    } else {
      blocks.push({ tag: curTag, content: [line] })
    }
    lastTag = curTag
  }

  function getBlock(line) {
    switch (true) {
      case codeBlockQuoteRegex.test(line):
        if (lastTag !== TAGS.codeBlockQuote) {
          mergeBlock(line, TAGS.codeBlockQuote)
        } else {
          blocks[blocks.length - 1].content.push(line)
          lastTag = null
        }
        break
      case lastTag === TAGS.codeBlockQuote:
        blocks[blocks.length - 1].content.push(line)
        break
      case hRegex.test(line):
        blocks.push({ tag: TAGS.h, content: [line] })
        lastTag = null
        break

      case thinLineRegex.test(line):
        blocks.push({ tag: TAGS.thinLine, content: [line] })
        lastTag = null
        break
      case thickLineRegex.test(line):
        blocks.push({ tag: TAGS.thickLine, content: [line] })
        lastTag = null
        break

      case nestBlockRegex.test(line):
        mergeBlock(line, TAGS.nest)
        break

      case pRegex.test(line):
        mergeBlock(line, TAGS.p)
        break

      case codeBlockTabRegex.test(line) || lastTag === TAGS.codeBlockTab:
        mergeBlock(line, TAGS.codeBlockTab)
        break
      case lastTag === TAGS.codeBlockTab:
        blocks[blocks.length - 1].content.push(line)
        break

      default:
        lastTag = null
        break
    }
  }

  md.split('\n').forEach(getBlock)

  return blocks
}

function handleNestedBlock(content) {
  const tagStack = []
  let lastIndent = 0
  let res = null
  return (
    content
      .map(line => {
        let tmp = ''
        let tag
        if ((res = ulRegex.exec(line))) {
          tag = 'ul'
        } else if ((res = olRegex.exec(line))) {
          tag = 'ol'
        }
        console.log(res)

        if (res[1].length < lastIndent) {
          while (res[1].length < lastIndent) {
            tmp += `</${tagStack.pop()}>`
            lastIndent -= 2
          }
          tmp = `<li>${res[2]}</li>`
        } else if (res[1].length === lastIndent + 2 || tagStack.length === 0) {
          tagStack.push(tag)
          tmp = `<${tag}><li>${res[2]}</li>`
        } else if (res[1].length > lastIndent + 2) {
          tmp = `${res[2]}`
        } else if (res[1].length === lastIndent) {
          tmp = `<li>${res[2]}</li>`
        }

        lastIndent = res[1].length
        return tmp
      })
      .join('') + tagStack.map(tag => `</${tag}>`).join('')
  )
}
function handleBI(content) {
  return content
    .replace(/\*{3}(?!\*)(.*?)\*{3}/g, '<strong><i>$1</i></strong>')
    .replace(/\*{2}(?!\*)(.*?)\*{2}/g, '<strong>$1</strong>')
    .replace(/\*(?!\*)(.*?)\*/g, '<i>$1</i>')
}
function generateJSX(block) {
  let res
  let text
  let Tag
  const { content, tag } = block
  switch (tag) {
    case TAGS.h:
      res = hRegex.exec(content[0])
      Tag = `h${res[1].length}`
      text = content[0].slice(res[0].length)
      return <Tag dangerouslySetInnerHTML={{ __html: handleBI(text) }} />
    case TAGS.codeBlockQuote:
      let len = content.length
      if (codeBlockQuoteRegex.test(content[len - 1])) --len
      text = content.slice(1, len).join('\n')
      return <pre className="code-block-quote">{text}</pre>
    case TAGS.codeBlockTab:
      return <pre className="code-block-tab">{content.join('\n')}</pre>
    case TAGS.thinLine:
      return <hr className="thin-line" />
    case TAGS.thickLine:
      return <hr className="thick-line" /> // 段落处理?标题内处理?
    case TAGS.nest:
      return <div dangerouslySetInnerHTML={{ __html: handleNestedBlock(content) }} />
    default:
      return <p dangerouslySetInnerHTML={{ __html: handleBI(content.join('')) }} />
  }
}
function MDParser(md) {
  const blocks = devideIntoBlocks(md)
  const jsx = blocks.map(generateJSX)
  console.log(jsx)
  return jsx
}

export default class Blog extends React.Component {
  handl = () => {}
  render() {
    // console.log(article);
    return <article className="contents">{MDParser(article)}</article>
  }
}
