/*
  * There are 3 stages of dots:
  - Default : grey
  - Filled : blue
  - Active: black

  * When creating dot array go:
    [
      {
        ! check if dot is active, filled or default in the passed string like this
        active: `${currentPage === 2 ? "active" : currentPage === 3 ? "filled" : ""},
        ! usually set the page according to the number of the dot
        clickFn: () => setCurrentPage(2)
      }
    ]

*/

import { FC } from 'react'

const WithDots: FC<{
  section?: string
  title?: string
  dots?: Array<any>
}> = ({ section, title, dots }) => {
  return (
    <>
      <h2 className='layoutHeader__section'>{section}</h2>
      <h1 className='layoutHeader__title'>{title}</h1>
      <div className='layoutHeader__navigation'>
        {dots?.map((dot: any, key: number) => (
          <div
            key={key}
            className={`layoutHeader__navigation__dot layoutHeader__navigation__dot--${dot.active}`}
            onClick={dot.clickFn}
          />
        ))}
      </div>
    </>
  )
}

export default WithDots
