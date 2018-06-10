import React from 'react'
import injectSheet from 'react-jss'
import { inject, observer } from 'mobx-react'
import article from '../../blogs/1.md'
import MDParser from '../../util/MDParser'

const styles = {
  article: {
    background: '#ffffff',
    wordBreak: 'break-word',
    padding: ['2rem', '5%', '6rem', '5%'],
    position: 'relative',
    '&:after': {
      width: '100%',
      height: '4rem',
      background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
      content: '""',
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  },
}

const Blog = inject('appStore')(
  observer(({ classes }) => <article className={classes.article}>{MDParser(article)}</article>),
)

export default injectSheet(styles)(Blog)
