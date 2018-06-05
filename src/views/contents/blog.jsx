import React from 'react';
import article from '../../blogs/1.md';

const blockRegexes = [/^ ?(#+)/];

function blockFormat(block) {
  blockRegexes.forEach((regex) => {
    const matches = regex.exec(block);
    console.log(matches);
  });
}
function devideIntoBlocks(md) {
  return md.replace(/^ ?(?=#)/gm, '\n\n')
    .replace(/^-{3,}$/gm, '\n---\n')
    .replace(/\*{3,}$/gm, '\n***\n')
    .replace(/\n\s+\n/gm, '\n\n')
    .split(/\n\n/gm);
}

function MDParser(md) {
  const blocks = devideIntoBlocks(md);
  const jsx = blocks.map(block => blockFormat(block));
  console.log(blocks);
  console.log(jsx);

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
          I use the vector template in almost all my C++ software. Essentially,
          you can use it whenever you need a dynamic array. The title of my blog
          post is word play: please use vectors, but use them properly if you
          need speed!
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
        <p>
          R.call 可以用作 R.converge 的 convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。R.call 可以用作 R.converge 的
          convergeing
          函数：第一个分支函数生成函数，其余分支函数生成一系列值作为该函数的参数。（R.converge
          第二个参数为一个分支函数列表）。
        </p>
      </article>
    );
  }
}
