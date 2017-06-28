'use strict'
import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'

export default function Danger(props) {
  const kind = props.kind
  const status = props.status

  return (
  {
    if (kind === 'fire' && status === 1) {
      return (
        <div>
          <SvgIcon {...props}>
            <path d="M165.494,533.333c-35.545-73.962-16.616-116.343,10.703-156.272c29.917-43.728,37.627-87.013,37.627-87.013   s23.518,30.573,14.11,78.39c41.548-46.25,49.389-119.938,43.115-148.159c93.914,65.63,134.051,207.737,79.96,313.054   c287.695-162.776,71.562-406.339,33.934-433.775c12.543,27.435,14.922,73.88-10.416,96.42C331.635,33.333,225.583,0,225.583,0   c12.543,83.877-45.466,175.596-101.404,244.13c-1.965-33.446-4.053-56.525-21.641-88.531   C98.59,216.357,52.157,265.884,39.583,326.76C22.551,409.2,52.341,469.562,165.494,533.333z" fill="#D80027"/>
          </SvgIcon>
        </div>
        )
    } else if (kind === 'smoke' && status === 1) {
      return (
        <div>
          <img 
          //https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web
            src="equilateral.svg" 
            alt="triangle with all three sides equal"
            height="87px"
            width="100px" />
        </div>
        )
    }
  }
    )
  }
}