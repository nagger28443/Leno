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
      case line.trim().length === 0:
        lastTag = null
        break
      case lastTag === TAGS.nest:
        const lastBlock = blocks[blocks.length - 1]
        lastBlock.content[lastBlock.content.length - 1] += ` ${line}`
        break
      case codeBlockTabRegex.test(line):
        mergeBlock(line, TAGS.codeBlockTab)
        break
      case pRegex.test(line):
        mergeBlock(line, TAGS.p)
        break

      default:
        lastTag = null
        break
    }
  }

  md.split('\n').forEach(getBlock)
  return blocks
}

function handleInline(content) {
  // bold & italic & link
  return content
    .replace(/\*{3}(?!\*)(.*?)\*{3}/, '<strong><i>$1</i></strong>')
    .replace(/\*{2}(?!\*)(.*?)\*{2}/, '<strong>$1</strong>')
    .replace(/\*(?!\*)(.*?)\*/, '<i>$1</i>')
    .replace(/<(https?:\/\/.*?)>/, '<a href="$1">$1</a>')
    .replace(/<(.+?@.+?\..+?)>/, '<a href="mailto:$1">$1</a>')
    .replace(/[\n\r]/, '')
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
        const deltLine = handleInline(line)
        if ((res = ulRegex.exec(deltLine))) {
          tag = 'ul'
        } else if ((res = olRegex.exec(deltLine))) {
          tag = 'ol'
        } else if ((res = quoteRegex.exec(deltLine))) {
          tag = `blockquote${res[2].length}`
        } else {
          return deltLine
        }

        const lastTag = tagStack[tagStack.length - 1]

        if (tag.includes('blockquote')) {
          if (lastTag === tag) {
            return `<br>${res[3]}`
          }
          if (!lastTag || !lastTag.includes('blockquote') || tag > lastTag) {
            tagStack.push(tag)
            return `<blockquote>${res[3]}`
          }
          if (tag === 'blockquote1') {
            return `<br>${res[3]}`
          }

          tagStack.pop()
          return `</blockquote>${res[3]}`
        } else if (lastTag && lastTag.includes('blockquote')) {
          while (tagStack.length > 0 && tagStack[tagStack.length - 1].includes('blockquote')) {
            tmp += '</blockquote>'
            tagStack.pop()
          }
        }

        if (res[1].length <= lastIndent) {
          while (res[1].length < lastIndent) {
            tmp += `</${tagStack.pop()}>`
            lastIndent -= 2
          }
          if (lastTag !== tag) {
            tmp += `</${tagStack.pop()}><${tag}>`
            tagStack.push(tag)
          }
          tmp += `<li>${res[2]}</li>`
        } else if (res[1].length === lastIndent + 2 || tagStack.length === 0) {
          tagStack.push(tag)
          tmp += `<${tag}><li>${res[2]}</li>`
        } else {
          tmp += `${res[2]}`
        }

        lastIndent = res[1].length
        return tmp
      })
      .join('') + tagStack.map(tag => `</${tag}>`).join('')
  )
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
      return <Tag dangerouslySetInnerHTML={{ __html: handleInline(text) }} />
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
    default: {
      return <p dangerouslySetInnerHTML={{ __html: handleInline(content.join('')) }} />
    }
  }
}
function MDParser(md) {
  return devideIntoBlocks(md).map(generateJSX)
}

export default class Blog extends React.Component {
  handl = () => {}
  render() {
    // console.log(article);
    return <article className="article">{MDParser(article)}</article>
  }
}
