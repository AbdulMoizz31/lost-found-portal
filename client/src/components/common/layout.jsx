import React from 'react'
import NavMenu from './navBar'
export const Layout = (props) => {
  return (
    <>
    <NavMenu/>
    {props.children}
    </>
  )
}
