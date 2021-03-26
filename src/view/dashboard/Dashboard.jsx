import React, { useEffect } from 'react'
import { createHashHistory } from 'history'

export const Dashboard = (props) => {
  useEffect(() => {
    const history = createHashHistory()
    history.replace('/Dashboard')
  })

  return 'Dashboard'
}
