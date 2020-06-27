import './style.scss'
import * as d3 from 'd3'
import _data from './data/data.json'

// data
////////////////////////////////////////////////
console.log('original data length: ', _data.length)

let data = _data.filter(el => {
  return (
    el.pl_name !== null &&
    el.pl_radj !== null &&
    el.st_dist !== null &&
    el.pl_orbper !== null &&
    el.pl_bmassj !== null
    // el.pl_bmassj > 0.03 &&
    // el.pl_bmassj < 3
  )
})

console.log('computed data length: ', data.length)

const max_distance = d3.max(data, function(d) {
  return d.pl_radj
})
const min_distance = d3.min(data, function(d) {
  return d.pl_radj
})
const max_radius = d3.max(data, function(d) {
  return d.pl_radj
})
const min_radius = d3.min(data, function(d) {
  return d.pl_radj
})

console.log('max distance: ', max_distance)
console.log('min distance: ', min_distance)
console.log('max radius: ', max_radius)
console.log('min radius: ', min_radius)

console.log(data.length)

// data = data.sort((a, b) => a.pl_bmassj - b.pl_bmassj)
// console.log(data)

// const max_mass = d3.max(data, function(d) {
//   return d.pl_bmassj
// })
// console.log(max_mass)
////////////////////////////////////////////////

// compute width & height
////////////////////////////////////////////////
let { width, height } = document
  .querySelector('.container')
  .getBoundingClientRect()

width = Math.round(width)
height = Math.round(height)

console.log('width: ', width, 'px')
console.log('height: ', height, 'px')

const pixToCm = value => {
  const dpi = 300
  const ratio = 2.54 / dpi
  return Math.round(value * ratio)
}

console.log('width: ', pixToCm(width), 'cm')
console.log('height: ', pixToCm(height), 'cm')
////////////////////////////////////////////////

const rScale = pixToCm(width) / 50
console.log('rScale: ', rScale)
const opacity = 1

const margin = {
  top: 0,
  bottom: 0,
  right: width / 100,
  left: width / 100
}

let svg = d3
  .select('.container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

let _width = +svg.attr('width') - margin.left - margin.right,
  _height = +svg.attr('height') - margin.top - margin.bottom

const init = data => {
  let xScale = d3
    .scaleLinear()
    .range([0, _width])
    .domain(
      d3.extent(data, function(d) {
        return d.pl_radj
      })
    )

  svg
    .append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', _width)
    .attr('height', _height)

  let g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(d.pl_radj)
    })
    .attr('cy', function(d) {
      return _height * Math.random()
    })
    .attr('r', function(d) {
      // return Math.pow(d.pl_radj, rScale)
      return 3
    })
    .style('fill', 'none')
    .style('opacity', opacity)
    .style('stroke', '#fff')
    .style('stroke-width', 1)
}

init(data)

// keyboard events
window.addEventListener('keydown', event => {
  event.preventDefault()
  // right
  if (event.keyCode === 39) {
    window.scrollTo(width, 0)
  }
  // left
  if (event.keyCode === 37) {
    window.scrollTo(0, 0)
  }
  // space to save pdf
  if (event.keyCode === 32) {
    download()
    console.log('download svg!')
  }
})

const target = document.querySelector('.container svg')
const dataURL = svgDataURL(target)

// svg to data URL
function svgDataURL(svg) {
  var svgAsXML = new XMLSerializer().serializeToString(svg)
  return 'data:image/svg+xml,' + encodeURIComponent(svgAsXML)
}

// download svg
function download() {
  const dl = document.createElement('a')
  dl.setAttribute('href', dataURL)
  dl.setAttribute(
    'download',
    `ea(${width}x${height}pixel/${pixToCm(width)}x${pixToCm(height)}cm).svg`
  )
  dl.click()
}
