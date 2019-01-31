import React from 'react'
import ReactLoading from 'react-loading'

const Loading = ({ type, color, className }) => (
  <ReactLoading class={className} type={type} color={color} height={'20%'} width={'20%'} />
)

export default Loading
