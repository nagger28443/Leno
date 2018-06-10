import React from 'react'
import { Icon } from 'antd'
import injectSheet from 'react-jss'

const styles = {
  searchBox: {
    width: '2rem',
    overflow: 'hidden',
    '&:hover': {
      width: '100%',
    },
  },
}

const handleSearch = e => {
  console.log(e.target.text)
}

const SearchBox = ({ classes }) => (
  <div className={classes.searchBox}>
    <Icon type="search" />
    <input
      // className={classes.SearchBox}
      type="text"
      placeholder="Press enter to search"
      onKeyPress={handleSearch}
    />
  </div>
)

export default injectSheet(styles)(SearchBox)

// line-height: 1.8rem;
// width: 80%;
