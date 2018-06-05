import React from 'react'
import article from '../../blogs/1.md'

const TAGS = {
  h: Symbol('h'),
  ul: Symbol('ul'),
  ol: Symbol('ol'),
  quote: Symbol('quote'),
  codeBlock: Symbol('codeBlock'),
  thinLine: Symbol('thinLine'),
  thickLine: Symbol('thickLine'),
  empty: Symbol('empty'),
}

const hRegex = /^ {0,3}(#+) +/
const ulRegex = /^ {0,3}- /
const olRegex = /^ {0,3}\d. /
// const pRegex =  //default
const quoteRegex = /^ ?(>+)/
const codeBlockRegex = /^ {4,}|^\t/
const thinLineRegex = /^ {0,3}---/
const thickLineRegex = /^ {0,3}\*\*\*/
// const codeInline = //

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
      case codeBlockRegex.test(line):
        // todo
        break
      case hRegex.test(line):
        blocks.push({ tag: TAGS.h, content: [line] })
        lastTag = null
        break
      case ulRegex.test(line):
        mergeBlock(line, TAGS.ul)
        break
      case olRegex.test(line):
        mergeBlock(line, TAGS.ol)
        break
      case quoteRegex.test(line):
        mergeBlock(line, TAGS.quote)
        break
      case thinLineRegex.test(line):
        blocks.push({ tag: TAGS.thinLine, content: [line] })
        break
      case thickLineRegex.test(line):
        blocks.push({ tag: TAGS.thickLine, content: [line] })
        break
      default:
        // p
        break
    }
  }

  md.split('\n').forEach(getBlock)

  return blocks
  // return md
  //   .replace(/^ ?(?=#|-|>)/gm, '\n')
  //   .replace(/^-{3,}$/gm, '\n---\n')
  //   .replace(/\*{3,}$/gm, '\n***\n')
  //   .replace(/\n\s+\n/gm, '\n\n')
  //   .split(/\n{2,}/gm)
}
function generateJSX(block) {
  let res
  let content
  let Tag
  switch (true) {
    case !!(res = hRegex.exec(block)):
      Tag = `h${res[1].length}`
      content = res.input.slice(res[0].length)
      return <Tag>{content}</Tag>
    case !!(res = ulRegex.exec(block)):
      console.log(res)
      break
    case !!(res = olRegex.exec(block)):
      console.log(res)
      break
    case !!(res = quoteRegex.exec(block)):
      console.log(res)
      break
    case !!(res = codeBlockRegex.exec(block)):
      console.log(res)
      break
    case !!(res = thinLineRegex.exec(block)):
      console.log(res)
      break
    case !!(res = thickLineRegex.exec(block)):
      console.log(res)
      break

    default:
      // p
      break
  }
}
function MDParser(md) {
  const blocks = devideIntoBlocks(md)
  const jsx = blocks.map(generateJSX)
  console.log(blocks)
  console.log(jsx)

  // return blocks.map((line) => {

  // }).join('');
}

export default class Blog extends React.Component {
  handl = () => {}
  render() {
    // console.log(article);
    return (
      <article className="contents">
        {MDParser(article)}
        <header>Header 文章标题</header>
        <h1>Hhhhhhh1 段落标题</h1>
        <p>
          I use the vector template in almost all my C++ software. Essentially, you can use it
          whenever you need a dynamic array. The title of my blog post is word play: please use
          vectors, but use them properly if you need speed!
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
      </article>
    )
  }
}
