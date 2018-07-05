import React from 'react'
import FilterLink from '../containers/FilterLink'
import { LISTS } from '../actions'

const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filter={LISTS.ALL}>All</FilterLink>
    <FilterLink filter={LISTS.ACTIVE}>Active</FilterLink>
    <FilterLink filter={LISTS.COMPLETED}>Completed</FilterLink>
  </div>
)

export default Footer
